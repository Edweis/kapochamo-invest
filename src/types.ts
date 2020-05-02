export type BinanceInfo = {
  title: string;
  content: string;
  time: Date;
  url: string;
};

export type BinanceInfoRaw = {
  title: string | null;
  content: string | null;
  time: string | null;
  url: string;
};
