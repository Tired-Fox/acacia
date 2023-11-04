import { render } from "solid-js/web";
import { CButton as Button } from './components/Button'; 
import { CCheckbox as Checkbox } from './components/Checkbox';
import { JSX } from "solid-js";

const sectionStyle: JSX.CSSProperties = {
    border: '1px dashed rgb(var(--gray))',
    "border-radius": '.5rem',
    'padding-inline': '6rem',
    'padding-block': '2rem',
    'width': '50rem',
};

// TODO: Move to a landmark component file
type SectionProps = {children: JSX.Element} & ({label?: string, labelledBy: string} | {label: string, labelledBy?: string})
function Section(props: SectionProps) {
    return <section style={sectionStyle} aria-labelledby={props.labelledBy} aria-label={props.label}>
        {props.children}
    </section>
}

const App = () => {
  return (
    <main
      style={{
        display: "flex",
        "flex-direction": "column",
        gap: ".25rem",
        "align-items": "center",
        "justify-content": "center",
        height: "100%",
      }}
    >
        <Section labelledBy="section-Buttons">
            <h2 id="section-Buttons">Buttons</h2>
            <Button />
        </Section>
        <Section labelledBy="section-Checkbox">
            <h2 id="section-Checkbox">Checkboxes</h2>
            <Checkbox />
        </Section>
    </main>
  );
};

render(() => <App />, document.getElementById("root") as any);
