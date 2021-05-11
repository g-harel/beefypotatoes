import * as functions from "firebase-functions";
import {Endpoint} from "rickety";

import {CreateGame, SubmitGame} from "../common/endpoints";
import {createGameHandler, submitGameHandler} from "./handlers";
import {clearCache} from "./signing";

// Rickety tries to match path and method, which is not useful for functions.
const forceHandle = <RQ, RS>(endpoint: Endpoint<RQ, RS>, handler: any): any => {
    return (req: any, res: any) => {
        req.method = endpoint.method;
        req.originalUrl = endpoint.path;
        return handler(req, res, (err: Error) => {
            console.error(err);
            res.sendStatus(500);
        });
    };
};

export const createGame = functions.https.onRequest(
    forceHandle(CreateGame, createGameHandler),
);
export const submitGame = functions.https.onRequest(
    forceHandle(SubmitGame, submitGameHandler),
);
export const clearTokenCache = functions.pubsub
    .schedule("0 * * * *")
    .onRun(clearCache);
