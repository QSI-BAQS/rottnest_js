
/**
 * BufferMapTrigger that is shared between contexts
 * Allows for refreshing the context when an event is made
 */
export interface BufferMapTrigger {
	refresh(): void
}

/**
 * BufferMap that is shared between contexts
 * and plugins
 */
export class WorkspaceBufferMap {
	context: BufferMapTrigger;	
	map: Map<string, any> = new Map();
	sharedMap: Map<string, any> = new Map();

	/**
	 * Construction of workspace buffer map
	 *   - 
	 */
	constructor(context: BufferMapTrigger) {
		this.context = context;
	}

	/**
	 * Places key-value map within the map itself
	 * - Not much different to regular map but is just implied to be shared
	 */
	stash(key: string, data: any) {
		this.sharedMap.set(key, data);
	}

	/**
	 * Clears the data within it
	 */
	dropStash() {
		this.sharedMap.clear();
	}

	/**
	 * Retrieves the map inside it
	 */
	getStash() {
		return this.sharedMap;
	}

	insert(key: string, data: any) {
		this.map.set(key, data);
	}

	get(key: string): any | null {
		const res = this.map.get(key);
		if(res === null || res === undefined) {
			return null;
		} else {
			return res;
		}
	}

	clear() {
		this.map.clear();
	}
	
	/**
	 * Triggers a refresh of the workspace zone
	 */
	commit() {
		this.context.refresh();
	}
}
