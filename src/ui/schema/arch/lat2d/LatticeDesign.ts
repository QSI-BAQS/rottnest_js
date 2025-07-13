
import { ArchActionTracker } from '../ArchActionTracker.ts';
import { ArchitectureDesigner } from '../ArchSchema.ts';
import { ArchWorkspaceGroup, ArchWorkspaceProps } from '../ArchWorkspace.ts';
import { LatticeDesignBuffer } from './des/buf/LatticeDesignBuffer.ts';
import { RegionData } from './obj/LatticeRegionData.ts';
import { RegionDataList } from './obj/RegionDataList.ts';
import { LatticeRegionKindMap } from './obj/RegionKindMap.ts';
import { RegionsSnapshotStack } from './obj/RegionSnapshotStack.ts';

/**
 * State object of things which are currently being operated on.
 */
export class LatticeWorkingState {

  selectedRegion: number = -1;
  selectedRegionType: string = 'N/A';
  
  
	getSelectedRegionData(): RegionData | null {
		const getSelectedIdx = this.selectedRegion;
		const selKey = this.selectedRegionType 
			!== null ? this.selectedRegionType  : 'NA';
		const getSelectedKeyStr = RegionData
			.PluraliseKind(
			selKey);


		return this.getRegionList()
			.retrieveByIdx(getSelectedKeyStr, 
			getSelectedIdx);
	}

	
	updateSelectedSubType(subTypeIndex: number) {
		this.state.appStateData
			.componentData
			.selectedSubTool = subTypeIndex;
		this.opers.validate(this);
		this.triggerUpdate();
	}
}

/**
 * LatticeDesign which reflects the design object
 * within the designer and operations related to it.
 */
export class LatticeDesign {

  state: LatticeWorkingState;

  constructor() {
    this.state = new LatticeWorkingState();
     
  }

}


/**
 * Constructs the workspace group that will be used by the workspace component
 * within rottnest
 */
export class LatticeDesignerUIGroup implements ArchWorkspaceGroup {
  makeGroup(_data: ArchWorkspaceProps): Array<React.ReactElement> {
      return [];
  }
}
	


/**
 * LatticeDesigner type, used to represent an instance of making a design
 * for the lat2d architecture
 */
export class LatticeDesigner implements ArchitectureDesigner {

	target: LatticeDesign = new LatticeDesign();
	designBuffer = new LatticeDesignBuffer();

	/**
	 * Gets the snapshot tracker for undo and redo functionality
	 */
	getActionTracker(): ArchActionTracker {
		return this.designBuffer.getSnapshopStack();
	}

	/**
	 * Returns a workspace group that can be used
	 * in the workspace zone within the application itself
	 */
  makeWorkspaceGroup(): ArchWorkspaceGroup {
    return new LatticeDesignerUIGroup();
  }
	
}
