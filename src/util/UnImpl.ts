

export default function unimplemented(): any {
	console.error("This function is unimplemented");
	return null;
}



export default function UnimplReturn<T>() {
	return {} as T;
}
