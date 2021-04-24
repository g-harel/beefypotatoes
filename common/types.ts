export interface ICard {
    id: string;
    text: string;
}

export interface IGameToken {
    prompt: ICard;
    answers: ICard[];
    raw: string;
}

export interface IGameSubmit {
    token: IGameToken;
    choice: string;
}

export interface IGameResult {
    similarity: number;
}
