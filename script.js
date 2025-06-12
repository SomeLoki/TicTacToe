const gameBoard = {};

function createPlayer (name, mark) {
  let playerWins = 0;
  const getPlayerWins = () => playerWins;
  const resetPlayerWins = () => playerWins = 0;
  const increasePlayerWins = () => {
    ++playerWins;
    gameBoard.displayController.updatePlayerScore( name );
  }

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
  const getSquare = ( whichRow, whichColumn ) => gameBoard.squares.find( ( square ) => ( square.row === whichRow && square.column === whichColumn ));
  const firstDiagonal = [ getSquare(1, 1), getSquare(2, 2), getSquare(3, 3) ];
  const secondDiagonal = [ getSquare(1, 3), getSquare(2, 2), getSquare(3, 1) ];
  const validateRowOrColumn = function( rowOrColumn ) {
    if (( rowOrColumn <= 0 ) || ( rowOrColumn > 3 ) || ( isNaN( rowOrColumn ) )) {
      return false;
    }; 
    return true;
  };

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
  const getSquareById = ( matchId ) => gameBoard.squares.find( ( square ) => square.squareId === matchId );
  const swapWhoseTurn = () => {
    ( whoseTurn === PLAYER_ONE ) ? whoseTurn = PLAYER_TWO : whoseTurn = PLAYER_ONE;
    gameBoard.displayController.updateTurnDisplay();
  }

  const playerTurn = ( squareId ) => {
    const square = getSquareById( squareId );
    const currentPlayer = gameBoard[getWhoseTurn()];
    if ( !checkGameActive() ) {
      console.log( !checkGameActive(), "this ran" );
      return;
    };

    if ( square.getCurrentMark() ) {
      alert("Invalid choice - That square is already marked.");
      return;
    };

    square.changeCurrentMark( currentPlayer.mark );
    gameBoard.displayController.updateElementDisplay( square.squareId, currentPlayer.mark );
    swapWhoseTurn();

    if ( gameBoard.checkEndStates.checkForWin( square.row, square.column ) ) {
      gameBoard.displayController.showEndOfGame(`Player ${currentPlayer.name} has won!`);
      currentPlayer.increasePlayerWins();
      swapGameActive();
      return;
    };

    if ( gameBoard.checkEndStates.checkForTie() ) {
      gameBoard.displayController.showEndOfGame("It was a tie");
      swapGameActive();
      return;
    };
  };

  const resetGameBoard = () => {
    gameBoard.squares.forEach( ( square ) => square.resetCurrentMark() );
    gameBoard.displayController.resetFullBoard();
    swapGameActive();
  };

  gameBoard.gamePlay = { playerTurn, resetGameBoard, getWhoseTurn };
})();

const makeDisplayController = (function() {
  const allSquares = document.querySelectorAll(".game > *");
  const TURN_DISPLAY = "turn-display";
  const dispMsg = document.querySelector(".message");
  const dispModal = document.querySelector("dialog");
  const resetButton = document.querySelector(".reset");

  const updateTurnText = () => `It is ${gameBoard.gamePlay.getWhoseTurn()}'s turn`;
  const updateTurnDisplay = () => updateElementDisplay( TURN_DISPLAY, updateTurnText() );
  const updatePlayerScore = ( player ) => updateElementDisplay ( `${player} > .score`, `Wins: ${gameBoard[player].getPlayerWins()}` );
  const updateEndOfGameMessage = ( newText ) => dispMsg.textContent = newText;
  const resetFullBoard = () => allSquares.forEach( ( square ) => square.textContent = "" );

  const updateElementDisplay = ( classToMatch , newContent ) => {
    const element = document.querySelector( `.${classToMatch}` );
    element.textContent = newContent;
  };

  const showEndOfGame = ( message ) => {
    updateEndOfGameMessage( message );
    dispModal.showModal();
  }

  gameBoard.displayController = { updateElementDisplay, resetFullBoard, updateTurnDisplay, updatePlayerScore, showEndOfGame };

  resetButton.addEventListener("click", () => {
    gameBoard.gamePlay.resetGameBoard()
    dispModal.close();  
  });

  for ( let square of allSquares ) {
    square.addEventListener("click", () => gameBoard.gamePlay.playerTurn( square.className ));
  };
})();

const initializeDisplays = ( function () {
  gameBoard.displayController.updateTurnDisplay()
  gameBoard.displayController.updatePlayerScore( "playerOne");
  gameBoard.displayController.updatePlayerScore( "playerTwo");
  gameBoard.displayController.updateElementDisplay( "playerOne > .name", "Player One" );
  gameBoard.displayController.updateElementDisplay( "playerTwo > .name", "Player Two" );
})();