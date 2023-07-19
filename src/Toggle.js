import React, { useState } from "react";
import "./styles/Toggle.css";

const Toggle = ({ condition, name, type }) => {
  const [selectedFilter, setSelectedFilter] = useState(false);

  const handleClick = () => {
    condition(name, type);
    setSelectedFilter((prevState) => !prevState);
  };

  const buttonClassName = selectedFilter ? "selected" : "";

  return (
    <div className="toggle">
      <button onClick={handleClick} className={buttonClassName}>
        {name}
      </button>
    </div>
  );
};

export default Toggle;
