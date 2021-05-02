import express from "express";
import cors  from "cors";

import {createGameHandler, submitGameHandler} from "../functions/handlers";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors())
app.use(createGameHandler);
app.use(submitGameHandler);

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
