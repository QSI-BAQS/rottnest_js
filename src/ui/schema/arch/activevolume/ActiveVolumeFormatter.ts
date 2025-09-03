import { ArchitectureFormatter } from "../ArchSchema";
import { ActiveVolumeObject } from "./ActiveVolume";
import { ArchitectureProject } from "./sigs/ArchSchema";


export class ActiveVolumeFormatter implements ArchitectureFormatter {

  object: ActiveVolumeObject;

  constructor(object: ActiveVolumeObject) {
    this.object = object;
  }

  /**
   * Will transform the current project into a project that can
   * be sent over the network to the backend 
   */
  toNetwork(project: ArchitectureProject<any>): any {
    const converted = {
      header: project.header,
      body: project.body
    }
    return converted;
  }

  /**
   * Flattens the data related to the project, makes it ready to be saved
   */
  toFile(project: ArchitectureProject<any>): any {

    const converted = {
      header: project.header,
      body: project.body
    }
    return converted;
    return converted;
  }
  
}
