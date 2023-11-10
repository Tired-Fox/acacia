import type { Meta, StoryObj } from 'storybook-solidjs';
import { within, userEvent, fireEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { Button } from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
  title: 'Button/Button',
  component: Button,
  argTypes: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const Normal: Story = {
  args: {
    children: 'Button',
  },
  play: async({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText('Button');

    fireEvent.mouseDown(button);
    await step("Pressed", () => {
        expect(
            button?.dataset.pressed
        ).toBe("true")
    })

    fireEvent.mouseUp(button);
    await step("Unpressed", () => {
        expect(
            button?.dataset.pressed
        ).toBe(undefined)
    })
  }
};

export const DifferentTag: Story = {
  args: {
    as: 'div',
    children: 'Button',
  },
};

export const Symbol: Story = {
    args: {
      as: 'div',
      children: '$',
      label: 'Currency'
    },
  };

export const Disabled: Story = {
    args: {
        children: 'Disabled',
        disabled: true,
        onPress: () => alert('This should not activate')
    },
    play: async({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByText('Disabled');
    
        fireEvent.mouseDown(button);
        await step("Pressed", () => {
            expect(
                button?.dataset.pressed
            ).toBe(undefined)
        })
    
        fireEvent.mouseUp(button);
        await step("Unpressed", () => {
            expect(
                button?.dataset.pressed
            ).toBe(undefined)
        })
    } 
}