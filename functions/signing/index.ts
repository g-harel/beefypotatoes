import admin from "firebase-admin";
if (!admin.apps.length) admin.initializeApp();

import * as functions from "firebase-functions";
import jwt from "jsonwebtoken";
import deepEqual from "deep-equal";
import crypto from "crypto";

import {IGame} from "../../common/types";

interface IToken {
    game: IGame;
}

const TOKEN_LIFETIME_SECONDS = 60 * 60; // One hour.
const secret = functions.config()?.cards?.secret || "dev"; // $ firebase functions:config:set cards.secret="..."
const tokenValidationCacheRef = admin.database().ref("used-tokens");
const TOKEN_VALIDATION_CACHE_EXPIRE_AT_FIELD = "expireAt";

const createTokenID = (token: string) => {
    return crypto.createHash("md5").update(token).digest("hex");
};

export const sign = (game: IGame): string => {
    const value: IToken = {game};
    return jwt.sign(value, secret, {
        expiresIn: TOKEN_LIFETIME_SECONDS,
    });
};

export const verify = async (game: IGame, token: string): Promise<boolean> => {
    try {
        const value: IToken = jwt.verify(token, secret) as any;
        const equal = deepEqual(value.game, game);

        // Check if token has been submitted before.
        if (equal) {
            let existed = false;
            const tokenID = createTokenID(token);
            await tokenValidationCacheRef
                .child(tokenID)
                .transaction((value) => {
                    existed = !!value;
                    return {
                        [TOKEN_VALIDATION_CACHE_EXPIRE_AT_FIELD]:
                            Date.now() + TOKEN_LIFETIME_SECONDS * 1000,
                    };
                });
            if (existed) return false;
        }

        return equal;
    } catch (err) {
        console.error("check token:", err);
        return false;
    }
};

export const clearCache = async () => {
    await tokenValidationCacheRef
        .orderByChild(TOKEN_VALIDATION_CACHE_EXPIRE_AT_FIELD)
        .endAt(Date.now())
        .once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                childSnapshot.ref.remove();
            });
        });
};

// Clear on startup.
clearCache();
