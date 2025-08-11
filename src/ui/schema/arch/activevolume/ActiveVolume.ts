import { NoServices, Services } from '../../../../service/Services.ts';
import { UnimplReturn } from '../../util/unimpl.ts';
import { ArchitectureCallGraph,
  ArchitectureConnectionManager,
  ArchitectureDesigner,
  ArchitectureExtensions,
  ArchitectureExtObj,
  ArchitectureFormatter,
  ArchitectureModulesMeta,
  ArchitectureObject,
  ArchitectureProject,
  ArchitectureSchema,
  ArchitectureSerializer,
  ArchitectureVisualiser } from '../ArchSchema.ts';
import { ActiveVolumeCallGraph } from './ActiveVolumeCallGraph.ts';
import { ActiveVolumeDesigner } from './ActiveVolumeDesigner.ts';
import { ActiveVolumeNetManager } from './ActiveVolumeNetwork.ts';
import { ActiveVolumeSerializer } from './ActiveVolumeSerializer.ts';
import { ActiveVolumeVisualiser } from './ActiveVolumeVisualiser.ts';


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

  identifier: string = "ActiveVolume";
  
  /**
   * Creates a noarch schema that can be style and outline when the application is
   * not ready
   */
  createArchitecture(_services: Services, _args: Map<string, string | number>): ArchitectureObject {
    return new ActiveVolumeObject();
  }
  
}

/**
 * Inplace for when there is no architecture ready
 * to be used, this would be when the user is still selecting
 */
export class ActiveVolumeObject implements ArchitectureObject<any, any> {


  meta: ArchitectureModulesMeta = new ArchitectureModulesMeta(
    ["Designer"],
    ["Designer"],
    [true],
    1
  )

  /**
   * Will return an error
   */
  getFormatter(): ArchitectureFormatter {
    return UnimplReturn<ArchitectureFormatter>();
  }
  
  // Holds the project information
  getProject(): ArchitectureProject<any> {
    return {
      header: {
        name: 'ActiveVolume',
        version: 'Invalid',
        author: 'You',
        architecture: 'ActiveVolume',
        description: 'Absolutely no architecture'
      },
      body: {
        object: {}
      },
      getProject: function() { return {...this}; },
      forFile: function() {
        return {...this};
      },
      forNetwork: function() {
        return {...this};
      }
    }
  }

  // Sets the project information
  setProject(_project: ArchitectureProject<any>): boolean {
    return false;    
  }

  /**
   * Makes the project based on defaults in getProject()
   */
  makeProject(): ArchitectureProject<any> {
    return {...this.getProject()}
  }
  
  // Get avaiable modules
  // TODO: Finish this method
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
  getServices(): Services {
    return new NoServices();
  }
}
