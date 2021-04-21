import jwt from "jsonwebtoken";
import {DefaultClient} from "rickety";
import {ClientRequest, ClientResponse} from "rickety/client";

import {IGameToken} from "../internal/types";

// Mock requests when hosted on "GitHub Pages".
class MockClient extends DefaultClient {
    async send(request: ClientRequest): Promise<ClientResponse> {
        if (location.hostname !== "localhost") {
            return super.send(request);
        }

        if (request.url.startsWith("/api/game")) {
            const mockGame: IGameToken = {
                raw: "",
                question: {
                    id: "",
                    text: "What gets better with age?",
                },
                answers: [
                    {id: "2", text: "Drinking alone."},
                    {id: "3", text: "The glass ceiling."},
                    {id: "4", text: "A lifetime of sadness."},
                    {id: "5", text: "A PowerPoint presentation."},
                ],
            };
            const token = jwt.sign(mockGame, "-");
            return {status: 200, body: JSON.stringify({token})};
        }

        if (request.url.startsWith("/api/submit")) {
            return {
                status: 200,
                body: JSON.stringify({
                    similarity: 0.9 * Math.random(),
                }),
            };
        }

        return {status: 501, body: "Not Implemented"};
    }
}

// Delay all requests to simulate network latency.
class DelayClient extends MockClient {
    async send(request: ClientRequest): Promise<ClientResponse> {
        await new Promise((res) => setTimeout(res, 400 + 200 * Math.random()));
        return super.send(request);
    }
}

export default DelayClient;
