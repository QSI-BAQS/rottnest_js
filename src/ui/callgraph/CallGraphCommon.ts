import { CallGraphEntry } from "../../obj/CallGraph";

export type CallGraphRootPairs = Array<[string, CallGraphEntry]>;

/**
  * CallGraphStashMapLabels
  * Used to be referenced within callgraph structure itself
  */
export const CallGraphStashMapLabels = {
    // Currently empty
  BufferMapInnerMouseEvent : "inner_mouse_event",
  BufferMapRootNode: "root_node",
  BufferMapNextNode: "next_node",
  BufferMapVisualData: "viz_sim_data",
  BufferMapChartGraphId: "cgviz_chart_gid_data",
  
};


/**
  * Constants
  * 
  */
export const CallGraphStashMapConstants = {
  IndexNotSelected: 'Not Selected',
  KindNotSelected : 'Not Ready',
  
}


/**
  * Set of constants that allow for
  * setting the symbols that can be referenced properly instead
  * of just guessing based on strings
  */
export const CallGraphConstants = {
  ComputeUnitId   : 'Unset',
  CompilationState: {
    Compiling: 'Compiling',
    Finished:  'Compilation Finished',
    
  },
  Node: {
    NotSelected: 'Not Selected',
    NoKind : 'No Kind',
    NoDescription: 'No Description',
    RunNode: 'Run Node',
    RunNodeNotAvailable: 'Not Available'
  },
  Visualiser: {
    RunRequested: 'Currently Running',
    VisualisationReady : 'Run Visualisation',
  },
  Headers: {
    ColumnContextAndVolumes: "Context & Volumes",
    GlobalVolumes: "Global Volumes:",
    RegisterVolume: "Reg. Vol:"
    
  }
  
}


export class CallGraphUtil {

  // static SendObject(appService: NetworkService, pkg: any) {
    
  // }
  
}
