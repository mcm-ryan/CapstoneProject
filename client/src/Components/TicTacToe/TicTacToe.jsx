import React, { useState, useRef, useEffect } from 'react';
import './TicTacToe.css'; /* Import CSS styles for the TicTacToe component */
import circle_icon from '../Assets/circle.png'; /* Import circle icon image */
import cross_icon from '../Assets/cross.png'; /* Import cross icon image */

export const TicTacToe = ({ onBack }) => {
  // Define state variables
  const [roomID, setRoomID] = useState(null); /* State to store room ID */
  const [gameMessage, setGameMessage] = useState(''); /* State to display game messages */
  const [isReady, setIsReady] = useState(false); /* State to track player readiness */
  const [showHome, setShowHome] = useState(false); /* State to control display of home screen */

  // Function to go back to home screen
  const onPlay = () => {
    setShowHome(true);
  };

  // State variables for game logic
  const [grid, setGrid] = useState([['', '', ''], /* Game grid */
  ['', '', ''], /* Game grid */
  ['', '', ''] /* Game grid */
  ]);
  const [winner, setWinner] = useState(''); /* State to store winner */
  const [playerTurn, setPlayerTurn] = useState(false); /* State to track player's turn */

  // Ref for title element
  let titleRef = useRef(null);

  // Function to join a game room
  async function joinGame() {
    await fetch('http://localhost:3001/game/join', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then((res) => res.json()).then((res) => {
      setRoomID(res.roomID);
    });
  }

  // Function to start the game
  async function startGame(e) {
    e.target.classList.add('ready-clicked');
    setIsReady(true);
    await fetch('http://localhost:3001/game/ready', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json()).then((res) => {
      console.log(res);
    });
  }

  // Function to reset the game
  function reset() {
    // Reset all states and call the reset endpoint
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
      method: "GET",
    });
  }

  // Function to handle cell click in the grid
  const gridCellToggle = async (e, row, col) => {
    if (!playerTurn) return; // Do nothing if it is not player's turn
    const move = e.target.getAttribute('value'); // Get move
    // Send move to server
    fetch('http://localhost:3001/game/move/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ move: move, roomID: roomID })
    }).then((res) => res.json()).then(async (res) => {
      if (res.isAccepted) {
        setGrid(res.grid);
        if (res.winner !== '') {
          setWinner(res.winner);
        }
      }
    });
  };

  // Function to handle back button click
  const handleBack = () => {
    reset(); // Reset the game
    onBack(); // Go back to home screen
  };

  // Function to wait for player's turn
  async function waitForYourTurn() {
    if (roomID === null || winner !== '') return; // If no roomID or winner found, return
    // Fetch data from server
    fetch('http://localhost:3001/game/waitTurn/', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json()).then(async res => {
      setGameMessage(res.message); // Set game message
      if (res.grid) {
        setGrid(res.grid); // Update grid if available
      }
      if (res.playerTurn) {
        setPlayerTurn(res.playerTurn); // Set player's turn
      }
      if (res.winner) {
        setWinner(res.winner); // Set winner if available
      }
    });
  }

  // Use effect to update game UI based on winner
  useEffect(() => {
    if (winner === "X") {
      titleRef.current.innerHTML = 'Winner:   <img src=' + cross_icon + '>';
    } else if (winner === "O") {
      titleRef.current.innerHTML = 'Winner:   <img src=' + circle_icon + '>';
    }
  }, [winner]);

  // Call waitForYourTurn function every 5 seconds
  setTimeout(winner === '' ? waitForYourTurn : null, 5000);

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
