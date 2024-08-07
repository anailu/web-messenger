import {
  validateEmail,
  validateLogin,
  validateName,
  validatePhone,
  validatePassword,
} from './validationRules';

/**
 * получает функцию валидации для указанного поля
 *
 * @param {string} field - поле, для которого требуется функция валидации
 * @return {Function | undefined} возвращает функцию валидации, если существует для указанного поля,
 * иначе возвращает undefined
 */
export function getValidationFunction(field: string): ((value: string) => boolean) | undefined {
  switch (field) {
    case 'email':
      return validateEmail;
    case 'login':
      return validateLogin;
    case 'first_name':
    case 'second_name':
      return validateName;
    case 'phone':
      return validatePhone;
    case 'password':
      return validatePassword;
    default:
      return undefined;
  }
}

/**
 * проверяет валидность сообщения
 * @param {string} messageInputValue - текстовое значение сообщения
 * @param {string} fileInputValue - значение файла сообщения
 * @return {boolean} - возвращает true, если сообщение валидно, иначе возвращает false
 */
export function validateMessage(messageInputValue: string, fileInputValue: string): {
  isValid: boolean,
  errorMessage: string
} {
  const hasText = messageInputValue.trim() !== '';
  const hasFile = fileInputValue.trim() !== '';

  if (hasText || hasFile) {
    return {isValid: true, errorMessage: ''};
  } else {
    return {isValid: false, errorMessage: 'write a message or attach a file'};
  }
}
