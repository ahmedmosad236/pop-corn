import { useEffect, useState } from "react";
import Logo from "./components/logo";
import Loader from "./components/loader";
import ErrorMessage from "./components/error";
import NavBar from "./components/nav";
import Search from "./components/search";
import Numresault from "./components/numResult";
import Box from "./components/box";
import MovieList from "./components/moviesList";
import MovieDetailes from "./components/movieDetails";
import WatchedSummary from "./components/watchedSummary";
import WatchedMoviesList from "./components/watchedList";
import { useLocalStorage } from "./components/useLocalstorage";
// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];
const KEY = "2183285d";

export default function App() {
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectId, setSelectId] = useState(null);
  const [watched, setWatched] = useLocalStorage([], "watched");
  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );
          if (!res.ok) throw new Error("something is wrong");
          const data = await res.json();
          if (data.Response === "False") throw new Error("movie not found");
          setMovies(data.Search);
        } catch (err) {
          console.error(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
      handleclosemovie();
    },
    [query]
  );

  function handleselect(id) {
    setSelectId((selectId) => (selectId === id ? null : id));
  }

  function handleclosemovie() {
    setSelectId(null);
  }

  function addMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleRemoveMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Numresault movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {IsLoading && <Loader />}
          {!IsLoading && !error && (
            <MovieList movies={movies} onSelect={handleselect} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectId ? (
            <MovieDetailes
              selectId={selectId}
              closeMOvie={handleclosemovie}
              addMovie={addMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                removeMovie={handleRemoveMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

/*
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}
*/
