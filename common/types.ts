export interface ICard {
    id: string;
    text: string;
}

export interface IGame {
    prompt: ICard;
    answers: ICard[];
}

export interface ICreateRequest {
    excludePrompts: string[];
    demo: boolean
}

export interface ICreateResponse {
    game: IGame;
    token: string;
}

export interface ISubmitRequest {
    game: IGame;
    token: string;
    choice: string;
}

export interface ISubmitResponse {
    similarity: number;
    isFirstResponse: boolean;
}
