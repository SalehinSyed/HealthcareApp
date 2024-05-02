import "./QuestionnaireForm.css";

import { FormValues, formSchema } from "../schema/formSchema";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { submitQuestionnaire } from "../services/apiService";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * QuestionnaireForm component
 * This component renders the questionnaire form and handles form submission
 */
export default function QuestionnaireForm() {
  // Initialize react-hook-form with form schema and default values
  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      age: undefined,
      symptomsPresent: undefined,
    },
  });

  /**
   * Reset form fields and submission state
   */
  const handleReset = () => {
    reset(); // Reset form fields and submission state
  };

  /**
   * Handle form submission
   * @param FormValues data - The data from the form
   */
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // Prepare data for submission
    const submissionData = {
      name: data.name,
      age: data.age,
      gender: data.gender,
      health_condition: data.healthCondition,
      symptoms_present: data.symptomsPresent === "yes",
      symptoms_list: data.symptomsList,
      chronicDetails:
        data.healthCondition === "chronic_illness"
          ? {
              detail: data.chronicDetails,
              medication: data.chronicMedication,
            }
          : undefined,
    };

    // Submit data and handle potential errors
    try {
      await submitQuestionnaire(submissionData);
    } catch (error) {
      setError("root", {
        message: "Failed to submit the questionnaire. Please try again.",
      });
    }
  };

  // Watch fields to conditionally render other fields
  const symptomsPresent = watch("symptomsPresent");
  const healthCondition = watch("healthCondition");

  // Trigger validation whenever healthCondition changes

  useEffect(() => {
    // Trigger validation whenever healthCondition changes
    trigger("chronicDetails");
  }, [healthCondition, trigger]);

  // Render success message if submission was successful
  if (isSubmitSuccessful) {
    return (
      <div className="max-w-xl m-auto p-4 my-6 shadow-md bg-white rounded-lg text-center">
        <h2 className="text-lg font-medium text-custom-teal mb-2">
          Thank you for taking the survey!
        </h2>
        <button
          onClick={handleReset}
          className="mt-4 bg-blue-500 text-white py-2 px-4 my-2 rounded cursor-pointer"
        >
          Submit another response
        </button>
      </div>
    );
  }

  // Render form
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl m-auto p-4 shadow-md bg-white rounded-lg"
    >
      {/* Name field */}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Name:<span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          className="border-2 border-gray-300 p-2 rounded-lg w-full"
          placeholder="Full name"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm italic mt-2">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Age field */}
      <div className="mb-4">
        <label
          htmlFor="age"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Age:<span className="text-red-500">*</span>
        </label>
        <input
          id="age"
          type="number"
          min={0}
          placeholder="Years"
          className="border-2 border-gray-300 p-2 rounded-lg w-full appearance-none"
          {...register("age", {
            setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
          })}
        />
        {errors.age && (
          <p className="text-red-500 text-sm italic mt-2">
            {errors.age.message}
          </p>
        )}
      </div>

      {/* Gender field */}
      <div className="mb-4">
        <label
          htmlFor="gender"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Gender:<span className="text-red-500">*</span>
        </label>
        <select
          id="gender"
          className="border-2 border-gray-300 p-2 rounded-lg w-full"
          {...register("gender")}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm italic mt-2">
            {errors.gender.message}
          </p>
        )}
      </div>

      {/* Health Condition field */}
      <div className="mb-4">
        <label
          htmlFor="health-condition"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Health Condition:<span className="text-red-500">*</span>
        </label>
        <select
          id="health-condition"
          className="border-2 border-gray-300 p-2 rounded-lg w-full"
          {...register("healthCondition", {
            required: "Health condition is required",
          })}
        >
          <option value="">Select Condition</option>
          <option value="healthy">Healthy</option>
          <option value="minor_illness">Minor illness</option>
          <option value="chronic_illness">Chronic illness</option>
        </select>
        {errors.healthCondition && (
          <p className="text-red-500 text-sm italic mt-2">
            {errors.healthCondition.message}
          </p>
        )}
      </div>

      {/* Conditional Chronic Illness Details and Medication fields */}
      {healthCondition === "chronic_illness" && (
        <>
          <div className="mb-4">
            <label
              htmlFor="chronic-condition-details"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Chronic Condition Details:<span className="text-red-500">*</span>
            </label>
            <input
              id="chronic-condition-details"
              className="border-2 border-gray-300 p-2 rounded-lg w-full"
              placeholder="Details of the chronic condition"
              {...register("chronicDetails", {
                required: "Please provide details of your chronic condition",
              })}
            />
            {errors.chronicDetails && (
              <p className="text-red-500 text-sm italic mt-2">
                {errors.chronicDetails.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="medication"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Medication:
            </label>
            <input
              id="medication"
              className="border-2 border-gray-300 p-2 rounded-lg w-full"
              placeholder="Medication for the chronic condition"
              {...register("chronicMedication")} // Ensure this is optional
            />
            {errors.chronicMedication && (
              <p className="text-red-500 text-sm italic mt-2">
                {errors.chronicMedication.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* Symptoms Presence Question */}
      <div className="mb-4">
        <label
          htmlFor="symptoms"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Have you experienced any symptoms in the last 14 days?
          <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center mb-2">
          <label className="inline-flex items-center mr-6">
            <input
              id="symptoms"
              type="radio"
              value="yes"
              {...register("symptomsPresent", {
                required: "This field is required",
              })}
              className="text-blue-600 form-radio"
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="no"
              {...register("symptomsPresent")}
              className="text-blue-600 form-radio"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
        {errors.symptomsPresent && (
          <p className="text-red-500 text-sm italic mt-2">
            {errors.symptomsPresent.message}
          </p>
        )}
      </div>

      {/* Conditional Symptoms List Field */}
      {symptomsPresent === "yes" && (
        <div className="mb-4">
          <label
            htmlFor="listed-symptoms"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            List symptoms experienced:
          </label>
          <input
            id="listed-symptoms"
            className="border-2 border-gray-300 p-2 rounded-lg w-full"
            {...register("symptomsList", {
              required: "Symptoms list is required when symptoms are present",
            })}
          />
          {errors.symptomsList && (
            <p className="text-red-500 text-sm italic mt-2">
              {errors.symptomsList.message}
            </p>
          )}
        </div>
      )}

      {errors.root && (
        <div className="text-red-500 my-2">{errors.root.message}</div>
      )}

      {/* Submit button */}
      <button
        disabled={isSubmitting}
        type="submit"
        className="text-white font-bold mt-6 py-2 px-6 rounded cursor-pointer w-36"
        style={{
          fontWeight: "600",
          letterSpacing: "1.3px",
          backgroundColor: "#28BCC3",
          borderRadius: "20px",
          boxShadow: "50px 5px 44px 3px #067B81 inset",
        }}
      >
        {isSubmitting ? "Submitting.." : "Submit"}
      </button>
    </form>
  );
}
