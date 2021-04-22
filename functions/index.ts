import * as functions from "firebase-functions";

import {CreateGame, SubmitGame} from "../common/endpoints";

export const createGame = functions.https.onRequest(
    CreateGame.handler((_) => {
        return {
            question: {
                id: "id",
                text: "text",
            },
            answers: [],
            raw: "",
        };
    }),
);

export const submitGame = functions.https.onRequest(
    SubmitGame.handler((game) => {
        console.log(game);
        return {similarity: Math.random()};
    }),
);
