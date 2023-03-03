import { HLTBResult } from "./models";
import axios from 'axios';

  export const BASE_URL: string = 'https://howlongtobeat.com/';
  export const IMAGE_URL: string = `${BASE_URL}games/`;

  const payload: any = {
    "lists":[
      
    ],
    "set_playstyle":"comp_all",
    "name":"",
    "platform":"",
    "storefront":"",
    "sortBy":"time_to_beat",
    "sortFlip":0,
    "view":"box",
    "random":0,
    "limit":102,
    "currentUserHome":false
  }

  function getUserUrl(userId: number): string {
    return `${BASE_URL}api/user/${userId}/games/list`
  }

  export const GetUserLists = async (userId: number, lists: string[], signal?: AbortSignal): Promise<HLTBResult | undefined> => {
    let listRequest = { ...payload };
    listRequest.lists = lists;
    listRequest.user_id = userId

    try {
      let result =
        await axios.post(getUserUrl(userId), listRequest, {
          headers: {
            'content-type': 'application/json',
            'origin': 'https://howlongtobeat.com/',
            'referer': 'https://howlongtobeat.com/'
          },
          timeout: 20000,
          signal,
        });

      return result.data;
    } catch (error : any) {
      if (error) {
        throw new Error(error);
      } else if (error.response.status !== 200) {
        throw new Error(`Error from hltb [${error.response.status}]
          ${JSON.stringify(error.response)}
        `);
      }
    }
  }


