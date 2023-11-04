import {
  Accessor,
  JSX,
  createEffect,
  createSignal,
  splitProps,
} from "solid-js";
import { useOnPress, PressHandlerKeys } from "../interaction/onPress";
import type { PressEvent, PressHandlers } from "../interaction/onPress";
import { Hidden } from "../utility/HideAndReplace";

type ChildProps = { isIndeterminate: boolean };

type CustomProps = {
  ref?: HTMLInputElement;
  invalid?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  checked?: boolean;
  children?: JSX.Element | ((props: ChildProps) => JSX.Element);
  style?: JSX.CSSProperties | string;
  class?: string;
  onChange?: (state: boolean) => void;
  onInvalid?: () => void;
};
type CheckboxProps = PressHandlers & CustomProps;

/**
 * Accessable and easy to style input checkbox.
 *
 * The checkbox wraps a visually hidden input that manages state. The children to the checkbox is what is displayed.
 * Clicking anywhere on the checkbox will toggle it's state.
 *
 * Pressed, invalid, readonly, and required are in `data-` attributes respectively to allow for styling and state management.
 */
export function Checkbox(props: CheckboxProps) {
  let ref: HTMLInputElement | undefined = undefined;
  let [isIndeterminate, setIndeterminate] = createSignal(
    props.indeterminate !== undefined ?  props.indeterminate : false
  );
  let [checked, setChecked] = createSignal<boolean | "mixed">(props.indeterminate ? 'mixed' : props.checked ?? false);
  let [data, handlers, labelProps, inputProps] = useCheckbox(props, ref);

  let onPress = handlers.onPress;
  handlers.onPress = (event: PressEvent) => {
    if (checked() === "mixed") {
      setChecked(true);
      if (inputProps.indeterminate === undefined) {
        setIndeterminate(false);
      }
      data.onChange?.(true);
    } else {
      setChecked(!checked());
      data.onChange?.(checked() === "mixed" ? false : (checked() as boolean));
    }
    onPress?.(event);
  };

  let {
    events: { onKeyDown, ...events },
    hooks: { isPressed },
  } = useOnPress(handlers, {
    keys: [" "],
    disabled: props.disabled ?? props.readonly,
  });

  createEffect(() => {});

  return (
    <label
      class={`acacia-checkbox ${data.class}`}
      role="checkbox"
      aria-checked={checked()}
      data-checked={
        checked() !== "mixed" ? (checked() ? true : undefined) : undefined
      }
      data-pressed={isPressed() ? true : undefined}
      data-readonly={inputProps.readonly}
      data-disabled={inputProps.disabled}
      data-invalid={data.invalid ? true : undefined}
      data-required={inputProps.required}
      data-indeterminate={
        inputProps.indeterminate ?? isIndeterminate() ? true : undefined
      }
      {...events}
      {...labelProps}
    >
      <Hidden as={"span"}>
        <input
          type="checkbox"
          tabIndex={inputProps.disabled ? -1 : 0}
          aria-invalid={data.invalid}
          aria-checked={checked()}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onKeyDown={onKeyDown}
          checked={
            checked() !== "mixed" ? (checked() ? true : undefined) : undefined
          }
          indeterminate={
            inputProps.indeterminate ?? isIndeterminate() ? true : undefined
          }
          {...inputProps}
        />
      </Hidden>
      {
        typeof data.children === 'function' ?
        data.children({isIndeterminate: props.indeterminate ?? isIndeterminate()})
        : data.children
      }
    </label>
  );
}

type Data = "checked" | "children" | "invalid" | "onChange" | "class";
export function useCheckbox(
  props: CheckboxProps,
  ref: HTMLInputElement | undefined
): [
  Pick<CheckboxProps, Data>,
  PressHandlers,
  Pick<CheckboxProps, "style">,
  Omit<CheckboxProps, keyof PressHandlers | Data | "class" | "style">
] {
  let [data, eventHandlers, labelProps, inputProps] = splitProps(
    props,
    ["checked", "children", "invalid", "onChange", "class"],
    PressHandlerKeys,
    ["style", "class"]
  );

  if (!inputProps.ref) {
    inputProps.ref = ref;
  }

  return [data, eventHandlers, labelProps, inputProps];
}
