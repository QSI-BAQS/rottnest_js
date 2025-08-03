

export function unimplemented(): any {
	console.error("This function is unimplemented");
	return null;
}



export function UnimplReturn<T>() {
	return {} as T;
}
