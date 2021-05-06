import {CreateGame, SubmitGame} from "../common/endpoints";
import {IGame} from "../common/types";
import {submit} from "./analytics";
import {pickRandomAnswers, pickRandomPrompt} from "./cards";
import {sign, verify} from "./signing";

export const createGameHandler = CreateGame.handler((_) => {
    const game: IGame = {
        prompt: pickRandomPrompt(),
        answers: pickRandomAnswers(),
    };
    return {game, token: sign(game)};
});

export const submitGameHandler = SubmitGame.handler(async (outcome, _) => {
    // Incorrectly signed games are not allowed to be submitted.
    if (!verify(outcome.game, outcome.token)) {
        console.log(`Invalid game submitted: ${outcome.token}`);
        return {similarity: 0};
    }

    return {similarity: await submit(outcome.game, outcome.choice)};
});
