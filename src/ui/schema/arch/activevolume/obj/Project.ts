import { ArchitectureProject } from "../../ArchSchema"

/**
 * BodyData that will contain core data
 * for a fully connected graph
 */
export type AVBodyData = {
  registers: number
  ancilla: number
  factories: number
}


export type AVHeaderData = {
  name: string,
  version: string,
  author: string,
  architecture: string,
  description: string
}

export function AVProjectHeaderDefault() {
  return {
    name: 'ActiveVolume',
    version: 'Invalid',
    author: 'You',
    architecture: 'ActiveVolume',
    description: 'Absolutely no architecture'
  }
}

export function AVProjectBodyDefault() {
  return {
    object: {
      registers: 3,
      ancilla: 3,
      factories: 1,
    }
  }
}

/**
 * ActiveVolumeProject
 * 
 * Class that will manage a project that
 * can be serialised and deserialised
 */
export class ActiveVolumeProject {
  header = AVProjectHeaderDefault()
  body = AVProjectBodyDefault()

  static Default() {
    const avproj = new ActiveVolumeProject();
    return avproj;
  }

  getProject(): ArchitectureProject<any> {
    return {
      header: this.header,
      body: this.body,
      getProject: function() { return {...this}; },
      forFile: function() {
        return {...this};
      },
      forNetwork: function() {
        return {...this};
      }
    }
  }

  forFile() {
    return this.getProject()
  }

  forNetwork() {
    return this.getProject()
  }

  setHeader(header: AVHeaderData) {
    this.header = header;
  }

  setRegisters(reg: number) {
    this.body.object.registers = reg;
  }

  setAncilla(anc: number) {
    this.body.object.ancilla = anc;
  }

  setFactories(fact: number) {
    this.body.object.factories = fact
  }

}
