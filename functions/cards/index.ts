import {ICard, IGame} from "../../common/types";
import {answerCards, promptCards} from "./data";

const ANSWERS_PER_GAME = 4;
const ANSWER_BUCKET_SIZE = 1;

if (answerCards.length < promptCards.length * ANSWERS_PER_GAME) {
    throw "answer/prompt ration too low";
}

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

export const createGame = (excludeIDs: string[]): IGame => {
    // Keep the last exclude IDs up to a maximum of half the number of prompts.
    const maxExcludeCount = Math.floor(promptCards.length / 2);
    const actualExcludedIDs = excludeIDs.slice(
        Math.max(0, excludeIDs.length - maxExcludeCount),
    );

    // Pick a prompt that is not excluded.
    let promptIndex: number;
    let prompt: ICard;
    while (true) {
        promptIndex = Math.floor(Math.random() * promptCards.length);
        prompt = promptCards[promptIndex];
        if (!actualExcludedIDs.includes(prompt.id)) break;
    }

    // Pick answer cards.
    const answersBucket: ICard[] = [];
    for (let i = 0; i < ANSWER_BUCKET_SIZE; i++) {
        let offsetPromptIndex = (promptIndex + i) % promptCards.length;
        const offsetAnswerIndex = offsetPromptIndex * ANSWERS_PER_GAME;
        answersBucket.push(
            ...answerCards.slice(
                offsetAnswerIndex,
                offsetAnswerIndex + ANSWERS_PER_GAME,
            ),
        );
    }
    return {prompt, answers: pickRandom(ANSWERS_PER_GAME, answersBucket)};
};
