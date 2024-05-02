/**
 * Type definition for the data submitted for the questionnaire form
 */
export type SubmissionData = {
  /**
   * The name of the respondent
   */
  name: string;

  /**
   * The age of the respondent
   */
  age: number;

  /**
   * The gender of the respondent
   */
  gender: string;

  /**
   * The health condition of the respondent
   */
  health_condition: string;

  /**
   * Whether the respondent has symptoms
   */
  symptoms_present: boolean;

  /**
   * The list of symptoms, if any
   */
  symptoms_list?: string;

  /**
   * Details of chronic illness, if any
   */
  chronicDetails?: {
    /**
     * Detail of the chronic illness
     */
    detail?: string;

    /**
     * Medication for the chronic illness
     */
    medication?: string;
  };
};
