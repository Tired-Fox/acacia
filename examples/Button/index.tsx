import { render } from 'solid-js/web';
import { Button, PressEvent } from '../../src/Button';

const alertAndLog = (e: PressEvent) => {
    // alert(`Button: ${e.target}`);
    console.log(e.target);
}

const App = () => {
    return <main style={{
        display: 'flex',
        'flex-direction': 'column',
        gap: '1rem',
        'align-items': 'center',
        'justify-content': 'center',
        height: "100%"
    }}>
        <p>Open the Console to see the button outputs</p>
        {/* Normal button */}
        <Button onPress={alertAndLog}>
            This is a Button
        </Button>

        {/* Toggle button */}
        <Button onPress={(e) => console.log(e.pressed ? 'On':'Off')} pressed={false}>
            This is a toggle button
        </Button>

        {/* Button as another element */}
        <Button onPress={alertAndLog} as={'div'}>
            This is a Button as a different element
        </Button>

        {/* Button that creates an aria warning */}
        <Button onPress={alertAndLog} as={'div'}>
            ₲
        </Button>
        {/* Button with fixed aria warning */}
        <Button onPress={alertAndLog} as={'div'} aria-label="Button with text that isn't accessible">
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


    </main>
}

render(() => <App />, document.getElementById("root") as any);