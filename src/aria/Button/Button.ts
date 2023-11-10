import { splitProps, JSX, mergeProps, Accessor, Setter } from 'solid-js';
import { PressHandlerKeys, createPress } from '../../interaction/createPress';
import type {
    PressHandlers,
    StripEventHandlers,
} from '../../interaction/createPress';
import { acacia } from '../..';

// Pull in all props for a given tage type or default to button props.
export type ButtonProps = Omit<
    JSX.HTMLElementTags['button'],
    StripEventHandlers | 'aria-label' | 'aria-labelledby'
> & {
    as?: keyof JSX.HTMLElementTags;
    children?: JSX.Element;
    label?: string;
    labelledBy?: string;
} & PressHandlers;

const CONTAINS: RegExp = /^.*[ -~]+.*$/;

const Data = ['children', 'as', 'label', 'labelledBy', 'class'] as const;

/**
 * Extract and setup button props
 *
 * TODO: Menu button with aria-haspopup to `menu` or `true`
 */
export function createButton(buttonProps: ButtonProps): {
    buttonProps: { [K: string]: any };
    hooks: { [K: string]: Accessor<boolean> | Setter<boolean> };
} {
    if (buttonProps.disabled) {
        buttonProps['aria-disabled'] = true;
    }

    const [data, handlers, rest] = splitProps(
        buttonProps,
        Data,
        PressHandlerKeys,
    );
    const addons: { [K: string]: any } = {};
    if (data.as && data.as !== 'button') {
        addons.role = 'button';
        if (rest.tabIndex === undefined) {
            addons.tabIndex = buttonProps.disabled ? -1 : 0;
        }

        if (
            !data.label &&
            !data.labelledBy &&
            typeof data.children === 'string'
        ) {
            if (!CONTAINS.test(data.children as string)) {
                acacia.warn(
                    'No `aria-label` or `aria-labelledby` provided for `Button` and the button\'s text is not accessible. Please change the text to be ascii characters or add one of the label props.',
                );
            } else {
                addons.label = data.children as string;
            }
        }
    } else {
        addons.type = 'button';
    }

    const [events, { isPressed }] = createPress(handlers, {
        keys: data.as !== 'button' ? [] : undefined,
    });

    const props = mergeProps(events, rest, addons, {
        class: `acacia-button ${data.class || ''}`,
        'aria-label': data.label,
        'aria-labelledby': data.labelledBy,
        get 'data-pressed'() {
            return isPressed() ? true : undefined;
        },
        'data-disabled': rest.disabled,
    });

    return { buttonProps: props, hooks: { isPressed } };
}
