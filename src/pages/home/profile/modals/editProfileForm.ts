import Block from '../../../../core/block';
import Input from '../../../../components/input/input';
import InputElement from '../../../../components/input/inputElement';
import {Button} from '../../../../components/button';
import {updateUserData, updateUserAvatar} from '../api/meApi';
import {getValidationFunction} from '../../../../scripts/validationFunctions';
import {sanitizeFormData} from '../../../../scripts/sanitize';

interface EditProfileFormProps {
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
 * Класс для формы редактирования профиля.
 * @extends Block
 */
class EditProfileForm extends Block {
  /**
   * Создает экземпляр EditProfileForm.
   * @param {EditProfileFormProps} props - Свойства формы.
   */
  constructor(props: EditProfileFormProps) {
    super(props);
  }

  /**
   * Инициализирует элементы формы и устанавливает события.
   */
  init() {
    const {email, firstName, secondName, login, phone} = this.props.user;

    this.children.avatarInput = new Input({
      type: 'file',
      input_class: 'avatar-input',
    });

    this.children.emailInput = new InputElement({
      label: 'email',
      value: email || '',
      validate: getValidationFunction('email'),
    });

    this.children.firstNameInput = new InputElement({
      label: 'first name',
      value: firstName || '',
      validate: getValidationFunction('first_name'),
    });

    this.children.lastNameInput = new InputElement({
      label: 'last name',
      value: secondName || '',
      validate: getValidationFunction('second_name'),
    });

    this.children.loginInput = new InputElement({
      label: 'login',
      value: login || '',
      validate: getValidationFunction('login'),
    });

    this.children.phoneInput = new InputElement({
      label: 'phone',
      value: phone || '',
      validate: getValidationFunction('phone'),
    });

    this.children.submitButton = new Button({
      type: 'submit',
      label: 'save',
    });

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
      email: this.children.emailInput,
      first_name: this.children.firstNameInput,
      second_name: this.children.lastNameInput,
      login: this.children.loginInput,
      phone: this.children.phoneInput,
    };

    for (const [key, field] of Object.entries(fields)) {
      if (field && field instanceof InputElement) {
        const value = field.getValue();
        const validate = getValidationFunction(key);
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
   * Обрабатывает отправку формы, обновляет данные пользователя и аватар.
   * @param {Event} event - Событие отправки формы.
   */
  async handleSubmit(event: Event) {
    event.preventDefault();

    const errors = this.validateAllFields();

    if (Object.keys(errors).length > 0) {
      console.log('Form validation failed:', errors);
      return;
    }

    const formData = {
      email: (this.children.emailInput as InputElement).getValue(),
      first_name: (this.children.firstNameInput as InputElement).getValue(),
      second_name: (this.children.lastNameInput as InputElement).getValue(),
      login: (this.children.loginInput as InputElement).getValue(),
      phone: (this.children.phoneInput as InputElement).getValue(),
    };

    const sanitizedData = sanitizeFormData(formData);

    const fileInput = this.element?.querySelector('input[type="file"]') as HTMLInputElement;
    const files = fileInput.files;

    try {
      if (files && files[0]) {
        await updateUserAvatar({avatar: files[0]});
      }

      await updateUserData(sanitizedData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }

    console.log('Form submitted with data:', sanitizedData);
  }

  /**
   * Рендерит HTML форму для редактирования профиля.
   * @return {string} HTML строка для формы.
   */
  render() {
    return `
      <form class="editProfile_form">
        <div class="avatar-section">
          <img src="${this.props.user.avatar}" alt="User Avatar" class="current-avatar" />
          {{{ avatarInput }}}
        </div>
        {{{ emailInput }}}
        {{{ loginInput }}}
        {{{ firstNameInput }}}
        {{{ lastNameInput }}}
        {{{ phoneInput }}}
        {{{ submitButton }}}
      </form>
    `;
  }
}

export default EditProfileForm;
