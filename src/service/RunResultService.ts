import { CGHashResult, CGResult, CGStatus, CUHashHex } from "../obj/chart/Metrics";
import { RunChartContainer } from "../ui/runchart/RunChart";
import { RefreshService } from "./RefreshService";
import { StateStorage } from "../store/StateStorage";
import {
	RunResultDisplayEntry,
	RunResultEntry,
	RunResultFactory,
	RunResultVolumesDescription } from "../obj/chart/ResultMetrics";
import { SyncObject, SyncStateOperations } from "../store/SyncObject";


/** RunResult Persistent Storage Keys  */
export const RUNRESULT_STORAGEKEY = "RunResultStorage";

/**
  * RunResultTag
  * This is used that is referenced
  * and tagged
  */
export const RunResultTag = "result_tag";

/**
  * RunResultKeyKind
  * Different Kinds that the backend that is being used
  */
export const RunResultKeyKind = {
	RESULT_ENTRY: "RESULT_ENTRY",
	FINAL_RESULT: "FINAL_RESULT",
};

/** ResultEntryInvalidMsg - Able to be used to specify if it is invalid */
export const ResultEntryInvalidMsg = "Invalid";

/**
  * ResultMessage
  * These are the result messages
  * that we can receive from the backend
  *
  */
export const ResultMessage = {
	Entry: "ResultEntry",
	Total: "TotalEntry",
	Cached: "ResultEntryCached",
	Invalid: "Invalid",
};

/**
  * RunResultKey
  * Allows specifying the kind of keys
  * that can be used within the run results that
  * are given
  */
export type RunResultKey =
	typeof RunResultKeyKind.RESULT_ENTRY |
	typeof RunResultKeyKind.FINAL_RESULT;


/**
  * Old type arrangement for
  * the run result kind - Still used for some purposes
  */
export type RunResultKind = "CUIDObj" | "CUIDTotal"
| "CUIDEndComp" | "VolumeWithHash"
| "CacheHashOnly" | "StatusItem"
| "VisualResult" | "Invalid";

/** DecodeResult - Decodes the result into a tuple */
export type DecodeResult = [RunResultKey, any]

/**
 * RunResultService is used to maintain a list of results
 * and be able to cache components locally
 */
export class RunResultService {

	identifierOnEnd: number = 0;
	runDateTime: Date | null = null;
	runFromCache: boolean = false;
	dataAvailable: boolean = false;

	withCUID: Map<string, Array<CGResult>> = new Map();
	withTotal: Array<CGResult> = []
	
	cacheHashes: Set<CUHashHex> = new Set();
	volumesWithHashes: Map<string, Array<CGHashResult>> = new Map();
	statusItems: Set<CGStatus> = new Set();

	volumeSet: Array<RunResultDisplayEntry> = [];
	volumeSetNonCached: Array<number> = [];

	runsRequested: Set<string> = new Set();
	runsFinished: Set<string> = new Set();
	endComps: Array<CGResult> = [];

	storageRef: StateStorage;

	// Derivable set of volumes
	volumesAccumulator: RunResultAccumulator = new RunResultAccumulator();
	tocksAccumulator: RunResultAccumulator  = new RunResultAccumulator();

	// Last entry to be used for total
	lastEntry: RunResultEntry = RunResultFactory.makeEmptyEntry();
	resultsIntermediateTotal = true;
	


	/**
	  * RunResultService - Instance related to the state storage
	  * is used to read and write to a persistent storage object
	  */
	constructor() {
		this.storageRef = StateStorage.GetInstance();
		this.retrieveState();
	}

	/**
	  * A check to see if the data is available or not
	  * If it is, true, otherwise false
	  */
	isDataAvailable() {
		return this.dataAvailable;
	}

	/**
	 * Returns the container class (not an instance)
	 */
	RunChartTemplate() {
		return RunChartContainer;
	}

	/**
	 * Resets the current data points
	 */
	reset() {
		this.withCUID = new Map();
		this.withTotal = []
		this.cacheHashes = new Set();	
		this.volumesWithHashes = new Map();
		this.volumeSet = [];
		this.volumeSetNonCached = [];
		this.endComps = [];
		this.statusItems = new Set();
		this.runsRequested = new Set();
		this.runsFinished = new Set();

		// We can derive the run result set from the entry, once set, it will then
		// once a single entry is dropped into the frontend
		// we are able to operate on it
		this.volumesAccumulator  = new RunResultAccumulator();
		this.tocksAccumulator  = new RunResultAccumulator();
		this.lastEntry = RunResultFactory.makeEmptyEntry();
		this.dataAvailable = false;
		this.clearData();
	}

