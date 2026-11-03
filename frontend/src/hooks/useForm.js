import { useState } from 'react';

export const useForm = (initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setValues(initialState);
  const setForm = (newValues) => setValues(newValues);

  return { values, handleChange, resetForm, setForm };
};