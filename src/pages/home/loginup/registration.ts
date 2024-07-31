import Block from '../../../core/block';
import {FormWrapper} from './formWrapper';
import FormReg from './formReg';
import {register} from './auth/reg';
import {connect} from '../../../scripts/connect';

interface RegistrationPageProps {
  regField?: string;
  isLoading?: boolean;
  registrationError?: string;
  [key: string]: any;
}

/**
 * Компонент страницы регистрации
 * @extends Block
 */
class RegistrationPage extends Block {
  /**
   * Создает экземпляр RegistrationPage.
   * @param {RegistrationPageProps} props - Свойства компонента.
   */
  constructor(props: RegistrationPageProps) {
    super({
      ...props,
      FormRegistration: new FormWrapper({
        title: 'sign up',
        formBody: new FormReg({}),
        onSubmit: (e) => {
          e.preventDefault();
          register({register: this.props.regField, password: ''});
        },
      }),
    });
  }

  /**
   * Отображение компонента
   * @return {string} Шаблон компонента.
   */
  render() {
    return `
      <div class="container registration-container">
        {{#if isLoading}}
          <h2>SPINER</h2>
        {{else}}
          {{{ FormRegistration }}}
          {{#if registrationError}}
              <p>{{{registrationError}}}</p>
          {{/if}}
        {{/if}}
      </div>
    `;
  }
}

const mapStateToPropsShort = (state: {
  regField?: string;
  isLoading?: boolean;
  registrationError?: string;
}) => ({
  regField: state.regField,
  isLoading: state.isLoading,
  registrationError: state.registrationError,
});

export default connect(mapStateToPropsShort)(RegistrationPage);
