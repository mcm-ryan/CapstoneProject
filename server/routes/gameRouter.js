const express = require('express');
const router = express.Router();
const Game = require('../modules/Game')
let game = new Game()
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function askQuestion(query) {
  
    return new Promise(resolve => readline.question(query, ans => {
        
        resolve(ans);
    }))
}
async function playGame(game){
  let move
  let playerTurn =false
  let playerMark = ''
  while(!game.state.isOver){
    playerMark = game.state.playerTurn ? 'X' : 'O'
    move = await askQuestion("Where do you want to put the " + playerMark + "\n")
    while(!game.handleTurn(move, playerTurn)) {
      /* Move not allowed redo*/
      move = await askQuestion("Where do you want to put the " + playerMark + "\n")

    }
    game.displayGrid()
    playerTurn = !playerTurn
  }
  console.log("Player " + playerMark + " Won!");
}
/* GET home page. */
router.get('/', async function(req, res, next) {
  const game = new Game()
  await askQuestion("Hey do you want to play a game?")
  await playGame(game)
  readline.close();
  res.send('gameOver')
  

});
router.post('/', async function(req, res, next) {
  const game = new Game(req.body.grid)
  console.log(req.body)
  let isWin = game.checkWinner()
  let message = isWin !== null ? isWin : 'Tie'
  let isOver = isWin!== null ? false : true
  res.status(200).json({'message': message, isOver})
  

});
router.post('/move', async function(req, res, next) {
  console.log(`user move `)
  console.log(req.body)

  let moveAccepted = false
  if(Object.keys(req.body).length ===0 ){
    res.send("Error, body is empty")
    return
  }
  let returnValue = {
    grid: [[]],
    winner: "",
    isAccepted : false

  }
  console.log(req.body)
  if(game.handleTurn(req.body.move)){
    returnValue.isAccepted = true
    console.log('User move accepted, proceed with grid changes');
  }
  // console.log('Game isOver : ' +game.isOver)
  if(game.state.isOver){
    returnValue = {'grid': game.state.grid, winner: game.checkWinner(), isAccepted: true}
    console.log('Winner is '+ game.checkWinner())
  }
  returnValue.grid = game.state.grid

  res.json(returnValue)

  

});

module.exports = router;
