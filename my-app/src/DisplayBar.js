import { useRef, useEffect, useState } from 'react';

import { hsvToRgbString } from './colorFunctions';

function DisplayBar({hsvValues, positions}) { 


    const canvasRef = useRef(null);
    const [numPanels, setNumPanels] = useState(2);

    const [style, setStyle] = useState(0); // 0 continuous, 1 discrete



    useEffect(() => { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle="black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        


       // CONTINUOUS GRADIENT BAR // 

        if (hsvValues.length >= 2 && hsvValues.length == positions.length) { 

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

            for (let i = 0; i < hsvValues.length; i++) { 

                gradient.addColorStop(positions[i], hsvObjectToRgbString(hsvValues[i]));
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

        }

        // DISCRETE GRADIENT BAR // 

        // console.log("Discrete Bar");

        if (style == 0) {
            if (hsvValues.length >= 2 && hsvValues.length == positions.length) { 

                // const numPanels = 5;

                const discreteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

                for (let i = 0; i < numPanels; i++) { 





                    const lowDistance = Math.round((i / numPanels) * 100) / 100;
                    const highDistance = Math.round(((i+1) / numPanels) * 100) / 100;

                    const medDistance = (lowDistance + highDistance) / 2;
                    const pixelColor = getPixelColor(medDistance);


                    discreteGradient.addColorStop(lowDistance, pixelColor);
                    discreteGradient.addColorStop(highDistance, pixelColor);
                
                }

                ctx.fillStyle = discreteGradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

            }

        }
        

        






    }, [hsvValues, positions, numPanels, style]);

    function hsvObjectToRgbString(hsv) { 
        return hsvToRgbString(hsv.h, hsv.s, hsv.v)
    }


    function getPixelColor(distance) { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");


        // distance is between 0 and 1

        if (distance > 0.99) { 
            distance = 0.99;
        }

        const xPos = canvas.width * distance;

        const pixelData = ctx.getImageData(xPos, 0, 1, 1).data; // r, g, b, a
        const [r, g, b, a] = pixelData;
        return `rgb(${r}, ${g}, ${b})`
    }







    return (
        <>
            {/* {positions.map((pos, index) => (
                <p key={index}>Position: {pos}  Color: {JSON.stringify(hsvValues[index])}</p>
            ))}
            <p>Purple hair, purple hair, I'm a fuzzy fertile bear</p> */}
        
            <button onClick={() => setStyle(prevStyle => prevStyle == 1 ? 0 : 1)}>Style</button>
            <input type="range" min="1" max="20" value={numPanels} onChange={(e) => setNumPanels(e.target.value)}/>
            <p></p>
            <canvas width="1200" height="200" ref={canvasRef}></canvas>
        </>
    )
}

export default DisplayBar;