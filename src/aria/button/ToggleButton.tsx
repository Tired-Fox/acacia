import { PressEvent } from "../../interaction/createPress";
import { ButtonProps, createButton } from "./Button";
import { Accessor, Setter, createSignal, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import type { Interaction, PressHandlers } from "../../interaction/createPress";

type ToggleButtonProps = ButtonProps & { toggled?: boolean };
type UseProps = [
  Pick<ToggleButtonProps, "children" | "as" | "toggled">,
  Interaction,
  Omit<ToggleButtonProps, keyof PressHandlers | "as" | "children" | "toggled">,
  {
    isPressed: Accessor<boolean>;
    isToggled: Accessor<boolean>;
    setToggled: Setter<boolean>;
  }
];

export function ToggleButton(props: ToggleButtonProps): JSX.Element {
  const [data, events, buttonProps, { isPressed, isToggled }] =
    createToggleButton(props);

  return data.as === "button" ? (
    <button
      class="acacia-button"
      aria-pressed={isPressed() ? true : undefined}
      data-pressed={isPressed() ? true : undefined}
      data-toggled={isToggled() ? true : undefined}
      data-disabled={buttonProps.disabled}
      {...events}
      {...buttonProps}
    >
      {data.children}
    </button>
  ) : (
    <Dynamic
      component={data.as}
      class="acacia-button"
      aria-pressed={isPressed() ? true : undefined}
      data-pressed={isPressed() ? true : undefined}
      data-toggled={isToggled() ? true : undefined}
      data-disabled={buttonProps.disabled}
      {...events}
      {...buttonProps}
    >
      {data.children}
    </Dynamic>
  );
}

export function createToggleButton(props: ToggleButtonProps): UseProps {
  const [toggledProps, buttonProps] = splitProps(props, ["toggled"]);
  const [isToggled, setToggled] = createSignal(toggledProps.toggled ?? false);

  const onPress = props.onPress;
  props.onPress = (e: PressEvent) => {
    setToggled(!isToggled());
    onPress?.(e);
  };

  let [data, events, rest, { isPressed }] = createButton(buttonProps);

  return [
    data,
    events,
    rest,
    {
      isPressed,
      isToggled,
      setToggled,
    },
  ];
}
