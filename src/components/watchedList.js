import WatchedMovie from "./watchedMovie";

function WatchedMoviesList({ watched, removeMovie }) {
  return (
    <ul className="list">
      {watched?.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          removeMovie={removeMovie}
        />
      ))}
    </ul>
  );
}
export default WatchedMoviesList;
