import Block from '../../../../core/block';
import Button from '../../../../components/button/button';
import InputElement from '../../../../components/input/inputElement';
import {getValidationFunction} from '../../../../scripts/validationFunctions';
import {sanitizeFormData} from '../../../../scripts/sanitize';
import {register} from '../auth/reg';

interface FormRegistrationProps {
  email?: string;
  login?: string;
  first_name?: string;
  second_name?: string;
  phone?: string;
  password?: string;
}

/**
 * Компонент формы регистрации
 * @extends Block
 */
class FormRegistration extends Block {
  /**
   * Создает экземпляр FormRegistration.
   * @param {FormRegistrationProps} props - Свойства компонента.
   */
  constructor(props: FormRegistrationProps) {
    super(props);
  }

  /**
   * Инициализация компонента.
   * Создает и настраивает элементы формы и кнопки.
   * @private
   */
  init() {
    const onInputChangeBind = this.onInputChange.bind(this);

    const InputEmail = new InputElement({
      label: 'email',
      name: 'InputEmail',
      onBlur: onInputChangeBind,
      validate: getValidationFunction('email'),
    });

    const InputLogin = new InputElement({
      label: 'login',
      onBlur: onInputChangeBind,
      validate: getValidationFunction('login'),
    });

    const InputName = new InputElement({
      label: 'first name',
      onBlur: onInputChangeBind,
      validate: getValidationFunction('first_name'),
    });

    const InputLastName = new InputElement({
      label: 'second name',
      onBlur: onInputChangeBind,
      validate: getValidationFunction('second_name'),
    });

    const InputPhone = new InputElement({
      label: 'phone',
      onBlur: onInputChangeBind,
      validate: getValidationFunction('phone'),
    });

    const FormPassword = new InputElement({
      label: 'password',
      validate: getValidationFunction('password'),
    });

    const ButtonReg = new Button({
      label: 'sign up',
      type: 'primary',
      onClick: (e) => this.onSubmit(e),
    });

    const ButtonSignIn = new Button({
      label: 'sign in',
      type: 'link',
      onClick: () => {
        window.router.go('/');
      },
    });

    this.children = {
      ...this.children,
      InputEmail,
      InputLogin,
      InputName,
      InputLastName,
      InputPhone,
      FormPassword,
      ButtonReg,
      ButtonSignIn,
    };
  }

  /**
   * Обрабатывает изменения в полях ввода формы.
   * @param {Event} e - Событие изменения.
   * @private
   */
  onInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const {name, value} = target;

    this.setProps({[name]: value});
  }

  /**
   * Обрабатывает отправку формы регистрации.
   * @param {Event} e - Событие отправки формы.
   * @return {Promise<void>}
   */
  async onSubmit(e: Event) {
    e.preventDefault();
    const errors = this.validateAllFields();

    if (Object.keys(errors).length > 0) {
      console.log('Form contains errors:', errors);
      return;
    }

    const formData = this.getFormData();
    const sanitizedData = sanitizeFormData(formData);

    try {
      await register(sanitizedData);
      console.log('Registration successful, form data:', formData);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  /**
   * Получает данные формы.
   * @return {Object} Данные формы.
   */
  getFormData() {
    return {
      email: (this.children.InputEmail as InputElement).getValue(),
      login: (this.children.InputLogin as InputElement).getValue(),
      first_name: (this.children.InputName as InputElement).getValue(),
      second_name: (this.children.InputLastName as InputElement).getValue(),
      phone: (this.children.InputPhone as InputElement).getValue(),
      password: (this.children.FormPassword as InputElement).getValue(),
    };
  }

  /**
 * Проверяет все поля формы и возвращает объект с ошибками.
 * @return {Object} Объект с ошибками для каждого поля.
 */
  validateAllFields() {
    const errors: { [key: string]: string } = {};

    const fields = {
      email: this.children.InputEmail,
      login: this.children.InputLogin,
      first_name: this.children.InputName,
      second_name: this.children.InputLastName,
      phone: this.children.InputPhone,
      password: this.children.FormPassword,
    };

    for (const [key, field] of Object.entries(fields)) {
      if (field && field instanceof InputElement) {
        const value = field.getValue();
        const validate = getValidationFunction(key);
        if (validate) {
          const isValid = validate(value);
          if (!isValid) {
            errors[key] = `Enter a valid ${key.replace('_', ' ')}`;
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
   * Отображает компонент.
   * @return {string} Шаблон компонента.
   */
  render() {
    return (`
      <div>
        <div class="form-content">
          {{{ InputEmail }}}
          {{{ InputLogin }}}
          {{{ InputName }}}
          {{{ InputLastName }}}
          {{{ InputPhone }}}
          {{{ FormPassword }}}
        </div>
        {{{ ButtonReg }}}
        {{{ ButtonSignIn }}}
      </div>
    `);
  }
}

export default FormRegistration;
