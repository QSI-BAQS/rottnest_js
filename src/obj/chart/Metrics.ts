

export type CUResultKind = "CUResultData" | "CUCacheData";


/**
 * Compute Unit Source, just a loose mapping
 */
export type CUSource = {
	[key: string]: number
}


/**
 * Compute Unit Volumes
 */
export type CUVolume = {
	REGISTER_VOLUME: number
	FACTORY_VOLUME: number
	ROUTING_VOLUME: number
	T_IDLE_VOLUME: number
	BELL_IDLE_VOLUME: number
	BELL_ROUTING_VOLUME: number
	NP_VOLUME?: number
	
}

/**
 * Compute Unit Tocks
 */
export type CUTocks = {
	graph_state: number
	bell: number
	t_schedule: number
	bell2: number
	total: number
}

/**
 * Current status of the call graph
 */
export type CGStatus = {
	status: string
}

/**
 * NOTE: Not sure why mixed exists
 */
export type CUResultMixed = {
	kind: CUResultKind
	mxid: number
	volumes: CUVolume
	tSource: CUSource
	tocks: CUTocks
	cuID?: number
	status?: string
	npQubits?: number
	cacheHash?: CUHashHex
}

/**
 * CallGraph Result, aggregation
 */
export type CGResult = {	
	volumes: CUVolume
	tSource: CUSource
	tocks: CUTocks
	cuID: string
	status: string
	npQubits: number
}

/**
 * Hash Result, with typical components
 */
export type CGHashResult = {
	volumes: CUVolume
	tSource: CUSource
	tocks: CUTocks
	cacheHash: CUHashHex
}

/**
 * Compute Unit Hash as Hexadecimal
 */
export type CUHashHex = {
	hashhex: string
}
