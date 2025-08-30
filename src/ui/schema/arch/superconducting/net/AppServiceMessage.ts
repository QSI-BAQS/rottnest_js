

export class RottRunResultMSG {

	archid: number;

	constructor(archid: number) {
		this.archid = archid;
	}

	toJsonStr(): string {
		return JSON.stringify({
			message: "arch_lat2d_run_result",
			originator: "rottnest",
			payload: { 'arch_id' : this.archid },
		});
	}
}

/**
 * Deserialisation interface that is
 * used by the network service
 */
export interface DeRott {
	fromStr(data: string): this | null
	fromJSON(data: any): this | null
}

/**
 * Application Service Message,
 * Will be used by the receiver to then process message
 * and also utilise a parser kind for a particular
 * message type
 */
export class AppServiceMessage {
	
	rawData: string = '';
	interpretedData: any | null = {};
	dataIsJson: boolean = false;
	receivedData: boolean = false;

	constructor(data?: string) {
		if(data) {
			this.rawData = data;
			this.receivedData = true;
		}
	}

	/**
	 * When initialised as an empty container
	 * it will allow for the data to be set
	 * for it
	 */
	setData(data: string) {
		this.rawData = data;
	}

	/**
	 * It will parse the raw data into
	 * a JSON object that can be utilised
	 */
	parseData(): boolean {
		try {
			const data = JSON.parse(this.rawData);
			this.interpretedData = data;
			this.dataIsJson = true;
			return true;
		} catch {
			this.dataIsJson = false;
			return false;
		}
	}

	/**
	 * Will accept a DeRott kind that will
	 * attempt to parse it to a particular container kind T
	 * If it fails, it will return null
	 */
	parseDataTo<T extends DeRott>(container: T): T | null {
		if(!this.interpretedData) {
			if(!this.parseData()) {
				return null;
			}
		}

		const gData = this.interpretedData;
		const res = container.fromJSON(gData);
		return res;
	}

	/**
	 * Checks to see if the data is json
	 */
	isJSON(): boolean {
		return this.dataIsJson;	
	}

	/**
	 * Checks if raw data has been received
	 */
	hasRaw(): boolean {
		return this.receivedData;
	}

	/**
	 * Will get the raw data
	 */
	getRaw(): string {
		return this.rawData;
	}

	/**
	 * Gets the JSON representation or null if
	 * it is not parseable as JSON
	 */
	getJSON(): any | null {
		if(!this.dataIsJson) {
			this.parseData();
		}
		return this.interpretedData;
	}

}

