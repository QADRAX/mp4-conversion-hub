import express from "express";

const routerHealthcheck = express.Router();

// Healthcheck
routerHealthcheck.get("/ping", (_, res) => {
  res.send("ok");
});

export default routerHealthcheck;