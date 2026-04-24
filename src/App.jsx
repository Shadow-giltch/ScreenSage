import React, { useState,useEffect } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'


const API_BASE_URL = 'https://www.omdbapi.com';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY ;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async (query = "the") => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = `${API_BASE_URL}/?apikey=${API_KEY}&s=${query}&type=movie`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to fetch movies`);
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error|| 'No movies found');
        setMoviesList([]);
        return;
      }

      const moviesWithRatings = await Promise.all(
        data.Search.map(async (movie) => {
          const res = await fetch(
            `${API_BASE_URL}/?apikey=${API_KEY}&i=${movie.imdbID}`
          );
          return await res.json();
        })
      );

      setMoviesList(moviesWithRatings);
    } catch (error) {
    
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  

  useEffect(() => {
    const debounceTimer = setTimeout(()=> {
      if (searchTerm.trim() === '') {
        fetchMovies("fast");
      } else {
        fetchMovies(searchTerm);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <main className="min-h-screen relative bg-primary bg-hero-pattern bg-cover bg-center bg-no-repeat">
      
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Movies Banner"/>
          <h1>Find Your <span className="text-gradient" >Movies</span> Which You Enjoy</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-10">All Movies</h2>
          {isLoading ?  (
            <Spinner/>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ): (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie}/>
              ))}
            </ul>
          )}
          </section>
      </div>
    </main>
  )
}

export default App