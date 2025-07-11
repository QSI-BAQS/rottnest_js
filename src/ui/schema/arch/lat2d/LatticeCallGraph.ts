
import { ArchitectureCallGraph } from "../ArchSchema";
import { LatticeCallGraph, LatticeCallGraphDefault } from "./obj/LatticeCallGraph";
import { ArchWorkspace, ArchWorkspaceGroup, ArchWorkspaceProps } from "../ArchWorkspace.ts";
import { Component } from "react";


/**
 * Constructs the workspace group that will be used by the workspace component
 * within rottnest
 */
export class LatticeCallGraphUIGroup implements ArchWorkspaceGroup {
  makeGroup(_data: ArchWorkspaceProps): Array<React.ReactElement> {
      return [];
  }
}



export class LatticeCallGraphView extends Component<{}, {}> implements ArchWorkspace {

  render() {

    return (<></>)
  } 
}

/**
 * LatticeCallGraphState, usually was just the graph view within
 * the rottnest container
 */
export class LatticeCallGraphState implements ArchitectureCallGraph {

  callgraph: LatticeCallGraph = LatticeCallGraphDefault();


  makeWorkspaceGroup(): ArchWorkspaceGroup {
    return new LatticeCallGraphUIGroup();
  }
  
}
