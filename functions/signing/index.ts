import * as functions from "firebase-functions";
import jwt from "jsonwebtoken";
import deepEqual from "deep-equal";

import {IGame} from "../../common/types";

const TOKEN_LIFETIME_SECONDS = 60 * 60; // One hour.

// firebase functions:config:set cards.secret="..."
const secret = functions.config()?.cards?.secret || "dev";

export const sign = (game: IGame): string => {
    return jwt.sign(game, secret, {
        expiresIn: TOKEN_LIFETIME_SECONDS,
    });
};

export const verify = (game: IGame, token: string): boolean => {
    // TODO ttl.
    try {
        const tokenGame: IGame = jwt.verify(token, secret) as any;
        return deepEqual(tokenGame, game);
    } catch {
        return false;
    }
};
