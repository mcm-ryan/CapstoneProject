import React, { useState, useRef, useEffect } from 'react';
import './TicTacToe.css';
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';

// Set 
let data = ["", "", "", "", "", "", "", "", ""];


export const TicTacToe = () => {

  let [count, setCount] = useState(0);
  const [apiResponse, setApiResponse] = useState('')
  const [grid, setGrid] = useState([['', '', ''],     /*A0 A1 A2 */
  ['', '', ''],     /*B0 B1 B2 */
  ['', '', '']      /*C0 C1 C2*/
  ])
  const [winner,setWinner] =useState('')
  const [playerTurn, setPlayerTurn] = useState(false) /* Player 1 defaults to false*/
  let [lock, setLock] = useState(false);
  useEffect(()=> { 
    console.log(grid)
    console.log(winner)
      setLock(true);
      if (winner==="X"){
        titleRef.current.innerHTML = 'Winner:   <img src=' + cross_icon + '>';
      } else if(winner ==="O"){
        titleRef.current.innerHTML = 'Winner:   <img src=' + circle_icon + '>';
      }
      

  }, [grid])
  let titleRef = useRef(null);
  let box00 = useRef(null);
  let box01 = useRef(null);
  let box02 = useRef(null);
  let box10 = useRef(null);
  let box11 = useRef(null);
  let box12 = useRef(null);
  let box20 = useRef(null);
  let box21 = useRef(null);
  let box22 = useRef(null);

  async function submitMove(){
    const data = {grid}
    await fetch('http://localhost:3001/game/', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // mode: "cors", // no-cors, *cors, same-origin
      // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data)
    }).then((res)=> res.json()).then((res)=> {
      console.log(res)
      setApiResponse(res.message)
      if(res.message === null) {
        return
      } else if(res.message !== 'Tie'){
        console.log('Winner decided')
        console.log(res.message)
        // won(res.message)
      }
    })
  }
  let box_array = [box00, box01, box02, box10, box11, box12, box20, box21, box22];
  
  const toggle = (e, num) => {
    if (lock) {
      return 0;
    }
    if (count % 2 === 0) {
      e.target.innerHTML = '<img src=' + cross_icon + '>';
      data[num] = "x";
      setCount(++count);
    } else {
      e.target.innerHTML = '<img src=' + circle_icon + '>';
      data[num] = "o";
      setCount(++count);
    }
    // checkWin();

  }

  // Function
  // const checkWin = () => {
  //   if (data[0] === data[1] && data[1] === data[2] && data[2] !== "") {
  //     won(data[2]);

  //   } else if (data[3] === data[4] && data[4] === data[5] && data[5] !== "") {
  //     won(data[5]);

  //   } else if (data[6] === data[7] && data[7] === data[8] && data[8] !== "") {
  //     won(data[8]);

  //   } else if (data[0] === data[3] && data[3] === data[6] && data[6] !== "") {
  //     won(data[6]);

  //   } else if (data[1] === data[4] && data[4] === data[7] && data[7] !== "") {
  //     won(data[7]);

  //   } else if (data[2] === data[5] && data[5] === data[8] && data[8] !== "") {
  //     won(data[8]);

  //   } else if (data[0] === data[4] && data[4] === data[8] && data[8] !== "") {
  //     won(data[8]);

  //   } else if (data[0] === data[1] && data[1] === data[2] && data[2] !== "") {
  //     won(data[2]);

  //   } else if (data[2] === data[4] && data[4] === data[6] && data[6] !== "") {
  //     won(data[6]);

  //   }
  // }

  // Func to update the UI to reflect the winner of a game and lock the game to prevent further interactions
  
  // Func to update the UI to reset tic tac toe board and unlock it, allowing for interaction
  const reset = () => {
    setLock(false);
    data = ["", "", "", "", "", "", "", "", ""];
    titleRef.current.innerHTML = 'Tic Talk Toe';
    box_array.forEach((e)=>{
     e.current.innerHTML = "";
    })
  }

  const gridCellToggle= async (e, row, col) => {
    const move = e.target.getAttribute('value') 
    console.log(e.target.getAttribute('value'))
    console.log("Move is " + move)
    fetch('http://localhost:3001/game/move/', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // mode: "cors", // no-cors, *cors, same-origin
      // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({move})
    }).then((res)=> res.json()).then((res)=> {
      console.log(res)
      console.log("reply back")
      if (res.isAccepted){
        console.log("Move accepted , should update grid")
        console.log(res.grid)
        setGrid(res.grid)
        setPlayerTurn(!playerTurn)
        if(res.winner !== ''){
          setWinner(res.winner)
        }
      }
      if (playerTurn) {
        e.target.innerHTML = '<img src=' + cross_icon + '>';
      } else {
        e.target.innerHTML = '<img src=' + circle_icon + '>';
      }
    })
    // if (count % 2 === 0) {
    //   e.target.innerHTML = '<img src=' + cross_icon + '>';
    //   let tempGrid = grid
    //   tempGrid[row][col] = 'X'
    //   setGrid(tempGrid)
    //   setCount(++count);
    // } else {
    //   e.target.innerHTML = '<img src=' + circle_icon + '>';
    //   let tempGrid = grid
    //   tempGrid[row][col] = 'O'
    //   setGrid(tempGrid)
    //   setCount(++count);
    // }
  }
  return (
    <div className='container'>
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
          switch  (rowIndex){
            case 0: 
            rowValue='A'
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
          const colValue = columnIndex % 3
          
          cellValue = `${rowValue}${colValue}`
          // console.log(cellValue)
          return (<div className="boxes" id={id} value={cellValue} onClick={(e) => { gridCellToggle(e, rowIndex, columnIndex) }}></div>)
        })
        
        return (<div className='row'>{cellDivArr}</div>)
      })}
      </div>
      </div>
      </div> 
      
      <button className="reset" onClick={()=>{reset()}}>Reset</button>
      <button className='reset' onClick={submitMove}>Submit current grid</button>
    </div>
  )
}
