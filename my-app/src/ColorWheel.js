import { useRef, useEffect, useState } from 'react'
import { hsvToRgb } from './colorFunctions';

function ColorWheel() { 

    const canvasRef = useRef(null);

    const [dotAngle, setDotAngle] = useState(0);
    const [dotPosition, setDotPosition] = useState({x:500, y:100});
    const [isDraggingRing, setIsDraggingRing] = useState(false);
    const [isDraggingSquare, setIsDraggingSquare] = useState(false);



    const circlePad = 40;
    const ringWidth = 40;
    const voidWidth = 40;

    const squarePad = 40;
    



    useEffect(() => { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        

        

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);



        

        

        // color wheel
        const ringCenterX = width / 6;
        const ringCenterY = height / 2;

        const circleRadius = ((width / 3) - circlePad) / 2;

        const hueGradient = ctx.createConicGradient(-0.5 * Math.PI, ringCenterX, ringCenterY);
        for (let i = 0; i < 360; i++) { 
            hueGradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
        }

        ctx.fillStyle = hueGradient;
        ctx.beginPath();
        ctx.arc(ringCenterX, ringCenterY, circleRadius, 0 * Math.PI, 2 * Math.PI);
        ctx.fill();


        // create empty space inside ring
        const voidRadius = circleRadius - ringWidth;

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(ringCenterX, ringCenterY, voidRadius, 0, Math.PI * 2);
        ctx.fill();

        // display the current color in the middle of void
        const hue = ((dotAngle * (180 / Math.PI)) + (90)) % 360;
        const hueDisplayRadius = voidRadius - voidWidth;


        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(ringCenterX, ringCenterY, hueDisplayRadius, 0, Math.PI * 2);
        ctx.fill();


        // draw the dot
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(ringCenterX + circleRadius * Math.cos(dotAngle), ringCenterY + circleRadius * Math.sin(dotAngle), 33, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ringCenterX + circleRadius * Math.cos(dotAngle), ringCenterY + circleRadius * Math.sin(dotAngle), 30, 0, Math.PI * 2);
        ctx.fill();






        // draw square
   
        const squareCanvas = document.createElement('canvas');
        squareCanvas.width = 100;
        squareCanvas.height = 100;
        const squareCtx = squareCanvas.getContext('2d');

        for (let y = 0; y < 100; y++) {
            for (let x = 0; x < 100; x++) {
                const s = x;
                const v = 100 - y;
                const {r, g, b} = hsvToRgb(hue, s, v); 
                squareCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                squareCtx.fillRect(x, y, 1, 1);
            }
        }

        // top corner of the square
        const topCornerX = (width / 3) + squarePad;
        const topCornerY = squarePad;
        const sideLength = (width / 3) - (2 * squarePad);

        // scale the hsv square onto the dimensions we need
        ctx.drawImage(squareCanvas, topCornerX, topCornerY, sideLength, sideLength);






        // draw the dot
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(dotPosition.x, dotPosition.y, 33, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(dotPosition.x, dotPosition.y, 30, 0, Math.PI * 2);
        ctx.fill();






        // display the final color

        const squareSize = ((width / 3) - (squarePad * 2));

        const squareX = dotPosition.x - (width / 3) - squarePad;
        const squareY = dotPosition.y - squarePad;

        const saturation = ((squareX) / squareSize) * 100;
        const variance = ((squareSize - squareY) / squareSize) * 100;


        const displayCornerX = 900;
        const displayCornerY = 100;
        const displayCornerSize = 100;

        const {r, g, b} = hsvToRgb(hue, saturation, variance); 
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.fillRect(displayCornerX, displayCornerY, displayCornerSize, displayCornerSize);

        ctx.font = "30px Courier New";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";

        ctx.fillText("H: " + hue, 1000, 270)
        ctx.fillText("S: " + saturation, 1000, 300)
        ctx.fillText("V: " + variance, 1000, 330)

    }, [dotAngle, dotPosition]);


    // function takes xy coordinates of point, determines the angle on colorwheel closest to point. 
    function getAngleFromCenter(mouseX, mouseY) { 
        const canvas = canvasRef.current;
   

        const ringCenterX = canvas.width / 6;
        const ringCenterY = canvas.height / 2;

        // Calculate angle using atan2
        const angle = Math.atan2(ringCenterY - mouseY, ringCenterX - mouseX);

        // Normalize to [0, 2π]
        const normalizedAngle = (angle + Math.PI) % (2 * Math.PI);

        return normalizedAngle;
    }


    function handleMouseDown(event) { 
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        

        if (mouseX < canvas.width / 3) { 

            setIsDraggingRing(true);
            setDotAngle(getAngleFromCenter(mouseX, mouseY));
            
            
        }
        else if (mouseX < 2 * canvas.width / 3) {

            setIsDraggingSquare(true);

            const leftBound = mouseX > (canvas.width / 3 + squarePad);
            const rightBound = mouseX < (2 * canvas.width / 3 - squarePad);
            const topBound = mouseY < (canvas.height - squarePad);
            const bottomBound = mouseY > (squarePad);

            if (leftBound && rightBound && topBound && bottomBound) { 
                setDotPosition({x: mouseX, y: mouseY});
            }
            else if (leftBound && rightBound) { 
                setDotPosition(prevPosition => ({x: mouseX, y: prevPosition.y}));
            }
            else if (topBound && bottomBound) { 
                setDotPosition(prevPosition => ({x: prevPosition.x, y: mouseY}));
            }
        }
    }

    function handleMouseMove(event) { 
        if (!(isDraggingRing || isDraggingSquare)) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (isDraggingRing) { 
            setDotAngle(getAngleFromCenter(mouseX, mouseY));
        }
        else if (isDraggingSquare) {


            const leftBound = mouseX > (canvas.width / 3 + squarePad);
            const rightBound = mouseX < (2 * canvas.width / 3 - squarePad);
            const topBound = mouseY < (canvas.height - squarePad);
            const bottomBound = mouseY > (squarePad);

            if (leftBound && rightBound && topBound && bottomBound) { 
                setDotPosition({x: mouseX, y: mouseY});
            }
            else if (leftBound && rightBound) { 
                setDotPosition(prevPosition => ({x: mouseX, y: prevPosition.y}));
            }
            else if (topBound && bottomBound) { 
                setDotPosition(prevPosition => ({x: prevPosition.x, y: mouseY}));
            }
        }
    }

    function handleMouseUp() { 
        setIsDraggingRing(false);
        setIsDraggingSquare(false);
    }




    return (
        <>
            <p>Sand</p>
            <canvas 
                ref={canvasRef}
                height="400" width="1200"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
        </>
    )
}


export default ColorWheel;