	/**
	  * Takes a snapshot of a finished run
	  * This will be held in localstorage or a persistent storage medium
	  */
	snapshot() {
		const self = this;
		return {
			volumeSet: self.volumeSet,
			volumeSetNonCached: self.volumeSetNonCached,
			lastEntry: self.lastEntry,
		}
	}

	/**
	  * Retrieves a state from localStorage
	  * Will have to iterate all the items first
	  */
	retrieveState() {
		const self = this;
		try {
			this.storageRef.read(RUNRESULT_STORAGEKEY)
				.then((obj) => {
					const timestamp = obj.timestamp;
					const data: any = obj.data;
					if(data.lastEntry) {
						this.lastEntry = data.lastEntry;
						const converted = new Date();
						converted.setTime(timestamp);

						self.setDateTime(converted);
						self.runFromCache = true;
						self.dataAvailable = true;
					} else {
						this.lastEntry = RunResultFactory.makeEmptyEntry();
					}
				});
			this.storageRef.readMeta(RUNRESULT_STORAGEKEY)
				.then((obj) => {

				const meta = obj.data;
				const appendKeyPrefix = meta.syncAppendKeyPrefix;
				const appendCount = meta.syncAppendCount;

				self.volumeSet = new Array<RunResultDisplayEntry>()
					.fill({} as any, 0, appendCount);
				self.volumeSetNonCached = new Array<number>();
				
				for(let i = 0; i < appendCount; i++) {
					const appendKey = `${appendKeyPrefix}_${i}`;
					this.storageRef.read<RunResultDisplayEntry>(appendKey).then(
						(obj: SyncObject<RunResultDisplayEntry>) => {
						self.volumeSet[i] = obj.data;
						if(!obj.data.CACHED) { 
							self.volumeSetNonCached.push(i);
						}
					});
				}
			});
		} catch(_exception) {
			self.clearData();
		}
	}

	/**
	  * Composes an appendable object
	  * that can live in persistent storage
	  */
	composeAppendable(entry: RunResultDisplayEntry, isCached: boolean) {
		return {
			volumeEntry: entry,
			extra: {
				isCached,
			}
		}
	}

	/**
	  * Allows setting of the synchronisation state
	  * between the backend and the frontend applications
	  */
	setSyncState(data: any) {
		this.identifierOnEnd = data.runIdentifier;
		this.volumeSet = data.runData;
	}

  /**
    * Requests a run to be queued
    * NOTE: This is currently incomplete
    */
	requestRun(gid: string) {
		this.runsRequested.add(gid);
	}

	/**
	  * Marks a current run as finished or not
	  * It will use the graph id to check if it has been completed
	  * or not, the marker is used to know that this is to be
	  * represented in the notifications panel
	  */
	markFinished(gid: string) {
		this.runsFinished.add(gid);
	}

	/**
	  * Checks if the graph for the run
	  * has been requested or not
	  */
	checkIfRequested(gid: string) {
		return this.runsRequested.has(gid);
	}

	/**
	  * Checks to see if the runs have finished
	  * by comparing the graph id
	  * This is how it can be tracked in the frontend
	  */
	checkIfFinished(gid: string) {
		return this.runsFinished.has(gid);
	}

	/**
	  * Derives the volume description from a result entry
	  * used when an api endpoint does not provide enough information
	  * about the run result entry
	  */
	deriveVolumeDescription(jsonObj: any) {
		this.volumesAccumulator.derive(jsonObj);
	}

	/**
	  * Derives the volume description from a result entry
	  * used when an api endpoint does not provide enough information
	  * about the run result entry
	  */
	deriveTocksDescription(jsonObj: any) {
		this.tocksAccumulator.derive(jsonObj);
	}

	/**
	  * Updates the summary by accumualting the results
	  * for each field in the object itself
	  */
	updateVolumesSummary(entry: RunResultEntry) {
		this.updateFields(
			entry.volumes,
			this.volumesAccumulator.currentTotal,
			this.volumesAccumulator.description);		
		this.lastEntry.volumes = this.volumesAccumulator.currentTotal;		
	}

