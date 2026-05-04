import { NetParserOperations } from "../../obj/CallGraphNet";
import { AppServiceMessage } from "../AppServiceMessage";
import { VisualiserPacketKind } from "../VisualiserProtocol";
import { WebSocketHookDefault } from "./Common";
// import { MessageType } from "../Protocol";



/**
  * Hooks/Callbacks that are used within the call graph
  * classes to enable a clean interaction with the callgraph
  * instances
  */
export class VisualiserWebSocketHooks extends WebSocketHookDefault {

  parserOps = new NetParserOperations();
  internalMap =
  {
    [VisualiserPacketKind.GetVisualiserState]: this.getVisualiserStateHook,
    [VisualiserPacketKind.GetVisualiserObject]: this.getVisualiserObjectHook,
  }

  constructor() {
    super();
    this.setInternalMap({
      [VisualiserPacketKind.GetVisualiserState]: this.getVisualiserStateHook,
      [VisualiserPacketKind.GetVisualiserObject]: this.getVisualiserObjectHook,
    })
  
  }
  
  getVisualiserStateHook(context: any, jsonObj: any, asm: AppServiceMessage) {
    // TODO: Need to handle state on the backend
    // appService.sendObj(MessageType.Visualiser.GetRootGraph, JSON.stringify({}))
  }
  

  getVisualiserObjectHook(context: any, jsonObj: any, asm: AppServiceMessage) {
    //TODO: Need to handle confirmation
  }
  
}
