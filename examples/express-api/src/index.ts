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
