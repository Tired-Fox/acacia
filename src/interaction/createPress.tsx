import {
    Accessor,
    useContext,
    createContext,
    createSignal,
    Setter,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { JSX } from 'solid-js/types/jsx';

export class PressEvent {
    type: 'key' | 'mouse' | 'touch';
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
    clientX: number;
    clientY: number;
    screenX: number;
    screenY: number;
    target: EventTarget | null;

    button?: number;
    key?: string;

    constructor(
        type: 'key' | 'mouse' | 'touch',
        rest?: {
            altKey?: boolean;
            ctrlKey?: boolean;
            shiftKey?: boolean;
            metaKey?: boolean;
            clientX?: number;
            clientY?: number;
            screenX?: number;
            screenY?: number;
            target?: EventTarget | null;

            button?: number;
            key?: string;
        },
    ) {
        this.type = type;
        rest = rest ?? ({} as any);
        this.altKey = rest?.altKey ?? false;
        this.ctrlKey = rest?.ctrlKey ?? false;
        this.metaKey = rest?.metaKey ?? false;
        this.shiftKey = rest?.shiftKey ?? false;
        this.clientX = rest?.clientX ?? 0;
        this.clientY = rest?.clientY ?? 0;
        this.screenX = rest?.screenX ?? 0;
        this.screenY = rest?.screenY ?? 0;
        this.target = rest?.target ?? null;

        this.button = rest?.button ?? 0;
        this.key = rest?.key;
    }
}

const keyboardPressed = (k: KeyboardEvent) => {
    return new PressEvent('key', {
        altKey: k.altKey,
        metaKey: k.metaKey,
        shiftKey: k.shiftKey,
        ctrlKey: k.ctrlKey,
        target: k.target,
        key: k.key,
    });
};

const mousePressed = (m: MouseEvent): PressEvent => {
    return new PressEvent('mouse', {
        altKey: m.altKey,
        ctrlKey: m.ctrlKey,
        metaKey: m.metaKey,
        shiftKey: m.shiftKey,
        clientX: m.clientX,
        clientY: m.clientY,
        screenX: m.screenX,
        screenY: m.screenY,
        target: m.target,
        button: m.button,
    });
};

const touchPressed = (t: TouchEvent): PressEvent => {
    const last = t.targetTouches[t.targetTouches.length];
    return new PressEvent('touch', {
        altKey: t.altKey,
        ctrlKey: t.ctrlKey,
        shiftKey: t.shiftKey,
        metaKey: t.metaKey,
        clientX: last.clientX,
        clientY: last.clientY,
        screenX: last.screenX,
        screenY: last.screenY,
        target: last.target,
    });
};

export type Interaction = {
    onClick: (m: MouseEvent) => void;
    onMouseDown: (m: MouseEvent) => void;
    onTouchStart: (t: TouchEvent) => void;
    onMouseUp: (m: MouseEvent) => void;
    onTouchEnd: (t: TouchEvent) => void;
    onKeyDown: (k: KeyboardEvent) => void;
};
type Events = [
    Interaction,
    { isPressed: Accessor<boolean>; setPressed: Setter<boolean> },
    () => { buttons: number[]; touches: number[] },
];

/*
    START: Event for start interaction
        - onmousedown
        - ontouchstart
    END: Event for end interaction
        - onmouseup
        - ontouchend
    CLICK: Interaction
        - onclick & onmouseup == onmousedown event
        - ontouchend == ontouchstart
    UP: Event for end interaction even when it wasn't started
        - onmouseup
        - ontouchend
*/

export const PressHandlerKeys = [
    'onPress',
    'onPressStart',
    'onPressEnd',
    'onPressUp',
    'onPressChange',
] as const;

export type StripEventHandlers =
    | 'onClick'
    | 'onMouseDown'
    | 'onMouseUp'
    | 'onTouchStart'
    | 'onTouchEnd';
export type PressHandlers = Omit<
    { [K in (typeof PressHandlerKeys)[number]]?: (e: PressEvent) => void },
    'onPressChange'
> & { onPressChange?: (isPressed: boolean) => void };
export type RequiredPressHandlers = {
    [P in keyof PressHandlers]-?: PressHandlers[P];
};

export function createPress(
    handlers: PressHandlers,
    options?: {
        keys?: string[];
        disabled?: boolean;
    },
): Events {
    const [isPressed, setPressed] = createSignal(false);
    const [pressState, setPressState] = createStore<{
        buttons: number[];
        touches: number[];
    }>({
        buttons: [],
        touches: [],
    });

    const contextHandlers = usePressContext();
    const pressHandlers: RequiredPressHandlers = {
        onPress: e => {
            handlers.onPress?.(e);
            contextHandlers?.onPress?.(e);
        },
        onPressStart: e => {
            handlers.onPressStart?.(e);
            contextHandlers?.onPressStart?.(e);
        },
        onPressEnd: e => {
            handlers.onPressEnd?.(e);
            contextHandlers?.onPressEnd?.(e);
        },
        onPressUp: e => {
            handlers.onPressUp?.(e);
            contextHandlers?.onPressUp?.(e);
        },
        onPressChange: (_v: boolean) => {
            handlers.onPressChange?.(_v);
            contextHandlers?.onPressChange?.(_v);
        },
    };

    const changePressed = () => {
        if (options?.disabled !== true) {
            setPressed(!isPressed());
            pressHandlers.onPressChange(isPressed());
        }
    };

    return [
        {
            //! PRESS START
            onMouseDown: (me: MouseEvent) => {
                if (options?.disabled !== true) {
                    if (!pressState.buttons.includes(me.button)) {
                        setPressState(
                            'buttons',
                            pressState.buttons.length,
                            me.button,
                        );
                    }
                    changePressed();
                    pressHandlers.onPressStart(mousePressed(me));
                }
            },
            onTouchStart: (te: TouchEvent) => {
                if (options?.disabled !== true) {
                    for (let i = 0; i < te.changedTouches.length; i++) {
                        const identifier = te.changedTouches[i].identifier;
                        if (!pressState.touches.includes(identifier)) {
                            setPressState(
                                'buttons',
                                pressState.touches.length,
                                identifier,
                            );
                        }
                    }
                    changePressed();
                    pressHandlers.onPressStart(touchPressed(te));
                }
            },

            //! PRESS END
            onMouseUp: (me: MouseEvent) => {
                if (options?.disabled !== true) {
                    if (pressState.buttons.includes(me.button)) {
                        setPressState(
                            'buttons',
                            pressState.buttons.filter(i => i === me.button),
                        );
                    }
                    changePressed();
                    pressHandlers.onPressEnd(mousePressed(me));
                }
            },
            onTouchEnd: (te: TouchEvent) => {
                if (options?.disabled !== true) {
                    for (let i = 0; i < te.changedTouches.length; i++) {
                        const identifier = te.changedTouches[i].identifier;
                        if (pressState.touches.includes(identifier)) {
                            setPressState(
                                'touches',
                                pressState.touches.filter(
                                    i => i === identifier,
                                ),
                            );
                            pressHandlers.onPress(touchPressed(te));
                        }
                    }
                    changePressed();
                    pressHandlers.onPressEnd(touchPressed(te));
                }
            },

            //! PRESS
            onClick: (me: MouseEvent) => {
                if (options?.disabled !== true) {
                    pressHandlers.onPress(mousePressed(me));
                }
            },
            onKeyDown: (ke: KeyboardEvent) => {
                if (
                    options?.disabled !== true &&
                    (options?.keys ?? [' ', 'Enter']).includes(ke.key)
                ) {
                    pressHandlers.onPress(keyboardPressed(ke));
                }
            },
        },
        { isPressed, setPressed },
        () => {
            return pressState;
        },
    ];
}

const PressContext = createContext<PressHandlers>();
type PressProviderProps = { children: JSX.Element } & PressHandlers;

export function PressProvider(props: PressProviderProps) {
    return (
        <PressContext.Provider value={props}>
            {props.children}
        </PressContext.Provider>
    );
}

export function usePressContext() {
    return useContext(PressContext);
}
