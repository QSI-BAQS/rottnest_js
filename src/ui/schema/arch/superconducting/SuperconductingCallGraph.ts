
import { ArchitectureCallGraph } from "../ArchSchema";
import { SuperconductingCallGraph, SuperconductingCallGraphDefault } from "./obj/CallGraph";
import { ArchWorkspaceGroup } from "../ArchWorkspace.ts";
import { CallGraphGroup } from "./groups/CallGraphGroup.tsx";
import { ArchCapabilityQuery, ArchCapabilityResult } from "../ArchContext.ts";


/**
 * SuperconductingCallGraphState, usually was just the graph view within
 * the rottnest container
 */
export class SuperconductingCallGraphState implements ArchitectureCallGraph {

  callgraph: SuperconductingCallGraph = SuperconductingCallGraphDefault();
  graphViewData: any = {};

  makeWorkspaceGroup(): ArchWorkspaceGroup {
    return new CallGraphGroup();
  }
  /**
   * Queries the capabiliteies of the designer
   */
  queryCapability(query: ArchCapabilityQuery): ArchCapabilityResult {
    if(query.capability === 'CanZoom') {
      return ArchCapabilityResult.Confirm();
    }
    return ArchCapabilityResult.Deny();
  }
  /**
   * Run Result Buffer, this is a stack of objects that
   * are held here
   * TODO: Change run result buffer to do effective buffering
   */
  getRRBuffer() {
    //this.state.rrBuffer;
  }

  /**
   *
   */
	getCGGraph() {
		return this.graphViewData;
	}
  
}
