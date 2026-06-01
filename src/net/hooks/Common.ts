import { NetParserOperations } from "../../obj/CallGraphNet";
import { AppServiceMessage } from "../AppServiceMessage";


const WebHookUnexpectedJSONError = "Unable to deserialize object received";
const WebHookUnexpectedError = "Unable to select appropriate method";

export type WebSocketHookCallback = (context: any, jsonObj: any,
   asm: AppServiceMessage) => void;
export type WebSocketHookInternalMap = { [key: string]: WebSocketHookCallback; };

/**
 * WebSocketHookObject - Used to construct an abstraction
 * for the websocket itself
 */
export interface WebSocketHookObject {
  trigger(context: any, asm: AppServiceMessage): void;  
}

/**
 * WebSocketHookDefault
 * This is used to create a simple template
 * for the hooks used within the hooks folder
 */
export class WebSocketHookDefault implements WebSocketHookObject  {
  
  parserOps = new NetParserOperations();
  internalMap: WebSocketHookInternalMap = {};

  constructor() {
    this.parserOps = new NetParserOperations();
    this.internalMap = {};
  }

  MakeHookWrapper(ctxObj: any, hookName: string) {
    return (
      context: any,
      jsonObj: any,
      asm: AppServiceMessage) => {
      ctxObj[hookName](context, jsonObj, asm);
    }

  }

  /**
   * Gets the parser operations field
   */
  getParserOps() {
    return this.parserOps;
  }

  /**
   * Sets the internal map that is used within
   * hook itself
   */
  setInternalMap(internalMap: WebSocketHookInternalMap) {
    this.internalMap = internalMap;
  }

  /**
   * No Response, this is used as a default for internal map responses that could
   * be received
   */
  noResponse(_context: any, _jsonObj: any, _asm: AppServiceMessage) {
    //NO-OP
  }

  /**
   * Evaluator of the logic itself - it will make a decision
   * on what object to utilise in this case
   */
  trigger(context: any, asm: AppServiceMessage) {
    const jsonObj = asm.getJSON();
    if(jsonObj) {
      const payload = jsonObj.payload;
      const subkind = payload.kind;
      const method = this.internalMap[subkind]
      if(method) {
        method(context, jsonObj, asm);
      } else {
        console.warn(WebHookUnexpectedError);
      }
    } else {
      console.warn(WebHookUnexpectedJSONError);
    }
  }
}
