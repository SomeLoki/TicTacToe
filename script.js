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
  const checkLineWin = ( marked, whereToCheck ) => {
    const matchingSquares = gameboard.squares.filter( ( square ) => square[whereToCheck] === marked );
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
  // check the two diagonal for the same mark

  gameboard.checkWinStates = { checkRowWin, checkColumnWin };
})();
