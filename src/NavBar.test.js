import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "./NavBar";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("NavBar", () => {
  test("renders without errors", () => {
    render(
      <MemoryRouter>
        <NavBar gameList={[]} setIsLoggedIn={() => {}} />
      </MemoryRouter>
    );
    // No errors thrown during rendering indicates a successful test
  });
});
