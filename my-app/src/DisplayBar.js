import { useRef, useEffect } from 'react';

import { hsvToRgbString } from './colorFunctions';

function DisplayBar({hsvValues, positions}) { 


    const canvasRef = useRef(null);



    useEffect(() => { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle="black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);




        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);




        if (hsvValues.length >= 2 && hsvValues.length == positions.length) { 


            for (let i = 0; i < hsvValues.length; i++) { 

                gradient.addColorStop(positions[i], hsvObjectToRgbString(hsvValues[i]));
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

        }


    }, [hsvValues, positions]);

    function hsvObjectToRgbString(hsv) { 
        return hsvToRgbString(hsv.h, hsv.s, hsv.v)
    }




    return (
        <>
            {/* {positions.map((pos, index) => (
                <p key={index}>Position: {pos}  Color: {JSON.stringify(hsvValues[index])}</p>
            ))}
            <p>Purple hair, purple hair, I'm a fuzzy fertile bear</p> */}
            <canvas width="1200" height="200" ref={canvasRef}></canvas>
        </>
    )
}

export default DisplayBar;