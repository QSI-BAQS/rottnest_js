
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


