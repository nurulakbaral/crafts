import { counterStore } from "~/features/account/stores/counter.store";

function CardCounter() {
	const counterStates = counterStore.useStates();

	return (
		<div>
			<p>{counterStates.count}</p>
		</div>
	);
}

export function StatePage() {
	return (
		<div className="mx-20 mt-20 p-12">
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
