
import { ArchitectureCallGraph,
  ArchitectureConnectionManager,
  ArchitectureDesigner,
  ArchitectureExtensions,
  ArchitectureModulesMeta,
  ArchitectureObject,
  ArchitectureProject,
  ArchitectureSchema,
  ArchitectureSerializer,
  ArchitectureVisualiser } from '../ArchSchema.ts';

import { LatticeCallGraphState } from './LatticeCallGraph.ts';
import { LatticeDesigner } from './LatticeDesign.ts';
import { LatticeExtensionMap } from './LatticeExtension.ts';
import { LatticeVisualiser } from './LatticeVisualiser.ts';
import { LatticeNetManager } from './LatticeNetManager.ts';
import { LatticeSerializer } from './io/LatticeSerializer.ts';
import { Services } from '../../../../service/Services.ts';
import { RegionDataList } from './obj/RegionDataList.ts';
import { ProjectDetailsDefaultData, ProjectDump } from './obj/Project.ts';

/**
 * Schema object, typically only one instance which is used to
 * construct architectures (template class)
 */
export class Lattice2DSchema implements ArchitectureSchema {

  /**
   * Creates an architecture object that can be used by
   * application
   */
  createArchitecture(services: Services, args: Map<string, string | number>): ArchitectureObject {
    return new Lattice2DArchitecture(services, args);
  }
  
}

/**
 * The Lattice2DArchitecture object that will be a facade object
 * that RottnestContainer will use.
 */
export class Lattice2DArchitecture implements ArchitectureObject<RegionDataList, any> {

  services: Services;
  components = {
    designer: new LatticeDesigner(),
    serializer: new LatticeSerializer(),
    visualiser: new LatticeVisualiser(),
    callgraph: new LatticeCallGraphState(),
    extension: new LatticeExtensionMap(),
    netmanager: new LatticeNetManager(this),
  }

  // Project Defaults
  project: ProjectDump = ProjectDetailsDefaultData()

  // Meta data, keeps track of what is active
  meta: ArchitectureModulesMeta = {
        modules: ["Designer", "Visualiser", "CallGraph"],
        available: ["Designer"],
        availability: [true, false, false],
        count: 3
  }

  /**
   * Constructor for the Lattice2DArchitecture with its abstraction
   * Will leverage an argument map
   */
  constructor(services: Services, _args: Map<string, string | number>) {
    this.services = services;
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
