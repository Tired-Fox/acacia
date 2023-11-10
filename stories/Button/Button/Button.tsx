import { ButtonProps, createButton } from "../../../dist";
import { JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import '../button.css';
import '../../colors.css';


export function Button(props: ButtonProps): JSX.Element {
    const { buttonProps } = createButton(props);

    return (
        props.as === 'button' || props.as === undefined
        ? <button {...buttonProps}>{props.children}</button>
        : <Dynamic component={props.as} {...buttonProps}>{props.children}</Dynamic>
    );
}