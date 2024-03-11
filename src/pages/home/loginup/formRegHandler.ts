import Block, {BlockProps} from '../../../scripts/blockForm';
import {
  validateEmail,
  validateLogin,
  validateName,
  validatePhone,
  validatePassword,
} from '../../../scripts/validationRules';
import {addBlurValidation} from '../../../scripts/formValidationUtils';
interface RegistrationBlockProps extends BlockProps {
  formId: string;
  fields: string[];
  onSubmit: (formData: { [key: string]: string }) => void;
}
/**
 * класс блока регистрации
 * @class
 */
class RegistrationBlock extends Block {
  private formData: { [key: string]: string } = {};
  /**
   * конструктор класса RegistrationBlock
   * @constructor
   * @param {RegistrationBlockProps} props - объект свойств блока регистрации
   */
  constructor(props: RegistrationBlockProps) {
    const form = document.getElementById(props.formId) as HTMLFormElement | null;
    super(form);

    if (!form) {
      console.error(`form with ID '${props.formId}' not found.`);
      return;
    }

    this.addValidationHandlers(props.fields);
    form.addEventListener('submit', this.handleSubmit.bind(this, props.onSubmit));
  }

  /**
   * добавляет обработчики валидации для полей формы
   * @param {string[]} fields - массив имен полей формы
   * @private
   */
  private addValidationHandlers(fields: string[]): void {
    fields.forEach((fieldName) => {
      const validationFunction = this.getValidationFunction(fieldName);
      const errorMessage = this.getErrorMessage(fieldName);

      const input = this.element?.querySelector(`[name="${fieldName}"]`) as HTMLInputElement | null;

      if (!input) {
        console.error(`input with name '${fieldName}' not found in the form.`);
        return;
      }

      if (validationFunction) {
        addBlurValidation(input, validationFunction, errorMessage);
      } else {
        console.error(`Validation function for '${fieldName}' is undefined.`);
      }
    });
  }

  /**
   * возвращает функцию валидации для указанного поля
   * @param {string} fieldName - имя поля формы
   * @return {string} - валидация или undefined
   * @private
   */
  private getValidationFunction(fieldName: string): ((value: string) => boolean) | undefined {
    switch (fieldName) {
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
   * возвращает сообщение об ошибке для указанного поля
   * @param {string} fieldName - имя поля формы
   * @return {string} - сообщение об ошибке
   * @private
   */
  private getErrorMessage(fieldName: string): string {
    switch (fieldName) {
      case 'email':
        return 'Invalid email format';
      case 'login':
        return 'Invalid login format';
      case 'first_name':
      case 'second_name':
        return `Invalid ${fieldName === 'first_name' ? 'name' : 'last name'} format`;
      case 'phone':
        return 'Invalid phone format';
      case 'password':
        return 'Invalid password format';
      default:
        return 'Invalid format';
    }
  }

  /**
   * обработчик события отправки формы
   * предотвращает стандартного поведения формы (перезагрузка страницы) и
   * собирает данные формы
   * @param {function} onSubmit - функция обратного вызова, принимает объект данных формы
   * @param {Event} event - объект события отправки формы.
   * @private
   */
  private handleSubmit(onSubmit: (formData: {
    [key: string]: string
  }) => void, event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    formData.forEach((value, key) => {
      this.formData[key] = value as string;
    });

    onSubmit(this.formData);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const onSubmit = function(formData: { [key: string]: string }) {
    console.log('Form Data:', formData);
  };

  const registrationBlock = new RegistrationBlock({
    formId: 'registration-form',
    fields: ['email', 'login', 'first_name', 'second_name', 'phone', 'password'],
    onSubmit,
    events: {},
  });
  registrationBlock;
});
