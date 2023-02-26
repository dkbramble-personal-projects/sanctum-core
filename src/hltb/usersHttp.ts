import { HLTBResult } from "./models";

const axios: any = require('axios');

export class HLTBUsers {
  public static BASE_URL: string = 'https://howlongtobeat.com/';
  public static IMAGE_URL: string = `${HLTBUsers.BASE_URL}games/`;

  payload2: any = {
    "user_id":386036,
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

  getUserUrl(userId: number): string {
    return `${HLTBUsers.BASE_URL}api/user/${userId}/games/list`
  }

  async getUserLists(userId: number, lists: string[], signal?: AbortSignal): Promise<HLTBResult | undefined> {
    let listRequest = { ...this.payload2 };
    listRequest.lists = lists;
    listRequest.user_id = userId

    try {
      let result =
        await axios.post(this.getUserUrl(userId), listRequest, {
          headers: {
            'content-type': 'application/json',
            'origin': 'https://howlongtobeat.com/',
            'referer': 'https://howlongtobeat.com/'
          },
          timeout: 20000,
          signal,
        });

        // console.log(result.data)
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
}
