import { cleanup, render, screen } from "@testing-library/react";

import App from "./App";
import React from "react";

// Define a test suite for App component
describe("App render", () => {
  // Clean up after each test
  afterEach(cleanup);

  // Test if the company logo is rendered
  test("renders the company logo", () => {
    render(<App />);
    // Use a regex that matches the alt text to get the logo element
    const logo = screen.getByAltText(/company logo/i);
    // Check if the logo element is in the document
    expect(logo).toBeInTheDocument();
  });

  // Test if the welcome header is rendered
  test("renders the welcome header", () => {
    render(<App />);
    // Use a regex that matches the text to get the header element
    const headerElement = screen.getByText(
      /welcome to the blinx health survey/i
    );
    // Check if the header element is in the document
    expect(headerElement).toBeInTheDocument();
  });

  // Test if the questionnaire form is rendered
  test("renders the questionnaire form", () => {
    render(<App />);
    // Use a regex that matches the label text to get the name input element
    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
  });
});
