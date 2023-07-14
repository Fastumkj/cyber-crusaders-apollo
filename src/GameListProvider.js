import React, { createContext, useState } from "react";

export const GameListContext = createContext();

export const GameListProvider = ({ children }) => {
  const [gameList, setGameList] = useState([]);

  return (
    <GameListContext.Provider value={{ gameList, setGameList }}>
      {children}
    </GameListContext.Provider>
  );
};
