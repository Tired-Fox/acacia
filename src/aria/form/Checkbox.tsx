import {
  JSX,
  createContext,
  createSignal,
  splitProps,
  useContext,
  mergeProps,
  Accessor,
  Setter,
  onMount,
} from "solid-js";
import {
  createPress as usePress,
  PressHandlerKeys,
  PressProvider,
} from "../../interaction/createPress";
import type {
  Interaction,
  PressEvent,
  PressHandlers,
} from "../../interaction/createPress";
import { Hidden } from "../../utility/HideAndReplace";
import { createStore } from "solid-js/store";
import { acacia } from "../../util";

/*
   CONSTANTS
 */
const DataProps = [
  "checked",
  "children",
  "invalid",
  "onChange",
  "class",
  "name",
  "value",
  "disabled",
  "required",
  "readonly",
] as const;
const ContextProps = [
  "name",
  "invalid",
  "disabled",
  "required",
  "readonly",
  "values",
] as const;
const CheckboxContext = createContext<CheckboxGroupContext>();
/*
   TYPES
 */
type CallbackProps = { isIndeterminate: boolean };
type InputState = {
  name?: string;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
};
type InputProps = InputState & {
  ref?: HTMLInputElement;
  indeterminate?: boolean;
  checked?: boolean;
  value?: string;
};
type CustomProps = InputProps & {
  children?: JSX.Element | ((props: CallbackProps) => JSX.Element);
  style?: JSX.CSSProperties | string;
  class?: string;
  onChange?: (state: boolean) => void;
  onInvalid?: () => void;
};
type UseProps = [
  Pick<CheckboxProps, (typeof DataProps)[number]>,
  Interaction,
  {
    labelProps: Pick<CheckboxProps, "style" | "class">;
    inputProps: Omit<
      CheckboxProps,
      keyof PressHandlers | (typeof DataProps)[number] | "class" | "style"
    >;
  },
  {
    isPressed: Accessor<boolean>;
    isIndeterminate: Accessor<boolean>;
    setIndeterminate: Setter<boolean>;
    checked: Accessor<boolean | "mixed">;
    setChecked: Setter<boolean | "mixed">;
  }
];

type CheckboxGroupContext = InputState & {
  values?: string[];
};
type CheckboxProviderProps = { children: JSX.Element } & CheckboxGroupContext &
  PressHandlers;

/*
   PROPS
 */
type CheckboxProps = PressHandlers & CustomProps;
type CheckboxGroupProps = InputState & {
  values?: string[];
  onChange?: (values: string[]) => void;

  children: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties | string;
} & (
    | { labelledBy: string; label?: string }
    | { label: string; labelledBy?: string }
  );

/*
    CONTEXT
*/
function useCheckboxContext() {
  return useContext(CheckboxContext);
}

function CheckboxProvider(props: CheckboxProviderProps) {
  const [checkboxProps, pressProps, _rest] = splitProps(
    props,
    ContextProps,
    PressHandlerKeys
  );

  return (
    <CheckboxContext.Provider value={checkboxProps}>
      <PressProvider {...pressProps}>{props.children}</PressProvider>
    </CheckboxContext.Provider>
  );
}

/*
   COMPONENTS
 */

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
  let [
    data,
    events,
    { labelProps, inputProps },
    { checked, isPressed, isIndeterminate },
  ] = createCheckbox(props, ref);
  let [onKeyDown, handlers] = splitProps(events, ["onKeyDown"]);

  return (
    <label
      role="checkbox"
      class={`acacia-checkbox ${data.class}`}

      aria-checked={checked()}
      aria-invalid={data.invalid ? true : undefined}

      data-pressed={isPressed() ? true : undefined}
      data-readonly={data.readonly}
      data-disabled={data.disabled}
      data-invalid={data.invalid ? true : undefined}
      data-required={data.required}
      data-name={data.name}
      data-checked={
        checked() !== "mixed" ? (checked() ? true : undefined) : undefined
      }
      data-value={data.value}
      data-indeterminate={
        inputProps.indeterminate ?? isIndeterminate() ? true : undefined
      }

      {...handlers}
      {...labelProps}
    >
      <Hidden as={"span"}>
        <input
          type="checkbox"
          tabIndex={data.disabled ? -1 : 0}
          name={data.name}
          value={data.value}

          disabled={data.disabled}
          readOnly={data.readonly}
          required={data.required}
          checked={
            checked() !== "mixed" ? (checked() ? true : undefined) : undefined
          }
          indeterminate={
            inputProps.indeterminate ?? isIndeterminate() ? true : undefined
          }

          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onKeyDown={onKeyDown as any}

          {...inputProps}
        />
      </Hidden>
      {typeof data.children === "function"
        ? data.children({
            isIndeterminate: props.indeterminate ?? isIndeterminate(),
          })
        : data.children}
    </label>
  );
}

