

/**
  * The strings are defined for the callgraph space
  * that will be used inside the components
  */
export const CallGraphSpaceStrings = {
  ErrorLoad: "Unable to load Callgraph",
  Loading: "Retrieving Callgraph",

  SVGGroup: "svg_group",
  Stash: {
    RootNode: "root_node",
    GraphRef: "graph_ref",
    InnerMouseEvent: "inner_mouse_event",
    ResetRenderList: "reset_rlist",
  },
  
  EmptyString: ''
};


/**
  * Reset object
  */
export const RequestGraphReset = JSON.stringify(
  { reset: true });


/**
  * Default Zero for graph id
  */
export const RequestGraphDefaultZero = JSON.stringify(
  { graph_id: 0 });

/**
  * Identifier
  */
export const CallGraphMiddleButton = 1;

/**
  * Strings for the node compilation description
  */
export const CallGraphObjectInfo = {
  CompilationState: {
    Compiling: "Compiling",
    Compiled: "Compiled",
  },
  Header: {
    Identifier: "Id: "
  }
};

/**
 * The request state is to monitor when retrieving the callgraph
 * information, where it is currently at
 */
export const CallGraphRequestState = {
  Unavailable: "Unavailable",
  Fetching: "Fetching",
  Available: "Available"
};

/**
 * Unavailable Message when it is either fetching or not loaded
 */
export const CallGraphUnavailableMessage = {
  Fetching: "Retrieving Callgraph",
  Unavailable: "Callgraph is not available"
};

/**
  * Marks the request as a key, enforces it to match
  * one of the strings
  */
export type CallGraphRequestStateKey =
  typeof CallGraphRequestState.Unavailable |
  typeof CallGraphRequestState.Fetching |
  typeof CallGraphRequestState.Available;


/** Checks if the request has finished */
export const RequestIsAvailable = (state: CallGraphRequestStateKey) => {
  return state == CallGraphRequestState.Available;
}

/** Checks if the request is finished and not loaded */
export const RequestIsUnavailable = (state: CallGraphRequestStateKey) => {
  return state == CallGraphRequestState.Unavailable;
}

/** Checks if the request is still loading */
export const RequestIsFetching = (state: CallGraphRequestStateKey) => {
  return state == CallGraphRequestState.Fetching;
}
