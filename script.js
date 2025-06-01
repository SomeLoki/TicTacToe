const gameBoard = {};

function createPlayer (name, mark) {

  let playerWins = 0;
  const getPlayerWins = () => playerWins;
  const increasePlayerWins = () => ++playerWins;
  const resetPlayerWins = () => playerWins = 0;

  return { name, mark, getPlayerWins, increasePlayerWins, resetPlayerWins };

};  

const makePlayers = (function() {
// create two players and add to the gameBoard
  const playerOne = createPlayer("playerOne", "O");
  const playerTwo = createPlayer("playerTwo", "X");

  gameBoard.playerOne = playerOne;
  gameBoard.playerTwo = playerTwo;
})();

function creategameBoardSquare (row, column) {
  const squareId = `row${row}col${column}`;

  let currentMark = "";
  const getCurrentMark = () => currentMark;
  // check if there is an existing mark before changing it
  const changeCurrentMark = (newMark) => (!currentMark) ? currentMark = newMark : console.log("Invalid choice");
  const resetCurrentMark = () => currentMark = "";

  return { squareId, row, column, getCurrentMark, changeCurrentMark, resetCurrentMark };

};

const makegameBoard = (function() {
// Create a 3x3 gameBoard with squares and add to gameBoard
  const gamesquares = [];

  for ( let row = 1; row < 4; row++ ) {
    for ( let column = 1; column < 4; column++ ) {
      gamesquares.push(creategameBoardSquare( row, column ));
    };
  };
  gameBoard.squares = gamesquares;
})();

const makeEndStates = ( function() {
  // check if all 3 in the same row or column have the same mark
  const checkLineWin = ( rowOrColumnNumber, whereToCheck ) => {
    if ( whereToCheck !== "row" && whereToCheck !== "column" ) {
      console.log(`Somehow whereToCheck is wrong. Current val is ${whereToCheck}`);
      return false;
    }; 
    const matchingSquares = gameBoard.squares.filter( ( square ) => square[whereToCheck] === rowOrColumnNumber );
    // must have 3 squares, none of them empty
    if (matchingSquares.length !== 3 || matchingSquares.some(square => square.getCurrentMark() === "")) {
      return false;
    };
    const firstMark = matchingSquares[0].getCurrentMark();
    return matchingSquares.every(square => square.getCurrentMark() === firstMark);
  };

  // both of these just reuse checkLineWin, but for readability they are separate calls.
  const checkRowWin = ( rowNumber )  => {
    return checkLineWin( rowNumber, "row" );
  };

  const checkColumnWin = ( columnNumber )  => {
    return checkLineWin( columnNumber, "column" );
  };

  const validateRowOrColumn = function( rowOrColumn ) {
    if (( rowOrColumn <= 0 ) || ( rowOrColumn > 3 ) || ( isNaN( rowOrColumn ) )) {
      return false;
    }; 
    return true;
  };
  
  const getSquare = function( whichRow, whichColumn ) {
    // return the square the has the specific row and column
    // intentionally verbose variable names, didn't want to conflict with square.row or square.column naming
    if ( !validateRowOrColumn( whichRow ) ) {
      console.log(`Somehow whichRow is wrong. Current val is ${whichRow}`);
      return;
    }; 
    if ( !validateRowOrColumn( whichColumn ) ) {
      console.log(`Somehow whichColumn is wrong. Current val is ${whichColumn}`);
      return;
    }; 
    return gameBoard.squares.find( ( square ) => ( square.row === whichRow && square.column === whichColumn ));
  };

    // inelegant maybe but I need square 1, 5, 9 for first diag, 3, 5, 7 for second. It would be overly complicated to .map() two coordinate arrays.
  function getFirstDiagonalArray() {
    const firstDiagonal = [];
    firstDiagonal.push(getSquare( 1, 1 ));
    firstDiagonal.push(getSquare( 2, 2 ));
    firstDiagonal.push(getSquare( 3, 3 ));
    return firstDiagonal;
  };

  function getSecondDiagonalArray() {
    const secondDiagonal = [];
    secondDiagonal.push(getSquare( 1, 3 ));
    secondDiagonal.push(getSquare( 2, 2 ));
    secondDiagonal.push(getSquare( 3, 1 ));
    return secondDiagonal;
  };

  const checkDiagonalWin = ( rowNumber, columnNumber ) => {
    
    const firstDiagonal = getFirstDiagonalArray();
    const secondDiagonal = getSecondDiagonalArray();
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

  const checkForTie = () => {
    // check if every square is marked.
    return ( gameBoard.squares.every( (square) => square.getCurrentMark() !== "" ))
  };

  gameBoard.checkEndStates = { checkForWin, checkForTie };
})();

const makeGamePlay = (function() {
  const PLAYER_ONE = "playerOne";
  const PLAYER_TWO = "playerTwo";

  let whoseTurn = PLAYER_ONE;

  const getWhoseTurn = () => whoseTurn;
  const swapWhoseTurn = () => ( whoseTurn === PLAYER_ONE ) ? whoseTurn = PLAYER_TWO : whoseTurn = PLAYER_ONE;
  const getSquareById = ( matchId ) => gameBoard.squares.find( ( square ) => square.squareId === matchId );

  const playerTurn = ( squareId ) => {
    const square = getSquareById( squareId );
    const currentPlayer = gameBoard[getWhoseTurn()];

    // if the block already has a mark alert player and force them to pic a new square
    if ( square.getCurrentMark() ) {
      alert("Invalid choice - That square is already marked.");
      return;
    };

    square.changeCurrentMark( currentPlayer.mark );
    console.log(`${currentPlayer.name} marked ${square.squareId} with ${square.getCurrentMark()}. For debug player mark is ${currentPlayer.mark}`)

    if ( gameBoard.checkEndStates.checkForWin( square.row, square.column ) ) {
      console.log(`Player ${currentPlayer.name} has won!`);
      currentPlayer.increasePlayerWins();
      // add reset logic later right now 
    };

    if ( gameBoard.checkEndStates.checkForTie() ) {
      console.log("It was a tie");
    }

    swapWhoseTurn();
  }

  gameBoard.gamePlay = { playerTurn };
  console.log(gameBoard);
})();

