export interface City  { id: string; name: string; state_id: string };

export interface Area { id: string, name: string, city_id: string };

export interface Pincode  { id: string, code: string, city_id: string };

export interface SelectOption { value: string; label: string };
export interface BrandType { id: string; store_type: string };
export interface GenderType  { id: string; gender_value: string };