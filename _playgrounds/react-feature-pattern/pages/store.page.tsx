import { counterStore } from "~/features/account/stores";

function CardCounter() {
	const counterStates = counterStore.useStates();

	return (
		<div>
			<p>{counterStates.count}</p>
		</div>
	);
}

export function StorePage() {
	return (
		<div className="p-12 border border-blue-700 m-10">
			<p className="text-center mb-10">Store Page</p>

			<button
				className="p-4 bg-gray-100 rounded-lg mb-1"
				type="button"
				onClick={() => {
					counterStore.increment();
				}}
			>
				Count
			</button>

			<button
				className="p-4 bg-gray-100 rounded-lg mb-1"
				type="button"
				onClick={() => {
					counterStore.reset();
				}}
			>
				Reset
			</button>
			<CardCounter />
		</div>
	);
}
