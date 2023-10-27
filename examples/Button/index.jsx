import { render } from 'solid-js/web';
import { Button } from '../../src/Button';

const App = () => {
    return <main>
        <Button onClick={() => alert('Button pressed')}>
            This is a Button
        </Button>
    </main>
}

render(() => <App />, document.getElementById("root"));