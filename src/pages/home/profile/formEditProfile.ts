import Block, {BlockProps} from '../../../scripts/block';
import {getValidationFunction} from '../../../scripts/validationFunctions';
import formFieldsTemplate from '../../../templates/formFields.hbs?raw';

/**
 * класс блока формы редактирования профиля
 * @class EditProfileFormBlock
 * @extends {Block}
 * @param {EditProfileFormBlockProps} props - свойства блока формы
 */
class EditProfileFormBlock extends Block<BlockProps> {
  /**
   * конструктор класса ExtendedBlock
   * @constructor
   * @param {ExtendedBlockProps} props - объект свойств блока
   */
  constructor(props: BlockProps) {
    super('form', props);
  };

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
    const formData = {
      formId: 'editProfileForm',
      showAvatar: true,
      inputsContainerClass: 'list-info',
      fields: [
        {id: 'email', label: 'email', name: 'email', type: 'email', value: ''},
        {id: 'login', label: 'login', name: 'login', type: 'text', value: ''},
        {id: 'first_name', label: 'name', name: 'first_name', type: 'text', value: ''},
        {id: 'second_name', label: 'last name', name: 'second_name', type: 'text', value: ''},
        {id: 'phone', label: 'phone', name: 'phone', type: 'tel', value: ''},
      ],
      buttonText: 'save',
      buttonId: 'saveProfileButton',
    };

    const template = Handlebars.compile(formFieldsTemplate);
    const renderedHtml = template(formData);

    return renderedHtml;
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

const editProfileFormBlock = new EditProfileFormBlock({
  events: {
    blur: (event: Event) => {
      editProfileFormBlock.handleBlur(event);
    },
    submit: (event: Event) => {
      editProfileFormBlock.handleClick(event);
    },
    beforeunload: () => {
      editProfileFormBlock.componentWillUnmount();
    },
  },
});

renderForm('.profile-container', editProfileFormBlock);
