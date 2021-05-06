import * as functions from "firebase-functions";
import jwt from "jsonwebtoken";
import deepEqual from "deep-equal";

import {IGame} from "../../common/types";

interface IToken {
    game: IGame;
}

const TOKEN_LIFETIME_SECONDS = 60 * 60; // One hour.

// firebase functions:config:set cards.secret="..."
const secret = functions.config()?.cards?.secret || "dev";

export const sign = (game: IGame): string => {
    const value: IToken = {game};
    return jwt.sign(value, secret, {
        expiresIn: TOKEN_LIFETIME_SECONDS,
    });
};

export const verify = (game: IGame, token: string): boolean => {
    // TODO ttl.
    try {
        const value: IToken = jwt.verify(token, secret) as any;
        return deepEqual(value.game, game);
    } catch {
        return false;
    }
};
