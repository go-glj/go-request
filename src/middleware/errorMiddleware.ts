async function errorMiddleware(ctx: any, next: Function) {
  ctx.error = 123;
  await next();
  console.log(ctx.error);
}

export default errorMiddleware;
