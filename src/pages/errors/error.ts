import * as Handlebars from 'handlebars';

interface ErrData {
  error: string;
  errorDescription: string;
}

const errorData: ErrData = {
  error: '404',
  errorDescription: 'not found',
};

const templateSource: string = document.getElementById('error-template').innerHTML;

const template: Handlebars.TemplateDelegate<ErrData> = Handlebars.compile<ErrData>(templateSource);

document.getElementById('error-container').textContent = template(errorData);