/**
 * Accessible and easily styled checkbox group.
 * 
 * disabled, required, readonly, and invalid are passed and spread to each checkbox inside the group.
 * This means that validation and logic for the entire group can be operated on the group itself.
 * 
 * Individual validation can be done with removing the invalid prop from the group and adding it to the individual
 * checkboxes
 * 
 * ```html
 * <CheckboxGroup label="Group Label">
 *      <Checkbox>
 *          <div class="checkbox">
                <svg viewBox="0 0 18 18" aria-hidden="true"><polyline points="1 9 7 14 15 4" /></svg>
            </div>
            Checkbox
 *      </Checkbox>
 * </CheckboxGroup>
 * ```
 */
export function CheckboxGroup(props: CheckboxGroupProps) {
  let checkboxGroupRef: HTMLDivElement | undefined = undefined;
  const [contextProps, rest] = splitProps(props, ContextProps);
  const [values, setValues] = createStore<string[]>(contextProps.values ?? []);

  return (
    <div
      ref={checkboxGroupRef}
      role="group"
      class={`acacia-checkbox-group ${rest.class}`}
      style={rest.style}
      aria-label={rest.label}
      aria-labelledby={rest.labelledBy}
    >
      {props.label && <legend>{props.label}</legend>}
      <CheckboxProvider
        onPress={(e) => {
          const dataset = (e.target as HTMLElement).dataset;
          if (dataset.checked !== undefined && dataset.value !== undefined) {
            if (!values.includes(dataset.value)) {
              setValues(values.length, dataset.value);
            }
          } else if (dataset.value) {
            setValues(values.filter((v) => v !== dataset.value));
          } else {
            return;
          }
          props.onChange?.(Array.from(values));
        }}
        {...contextProps}
      >
        {props.children}
      </CheckboxProvider>
    </div>
  );
}

/**
 * Splits props for a checkbox.
 *
 * Produces props for ownly data and state, event handlers, label props,
 * and input props respectively.
 */
export function createCheckbox(
  props: CheckboxProps,
  ref: HTMLInputElement | undefined
): UseProps {
  let [data, eventHandlers, labelProps, inputProps] = splitProps(
    props,
    DataProps,
    PressHandlerKeys,
    ["style", "class"]
  );

  let [info, rest] = splitProps(useCheckboxContext() ?? {}, ["values"]);
  data = mergeProps(data, rest);

  if (info.values?.includes(data.value ?? "")) {
    data.checked = true;
  }

  if (!inputProps.ref) {
    inputProps.ref = ref;
  }

  let [isIndeterminate, setIndeterminate] = createSignal(
    props.indeterminate !== undefined ? props.indeterminate : false
  );
  let [checked, setChecked] = createSignal<boolean | "mixed">(
    inputProps.indeterminate ? "mixed" : data.checked ?? false
  );

  let onPress = eventHandlers.onPress;
  eventHandlers.onPress = (event: PressEvent) => {
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

  let [events, { isPressed }] = usePress(eventHandlers, {
    keys: [" "],
    disabled: data.disabled ?? data.readonly,
  });

  return [
    data,
    events,
    { labelProps, inputProps },
    { isPressed, isIndeterminate, setIndeterminate, checked, setChecked },
  ];
}
