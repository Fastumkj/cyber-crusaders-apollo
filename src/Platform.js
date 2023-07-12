import Toggle from "./Toggle";

const Platform = ({ filterByPlatform }) => {
  const platforms = ["Nintendo", "PlayStation", "Xbox", "PC"];
  return (
    <div className="platform-list">
      <ul style = {{ listStyleType: "none"}}>
        {platforms.map((platform) => (
          <li key={platform}>
            <Toggle name={platform} condition={filterByPlatform} type={false} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Platform;
