import { Button } from "../../src/aria/button/Button";
import type { PressEvent } from "../../src/interaction/usePress";
import { For, createSignal } from "solid-js";
import { FileSelect } from "../../src/aria/button/FileSelect";
import { ToggleButton } from "../../src/aria/button/ToggleButton";

const alertAndLog = (e: PressEvent) => {
  // alert(`Button: ${e.target}`);
  console.log(e.target);
};

const fileListStyles: any = {
  width: "100%",
  height: "8rem",
  "padding-left": ".25rem",
  border: "1px solid black",
  "border-radius": ".5rem",
  display: "flex",
  "flex-direction": "column",
  overflow: "auto",
  gap: "1rem",
  padding: ".25rem",
};

export const CButton = () => {
  const [isToggled, setToggled] = createSignal(false);
  const [files, setFiles] = createSignal<File[]|null>(null);

  return (
    <div style={{display: "flex", 'flex-direction': 'column', 'width': '30rem', 'margin-inline': 'auto'}}>
      <p style={{'text-align': 'center'}}>Open the Console to see the button outputs</p>
      {/* Normal button */}
      <Button>This is a Button</Button>

      {/* Toggle button */}
      <ToggleButton
        onPress={() => console.log(isToggled() ? "On" : "Off")}
        onPressChange={setToggled}
        toggled={isToggled()}
      >
        This is a toggle button
      </ToggleButton>

      {/* Button as another element */}
      <Button as={"div"}>
        This is a Button as a different element
      </Button>

      {/* Button that creates an aria warning */}
      <Button as={"div"}>
        ₲
      </Button>
      {/* Button with fixed aria warning */}
      <Button
        as={"div"}
        label="Button with text that isn't accessible"
      >
        ₲
      </Button>

      {/* Disabled Button */}
      <Button onPress={alertAndLog} disabled>
        Disabled Button
      </Button>
      {/* Disabled Button */}
      <Button onPress={alertAndLog} disabled as={"div"}>
        Also A Disabled Button
      </Button>

      <FileSelect onChange={setFiles} multiSelect>
        <Button style={{ "margin-top": "2.5rem" }}>Choose files...</Button>
      </FileSelect>
      <ul style={fileListStyles}>
        <For each={files()}>{(file) => <li>{file.name}</li>}</For>
      </ul>
    </div>
  );
};