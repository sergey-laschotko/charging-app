import express from "express";
import bodyParser from "body-parser";

import router from "./routes";

const server = express();
const port = process.env.PORT || 3000;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(router);

server.get("/", (req, res) => {
    res.json({ message: "Server is ready" });
});

server.get("*", (req, res) => {
    res.json({ message: "Route was not found" });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});