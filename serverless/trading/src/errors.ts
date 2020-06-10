type Json = { [key: string]: any };
export class ScrapError extends Error {
  context: Json | null;

  constructor(message: string, context: Json | null = null) {
    super(message);
    this.context = context;
  }
}
