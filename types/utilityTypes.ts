// --- Type Definitions for API Responses ---
interface GenderOption {
  id: string;
  gender_value: string;
  active: boolean;
}

interface AgeGroupOption {
  id: string;
  label: string;
  lower_value: number;
  upper_value: number;
  active: boolean;
}