const gameboard = {};

function createPlayer (name, mark) {

  let playerWins = 0;
  const getPlayerWins = () => playerWins;
  const increasePlayerWins = () => ++playerWins;
  const resetPlayerWins = () => playerWins = 0;

  return { name, mark, getPlayerWins, increasePlayerWins, resetPlayerWins };

}  

const makePlayers = (function() {
  const playerOne = createPlayer("PlayerOne", "O");
  const playerTWo = createPlayer("playerTwo", "X");

  gameboard.playerOne = playerOne;
  gameboard.playerTWo = playerTWo;

  console.log(gameboard);
  console.log(gameboard.playerOne);
  console.log(gameboard.playerTWo);

})();

function createGameboardSquare (row, column) {
  const name = `row${row}col${column}`;

  let currentMark = "";
  const getCurrentMark = () => currentMark;
  const changeCurrentMark = (newMark) => (!currentMark) ? currentMark = newMark : alert("Invalid choice");
  const resetCurrentMark = () => currentMark = "";

  return { name, row, column, getCurrentMark, changeCurrentMark, resetCurrentMark };

}

const makeGameBoard = (function() {

  const gamesquares = [];

  for ( let row = 1; row < 4; row++ ) {
    for ( let column = 1; column < 4; column++ ) {
      gamesquares.push(createGameboardSquare( row, column ));
    }
  }
  gameboard.gamesquares = gamesquares;
  console.log(gameboard);
})();



