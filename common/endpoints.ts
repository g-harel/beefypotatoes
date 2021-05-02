import {Endpoint, DefaultClient} from "rickety";
import {ClientRequest, ClientResponse} from "rickety/client";

import {ISubmitResponse, ISubmitRequest, ICreateResponse} from "./types";

const USE_DEV_SERVER = false;

// Switch to dev host on localhost.
class BaseClient extends DefaultClient {
    async send(request: ClientRequest): Promise<ClientResponse> {
        if (location.hostname === "localhost") {
            if (USE_DEV_SERVER) {
                request.url = "http://localhost:3001" + request.url;
            } else {
                request.url = "https://humanityagainstcards.com" + request.url;
            }
        }
        return super.send(request);
    }
}

export const CreateGame = new Endpoint<{}, ICreateResponse>({
    client: new BaseClient(),
    method: "POST",
    path: "/api/v1/game",
});

export const SubmitGame = new Endpoint<ISubmitRequest, ISubmitResponse>({
    client: new BaseClient(),
    method: "POST",
    path: "/api/v1/submit",
});
