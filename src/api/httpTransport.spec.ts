import {expect} from 'chai';
import sinon from 'sinon';
import {HTTPTransport, METHOD} from './httpTransport';

describe('HTTPTransport', () => {
  let http: HTTPTransport;
  let fetchStub: sinon.SinonStub;

  const mockFetch = (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const options = input instanceof Request ? input : init;

    const responseMock = {success: true};
    const body = options?.method === 'GET' ? responseMock :
    (options?.body ? JSON.parse(options.body as string) : {});

    const responseInit: ResponseInit = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = new Response(JSON.stringify(body), responseInit);
    return Promise.resolve(response);
  };

  beforeEach(() => {
    http = new HTTPTransport('/test-path');
    fetchStub = sinon.stub(global, 'fetch').callsFake(mockFetch);
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it('должен отправлять GET запрос', async () => {
    const responseMock = {success: true};
    fetchStub.resolves(new Response(JSON.stringify(responseMock), {
      headers: {'Content-Type': 'application/json'},
    }));

    const response = await http.get('/test-url');
    expect(fetchStub.calledOnceWith('https://ya-praktikum.tech/api/v2/test-path/test-url',
        sinon.match({
          method: METHOD.GET,
        })
    )).to.be.true;

    expect(response).to.deep.equal(responseMock);
  });

  it('должен отправлять POST запрос', async () => {
    const responseMock = {success: true};
    fetchStub.resolves(new Response(JSON.stringify(responseMock), {
      headers: {'Content-Type': 'application/json'},
    }));

    const response = await http.post('/test-url', {data: {key: 'value'}});
    expect(fetchStub.calledOnceWith('https://ya-praktikum.tech/api/v2/test-path/test-url',
        sinon.match({
          method: METHOD.POST,
          body: JSON.stringify({key: 'value'}),
          headers: {'Content-Type': 'application/json'},
        })
    )).to.be.true;

    expect(response).to.deep.equal(responseMock);
  });

  it('должен отправлять DELETE запрос', async () => {
    const responseMock = {success: true};
    fetchStub.resolves(new Response(JSON.stringify(responseMock), {
      headers: {'Content-Type': 'application/json'},
    }));

    const response = await http.delete('/test-url');
    expect(fetchStub.calledOnceWith('https://ya-praktikum.tech/api/v2/test-path/test-url',
        sinon.match({
          method: METHOD.DELETE,
        })
    )).to.be.true;

    expect(response).to.deep.equal(responseMock);
  });

  it('должен отправлять PUT запрос', async () => {
    const responseMock = {success: true};
    fetchStub.resolves(new Response(JSON.stringify(responseMock), {
      headers: {'Content-Type': 'application/json'},
    }));

    const response = await http.put('/test-url', {data: {key: 'value'}});
    expect(fetchStub.calledOnceWith('https://ya-praktikum.tech/api/v2/test-path/test-url',
        sinon.match({
          method: METHOD.PUT,
          body: JSON.stringify({key: 'value'}),
          headers: {'Content-Type': 'application/json'},
        })
    )).to.be.true;

    expect(response).to.deep.equal(responseMock);
  });
});
