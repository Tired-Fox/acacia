import { JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';

/**
 * Hide the children with a wrapper of the specified tag
 */
export function VisuallyHidden(props: {
    as: keyof JSX.HTMLElementTags;
    children: JSX.Element;
}) {
    return (
        <Dynamic
            component={props.as}
            style={{
                border: 'none',
                clip: 'rect(0, 0, 0, 0)',
                'clip-path': 'inset(50%)',
                height: '1px',
                margin: '-1px',
                overflow: 'hidden',
                padding: 0,
                position: 'absolute',
                width: '1px',
                'white-space': 'nowrap',
            }}
        >
            {props.children}
        </Dynamic>
    );
}
