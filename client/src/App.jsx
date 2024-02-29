import React, { useState } from 'react';
import './App.css';
import Home from './Components/Home/Home.jsx'; // Import the Home component
import { TicTacToe } from './Components/TicTacToe/TicTacToe.jsx';

function App({onBack}) {

  const [currentGame, setCurrentGame] = useState(null); // null when no game is selected

  

  const playGame = (gameName) => { 
    setCurrentGame(gameName); // Set the current game based on the game selected
  };

  const backToHome = () => {
    setCurrentGame(null); // Set currentGame to null to switch back to Home component
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'Tic Talk Toe':
        return <TicTacToe onBack={backToHome}/>;
      // Add cases for other games here
      default:
        return <Home onPlay={playGame}/>;
    }
  };

  return (
    <div className="App">
      {currentGame ? renderGame() : <Home onPlay={playGame} />}
    </div>
  );
}

export default App;