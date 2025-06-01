const gameboard = {};

function createPlayer (name, mark) {

  let playerWins = 0;
  const getPlayerWins = () => playerWins;
  const increasePlayerWins = () => ++playerWins;
  const resetPlayerWins = () => playerWins = 0;

  return { name, mark, getPlayerWins, increasePlayerWins, resetPlayerWins };

}  

const makePlayers = (function() {
// create two players and add to the gameboard
  const playerOne = createPlayer("PlayerOne", "O");
  const playerTwo = createPlayer("playerTwo", "X");

  gameboard.playerOne = playerOne;
  gameboard.playerTWo = playerTwo;

  console.log(gameboard);
  console.log(gameboard.playerOne);
  console.log(gameboard.playerTwo);

})();

function createGameboardSquare (row, column) {
  const squareId = `row${row}col${column}`;

  let currentMark = "";
  const getCurrentMark = () => currentMark;
  // check if there is an existing mark before changing it
  const changeCurrentMark = (newMark) => (!currentMark) ? currentMark = newMark : alert("Invalid choice");
  const resetCurrentMark = () => currentMark = "";

  return { squareId, row, column, getCurrentMark, changeCurrentMark, resetCurrentMark };

}

const makeGameBoard = (function() {
// Create a 3x3 gameboard with squares and add to gameboard
  const gamesquares = [];

  for ( let row = 1; row < 4; row++ ) {
    for ( let column = 1; column < 4; column++ ) {
      gamesquares.push(createGameboardSquare( row, column ));
    }
  }
  gameboard.squares = gamesquares;
  console.log(gameboard);
})();

const makeWinStates = ( function() {
  // check if all 3 in the same row or column have the same mark
  const checkLineWin = ( rowOrColumnNumber, whereToCheck ) => {
    if ( whereToCheck !== "row" && whereToCheck !== "column" ) {
      alert(`Somehow whereToCheck is wrong. Current val is ${whereToCheck}`);
      return
    } 
    const matchingSquares = gameboard.squares.filter( ( square ) => square[whereToCheck] === rowOrColumnNumber );
    // must have 3 squares, none of them empty
    if (matchingSquares.length !== 3 || matchingSquares.some(square => square.getCurrentMark() === "")) {
      return false;
    }
    const firstMark = matchingSquares[0].getCurrentMark();
    return matchingSquares.every(square => square.getCurrentMark() === firstMark);
  };

  // both of these just reuse checkLineWin, but for readability they are separate calls.
  const checkRowWin = ( markedRow )  => {
    return checkLineWin( markedRow, "row" );
  };

  const checkColumnWin = ( markedColumn )  => {
    return checkLineWin( markedColumn, "column" );
  };
  const getSquare = ( whichRow, whichColumn, ) => {
    // return the square the has the specific row and column
    // intentionally verbose variable names, didn't want to conflict with square.row or square.column naming
    if (( whichRow <= 0 ) || ( whichRow > 3 ) || ( isNaN( whichRow ) )) {
      alert(`Somehow whichRow is wrong. Current val is ${whichRow}`);
      return
    } 
    if (( whichColumn <= 0 ) || ( whichColumn > 3 ) || ( isNaN( whichColumn ) )) {
      alert(`Somehow whichColumn is wrong. Current val is ${whichColumn}`);
      return
    } 
    return gameboard.squares.find( ( square ) => ( square.row === whichRow && square.column === whichColumn ));
  }

    // inelegant maybe but I need square 1, 5, 9 for first diag, 3, 5, 7 for second. It would be overly complicated to .map() two coordinate arrays.
  function getFirstDiagonalArray() {
    const firstDiagonal = [];
    firstDiagonal.push(getSquare( 1, 1 ));
    firstDiagonal.push(getSquare( 2, 2 ));
    firstDiagonal.push(getSquare( 3, 3 ));
    return firstDiagonal;
  }

  function getSecondDiagonalArray() {
    const secondDiagonal = [];
    secondDiagonal.push(getSquare( 1, 3 ));
    secondDiagonal.push(getSquare( 2, 2 ));
    secondDiagonal.push(getSquare( 3, 1 ));
    return secondDiagonal;
  }

  const checkDiagonalWin = ( markedRow, markedColumn ) => {
    
    const firstDiagonal = getFirstDiagonalArray();
    const secondDiagonal = getSecondDiagonalArray();
    const currentSquare = getSquare( markedRow, markedColumn );
    
      if ( !currentSquare || currentSquare.getCurrentMark() === "" ) {
        return false
      };

        // Check only the diagonal(s) that contain the current square
        if (firstDiagonal.includes(currentSquare)) {
          if (firstDiagonal.every(square => square.getCurrentMark() === currentSquare.getCurrentMark())) {
              return true;
          }
      }
      if (secondDiagonal.includes(currentSquare)) {
          if (secondDiagonal.every(square => square.getCurrentMark() === currentSquare.getCurrentMark())) {
              return true;
          }
      }
      return false;
  }
  gameboard.checkWinStates = { checkRowWin, checkColumnWin, checkDiagonalWin };
})();



