import { Accessor, JSX } from 'solid-js';
import { createStore } from 'solid-js/store';

export class PressEvent {
    type: 'key'|'mouse'|'touch';
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
        type: 'key'|'mouse'|'touch',
        rest?: {
            altKey?: boolean,
            ctrlKey?: boolean,
            shiftKey?: boolean,
            metaKey?: boolean,
            clientX?: number,
            clientY?: number,
            screenX?: number,
            screenY?: number,
            target?: EventTarget | null,

            button?: number,
            key?: string,
        }
    ) {
        this.type = type;
        rest = rest ?? {} as any;
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
    return new PressEvent(
        'key',
        {
            altKey: k.altKey,
            metaKey: k.metaKey,
            shiftKey: k.shiftKey,
            ctrlKey: k.ctrlKey,
            target: k.target,
            key: k.key,
        }
    )
};

const mousePressed = (m: MouseEvent): PressEvent => {
    return new PressEvent(
        'mouse',
        {
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
       },
    );
}

const touchPressed = (t: TouchEvent): PressEvent => {
    let last = t.targetTouches[t.targetTouches.length];
    return new PressEvent(
        'touch',
        {
            altKey: t.altKey,
            ctrlKey: t.ctrlKey,
            shiftKey: t.shiftKey,
            metaKey: t.metaKey,
            clientX: last.clientX,
            clientY: last.clientY,
            screenX: last.screenX,
            screenY: last.screenY,
            target: last.target,
        }
    );
}

type Events = {
    onClick: (m: MouseEvent)=> void,
    onMouseDown: (m: MouseEvent) => void,
    onTouchStart: (t: TouchEvent) => void,
    onMouseUp: (m: MouseEvent) => void,
    onTouchEnd: (t: TouchEvent)=> void,
    onKeyDown: (k: KeyboardEvent)=> void,

    state: () => {buttons: number[], touches: number[]}
}

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

const Handlers = ['onPress', 'onPressStart', 'onPressEnd', 'onPressUp'] as const;

export type Handlers = { [K in typeof Handlers[number]]: (e: PressEvent) => void }
    & { onPressChange: (isPressed: boolean) => void; };

export const useOnPress = (
    handlers: Handlers,
    init?: Accessor<boolean>,
    useKeyboard?: boolean
): Events => {
    const [pressState, setPressState] = createStore<{buttons: number[], touches: number[]}>({
        buttons: [],
        touches: []
    });
    
    let changeSelected = () => {
        if (handlers.onPressChange && init) {
            handlers.onPressChange(!init());
        }
    }

    return {
        //! PRESS START
        onMouseDown: (me: MouseEvent) => {
            changeSelected();
            if (!pressState.buttons.includes(me.button)) {
                setPressState("buttons", pressState.buttons.length, me.button);
            }
            handlers.onPressStart(mousePressed(me));
        },
        onTouchStart: (te: TouchEvent) => {
            changeSelected();
            for (let i = 0; i < te.changedTouches.length; i++) {
                let identifier = te.changedTouches[i].identifier;
                if (!pressState.touches.includes(identifier)) {
                    setPressState("buttons", pressState.touches.length, identifier);
                }
            }
            handlers.onPressStart(touchPressed(te));
        },

        //! PRESS END
        onMouseUp: (me: MouseEvent) => {
            changeSelected();
            if (pressState.buttons.includes(me.button)) {
                setPressState("buttons", pressState.buttons.filter((i) => i === me.button));
            }
            handlers.onPressEnd(mousePressed(me));
        },
        onTouchEnd: (te: TouchEvent) => {
            changeSelected();
            for (let i = 0; i < te.changedTouches.length; i++) {
                let identifier = te.changedTouches[i].identifier;
                if (pressState.touches.includes(identifier)) {
                    setPressState("touches", pressState.touches.filter((i) => i === identifier))
                    handlers.onPress(touchPressed(te));
                }
            }
            handlers.onPressEnd(touchPressed(te));
        },

        //! PRESS
        onClick: (me: MouseEvent) => {
            changeSelected();
            handlers.onPress(mousePressed(me));
        },
        onKeyDown: (ke: KeyboardEvent) => {
            changeSelected();
            if (useKeyboard !== false && (ke.key === ' ' || ke.key === 'Enter')) {
                handlers.onPress(keyboardPressed(ke));
            }
        },

        state: () => {
            return pressState;
        }
    };
}