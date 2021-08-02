//Tetris version 1.0---------------------------------------------------------------------------
const grid = document.querySelector('.gameGrid'); 
const startStopButton = document.querySelector("#startStopButton"); 
const score = document.querySelector(".score"); 
let squares = Array.from(document.querySelectorAll('.gameGrid div')); 
const colors = ['RoyalBlue', 'DarkSlateGrey', 'LightCoral', 'MediumSeaGreen', 'Peru']; 

const width = 10; 
let nextRandom = 0; 
let timer; 
let scoreCounter = 0; 

//all 5 tetris shapes---------------------------------------------------------------------------
const lShape = [[1, width+1, width*2+1, 2],
                [width, width+1, width+2, width*2+2],
                [1, width+1, width*2+1, width*2], 
                [width, width*2, width*2+1, width*2+2]
               ];

const zShape = [[width, width+1, width*2+1, width*2+2], 
                [width*2, width*2+1, width+1, width + 2], 
                [0, width, width+1, width*2+1],
                [1, width+1, width, width*2]
               ];
const blockShape = [[width, width+1, width*2, width*2+1],
                    [width, width+1, width*2, width*2+1],
                    [width, width+1, width*2, width*2+1],
                    [width, width+1, width*2, width*2+1]
                   ]; 

const longShape = [[1, width+1, width*2+1, width*3+1],
                   [width, width+1, width+2, width+3], 
                   [1, width+1, width*2+1, width*3+1],
                   [width, width+1, width+2, width+3]
                  ];

const tShape = [[0, 1, 2, width+1], 
                [1, width+1, width, width+2], 
                [1, width+1, width+2, width*2+1], 
                [1, width+1, width, width*2+1]
               ];

//all tetris shapes in array--------------------------------------------------------------------              
const shapes = [lShape, zShape, blockShape, longShape, tShape]; 

let currentPosition = 4; 
let currentRotation = 0; 
let random = Math.floor(Math.random() * shapes.length);
let current = shapes[random][currentRotation]; 

//draw the first rotation of the first shape (lShape first index)------------------------------- 
function drawShape() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add("tetrisShape")
        squares[currentPosition + index].style.backgroundColor = colors[random];
    })  
}

function undrawShape() { 
    current.forEach(index => {
        squares[currentPosition + index].classList.remove("tetrisShape");
        squares[currentPosition + index].style.backgroundColor = "";
    })
}

//let the shapes move down the grid-------------------------------------------------------------
function gravity() { 
    undrawShape()
    currentPosition += width; 
    drawShape()
    blockStop()
}

//let blocks stop at the bottom----------------------------------------------------------------- 
function blockStop() { 
    if (current.some(index => squares[currentPosition + index + width].classList.contains('bottom'))) { 
        current.forEach(index => squares[currentPosition + index].classList.add('bottom'));

//start new shape to fall down the grid--------------------------------------------------------- 
        random = nextRandom
        nextRandom = Math.floor(Math.random() * shapes.length);  
        current =  shapes[random][currentRotation]
        currentPosition = 4;
        drawShape();
        displayShape()
        addScore(); 
        gameOver()
    }
}

document.addEventListener('keyup', control);

//Assign function to keycode-------------------------------------------------------------------- 
function control(e) { 
  if(e.keyCode === 37) { 
      moveLeft()
  } else if (e.keyCode === 39) { 
      moveRight()
  } else if (e.keyCode === 38) { 
      changeShape()
  } else if (e.keyCode === 40) { 
    gravity();
  }
}

//make sure the shape can't pass through walls--------------------------------------------------- 
function moveLeft() { 
    undrawShape() 
    const isAtLeftSide = current.some(index => (currentPosition + index) % width === 0);

    if(!isAtLeftSide) currentPosition -=1;

    if(current.some(index => squares[currentPosition + index].classList.contains("bottom"))) { 
        currentPosition +=1;
    }
    drawShape(); 
}

function moveRight() { 
    undrawShape() 
    const isAtRightSide = current.some(index => (currentPosition + index +1) % width === 0); 
    if(!isAtRightSide) currentPosition +=1; 

    if(current.some(index => squares[currentPosition + index].classList.contains("bottom"))) { 
        currentPosition -=1; 
    }
    drawShape()
}

//change shapes-------------------------------------------------------------------------------------
function changeShape() { 
    undrawShape()
    currentRotation++;
    if(currentRotation === current.length) { 
        currentRotation = 0; 
    } 
    current = shapes[random][currentRotation]
    drawShape()
}


const displaySquares = document.querySelectorAll(".infoGrid div")
const displayWidth = 4; 
let displayIndex = 0; 


//the shapes without rotations----------------------------------------------------------------------- 
const upNextShape = [ 
    [1, displayWidth+1, displayWidth*2+1, 2], //Lshape
    [displayWidth, displayWidth+1, displayWidth*2+1, displayWidth*2+2],//Zshape
    [displayWidth, displayWidth+1, displayWidth*2, displayWidth*2+1],//BlockShape
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],//LongShape
    [0, displayWidth+1, displayWidth, displayWidth*2+1]//Tshape 
]

//display the shape in updateGrid-------------------------------------------------------------------
function displayShape() { 
    displaySquares.forEach(square => {
        square.classList.remove('tetrisShape');
        square.style.backgroundColor = ""
    })
    upNextShape[nextRandom].forEach(index => { 
        displaySquares[displayIndex + index].classList.add('tetrisShape'); 
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
};

//start and pauze the game--------------------------------------------------------------------------- 
startStopButton.addEventListener('click', () => { 
    if (timer) { 
        clearInterval(timer)
        timer = null; 
    } else{ 
        drawShape()
        timer = setInterval(gravity, 1000)
        nextRandom = Math.floor(Math.random()*shapes.length)
        displayShape(); 
    }
})

//addscore function + remove row from bottom and append back in---------------------------------------
function addScore() { 
    for (let i = 0; i < 199; i += width) { 
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('bottom'))) {
            scoreCounter += 100; 
            score.innerHTML = scoreCounter; 
            row.forEach(index => { 
            squares[index].classList.remove('bottom');
            squares[index].classList.remove('tetrisShape')
            squares[index].style.backgroundColor = "";
        });
            const squaresRemoved = squares.splice(i, width);
            console.log(squaresRemoved);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell)); 
       }    
    }
}

//game over function----------------------------------------------------------------------------------
function gameOver() { 
    if (current.some(index => squares[currentPosition + index].classList.contains('bottom'))) { 
        score.innerHTML = 'Game Over..'
        clearInterval(timer);
        if (window.confirm(`GAME OVER, your score is: > ${scoreCounter} < Do you want to play again?(press OK)`)) { 
            location.reload();
        } else {
           window.close()
        }
    }
}