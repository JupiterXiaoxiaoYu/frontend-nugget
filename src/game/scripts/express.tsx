import axios from "axios";
import { fullUrl } from "./request";
import { Bid, NuggetData, NuggetTabData } from "../../data/model";

const instance = axios.create({
  baseURL: fullUrl,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export function decodeNuggets(
  raws: any,
  default_owner?: number[]
): NuggetData[] {
  const commodityList: NuggetData[] = raws.map(
    ({
      attributes,
      feature,
      id,
      owner,
      marketid,
      sysprice,
      start,
    }: {
      attributes: number;
      feature: number;
      id: number;
      owner: number[];
      marketid: number;
      sysprice: number;
      start: number;
    }) => ({
      id: Number(id),
      marketid: marketid,
      attributes: String(attributes),
      feature: Number(feature),
      sysprice: Number(sysprice ?? 0),
      askprice: 0,
      bid: null,
      owner: owner ?? default_owner,
      lastUpdate: 0,
      earningStart: Number(start ?? 0),
    })
  );

  console.log("decode", commodityList);
  return commodityList;
}

function decodeMarkets(raws: any): NuggetData[] {
  const commodityList: NuggetData[] = raws.map(
    ({
      askprice,
      marketid,
      owner,
      bidder,
      object,
      settleinfo,
    }: {
      askprice: number;
      marketid: number;
      owner: number[];
      bidder: Bid;
      object: {
        attributes: number;
        feature: number;
        id: number;
        marketid: number;
        sysprice: number;
      };
      settleinfo: number;
    }) => ({
      id: Number(object.id),
      marketid: Number(marketid),
      attributes: String(object.attributes),
      feature: Number(object.feature),
      sysprice: Number(object.sysprice ?? 0),
      askprice: Number(askprice ?? 0),
      owner: owner,
      bid: bidder,
      lastUpdate: Number((BigInt(settleinfo) - 1n) >> 16n),
    })
  );

  console.log("decode", commodityList);
  return commodityList;
}

export const updateNuggetAsync = async (index: number, owner: number[]) => {
  const res = await getRequest(`/data/nugget/${index}`);
  const raws = res.data;
  console.log("getNugget ", index, " ", raws);
  return decodeNuggets(raws, owner)[0];
};

export const getNuggetsAsync = async (
  ids: number[],
  owner: number[]
): Promise<NuggetData[]> => {
  const queryString = ids.map((id) => `ids=${id}`).join("&");
  const res = await getRequest(`/data/nuggets?${queryString}`);
  const raws = res.data;
  console.log("getNuggets", raws);
  return decodeNuggets(raws, owner);
};

export const getSellingNuggetsAsync = async (
  skip: number,
  limit: number,
  pid1: string,
  pid2: string
): Promise<NuggetTabData> => {
  const res = await getRequest(
    `/data/sell/${pid1}/${pid2}?skip=${skip}&limit=${limit}`
  );
  const raws = res.data;
  console.log("getSelling", raws);
  return { nuggets: decodeMarkets(raws), nuggetCount: res.count };
};

export const getAuctionNuggetsAsync = async (
  skip: number,
  limit: number
): Promise<NuggetTabData> => {
  const res = await getRequest(`/data/markets?skip=${skip}&limit=${limit}`);
  const raws = res.data;
  console.log("getAuction", res, skip, limit);
  return { nuggets: decodeMarkets(raws), nuggetCount: res.count };
};

export const getLotNuggetsAsync = async (
  skip: number,
  limit: number,
  pid1: string,
  pid2: string
): Promise<NuggetTabData> => {
  const res = await getRequest(
    `/data/bid/${pid1}/${pid2}?skip=${skip}&limit=${limit}`
  );
  const raws = res.data;
  console.log("getLot", raws);
  return { nuggets: decodeMarkets(raws), nuggetCount: res.count };
};

export const getRankNuggetsAsync = async (
  skip: number,
  limit: number,
  owner: number[]
): Promise<NuggetTabData> => {
  const res = await getRequest(`/data/ranks?skip=${skip}&limit=${limit}`);
  const raws = res.data;
  console.log("getRank", res, skip, limit);
  return { nuggets: decodeNuggets(raws, owner), nuggetCount: res.count };
};

async function getRequest(path: string) {
  try {
    const response = await instance.get(path);
    if (response.status === 200 || response.status === 201) {
      const jsonResponse = response.data;
      return jsonResponse;
    } else {
      throw "Post error at " + path + " : " + response.status;
    }
  } catch (error) {
    throw "Unknown error at " + path + " : " + error;
  }
}

async function postRequest(path: string, formData: FormData) {
  try {
    const response = await instance.post(path, formData);
    if (response.status === 200 || response.status === 201) {
      const jsonResponse = response.data;
      return jsonResponse;
    } else {
      throw "Post error at " + path + " : " + response.status;
    }
  } catch (error) {
    throw "Unknown error at " + path + " : " + error;
  }
}
