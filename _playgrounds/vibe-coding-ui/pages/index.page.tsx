import { Box, Button, Text } from "@mantine/core";
import { Link } from "react-router";

export default function App() {
	return (
		<Box className="text-center mt-20">
			<Text className="text-4xl mb-16">List of Landing Pages</Text>

			<Link to="/company-profile">
				<Button variant="outline">Company Profile</Button>
			</Link>
		</Box>
	);
}
