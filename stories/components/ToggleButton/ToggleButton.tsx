import {
  ToggleButtonProps,
  createToggleButton,
} from "../../../dist";
import { JSX } from "solid-js";
import { Dynamic } from "solid-js/web";

import "../../styles/button.css";
import '../../styles/colors.css';

export function ToggleButton(props: ToggleButtonProps): JSX.Element {
  const { toggleButtonProps } = createToggleButton(props);

  return props.as === "button" || props.as === undefined ? (
    <button {...toggleButtonProps}>{props.children}</button>
  ) : (
    <Dynamic component={props.as} {...toggleButtonProps}>
      {props.children}
    </Dynamic>
  );
}
