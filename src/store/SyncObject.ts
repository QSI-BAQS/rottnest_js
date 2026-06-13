

/**
  * Outlines the state of the layout
  *
  */
export type SyncStateLayout = {
  data: any,
  hash: string,
  set: boolean
}

/**
  * Syncs the architecture
  * This is to ensure that the architecture module itself
  * is identified and synchronised
  */
export type SyncStateArchitecture = {
  data: any,
  hash: string,
  set: boolean,
};

/**
  * Executable to be saved
  * 
  */
export type SyncStateExecutable = {
  data: any,
  hash: string,
  set: boolean,
}

/**
  * Type for the runchart to
  * be synchronised between the backend
  */
export type SyncStateRunChart = {
  data: any,
  hash: string,
  set: boolean,
}

/**
  * This object is used to maintain
  * hashes of the objects on the frontend
  *
  * With this type, we should have a way to emit a simple
  * scalar/simple entry form as to not pollute the backend with data
  * 
  */
export type RottnestSyncState = {
  timestamp: number,
  layout: SyncStateLayout,
  architecture: SyncStateArchitecture,
  executable: SyncStateExecutable,
  runchart: SyncStateRunChart,
}


/**
  * This will hold the hash of the layout
  */
export type SyncStateLayoutDescriptor = {
  hash: string,
}

/**
  * This will hold the hash of the architecture
  */
export type SyncStateArchitectureDescriptor = {
  hash: string,
};

/**
  * Descriptor for the executable
  * Ensuring that the data is held - May be out of date
  */
export type SyncStateExecutableDescriptor = {
  hash: string,
}

/**
  * Descriptor for the runchart
  * Will be 
  */
export type SyncStateRunChartDescriptor = {
  hash: string,
}

/**
  * This object is used to pass to the backend
  * and only contain descriptive information rather than
  * concrete information about frontend objects
  *
  * This means the layout and rundata information would be omitted
  * but their hashes will be contained
  *
  */
export type RottnestSyncStateDescriptor = {
  timestamp: number,
  layout: SyncStateLayoutDescriptor,
  architecture: SyncStateArchitectureDescriptor,
  executable: SyncStateExecutableDescriptor,
  runchart: SyncStateRunChartDescriptor
}



