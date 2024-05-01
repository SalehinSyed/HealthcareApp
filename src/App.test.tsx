import { cleanup, render, screen } from "@testing-library/react";

import App from "./App";
import React from "react";

describe("App render", () => {
  afterEach(cleanup);

  test("renders the company logo", () => {
    render(<App />);
    const logo = screen.getByAltText(/company logo/i); // Use a regex that matches the alt text
    expect(logo).toBeInTheDocument();
  });

  test("renders the welcome header", () => {
    render(<App />);
    const headerElement = screen.getByText(
      /welcome to the blinx health survey/i
    );
    expect(headerElement).toBeInTheDocument();
  });

  test("renders the questionnaire form", () => {
    render(<App />);
    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
  });
});
