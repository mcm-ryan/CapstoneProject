/**
 * 
 * @module server/modules/Room
 */

const Game = require('../modules/Game')
/**
 * 
 * 
 */

/**
 * Represents the Lobby
 * @class
 */
class Room {

    /**
     * 
     * @param {object} id 
     * 
     */
    constructor(id) {
        this.roomId = id,
            this.roomSize = 2,
            this.playersInRoom = [],
            this.game = null,
            this.status = 'inactive',
            this.numPlayers = 0
    }
    isFull() {
        return this.playersInRoom.length === this.roomSize
    }
    isGameGoing() {
        return this.game !== null
    }
    startGame() {
        this.game = new Game()
    }
    areAllReady() {
        return this.playersInRoom.every(({ player, status }) => {
            return status === 'Ready'
        })
    }
    hasPlayer(playerName) {
        let hasPlayerBool = false
        this.playersInRoom.forEach(({ player, status }) => {
            if (player === playerName) {
                hasPlayerBool = true
            }
        })
        return hasPlayerBool
    }
    indexOfPlayer(playerName) {
        let playerIndex = -1
        this.playersInRoom.forEach(({ player, status }, index) => {
            if (player === playerName) {
                playerIndex = index
            }
        })
        return playerIndex
    }
    addPlayer(player) {
        if (this.isFull()) {
            console.log("Room full cannot add players")
            return false
        }
        this.playersInRoom.push(player)
        this.numPlayers += 1
        return true
    }
    removePlayer(player) {
        let index = this.playersInRoom.indexOf(player)
        this.playersInRoom.splice(index, 1)
    }
    clearRoom() {

    }
}
module.exports = Room