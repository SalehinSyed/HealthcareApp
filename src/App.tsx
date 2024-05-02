import "./App.css";

import QuestionnaireForm from "./components/QuestionnaireForm";
import React from "react";

/**
 * App component
 * This is the main component of the application
 */
const App = () => {
  return (
    <div className="mt-4">
      {/**
       * Company logo
       * This image tag displays the company logo
       */}
      <img
        alt="Company Logo"
        src="/logo.png"
        className="mx-auto"
        style={{ width: "100px", height: "100px" }}
      />
      {/**
       * Welcome message
       * This header tag displays the welcome message
       */}
      <h1 className="text-3xl text-center font-bold my-4">
        Welcome to the Blinx Health Survey
      </h1>
      {/**
       * Questionnaire form
       * This component displays the questionnaire form
       */}
      <QuestionnaireForm />
    </div>
  );
};

/**
 * Exporting App component as default
 */
export default App;
