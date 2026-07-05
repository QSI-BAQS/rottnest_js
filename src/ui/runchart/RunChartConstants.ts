
/**
 * Constants that are used within RunChart columns
 */
export const RunChartConstants = {
  UnitId: 0,
  StyleDefaults: {
    None: '',
  },
  Headers: {
    SelectedNode: "Node Data",
    GlobalData: "Volumes & Tocks",
    GlobalVolumes: "Volumes Data",
    Tocks: "Tocks Data",
    TSource: "T-Source Info"
    
  },
  CompilationState: {
    Finished: "Finished",
    Compiling: "Compiling"
  },
  Node: {
    NotSelected: "Not Selected",
    NoDescription: "",
    NoKind: "",
    StateNotReady: "Not ready",
  },
  Scale: {
    Linear: "Linear",
    Log: "Log"
  }
};

/** Fixed constant for selecting all routing types */
export const RunChartAll = 'ALL';

/**
  * Fixed constant that RunChart construction can reference for SVG group
  */
export const RunChartSVGGroup = 'g';

/**
  * RunChartAttributes
  * Symbol list to construct and put in place
  * where we need to describe and have clarity
  */
export const RunChartAttributes = {
  Width: 'width',
  Height: 'height',
  Transform: 'transform',
  Group: 'g'
};

export const RunChartCacheValues = {
  CacheOn: 'On',
  CacheOff: 'Off',
};


/**
  * RunChartCacheOptions
  * This is shown within the runchart to and is an option
  * for the user
  */
export const RunChartCacheOptions = {
  CacheIncluded: {
    display: "Cache Included",
    value: RunChartCacheValues.CacheOn
  },
  CacheDisabled: {
    display: "Cache Excluded",
    value: RunChartCacheValues.CacheOff
  }
}

/**
  * Scale Options
  * Currently just linear and log scale
  */
export const RunChartScaleOptions = {
  ScaleLinear: {
    display: RunChartConstants.Scale.Linear,
    value: RunChartConstants.Scale.Linear
  },
  ScaleLog: {
    display: RunChartConstants.Scale.Log,
    value: RunChartConstants.Scale.Log
  },
}


