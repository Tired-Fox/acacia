import { splitProps, JSX, Component } from "solid-js";
import { Dynamic } from 'solid-js/web';
import { keyboardPressed, PressEvent, useOnPress } from './OnPress';

// Pull in all props for a given tage type or default to button props.
export type ButtonProps = JSX.HTMLElementTags['button'] & {
    as?: keyof JSX.HTMLElementTags,
    pressed?: boolean,
    onPress: (event: PressEvent) => void
    children?: JSX.Element;
};

/**
 * Accessible `button` component
 */
export const Button: Component<ButtonProps> = (props) => {
    let buttonRef: HTMLElement|undefined = undefined;
    let [{children, as, pressed, onPress}, rest] = createButtonProps(props);
    let [isPressed, [onClick, onTouchEnd]] = useOnPress(onPress, pressed);
   
    const keyboardHandler = (ke: KeyboardEvent) => {
        if (onPress && ke.key === ' ' || ke.key === 'Enter') {
            onPress(keyboardPressed(ke));
        }           
    }

    if (pressed === undefined) {
        return (
            as === 'button' 
            ? <button ref={buttonRef} onClick={onClick} onTouchEnd={onTouchEnd} {...rest}>
                {children}
            </button>
            : <Dynamic 
                ref={buttonRef} 
                component={as} 
                onClick={onClick} 
                onTouchEnd={onTouchEnd} 
                onKeyDown={keyboardHandler}
                {...rest}
            >
                {children}
            </Dynamic>
        );
    } else {
        return (
            as === 'button' 
            ? <button
                ref={buttonRef}
                onClick={onClick}
                onTouchEnd={onTouchEnd}
                aria-pressed={isPressed()}
                {...rest}
            >
                {children}
            </button>
            : <Dynamic
                ref={buttonRef}
                component={as}
                onClick={onClick}
                onTouchEnd={onTouchEnd}
                aria-pressed={isPressed()}
                onKeyDown={keyboardHandler}
                {...rest}
            >
                {children}
            </Dynamic>
        );
    }
}

type Extract = 'children'|'as'|'pressed'|'onPress';
const CONTAINS: RegExp = /^.*[ -~]+.*$/;

/**
 * Extract and setup button props
 */
export const createButtonProps = (props: ButtonProps): 
    [Pick<ButtonProps, Extract>, Omit<ButtonProps, Extract>] => {

    if (props.disabled) {
        props['aria-disabled'] = 'true';
    }

    let [extracted, rest] = splitProps(props, ["children", "as", "pressed", "onPress"]);
    if (extracted.as && extracted.as !== 'button') {
        rest.role = 'button';
        if (rest.tabIndex === undefined) {
            rest.tabIndex = props.disabled ? -1 : 0;
        }

        if (!rest['aria-label'] && !rest['aria-labelledby'] && typeof extracted.children === 'string') {
            if (!CONTAINS.test(extracted.children as string)) {
                console.warn('[Acacia]:', 'No `aria-label` or `aria-labelledby` provided for `Button` and the button\'s text is not accessible. Please change the text to be ascii characters or add one of the `aria-` labels.');
            } else {
                rest['aria-label'] = extracted.children as string;
            }
        }
    } else {
        rest.type = 'button';
        extracted.as = 'button';
    }

    return [extracted, rest];
}