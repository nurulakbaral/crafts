import { useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createStore, type Mutate, type StoreApi } from "zustand/vanilla";

interface TCounterState {
	count: number;
}

class CounterStore {
	private readonly api: Mutate<StoreApi<TCounterState>, [["zustand/immer", never]]>;
	static readonly initialState: TCounterState = { count: 0 };

	constructor() {
		this.api = createStore<TCounterState>()(immer(() => CounterStore.initialState));
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

export const counterStore = new CounterStore();
