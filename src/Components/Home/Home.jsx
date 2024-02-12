import React from 'react';
import './Home.css'; // Make sure to link the CSS file
import tictacphoto from '../Assets/tictactoe_photo.png';


// Game Data
const games = [
    {
        name: 'Tic Talk Toe',
        imgSrc: tictacphoto, // Replace with actual image path
        playAction: () => console.log('Play TicTalk Toe') // Placeholder action
    },
    {
        name: 'Game 2',
        imgSrc: '/path/to/game2/image', // Replace with actual image path
        playAction: () => console.log('Play Game 2') // Placeholder action
    },
    // Add more games as placeholders
];

const Home = ({ onPlay }) => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Tic Talk Toe</h1>
                <nav className="header-nav">
                <div className="dropdown">
                        <button className="dropbtn">About</button>
                        <div className="dropdown-content">
                            <a href="#">Our Story</a>
                            <a href="#">How it Works</a>
                            <a href="#">Contact Us</a>
                        </div>
                    </div>
                    <button className="sign-up-btn">Sign Up</button>
                    <button className="sign-in-btn">Sign In</button>
                </nav>
            </header>
            <div className="game-grid">
                {games.map((game, index) => (
                    <div key={index} className="game-card">
                        <h3>{game.name}</h3>
                        <img src={game.imgSrc} alt={game.name} className="game-image"/>
                        <button className="play-button" onClick={() => onPlay(game.name)}>Play Game</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
