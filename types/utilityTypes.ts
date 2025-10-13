// --- Type Definitions for API Responses ---
export interface GenderOption {
  id: string;
  gender_value: string;
  active: boolean;
}

export interface AgeGroupOption {
  id: string;
  label: string;
  lower_value: number;
  upper_value: number;
  active: boolean;
}

export interface State{
  id:string,
  name:string
}
export interface City {
  id: string;
  name: string;
  state_id: string;
}

export interface Area {
  id: string;
  name: string;
  city_id: string;
  city_name?: string;
}

export interface Pincode {
  id: string;
  code: string;
  city_id: string;
}