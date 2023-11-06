# Acacia
SolidJS accessible primitive component library

## Inspiration
- [wai-aria](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [solid-aria](https://github.com/solidjs-community/solid-aria)
- [react-aria](https://react-spectrum.adobe.com/react-aria/)
- 
# Theme
 Acacia: [color-name](https://www.color-name.com/acacia.color)
 Medium Gray: [color-name](https://www.color-name.com/medium-gray.color)

Provides a basic `use` method that generates accessibility and interaction attributes
for the given component(s). If a component is made up of several sub components, then
the method will generate attributes for each sub component.

Use methods are split into categories: attributes, interactions, and state.
These will have the form of `useNameProps`, `useNameState`, and then the interactions
have more general re-usable names like `useOnPress` and `useOnHover`.

## TODO

- Button
  - [x] Button
  - [x] FileTrigger
  - [x] Toggle Button
- Form
  - [x] Checkbox
  - [x] Checkbox Group
  - [ ] Switch
  - [ ] Slider
  - [ ] Slider (Multi-Thumb)
  - [ ] Radio Button
  - [ ] Radio Group
  - [ ] Text Field
  - [?] Search Field
- Collections
  - [ ] List Box
  - [ ] Grid (Interactive Tabular data and layout containers)
  - [ ] MenuBar + Menu
  - [ ] Table
  - [ ] Tag Group
- Navigation
  - [ ] Breadcrumb
  - [ ] Link
  - [ ] Tabs
- Overlays
  - [ ] Dialog
  - [ ] Modal
  - [ ] Popover
  - [ ] Tooltip
- Pickers
  - [ ] Combo Box
  - [ ] Select
- Status
  - [ ] Meter
  - [ ] Progress Bar
- Content
  - [ ] Group
  - [ ] Accordion
  - [ ] Disclosure
  - [ ] Carousel
  - [ ] Tree View
  - [ ] Tree Grid
  - [ ] Feed
  - [ ] Window Splitter
- Date and Time
  - [ ] Calendar
  - [ ] DateField
  - [ ] DatePicker
  - [ ] DateRangePicker
  - [ ] RangeCalendar
  - [ ] TimeField
- Drag and Drop
  - [ ] DropZone

<!-- - [ ] Spin Button -->
