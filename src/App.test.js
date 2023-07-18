import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import App from "./App";
import { GameListContext } from "./GameListProvider";
import { BrowserRouter as Router } from "react-router-dom";

// Mock the GameListContext data
const mockGameList = ["Tea for God", "Agriculture", "Dros", "Stillborn Slayer"];

// Mock the GameListProvider component
const MockGameListProvider = ({ children }) => (
  <GameListContext.Provider value={{ gameList: mockGameList }}>
    {children}
  </GameListContext.Provider>
);

test("renders the App component with game list and navigates to a game page", () => {
  // Render the App component with the mocked context
  render(
    <Router>
      <MockGameListProvider>
        <App setIsLoggedIn={() => {}} />
      </MockGameListProvider>
    </Router>
  );

  // Assert that the game list is rendered
  const gameName = screen.getByText("test1"); // Replace with the actual game name
  expect(gameName).toBeInTheDocument();

  // Simulate clicking on a game card to navigate to the game page
  fireEvent.click(gameName);

  // Assert that the navigation to the game page occurs
  const gamePageTitle = screen.getByText("Tea for God"); // Replace with the actual game page title
  expect(gamePageTitle).toBeInTheDocument();
});
