import ReactDOM from 'react-dom';
import Mapa from './Mapa';

const App = () => {
    return( 
        <div>
            <Mapa />
        </div>
)
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);