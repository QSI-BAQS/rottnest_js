import { PluginEntry } from "../../ui/global/settings/GeneralSettings"
import { ArchitectureSchema } from "../../ui/schema/arch/ArchSchema"

export type ArchPackageType = "Serialised" | "PathedLocal"

/**
 * StorageEntry 
 */
export type ArchStorageEntry = {
	schema: ArchitectureSchema
	apimap: ArchAPIMap
}

/**
 * The API map that is to be used
 */
export type ArchAPIMap = {
  mask: string,
  routes: Array<string>
}

/**
 * Current package to get around a bunch of
 * quirks
 */
export type ArchPackage = {
  kind: ArchPackageType,
  data: string
  apimap: ArchAPIMap
}


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
    architectures: ArchCorePlugins(),
    config: { contents: '[]'}
  }
}

/**
 * Sets the core plugins - This is a somewhat hardcoded solution
 */
export function ArchCorePlugins(): Array<ArchitecturePlugin> {
  return [
    {
      identifier: 'NoArch',
      api_map: {},
    },
  ]
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
