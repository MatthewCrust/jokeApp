import React, { useState } from 'react';
import './JokeApp.css';

function JokeApp() {
  const [joke, setJoke] = useState('');
  const [jokeTwo, setJokeTwo] = useState('');
  const [jokeType, setJokeType] = useState('');
  const [jokeCategory, setJokeCategory] = useState('/Any');

  const fetchJoke = () => {
    let apiUrl = `https://v2.jokeapi.dev/joke${jokeCategory}${jokeType}`;
    setJokeTwo("");

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.type === 'twopart') {
          setJoke(`${data.setup}`);
          setJokeTwo(`${data.delivery}`)
        } else {
          setJoke(data.joke);
        }
      })
      .catch(error => {
        console.error('There was a problem fetching the joke:', error);
      });
  };

  return (
    <div className="container">
      <h1 className="title">Joke App</h1>
      {joke && (
        <div className="jokeContainer">
          <p className="jokeOnePart">{joke}</p>
          <p className="jokeTwoPart">{jokeTwo}</p>
        </div>
      )}
      <div className="filters">

        <div className='cat'>
          <label htmlFor="jokeCategory">Select Joke Category </label>
          <select
            className='select'
            id="jokeCategory"
            value={jokeCategory}
            onChange={e => setJokeCategory(e.target.value)}
          >
            <option value="/Any">Any</option>
            <option value="/Misc">Miscellaneous</option>
            <option value="/Programming">Programming</option>
            <option value="/Pun">Pun</option>
            <option value="/Dark">Dark</option>
          </select>
        </div>
        <div>
          <label htmlFor="jokeType">Select Joke Type </label>
          <select
            className='select'
            id="jokeType"
            value={jokeType}
            onChange={e => setJokeType(e.target.value)}
          >
            <option value="">Any</option>
            <option value="?type=single">Single Joke</option>
            <option value="?type=twopart">Two Part Joke</option>
          </select>
        </div>
      </div>
      <button className="button" onClick={fetchJoke}>Get Joke</button>
    </div>
  );
}

export default JokeApp;
