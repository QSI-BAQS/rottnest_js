import { NetParserOperations, RottStatusResponseMSG } from "../../obj/CallGraphNet";
import { AppServiceMessage } from "../AppServiceMessage";
import { MessageType } from "../Protocol";


const CallGraphUnexpectedJSONError = "Unable to deserialize object received";
const CallGraphUnexpectedError = "Unable to select appropriate method";

/**
  * Hooks/Callbacks that are used within the call graph
  * classes to enable a clean interaction with the callgraph
  * instances
  */
export class CallGraphWebSocketHooks {

  parserOps = new NetParserOperations();
  internalMap = {
    [MessageType.Arch.GetList]: this.graphNotReadyHook,
    [MessageType.Arch.GetCurrent]: this.graphNotReadyHook,
    [MessageType.Arch.GetConfig]: this.graphNotReadyHook,
    [MessageType.Arch.SetConfig]: this.graphNotReadyHook,
    [MessageType.Arch.SetCurrent]: this.graphNotReadyHook,
    [MessageType.Arch.SaveConfig]: this.graphNotReadyHook,
    [MessageType.Arch.GetConfig]: this.graphNotReadyHook,
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
        console.warn(CallGraphUnexpectedError);
      }
    } else {
      console.warn(CallGraphUnexpectedJSONError);
    }
  }
}
