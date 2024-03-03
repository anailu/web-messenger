/**
 * Валидация формы.
 *
 * @param {string} _fieldName - Название поля формы.
 * @param {string} fieldValue - Значение поля формы для валидации.
 * @param {function(value: string): boolean} validationFunction - Функция валидации.
 * @param {string} errorMessage - Сообщение об ошибке, отображаемое при неудачной валидации.
 * @return {boolean} True, если валидация успешна, иначе false.
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
 * Валидация на "blur".
 *
 * @param {HTMLInputElement} input - HTML-элемент ввода, подвергающийся валидации при потере фокуса.
 * @param {function(value: string): boolean} validationFunction - Функция валидации.
 * @param {string} errorMessage - Сообщение об ошибке, отображаемое при неудачной валидации.
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
