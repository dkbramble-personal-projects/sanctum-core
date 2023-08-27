import { Game } from "./models";
import { IMAGE_URL, GetUserLists } from "./usersHttp";

export const GetList = async (userId: number, lists: string[], signal?: AbortSignal): Promise<Game[]> => {
    let result = await GetUserLists(
        userId,
        lists,
        signal
    );

    let hltbGames = new Array<Game>();

    if (result && result.data) {
        for (const game of result.data.gamesList) {
            hltbGames.push(
                new Game(
                    game.id,
                    game.custom_title,
                    game.play_storefront,
                    game.platform,
                    `${IMAGE_URL}${game.game_image}`,
                    game.game_id,
                    game.game_type,
                    game.comp_all
                )
            )
        }
    }
    return hltbGames;
}



