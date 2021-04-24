import * as functions from "firebase-functions";

import {CreateGame, SubmitGame} from "../common/endpoints";
import {promptCards, answerCards} from "./cards";

const pickRandom = <T>(count: number, items: T[]): T[] => {
    if (count >= items.length) return items;
    const pickedIDs: Record<number, true> = {};
    while (Object.keys(pickedIDs).length < count) {
        pickedIDs[Math.floor(Math.random() * items.length)] = true;
    }
    return Object.keys(pickedIDs).map(Number).map((i) => items[i]);
};

export const createGame = functions.https.onRequest(
    CreateGame.handler((_) => {
        return {
            prompt: pickRandom(1, promptCards)[0],
            answers: pickRandom(4, answerCards),
            raw: "TODO signed payload",
        };
    }),
);

export const submitGame = functions.https.onRequest(
    SubmitGame.handler((game) => {
        console.log(game);
        return {similarity: Math.random()};
    }),
);
