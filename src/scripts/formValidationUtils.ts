/**
 * валидация формы.
 *
 * @param {string} fieldName - название поля формы
 * @param {string} fieldValue - значение поля формы для валидации
 * @param {function(value: string): boolean} validationFunction - функция валидации
 * @param {string} errorMessage - сообщение об ошибке, отображаемое при неудачной валидации
 * @return {boolean} true, если валидация успешна, иначе false
 */
export function validateForm(
    _fieldName: string,
    fieldValue: string,
    validationFunction: (value: string) => boolean,
    errorMessage: string
): boolean {
  if (!validationFunction(fieldValue)) {
    alert(errorMessage);
    return false;
  }
  return true;
}

/**
 * валидация на "blur"
 * @param {HTMLInputElement} input - HTML-элем. ввода, подвергающийся валидации при потере фокуса
 * @param {function(value: string): boolean} validationFunction - функция валидации
 * @param {string} errorMessage - сообщение об ошибке, отображаемое при неудачной валидации
 */
export function addBlurValidation(
    input: HTMLInputElement,
    validationFunction: (value: string) => boolean,
    errorMessage: string
): void {
  input.addEventListener('blur', function(event) {
    const fieldValue = (event.target as HTMLInputElement).value.trim();
    validateForm(input.name, fieldValue, validationFunction, errorMessage);
  });
}
