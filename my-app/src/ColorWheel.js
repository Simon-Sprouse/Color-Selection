import { useRef, useEffect, useState } from 'react'

function ColorWheel() { 

    const canvasRef = useRef(null);

    const [dotAngle, setDotAngle] = useState(0);
    const [dotPosition, setDotPosition] = useState({x:500, y:100});
    const [isDraggingRing, setIsDraggingRing] = useState(false);
    const [isDraggingSquare, setIsDraggingSquare] = useState(false);

    const squareSize = 200;

    useEffect(() => { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const width = canvas.width;
        const height = canvas.height;

        const centerX = width / 4;
        const centerY = height / 2;

        const radius = height / 2 - 10;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);

        const hueGradient = ctx.createConicGradient(-0.5 * Math.PI, centerX, centerY);

        for (let i = 0; i < 360; i++) { 
            hueGradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
        }

        // color wheel
        ctx.fillStyle = hueGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0 * Math.PI, 2 * Math.PI);
        ctx.fill();

        // create ring inside of color wheel
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(centerX, centerY, height / 3, 0, Math.PI * 2);
        ctx.fill();

        // display the current color in the middle of ring
        const hueQ = (dotAngle * (180 / Math.PI)) + (90);
        ctx.fillStyle = `hsl(${hueQ}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, height / 5, 0, Math.PI * 2);
        ctx.fill();


        // draw the dot
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(centerX + radius * Math.cos(dotAngle), centerY + radius * Math.sin(dotAngle), 33, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(centerX + radius * Math.cos(dotAngle), centerY + radius * Math.sin(dotAngle), 30, 0, Math.PI * 2);
        ctx.fill();






        // draw square
   
        const squareX = 3 * width / 4 - squareSize / 2;
        const squareY = height / 2 - squareSize / 2;
        ctx.fillStyle = "red";
        ctx.fillRect(squareX, squareY, squareSize, squareSize);


        // draw the dot
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(dotPosition.x, dotPosition.y, 33, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(dotPosition.x, dotPosition.y, 30, 0, Math.PI * 2);
        ctx.fill();


    }, [dotAngle, dotPosition]);


    // function takes xy coordinates of point, determines the angle on colorwheel closest to point. 
    function getAngleFromCenter(mouseX, mouseY) { 
        const canvas = canvasRef.current;
   

        const centerX = canvas.width / 4;
        const centerY = canvas.height / 2;

        // Calculate angle using atan2
        const angle = Math.atan2(centerY - mouseY, centerX - mouseX);

        // Normalize to [0, 2π]
        const normalizedAngle = (angle + Math.PI) % (2 * Math.PI);

        return normalizedAngle;
    }


    function handleMouseDown(event) { 
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        

        if (mouseX < canvas.width / 2) { 

            setIsDraggingRing(true);
            setDotAngle(getAngleFromCenter(mouseX, mouseY));
            
            
        }
        else {

            setIsDraggingSquare(true);

            const pad = (canvas.height - squareSize) / 2;

            const leftBound = mouseX > (canvas.width / 2 + pad);
            const rightBound = mouseX < (canvas.width - pad);
            const topBound = mouseY < (canvas.height - pad);
            const bottomBound = mouseY > (pad);

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
            const pad = (canvas.height - squareSize) / 2;

            const leftBound = mouseX > (canvas.width / 2 + pad);
            const rightBound = mouseX < (canvas.width - pad);
            const topBound = mouseY < (canvas.height - pad);
            const bottomBound = mouseY > (pad);

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
                height="400" width="800"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
        </>
    )
}


export default ColorWheel;