import Block from '../../../../core/block';
import InputElement from '../../../../components/input/inputElement';
import {Button} from '../../../../components/button';
import {updateUserPassword} from '../api/meApi';
import {getValidationFunction} from '../../../../scripts/validationFunctions';
import {sanitizeFormData} from '../../../../scripts/sanitize';

interface EditPasswordFormProps {
  events?: {
    submit?: (event: Event) => void;
  };
  user: {
    email: string;
    login: string;
    first_name: string;
    second_name: string;
    phone: string;
    avatar: string;
  };
}

/**
 * Класс для формы изменения пароля.
 * @extends Block
 */
class EditPasswordForm extends Block {
  /**
   * Создает экземпляр EditPasswordForm.
   * @param {EditPasswordFormProps} props - Свойства формы.
   */
  constructor(props: EditPasswordFormProps) {
    super(props);
  }

  /**
   * Инициализирует элементы формы и устанавливает события.
   */
  init() {
    this.children.oldPasswordInput = new InputElement({
      label: 'old password',
      type: 'password',
      validate: getValidationFunction('password'),
    });

    this.children.newPasswordInput = new InputElement({
      label: 'new password',
      type: 'password',
      validate: getValidationFunction('password'),
    });

    this.children.submitButton = new Button({
      type: 'submit',
      label: 'save',
    }),

    this.setProps({
      events: {
        submit: this.handleSubmit.bind(this),
      },
    });
  }

  /**
   * Проверяет все поля формы и возвращает объект с ошибками.
   * @return {Object} Объект с ошибками для каждого поля.
   */
  validateAllFields() {
    const errors: { [key: string]: string } = {};
    const fields = {
      oldPassword: this.children.oldPasswordInput,
      newPassword: this.children.newPasswordInput,
    };

    for (const [key, field] of Object.entries(fields)) {
      if (field && field instanceof InputElement) {
        const value = field.getValue();
        const validate = getValidationFunction('password');
        if (validate) {
          const isValid = validate(value);
          if (!isValid) {
            errors[key] = `Enter a valid ${key}`;
            field.setProps({errorText: errors[key]});
          } else {
            field.setProps({errorText: ''});
          }
        }
      } else {
        console.error(`No input element found for name: ${key}`);
      }
    }

    return errors;
  }

  /**
   * Обрабатывает отправку формы для изменения пароля.
   * @param {Event} event - Событие отправки формы.
   */
  async handleSubmit(event: Event) {
    event.preventDefault();

    const errors = this.validateAllFields();

    if (Object.keys(errors).length > 0) {
      console.log('Form validation failed:', errors);
      return;
    }

    const passwordData = {
      oldPassword: (this.children.oldPasswordInput as InputElement).getValue(),
      newPassword: (this.children.newPasswordInput as InputElement).getValue(),
    };

    const sanitizedPasswordData = sanitizeFormData(passwordData);

    try {
      await updateUserPassword(sanitizedPasswordData);
      alert('Password updated successfully');
    } catch (error) {
      console.error('Failed to update password:', error);
      alert('Failed to update password');
    }
  }

  /**
   * Рендерит HTML форму для изменения пароля.
   * @return {string} HTML строка для формы.
   */
  render() {
    return `
      <form class="edit-password-form">
        {{{ oldPasswordInput }}}
        {{{ newPasswordInput }}}
        {{{ submitButton }}}
      </form>
    `;
  }
}

export default EditPasswordForm;