	/**
	  * Updates the summary by accumualting the results
	  * for each field in the object itself
	  */
	updateTocksSummary(entry: RunResultEntry) {
		this.updateFields(
			entry.tocks,
			this.tocksAccumulator.currentTotal,
			this.tocksAccumulator.description);

		this.lastEntry.tocks = this.tocksAccumulator.currentTotal;		
	}

	/**
	  * Updates the t source
	  * for the summary object that will be produced
	  */
	updateTSourceSummary(entry: RunResultEntry) {
		this.lastEntry.t_source = entry.t_source;
	}

	
	/**
	  * Generalisation of updating fields
	  * in a subfield of an object
	  */
	updateFields(subset: {[key: string]: number},
		accSubset: {[key: string]: number},
		fieldSet: Set<string>) {
		
		for(const fkeyWeak of fieldSet) {
			const fkey = fkeyWeak;
			const toV = subset[fkey];
			const olV = accSubset[fkey];
			accSubset[fkey] = olV + toV; //Accumulating
		}
	}

	/**
	  * Designed to update the last entry
	  * as well as the other summaries
	  */
	updateLastEntry(entry: RunResultEntry) {
		this.updateVolumesSummary(entry);
		this.updateTocksSummary(entry);
		this.updateTSourceSummary(entry);
	}

	/**
	  * Sets the last entry details
	  * relevant to the last bit of information that had been given
	  * to the 
	  */
	setLastEntry(entry: RunResultEntry) {
		this.volumesAccumulator.currentTotal = entry.volumes;
		this.tocksAccumulator.currentTotal = entry.tocks;
		this.lastEntry.volumes = this.volumesAccumulator.currentTotal;
		this.lastEntry.tocks = this.tocksAccumulator.currentTotal;
		this.lastEntry.t_source = entry.t_source;
		this.runDateTime = new Date();
	}

	/**
	  * Retrieves the state to show if
	  * the current display is from the cache or not
	  */
	isFromStorageCache() {
		return this.runFromCache;
	}

	/**
	  * Gets the run datetime
	  * This is to log the time and make it clear to the
	  * user when the run was performed.
	  */
	getDateTime() {
		return this.runDateTime;
	}


	/**
	  * Sets the date time for the
	  * run, this is used for when we are loading from
	  * storage
	  */
	setDateTime(date: Date) {
		this.runDateTime = date;
	}

	/**
	  * Decodes the json object and attempts to
	  * sort and label the object accordingly, is used as part of the
	  * message decoder handler
	  */
	decodeAndSort(jsonObj: any, refreshService: RefreshService | null = null): DecodeResult
	 {
		this.runFromCache = false;
		this.dataAvailable = true;
		const result_kind = jsonObj[RunResultTag];
		let messageKind = ResultMessage.Invalid;

		if(result_kind === RunResultKeyKind.FINAL_RESULT) {
			messageKind = ResultMessage.Total;

			this.withTotal.push(RunResultFactory.makeTotalFromDecoded(jsonObj));
			this.endComps.push(RunResultFactory.makeTotalFromDecoded(jsonObj));
			this.setLastEntry(jsonObj);

			this.writeFull();

			this.resultsIntermediateTotal = false;
		} else if(result_kind === RunResultKeyKind.RESULT_ENTRY) {
			this.dataAvailable = true;
			messageKind = ResultMessage.Entry;

			if(!this.volumesAccumulator.isDerived()) {
				this.deriveVolumeDescription(jsonObj);
			}
			if(!this.tocksAccumulator.isDerived()) {
				this.deriveTocksDescription(jsonObj);
			}

				// NOTE: Remove the magic string that has been specified here
			const volMixedData = RunResultFactory.makeFromDecoded(jsonObj,
				this.volumeSet.length, "CUResultData", jsonObj.status, jsonObj.np_qubits);
				this.volumeSet.push(volMixedData);

			this.updateLastEntry(jsonObj);

			if(!jsonObj.CACHED) {
				this.volumeSetNonCached.push(this.volumeSet.length-1);
			}
			this.appendSegment(volMixedData);
		}

		/** Will be used to trigger a refresh of the ui  */
		if(refreshService !== null) { refreshService.triggerRefresh(); }
				
		return [ messageKind, jsonObj ];
	}

