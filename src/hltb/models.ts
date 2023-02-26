export interface HLTBGame {
    readonly id: number;
    readonly custom_title: string;
    readonly play_storefront: string;
    readonly platform: string;
    readonly game_image: string;
    readonly game_id: number;
    readonly game_type: string;
}

export interface HLTBResult {
    readonly data : {
        readonly gamesList: Array<HLTBGame>;
    }
}

export class Game {
    constructor(
        public readonly id: number,
        public readonly custom_title: string,
        public readonly play_storefront: string,
        public readonly platform: string,
        public readonly game_image: string,
        public readonly game_id: number,
        public readonly game_type: string,
    ){}
}
