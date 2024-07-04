// object/elements declarations...
const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
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

    if (i <= 15) { // the 16th square at index 15 (0-15)(1-16)
      // turn all 2nd children's child (the svg file) of the squares from the 16th square and under to the color black...
      square.firstChild.firstChild.classList.add('black');
    }

    if (i >= 48) { // the 49th square at index 48 (48-63)(49-64)
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

// global variable declarations...
let startPositionId;
let draggedElement;


function dragStart(e) {
  console.log(e.target.parentNode.getAttribute('square-id'));
  startPositionId = e.target.parentNode.getAttribute('square-id'); // global variable initialization...
  draggedElement = e.target;

}

function dragOver(e) {
  e.preventDefault(); // prevent default action drag over...
  //console.log(e.target);
}


function dragDrop(e) {
  e.stopPropagation();

  draggedElement.firstChild.classList
  //console.log(draggedElement);
  const correctGo = draggedElement.firstChild.classList.contains(playerGo);
  console.log('playerGo', playerGo);
  console.log('e.target', e.target);
  //console.log('opponentGo', opponentGo);
  const taken = e.target.classList.contains('piece');
  const valid = checkIfValid(this);
  //const valid = checkIfValid(e.target.classList);
  const opponentGo = playerGo === 'white' ? 'black' : 'white'; // if white, change to black else: white...
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);
  console.log('opponentGo', opponentGo);


  // check if correct player, black/white...
  if (correctGo) {
    // cur_vid_time: 47:26 / 1:28:05
      if (takenByOpponent && valid) {
        e.target.parentNode.append(draggedElement); // append opponent's dragged chess piece... 
        e.target.remove(); // and remove current chess piece...
        changePlayer();
        return // exit if condition...exit function
      }

      // check to see that player doesn't try to go on this square because its taken...
      if (taken && !takenByOpponent) {
          infoDisplay.textContent = "you can't go here!";
          setTimeout(() => infoDisplay.textContent = "", 2000);
          return  // exit if condition...exit function
      }
      if (valid) {
        e.target.append(draggedElement);
        changePlayer();
        return // exit if condition...exit function
      }

  }

  // code below for if there's already a piece in that square...and that its the opponent's piece
  //e.target.parentNode.append(draggedElement); // drags the new svg into a square which is the parent node
  //e.target.remove();
  //e.target.append(draggedElement); // drags the new svg chess piece into an empty square...
  
  //call changePlayer()
}


function checkIfValid(target) {
  console.log('this output coming from func: checkIfValid', target);
                          // if target is a square        or if target is a chess piece that current play is landing on... 
  const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
  const startId = Number(startPositionId);   // in loc: 78 and loc: 84
  const piece = draggedElement.id;
  console.log('targetId', targetId);
  console.log('startId', startId);
  console.log('piece', piece);

/*
----------
NICE EXPLANATION for LOC:169 in switch(){}
If I drag a pawn at square id 8: (the first pawn) the startId is then 8. 
Whats the targetId? 8 + the (width(8) * 2) == 16  8 + 16 == 24 (the targetId)
This would equate to be a valid move...
Math is being used to essentially say which moves are valid...
A diagonal move with a pawn would not be a valid move...this would reflect in the math result...
Using the target id as the end result in the math computation...also using the startId and the width constant in the 
math computation.
----------
*/

  switch(piece) {
      case 'pawn' : // pawn logic
          const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
                                
          if (starterRow.includes(startId) && startId + width * 2 === targetId || 
          startId + width === targetId ||
          // checking to see if their is an opponent pawn when player is making a diagonal move (an attack)
          startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
          startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
          ) {
              return true;
          }
          break;
      case 'knight' : // knight logic 
       // how the knight moves: (add startId to the width * 2) + 1 (that L shape move)
          if (
            // this translates to valid moves for a knight...
            startId + width * 2 + 1 === targetId ||   // L shape...regular downward move
            startId + width * 2 - 1 === targetId ||   // backwards L shape...
            startId + width - 2 === targetId ||       // right-side up lying L long-side pointing left...
            startId + width + 2 === targetId ||       // right-side up lying L long-side pointing right...
            // these are so the knight can also move backwards...
            startId - width * 2 + 1 === targetId || // L shape...backward (upward )move landing to the right
            startId - width * 2 - 1 === targetId || // backwards L shape  (upward )move landing to the left
            startId - width - 2 === targetId ||  // upside-down lying L long-side pointing left...
            startId - width + 2 === targetId     // upside-down lying L long-side pointing right...
          ) {
            return true;
          }
          break;
          
      case 'bishop': // bishop logic... x-axis  y-axis
          if ( // startId = x width = y  + 1 = x+1  the math translates to the bishop's geometrically diagonal trajectory...
              // code establishes the navigation via the element's ids for traversing the geometric shape of the created object at hand, the chessboard.
              // -- diagonally forward moves...SE (south-east)
              startId + width + 1 === targetId || //          make sure a piece is not in the previous move's target position...
              start + width * 2 + 2 && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
              start + width * 3 + 3 && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild || 
              start + width * 4 + 4 && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild ||
              start + width * 5 + 5 && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild ||
              start + width * 6 + 6 && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild ||
              start + width * 7 + 7 && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`).firstChild ||
              
              // -- diagonally backward moves...NW (north-west)
              startId - width - 1 === targetId || //          make sure a piece is not in the previous move's target position...
              start - width * 2 - 2 && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild ||
              start - width * 3 - 3 && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild || 
              start - width * 4 - 4 && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild ||
              start - width * 5 - 5 && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild ||
              start - width * 6 - 6 && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild ||
              start - width * 7 - 7 && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`).firstChild ||
              // vid_time: 1:11:36 / 1:28:05 
              
              // -- diagonally forward moves...SW (south-wast)
              startId + width - 1 === targetId || //          make sure a piece is not in the previous move's target position...
              start + width * 2 - 2 && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
              start + width * 3 - 3 && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild || 
              start + width * 4 - 4 && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild ||
              start + width * 5 - 5 && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild ||
              start + width * 6 - 6 && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild ||
              start + width * 7 - 7 && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`).firstChid ||
              // vid_time: 1:12:36 / 1:28:05 

              // -- diagonally backward moves...NE (north-east)
              startId - width + 1 === targetId || //          make sure a piece is not in the previous move's target position...
              start - width * 2 + 2 && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild ||
              start - width * 3 + 3 && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild || 
              start - width * 4 + 4 && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild ||
              start - width * 5 + 5 && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild ||
              start - width * 6 + 6 && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild ||
              start - width * 7 + 7 && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`).firstChid
              // vid_time: 1:13:52 / 1:28:05 
          ) { 

              return true;
          }    
          break;  

          // cur_vid_time: 1:14:11 / 1:28:05 // rook logic next...

  }



} // end of checkIfValid() function scope... 









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



