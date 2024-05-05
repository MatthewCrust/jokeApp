import React, { useState, useEffect } from 'react';
import './JokeApp.css';

function JokeApp() {
  const [joke, setJoke] = useState('');
  const [jokeTwo, setJokeTwo] = useState('');
  const [jokeType, setJokeType] = useState('');
  const [jokeCategory, setJokeCategory] = useState('/Any');
  const [favorites, setFavorites] = useState([]);
  const [bgColor, setBgColor] = useState('#000000');
  const [profile, setProfile] = useState({
    username: '',
    apiCalls: 0
  });

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('profile'));
    if (savedProfile) {
      setProfile(savedProfile);
    } else {
      setProfile({ username: '', apiCalls: 0 });
    }
  }, []);
  

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  const fetchJoke = () => {
    let apiUrl = `https://v2.jokeapi.dev/joke${jokeCategory}${jokeType}`;
    setProfile(prevProfile => ({ ...prevProfile, apiCalls: prevProfile.apiCalls + 1 }));
    setJokeTwo('');

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

  const addToFavorites = () => {
    const newFavorite = { joke, jokeTwo };
    setFavorites([...favorites, newFavorite]);
  };

  const changeBgColor = () => {
    const newColor = prompt("Enter a color (hexadecimal or CSS color name):", bgColor);
    if (newColor !== null && newColor !== '') {
      setBgColor(newColor);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
      apiCalls: prevProfile.apiCalls
    }));
  };
  

  return (
    <div className="container" style={{ backgroundColor: bgColor }}>
      <div className="profileContainer">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={profile.username}
          onChange={handleProfileChange}
        />
        <p>API Calls: {profile.apiCalls}</p>
      </div>
      <button className="colorButton" onClick={changeBgColor}>Change Background Color</button>
      <h1 className="title">Joke App</h1>
      {joke && (
        <div className="jokeContainer">
          <p className="jokeOnePart">{joke}</p>
          <p className="jokeTwoPart">{jokeTwo}</p>
          <button className="button" onClick={addToFavorites}>Add to Favorites</button>
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
      <div>
        <button className="button" onClick={fetchJoke}>Get Joke</button>
      </div>
      {favorites.length > 0 && (
        <div className="favoritesContainer">
          <h2>Favorites</h2>
          <div className="favoritesList">
            {favorites.map((fav, index) => (
              <div key={index} className="favoriteJoke">
                <p>{fav.joke}</p>
                {fav.jokeTwo && <p>{fav.jokeTwo}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default JokeApp;
