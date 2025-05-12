declare module "currentsapi" {
  export interface CurrentsAPIArticle {
    id: string;
    title: string;
    description: string;
    url: string;
    author: string;
    image: string;
    language: string;
    category: string[];
    published: string;
  }

  export interface CurrentsAPIResponse {
    status: "ok" | string;
    news: CurrentsAPIArticle[];
  }

  export default class CurrentsAPI {
    constructor(apiKey: string);
    search(params: {
      keywords?: string;
      language?: string;
      country?: string;
      category?: string;
      limit?: number;
    }): Promise<CurrentsAPIResponse>;
  }
}
