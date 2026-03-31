import React, { useState,useEffect } from 'react'
import Search from './components/search'
import { use } from 'react';

const API_BASE_URL = 'https://www.omdbapi.com';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY ;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async (query = "the") => {
    isLoading(true);
    setErrorMessage('');
    try {
      const endpoint = `${API_BASE_URL}/?apikey=${API_KEY}&s=${query}&type=movie`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to fetch movies`);
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.error|| 'No movies found')
        setMoviesList([]);
        return;
      }

      setMoviesList(data.Search||[]);
    } catch (error) {
    
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  

  useEffect(() => {
    fetchMovies(searchTerm || "avengers");
  },[searchTerm]);
  return (
    <main className="min-h-screen relative bg-primary bg-hero-pattern bg-cover bg-center bg-no-repeat">
      
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Movies Banner"/>
          <h1>Find Your <span className="text-gradient" >Movies</span> Which You Enjoy</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ?  (
            <p className="text-white ">Loading......</p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ): (
            <ul>
              {moviesList.map((movie) => (
                <p key={movie.imdbID} className="text-white">{movie.Title}</p>
              ))}
            </ul>
          )}
          </section>
      </div>
    </main>
  )
}

export default App