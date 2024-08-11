import Block from '../../../core/block';
import {FormWrapper} from './formWrapper';
import FormLogin from './formLogin';
import {login} from './auth/log';
import {connect} from '../../../scripts/connect';

interface LoginPageProps {
  loginField?: string;
  passwordField?: string;
  isLoading?: boolean;
  loginError?: string;
}

/**
 * класс блока формы входа
 * @class loginFormBlock
 * @extends {Block}
 * @param {loginFormBlock} props - свойства блока формы
 */
class LoginPage extends Block {
  /**
   * Создает экземпляр LoginPage.
   * @param {LoginPageProps} props - Свойства компонента.
   */
  constructor(props: LoginPageProps) {
    super({
      ...props,
      FormLogin: new FormWrapper({
        title: 'sign in',
        formBody: new FormLogin({}),
        onSubmit: (e: Event) => {
          e.preventDefault();
          login({login: this.props.loginField, password: this.props.passwordField});
        },
      }),
    });
  }

  /**
   * метод для рендеринга HTML формы в строку
   * @return {string} - HTML форма в виде строки
   */
  render() {
    return `
        <div class="container registration-container">
          {{#if isLoading}}
            <h2>SPINER</h2>
          {{else}}
            {{{ FormLogin }}}
            {{#if loginError}}
                <p class="error">{{{loginError}}}</p>
            {{/if}}
          {{/if}}
        </div>
      `;
  }
}


const mapStateToPropsShort = (state: {
    loginField?: string;
    isLoading?: boolean;
    loginError?: string;
    passwordField?: string;
  }) => ({
  loginField: state.loginField,
  isLoading: state.isLoading,
  loginError: state.loginError,
  passwordField: state.passwordField,
});

export default connect(mapStateToPropsShort)(LoginPage);
