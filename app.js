// object/elements declarations...
const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDIsplay = document.querySelector("#info-display");
const width = 8;

// the chessgame start state...
let playerGo = 'black';
playerDisplay.textContent = 'black';




// array of 64 items...
const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook, 
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
];

// steps through array and creates a div for each item in array...
// classes and id attributes added dynamically at runtime...
function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement('div'); // creates square element/object...
    square.classList.add('square'); // create class square for above element...
    square.innerHTML = startPiece; // insert the chess pieces in each square...
    square.firstChild && square.firstChild.setAttribute('draggable', true);
    //square.firstChild?.setAttribute('draggable', true);
    square.setAttribute('square-id', i);
    square.classList.add('beige'); // create class square for above element...
    const row = Math.floor( (63 - i) / 8) + 1;
    if (row % 2 === 0) { // if every other row...
        square.classList.add(i % 2 === 0 ?  "beige" : "brown") // if every other square...then make it beige...
    } else {
        square.classList.add(i % 2 === 0 ?  "brown" : "beige") // do reverse...
    }

    if (i <= 15) { // the 16th square at index 15 (0-15)
      // turn all 2nd children's child (the svg file) of the squares from the 16th square and under to the color black...
      square.firstChild.firstChild.classList.add('black');
    }

    if (i >= 48) { // the 16th square at index 15 (0-15)
      // turn all 2nd children's child (the svg file) of the squares from the 16th square and under to the color black...
      square.firstChild.firstChild.classList.add('white');
    }




    gameBoard.append(square); // append each square to gameBoard...

  })

}

// call function to create the baord...
createBoard();


// grab all the squares and place in a list...
const allSquares = document.querySelectorAll(".square");
console.log(allSquares);

allSquares.forEach(square => {
  square.addEventListener('dragstart', dragStart); // call these functions when events detected...
  square.addEventListener('dragover', dragOver);
  square.addEventListener('drop', dragDrop);
});


let startPositionId;
let draggedElement;


function dragStart(e) {
  console.log(e.target.parentNode.getAttribute('square-id'));
  startPositionId = e.target.parentNode.getAttribute('square-id');
  draggedElement = e.target;

}

function dragOver(e) {
  e.preventDefault(); // prevent default action drag over...
  //console.log(e.target);
}


function dragDrop(e) {
  e.stopPropagation();

  console.log(e.target);
  const taken = e.target.classList.contains('piece');
  
  // code below for if there's already a piece in that square...and that its the opponent's piece
  //e.target.parentNode.append(draggedElement); // drags the new svg into a square which is the parent node
  //e.target.remove();
  //e.target.append(draggedElement); // drags the new svg chess piece into an empty square...
  
  //call changePlayer()
  changePlayer();
}

function changePlayer() {
  if (playerGo === "black") {
      reverseIds(); // call reverseIds() when its white player turn...
      playerGo = "white";
      playerDisplay.textContent = "white";
  } else {
      revertIds(); // call revertIds() when it's black player turn...
      playerGo = "black";
      playerDisplay.textContent = "black";
  }

}


// function to reverse ids of square elements (elements of class square)...when white player goes...
function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => 
      square.setAttribute('square-id', (width * width - 1) - i))  // (64 - 1 == 63) - i ( - 0 ) 
}                  // another way to look at it: replace i with (width * width - 1) vis-a-vis (64 - 1 == 63)

// function to revert ids back to normal (when its black's go)
function revertIds() {
  // cur_vid_time: 42:57 / 1:28:05
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => square.setAttribute('square-id', i)); // like loc:35...
}



