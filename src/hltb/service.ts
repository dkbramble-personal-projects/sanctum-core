import { Game, HLTBGame } from "./models";
import { HLTBUsers } from "./usersHttp";

let users = new HLTBUsers();

export class HLTBService {
    public static USER_ID: number = 386036;
    async getUserLists(lists: string[], signal?: AbortSignal): Promise<Array<Game>> {
        let result = await users.getUserLists(
            HLTBService.USER_ID,
            lists,
            signal
        );

        let hltbGames = new Array<Game>();

        if (result && result.data) {
            for (const game of result.data.gamesList){
                hltbGames.push(
                    new Game(
                        game.id,
                        game.custom_title,
                        game.play_storefront,
                        game.platform,
                        `${HLTBUsers.IMAGE_URL}${game.game_image}`,
                        game.game_id,
                        game.game_type 
                    )
                )
            }
        }
        // console.log(hltbGames);
        return hltbGames;
    }
}



