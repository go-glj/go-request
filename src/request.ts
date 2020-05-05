import Factory, { Context, ReqCtx } from './core/factory';

export type Method = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'head' | 'options' | 'rpc';

export interface Options {
  [key: string]: any;
}

export interface FirstOptions extends Options {
  url: string;
}

export type RequestMethod = (parameter: string | FirstOptions, options?: Options) => Context;

class Request extends Factory {
  get?: RequestMethod;
  post?: RequestMethod;
  delete?: RequestMethod;
  put?: RequestMethod;
  patch?: RequestMethod;
  head?: RequestMethod;
  options?: RequestMethod;
  rpc?: RequestMethod;
  constructor() {
    super();
    const methods: Array<Method> = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options', 'rpc'];
    methods.forEach(method => {
      this[method] = (parameter: string | FirstOptions, options: Options = {}) => {
        return this.processing(parameter, { ...options, method: method.toUpperCase() });
      };
    });
  }

  cancel() {
    console.log('cancel');
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
    return ctx;
  }
}

export default Request;
