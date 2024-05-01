const API_BASE_URL = "http://localhost:3001";

export const submitQuestionnaire = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/submit-questionnaire`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
