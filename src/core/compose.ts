import { Context } from './factory';

// 洋葱模型执行中间件
function compose(middlewares: Array<Function>, ctx: Context) {
  let middlewareIndex = 0;
  function dispatch() {
    if (middlewareIndex >= middlewares.length) {
      return Promise.resolve(ctx);
    }

    const currentMiddleware = middlewares[middlewareIndex];
    middlewareIndex++;

    try {
      return Promise.resolve(
        currentMiddleware(ctx, () => {
          return dispatch();
        })
      );
    } catch (err) {
      return Promise.reject(err);
    }
  }
  return dispatch();
}

export default compose;
