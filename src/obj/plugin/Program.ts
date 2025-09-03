

/**
 * Program plugin set, will hold a listing that was
 * retrieved from the backend
 */
export type ProgramPluginSet = {
  programs: Array<ProgramPlugin>,
  config: ProgramPluginConfig
}

/**
 * Configuration string related to the program
 */
export type ProgramPluginConfig = {
  contents: string
}


/**
 * Parameter entry
 */
export type ProgramParam = [string, string, any]


/**
 * ProgramPlugin that holds the name and the parameters
 * associated
 */
export type ProgramPlugin = {
  name: string,
  params: Array<ProgramParam>
}


/**
 * Translate a program plugin to an entry to be used
 * within the application
 */
export function ProgramPluginToEntry(prog: ProgramPlugin) {
  return {
    keyName: prog.name,
    plgName: prog.name,
  }
}

/**
 * Gets the name from the plugin
 */
export function ProgramPluginGetName(prog: ProgramPlugin): string {
  return prog.name;
}


/**
 * Default function to initialise the data of ProgramPlugin
 */
export function ProgramPluginDefault(): ProgramPlugin {
  return {
    name: 'NoPrg',
    params: []
  }
}

/**
 * Default function to initialise the data of ProgramPluginSet
 */
export function ProgramPluginSetDefault(): ProgramPluginSet {
  return {
    programs: [],
    config: { contents: '[]' }
  }
}
