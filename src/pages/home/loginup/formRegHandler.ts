import {
  validateEmail,
  validateLogin,
  validateName,
  validatePhone,
  validatePassword,
} from '../../../scripts/validationRules';
import {validateForm, addBlurValidation} from '../../../scripts/formValidationUtils';

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registration-form') as HTMLFormElement;

  const fields = ['email', 'login', 'first_name', 'second_name', 'phone', 'password'];

  const formData: { [key: string]: string } = {};

  const addValidation = (fieldName: string, validationFunction: (value: string) =>
                          boolean, errorMessage: string) => {
    const input = document.getElementById(fieldName) as HTMLInputElement;

    addBlurValidation(input, validationFunction, errorMessage);

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const fieldValue = input.value.trim();

      if (!validateForm(fieldName, fieldValue, validationFunction, errorMessage)) {
        return;
      }

      formData[fieldName] = fieldValue;
    });
  };

  fields.forEach((fieldName) => {
    switch (fieldName) {
      case 'email':
        addValidation(fieldName, validateEmail, 'invalid email format');
        break;
      case 'login':
        addValidation(fieldName, validateLogin, 'invalid login format');
        break;
      case 'first_name':
      case 'second_name':
        addValidation(fieldName, validateName,
            `invalid ${fieldName === 'first_name' ? 'name' : 'last name'} format`);
        break;
      case 'phone':
        addValidation(fieldName, validatePhone, 'invalid phone format');
        break;
      case 'password':
        addValidation(fieldName, validatePassword, 'invalid password format');
        break;
    }
  });

  console.log('Form Data:', formData);
});
