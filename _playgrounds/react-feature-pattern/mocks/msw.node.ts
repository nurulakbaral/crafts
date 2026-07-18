// @Notes Currently, we don't need to import the worker (Node.js) because we are using the worker in the browser.
// @Docs https://mswjs.io/docs/integrations/node

import { setupServer } from "msw/node";
import { router } from "./msw.router";

export const server = setupServer(...router);
