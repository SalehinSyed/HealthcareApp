import "./App.css";

import QuestionnaireForm from "./components/QuestionnaireForm";
import React from "react";

const App = () => {
  return (
    <div className="mt-4">
      <img
        alt="Company Logo"
        src="/logo.png"
        className="mx-auto"
        style={{ width: "100px", height: "100px" }}
      />
      <h1 className="text-3xl text-center font-bold my-4">
        Welcome to the Blinx Health Survey
      </h1>
      <QuestionnaireForm />
    </div>
  );
};

export default App;
