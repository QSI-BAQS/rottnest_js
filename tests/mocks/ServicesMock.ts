import { ServicesHolder } from "rottnest-plugin/schema/ServicesHolder";


export type NetworkServiceMock = NetworkService;
export class NetworkService {

  getNetworkService() {
    return this;
  }

  isConnected() {
    return false;
  }

  registerReciverKinds(...data: any) {
    
  }
}

export type RefreshServiceMock = RefreshService;

export class RefreshService {
  triggerRefresh() {
    //NO-OP
  } 
}

export class ServicesMock implements ServicesHolder {

  constructor() {
    //NO-OP
  }
  
  getRefreshService() {
    return new RefreshService() as ReturnType<typeof this.getRefreshService>
  }

  getNotifyService() {
    
    throw new Error();
    return {} as ReturnType<typeof this.getNotifyService>
  }

  getNetworkService() {
    
    return new NetworkService() as ReturnType<typeof this.getNotifyService>
  }

  getInputService() {
    
    throw new Error();
    return {} as ReturnType<typeof this.getInputService>
  }

  getHelpService() {
    
    throw new Error();
    return {} as ReturnType<typeof this.getHelpService>
  }

  getProgramPluginService() {
    
    throw new Error();
    return {} as ReturnType<typeof this.getProgramPluginService>
  }

  getArchPluginService() {
    
    throw new Error();
    return {} as ReturnType<typeof this.getArchPluginService>
  }

  getValidationService() {
     
    throw new Error();
    return {} as ReturnType<typeof this.getValidationService>
  }

  getRunResultService() {
    
    throw new Error();
    return {} as ReturnType<typeof this.getRunResultService>
  }

  getZoomService() {
    
    throw new Error();
    return {} as ReturnType<typeof this.getZoomService>
  }

  getComponentService() {
    
    throw new Error();
    return {} as ReturnType<typeof this.getComponentService>
  }

  getStyleService() {
    
    throw new Error();
    return {} as ReturnType<typeof this.getStyleService>

  }

  getServices() {    
    return this as ReturnType<typeof this.getServices>
  }
}

