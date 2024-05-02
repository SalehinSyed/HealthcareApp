import { render, screen, waitFor } from "@testing-library/react";

import QuestionnaireForm from "../QuestionnaireForm";
import React from "react";
import { submitQuestionnaire } from "../../services/apiService";
import userEvent from "@testing-library/user-event";

// Mock the submitQuestionnaire function to resolve successfully
jest.mock("../../services/apiService", () => ({
  submitQuestionnaire: jest.fn(),
}));

const mockSubmitQuestionnaire = submitQuestionnaire as jest.Mock;

describe("Questionnaire Form", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Test if the form renders all the fields correctly
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

  // Test if the form shows validation messages for incomplete form
  it("shows validation messages for incomplete form", async () => {
    render(<QuestionnaireForm />);

    // Submit the form
    userEvent.click(screen.getByText("Submit"));

    // Check for validation messages
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

  // Test if the form shows 'Submitting..' in submit button when form is being submitted
  it("shows 'Submitting..' in submit button when form is being submitted", async () => {
    render(<QuestionnaireForm />);

    // Fill out the form fields
    userEvent.type(screen.getByLabelText(/Name:/i), "John Doe");
    userEvent.type(screen.getByLabelText(/Age:/i), "30");
    userEvent.selectOptions(screen.getByLabelText(/Gender:/i), ["male"]);
    userEvent.selectOptions(screen.getByLabelText(/Health Condition:/i), [
      "healthy",
    ]);
    userEvent.click(screen.getByRole("radio", { name: /No/i }));

    // Submit the form
    userEvent.click(screen.getByText("Submit"));

    // Check if the success message is displayed
    await waitFor(
      () => {
        expect(screen.getByText(/Submitting../i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  // Test if the form submits successfully and shows a success message
  it("submits the form successfully and shows a success message", async () => {
    mockSubmitQuestionnaire.mockResolvedValueOnce({
      message: "Thank you for taking the survey!",
    });
    render(<QuestionnaireForm />);

    // Fill out the form fields
    userEvent.type(screen.getByLabelText(/Name:/i), "John Doe");
    userEvent.type(screen.getByLabelText(/Age:/i), "30");
    userEvent.selectOptions(screen.getByLabelText(/Gender:/i), ["male"]);
    userEvent.selectOptions(screen.getByLabelText(/Health Condition:/i), [
      "healthy",
    ]);
    userEvent.click(screen.getByRole("radio", { name: /No/i }));

    // Submit the form
    userEvent.click(screen.getByText("Submit"));

    // Wait for the expected outcome
    await waitFor(() => {
      expect(submitQuestionnaire).toHaveBeenCalledWith({
        name: "John Doe",
        age: 30,
        gender: "male",
        health_condition: "healthy",
        symptoms_present: false,
        symptoms_list: undefined,
        chronicDetails: undefined,
      });
    });

    // Check for the success message
    expect(
      screen.getByText("Thank you for taking the survey!")
    ).toBeInTheDocument();
  });

  // Test if the form resets the form fields after a successful submission
  it("resets the form fields after a successful submission", async () => {
    // Mock the submitQuestionnaire function to resolve successfully
    mockSubmitQuestionnaire.mockResolvedValueOnce({
      message: "Thank you for taking the survey!",
    });

    render(<QuestionnaireForm />);

    // Fill out the form fields
    userEvent.type(screen.getByLabelText(/Name:/i), "John Doe");
    userEvent.type(screen.getByLabelText(/Age:/i), "30");
    userEvent.selectOptions(screen.getByLabelText(/Gender:/i), ["male"]);
    userEvent.selectOptions(screen.getByLabelText(/Health Condition:/i), [
      "healthy",
    ]);
    userEvent.click(screen.getByRole("radio", { name: /No/i }));

    // Check if the radio input for symptoms is checked
    expect(screen.getByRole("radio", { name: /No/i })).toBeChecked();

    // Submit the form
    userEvent.click(screen.getByText("Submit"));

    // Wait for the success message to be displayed
    await waitFor(() => {
      expect(
        screen.getByText(/Thank you for taking the survey!/i)
      ).toBeInTheDocument();
    });

    // Click the "Submit another response" button
    userEvent.click(
      screen.getByRole("button", { name: /Submit another response/i })
    );

    // Check if the form fields are reset
    expect(screen.getByLabelText(/Name:/i)).toHaveValue("");
    expect(screen.getByLabelText(/Age:/i)).toHaveValue(null);
    expect(screen.getByLabelText(/Gender:/i)).toHaveValue("");
    expect(screen.getByLabelText(/Health Condition:/i)).toHaveValue("");
    expect(
      screen.getByLabelText(
        /Have you experienced any symptoms in the last 14 days/i
      )
    ).not.toBeChecked();
  });

  // Test if the form shows an error message when the form submission fails
  it("shows an error message when the form submission fails", async () => {
    // Mock the submitQuestionnaire function to reject with an error
    mockSubmitQuestionnaire.mockRejectedValueOnce(new Error("Network error"));

    render(<QuestionnaireForm />);

    // Fill out the form fields
    userEvent.type(screen.getByLabelText(/Name:/i), "John Doe");
    userEvent.type(screen.getByLabelText(/Age:/i), "30");
    userEvent.selectOptions(screen.getByLabelText(/Gender:/i), ["male"]);
    userEvent.selectOptions(screen.getByLabelText(/Health Condition:/i), [
      "healthy",
    ]);
    userEvent.click(screen.getByRole("radio", { name: /No/i }));

    // Submit the form
    userEvent.click(screen.getByText("Submit"));

    // Check if the error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(
          /Failed to submit the questionnaire. Please try again./i
        )
      ).toBeInTheDocument();
    });
  });

  // Test check if the 'Chronic Condition Details' field is rendered when health condition is 'Chronic illness'
  it("renders the 'Chronic Condition Details' field when health condition is 'Chronic illness'", () => {
    render(<QuestionnaireForm />);

    // Select "Chronic illness" for the health condition
    userEvent.selectOptions(screen.getByLabelText(/Health Condition:/i), [
      "Chronic illness",
    ]);

    // Check if the "Chronic Condition Details" field is rendered
    expect(
      screen.getByLabelText(/Chronic Condition Details:/i)
    ).toBeInTheDocument();

    // Check if Medication field is rendered
    expect(screen.getByLabelText(/Medication:/i)).toBeInTheDocument();
  });

  it("renders the 'List symptoms experienced:' field when 'Have you experienced any symptoms in the last 14 days?' is 'Yes'", () => {
    render(<QuestionnaireForm />);

    // Select "Yes" for the "Have you experienced any symptoms in the last 14 days?" question
    userEvent.click(screen.getByRole("radio", { name: /Yes/i }));

    // Check if the "List symptoms experienced:" field is rendered
    expect(
      screen.getByLabelText(/List symptoms experienced:/i)
    ).toBeInTheDocument();
  });

  // Test if the conditional fields are not rendered when they are not applicable
  it("does not render the conditional fields when they are not applicable", () => {
    render(<QuestionnaireForm />);

    // Select "Healthy" for the health condition
    userEvent.selectOptions(screen.getByLabelText(/Health Condition:/i), [
      "Healthy",
    ]);

    // Select "No" for the "Have you experienced any symptoms in the last 14 days?" question
    userEvent.click(screen.getByRole("radio", { name: /No/i }));

    // Check that the "Chronic Condition Details" field is not rendered
    expect(
      screen.queryByLabelText(/Chronic Condition Details:/i)
    ).not.toBeInTheDocument();

    // Check that the "Medication" field is not rendered
    expect(screen.queryByLabelText(/Medication:/i)).not.toBeInTheDocument();

    // Check that the "List symptoms experienced:" field is not rendered
    expect(
      screen.queryByLabelText(/List symptoms experienced:/i)
    ).not.toBeInTheDocument();
  });
});
