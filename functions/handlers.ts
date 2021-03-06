import {CreateGame, SubmitGame} from "../common/endpoints";
import {submit} from "./analytics";
import {createGame} from "./cards";
import {sign, verify} from "./signing";

export const createGameHandler = CreateGame.handler((settings) => {
    const game = createGame(
        settings.excludePrompts,
        settings.demo ? "demo" : "base",
    );
    return {game, token: sign(game)};
});

export const submitGameHandler = SubmitGame.handler(async (outcome, _) => {
    // Incorrectly signed games are not allowed to be submitted.
    if (!(await verify(outcome.game, outcome.token))) {
        console.log(`Invalid game submitted: ${outcome.token}`);
        return {similarity: 0, isFirstResponse: false};
    }

    const [similarity, isFirstResponse] = await submit(
        outcome.game,
        outcome.choice,
    );
    return {similarity, isFirstResponse};
});
