import { Box, Button, Text } from "@mantine/core";
import { Link } from "react-router";

export function IndexPage() {
	return (
		<Box className="mt-10">
			<Text className="text-2xl text-center">Hello, World!</Text>

			<Link className="inline-flex justify-center w-full mt-12" to="/login">
				<Button size="lg">Login</Button>
			</Link>
		</Box>
	);
}
