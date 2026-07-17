import { useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createStore, type Mutate, type StoreApi } from "zustand/vanilla";

namespace TCounterStore {
	export type States = {
		count: number;
	};
}

export class CounterStore {
	private readonly api: Mutate<StoreApi<TCounterStore.States>, [["zustand/immer", never]]>;
	static readonly initialState: TCounterStore.States = { count: 0 };

	constructor() {
		this.api = createStore<TCounterStore.States>()(immer(() => CounterStore.initialState));
	}

	useStates() {
		return useStore(this.api, (state) => state);
	}

	increment() {
		this.api.setState((states) => {
			states.count += 1;
		});
	}

	decrement() {
		this.api.setState((states) => {
			states.count -= 1;
		});
	}

	reset() {
		this.api.setState(CounterStore.initialState);
	}
}
