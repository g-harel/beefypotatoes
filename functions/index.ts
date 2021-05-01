import * as functions from "firebase-functions";

import {CreateGame, SubmitGame} from "../common/endpoints";
import {IGame} from "../common/types";
import {pickRandomAnswers, pickRandomPrompt} from "./cards";
import {sign} from "./signing";

export const createGame = functions.https.onRequest(
    CreateGame.handler((_) => {
        const game: IGame = {
            prompt: pickRandomPrompt(),
            answers: pickRandomAnswers(),
        };
        return {game, token: sign(game)};
    }),
);

export const submitGame = functions.https.onRequest(
    SubmitGame.handler((game) => {
        console.log(game);
        return {similarity: Math.random()};
    }),
);
