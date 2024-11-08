import { useState, useCallback } from 'react';

import './App.css';
import ColorWheel from './ColorWheel';
import GradientBar from './GradientBar';

function App() {



    const [hsvValues, setHsvValues] = useState(
        Array.from({length: 2}, () => ({h: 0, s:0, v:0}))
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
            <p>Küüb</p>
            {/* {hsvValues.map((hsv, index) => (
                <p>{JSON.stringify(hsv)}</p>
            ))} */}
            <GradientBar hsvValues={hsvValues}/>
            <p></p>
            {hsvValues.map((ref, index) => (
                <ColorWheel key={index} updateHsv={newHsv => updateHsvValue(index, newHsv)}/>
            ))}


        </header>
        </div>
    );
}

export default App;
