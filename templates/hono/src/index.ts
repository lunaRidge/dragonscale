import { Hono } from "hono";
import { buildRoutes } from "./route";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

buildRoutes(app);

export default app;
