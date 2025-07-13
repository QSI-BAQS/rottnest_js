import { PluginEntry } from "../../ui/global/settings/GeneralSettings"


export type ProgramPluginConfig = {
  config: string
}

export type ProgramParam = {
  param: string,
  kind: string
}


export type ProgramPlugin = {
  name: string,
  params: Array<ProgramParam>
}

export function ProgramPluginToEntry(prog: ProgramPlugin): PluginEntry {
  return {
    keyName: prog.name,
    plgName: prog.name,
  }
}


export function ProgramPluginGetName(prog: ProgramPlugin): string {
  return prog.name;
}
