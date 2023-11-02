import { Accessor, Setter, createSignal } from 'solid-js';

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
    pressed: boolean;
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
            pressed?: boolean,
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
        this.pressed = rest?.pressed ?? false;

        this.button = rest?.button ?? 0;
        this.key = rest?.key;
    }
} 

export const keyboardPressed = (k: KeyboardEvent) => {
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

export const mousePressed = (m: MouseEvent, p: boolean): PressEvent => {
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
            pressed: p,
       },
    );
}

export const touchPressed = (t: TouchEvent, p: boolean): PressEvent => {
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
            pressed: p,
        }
    );
}

export const useOnPress = (onPress: (e:PressEvent)=>void|undefined, init?: boolean): 
    [Accessor<boolean>, [(e: MouseEvent)=>void, (e:TouchEvent)=>void]] => {

    let [isPressed, setIsPressed]: [Accessor<boolean>, Setter<boolean>] = 
        [()=>false, ((value: boolean)=>false) as any];
    let togglePressed = () => {};

    if (init !== undefined) {
        [isPressed, setIsPressed] = createSignal(init as boolean);
        togglePressed = () => {
            setIsPressed(!isPressed());
        }
    }

    let click = (me: MouseEvent) => {
        if (togglePressed) {   
            togglePressed();
        }
        if (onPress) {
            onPress(mousePressed(me, isPressed()));
        }
    };
    let touchEnd = (te: TouchEvent) => {
        togglePressed();
        if (onPress) {
            onPress(touchPressed(te, isPressed()));
        }
    }

    return [isPressed, [click, touchEnd]]
}