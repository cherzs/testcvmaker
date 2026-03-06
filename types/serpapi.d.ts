declare module 'serpapi' {
  interface SerpApiParams {
    engine: string;
    api_key: string;
    [key: string]: any;
  }

  interface SerpApiCallback {
    (json: any): void;
  }

  export function getJson(params: SerpApiParams, callback: SerpApiCallback): void;
}
