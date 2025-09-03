
import { ArchCapabilityQuery, ArchCapabilityResult } from "../ArchContext";
import { ArchitectureRunChart } from "../ArchSchema";
import { ArchWorkspaceGroup } from "../ArchWorkspace";
import { RunChartGroup } from "./groups/RunChartGroup";



export class SuperconductingRunChart implements ArchitectureRunChart {

  capability: string = '';
  
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
      return ArchCapabilityResult.Confirm();
    }
    if(query.capability === 'CanLoad') {
      return ArchCapabilityResult.Confirm();
    }
    if(query.capability === 'CanNetwork') {
      return ArchCapabilityResult.Confirm();
    }
    return ArchCapabilityResult.NotKnown();
  }

  /**
   * Constructs the workspace group
   */
  makeWorkspaceGroup(): ArchWorkspaceGroup {
      return new RunChartGroup();
  }
}
