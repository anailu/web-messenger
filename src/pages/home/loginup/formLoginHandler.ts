import {validateLogin, validatePassword} from '../../../scripts/validationRules';
import {validateForm, addBlurValidation} from '../../../scripts/formValidationUtils';

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('login-form') as HTMLFormElement;

  const fields = ['login', 'password'];

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
      case 'login':
        addValidation(fieldName, validateLogin, 'Invalid login format');
        break;
      case 'password':
        addValidation(fieldName, validatePassword, 'Invalid password format');
        break;
    }
  });

  console.log('Form Data:', formData);
});
