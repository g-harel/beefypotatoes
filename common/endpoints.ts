import jwt from "jsonwebtoken";
import {Endpoint} from "rickety";
import {ClientRequest, ClientResponse} from "rickety/client";

import BaseClient from "./client";
import {ISubmitResponse, ISubmitRequest, IGame, ICreateResponse} from "./types";

class CreateGameClient extends BaseClient {
    async send(request: ClientRequest): Promise<ClientResponse> {
        // GET requests should not have a body.
        request.body = "";

        // Send modified request with parent client.
        const response = await super.send(request);
        const responseBody = JSON.parse(response.body);

        // Extract game token from the response body.
        // JWT logic is hidden from the caller.
        // Original raw token is required to submit the result and is added to the game object.
        const token = responseBody.token;
        const game = jwt.decode(token) as IGame;
        // TODO game.token = token;

        // Response body is replaced with modified value before returning.
        response.body = JSON.stringify(game);
        return response;
    }
}

class SubmitGameClient extends BaseClient {
    async send(request: ClientRequest): Promise<ClientResponse> {
        const requestBody: ISubmitRequest = JSON.parse(request.body);

        // Request body's token is replaced with the raw string version.
        // TODO requestBody.token = requestBody.token.token as any;
        request.body = JSON.stringify(requestBody);
        return super.send(request);
    }
}

export const CreateGame = new Endpoint<{}, ICreateResponse>({
    client: new CreateGameClient(),
    method: "GET",
    path: "/api/game",
});

export const SubmitGame = new Endpoint<ISubmitRequest, ISubmitResponse>({
    client: new SubmitGameClient(),
    method: "POST",
    path: "/api/submit",
});
