import { PluginEntry } from "../../ui/global/settings/GeneralSettings"


export type ArchitecturePluginConfig = {
  config: string
}

export type ArchitecturePlugin = {
  identifier: string,
  api_map: any,
}
export function ArchitecturesToEntry(prog: ArchitecturePlugin): PluginEntry {
  return {
    keyName: prog.identifier,
    plgName: prog.identifier,
  }
}
export function ArchitecturePluginGetName(prog: ArchitecturePlugin): string {
  return prog.identifier;
}
