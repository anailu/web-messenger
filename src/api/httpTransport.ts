export enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
};

type Options = {
  method: METHOD;
  data?: any;
};

type OptionsWithoutMethod = Omit<Options, 'method'>;

/**
 * Класс для выполнения HTTP запросов.
 */
export class HTTPTransport {
  private apiUrl: string = '';

  /**
   * Создает экземпляр HTTPTransport.
   * @param {string} apiPath - Базовый путь для API.
   */
  constructor(apiPath: string) {
    this.apiUrl = `https://ya-praktikum.tech/api/v2${apiPath}`;
  }

  /**
   * Выполняет GET запрос.
   * @template TResponse
   * @param {string} url - Адрес ресурса.
   * @param {OptionsWithoutMethod} [options={}] - Опции запроса.
   * @return {Promise<TResponse>} Ответ от сервера.
   */
  get<TResponse>(url: string, options: OptionsWithoutMethod = {}): Promise<TResponse> {
    return this.request<TResponse>(`${this.apiUrl}${url}`, {...options, method: METHOD.GET});
  };

  /**
   * Выполняет POST запрос.
   * @template TResponse
   * @param {string} url - Адрес ресурса.
   * @param {OptionsWithoutMethod} [options={}] - Опции запроса.
   * @return {Promise<TResponse>} Ответ от сервера.
   */
  post<TResponse>(url: string, options: OptionsWithoutMethod = {}): Promise<TResponse> {
    return this.request<TResponse>(`${this.apiUrl}${url}`, {...options, method: METHOD.POST});
  };

  /**
   * Выполняет DELETE запрос.
   * @template TResponse
   * @param {string} url - Адрес ресурса.
   * @param {OptionsWithoutMethod} [options={}] - Опции запроса.
   * @return {Promise<TResponse>} Ответ от сервера.
   */
  delete<TResponse>(url: string, options: OptionsWithoutMethod = {}): Promise<TResponse> {
    return this.request<TResponse>(`${this.apiUrl}${url}`, {...options, method: METHOD.DELETE});
  };

  /**
   * Выполняет PUT запрос.
   * @template TResponse
   * @param {string} url - Адрес ресурса.
   * @param {OptionsWithoutMethod} [options={}] - Опции запроса.
   * @return {Promise<TResponse>} Ответ от сервера.
   */
  put<TResponse>(url: string, options: OptionsWithoutMethod = {}): Promise<TResponse> {
    return this.request<TResponse>(`${this.apiUrl}${url}`, {...options, method: METHOD.PUT});
  }

  /**
   * Выполняет HTTP запрос с заданными опциями.
   * @template TResponse
   * @param {string} url - Полный URL ресурса.
   * @param {Options} options - Опции запроса, включая метод и данные.
   * @return {Promise<TResponse>} Ответ от сервера.
   */
  async request<TResponse>(url: string,
      options: Options = {method: METHOD.GET}): Promise<TResponse> {
    const {method, data} = options;
    const headers: HeadersInit = {};

    if (data && !(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : null;

    const response = await fetch(url, {
      method,
      credentials: 'include',
      mode: 'cors',
      headers,
      body,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const resultData = await isJson ? response.json() : null;

    return resultData as unknown as TResponse;
  };
}
