const gameBoard = {};

function createPlayer (name, mark) {
  let playerWins = 0;
  const getPlayerWins = () => playerWins;
  const increasePlayerWins = () => ++playerWins;
  const resetPlayerWins = () => playerWins = 0;

  return { name, mark, getPlayerWins, increasePlayerWins, resetPlayerWins };
};  

const makePlayers = (function() {
  const playerOne = createPlayer("playerOne", "O");
  const playerTwo = createPlayer("playerTwo", "X");

  gameBoard.playerOne = playerOne;
  gameBoard.playerTwo = playerTwo;
})();

function creategameBoardSquare (row, column) {
  const squareId = `row${row}col${column}`;
  let currentMark = "";
  
  const getCurrentMark = () => currentMark;
  const changeCurrentMark = (newMark) => currentMark = newMark;
  const resetCurrentMark = () => currentMark = "";

  return { squareId, row, column, getCurrentMark, changeCurrentMark, resetCurrentMark };
};

gameBoard.squares = (function() {
// Create a 3x3 gameBoard with squares and add to gameBoard
  const gamesquares = [];

  for ( let row = 1; row < 4; row++ ) {
    for ( let column = 1; column < 4; column++ ) {
      gamesquares.push(creategameBoardSquare( row, column ));
    };
  };
  return gamesquares;
})();

const makeEndStates = ( function() {
  const ROW = "row";
  const COLUMN = "column"

  const validateRowOrColumn = function( rowOrColumn ) {
    if (( rowOrColumn <= 0 ) || ( rowOrColumn > 3 ) || ( isNaN( rowOrColumn ) )) {
      return false;
    }; 
    return true;
  };

  // intentionally verbose variable names, didn't want to conflict with square.row or square.column naming
  const getSquare = ( whichRow, whichColumn ) => gameBoard.squares.find( ( square ) => ( square.row === whichRow && square.column === whichColumn ));

  const firstDiagonal = [ getSquare(1, 1), getSquare(2, 2), getSquare(3, 3) ];
  const secondDiagonal = [ getSquare(1, 3), getSquare(2, 2), getSquare(3, 1) ];

  const checkLineWin = ( rowOrColumnNumber, whereToCheck ) => {
    if ( whereToCheck !== ROW && whereToCheck !== COLUMN ) {
      console.log(`Somehow whereToCheck is wrong. Current val is ${whereToCheck}`);
      return false;
    }; 
    const matchingSquares = gameBoard.squares.filter( ( square ) => square[whereToCheck] === rowOrColumnNumber );
    if (matchingSquares.length !== 3 || matchingSquares.some(square => square.getCurrentMark() === "")) {
      return false;
    };
    const firstMark = matchingSquares[0].getCurrentMark();
    return matchingSquares.every(square => square.getCurrentMark() === firstMark);
  };

  // both of these just reuse checkLineWin, but for readability they are separate calls.
  const checkRowWin = ( rowNumber ) => checkLineWin( rowNumber, ROW );
  const checkColumnWin = ( columnNumber ) => checkLineWin( columnNumber, COLUMN );

  const checkDiagonalWin = ( rowNumber, columnNumber ) => {    
    const currentSquare = getSquare( rowNumber, columnNumber );
    
      if ( !currentSquare || currentSquare.getCurrentMark() === "" ) {
        return false
      };

        // Check only the diagonal(s) that contain the current square
        if (firstDiagonal.includes(currentSquare)) {
          if (firstDiagonal.every(square => square.getCurrentMark() === currentSquare.getCurrentMark())) {
              return true;
          };
      };
      if (secondDiagonal.includes(currentSquare)) {
          if (secondDiagonal.every(square => square.getCurrentMark() === currentSquare.getCurrentMark())) {
              return true;
          };
      };
      return false;
  };

  const checkForWin = ( rowNumber, columnNumber ) => { 
    if ( !validateRowOrColumn( rowNumber ) ) {
      console.log(`Somehow rowNumber is wrong. Current val is ${rowNumber}`);
      return false;
    }; 
    if ( !validateRowOrColumn( columnNumber ) ) {
      console.log(`Somehow columnNumber is wrong. Current val is ${columnNumber}`);
      return false;
    }; 
    return ( checkRowWin( rowNumber ) || checkColumnWin( columnNumber ) || checkDiagonalWin ( rowNumber, columnNumber ) );
  }

  const checkForTie = () => ( gameBoard.squares.every( (square) => square.getCurrentMark() !== "" ));

  gameBoard.checkEndStates = { checkForWin, checkForTie };
})();

const makeGamePlay = (function() {
  const PLAYER_ONE = "playerOne";
  const PLAYER_TWO = "playerTwo";
  let whoseTurn = PLAYER_ONE;
  let isGameActive = true;

  const checkGameActive = () => isGameActive;
  const swapGameActive = () => isGameActive = !isGameActive;
  const getWhoseTurn = () => whoseTurn;
  const swapWhoseTurn = () => ( whoseTurn === PLAYER_ONE ) ? whoseTurn = PLAYER_TWO : whoseTurn = PLAYER_ONE;
  const getSquareById = ( matchId ) => gameBoard.squares.find( ( square ) => square.squareId === matchId );

  const playerTurn = ( squareId ) => {
    const square = getSquareById( squareId );
    const currentPlayer = gameBoard[getWhoseTurn()];

    if ( !checkGameActive() ) {
      return;
    };

    // if the block already has a mark alert player and force them to pic a new square
    if ( square.getCurrentMark() ) {
      alert("Invalid choice - That square is already marked.");
      return;
    };

    square.changeCurrentMark( currentPlayer.mark );
    gameBoard.displayController.updateElementDisplay( square.squareId, currentPlayer.mark );
    console.log(`${currentPlayer.name} marked ${square.squareId} with ${square.getCurrentMark()}. For debug player mark is ${currentPlayer.mark}`)

    if ( gameBoard.checkEndStates.checkForWin( square.row, square.column ) ) {
      console.log(`Player ${currentPlayer.name} has won!`);
      currentPlayer.increasePlayerWins();
      swapGameActive();
    };

    if ( gameBoard.checkEndStates.checkForTie() ) {
      console.log("It was a tie");
      swapGameActive();
    }
    swapWhoseTurn();
  }

  const resetAllSquareMarks = () => {
    gameBoard.squares.forEach( ( square ) => square.resetCurrentMark() );
    gameBoard.displayController.resetFullBoard();
    swapGameActive();
  }

  gameBoard.gamePlay = { playerTurn, resetAllSquareMarks, getWhoseTurn };
})();

const makeDisplayController = (function() {
  const ALL_SQUARES = ".game > *";

  const boardSquaresArray = document.querySelectorAll(ALL_SQUARES);

  for ( let square of boardSquaresArray ) {
    square.addEventListener("click", () => gameBoard.gamePlay.playerTurn( square.className ));
  };

  const updateElementDisplay = ( classToMatch , newContent ) => {
    const element = document.querySelector( `.${classToMatch}` );
    element.textContent = newContent;
  }

  const resetFullBoard = () => {
    for ( let square of boardSquaresArray ) square.textContent = "";
  }
  

  gameBoard.displayController = { updateElementDisplay, resetFullBoard };


})();
