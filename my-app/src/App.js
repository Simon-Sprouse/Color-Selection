import { useState, useCallback } from 'react';

import './App.css';
import ColorWheel from './ColorWheel';
import GradientBar from './GradientBar';
import DisplayBar from './DisplayBar';

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


    const [positions, setPositions] = useState(
        Array.from({length: 2}, () => 0)
    )



    function addColorWheel() { 
        const newValue = {h: 0, s:0, v:0};
        setHsvValues(prevValues => [...prevValues, newValue]);
        setPositions(prevPositions => [...prevPositions, 0]);
    }

    function removeColorWheel() { 
        setHsvValues(prevValues => prevValues.slice(0, -1));
        setPositions(prevPositions => prevPositions.slice(0, -1));
    }   
    
    
    return (
        <div className="App">
        <header className="App-header">
            {/* <p>Küüb</p> */}
            {/* {positions.map((pos, index) => (
                <p>Position: {pos}  Color: {JSON.stringify(hsvValues[index])}</p>
            ))} */}
            <p></p>
            <DisplayBar hsvValues={hsvValues} positions={positions}/>
            <p></p>
            <GradientBar hsvValues={hsvValues} setPositions={setPositions}/>
            <p></p>
            {hsvValues.map((ref, index) => (
                <ColorWheel key={index} updateHsv={newHsv => updateHsvValue(index, newHsv)}/>
            ))}
            <p></p>
            <button onClick={addColorWheel}>Add Color</button>
            <button onClick={removeColorWheel}>Remove Color</button>
            <p></p>

        </header>
        </div>
    );
}

export default App;
