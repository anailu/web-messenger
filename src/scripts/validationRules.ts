export const validateLogin = (inputValue: string): boolean => {
  return (
    /^[a-zA-Z][a-zA-Z0-9]*([_-]?[a-zA-Z0-9])?$/.test(inputValue) &&
    inputValue.length >= 3 &&
    inputValue.length <= 20
  );
};

export const validatePassword = (inputValue: string): boolean => {
  return /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,40}$/.test(inputValue);
};

export const validateEmail = (inputValue: string): boolean => {
  return /^[a-zA-Z\d._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/.test(inputValue);
};

export const validateName = (inputValue: string): boolean => {
  return /^[A-Za-zА-Яа-я][A-Za-zА-Яа-я-]*$/.test(inputValue);
};

export const validatePhone = (inputValue: string): boolean => {
  return /^\+?\d{10,15}$/.test(inputValue);
};
