import { create } from "zustand";

export const useStoreConv = create<{
	streaming: boolean;
	setStreaming: (streaming: boolean) => void;
}>((set) => ({
	streaming: false,
	setStreaming: (streaming: boolean) => set(() => ({ streaming })),
}));
