import Block from '../../core/block';
import ErrorLine from '../error-line';
import Input from './input';

interface InputElementProps {
  label: string;
  value?: string;
  errorText?: string;
  type?: string;
  validate?: (value: string) => boolean;
  onBlur?: (event: Event) => void;
  name?: string;
}

/**
 * Компонент поля ввода с меткой и обработкой ошибок
 * @extends Block
 */
class InputElement extends Block {
  /**
   * Конструктор компонента
   * @param {InputElementProps} props - Пропсы для компонента
   */
  constructor(props: InputElementProps) {
    super({
      ...props,
      Input: new Input({
        value: props.value || '',
        name: props.name,
        events: {
          blur: (e) => this.handleBlur(e),
        },
      }),
      ErrorLine: new ErrorLine({
        error: props.errorText || '',
      }),
    });
  }

  /**
   * обработчик потери фокуса поля ввода
   * @param {Event} event - событие потери фокуса
   */
  handleBlur(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const {validate, label, onBlur} = this.props as InputElementProps;

    if (validate) {
      const isValid = validate(value);
      this.setProps({errorText: isValid ? '' : `Enter a valid ${label}`});
    }

    if (onBlur) {
      onBlur(event);
    }
  }

  /**
   * Обработчик обновления компонента
   * @param {InputElementProps} oldProps - Старые пропсы
   * @param {InputElementProps} newProps - Новые пропсы
   * @return {boolean} - Флаг необходимости перерисовки компонента
   */
  componentDidUpdate(oldProps: InputElementProps, newProps: InputElementProps): boolean {
    let hasChanged = false;

    if (oldProps.value !== newProps.value) {
      this.children.Input.setProps({value: newProps.value || ''});
      hasChanged = true;
    }

    if (oldProps.errorText !== newProps.errorText) {
      this.children.ErrorLine.setProps({error: newProps.errorText});
      hasChanged = true;
    }

    return hasChanged;
  }

  /**
   * Получение значения поля ввода
   * @return {string} - Значение поля ввода
   * @throws {Error} - Если элемент ввода не найден
   */
  getValue(): string {
    const inputElement = this.element?.querySelector('input') as HTMLInputElement | null;
    if (!inputElement) {
      throw new Error('Input element not found');
    }
    return inputElement.value;
  }

  /**
   * Рендеринг HTML для компонента
   * @return {string} - HTML строка
   */
  render(): string {
    return `
      <div class="input ${this.props.errorText ? 'input__error' : ''}" >
          <label class="input__container">
            <div class="input__label ${this.props.error ?
              'input__label--error' : ''}">${this.props.label}</div>
            {{{ ErrorLine }}}
            {{{ Input }}}
          </label>
      </div>
  `;
  }
}

export default InputElement;
