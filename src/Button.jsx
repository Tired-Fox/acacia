/**
 * @typedef {
 *   HTMLButtonElement 
 *   & {
 *    children?: JSX.Element
 *   }
 * } ButtonProps
 */

import { filterProps, combineProps } from "@solid-primitives/props"

/**
 * Accessible `button` component
 * 
 * @param {ButtonProps} props 
 * @returns {JSX.Element}
 */
export const Button = (props) => {
    if (Object.hasOwn(props, 'disabled') && props.disabled !== false) {
        props['aria-disabled'] = true;
        console.log(props['aria-disabled'], props, typeof props);
    }
    
    // Extract props for accessibility logic
    let {children} = props;
    let rest = filterProps(props, key => !["children"].includes(key));

    return <button type="button" {...rest}>
        {children}
    </button>
}

/*
    Toggle Button: aria-pressed, isPressed, onChangePressed
    Non-`button` elements: role="button", click, keypress=[space, enter]
*/