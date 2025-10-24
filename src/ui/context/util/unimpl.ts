
export function UnimplReturn<T>() {
	return new Error("Not Implemented") as T;
}
