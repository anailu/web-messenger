import Block, {BlockProps} from '../../../scripts/blockForm';
import {validateLogin, validatePassword} from '../../../scripts/validationRules';
import {validateForm, addBlurValidation} from '../../../scripts/formValidationUtils';
interface ExtendedBlockProps extends BlockProps {
  additionalEvents: { [event: string]: (event: Event) => void };
}

/**
 * класс для расширенного блока
 * @class
 */
class ExtendedBlock extends Block {
  /**
   * конструктор класса ExtendedBlock
   * @constructor
   * @param {ExtendedBlockProps} props - объект свойств блока
   * @param {string} elementId - идентификатор HTML-элемента
   */
  constructor(props: ExtendedBlockProps, elementId: string) {
    const element = document.getElementById(elementId) as HTMLElement | null;
    super(element);
    this.addEvents(props.additionalEvents);
  }

  /**
   * Добавляет обработчики событий к блоку
   * @param {Object} events - объект, содержащий обработчики событий
   * @private
   */
  private addEvents(events: { [event: string]: (event: Event) => void }): void {
    if (!this.element) {
      console.error('Element is undefined');
      return;
    }

    for (const event in events) {
      if (events.hasOwnProperty(event)) {
        const handler = events[event];
        this._eventHandlers[event] = handler;
        this.element.addEventListener(event, handler);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const fields = ['login', 'password'];
  const formData: { [key: string]: string } = {};
  const additionalEvents = {
    submit: (event: Event) => {
      event.preventDefault();

      fields.forEach((fieldName) => {
        const input = document.getElementById(fieldName) as HTMLInputElement;
        const fieldValue = input.value.trim();

        if (!validateForm(fieldName, fieldValue, validateLogin, 'Invalid login format')) {
          return;
        }

        formData[fieldName] = fieldValue;
      });

      console.log('Form Data:', formData);

      fields.forEach((fieldName) => {
        const input = document.getElementById(fieldName) as HTMLInputElement;
        input.value = '';
      });
    },
  };

  const loginBlock = new ExtendedBlock({events: {}, additionalEvents}, 'login-form');
  loginBlock;

  const addValidation = (
      fieldName: string,
      validationFunction: (value: string) => boolean,
      errorMessage: string
  ) => {
    const input = document.getElementById(fieldName) as HTMLInputElement;
    addBlurValidation(input, validationFunction, errorMessage);
  };


  fields.forEach((fieldName) => {
    switch (fieldName) {
      case 'login':
        addValidation(fieldName, validateLogin, 'Invalid login format');
        break;
      case 'password':
        addValidation(fieldName, validatePassword, 'Invalid password format');
        break;
    }
  });
});
