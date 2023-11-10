import { ButtonProps, createButton } from "../../../dist";
import { JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import '../../styles/button.css';
import '../../styles/colors.css';


export function Button(props: ButtonProps): JSX.Element {
    const { buttonProps } = createButton(props);

    return (
        props.as === 'button' || props.as === undefined
        ? <button {...buttonProps}>{props.children}</button>
        : <Dynamic component={props.as} {...buttonProps}>{props.children}</Dynamic>
    );
}