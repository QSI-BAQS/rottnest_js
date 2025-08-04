
import { ArchitectureCallGraph,
  ArchitectureConnectionManager,
  ArchitectureDesigner,
  ArchitectureExtensions,
  ArchitectureFormatter,
  ArchitectureModulesMeta,
  ArchitectureObject,
  ArchitectureProject,
  ArchitectureSchema,
  ArchitectureSerializer,
  ArchitectureVisualiser } from '../ArchSchema.ts';

import { SuperconductingCallGraphState } from './SuperconductingCallGraph.ts';
import { SuperconductingDesigner } from './SuperconductingDesign.ts';
import { SuperconductingExtensionMap } from './SuperconductingExtension.ts';
import { SuperconductingVisualiser } from './SuperconductingVisualiser.ts';
import { SuperconductingNetManager } from './SuperconductingNetManager.ts';
import { SuperconductingSerializer } from './io/Serializer.ts';
import { SuperconductingFormatter } from './fmt/SuperconductingFormatter.ts';
import { Services } from '../../../../service/Services.ts';
import { RegionDataList } from './obj/RegionDataList.ts';
import { ProjectDetailsDefaultData, ProjectDump } from './obj/Project.ts';
import { SuperconductingState } from './state/ArchState.ts';

/**
 * Schema object, typically only one instance which is used to
 * construct architectures (template class)
 */
export class Superconducting2DSchema implements ArchitectureSchema {

  /**
   * Creates an architecture object that can be used by
   * application
   */
  createArchitecture(services: Services, args: Map<string, string | number>): ArchitectureObject {
    return new Superconducting2DArchitecture(services, args);
  }
  
}

/**
 * Different components of the superconducting plugin
 */
type SuperconductingComponents = {
  serializer: SuperconductingSerializer,
  visualiser: SuperconductingVisualiser,
  callgraph: SuperconductingCallGraphState,
  extension: SuperconductingExtensionMap,
  netmanager: SuperconductingNetManager,
  formatter: SuperconductingFormatter,
  designer: SuperconductingDesigner,
  statedata: SuperconductingState
}


/**
 * The Superconducting2DArchitecture object that will be a facade object
 * that RottnestContainer will use.
 */
export class Superconducting2DArchitecture implements ArchitectureObject<RegionDataList, any> {

  services: Services;

  components: SuperconductingComponents;
  
  // Project Defaults
  project: ProjectDump = ProjectDetailsDefaultData()

  // Meta data, keeps track of what is active
  meta: ArchitectureModulesMeta = new ArchitectureModulesMeta(
        ["Designer", "Visualiser", "CallGraph", "Chart"],
        ["Designer", "Visualiser"],
        [true, true, false, false], 4)
  

  /**
   * Constructor for the Superconducting2DArchitecture with its abstraction
   * Will leverage an argument map
   */
  constructor(services: Services, _args: Map<string, string | number>) {
    this.services = services;
    let statedata = new SuperconductingState(
      () => { services.getRefreshService().triggerRefresh(); }
    );
    let designer = new SuperconductingDesigner(statedata);

    this.components = {
      serializer: new SuperconductingSerializer(),
      visualiser: new SuperconductingVisualiser(),
      callgraph: new SuperconductingCallGraphState(),
      extension: new SuperconductingExtensionMap(),
      netmanager: new SuperconductingNetManager(this),
      formatter: new SuperconductingFormatter(this),
      designer,
      statedata
    }
  }

  /**
   * Gets the state data for other components
   */
  getStateData() {
    return this.components.statedata;
  }

  /**
   * Gets the architecture formatter
   */
  getFormatter(): ArchitectureFormatter {
    return this.components.formatter;
  }

  /**
   * Gets the module metadata
   */
  getModulesMeta(): ArchitectureModulesMeta {
      return this.meta;
  }

  /**
   * Creates a project with default data
   */
  makeProject(): ArchitectureProject<any> {
    return ProjectDetailsDefaultData();
  }

  /**
   * Gets the project
   */
  getProject(): ArchitectureProject<any> {
    return this.project;
  }

  /**
   * Sets the project based on the interface details
   * separation between required information and additional
   * information is enforced via the type
   */
  setProject(project: ArchitectureProject<any>): boolean {
    this.project.header.name = project.header.name;
    this.project.header.architecture = project.header.architecture;
    this.project.header.version = project.header.version;
    this.project.body.object = project.body.object;
    return false;    
  }

  /**
   * Returns a designer that can instantiate the designer
   * component that is necessary for the
   * application
   */
  getDesigner(): ArchitectureDesigner {
    return this.components.designer;
  }

  /**
   * Returns a visualiser that can instantiate the visualiser
   * component that is necessary for the
   * application
   */
  getVisualiser(): ArchitectureVisualiser {
    return this.components.visualiser;
  }

  /**
   * Returns a callgraph view that can instantiate the callgraph view
   * component that is necessary for the
   * application
   */
  getCallGraph(): ArchitectureCallGraph {
    return this.components.callgraph;
  }

  /**
   * Returns a serializer that can instantiate the serializer
   * component that is necessary for the
   * application
   */
  getSerializer(): ArchitectureSerializer<any> {
    return this.components.serializer;
  }

  /**
   * Creates extensions that may be used by other
   * components or shared components
   */
  getExtensions(): ArchitectureExtensions<any> {
    return this.components.extension;
  }

  /**
   * Manages the network/api endpoints outside of the global parts
   * Will have access to the websockets that will be given to it
   */
  getConnectionManager():ArchitectureConnectionManager {
    return this.components.netmanager;
  }

  /**
   * Gets the services of the application that are registered to the application
   */
  getServices(): Services {
    return this.services;
  }
  
}
