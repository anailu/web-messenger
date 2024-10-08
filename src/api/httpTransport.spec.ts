import {expect} from 'chai';
import sinon from 'sinon';
import {HTTPTransport, METHOD} from './httpTransport';
import fetch, {Response} from 'node-fetch';

(globalThis as any).fetch = fetch;

describe('HTTPTransport', () => {
  let http: HTTPTransport;
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    http = new HTTPTransport('/test-path');
    fetchStub = sinon.stub(globalThis, 'fetch').callsFake(fetch as any);
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
