const express = require("express");
// const helmet = require("helmet");
// const morgan = require("morgan");

const actionsModelRouter = require("./routers/actionsModel-router.js");
const projectsModelRouter = require("./routers/projectsModel-router.js");

const server = express();

server.use(express.json());
// server.use(helmet());
// server.use(morgan("dev"));

server.get("/", (req, res, next) => {
  res.send(process.env.TITLE);
});

server.use("/api/actions", actionsModelRouter);
server.use("/api/projects", projectsModelRouter);

// export default server
module.exports = server; // <<<<<<<<<<<<<<<<<<<<<<<<<<  export the server