	/**
	  * Gets the current volumes
	  * These are accumulated until the data is finalised
	  * It will then switch over to the finalised version
	  */
	getCurrentVolumesSummary() {
		return this.volumesAccumulator.currentTotal;
	}

	/**
	  * Gets the current tocks
	  * These are accumulated until the data is finalised
	  * It will then switch over to the finalised version
	  */
	getCurrentTocksSummary() {
		return this.tocksAccumulator.currentTotal;
	}

	/**
	  * Gets the end computation markers
	  * This is Deprecated
	  */
	getEndComp(): Array<CGResult> {
		return this.endComps;
	}

	/**
	  * Gets the result summary
	  * For other components, will be updated to reflect
	  * the last entry to be usable for the display
	  */
	getResultSummary() {
		const displayLast = {...this.lastEntry, tSource: {} };
		displayLast.tSource = this.lastEntry.t_source;
		return displayLast;	
	}

	/**
	  * Gets the result summary for a particular
	  * node - This is used when the node is selected
	  */
	getNodeSummary(id: number) {

		if(id >= 0 && id < this.volumeSet.length) {		
			const tSource = this.volumeSet[id].tSource;
			const cuVolume = this.volumeSet[id].volumes;
			const cuTocks = this.volumeSet[id].tocks;
			const cached = this.volumeSet[id].CACHED;

			return {
				tSource,
				cuTocks,
				cuVolume,
				cached
			}
		} else {
			
			return {
				tSource: {},
				cuTocks: {},
				cuVolume: {},
				cached: false
			}
		}
	}
	
	/**
	 * Decodes the message received by the network component
	 * and makes a decision where to stash the data and how
	 */
	getVolumeSet(): Array<RunResultDisplayEntry> {
		return this.volumeSet;
	}

	/**
	  * Gets the result description as derived
	  * from a result object
	  */
	getResultDescription(): RunResultVolumesDescription {
		return this.volumesAccumulator.description;
	}

	/**
	  * Returns if the result description was derived
	  * This is to show that if the result description was derived
	  * and results may contain partial fields, this is likely
	  * to result in an invalid display
	  */
	getResultDescriptionWasDerived() {
		return this.volumesAccumulator.descriptionDerived;
	}

	/**
	  * Gets a volumeset that is non-cached, these are
	  * weak references - as they are only referring
	  * to the index within an array itself
	  */
	getVolumeSetNonCached(): Array<number> {
		return this.volumeSetNonCached;
	}

	/**
	  * Gets the compute unit id map to the 
	  * compute graph result
	  */
	getCUIDMap(): Map<string, Array<CGResult>> {
		return this.withCUID;
	}

	/**
	  * Gets the total result
	  * array
	  * @deprecated
	  */
	getTotalArray(): Array<CGResult> {
		return this.withTotal;
	}

	/**
	  * Gets the cache hash set
	  * @deprecated
	  */
	getCacheHashesSet(): Set<CUHashHex> {
		return this.cacheHashes;
	}

	/**
	  * Volume HashMap
	  * That is currently stored and holds the hashes
	  * @deprecated
	  */
	getVolHashMap(): Map<string, Array<CGHashResult>> {
		return this.volumesWithHashes;
	}


	/**
	  * Clears the data segment
	  * related to the run result persistent storage mechanism
	  */
	clearData() {
		this.storageRef.write(RUNRESULT_STORAGEKEY,
			SyncStateOperations.newSyncObject(
				SyncStateOperations.zeroState()));

		this.storageRef.writeMeta(RUNRESULT_STORAGEKEY,
			SyncStateOperations.newSyncMetaObject({
				appendable: true,
				writable: true,
				storageKey: RUNRESULT_STORAGEKEY,
			})
		);
	}


	/**
	  * Appends the data to the persistent storage 
	  * mechanism
	  */
	appendSegment(data: RunResultDisplayEntry) {
		this.storageRef.append(RUNRESULT_STORAGEKEY,data);
	}

	/**
	  * Serializes the volume data
	  * This allows for downloading it from the column
	  */
	writeFull() {

		this.storageRef.write(RUNRESULT_STORAGEKEY,
				SyncStateOperations.newSyncObject(this.snapshot()));
	}

