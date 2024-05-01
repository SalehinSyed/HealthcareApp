import { z } from "zod";

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .refine(
        (name) => /^[a-zA-Z\s]+$/.test(name),
        "Name must contain only letters and spaces"
      ),
    age: z
      .number({
        message: "Age is required",
      })
      .min(0, "Age cannot be negative")
      .max(120, "Age must be realistic"),
    gender: z.enum(["male", "female", "other"], {
      message: "Gender is required",
    }),
    healthCondition: z.enum(["healthy", "minor_illness", "chronic_illness"], {
      message: "Health condition is required",
    }),
    symptomsPresent: z.enum(["yes", "no"], { message: "Required" }),
    symptomsList: z.string().optional(),
    chronicDetails: z.string().optional(),
    chronicMedication: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.healthCondition === "chronic_illness" &&
        (data.chronicDetails === undefined ||
          data.chronicDetails.trim().length === 0)
      ) {
        return false; // Condition is not met, return false to fail the validation
      }
      return true; // Validation passes
    },
    {
      message:
        "Chronic details must be provided if health condition is chronic illness",
      path: ["chronicDetails"],
    }
  )
  .refine(
    (data) =>
      data.symptomsPresent === "yes"
        ? data.symptomsList && data.symptomsList.length > 0
        : true,
    {
      message: "Symptoms list is required when symptoms are present",
      path: ["symptomsList"],
    }
  );

export type FormValues = z.infer<typeof formSchema>;
