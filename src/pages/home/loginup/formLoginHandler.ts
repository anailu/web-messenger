import Block, {BlockProps} from '../../../scripts/block';
import {getValidationFunction} from '../../../scripts/validationFunctions';

/**
 * класс блока формы входа
 * @class loginFormBlock
 * @extends {Block}
 * @param {loginFormBlock} props - свойства блока формы
 */
class LoginFormBlock extends Block<BlockProps> {
  /**
   * конструктор класса loginFormBlock
   * @constructor
   * @param {ExtendedBlockProps} props - объект свойств блока
   */
  constructor(props: BlockProps) {
    super('form', props);
    this.addEventListeners();
  }

  /**
   * обработчик клика по кнопке входа
   * @param {Event} event - событие клика
   */
  handleClick(event: Event) {
    event.preventDefault();

    const formData: Record<string, string> = {};
    const inputs = this.element.querySelectorAll('input');

    inputs.forEach((input) => {
      formData[input.name] = (input as HTMLInputElement).value;
    });

    const isFormEmpty = Object.values(formData).every((value) => value === '');

    if (isFormEmpty) {
      alert('enter data into the form fields');
      return;
    }

    const validationResults: Record<string, boolean> = {};
    Object.entries(formData).forEach(([fieldName, fieldValue]) => {
      const validationFunction = getValidationFunction(fieldName);
      if (validationFunction) {
        validationResults[fieldName] = validationFunction(fieldValue);
      } else {
        validationResults[fieldName] = true;
      }
    });

    const isValidForm = Object.values(validationResults).every((result) => result);

    if (isValidForm) {
      console.log('form data:', formData);
    } else {
      alert('form data is invalid\nplease check the fields');
    }
  }

  /**
   * обработчик потери фокуса поля ввода
   * @param {Event} event - событие потери фокуса
   */
  handleBlur(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputName = inputElement.name;
    const inputValue = inputElement.value;

    const validationFunction = getValidationFunction(inputName);
    if (validationFunction) {
      const isValid = validationFunction(inputValue);
      if (!isValid) {
        alert(`invalid ${inputName} value`);
      }
    }
  }

  /**
   * метод для удаления блока
   */
  componentWillUnmount() {
    super.componentWillUnmount();
  }

  /**
   * метод для рендеринга HTML формы в строку
   * @return {string} - HTML форма в виде строки
   */
  render(): string {
    return `
    <form id="login-form" action="" method="post">
      <div class="form-group">
        <label for="login" class="input_header">login</label>
        <input type="text" id="login" name="login" required>

        <label for="password" class="input_header">password</label>
        <input type="password" id="password" name="password" required>
      </div>

      <button id="signInButton" type="submit" class="submit">sign in</button>
    </form> 
    `;
  }

  /**
   * метод для добавления слушателей событий
   */
  addEventListeners() {
    this.element.querySelector('#signInButton')
        ?.addEventListener('click', this.handleClick.bind(this));
    this.element.querySelector('#login')
        ?.addEventListener('blur', this.handleBlur.bind(this));
    this.element.querySelector('#password')
        ?.addEventListener('blur', this.handleBlur.bind(this));
  }
}

/**
 * функция для рендеринга формы
 * @param {string} query - селектор для поиска места вставки формы
 * @param {Block} block - экземпляр блока формы
 * @return {HTMLElement | undefined} - HTML элемент, куда была вставлена форма
 */
function renderForm(query: string, block: Block) {
  const root = document.querySelector(query);
  if (root) {
    root.appendChild(block.getContent());
    return root;
  } else {
    console.log(`element ${query} not found`);
    return undefined;
  }
}

const loginForm = new LoginFormBlock({
  events: {
    blur: (event: Event) => {
      loginForm.handleBlur(event);
    },
    submit: (event: Event) => {
      loginForm.handleClick(event);
    },
  },
});

renderForm('.form_container', loginForm);

window.addEventListener('beforeunload', () => {
  loginForm.componentWillUnmount();
});
