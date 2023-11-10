import { createToggleButton } from '../../src/aria/Button/ToggleButton';

describe("aria toggle button", () => {
    test('toggle button will have data-toggled attribute when toggled', () => {
        // Button element
        let { toggleButtonProps } = createToggleButton({toggled: true});
        expect(toggleButtonProps['data-toggled']).toBe(true);
    })
});