import { createButton } from '../../src/aria/Button/Button';

describe("aria button", () => {
    test('button has type or role attribute', () => {
        // Button element
        {
            let { buttonProps } = createButton({});
            expect(buttonProps.type).toBe('button');
        }
    
        // Button as other element
        {
            let { buttonProps } = createButton({ as: 'div' });
            expect(buttonProps.role).toBe('button');
        }
    })
    
    test('button has disabled attributes when disabled', () => {
        {
            const { buttonProps } = createButton({ disabled: true });
    
            expect(buttonProps.disabled).toBe(true);
            expect(buttonProps['aria-disabled']).toBe(true);
            expect(buttonProps['data-disabled']).toBe(true);
        }
        {
            const { buttonProps } = createButton({ disabled: true });
    
            expect(buttonProps.disabled).toBe(true);
            expect(buttonProps['aria-disabled']).toBe(true);
            expect(buttonProps['data-disabled']).toBe(true);
        }
    })
    
    test('button class prop is added after acacia-button class', () => {
        const { buttonProps } = createButton({ class: 'dark' });
    
        expect(buttonProps.class).toBe('acacia-button dark');
    })
});