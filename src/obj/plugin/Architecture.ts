import { PluginEntry } from "../../ui/global/settings/GeneralSettings"


/**
 * Set of architecture and the configuration associated
 */
export type ArchSet = {
  architectures: Array<ArchitecturePlugin>,
  config: ArchitecturePluginConfig
}

/**
 * Architecture plugin configuration string
 */
export type ArchitecturePluginConfig = {
  contents: string
}

/**
 * Plugin that also contains the architecture and plugin
 * map
 */
export type ArchitecturePlugin = {
  identifier: string,
  api_map: any,
}

/**
 * Translates the Architecture to the an entry
 */
export function ArchitecturesToEntry(prog: ArchitecturePlugin): PluginEntry {
  return {
    keyName: prog.identifier,
    plgName: prog.identifier,
  }
}

/**
 * Gets the plugin name
 */
export function ArchitecturePluginGetName(prog: ArchitecturePlugin): string {
  return prog.identifier;
}


/**
 * Default function for architecture set
 */
export function ArchSetDefault(): ArchSet {
  return {
    architectures: [],
    config: { contents: ''}
  }
}


/**
 * Default function for an architecture plugin
 */
export function ArchPluginDefault(): ArchitecturePlugin {
  return {
    identifier: 'NoArch',
    api_map: {}
  }
}
