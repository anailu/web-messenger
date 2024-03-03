import {
  validateEmail,
  validateLogin,
  validateName,
  validatePhone,
} from '../../../scripts/validationRules';

import {sendDataToConsole} from '../../../scripts/saveData';
import {validateForm, addBlurValidation} from '../../../scripts/formValidationUtils';

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('editProfileForm') as HTMLFormElement;
  const saveButton = document.getElementById('saveProfileButton') as HTMLButtonElement;

  const validate = (fieldName: string, fieldValue: string): boolean => {
    switch (fieldName) {
      case 'email':
        if (!validateEmail(fieldValue)) {
          return false;
        }
        break;
      case 'login':
        if (!validateLogin(fieldValue)) {
          return false;
        }
        break;
      case 'first_name':
      case 'second_name':
        if (!validateName(fieldValue)) {
          return false;
        }
        break;
      case 'phone':
        if (!validatePhone(fieldValue)) {
          return false;
        }
        break;
    }
    return true;
  };

  const handleBlurValidation = (event: Event) => {
    const element = event.target as HTMLInputElement;
    const fieldName = element.name;
    const fieldValue = element.value.trim();

    if (!element.classList.contains('validated')) {
      if (!validate(fieldName, fieldValue)) {
        alert(`Invalid ${fieldName} format`);
        return;
      }
      element.classList.add('validated');
    }
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();

    const formData: { [key: string]: string } = {};

    const formElements = form.elements;
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i] as HTMLInputElement;

      if (element.tagName === 'INPUT' && ['text', 'email', 'tel'].includes(element.type)) {
        const fieldName = element.name;
        const fieldValue = element.value.trim();

        if (!validateForm(fieldName, fieldValue, (value) =>
          validate(fieldName, value), 'Invalid format')) {
          return;
        }

        formData[fieldName] = fieldValue;
      }
    }

    sendDataToConsole(formData);
    form.reset();
  };

  saveButton.addEventListener('click', handleSubmit);

  const formInputs = form.querySelectorAll<HTMLInputElement>('input[name]');
  formInputs.forEach((input) => {
    addBlurValidation(input, (value) => validate(input.name, value), 'Invalid format');
    input.addEventListener('blur', handleBlurValidation);
  });
});
