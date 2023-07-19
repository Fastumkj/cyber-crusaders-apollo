import "./styles/Genre.css";
import Toggle from "./Toggle";

const Genre = ({ filterByGenres }) => {
  const genres = [
    "Action",
    "Adventure",
    "Fighting",
    "MOBA",
    "Platform",
    "RPG",
    "Sports",
    "Shooter",
    "Racing",
  ];
  return (
    <div className="genre-list">
      <ul>
        <strong className="genre">Genre</strong>
        {genres.map((genre) => (
          <li key={genre}>
            <Toggle name={genre} condition={filterByGenres} type={true} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Genre;
