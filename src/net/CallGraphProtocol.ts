/**
  * Gets the callgraph packet kind that will
  * map to an expected packet when the callgraph is processing
  */
export const CallGraphPacketKind  = {
  RootGraph : 'root_graph',
  Graph : 'graph',
  Node : 'node',
  GetGraphConfirmation : 'get_graph_confirmation',
  RunNodeConfirmation : 'run_node_confirmation',
  GraphNotReady : 'graph_not_ready',
  Compiling : 'node_compiling',
  Error : 'error',
}
