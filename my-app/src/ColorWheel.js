import { useRef, useEffect, useState } from 'react'

function ColorWheel() { 

    const canvasRef = useRef(null);
    const [hue, setHue] = useState(100);

    const [dotPosition, setDotPosition] = useState({x: 0, y: 0});
    const [isDragging, setIsDragging] = useState(false);

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
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, height / 5, 0, Math.PI * 2);
        ctx.fill();


        // draw the dot
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(dotPosition.x, dotPosition.y, 30, 0, Math.PI * 2);
        ctx.fill();

    }, [dotPosition, hue]);




    function handleMouseDown(event) { 
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (mouseX < canvas.width / 2) { 
            setDotPosition({x: mouseX, y: mouseY});
            setIsDragging(true);
        }
    }

    function handleMouseMove(event) { 
        if (!isDragging) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (mouseX < canvas.width / 2) { 
            setDotPosition({x: mouseX, y: mouseY});
        }
    }

    function handleMouseUp(event) { 
        setIsDragging(false);
    }

    function handleMouseLeave(event) { 
        setIsDragging(false);
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
                onMouseLeave={handleMouseLeave}
            />
        </>
    )
}


export default ColorWheel;