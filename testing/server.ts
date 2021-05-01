import express from "express";

import {createGameHandler, submitGameHandler} from "../functions/handlers";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(createGameHandler);
app.use(submitGameHandler);

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
