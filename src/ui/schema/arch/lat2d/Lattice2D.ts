
import { ArchitectureCallGraph,
  ArchitectureConnectionManager,
  ArchitectureDesigner,
  ArchitectureExtensions,
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
  project = {
    name: 'untitled',
    version: '0.1',
    arch: '1',
    object: {}
  }

  /**
   * Constructor for the Lattice2DArchitecture with its abstraction
   * Will leverage an argument map
   */
  constructor(services: Services, _args: Map<string, string | number>) {
    this.services = services;
     //TODO: Finish this constructor for lattice2d 
  }

  // Holds the project information
  getProject(): ArchitectureProject<any> {
    return this.project;
  }

  // Sets the project information
  // TODO: Still need to finish this
  setProject(_project: ArchitectureProject<any>): boolean {

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
