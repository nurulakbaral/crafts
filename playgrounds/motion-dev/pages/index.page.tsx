import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

function ExitAnimation() {
	const [isEntering, setIsEntering] = React.useState(true);

	return (
		<div className="text-center">
			<AnimatePresence>
				{isEntering && (
					<motion.div
						key="exit-mode"
						exit={{ scale: 0 }}
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.75 }}
						className="mx-auto w-20 h-20 bg-green-400 mt-20"
					/>
				)}
			</AnimatePresence>

			<button
				className="border-gray-200 bg-gray-200 p-2 rounded-2xl"
				onClick={() => setIsEntering(!isEntering)}
				type="button"
			>
				Toggle
			</button>
		</div>
	);
}

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
			<ExitAnimation />
		</div>
	);
}
