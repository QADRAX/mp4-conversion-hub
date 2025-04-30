import {
  BACKEND_PORT,
  BANNER,
  CORS_ALLOWED_ORIGINS,
  TRUST_PROXY,
} from "./config";
import express from "express";
import path from "path";
import { basicAuth } from "./middleware/basicAuth";
import cors from "cors";
import { generalRateLimiter } from "./middleware/rateLimit";
import { setupCronTask } from "./cronTask";
import { securityHeaders } from "./middleware/security";
import { startFileProcessor } from "./services/fileProcessor";
import routerApi from "./routes/api";
import routerHealthcheck from "./routes/healthcheck";

console.log(BANNER);

setupCronTask();

startFileProcessor();

const app = express();

app.use(
  cors({
    origin: CORS_ALLOWED_ORIGINS,
    credentials: true,
  })
);

if (TRUST_PROXY != "false") {
  app.set("trust proxy", TRUST_PROXY);
}

app.disable("x-powered-by");
app.use(securityHeaders());

const frontendPath = path.resolve(__dirname, "../../ui/dist");

app.use(express.static(frontendPath));

app.use("/api", routerApi);
app.use("/healthcheck", routerHealthcheck);

app.get("*", basicAuth, (_, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(generalRateLimiter);

app.listen(BACKEND_PORT, () => {
  console.log("🚀 UI listen on Port " + BACKEND_PORT);
});
