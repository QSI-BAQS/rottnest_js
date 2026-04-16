import { NetParserOperations } from "../../obj/CallGraphNet";
import { AppServiceMessage } from "../AppServiceMessage";
import { VisualiserPacketKind } from "../VisualiserProtocol";
// import { MessageType } from "../Protocol";


const VisualiserUnexpectedJSONError = "Unable to deserialize object received";
const VisualiserUnexpectedError = "Unable to select appropriate method";

/**
  * Hooks/Callbacks that are used within the call graph
  * classes to enable a clean interaction with the callgraph
  * instances
  */
export class VisualiserWebSocketHooks {

  parserOps = new NetParserOperations();
  internalMap = {
    [VisualiserPacketKind.GetVisualiserState]: this.getVisualiserStateHook,
    [VisualiserPacketKind.GetVisualiserObject]: this.getVisualiserObjectHook,
  }
  
  
  trigger(context: any, asm: AppServiceMessage) {
    const jsonObj = asm.getJSON();
    if(jsonObj) {
      const payload = jsonObj.payload;
      const subkind = payload.kind;
      const method = this.internalMap[subkind]
      if(method) {
        method(context, jsonObj, asm);
      } else {
        console.warn(VisualiserUnexpectedError);
      }
    } else {
      console.warn(VisualiserUnexpectedJSONError);
    }
  }

  getVisualiserStateHook(context: any, jsonObj: any, asm: AppServiceMessage) {
    // TODO: Need to handle state on the backend
    // appService.sendObj(MessageType.Visualiser.GetRootGraph, JSON.stringify({}))
  }
  

  getVisualiserObjectHook(context: any, jsonObj: any, asm: AppServiceMessage) {
    //TODO: Need to handle confirmation
  }
  
}
