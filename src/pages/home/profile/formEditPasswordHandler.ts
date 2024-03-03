import {validatePassword} from '../../../scripts/validationRules';
import {sendDataToConsole} from '../../../scripts/saveData';
import {validateForm, addBlurValidation} from '../../../scripts/formValidationUtils';

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('passwordForm') as HTMLFormElement;
  const saveButton = document.getElementById('savePasswordButton') as HTMLButtonElement;

  const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;

  addBlurValidation(passwordInput, validatePassword, 'Invalid password format');

  saveButton.addEventListener('click', function(event) {
    event.preventDefault();

    const formData: { [key: string]: string } = {};

    const formElements = form.elements;
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i] as HTMLInputElement;

      if (element.tagName === 'INPUT' && element.type !== 'submit') {
        const fieldName = element.name;
        const fieldValue = element.value.trim();

        if (!validateForm(fieldName, fieldValue, validatePassword, 'Invalid password format')) {
          return;
        }

        formData[fieldName] = fieldValue;
      }
    }

    sendDataToConsole(formData);
    form.reset();
  });
});
