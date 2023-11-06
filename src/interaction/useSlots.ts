/*
    <Slot />
    <Label>Name</Label>
    <Label slot="label">Some label text</Label>
*/

import { JSX, createComputed } from "solid-js";
import { createStore } from "solid-js/store";

export function createSlots(props: any & {children?: JSX.Element}, keys: string[]): 
    Record<typeof keys[number] | 'default', JSX.Element[]> {

    const [slots, setSlots] = createStore<Record<string, JSX.Element[]>>({});
    if (props.children && props.children instanceof Array) {
        for (const part of props.children) {
            if (!part.slot || !keys.includes(part.slot)) {
                if (!('default' in slots)) {
                    setSlots('default', []);
                }
                setSlots('default', slots.default.length, part);
            } else {
                if (!(part.slot in slots)) {
                    setSlots(part.slot, []);
                }
                setSlots(part.slot, slots[part.slot].length, part);
            }
        }
    } else if (props.children instanceof Node) {
        let part = props.children;
        if (!part.slot || !keys.includes(part.slot)) {
            if (!('default' in slots)) {
                setSlots('default', []);
            }
            setSlots('default', slots.default.length, part);
        } else {
            if (!(part.slot in slots)) {
                setSlots(part.slot, []);
            }
            setSlots(part.slot, slots[part.slot].length, part);
        }
    } else {
        if (!('default' in slots)) {
            setSlots('default', []);
        }
        setSlots('default', slots.default.length, props.children);
    }
    return slots;
}