import { splitProps, JSX, Accessor } from "solid-js";
import { Dynamic } from "solid-js/web";
import { PressHandlerKeys, createPress } from "../../interaction/createPress";
import type {
  Interaction,
  PressHandlers,
  StripEventHandlers,
} from "../../interaction/createPress";
import { acacia } from "../../util";

// Pull in all props for a given tage type or default to button props.
export type ButtonProps = Omit<
  JSX.HTMLElementTags["button"],
  StripEventHandlers | 'aria-label' | 'aria-labelledby'
> & {
  as?: keyof JSX.HTMLElementTags;
  children?: JSX.Element;
  label?: string,
  labelledBy?: string
} &
  PressHandlers;

/**
 * Accessible `button` component
 *
 * Adds `aria-disabled` and manages `aria-pressed` if the button is a toggle button.
 * The button will only take `onPress` handlers as to help provide functionality for mouse, keyboard,
 * and touch.
 * TODO: Menu button with aria-haspopup to `menu` or `true`
 */
export function Button(props: ButtonProps): JSX.Element {
  let [data, events, rest, { isPressed }] = createButton(props);

  return data.as === "button" ? (
    <button
      class="acacia-button"
      aria-label={data.label}
      aria-aria-labelledby={data.labelledBy}
      aria-pressed={isPressed() ? true : undefined}
      data-pressed={isPressed() ? true : undefined}
      data-disabled={rest.disabled}
      {...events}
      {...rest}
    >
      {data.children}
    </button>
  ) : (
    <Dynamic
      component={data.as}
      class="acacia-button"
      aria-label={data.label}
      aria-aria-labelledby={data.labelledBy}
      aria-pressed={isPressed() ? true : undefined}
      data-pressed={isPressed() ? true : undefined}
      data-disabled={rest.disabled}
      {...events}
      {...rest}
    >
      {data.children}
    </Dynamic>
  );
}

const CONTAINS: RegExp = /^.*[ -~]+.*$/;

const Data = ["children", "as", 'label', 'labelledBy'] as const;
type UseProps = [
  Pick<ButtonProps, (typeof Data)[number]>,
  Interaction,
  Omit<ButtonProps, (typeof Data)[number] | keyof PressHandlers>,
  { isPressed: Accessor<boolean> }
];

/**
 * Extract and setup button props
 */
export function createButton(props: ButtonProps): UseProps {
  if (props.disabled) {
    props["aria-disabled"] = "true";
  }

  let [data, handlers, rest] = splitProps(props, Data, PressHandlerKeys);
  if (data.as && data.as !== "button") {
    rest.role = "button";
    if (rest.tabIndex === undefined) {
      rest.tabIndex = props.disabled ? -1 : 0;
    }

    if (
      !data.label &&
      !data.labelledBy &&
      typeof data.children === "string"
    ) {
      if (!CONTAINS.test(data.children as string)) {
        acacia.warn(
          "No `aria-label` or `aria-labelledby` provided for `Button` and the button's text is not accessible. Please change the text to be ascii characters or add one of the label props."
        );
      } else {
        data.label = data.children as string;
      }
    }
  } else {
    rest.type = "button";
    data.as = "button";
  }

  let [events, { isPressed }] = createPress(handlers, {
    keys: data.as !== "button" ? [] : undefined,
  });

  return [data, events, rest, { isPressed }];
}
