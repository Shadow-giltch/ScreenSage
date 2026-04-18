import React from 'react'

const Moviecard = ({ movie: { Title, Poster, Year, imdbID, imdbRating } }) => {
  return (
    <div className="movie-card">
        <img 
          src={Poster !== 'N/A' ? Poster : '/no-movie.png'} alt={Title}
        />

        <div className="mt-4">
            <h3>{Title}</h3>
            <div className="content">
              <div className="rating">
                <img src="./star.svg" alt="Rating Star"/>
                <p>{imdbRating !== 'N/A' ? imdbRating : 'No rating'}</p>
              </div>

              <span>•</span>

            </div>
        </div>
    </div>
  )
}

export default Moviecard