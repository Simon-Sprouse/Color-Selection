import { useRef, useEffect, useState } from 'react'

import { hsvObjectToRgbString } from './colorFunctions';

function GradientBar({width, hsvValues, setPositions}) {

    const canvasRef = useRef(null);
    const barHeight = width / 16;
    // const width = 800;

    const dotSize = Math.floor(width / 36);
    const border = 3;

    const [isDragging, setIsDragging] = useState(false);
    const [dots, setDots] = useState([]);

    // initialize dots to store one dot for each color wheel
    useEffect(() => { 
        const initialDots = [];
        const numberOfDots = hsvValues.length;
        for (let i = 0; i < numberOfDots; i++) { 
            const dotObject = {x: (i / (numberOfDots-1)) * width, y:0, isDragging:false};
            initialDots.push(dotObject);
        
        }
        setDots(initialDots);

    }, [hsvValues.length]); 


    useEffect(() => { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createLinearGradient(0, barHeight, canvas.width, barHeight);


        const newPositions = [];

        if (hsvValues.length >= 2 && dots.length == hsvValues.length) { 


            for (let i = 0; i < hsvValues.length; i++) { 
                const distanceAlongGradient = Math.min(Math.max(0, dots[i].x / canvas.width), 1);
                const roundedDistance = Math.round(distanceAlongGradient * 100) / 100;
                newPositions.push(roundedDistance);
                gradient.addColorStop(distanceAlongGradient, hsvObjectToRgbString(hsvValues[i]));
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, barHeight);




            // draw the dot
            for (let i = 0; i < dots.length; i++) { 

                const dotX = dots[i].x;

                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(dotX, barHeight, dotSize + border, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = hsvObjectToRgbString(hsvValues[i]);
                ctx.beginPath();
                ctx.arc(dotX, barHeight, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }


        }

        else { 
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, barHeight);
            newPositions.push(0);
        }

        
        setPositions(newPositions);




    }, [hsvValues, dots]);


    


    

    function distance(a, b) { 
        return Math.sqrt((b.x - a.x)**2 + (b.y - a.y)**2);
    }



    function handleMouseDown(event) { 
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const mouseXY = {x: mouseX, y: mouseY};


        // find which dot is the closest to the mouse click
        const threshold = 200;
        let closestDot = -1; // index of closest dot
        let closestDistance = 100000;
        for (let i = 0; i < dots.length; i++) { 
            const dotX = dots[i].x;
            const dotY = dots[i].y;

            const dotXY = {x: dotX, y:dotY};

            const clickDistance = distance(dotXY, mouseXY);
            if (clickDistance < threshold && clickDistance < closestDistance) { 
                closestDot = i;
                closestDistance = clickDistance;
            }
            
        }

        // if a dot was clicked update dots state
        console.log(closestDot);
        if (closestDot != -1) {
            setIsDragging(true); // global dragging state
            setDots(prevDots => { 
                const newDots = [];
                for (let i = 0; i < prevDots.length; i++) { 
                    if (i == closestDot) { 
                        const clickedDot = {x: mouseX, y: mouseY, isDragging: true};
                        newDots.push(clickedDot);
                    }
                    else { 
                        newDots.push(prevDots[i]);
                    }
                }
                return newDots;
            })
        }
        

    }

    function handleMouseMove(event) { 
        if (!isDragging) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;




        setIsDragging(true); // global dragging state
        setDots(prevDots => { 
            const newDots = [];
            for (let i = 0; i < prevDots.length; i++) { 
                if (prevDots[i].isDragging == true) { 
                    const clickedDot = {x: mouseX, y: mouseY, isDragging: true};
                    newDots.push(clickedDot);
                }
                else {
                    newDots.push(prevDots[i]);
                }
            }
            return newDots;
        })
        

        
    }

    function handleMouseUp() { 
        setIsDragging(false);

        setDots(prevDots => { 
            const newDots = [];
            for (let i = 0; i < prevDots.length; i++) { 
                const clickedDot = {x: prevDots[i].x, y: prevDots[i].y, isDragging: false};
                newDots.push(clickedDot);
            }
            return newDots;
        })

    }





    return (
        <>
            {/* {hsvValues.map((value, index) => (
                <p key={index}>{JSON.stringify(value)}</p>
            ))} */}

            <canvas 
                ref={canvasRef} 
                height={barHeight * 2} 
                width={width}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                // onMouseLeave={handleMouseUp}
            ></canvas>
        </>
    )
}

export default GradientBar;