	/**
	  * reads the volume
	  * from the persistent storage
	  * object that can be referenced
	  */
	readFull() {
		this.storageRef.read(RUNRESULT_STORAGEKEY)
	}

	/**
	  * Allows for downloading and serialising the runchart
	  * data.
	  */
	getSerializedRunChartData() {
		const snapshot = this.snapshot();
		return snapshot;
	}
}



/**
  * AccumulatorDescriptionSet
  * Used to outline symbols related to the description of the object
  */
export type AccumulatorDescriptionSet = Set<string>;

/**
  * AccumulatorResults
  * Maps strings/fields to results
  */
export type AccumulatorResults = {
	[key: string]: number
}

/**
  * Accumulator object
  *  Used to aggregate the data from a run and store it
  */
export class RunResultAccumulator {
	
	currentTotal = RunResultAccumulator.makeEmptyResultsMap();
	description = RunResultAccumulator.emptyDescriptionSet();
	descriptionDerived= false;
	intermediateTotal = true;

	/**
	  * Derives the fields and values
	  * from any kind of object that can be sent to it
	  */
	derive(obj: any) {
    const description: Set<string> = new Set();
    for(const key in obj) {
      const keyStr = key as string;
      description.add(keyStr);
    }
    this.description = description;
	}

	/**
	  * Reset the fields to their initial state
	  */
	reset() {
		this.currentTotal = RunResultAccumulator.makeEmptyResultsMap();
		this.description = RunResultAccumulator.emptyDescriptionSet();
		this.descriptionDerived= false;
		this.intermediateTotal = true;
	}

	/**
	  * Retrieving Intermediate state
	  * If it is true, it will be setting the values as they come in
	  * If it is false, it will be be set to the last value that has been
	  * set by the caller
	  */
	isRetrievingIntermediateTotal() {
		return this.intermediateTotal;
	}

	/**
	  * Gets the description of the run result accumulator
	  * This will have the mapped keys of the accumulation result
	  */
	getDescription() {
		this.description;
	}

	/**
	  * Checks to see if the description was derived
	  */
	isDerived() {
		return this.descriptionDerived;
	}

  /**
    * Returns an empty description set
    * for the tocks
    */
  static emptyDescriptionSet(): AccumulatorDescriptionSet {
    return new Set();
  }

	/**
	  * Constructs an empty results map
	  * for the accumulator
	  */
  static makeEmptyResultsMap(): AccumulatorResults {
  	return {};
  }

	/**
	  * Derives from an object
	  * This object must have fields that are keys
	  */
  static deriveFromObject(obj: any) {
		const keyset = new Set();
		for(const fkey in obj) {
			keyset.add(fkey);
		}
		return keyset;  	
  }

	/**
	  * Derives from a map
	  * down to a set and then the set can be used as the base version
	  */
	static deriveFromMap<K, V>(map: Map<K, V>) {
		const keyset = new Set();
		for(const mkey of map.keys()) {
			keyset.add(mkey);
		}
		return this.deriveFromSet(keyset);
	}

	/**
	  * derives from a set, this is the reliable method for constructing
	  * a result set
	  */
	static deriveFromSet<K>(set: Set<K>) {
		const accset: AccumulatorResults = {};
		for(const k of set) {
			accset[k as string] = 0;
		}
		return accset;
	}
  
	/**
	  * Generalisation of updating fields
	  * in a subfield of an object
	  */
	static updateFields(subset: {[key: string]: number},
		accSubset: {[key: string]: number},
		fieldSet: Set<string>) {

		const nonExistKeyMap: {[key: string]: number} = {};
		
		for(const fkeyWeak of fieldSet) {
			const fkey = fkeyWeak;
			const toV = subset[fkey];

			if(fkey in accSubset) {
				const olV = accSubset[fkey];
				accSubset[fkey] = olV + toV; //Accumulating
			} else {
				nonExistKeyMap[fkey] = toV;
			}
			
		}
		this.setFields(nonExistKeyMap, accSubset)	
	}

	/**
	  * Sets the fields directly
	  * This will override any accummulated values within the run result
	  * accumulator
	  */
	static setFields(
		subset: {[key: string]: number},
		accSubset: {[key: string]: number}
	) {
		for(const fkey in subset) {
			accSubset[fkey] = accSubset[fkey];
		}
	}

}
