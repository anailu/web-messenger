import Block, {BlockProps} from '../../../scripts/block';
import {getValidationFunction} from '../../../scripts/validationFunctions';

/**
 * класс блока формы регистрации
 * @class RegistrationFormBlock
 * @extends {Block}
 * @param {RegistrationFormBlock} props - свойства блока формы
 */
class RegistrationFormBlock extends Block<BlockProps> {
  /**
   * конструктор класса ExtendedBlock
   * @constructor
   * @param {ExtendedBlockProps} props - объект свойств блока
   */
  constructor(props: BlockProps) {
    super('form', props);
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

      inputs.forEach((input) => {
        (input as HTMLInputElement).value = '';
      });
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
    console.log(`Blur event occurred on input with name: ${inputElement.name}`);
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
      <form id="registration-form" action="" method="post">
        <div class="form-group">
          <label for="email" class="input_header">email</label>
          <input type="email" id="email" name="email" required">
        </div>
        <div class="form-group">
          <label for="login" class="input_header">login</label>
          <input type="text" id="login" name="login" required>
        </div>
        <div class="form-group">
          <label for="first_name" class="input_header">name</label>
          <input type="text" id="first_name" name="first_name" required>
        </div>
        <div class="form-group">
          <label for="second_name" class="input_header">last name</label>
          <input type="text" id="second_name" name="second_name" required>
        </div>
        <div class="form-group">
          <label for="phone" class="input_header">phone</label>
          <input type="tel" id="phone" name="phone" required>
        </div>
        <div class="form-group">
          <label for="password" class="input_header">password</label>
          <input type="password" id="password" name="password" required>
        </div>
          <div class="form-group">
          <button id="registrationButton" type="submit" class="submit">sign up</button>
        </div>
      </form>
    `;
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
    return undefined;
  }
}

const registrationFormBlock = new RegistrationFormBlock({
  events: {
    submit: (event: Event) => {
      registrationFormBlock.handleClick(event);
    },
    blur: (event: Event) => {
      registrationFormBlock.handleBlur(event);
    },
    beforeunload: () => {
      registrationFormBlock.componentWillUnmount();
    },
  },
});

renderForm('.form_container', registrationFormBlock);
