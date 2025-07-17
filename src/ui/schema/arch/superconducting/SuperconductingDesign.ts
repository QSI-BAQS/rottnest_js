
import { ArchActionTracker } from '../ArchActionTracker.ts';
import { ArchCapabilityQuery, ArchCapabilityResult } from '../ArchContext.ts';
import { ArchitectureDesigner } from '../ArchSchema.ts';
import { ArchWorkspaceGroup, ArchWorkspaceProps } from '../ArchWorkspace.ts';
import { LatticeDesignBuffer } from './des/buf/LatticeDesignBuffer.ts';
import { LatticeDesignUIGroup } from './groups/DesignGroup.tsx';
import { RegionData } from './obj/LatticeRegionData.ts';

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
 * LatticeDesigner type, used to represent an instance of making a design
 * for the lat2d architecture
 */
export class LatticeDesigner implements ArchitectureDesigner {

	designBuffer = new LatticeDesignBuffer();
  workingState: LatticeWorkingState = new LatticeWorkingState();

	 /**
   * Queries the capabiliteies of the designer
   */
  queryCapability(query: ArchCapabilityQuery): ArchCapabilityResult {
    if(query.capability === 'CanZoom') {
      return ArchCapabilityResult.Deny();
    }
    if(query.capability === 'CanUndo') {
      return ArchCapabilityResult.Deny();
    }
    if(query.capability === 'CanSave') {
      return ArchCapabilityResult.Deny();
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
		return this.designBuffer.getSnapshopStack();
	}

	/**
	 * Returns a workspace group that can be used
	 * in the workspace zone within the application itself
	 */
  makeWorkspaceGroup(): ArchWorkspaceGroup {
    return new LatticeDesignUIGroup();
  }
	
}
