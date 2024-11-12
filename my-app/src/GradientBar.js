import { useRef, useEffect, useState } from 'react'

import { hsvToRgbString } from './colorFunctions';

function GradientBar({hsvValues}) {

    const canvasRef = useRef(null);
    const barHeight = 50;
    const width = 1200;

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



        if (hsvValues.length >= 2) { 



            for (let i = 0; i < dots.length; i++) { 
                const distanceAlongGradient = Math.min(Math.max(0, dots[i].x / canvas.width), canvas.width);
                gradient.addColorStop(distanceAlongGradient, hsvObjectToRgbString(hsvValues[i]));
            }



        }
        else { 
            gradient.addColorStop(0, "red");
            gradient.addColorStop(1, "blue");
        }


        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, barHeight);




        // draw the dot
        for (let i = 0; i < dots.length; i++) { 

            const dotX = dots[i].x;
            const dotY = dots[i].y;

            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(dotX, dotY, 33, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = hsvObjectToRgbString(hsvValues[i]);
            ctx.beginPath();
            ctx.arc(dotX, dotY, 30, 0, Math.PI * 2);
            ctx.fill();
        }




    }, [hsvValues, dots]);


    


    function hsvObjectToRgbString(hsv) { 
        return hsvToRgbString(hsv.h, hsv.s, hsv.v)
    }

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
        const threshold = 100;
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