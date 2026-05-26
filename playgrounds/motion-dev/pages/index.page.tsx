import { motion } from "motion/react";
import * as React from "react";

function EnterAnimation() {
	const [isEntering, setIsEntering] = React.useState(true);

	return (
		<div>
			<motion.div
				initial={false}
				animate={{ scale: isEntering ? 1 : 0.5 }}
				transition={{ duration: 0.75 }}
				className="mx-auto w-20 h-20 bg-green-400 mt-20"
			/>

			<button onClick={() => setIsEntering(!isEntering)} type="button">
				Toggle
			</button>
		</div>
	);
}

export default function App() {
	return (
		<div>
			<EnterAnimation />
		</div>
	);
}
