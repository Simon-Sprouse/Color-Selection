import { useState, useCallback } from 'react';

import './App.css';
import ColorWheel from './ColorWheel';
import GradientBar from './GradientBar';
import DisplayBar from './DisplayBar';

import { hsvObjectToRgbString } from './colorFunctions';

function App() {

    const defaultHsv = {h: 180, s:100, v:100};

    const [hsvValues, setHsvValues] = useState(
        Array.from({length: 2}, () => (defaultHsv))
    );

    const [counter, setCounter] = useState(0);

   

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
        setCounter(prev => prev + 1);
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
            <pre style={{textAlign: "left"}}>
                {"background: linear-gradient(90deg,\n"}
                {positions.map((pos, index) => (
                    `\t${hsvObjectToRgbString(hsvValues[index])} ${Math.round(pos*100)}%${index != (positions.length-1) ? "," : ""}\n`
                ))}
                {");\n"}
            </pre>
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
                    counter={counter}
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
