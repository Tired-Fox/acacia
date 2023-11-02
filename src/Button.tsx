import { splitProps, mergeProps, JSX, Component, Accessor } from "solid-js";
import { Dynamic } from 'solid-js/web';
import { PressEvent, useOnPress } from './Press';
import type { Handlers } from './Press';

// Pull in all props for a given tage type or default to button props.
export type ButtonProps = Omit<JSX.HTMLElementTags['button'], 'onClick'> & {
    as?: keyof JSX.HTMLElementTags,
    pressed?: Accessor<boolean>,
    onPress?: (e: PressEvent) => void,
    onPressStart?: (e: PressEvent) => void,
    onPressEnd?: (e: PressEvent) => void,
    onPressUp?: (e: PressEvent) => void,
    onPressChange?: (isSelected: boolean) => void,
    children?: JSX.Element;
};

/**
 * Accessible `button` component
 * 
 * # TODO:
 * - [ ] ClickStart
 * - [ ] ClickEnd
 * - [ ] Hover
 * - [ ] ClickUp
 * - [ ] ClickChange
 */
export const Button: Component<ButtonProps> = (props) => {
    let [data, handlers, rest] = createButtonProps(props);
    let eventHandlers = useOnPress(handlers, data.pressed, data.as !== 'button');
    
    let buttonRef: HTMLElement|undefined = undefined;
   

    if (data.pressed === undefined) {
        return (
            data.as === 'button' 
            ? <button ref={buttonRef} {...eventHandlers} {...rest}>
                {data.children}
            </button>
            : <Dynamic 
                ref={buttonRef as any} 
                component={data.as} 
                {...eventHandlers}
                {...rest}
            >
                {data.children}
            </Dynamic>
        );
    } else {
        return (
            data.as === 'button' 
            ? <button
                ref={buttonRef}
                aria-pressed={data.pressed()}
                {...eventHandlers}
                {...rest}
            >
                {data.children}
            </button>
            : <Dynamic
                ref={buttonRef as any}
                component={data.as}
                aria-pressed={data.pressed()}
                {...eventHandlers}
                {...rest}
            >
                {data.children}
            </Dynamic>
        );
    }
}

const CONTAINS: RegExp = /^.*[ -~]+.*$/;
type DATA = typeof Data[number];

const Data = ['children', 'as', 'pressed'] as const;
const HANDLERS = ['onPress', 'onPressStart', 'onPressEnd', 'onPressUp', 'onPressChange'] as const;

/**
 * Extract and setup button props
 */
export const createButtonProps = (props: ButtonProps): 
    [Pick<ButtonProps, DATA>, Handlers, Omit<ButtonProps, DATA | keyof Handlers>] => {

    if (props.disabled) {
        props['aria-disabled'] = 'true';
    }

    let [extracted, handlers, rest] = splitProps(props, Data, HANDLERS);
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

    handlers = mergeProps({
        onPress: () => {},
        onPressStart: () => {},
        onPressEnd: () => {},
        onPressUp: () => {},
        onPressChange: () => {}
    }, handlers);

    return [extracted, handlers as Handlers, rest];
}