
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


