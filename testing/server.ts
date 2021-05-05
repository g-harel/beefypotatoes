import express from "express";
import httpProxy from "http-proxy";

import {createGameHandler, submitGameHandler} from "../functions/handlers";

const PORT = process.env.PORT || 3000;
const FILE_PORT = process.env.FILE_PORT || 1234;
const REMOTE_FUNC = process.env.REMOTE_FUNC === "true";

const FILE_PROXY = "http://localhost:" + FILE_PORT;
const REMOTE_FUNC_PROXY = "http://humanityagainstcards.com";

const app = express();
const proxy = httpProxy.createProxy();

proxy.on('error', (err) => {
    console.log(`ERROR ${err}`)
});

proxy.on('proxyRes', function (res) {
    if (res.statusCode !== 200) {
        res.on('data', function (chunk) {
            console.log('   STATUS: ', JSON.stringify(res.statusCode, null, 2));
            console.log('   HEADERS: ', JSON.stringify(res.headers, null, 2));
            console.log('   BODY: ' + chunk);
        });
    }
  });

app.use((req, res, next) => {
    if (!req.url.startsWith("/api")) {
        console.log(`>> ${FILE_PROXY}${req.url}`);
        proxy.web(req, res, {target: FILE_PROXY});
        return;
    }
    if (REMOTE_FUNC) {
        console.log(`>> ${REMOTE_FUNC_PROXY}${req.url}`);
        proxy.web(req, res, {target: REMOTE_FUNC_PROXY});
        return;
    }
    console.log(`   ${req.url}`);
    next();
});

app.use(createGameHandler);
app.use(submitGameHandler);

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
