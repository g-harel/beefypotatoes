import admin from "firebase-admin";

import {IGame} from "../../common/types";

const db = admin.database();
const outcomeRef = db.ref("outcomes");

export const submit = async (game: IGame, choice: string): Promise<number> => {
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
                    reverseOutcomeRef.on("value", (snapshot) => {
                        disagreeCount += snapshot.val() || 0;
                        resolve(null);
                    });
                }),
            ]);
        }),
    );

    return agreeCount / (agreeCount + disagreeCount);
};
