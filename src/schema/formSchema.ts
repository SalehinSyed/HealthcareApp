import { z } from "zod";

/**
 * Schema for the questionnaire form
 * This schema is used for form validation
 */
export const formSchema = z
  .object({
    /**
     * Name field
     * Must be a string, at least 1 character long, and contain only letters and spaces
     */
    name: z
      .string()
      .min(1, "Name is required")
      .refine(
        (name) => /^[a-zA-Z\s]+$/.test(name),
        "Name must contain only letters and spaces"
      ),

    /**
     * Age field
     * Must be a number between 0 and 120
     */
    age: z
      .number({
        message: "Age is required",
      })
      .min(0, "Age cannot be negative")
      .max(120, "Age must be realistic"),

    /**
     * Gender field
     * Must be one of the specified options
     */
    gender: z.enum(["male", "female", "other"], {
      message: "Gender is required",
    }),

    /**
     * Health condition field
     * Must be one of the specified options
     */
    healthCondition: z.enum(["healthy", "minor_illness", "chronic_illness"], {
      message: "Health condition is required",
    }),

    /**
     * Symptoms present field
     * Must be one of the specified options
     */
    symptomsPresent: z.enum(["yes", "no"], { message: "Required" }),

    /**
     * Symptoms list field
     * Optional string field
     */
    symptomsList: z.string().optional(),

    /**
     * Chronic details field
     * Optional string field
     */
    chronicDetails: z.string().optional(),

    /**
     * Chronic medication field
     * Optional string field
     */
    chronicMedication: z.string().optional(),
  })
  .refine(
    (data) => {
      /**
       * If health condition is chronic illness, chronic details must be provided
       */
      if (
        data.healthCondition === "chronic_illness" &&
        (data.chronicDetails === undefined ||
          data.chronicDetails.trim().length === 0)
      ) {
        // Condition is not met, return false to fail the validation
        return false;
      }
      // Validation passes
      return true;
    },
    {
      message:
        "Chronic details must be provided if health condition is chronic illness",
      path: ["chronicDetails"],
    }
  )
  .refine(
    (data) =>
      /**
       * If symptoms are present, symptoms list must be provided
       */
      data.symptomsPresent === "yes"
        ? data.symptomsList && data.symptomsList.length > 0
        : true,
    {
      message: "Symptoms list is required when symptoms are present",
      path: ["symptomsList"],
    }
  );

/**
 * Type derived from the form schema
 * This type can be used for type checking the form data
 */
export type FormValues = z.infer<typeof formSchema>;
