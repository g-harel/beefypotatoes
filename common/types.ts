export interface ICard {
    id: string;
    text: string;
}

export interface IGame {
    prompt: ICard;
    answers: ICard[];
}

export interface IGameSubmit {
    token: IGame;
    choice: string;
}

export interface IGameResult {
    similarity: number;
}
