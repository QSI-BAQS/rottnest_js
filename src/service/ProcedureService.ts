import { MessageType } from "../net/Protocol";
import { NetworkService } from "./NetworkService";


/**
  * ProrcedureData
  * Has the id current stage and
  * the state information and starttime to outline
  */
export type ProcedureData = {
  id: number,
  currentstage: string,
  state: string,
  starttime: number,
}

/**
  * ProcedureCommandActionData
  * This object is used for particular actions
  * that may occur on the procedure being handled
  */
export type ProcedureCommandActionData = {
  procedureid?: number
  extra?: any
};

/**
  * ProcedureData
  * The procedure data batch from the server
  */
export type ProcedureDataBatch = {
  procedures: Array<ProcedureData>,
}

/**
  * Procedure command which the frontend
  * will issue to manage the procedure and what it is currently doing
  */
export const ProcedureCommand = {
  Pause: "pause",
  Cancel: "cancel",
  Kill: "kill",
  Status: "status",
  Command: "command",
};


/**
  * Command that is sent to the procedure manager
  * that is on the backend that will
  * operate using the procedure manager
  */
export type ProcedureCommandData = {
  action: string,
  data: any,
}

/**
  * ProcedureService 
  * This is used to interact with procedures on the server
  * that you can cancel and operate on
  */
export class ProcedureService {

  networkService: NetworkService;

  /**
    * Constructor for the procedure service
    * 
    */
  constructor(networkService: NetworkService) {
    this.networkService = networkService;
  }

  /**
    * command
    * Sends the command to the backend
    */
  command(cmdData: ProcedureCommandData, networkService: NetworkService) {
    const client = networkService.getNetworkService();
    client.sendObject(MessageType.Procedure.Command, cmdData);
  }

  /**
    * Gets the procedure state
    * The details should involve the state, procedure name, procedure id
    */
  getProcedure(id: number, networkService: NetworkService) {
    const data = {
      action: ProcedureCommand.Cancel,
      data: {
        
      }
    };

    this.command(data, networkService);
  }

  /**
    * Gets the list of all the procedures
    * It will be procedures and the details in it
    */
  getProcedures() {

    this.command()
  }

  /**
    * Gets the stages of the procedure
    * stages and knowing what it will go through
    */
  getProcedureStages() {
    
  }

  /**
    * Pauses the procedure using its id
    * It will be used to halt and control the operation
    */
  pauseProcedure(_id: number) {
    throw new Error("NotImplemented");
  }

  /**
    * Cancels the procedure using its
    * id. This is to control the procedure state itself
    */
  cancelProcedure(_id: number) {
    
  }
  
}
