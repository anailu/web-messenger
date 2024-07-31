import Block from '../../../../core/block';

interface FormWrapperProps {
  title: string;
  formBody: Block<any>;
  onClick?: (event: Event) => void;
  onSubmit?: (event: Event) => void;
}

/**
 * Компонент обертки для формы
 * @extends Block
 */
export default class FormWrapper extends Block {
  /**
   * Создает экземпляр FormWrapper.
   * @param {FormWrapperProps} props - Свойства компонента.
   */
  constructor(props: FormWrapperProps) {
    super({
      ...props,
      events: {
        click: props.onClick,
      },
    });
  }

  /**
   * Отображение компонента
   * @return {string} Шаблон компонента в виде строки.
   */
  render() {
    return (`
        <Form class="form">
            <p class="form-title">{{title}}</p>
            <div class="form-content">
                {{{ formBody }}} 
            </div>
        </Form>
      `
    );
  }
}
