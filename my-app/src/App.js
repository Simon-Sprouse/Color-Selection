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

    const [style, setStyle] = useState(0);
    const [numPanels, setNumPanels] = useState(5);

   

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

    function boundedRandomNumber(lower, upper) { 
        const diff = upper - lower;
        return Math.floor((Math.random() * diff) + lower);
    }

    function psuedoRandomizeColors() { 
        setCounter(prev => prev + 1);
        let prevS = 0;
        let prevV = 0;

        const psuedoRandomHSV = hsvValues.map(() => {


            const newS = boundedRandomNumber(prevS, 101);
            const newV = boundedRandomNumber(prevV, 101);

            prevS = newS;
            prevV = newV;

            return {
            h: boundedRandomNumber(0, 360),
            s: newS,
            v: newV
            }
        })

        setHsvValues(psuedoRandomHSV);
    }
    
    
    return (
        <div className="App">
        <header className="App-header">
            {/* <p>Küüb</p> */}
            
            <p></p>
            <span>
                <button onClick={psuedoRandomizeColors}>Randomize Colors</button>
                <button onClick={() => setStyle(prevStyle => prevStyle == 1 ? 0 : 1)}>{style == 1 ? "Gradient" : "Step"}</button>
                {style == 1 && (
                    <input className="rangeBar" type="range" min="1" max="20" value={numPanels} onChange={(e) => setNumPanels(e.target.value)}/>
                )}
            </span>

            <DisplayBar hsvValues={hsvValues} positions={positions} style={style} numPanels={numPanels}/>
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
            <span>
                <button onClick={addColorWheel}>Add Color</button>
                <button onClick={removeColorWheel}>Remove Color</button>
            </span>
            
            <p></p>
            {/* <pre style={{textAlign: "left"}}>
                {"background: linear-gradient(90deg,\n"}
                {positions.map((pos, index) => (
                    `\t${hsvObjectToRgbString(hsvValues[index])} ${Math.round(pos*100)}%${index != (positions.length-1) ? "," : ""}\n`
                ))}
                {");\n"}
            </pre> */}

        </header>
        </div>
    );
}

export default App;
