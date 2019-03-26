import express from "express";
import bodyParser from "body-parser";

const server = express();
const port = process.env.PORT || 3000;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get("/", (req, res) => {
    res.json({ message: "Server Is Ready" });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});