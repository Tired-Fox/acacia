import { splitProps, mergeProps, JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { PressHandlerKeys, useOnPress } from "../interaction/onPress";
import type {
  PressHandlers,
  PressProps,
  StripEventHandlers,
} from "../interaction/onPress";

// Pull in all props for a given tage type or default to button props.
export type ButtonProps = Omit<
  JSX.HTMLElementTags["button"],
  StripEventHandlers
> & {
  as?: keyof JSX.HTMLElementTags;
  children?: JSX.Element;
} & PressProps &
  PressHandlers;

/**
 * Accessible `button` component
 *
 * Adds `aria-disabled` and manages `aria-pressed` if the button is a toggle button.
 * The button will only take `onPress` handlers as to help provide functionality for mouse, keyboard,
 * and touch.
 */
export function Button(props: ButtonProps): JSX.Element {
  let [data, handlers, rest] = useButton(props);
  let { events, hooks: {isPressed} } = useOnPress(handlers, {
    keys: data.as !== "button" ? [] : undefined,
  });

  return data.as === "button" ? (
    <button
      class="acacia-button"
      aria-pressed={data.pressed ? isPressed():undefined}
      data-pressed={isPressed() ? true:undefined}
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
      aria-pressed={data.pressed ? isPressed():undefined}
      data-pressed={isPressed() ? true:undefined}
      data-disabled={rest.disabled}
      {...events}
      {...rest}
    >
      {data.children}
    </Dynamic>
  );
}

const CONTAINS: RegExp = /^.*[ -~]+.*$/;
type DATA = (typeof Data)[number];

const Data = ["children", "as", "pressed"] as const;

/**
 * Extract and setup button props
 */
export function useButton(
  props: ButtonProps
): [
  Pick<ButtonProps, DATA>,
  PressHandlers,
  Omit<ButtonProps, DATA | keyof PressHandlers>
] {
  if (props.disabled) {
    props["aria-disabled"] = "true";
  }

  let [extracted, handlers, rest] = splitProps(props, Data, PressHandlerKeys);
  if (extracted.as && extracted.as !== "button") {
    rest.role = "button";
    if (rest.tabIndex === undefined) {
      rest.tabIndex = props.disabled ? -1 : 0;
    }

    if (
      !rest["aria-label"] &&
      !rest["aria-labelledby"] &&
      typeof extracted.children === "string"
    ) {
      if (!CONTAINS.test(extracted.children as string)) {
        console.warn(
          "[Acacia]:",
          "No `aria-label` or `aria-labelledby` provided for `Button` and the button's text is not accessible. Please change the text to be ascii characters or add one of the `aria-` labels."
        );
      } else {
        rest["aria-label"] = extracted.children as string;
      }
    }
  } else {
    rest.type = "button";
    extracted.as = "button";
  }

  handlers = mergeProps(
    {
      onPress: () => {},
      onPressStart: () => {},
      onPressEnd: () => {},
      onPressUp: () => {},
      onPressChange: () => {},
    },
    handlers
  );

  return [extracted, handlers as PressHandlers, rest];
}
