import axios from 'axios';
import fs from 'fs';
import { compress } from './plainuml';

const isTest = process.env.JEST_WORKER_ID != null;
type Urls = { img: string; svg: string; txt: string };

export const encodePlainUrls = (text: string): Urls => compress(text);

const getUrlFromFile = async (file: string) => {
  const umlText = await fs.promises.readFile(file, 'utf8');
  return encodePlainUrls(umlText);
};

const saveImage = async (url: string, out: string) => {
  const response = await axios.get(url, { responseType: 'stream' });
  response.data.pipe(fs.createWriteStream(out));
  console.debug(`Uml saved in ${out}`);
};

const files = ['./src/docs/uml.txt'];
const getImages = async () => {
  const promises = files.map(async file => {
    const urls = await getUrlFromFile(file);
    const out = file.replace('.txt', '.png');
    await saveImage(urls.img, out);
  });
  Promise.all(promises);
};

if (!isTest) getImages();
