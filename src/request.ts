import Factory, { ReqCtx } from './core/factory';

export interface Options {
  [key: string]: any;
}

export interface FirstOptions extends Options {
  url: string;
}

const defaultOptions = {
  cache: 'no-cache',
};

class Request extends Factory {
  constructor() {
    super();
  }

  cancel() {
    console.log('cancel');
  }

  get(parameter: string | FirstOptions, options: Options = defaultOptions) {
    return this.processing(parameter, { ...options, method: 'GET' });
  }

  post(parameter: string | FirstOptions, options: Options = defaultOptions) {
    return this.processing(parameter, { ...options, method: 'POST' });
  }

  delete(parameter: string | FirstOptions, options: Options = defaultOptions) {
    return this.processing(parameter, { ...options, method: 'DELETE' });
  }

  put(parameter: string | FirstOptions, options: Options = defaultOptions) {
    return this.processing(parameter, { ...options, method: 'PUT' });
  }

  patch(parameter: string | FirstOptions, options: Options = defaultOptions) {
    return this.processing(parameter, { ...options, method: 'PATCH' });
  }

  head(parameter: string | FirstOptions, options: Options = defaultOptions) {
    return this.processing(parameter, { ...options, method: 'HEAD' });
  }

  options(parameter: string | FirstOptions, options: Options = defaultOptions) {
    return this.processing(parameter, { ...options, method: 'OPTIONS' });
  }

  rpc(parameter: string | FirstOptions, options: Options = defaultOptions) {
    return this.processing(parameter, { ...options, method: 'RPC' });
  }

  private processing(parameter: string | FirstOptions, options: Options) {
    if (typeof parameter === 'string') {
      return this.request({
        url: parameter,
        options,
      });
    }
    return this.request({
      url: parameter.url,
      options: { ...options, ...parameter },
    });
  }

  private async request(reqCtx: ReqCtx) {
    const ctx = this.createContext(reqCtx);
    await this.run(ctx, 'req');
    const { url, options } = ctx.req;
    const res = await this._requestEngine(url, options).catch((err: Error) => {
      this.onError(err);
    });

    ctx.res = res;
    await this.run(ctx, 'res');
  }
}

export default Request;
