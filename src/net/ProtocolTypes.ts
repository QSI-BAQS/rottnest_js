import { AppServiceClient } from "./AppService"



/**
 * ProtocolOperation that will respond when there is a particular
 * message kind
 */
export type ProtocolOperation<T> = {
  pkey: string
  response: (as: AppServiceClient, ctx: T, m: any) => void
}


/**
 * ProtocolSet is the naming of the plugin scheme
 * that is to be used
 */
export type AppProtocolSet<T> = {
  [key: string | symbol]: ProtocolOperation<T>
}
