// object/elements declarations...
const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDIsplay = document.querySelector("#info-display");
const width = 8;

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
    square.innerHTML = startPiece; // insert the chess peices in each square...
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
