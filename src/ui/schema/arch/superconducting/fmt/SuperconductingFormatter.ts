import { ArchitectureFormatter, ArchitectureProject } from "../../ArchSchema";
import ArchConverter from "../io/Converter";
import { ProjectDetails } from "../obj/Project";
import { RegionDataList } from "../obj/RegionDataList";
import { Superconducting2DArchitecture } from "../Superconducting";



/**
 * Creates a superconducting formatter for the project files
 */
export class SuperconductingFormatter implements ArchitectureFormatter {

  object: Superconducting2DArchitecture;

  constructor(object: Superconducting2DArchitecture) {
    this.object = object;
  }

  /**
   * Will transform the current project into a project that can
   * be sent over the network to the backend 
   */
  toNetwork(project: ArchitectureProject<any>): any {
    const designer = this.object.components.designer;
    const { width, height } = (project as ProjectDetails).body.object;
    const projBuf: RegionDataList = designer.getProjectBuffer();
    const converted = ArchConverter.ToTSched({
      width,
      height,
      regions: projBuf
    });

    return converted;
  }

  /**
   * Flattens the data related to the project, makes it ready to be saved
   */
  toFile(project: ArchitectureProject<any>): any {
    
    const designer = this.object.components.designer;
    const projBuf: RegionDataList = designer.getProjectBuffer();

    const newProject = this.object.makeProject();
    newProject.header = {...project.header};
    newProject.body.object = projBuf.flatten();

    return newProject;
  }
  
}
