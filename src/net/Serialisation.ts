


/**
 * Deserialisation interface that is
 * used by the network service
 */
export interface DeRott {
	fromStr(data: string): this | null
	fromJSON(data: any): this | null
}

/**
 * Allows for the data to be serialised
 * back into a string
 */
export interface ReRott {
	toStr: () => string
}
