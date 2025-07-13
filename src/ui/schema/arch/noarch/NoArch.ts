import { NoServices, Services } from '../../../../service/Services.ts';
import { ArchitectureCallGraph,
  ArchitectureConnectionManager,
  ArchitectureDesigner,
  ArchitectureExtensions,
  ArchitectureObject,
  ArchitectureProject,
  ArchitectureSchema,
  ArchitectureSerializer,
  ArchitectureVisualiser } from '../ArchSchema.ts';
import { NoArchCallGraph } from './NoArchCallGraph.ts';
import { NoArchDesigner } from './NoArchDesigner.ts';
import { NoArchExtensions } from './NoArchExtensions.ts';
import { NoArchNetManager } from './NoArchNetwork.ts';
import { NoArchSerializer } from './NoArchSerializer.ts';
import { NoArchVisualiser } from './NoArchVisualiser.ts';


/**
 * NoArchSchema is for building a noarch object when there are
 * no architectures available
 */
export class NoArchSchema implements ArchitectureSchema {
  
  /**
   * Creates a noarch schema that can be style and outline when the application is
   * not ready
   */
  createArchitecture(_services: Services, _args: Map<string, string | number>): ArchitectureObject {
    return new NoArchObject();
  }
  
}

/**
 * Inplace for when there is no architecture ready
 * to be used, this would be when the user is still selecting
 */
export class NoArchObject implements ArchitectureObject<any, any> {
  
  // Holds the project information
  getProject(): ArchitectureProject<any> {
    return {
      name: 'NoArch',
      version: 'Invalid',
      arch: 'NoArch',
      object: {}
    }
  }

  // Sets the project information
  setProject(_project: ArchitectureProject<any>): boolean {
    return false;    
  }

  /**
   * Returns a designer that can instantiate the designer
   * component that is necessary for the
   * application
   */
  getDesigner(): ArchitectureDesigner {
    return new NoArchDesigner();
  }

  /**
   * Returns a visualiser that can instantiate the visualiser
   * component that is necessary for the
   * application
   */
  getVisualiser(): ArchitectureVisualiser {
    return new NoArchVisualiser();    
  }

  /**
   * Returns a callgraph view that can instantiate the callgraph view
   * component that is necessary for the
   * application
   */
  getCallGraph(): ArchitectureCallGraph {
    return new NoArchCallGraph();
  }

  /**
   * Returns a serializer that can instantiate the serializer
   * component that is necessary for the
   * application
   */
  getSerializer(): ArchitectureSerializer<any> {
    return new NoArchSerializer();
  }

  /**
   * Creates extensions that may be used by other
   * components or shared components
   */
  getExtensions(): ArchitectureExtensions<any> {
    return new NoArchExtensions();
  }

  /**
   * Manages the network/api endpoints outside of the global parts
   * Will have access to the websockets that will be given to it
   */
  getConnectionManager(): ArchitectureConnectionManager {
    return new NoArchNetManager(this);
  }

  /**
   * Gets access to the application's services
   */
  getServices(): Services {
    return new NoServices();
  }
}
