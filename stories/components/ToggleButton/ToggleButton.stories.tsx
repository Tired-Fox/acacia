import type { Meta, StoryObj } from "storybook-solidjs";

import { ToggleButton } from "./ToggleButton";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from '@storybook/jest';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
  title: "Button/ToggleButton",
  component: ToggleButton,
  argTypes: {},
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const Normal: Story = {
  args: {
    children: "Toggle Button",
    toggled: false,
  },
  play: async({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText('Toggle Button');

    await userEvent.click(button);
    await step("Toggled", () => {
        expect(
            button?.dataset.toggled
        ).toBe("true")
        expect(  
            button?.ariaPressed
        ).toBe("true")
    })

    await userEvent.click(button);
    await step("Untoggled", () => {
        expect(
            button?.dataset.toggled
        ).toBe(undefined)
        expect(  
            button?.ariaPressed
        ).toBe(null)
    })
  }
};

export const DifferentTag: Story = {
  args: {
    as: "div",
    children: "Toggle Button",
    toggled: true,
  },
};

export const Symbol: Story = {
  args: {
    as: "div",
    children: "$",
    label: "Currency",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};
