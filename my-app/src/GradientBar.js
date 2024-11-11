import { useRef, useEffect, useState } from 'react'

import { hsvToRgbString } from './colorFunctions';

function GradientBar({hsvValues}) {

    const canvasRef = useRef(null);
    const barHeight = 50;

    const [dotPosition, setDotPosition] = useState({x: 300, y:50});
    const [isDragging, setIsDragging] = useState(false);

    const [dots, setDots] = useState([]);


    useEffect(() => { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createLinearGradient(0, barHeight, canvas.width, barHeight);



        if (hsvValues.length >= 2) { 


            const distanceAlongGradient = Math.max(0, dotPosition.x / canvas.width);
           
            gradient.addColorStop(distanceAlongGradient, hsvObjectToRgbString(hsvValues[0]));
            gradient.addColorStop(1, hsvObjectToRgbString(hsvValues[1]));
        }
        else { 
            gradient.addColorStop(0, "red");
            gradient.addColorStop(1, "blue");
        }


        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, barHeight);




        // draw the dot
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(dotPosition.x, dotPosition.y, 33, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = hsvObjectToRgbString(hsvValues[0]);
        ctx.beginPath();
        ctx.arc(dotPosition.x, dotPosition.y, 30, 0, Math.PI * 2);
        ctx.fill();



    }, [hsvValues, dotPosition]);


    function hsvObjectToRgbString(hsv) { 
        return hsvToRgbString(hsv.h, hsv.s, hsv.v)
    }





    function handleMouseDown(event) { 
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        setDotPosition({x: mouseX, y:mouseY});
        setIsDragging(true);

    }

    function handleMouseMove(event) { 
        if (!isDragging) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        setDotPosition({x: mouseX, y:mouseY});
    }

    function handleMouseUp() { 
        setIsDragging(false);
    }





    return (
        <>
            {/* {hsvValues.map((value, index) => (
                <p key={index}>{JSON.stringify(value)}</p>
            ))} */}

            <canvas 
                ref={canvasRef} 
                height="100px" 
                width="1200px"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            ></canvas>
        </>
    )
}

export default GradientBar;