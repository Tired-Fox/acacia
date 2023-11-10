import { chain } from '@solid-primitives/utils';
import { ButtonProps, createButton } from './Button';
import {
    Accessor,
    Setter,
    createSignal,
    mergeProps,
    splitProps,
} from 'solid-js';

export type ToggleButtonProps = ButtonProps & { toggled?: boolean };

export function createToggleButton(toggleButtonProps: ToggleButtonProps): {
    toggleButtonProps: { [K: string]: any };
    hooks: { [K: string]: Accessor<boolean> | Setter<boolean> };
} {
    toggleButtonProps = mergeProps(toggleButtonProps, {
        onPress: chain([
            () => setToggled(!isToggled()),
            toggleButtonProps.onPress,
        ]),
    });

    const [toggledProps, bProps] = splitProps(toggleButtonProps, ['toggled']);
    const [isToggled, setToggled] = createSignal(toggledProps.toggled ?? false);

    const {
        buttonProps,
        hooks: { isPressed },
    } = createButton(bProps);

    const props = mergeProps(buttonProps, {
        class: 'acacia-button',
        get 'data-toggled'() {
            return isToggled() ? true : undefined;
        },
        get 'aria-pressed'() {
            return isToggled() ? true : undefined;
        },
    });

    return { toggleButtonProps: props, hooks: { isPressed } };
}
