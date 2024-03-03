import * as Handlebars from 'handlebars';

interface ErrData {
  error: string;
  errorDescription: string;
}

const errorData: ErrData = {
  error: '404',
  errorDescription: 'not found',
};

const errorTemplateElement = document.getElementById('error-template');
const errorContainerElement = document.getElementById('error-container');

if (errorTemplateElement && errorContainerElement) {
  const templateSource: string = errorTemplateElement.innerHTML;

  const template: Handlebars.TemplateDelegate<ErrData> =
    Handlebars.compile<ErrData>(templateSource);

  errorContainerElement.textContent = template(errorData);
} else {
  console.error('One or both elements not found');
}
