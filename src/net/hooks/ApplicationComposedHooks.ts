import { ArchitectureWebSocketHooks } from "./ArchitectureHooks";
import { WebSocketHookDefault, WebSocketHookInternalMap } from "./Common";
import { ExecutableWebSocketHooks } from "./ExecutableHooks";
import { VisualiserWebSocketHooks } from "./VisualiserHooks";


/**
  * It will build up hooks into a larger array
  * that will replace the internal map
  */
export class HooksComposerBuilder {

  internalMap: WebSocketHookInternalMap = {};

  /**
    * Append hooks
    * It will retrieve the hooks from an existing object
    * and return the builder object
    */
  appendHooks(hooks: WebSocketHookDefault) {

    const hkeyMap = hooks.getInternalMap();

    for(const hkey in hkeyMap) {
      const hkeyStr = hkey as string;
      const hookRef = hkeyMap[hkeyStr];
      this.internalMap[hkeyStr] = hookRef;
    }

    return this;
  }

  /**
    * Builds the composer builder
    */
  build() {
    return this.internalMap;
  }
  
}


/**
  * ApplicationComposedHooks
  * Enables a 
  */
export class ApplicationComposedHooks extends WebSocketHookDefault {

  constructor() {
    super();
    this.setInternalMap(new HooksComposerBuilder()
      .appendHooks(new ArchitectureWebSocketHooks())
      .appendHooks(new ExecutableWebSocketHooks())
      .appendHooks(new VisualiserWebSocketHooks())
      .build());
  }

  
}
