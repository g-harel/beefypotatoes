import {ICard, IGame} from "../../common/types";
import {sets, Set} from "./data";

const ANSWERS_PER_GAME = 4;
const ANSWER_BUCKET_SIZE = 5;
const ANSWER_BUCKET_PER_GAME = 3; // Randomly pick answers from N neighbor buckets.

const checkSets = (sets: Set[]) => {
    for (const set of sets) {
        if (set.answers.length < set.prompts.length * ANSWER_BUCKET_SIZE) {
            throw "The answer/prompt ration too low";
        }
        if (set.prompts.length < ANSWER_BUCKET_PER_GAME) {
            throw "There are not enough prompts for additional buckets";
        }
    }
};

const pickRandom = <T>(count: number, items: T[]): T[] => {
    const pickedIDs: Record<number, true> = {};
    while (Object.keys(pickedIDs).length < count) {
        pickedIDs[Math.floor(Math.random() * items.length)] = true;
    }
    return Object.keys(pickedIDs)
        .map(Number)
        .map((i) => items[i])
        .sort(() => Math.random() - 0.5);
};

export const createGame = (
    excludeIDs: string[],
    setName: keyof typeof sets,
): IGame => {
    const set = sets[setName];
    checkSets([set]);

    // Keep the last exclude IDs up to a maximum of half the number of prompts.
    const maxExcludeCount = Math.floor(set.prompts.length / 2);
    const actualExcludedIDs = excludeIDs.slice(
        Math.max(0, excludeIDs.length - maxExcludeCount),
    );

    // Pick a prompt that is not excluded.
    let promptIndex: number;
    let prompt: ICard;
    while (true) {
        promptIndex = Math.floor(Math.random() * set.prompts.length);
        prompt = set.prompts[promptIndex];
        if (!actualExcludedIDs.includes(prompt.id)) break;
    }

    // Pick answer cards.
    const answersBucket: ICard[] = [];
    for (let i = 0; i < ANSWER_BUCKET_PER_GAME; i++) {
        let offsetPromptIndex = (promptIndex + i) % set.prompts.length;
        const offsetAnswerIndex = offsetPromptIndex * ANSWER_BUCKET_SIZE;
        answersBucket.push(
            ...set.answers.slice(
                offsetAnswerIndex,
                offsetAnswerIndex + ANSWER_BUCKET_SIZE,
            ),
        );
    }
    return {prompt, answers: pickRandom(ANSWERS_PER_GAME, answersBucket)};
};
