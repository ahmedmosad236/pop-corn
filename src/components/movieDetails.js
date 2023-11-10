import { useEffect, useState } from "react";
import Loader from "./loader";
import StarRating from "../StarRating";
const KEY = "2183285d";

function MovieDetailes({ selectId, closeMOvie, addMovie, watched }) {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const IsWatched = watched?.map((movie) => movie.imdbID).includes(selectId);
  const {
    Title: title,
    Poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Writer: director,
    Genre: genre,
  } = movie;

  function movieAdd() {
    const newmovie = {
      imdbID: selectId,
      Poster,
      imdbRating: Number(imdbRating),
      title,
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    addMovie(newmovie);
    closeMOvie();
  }

  useEffect(
    function () {
      async function detailsMovie() {
        setLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectId}`
        );
        const data = await res.json();
        console.log(data);
        setMovie(data);
        setLoading(false);
      }
      detailsMovie();
    },
    [selectId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
    },
    [title]
  );

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") return closeMOvie();
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [closeMOvie]
  );

  return (
    <div className="details">
      {loading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={closeMOvie}>
              ⬅
            </button>
            <img src={Poster} alt={`poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {" "}
                {released}&bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {IsWatched ? (
                <p>you rated the movie</p>
              ) : (
                <>
                  <StarRating maxStars={10} onSetMovie={setUserRating} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={movieAdd}>
                      Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <em>{plot}</em>
            <p>{actors}</p>
            <p>Director By {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
export default MovieDetailes;
