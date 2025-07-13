import { RegionCell, RegionData } from "../../obj/LatticeRegionData";
import { RegionsSnapshotStack } from "../../obj/RegionSnapshotStack";

/**
 * The current target for the designer
 * It will hold the current state of the design
 *
 * This will also hold the snapshot stack
 */
export class LatticeDesignBuffer {

	snapshots: RegionsSnapshotStack = new RegionsSnapshotStack();
	buffer: RegionData = new RegionData();

	/**
	 * Retturns the current snapshot stack
	 */
	getSnapshopStack(): RegionsSnapshotStack {
		return this.snapshots;
	}

	/**
	 * Retrieves the current buffer
	 */		
	getCurrentBuffer(): RegionData {
		return this.buffer;
	}
	
	/**
	 * Applys the current regiondata buffer to 
	 * the region list. It will then duplicate the
	 * current regionlist and move on.
	 */	
	applyRDBuffer() {
		const oldBuffer: RegionData = this.buffer;
		this.buffer = new RegionData();

		//The index 6, is currently the unselect,
		//this is *not good*
		if(this.getToolIndex() === 6) {

			//Clean up
			//TODO: We need to have callbacks 
			//for this
			//I have littered the code with
			//too much rubbish

			this.onRegion();

			//TODO: FIx
			this.state.regionList
				.cleanupIntersections(oldBuffer);

			//TODO: Fix
			//this.opers.validate(this);
			this.triggerUpdate();
		} else {
			//TODO: Fix
			const rkey = this.toolToRegionKey();
			
			if(rkey) {
				const pkey = RegionData
					.SingularKind(rkey);

				const subkindFor 
				= this.state.subTypes[pkey as keyof RottnestKindMap];

				let kindex = this.state.appStateData
				.componentData.selectedSubTool;


				if(kindex === 0) {
					kindex = (subkindFor
						  .length-1)
					 % subkindFor.length;
				}

				const kSubKindDefault = subkindFor[kindex];
				
				
				oldBuffer.setSubKind(kSubKindDefault.name);

				this.onRegion();
					
				this.state.regionList
					.addData(oldBuffer, 
						 rkey);
				
				this.state.regionList.resolveConnectionsFromTraversal(
						false);

				let res: RegionCell | undefined = oldBuffer.cells
					.values()
					.next().value;

				if(res) {	
					const { x, y }: { x: number, y: number } = res;	
					this.updateSelectedRegion(x, y);
					
				}
				this.triggerUpdate();
			}
		}
	}

	
}

