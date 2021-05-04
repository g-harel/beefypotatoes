import {Endpoint, DefaultClient} from "rickety";

import {ISubmitResponse, ISubmitRequest, ICreateResponse} from "./types";

export const CreateGame = new Endpoint<{}, ICreateResponse>({
    client: new DefaultClient(),
    method: "POST",
    path: "/api/v1/game",
});

export const SubmitGame = new Endpoint<ISubmitRequest, ISubmitResponse>({
    client: new DefaultClient(),
    method: "POST",
    path: "/api/v1/submit",
});
