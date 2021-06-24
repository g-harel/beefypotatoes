import admin from "firebase-admin";
if (!admin.apps.length) admin.initializeApp();

import {IGame} from "../../common/types";

const outcomeRef = admin.database().ref("outcomes");

export const submit = async (
    game: IGame,
    choice: string,
): Promise<[number, boolean]> => {
    // Don't submit to real db when dev.
    if (process.env.DEV !== undefined)
        return [Math.random(), Math.random() < 0.3];

    const promptRef = outcomeRef.child(game.prompt.id);

    let agreeCount = 0;
    let disagreeCount = 0;
    await Promise.all(
        game.answers.map(async (answer) => {
            if (answer.id === choice) return;

            const outcomeRef = promptRef.child(choice).child(answer.id);
            const reverseOutcomeRef = promptRef.child(answer.id).child(choice);

            await Promise.all([
                outcomeRef.transaction((value) => {
                    value = (value || 0) + 1;
                    agreeCount += value;
                    return value;
                }),
                new Promise(async (resolve) => {
                    reverseOutcomeRef.once("value", (snapshot) => {
                        disagreeCount += snapshot.val() || 0;
                        resolve(null);
                    });
                }),
            ]);
        }),
    );

    // None of the card combinations have data.
    const isFirstResponse =
        agreeCount === game.answers.length - 1 && disagreeCount === 0;

    return [agreeCount / (agreeCount + disagreeCount), isFirstResponse];
};
