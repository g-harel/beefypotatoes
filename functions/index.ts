import * as functions from "firebase-functions";

import {createGameHandler, submitGameHandler} from "./handlers";

export const createGame = functions.https.onRequest(createGameHandler);
export const submitGame = functions.https.onRequest(submitGameHandler);
