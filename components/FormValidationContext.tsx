import React, { createContext, useContext, useState } from 'react';

type FormValidationContextType = {
  businessDetailsValid: boolean;
  setBusinessDetailsValid: (valid: boolean) => void;
};

const FormValidationContext = createContext<FormValidationContextType | undefined>(undefined);

export const useFormValidation = () => {
  const context = useContext(FormValidationContext);
  if (!context) {
    throw new Error('useFormValidation must be used within FormValidationProvider');
  }
  return context;
};

export const FormValidationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businessDetailsValid, setBusinessDetailsValid] = useState(false);

  return (
    <FormValidationContext.Provider value={{ businessDetailsValid, setBusinessDetailsValid }}>
      {children}
    </FormValidationContext.Provider>
  );
};
