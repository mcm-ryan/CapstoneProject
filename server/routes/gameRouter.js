const express = require('express');
const router = express.Router();
const Game = require('../models/Game')
const Room = require('../models/Room')
const uuid = require('uuid')

let rooms = [] /* Stores Room objects*/
  function askQuestion(query) {
  
    return new Promise(resolve => readline.question(query, ans => {
        
        resolve(ans);
    }))
}

/* Finds the next available room by finding the first non full room */
function findNextAvailableRoom(){
  return rooms.find(room => !room.isFull())
}

/* Finds a player's room based on the player's name */
function findPlayerRoom(player){
  return rooms.find(room => room.hasPlayer(player) )
}

/* NOTHING HERE. May Change*/
router.get('/', async function(req, res, next) {
});

/* Post Route /move used to process client move
   Requires the player to already be in a room
   Requires move sent through Post body */
router.post('/move', async function(req, res, next) {
  console.log(`Post /move `)
  console.log(rooms)
  let room = findPlayerRoom(req.headers.origin)
  /* Checks if client is inside a room */
  if(room === undefined){
    console.log("Player not in a room")
    res.status('200').json({message: "Player not in in a room"})
    return
  }
  let game = room.game
  if(Object.keys(req.body).length ===0 ){
    res.send("Error, body is empty")
    return
  }
  /* TO DO: Make sure that the move is sent in the correct format: {A/B/C}{0/1/2} such as 'A0' */
  if(req.body.move === null){
    res.status(401).json({message: 'Move not valid'})
    return
  }
  
  let returnValue = {
    grid: [[]],
    winner: "",
    isAccepted : false

  }

  /* Process user move and updates game state.
     If move is valid, returns updated state.
     If move not valid, no change in game grid*/
  if(game.handleTurn(req.body.move)){
    returnValue.isAccepted = true
    console.log('User move accepted, proceed with grid changes');
  }

  /* if game is Over, sends winner back to client */
  if(game.state.isOver){
    returnValue = {'grid': game.state.grid, winner: game.checkWinner(), isAccepted: true}
    console.log('Winner is '+ game.checkWinner())
  }

  returnValue.grid = game.state.grid
  /* Send information back to user */
  res.json(returnValue)
  /* TO DO: Game ended, delete room from rooms array */
  if(game.state.isOver){
    return
  // room = null
  // rooms.splice(rooms.indexOf(room), 1)
  }
});

/* reset Every room. TO DO: Only reset current game. */
router.get('/reset', function(req,res,next){
  console.log("GET /reset")
  rooms= []
  res.status(200).send('Successfully reset')
});

/* Route for client to join a room. Required before starting a game. */
router.get('/join', async function(req, res, next) {
  console.log("GET /join")
  let player = req.headers.origin
  let isInRoom = findPlayerRoom(player)
  if(isInRoom !== undefined){
    res.status('200').json({message: "Player already in a room"})
    return
  }
  let room = findNextAvailableRoom()

  if(room === undefined){
    room = new Room(uuid.v4())
    rooms.push(room)
  }
  /* Add player to the room, with a status of Not Ready.
     Client need to call /ready to set status to ready and start game */
  room.addPlayer({player, status:'Not Ready'})
  // if(room.numPlayers === 1){
  //   playerTurn = true
  // }
  console.log(player + ' just joined the room')
  console.log(room)
  
  res.status(200).json({roomID: room.roomId})
  

});
/* Route for client to set his status as ready. Once the two players are marked as ready, the game is created and can be played */
router.get('/ready', async function(req,res,next) {
  console.log("GET /ready")
  let player = req.headers.origin
  /* Find player room */
  const room = findPlayerRoom(player)
  if(room === undefined) {
    res.status('401').json({message: "Player not in a room"})
    return
  }
  /* Finds the index of the player inside the room. The index is then used to update the status of that player */
  let playerIndex = room.indexOfPlayer(player)
  /* Set player status to ready*/
  room.playersInRoom[playerIndex].status = 'Ready'
  let areAllPlayersReady = room.areAllReady()
  console.log(areAllPlayersReady)
  console.log(room)
  /* All players are not ready, don't start the game*/
  if(!areAllPlayersReady){
    res.status(200).json({message: 'Request taken in account, waiting for other player'})
    return
  }
  /* If there is no game created yet, start one and inform clients */
  if(room.game === null){
    room.startGame()
    res.status(200).json({message: "Game Started!"})
    return
  }
  /* Any subsequent calls to /ready will return Game already started */
  res.status(200).json({message: "Game already started"})
})
/* Main route to update clients every time interval defined in the client source file.
   The idea is that every T time, client makes a call to this route in order to retrieve the current state of the game. 
   This route is also used after a user makes a move, in order to wait for his turn.
   The player turn is determined based on the index of the player inside the room. */
router.get('/waitTurn',  async function(req,res,next) {
  console.log("GET /waitTurn")
  let player = req.headers.origin
  let room = findPlayerRoom(player)

  /* If the player is not in a room, game cannot be played */
  if(room === undefined){
    res.status(401).json({message: 'Player not in a room', playerTurn: false})
    return
  }
  /* Must have started the game through the /ready calls else game is null */
  if(room.game === null){
    res.status(200).json({message: 'Waiting for game to start', playerTurn: false})
    return
  }
  /* Finds the index of the current player in the room */
  let indexOfPlayer = room.indexOfPlayer(player)
  /* Room.game.state.playerTurn is a boolean used to track whose turn it is. We use that boolean, turn it to either 0 / 1 which are the possibles
     indexes for the player, in order to determine whose turn it is. Client only knows whether it is his turn or not.  */
  let playerTurn = room.game.state.playerTurn? 1 : 0
  /* If the game is over, let the client know. Clients should stop any subsequent calls to this route. (TO DO) */
  if(room.game.state.isOver){
    res.status(200).json({message: 'The winner has been decided' , playerTurn: false, grid: room.game.state.grid, winner: room.game.checkWinner()})
    return
  }

  /* Determines whose turn it is and sends back the updated game grid */
  if(indexOfPlayer === playerTurn){
    res.status(200).json({message: 'It is now your turn', playerTurn: true, grid: room.game.state.grid})
    return
  } else {
    res.status(200).json({message: 'Waiting on other player', playerTurn: false, grid: room.game.state.grid})
    return
  }

})

module.exports = router;
