export interface Bid {
  bidprice: number;
  bidder: number[];
}

export interface NuggetData {
  id: number;
  marketid: number;
  attributes: string;
  feature: number;
  cycle: number;
  sysprice: number;
  askprice: number;
  bid: Bid | null;
}

export const emptyNuggetData: NuggetData = {
  id: 0,
  marketid: 0,
  attributes: "",
  feature: 0,
  cycle: 0,
  sysprice: 0,
  askprice: 0,
  bid: null,
};

export interface NuggetTabData {
  nuggets: NuggetData[];
  nuggetCount: number;
}

export const emptyNuggetTabData: NuggetTabData = {
  nuggets: [],
  nuggetCount: -1,
};

export interface NuggetPageData {
  nuggets: NuggetData[];
  page: number;
  pageCount: number;
}

export const emptyNuggetPageData: NuggetPageData = {
  nuggets: [],
  page: 0,
  pageCount: 0,
};
