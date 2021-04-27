import * as functions from "firebase-functions";

import {CreateGame, SubmitGame} from "../common/endpoints";
import {ICard} from "../common/types";
import {promptCards, answerCards} from "./cards";

const ANSWERS_PER_GAME = 4;
const PROMPT_COUNT = Math.min(23, promptCards.length); // Only use the first N prompt cards.
const ANSWER_BUCKET_COUNT = 1; // Only pick random cards from N neighboring buckets.

const bucketCount =
    Math.floor(answerCards.length / ANSWERS_PER_GAME) - ANSWER_BUCKET_COUNT;

const pickRandom = <T>(count: number, items: T[]): T[] => {
    if (count >= items.length) return items;
    const pickedIDs: Record<number, true> = {};
    while (Object.keys(pickedIDs).length < count) {
        pickedIDs[Math.floor(Math.random() * items.length)] = true;
    }
    return Object.keys(pickedIDs)
        .map(Number)
        .map((i) => items[i]);
};

const pickRandomPrompt = (): ICard => {
    return pickRandom(1, promptCards.slice(0, PROMPT_COUNT))[0];
};

const pickRandomAnswers = (): ICard[] => {
    if (ANSWER_BUCKET_COUNT > 0) {
        const randomBucket = Math.floor(Math.random() * bucketCount);
        return pickRandom(
            ANSWERS_PER_GAME,
            answerCards.slice(
                randomBucket * ANSWERS_PER_GAME,
                randomBucket * ANSWERS_PER_GAME +
                    ANSWER_BUCKET_COUNT * ANSWERS_PER_GAME,
            ),
        );
    }
    return pickRandom(ANSWERS_PER_GAME, answerCards);
};

export const createGame = functions.https.onRequest(
    CreateGame.handler((_) => {
        return {
            prompt: pickRandomPrompt(),
            answers: pickRandomAnswers(),
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
