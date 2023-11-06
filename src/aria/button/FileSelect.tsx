import { JSX } from "solid-js";
import { PressProvider } from "../../interaction/usePress";
import { toArray } from "../../util";

type FileSelectProps = {
    ref?: HTMLInputElement,
    /** Children of the component */
    children: JSX.Element,
    /** Handler that recieves a list of selected files */
    onChange?: (files: File[]|null) => void,
    /** Allow for multiple file selection */
    multiSelect?: boolean,
    /** Indicates what camera to use: `user`==user facing, `environment`==outward facing */
    useCamera?: 'user' | 'environment',
    /** FileType filter to apply to the file selection */
    fileTypes?: string[]
};

/**
 * File selector.
 * 
 * This component also takes any interactive component, a component using `onPress`, to activate the file
 * selection. The file selection is a hidden `input` element with type `file`. All the options for configuring
 * the FileSelect is passed to this element.
 */
export function FileSelect(props: FileSelectProps) {
    let inputRef: HTMLInputElement | undefined = props.ref ?? undefined;

    return (
        <>
            <PressProvider onPress={() => {
                if (inputRef) {
                    inputRef.value = '';
                    inputRef.click();
                }
            }}>
                {props.children}
            </PressProvider>
            <input
                ref={inputRef}
                type="file"
                style={{display: 'none'}}

                accept={props.fileTypes?.toString()}
                capture={props.useCamera}
                multiple={props.multiSelect}

                onChange={(e) => props.onChange?.(toArray(e.target.files))}
            />
        </>
    )
}