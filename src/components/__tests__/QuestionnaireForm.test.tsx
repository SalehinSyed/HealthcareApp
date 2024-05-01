import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import QuestionnaireForm from "../QuestionnaireForm";
import React from "react";

describe("Questionnaire Form", () => {
  afterEach(cleanup);
  it("renders initial form fields correctly", () => {
    render(<QuestionnaireForm />);
    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Health Condition:/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        /Have you experienced any symptoms in the last 14 days/i
      )
    ).toBeInTheDocument();
  });
});

describe("Form Submission", () => {
  test("form validation messages for incomplete form", async () => {
    render(<QuestionnaireForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/age is required/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/gender is required/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText(/health condition is required/i)
      ).toBeInTheDocument();
    });
  });
});
