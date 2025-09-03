import { ServicesHolder } from './sigs/ServicesHolder.ts';
import { ArchitectureCallGraph,
  ArchitectureConnectionManager,
  ArchitectureDesigner,
  ArchitectureExtensions,
  ArchitectureExtObj,
  ArchitectureFormatter,
  ArchitectureModulesMeta,
  ArchitectureObject,
  ArchitectureProject,
  ArchitectureRunChart,
  ArchitectureSchema,
  ArchitectureSerializer,
  ArchitectureVisualiser } from './sigs/ArchSchema.ts';
import { ActiveVolumeCallGraph } from './ActiveVolumeCallGraph.ts';
import { ActiveVolumeDesigner } from './ActiveVolumeDesigner.ts';
import { ActiveVolumeNetManager } from './ActiveVolumeNetwork.ts';
import { ActiveVolumeSerializer } from './ActiveVolumeSerializer.ts';
import { ActiveVolumeVisualiser } from './ActiveVolumeVisualiser.ts';
import { ActiveVolumeProject } from './obj/Project.ts';
import { ActiveVolumeProjectForm } from './ui/ProjectForm.tsx';
import { ActiveVolumeFormatter } from './ActiveVolumeFormatter.ts';
import { ActiveVolumeRunChart } from './ActiveVolumeRunChart.ts';


/**
 * Volume Extensions
 */
class ActiveVolumeExtensions implements ArchitectureExtensions<any> {
  
  extensions: Map<string, any> = new Map(); 
  
  getExtension(name: string): ArchitectureExtObj<any> {
    const res = this.extensions.get(name);
    if(res === undefined || res === null) {
      return new ArchitectureExtObj(null);
    } else {
      return new ArchitectureExtObj(res);
    }
  }

  getAllExtensions(): Map<string, any> {
    return this.extensions;
  }
}

/**
 * ActiveVolumeSchema is for building a noarch object when there are
 * no architectures available
 */
export class ActiveVolumeSchema implements ArchitectureSchema {

  name: string = "ActiveVolume";
  
  /**
   * Creates a noarch schema that can be style and outline when the application is
   * not ready
   */
  createArchitecture(services: ServicesHolder, _args?: Map<string, string | number>): ArchitectureObject {
    return new ActiveVolumeObject(services);
  }
  
}

/**
 * Inplace for when there is no architecture ready
 * to be used, this would be when the user is still selecting
 */
export class ActiveVolumeObject implements ArchitectureObject {

  getName(): string {
    return 'ActiveVolume';
  }

  services: ServicesHolder;
  project: ActiveVolumeProject = ActiveVolumeProject.Default();

  getProjectSettingsForm() {
    return ActiveVolumeProjectForm;
  }
  
  meta: ArchitectureModulesMeta = new ArchitectureModulesMeta(
    ["Designer", "Visualiser"],
    ["Designer", "Visualiser"],
    [true, false],
    2
  )

  constructor(services: ServicesHolder) {
    this.services = services;
  }

  /**
   * Will return an error
   */
  getFormatter(): ArchitectureFormatter {
    return new ActiveVolumeFormatter(this);
  }

  getRunChart(): ArchitectureRunChart {
    return new ActiveVolumeRunChart();
  }
  
  // Holds the project information
  getProject(): ArchitectureProject<any> {
    console.log(this.project);
    return this.project.getProject()
  }

  // Sets the project information
  setProject(project: ArchitectureProject<any>): boolean {
    this.project.header = project.header;
    this.project.body = project.body;
    return true;
  }

  /**
   * Makes the project based on defaults in getProject()
   */
  makeProject(): ArchitectureProject<any> {
    return {...this.getProject()}
  }
  
  // Get avaiable modules
  getModulesMeta(): ArchitectureModulesMeta {
    return this.meta;
  }

  /**
   * Returns a designer that can instantiate the designer
   * component that is necessary for the
   * application
   */
  getDesigner(): ArchitectureDesigner {
    return new ActiveVolumeDesigner();
  }

  /**
   * Returns a visualiser that can instantiate the visualiser
   * component that is necessary for the
   * application
   */
  getVisualiser(): ArchitectureVisualiser {
    return new ActiveVolumeVisualiser();    
  }

  /**
   * Returns a callgraph view that can instantiate the callgraph view
   * component that is necessary for the
   * application
   */
  getCallGraph(): ArchitectureCallGraph {
    return new ActiveVolumeCallGraph();
  }

  /**
   * Returns a serializer that can instantiate the serializer
   * component that is necessary for the
   * application
   */
  getSerializer(): ArchitectureSerializer<any> {
    return new ActiveVolumeSerializer();
  }

  /**
   * Creates extensions that may be used by other
   * components or shared components
   */
  getExtensions(): ArchitectureExtensions<any> {
    return new ActiveVolumeExtensions();
  }

  /**
   * Manages the network/api endpoints outside of the global parts
   * Will have access to the websockets that will be given to it
   */
  getConnectionManager(): ArchitectureConnectionManager {
    return new ActiveVolumeNetManager(this);
  }

  /**
   * Gets access to the application's services
   */
  getServices(): ServicesHolder {
    return this.services;
  }
}

export default ActiveVolumeSchema;
