import compose from './compose';
import fetchEngine from './fetch';

export interface Context {
  [key: string]: any;
}

export interface ReqCtx {
  url: string;
  options: Context;
}

export interface Middleware {
  (ctx: Context, next: Function): any;
}

export type Cycle = 'req' | 'res';

export interface MiddlewareOptions {
  cycle: Cycle;
}

export interface Routes {
  [key: string]: string;
}

class Factory {
  private _reqMiddleware: Array<Middleware>;
  private _resMiddleware: Array<Middleware>;
  private _context: Context;
  protected _requestEngine: any;
  constructor() {
    this._reqMiddleware = []; // 存储请求前执行的中间件
    this._resMiddleware = []; // 存储返回后执行的中间件
    this._context = {}; // 存储响应体上下文
    this._requestEngine = fetchEngine; // 发起请求的库, 默认 fetchEngine
  }

  // 注册中间件
  use(middleware: Middleware, options: MiddlewareOptions): void {
    const { cycle } = options;
    if (cycle === 'req') {
      this._reqMiddleware.push(middleware);
    } else {
      this._resMiddleware.push(middleware);
    }
  }

  formatContext(context: Context): void {
    this._context = context;
  }

  protected createContext(req: ReqCtx): Context {
    const context = Object.create(this._context);
    context.req = req;
    return context;
  }

  // 执行中间件
  protected async run(ctx: any, cycle: Cycle) {
    if (cycle === 'req') {
      return await compose(this._reqMiddleware, ctx).catch((err: Error) => {
        this.onError(err);
      });
    }
    return await compose(this._resMiddleware, ctx).catch((err: Error) => {
      this.onError(err);
    });
  }

  protected onError(err: Error): void {
    console.error(err);
  }
}

export default Factory;
