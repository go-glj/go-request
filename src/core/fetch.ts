export interface Options {
  [key: string]: any;
}

function fetchEngine(url: string, options: Options) {
  return fetch(url, options);
}

export default fetchEngine;
