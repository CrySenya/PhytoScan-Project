export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface PlantSubmission {
  id:             string;
  user_id:        string;
  plant_name:     string;
  description:    string;
  images:         string[];
  status:         SubmissionStatus;
  ai_analysis:    string | null;   // Claude's generated analysis
  submitted_at:   string;
}
