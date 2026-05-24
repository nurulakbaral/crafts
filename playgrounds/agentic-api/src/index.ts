import { mistral } from "@ai-sdk/mistral";
import { streamText } from "ai";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";

const app = express();
const PORT = Number(process.env.SERVER_PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_: Request, res: Response) => {
	res.json({
		message: "Hello World!",
	});
});

app.post("/chat", async (req: Request, res: Response) => {
	try {
		const messages = req.body as Array<{ role: string; content: string }>;

		if (!messages || messages.length === 0) {
			return res.status(400).json({ message: "No messages provided" });
		}

		const result = streamText({
			model: mistral("mistral-medium-latest"),
			system: "You are a helpful assistant.",
			prompt: messages[0]?.content || "",
		});

		return result.pipeUIMessageStreamToResponse(res);
	} catch (error) {
		const err = error as Error;

		res.status(500).json({
			message: `Internal server error: ${err.message}`,
		});
	}
});

app.get("/health", (_: Request, res: Response) => {
	res.status(200).json({
		status: "ok",
	});
});

app.use((err: Error, _: Request, res: Response, _next: NextFunction) => {
	res.status(500).json({
		message: `Internal server error: ${err.message}`,
	});
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
