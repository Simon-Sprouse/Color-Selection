import { useState, useCallback } from 'react';

import './App.css';
import ColorWheel from './ColorWheel';
import GradientBar from './GradientBar';
import DisplayBar from './DisplayBar';

function App() {

    const defaultHsv = {h: 180, s:100, v:100};

    const [hsvValues, setHsvValues] = useState(
        Array.from({length: 2}, () => (defaultHsv))
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
        setHsvValues(prevValues => [...prevValues, defaultHsv]);
        setPositions(prevPositions => [...prevPositions, 0]);
    }

    function removeColorWheel() { 
        setHsvValues(prevValues => prevValues.slice(0, -1));
        setPositions(prevPositions => prevPositions.slice(0, -1));
    }   



    function randomizeColors() { 
        const randomHSV = hsvValues.map(() => ({ 
            h: Math.floor(Math.random() * 360),
            s: Math.floor(Math.random() * 101),
            v: Math.floor(Math.random() * 101)
        }));
        setHsvValues(randomHSV);
    }
    
    
    return (
        <div className="App">
        <header className="App-header">
            {/* <p>Küüb</p> */}
            {/* {positions.map((pos, index) => (
                <p>Position: {pos}  Color: {JSON.stringify(hsvValues[index])}</p>
            ))} */}
            <p></p>
            <button onClick={randomizeColors}>Randomize Colors</button>
            <p></p>
            <DisplayBar hsvValues={hsvValues} positions={positions}/>
            <p></p>
            <GradientBar hsvValues={hsvValues} setPositions={setPositions}/>
            <p></p>
            {hsvValues.map((hsv, index) => (
                <ColorWheel 
                    key={index} 
                    hsv={hsv}
                    updateHsv={newHsv => updateHsvValue(index, newHsv)}/>
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
