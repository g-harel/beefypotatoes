import * as functions from "firebase-functions";
import jwt from "jsonwebtoken";

import {IGame} from "../../common/types";

const TOKEN_LIFETIME_SECONDS = 60 * 60; // One hour.

// firebase functions:config:set cards.secret="..."
const secret = functions.config().cards.secret;

export const sign = (game: IGame): string => {
    return jwt.sign(JSON.stringify(game), secret, {
        expiresIn: TOKEN_LIFETIME_SECONDS,
    });
};

export const verify = (token: string): boolean => {
    // TODO ttl.
    try {
        jwt.verify(token, secret);
        return true;
    } catch {
        return false;
    }
};
