import { setupWorker } from "msw/browser";
import { router } from "./msw.router";

// @Docs https://mswjs.io/docs/integrations/browser
export const worker = setupWorker(...router);
