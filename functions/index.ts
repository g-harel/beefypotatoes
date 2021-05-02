import * as functions from "firebase-functions";
import {Endpoint} from "rickety";

import {CreateGame, SubmitGame} from "../common/endpoints";
import {createGameHandler, submitGameHandler} from "./handlers";

// Rickety tries to match path and method, which is not useful for functions.
const forceHandle = <RQ, RS>(endpoint: Endpoint<RQ, RS>, handler: any): any => {
    return (req:  any, res:  any) => {
        req.method = endpoint.method;
        req.originalUrl = endpoint.path;
        return handler(req, res);
    };
};

export const createGame = functions.https.onRequest(
    forceHandle(CreateGame, createGameHandler),
);
export const submitGame = functions.https.onRequest(
    forceHandle(SubmitGame, submitGameHandler),
);
