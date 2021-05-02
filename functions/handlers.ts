import {CreateGame, SubmitGame} from "../common/endpoints";
import {IGame} from "../common/types";
import {pickRandomAnswers, pickRandomPrompt} from "./cards";
import {sign} from "./signing";

export const createGameHandler = CreateGame.handler((_) => {
    const game: IGame = {
        prompt: pickRandomPrompt(),
        answers: pickRandomAnswers(),
    };
    return {game, token: sign(game)};
});

export const submitGameHandler = SubmitGame.handler((_) => {
    return {similarity: Math.random()};
});
