
import { ArchitectureCallGraph,
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
import { LatticeSerializer } from './io/LatticeSerializer.ts';

/**
 * Schema object, typically only one instance which is used to
 * construct architectures (template class)
 */
export class Lattice2DSchema implements ArchitectureSchema {

  createArchitecture(args: Map<string, string | number>): ArchitectureObject {
    return new Lattice2DArchitecture(args);
  }
  
}

/**
 * The Lattice2DArchitecture object that will be a facade object
 * that RottnestContainer will use.
 */
export class Lattice2DArchitecture implements ArchitectureObject<any> {

  components = {
    designer: new LatticeDesigner(),
    serializer: new LatticeSerializer(),
    visualiser: new LatticeVisualiser(),
    callgraph: new LatticeCallGraphState(),
    extension: new LatticeExtensionMap()
  }

  project = {
    name: 'untitled',
    version: '0.1',
    arch: '1',
    object: {}
  }

  constructor(_args: Map<string, string | number>) {
    
  }

  // Holds the project information
  getProject(): ArchitectureProject<any> {
    return this.project;
  }

  // Sets the project information
  setProject(_project: ArchitectureProject<any>): boolean {

    return false;    
  }
  
  getDesigner(): ArchitectureDesigner {
    return this.components.designer;
  }

  getVisualiser(): ArchitectureVisualiser {
    return this.components.visualiser;
  }

  getCallGraph(): ArchitectureCallGraph {
    return this.components.callgraph;
  }

  getSerializer(): ArchitectureSerializer<any> {
    return this.components.serializer;
  }

  getExtensions(): ArchitectureExtensions<any> {
    return this.components.extension;
  }
  
}
