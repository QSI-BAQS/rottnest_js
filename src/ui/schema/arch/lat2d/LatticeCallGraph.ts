
import { ArchitectureCallGraph } from "../ArchSchema";
import { LatticeCallGraph, LatticeCallGraphDefault } from "./obj/LatticeCallGraph";
import { ArchWorkspaceGroup } from "../ArchWorkspace.ts";
import { CallGraphGroup } from "./groups/CallGraphGroup.tsx";


/**
 * LatticeCallGraphState, usually was just the graph view within
 * the rottnest container
 */
export class LatticeCallGraphState implements ArchitectureCallGraph {

  callgraph: LatticeCallGraph = LatticeCallGraphDefault();
  graphViewData: any = {};

  makeWorkspaceGroup(): ArchWorkspaceGroup {
    return new CallGraphGroup();
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
