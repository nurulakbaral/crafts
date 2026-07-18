export namespace TTypesMsw {
	export type JsonBodyType<TData = Record<string, unknown>> = {
		code: number;
		message: string;
	} & TData;
}
