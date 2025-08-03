import { Regions } from "../obj/RegionData";



export class RegionToolUtilities {
  

	/**
	 * NOTE: Also replaced toolToRegionKey()
	 *
	 * Will translate the tool number to a region key
	 * tnum is the tool number as selected i the UI
	 */
	static ToolNumberToRegionKey(tnum: number) : keyof Regions | null {
		switch(tnum) {
			case 1:
				return 'buffers';
			case 2:
				return 'bus';
			case 3:
				return 'factories';
			case 4:
				return 'bellstates';
			case 5:
				return 'registers';
			default:
				break;
		}

		return null;
	}

}
