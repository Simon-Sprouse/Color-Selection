import { useRef, useEffect } from 'react'

import { hsvToRgbString } from './colorFunctions';

function GradientBar({hsvValues}) {

    const canvasRef = useRef(null);
    const barHeight = 50;

    useEffect(() => { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const gradient = ctx.createLinearGradient(0, barHeight, canvas.width, barHeight);

        if (hsvValues.length >= 2) { 




            gradient.addColorStop(0, hsvObjectToRgbString(hsvValues[0]));
            gradient.addColorStop(1, hsvObjectToRgbString(hsvValues[1]));
        }
        else { 
            gradient.addColorStop(0, "red");
            gradient.addColorStop(1, "blue");
        }


        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, barHeight);


    }, [hsvValues]);


    function hsvObjectToRgbString(hsv) { 
        return hsvToRgbString(hsv.h, hsv.s, hsv.v)
    }




    return (
        <>
            {/* {hsvValues.map((value, index) => (
                <p key={index}>{JSON.stringify(value)}</p>
            ))} */}

            <canvas ref={canvasRef} height="100px" width="1200px"></canvas>
        </>
    )
}

export default GradientBar;