
import { UnimplReturn } from '../../util/unimpl.ts';
import { ArchActionTracker } from '../ArchActionTracker.ts';
import { ArchCapabilityQuery, ArchCapabilityResult } from '../ArchContext.ts';
import { ArchitectureDesigner } from '../ArchSchema.ts';
import { ArchWorkspaceGroup } from '../ArchWorkspace.ts';
import { SuperconductingDesignUIGroup } from './groups/DesignGroup.tsx';
import { RegionDataList } from './obj/RegionDataList.ts';
import { SuperconductingState } from './state/ArchState.ts';
import { SuperconductingWorkingState } from './state/WorkingState.ts';

// /**
//  * State object of things which are currently being operated on.
//  */
// export class SuperconductingWorkingState {

//   selectedRegion: number = -1;
//   selectedRegionType: string = 'N/A';
  
// 	getSelectedRegionData(): RegionData | null {
// 		const getSelectedIdx = this.selectedRegion;
// 		const selKey = this.selectedRegionType 
// 			!== null ? this.selectedRegionType  : 'NA';
// 		const getSelectedKeyStr = RegionData
// 			.PluraliseKind(
// 			selKey);


// 		return this.getRegionList()
// 			.retrieveByIdx(getSelectedKeyStr, 
// 			getSelectedIdx);
// 	}

	
// 	updateSelectedSubType(subTypeIndex: number) {
// 		this.state.appStateData
// 			.componentData
// 			.selectedSubTool = subTypeIndex;
// 		this.opers.validate(this);
// 		this.triggerUpdate();
// 	}
// }


/**
 * SuperconductingDesigner type, used to represent an instance of making a design
 * for the lat2d architecture
 */
export class SuperconductingDesigner implements ArchitectureDesigner {

	//designBuffer = new SuperconductingDesignBuffer();
  workingState: SuperconductingWorkingState;


	constructor(state: SuperconductingState) {
		this.workingState = state.getWorkState();
	}
  

	/**
	 * Gets the current region data list
	 * TODO: DataList is unimpled
	 */
	getProjectBuffer(): RegionDataList {
		return UnimplReturn<RegionDataList>();
	}

	 /**
   * Queries the capabiliteies of the designer
   */
  queryCapability(query: ArchCapabilityQuery): ArchCapabilityResult {
    if(query.capability === 'CanZoom') {
      return ArchCapabilityResult.Confirm();
    }
    if(query.capability === 'CanUndo') {
      return ArchCapabilityResult.Confirm();
    }
    if(query.capability === 'CanSave') {
      return ArchCapabilityResult.Confirm();
    }
    if(query.capability === 'CanLoad') {
      return ArchCapabilityResult.Confirm();
    }
    return ArchCapabilityResult.NotKnown();
  }

	/**
	 * Gets the snapshot tracker for undo and redo functionality
	 */
	getActionTracker(): ArchActionTracker {
		return this.getActionTracker();
	}

	/**
	 * Returns a workspace group that can be used
	 * in the workspace zone within the application itself
	 */
  makeWorkspaceGroup(): ArchWorkspaceGroup {
    return new SuperconductingDesignUIGroup();
  }
	
}
