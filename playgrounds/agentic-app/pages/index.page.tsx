import { Box, Stack } from "@mantine/core";
import { Composer, Greetings } from "~/components";

export default function App() {
	return (
		<Box>
			<Stack gap={36} className="w-full min-h-screen pt-54" align="center">
				<Greetings />

				<Composer />
			</Stack>
		</Box>
	);
}
