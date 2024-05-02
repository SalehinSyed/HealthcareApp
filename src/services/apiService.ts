import { SubmissionData } from "./apiService.types";

// Base URL for the API
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

/**
 * Function to submit questionnaire data to the API
 * @param SubmissionData data - The data from the questionnaire form
 * @returns Promise - Returns a promise that resolves with the response data
 * @throws Error - Throws an error if the network response is not ok
 */
export const submitQuestionnaire = async (data: SubmissionData) => {
  try {
    // Make a POST request to the API
    const response = await fetch(`${API_BASE_URL}/submit-questionnaire`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Convert the data to JSON string
    });

    // If the response is not ok, throw an error
    if (!response.ok) {
      let errMsg = "Network response was not ok";
      if (response.status === 404) {
        errMsg = "API endpoint not found";
      } else if (response.status === 500) {
        errMsg = "Internal server error";
      }
      throw new Error(errMsg);
    }

    // Return the response data as JSON
    return response.json();
  } catch (error) {
    console.error("Error in submitQuestionnaire:", error);
    throw error;
  }
};
