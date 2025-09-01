import { NoServices, ServicesHolder } from '../../../../service/Services.ts';
import { UnimplReturn } from '../../util/unimpl.ts';
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
import { NoArchCallGraph } from './NoArchCallGraph.ts';
import { NoArchDesigner } from './NoArchDesigner.ts';
import { NoArchExtensions } from './NoArchExtensions.ts';
import { NoArchNetManager } from './NoArchNetwork.ts';
import { NoArchSerializer } from './NoArchSerializer.ts';
import { NoArchVisualiser } from './NoArchVisualiser.ts';
import { NoArchProjectForm } from './ui/ProjectForm.tsx';


/**
 * NoArchSchema is for building a noarch object when there are
 * no architectures available
 */
export class NoArchSchema implements ArchitectureSchema {

  name: string = "NoArch";


  
  /**
   * Creates a noarch schema that can be style and outline when the application is
   * not ready
   */
  createArchitecture(services: ServicesHolder = new NoServices(), _args?: Map<string, string | number>): ArchitectureObject<any, any> {
    let noarch = new NoArchObject(services);
    return noarch;
  }
  
}

/**
 * Inplace for when there is no architecture ready
 * to be used, this would be when the user is still selecting
 */
export class NoArchObject implements ArchitectureObject<any, any> {

  services: ServicesHolder;  

  getProjectSettingsForm() {
    return NoArchProjectForm;
  }


  meta: ArchitectureModulesMeta = new ArchitectureModulesMeta(
    ["Designer"],
    ["Designer"],
    [true],
    1
  )

  constructor(services: ServicesHolder) {
    this.services = services;
  }

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
        name: 'NoArch',
        version: 'Invalid',
        author: 'You',
        architecture: 'NoArch',
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
  getServices(): ServicesHolder {
    return this.services;
  }
}
