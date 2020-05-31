import { getBrowser } from './browser';
import { scrapPageInfo } from '../../news/binance/scraping';

type BinanceInfoOject = {
  url: string;
  title: string;
  content: string;
  time: Date;
};
class BinanceInfoNEXT {
  url: string;

  title: string;

  readTime: Date;

  private time: Date | null = null;

  private content: string | null = null;

  constructor(url: string, title: string) {
    this.url = url;
    this.title = title;
    this.readTime = new Date();
    this.populate = this.populate.bind(this);
    this.getContent = this.getContent.bind(this);
    this.getTime = this.getTime.bind(this);
    this.toObject = this.toObject.bind(this);
  }

  static fromObject(object: BinanceInfoOject) {
    const instance = new BinanceInfoNEXT(object.url, object.title);
    instance.content = object.content;
    instance.time = object.time;
    return instance;
  }

  private async populate() {
    const browser = await getBrowser();
    const fullInfo = await scrapPageInfo(browser, this.url);
    this.content = fullInfo.content;
    this.time = fullInfo.time;
  }

  async getContent(): Promise<string> {
    if (this.content != null) return this.content;
    await this.populate();
    if (this.content == null) throw new Error('Content should not be empty !');
    return this.content;
  }

  async getTime(): Promise<Date> {
    if (this.time != null) return this.time;
    await this.populate();
    if (this.time == null) throw new Error('Time should not be empty !');
    return this.time;
  }

  async toObject() {
    const content = await this.getContent();
    const time = await this.getTime();
    return {
      url: this.url,
      title: this.title,
      content,
      time: time.toISOString(),
      addedAt: this.readTime.toISOString(),
    };
  }
}

export default BinanceInfoNEXT;
