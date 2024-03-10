import Block, {BlockProps} from '../../../scripts/blockForm';
import {
  validateEmail,
  validateLogin,
  validateName,
  validatePhone,
} from '../../../scripts/validationRules';
import {sendDataToConsole} from '../../../scripts/saveData';
import {validateForm, addBlurValidation} from '../../../scripts/formValidationUtils';

/**
 * интерфейс для свойств блока формы пароля
 * @interface EditProfileFormBlockProps
 * @extends BlockProps
 * @property {string} formId - идентификатор формы
 * @property {string} saveButtonId - идентификатор кнопки сохранения
 */
interface EditProfileFormBlockProps extends BlockProps {
  formId: string;
  saveButtonId: string;
  onSaveButtonClick: (event: Event) => void;
}

/**
 * класс блока формы пароля
 * @class EditProfileFormBlock
 * @extends {Block}
 * @param {EditProfileFormBlockProps} props - свойства блока формы пароля
 */
class EditProfileFormBlock extends Block {
  /**
   * конструктор класса EditProfileFormBlock
   * @param {EditProfileFormBlockProps} props - cвойства блока формы
   */
  constructor(props: EditProfileFormBlockProps) {
    const form = document.getElementById(props.formId) as HTMLFormElement | null;
    const saveButton = document.getElementById(props.saveButtonId) as HTMLButtonElement | null;
    super(form);

    if (!form || !saveButton) {
      console.error(`form or save button not found. form ID: ${props.formId}, 
                     save button ID: ${props.saveButtonId}`);
      return;
    }

    this._addEvents({
      click: props.onSaveButtonClick,
    });

    const handleSubmit = (event: Event) => {
      event.preventDefault();

      const formData: { [key: string]: string } = {};

      const formElements = (this.element as HTMLFormElement | null)?.elements;

      if (!formElements) {
        console.error('form elements not found.');
        return;
      }

      for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i] as HTMLInputElement;

        if (element.tagName === 'INPUT' && ['text', 'email', 'tel'].includes(element.type)) {
          const fieldName = element.name;
          const fieldValue = element.value.trim();

          if (!validateForm(fieldName, fieldValue, (value) =>
            this.validate(fieldName, value), 'Invalid format')) {
            return;
          }

          formData[fieldName] = fieldValue;
        }
      }

      sendDataToConsole(formData);
    };

    saveButton.addEventListener('click', handleSubmit);

    const formInputs = this.element?.querySelectorAll<HTMLInputElement>('input[name]');

    if (formInputs) {
      formInputs.forEach((input) => {
        addBlurValidation(input, (value) =>
          this.validate(input.name, value), `Invalid ${input.name} format`);
      });
    }
  }

  /**
   * добавляет валидацию при потере фокуса у поля ввода
   * @private
   * @param {string} fieldName - имя поля ввода для валидации
   * @param {string} fieldValue - значение поля ввода для валидации
   * @return {boolean} - результат валидации true или false
   */
  private validate(fieldName: string, fieldValue: string): boolean {
    switch (fieldName) {
      case 'email':
        return validateEmail(fieldValue);
      case 'login':
        return validateLogin(fieldValue);
      case 'first_name':
      case 'second_name':
        return validateName(fieldValue);
      case 'phone':
        return validatePhone(fieldValue);
      default:
        return true;
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const onSaveButtonClick = function(event: Event) {
    event.preventDefault();
  };

  const editProfileFormBlock = new EditProfileFormBlock({
    formId: 'editProfileForm',
    saveButtonId: 'saveProfileButton',
    onSaveButtonClick,
    events: {
      click: onSaveButtonClick,
    },
  });
  editProfileFormBlock;
});
