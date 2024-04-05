import {getValidationFunction} from './validationFunctions';

/**
 * обрабатывает событие потери фокуса поля ввода
 * @param {Event} event - событие потери фокуса
 * @return {void}
 */
export function handleBlur(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const inputName = inputElement.name;
  const inputValue = inputElement.value;

  const validationFunction = getValidationFunction(inputName);
  if (validationFunction) {
    const isValid = validationFunction(inputValue);
    if (!isValid) {
      alert(`invalid ${inputName} value`);
    }
  }
}

/**
 * обрабатывает событие клика по кнопке
 * @param {Event} event - событие клика
 * @return {void}
 */
export function handleClick(event: Event) {
  event.preventDefault();

  const formData: Record<string, string> = {};
  const inputs = (event.currentTarget as HTMLFormElement).querySelectorAll('input');

  inputs.forEach((input) => {
    formData[input.name] = (input as HTMLInputElement).value;
  });

  const isFormEmpty = Object.values(formData).every((value) => value === '');

  if (isFormEmpty) {
    alert('enter data into the form fields');
    return;
  }

  const validationResults: Record<string, boolean> = {};
  Object.entries(formData).forEach(([fieldName, fieldValue]) => {
    const validationFunction = getValidationFunction(fieldName);
    if (validationFunction) {
      validationResults[fieldName] = validationFunction(fieldValue);
    } else {
      validationResults[fieldName] = true;
    }
  });

  const isValidForm = Object.values(validationResults).every((result) => result);

  if (isValidForm) {
    console.log('form data:', formData);
  } else {
    alert('form data is invalid\nplease check the fields');
  }
}
