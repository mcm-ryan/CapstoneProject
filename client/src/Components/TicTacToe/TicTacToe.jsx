import React, { useState, useRef, useEffect } from 'react';
import './TicTacToe.css';
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';

export const TicTacToe = ({ onBack }) => {
  // const delay = ms => new Promise(res => setTimeout(res, ms)); /* Delay use to ask server if it is player turn and update grid*/
  const [roomID, setRoomID] = useState(null)
  const [gameMessage, setGameMessage] = useState('')
  const [isReady, setIsReady] = useState(false)
  const [showHome, setShowHome] = useState(false);

  const onPlay = () => {
    setShowHome(true);
  };

  const [grid, setGrid] = useState([['', '', ''],     /*A0 A1 A2 */
  ['', '', ''],     /*B0 B1 B2 */
  ['', '', '']      /*C0 C1 C2*/
  ])
  const [winner, setWinner] = useState('')
  const [playerTurn, setPlayerTurn] = useState(false) /* Player 1 defaults to false*/
  /* Runs the waitForYourTurn Function every 5 sec. */
  setTimeout(winner === '' ? waitForYourTurn : null, 5000)
  useEffect(() => {
    // console.log(grid)
    // console.log(winner)
    if (winner === "X") {
      titleRef.current.innerHTML = 'Winner:   <img src=' + cross_icon + '>';
    } else if (winner === "O") {
      titleRef.current.innerHTML = 'Winner:   <img src=' + circle_icon + '>';
    }


  }, [winner])
  let titleRef = useRef(null);

  /* Call to server /join in order to join a room.*/
  async function joinGame() {

    await fetch('http://localhost:3001/game/join', {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      }
    }).then((res) => res.json()).then((res) => {
      console.log(res)
      /* Sets room ID to the id of the room the server put you in. */
      setRoomID(res.roomID)
    })
  }

  /* Runs after you joined a room. Sets the player status to ready. Once both players have set to ready, game will start. */
  async function startGame(e) {
    e.target.classList.add('ready-clicked')
    setIsReady(true)
    await fetch('http://localhost:3001/game/ready', {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },

    }).then((res) => res.json()).then((res) => {
      console.log(res)
      // setRoomID(res.roomID)

    })
  }

  function goHome() {


  }

  /* TO DO: Currently resets all rooms to null. Does not work properly and should only reset the current room to play again. */
  function reset() {
    setRoomID(null);
    setGameMessage('');
    setIsReady(false);
    setGrid([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
    setWinner('');
    setPlayerTurn(false);
    titleRef.current.innerHTML = 'Tic Talk Toe';

    fetch('http://localhost:3001/game/reset/', {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    })
  }

  // Function that runs on defined time interval to retrieve data changes from server, and decide whose turn it is
  async function waitForYourTurn() {
    if (roomID === null) {
      console.log('Dont run, no roomID')
      return
    }
    if (winner !== '') {
      console.log('Winner found, dont run again')
      return
    }
    fetch('http://localhost:3001/game/waitTurn/', {
      method: "GET", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json()).then(async res => {
      console.log(res)
      setGameMessage(res.message)
      // setPlayerTurn(res.wait)
      if (res.grid) {
        setGrid(res.grid)
      }
      if (res.playerTurn) {
        console.log('It is your turn, grid should update')

        setPlayerTurn(res.playerTurn)
      }
      if (res.winner) {
        setWinner(res.winner)
      }
    })
  }

  const gridCellToggle = async (e, row, col) => {
    /* Do nothing if it is not your turn */
    if (!playerTurn) return
    /* Sets move to grid value */
    const move = e.target.getAttribute('value')
    /* Call to server to handle move */
    fetch('http://localhost:3001/game/move/', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // mode: "cors", // no-cors, *cors, same-origin
      // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ move: move, roomID: roomID })
    }).then((res) => res.json()).then(async (res) => {
      if (res.isAccepted) {
        console.log("Move accepted , should update grid")
        console.log(res.grid)
        setGrid(res.grid)
        if (res.winner !== '') {
          setWinner(res.winner)
        }
        waitForYourTurn()
      }

    })

  }

  const handleBack = () => {
    reset();
    onBack();
  };

  /* TO DO: 
  Provide user feedback on what is going on. Currently only displays a message and requires user to go through the steps in order: Join game, then set ready.
  Need to separate in another page forcing the user to join a game first, then directing here to the lobby. */
  return (
    <div className='container'>
      <button className="back-button" onClick={handleBack}>&lt;</button>

      <h1 className='title' ref={titleRef}>Tic Talk Toe</h1>

      <div className='board'>
        <div className='row boxHeadersTopMargin'>
          <div className='boxHeaderTop'>A</div>
          <div className='boxHeaderTop'>B</div>
          <div className='boxHeaderTop'>C</div>
        </div>
        <div className='row '>
          <div className='col boxHeadersLeftMargin'>
            <div className='boxHeaderLeft'>0</div>
            <div className='boxHeaderLeft'>1</div>
            <div className='boxHeaderLeft'>2</div>
          </div>
          <div className='flex-wrap'>

            {grid.map((row, rowIndex) => {
              // console.log(row)
              let cellDivArr = grid[rowIndex].map((cell, columnIndex) => {
                let id = `box${rowIndex}${columnIndex}`
                let rowValue
                switch (rowIndex) {
                  case 0:
                    rowValue = 'A'
                    break

                  case 1:
                    rowValue = 'B'
                    break
                  case 2:
                    rowValue = 'C'
                    break
                  default:
                }
                let cellValue
                let cellIcon = ''
                if (grid[rowIndex][columnIndex] !== '') {
                  if (grid[rowIndex][columnIndex] === 'X') {
                    cellIcon = <img alt='X' src={cross_icon} />;
                  } else {
                    cellIcon = <img alt='X' src={circle_icon} />;
                  }
                }
                const colValue = columnIndex % 3

                cellValue = `${rowValue}${colValue}`
                // console.log(cellValue)
                return (<div className="boxes" id={id} value={cellValue} onClick={(e) => { gridCellToggle(e, rowIndex, columnIndex) }}>{cellIcon}</div>)
              })

              return (<div className='row'>{cellDivArr}</div>)
            })}
          </div>
        </div>
      </div>
      <div className='gameMessage'>{gameMessage}</div>

      <button className="game-button" onClick={reset} >Reset</button>
      <button className='game-button' onClick={joinGame}>Join Game</button>
      <button className='game-button' disabled={isReady} onClick={startGame}>Ready</button>
    </div>
  )
}
