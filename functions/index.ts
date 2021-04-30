import * as functions from "firebase-functions";

import {CreateGame, SubmitGame} from "../common/endpoints";
import {pickRandomAnswers, pickRandomPrompt} from "./cards";

export const createGame = functions.https.onRequest(
    CreateGame.handler((_) => {
        return {
            prompt: pickRandomPrompt(),
            answers: pickRandomAnswers(),
            token: "TODO signed payload",
        };
    }),
);

export const submitGame = functions.https.onRequest(
    SubmitGame.handler((game) => {
        console.log(game);
        return {similarity: Math.random()};
    }),
);
