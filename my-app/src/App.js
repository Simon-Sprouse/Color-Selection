import { useState, useCallback } from 'react';

import './App.css';
import ColorWheel from './ColorWheel';

function App() {



    const [hsvValues, setHsvValues] = useState(
        Array.from({length: 5}, () => ({h: 0, s:0, v:0}))
    );

    const updateHsvValue = useCallback((index, newHsv) => { 
        setHsvValues(prevValues => 
            prevValues.map((hsv, i) => { 
                if (i == index) { 
                    return newHsv;
                }
                else {
                    return hsv;
                }
            })
        )
    }, []);
    
    
    return (
        <div className="App">
        <header className="App-header">
            {hsvValues.map((hsv, index) => (
                <p>{JSON.stringify(hsv)}</p>
            ))}
            {hsvValues.map((ref, index) => (
                <ColorWheel key={index} updateHsv={newHsv => updateHsvValue(index, newHsv)}/>
            ))}


        </header>
        </div>
    );
}

export default App;
