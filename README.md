# Acacia
SolidJS accessible primitive component library

## Inspiration
- [wai-aria](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [solid-aria](https://github.com/solidjs-community/solid-aria)
- [react-aria](https://react-spectrum.adobe.com/react-aria/)

Provides a basic `use` method that generates accessibility and interaction attributes
for the given component(s). If a component is made up of several sub components, then
the method will generate attributes for each sub component.

Use methods are split into categories: attributes, interactions, and state.
These will have the form of `useNameProps`, `useNameState`, and then the interactions
have more general re-usable names like `usePress` and `useHover`.

```jsx
use { useButton } from '@TiredFox/Acacia/Button';

const Button = (prop: ButtonAria) => {
    let buttonProps = useButton(props);
    let {children} = buttonProps;

    return <button {...buttonProps}>
        {prop.children}
    </button>
}
```

```jsx
import { AButton } from '@TiredFox/Acacia/Button';

const Button = (props) => {
    return <AButton as={<div></div>} onPress={() => alert('Handles mouse, touch, and keyboard input')}>
        {props.children}
    </AButton>
}
```
