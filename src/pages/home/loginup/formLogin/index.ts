import Block from '../../../../core/block';
import {fillLogin} from '../auth/setAuthorizationFields';
import Button from '../../../../components/button/button';
import InputElement from '../../../../components/input/inputElement';
import {getValidationFunction} from '../../../../scripts/validationFunctions';
import {login} from '../auth/log';
import {sanitizeFormData} from '../../../../scripts/sanitize';

interface FormLoginProps {
  children?: {
    InputLogin?: InputElement;
    FormPassword?: InputElement;
    ButtonLogin?: Button;
    ButtonCreateAccount?: Button;
  };
}

/**
 * Компонент формы авторизации
 * @extends Block
 */
class FormLogin extends Block {
  /**
   * Создает экземпляр FormLogin.
   * @param {FormLoginProps} props - Свойства компонента.
   */
  constructor(props: FormLoginProps) {
    super(props);
  }

  /**
   * Инициализация компонента.
   * Создает и настраивает элементы формы и кнопки.
   * @private
   */
  init() {
    const onLoginBind = this.onLogin.bind(this);

    const InputLogin = new InputElement({
      label: 'login',
      validate: getValidationFunction('login'),
    });

    const FormPassword = new InputElement({
      label: 'password',
      validate: getValidationFunction('password'),
    });

    const ButtonLogin = new Button({
      label: 'sign in',
      type: 'primary',
      onClick: onLoginBind,
    });

    const ButtonCreateAccount = new Button({
      label: 'sign up',
      type: 'link',
      onClick: () => {
        window.router.go('/sign-up');
      },
    });

    this.children = {
      InputLogin,
      FormPassword,
      ButtonLogin,
      ButtonCreateAccount,
    };
  }

  /**
   * Обрабатывает изменения в полях ввода формы.
   * @param {Event} e - Событие изменения.
   * @private
   */
  onChangeLogin(e: Event) {
    const inputValue = (e.target as HTMLInputElement).value;
    if (inputValue === 'error') {
      this.children.InputLogin.setProps({error: true, errorText: 'some error'});
      return;
    } else {
      this.children.InputLogin.setProps({error: false, errorText: null});
    }

    fillLogin(inputValue);
  }

  /**
   * Обрабатывает отправку формы.
   * @param {Event} e - Событие отправки формы.
   */
  async onLogin(e: Event) {
    e.preventDefault();

    const errors = this.validateAllFields();

    if (Object.keys(errors).length > 0) {
      console.log('Form validation failed:', errors);
      return;
    }

    const formData = this.getFormData();
    const sanitizedData = sanitizeFormData(formData);

    try {
      await login({
        login: sanitizedData.login,
        password: sanitizedData.password,
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  /**
   * Получает данные формы.
   * @return {Object} Данные формы.
   */
  getFormData() {
    return {
      login: (this.children.InputLogin as InputElement).getValue(),
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
      login: this.children.InputLogin,
      password: this.children.FormPassword,
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
   * Отображает компонент.
   * @return {string} Шаблон компонента.
   */
  render() {
    return (`
          <div>
              <div class="form-content">
                  {{{ InputLogin }}}
                  {{{ FormPassword }}}
              </div>
              {{{ ButtonLogin }}}
              {{{ ButtonCreateAccount }}}
          </div>
      `);
  }
}

export default FormLogin;
