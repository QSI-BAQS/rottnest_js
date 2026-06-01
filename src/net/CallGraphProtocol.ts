/**
  * Gets the callgraph packet kind that will
  * map to an expected packet when the callgraph is processing
  */
export const CallGraphPacketKind  = {
  RootGraph : 'RootGraph',
  Graph : 'Graph',
  Node : 'Node',
  GetGraphConfirmation : 'GetGraphConfirmation',
  GraphUnavailable : 'GraphUnavailable',
  RunNodeConfirmation : 'RunNodeConfirmation',
  GraphNotReady : 'GraphNotReady',
  VisualObject : 'VisualObject',
  Compiling : 'NodeCompiling',
  Error : 'Error',
}
