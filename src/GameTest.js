// Testing using Jest

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Comment from "./Comment";
import { act } from "react-dom/test-utils";

// Mock the onSubmit function
const mockOnSubmit = jest.fn();

test("submits comment to Firestore when form is submitted", () => {
  // Render the Comment component
  const { getByPlaceholderText, getByText } = render(
    <Comment onSubmit={mockOnSubmit} photoURL="" />
  );

  // Simulate typing in the textarea
  const textarea = getByPlaceholderText("Add a comment");
  fireEvent.change(textarea, { target: { value: "Test comment" } });

  // Simulate form submission
  const submitButton = getByText("Submit");
  act(() => {
    fireEvent.click(submitButton);
  });

  // Assert that the onSubmit function is called with the correct arguments
  expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  expect(mockOnSubmit).toHaveBeenCalledWith(
    "Test comment",
    expect.any(Function)
  );
});
