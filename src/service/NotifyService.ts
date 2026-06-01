import { NotifyQueue, NotifyMessage } from "../ui/global/notify/NotifyMessage";

export type NotifyTuple = {
  ID: string,
  title: string,
  message: string
}


export const NotifyID = {
  ArchUnavailable: {
    ID: "arch-unavailable",
    title: "Unavailable",
    message: "Architectures are unavailable" },
  ZoomInUnavailable: "zoom-in-unavailable",
  ZoomOutUnavailable: "zoom-out-unavailable",
  Executable: {
    SetCurrent: {
      ID: "prg-set",
      title: "Program Set",
      message: "Program has been set"
    },
    ListUnavailable: {
      ID: "prg-set-unavailable",
      title: "Executables Unavailable",
      message: "Current not accessible at this time"
    },
    GetCurrent: {
      ID: "prg-set",
      title: "Program Set",
      message: "Retrieved the current executable from the server"
    }
  },
  ProjectIO: {
    LoadError: {
       ID: "load-err",
       title: "Load Operation",
       message: "The file did not deserialize correctly" 
    },
    LoadSuccess: {
       ID: "load-good",
       title: "Load Operation",
       message: "The file has been loaded" 
    }
    
  }
}


/**
 * NotifyService, this acts as a wrapper on the NotifyQueue
 */
export class NotifyService {
  _notifyQueue: NotifyQueue = new NotifyQueue();

  /**
   * Constructs the notify queue, simple wrapper that
   * doesn't require much more than that
   */
  constructor() {
    this._notifyQueue = new NotifyQueue();
  }

  /**
   * Gets the notify queue
   */
  getNotifyQueue() {
    return this._notifyQueue;
  }

  /**
   * Enqueues a message to be consumed and utilised
   * by other components
   */
  makeNotification(msg: NotifyMessage) {
  	this._notifyQueue.enqueueMessage(msg);
  }

  /**
   * Format for constructing messages to send to the service
   */
  makeMessage(title: string, content: string) {
    const msg = {
      header: title,
      body: content
    }
    this.makeNotification(msg);
  }
  
  /**
   * Format for constructing messages to send to the service
   * mid is to show that the notification has already been sent and
   * to not duplicate it
   */
  makeMessageWithId(mid: string, title: string, content: string) {
    
    const msg = {
      mid,
      header: title,
      body: content
    };
    if(!this._notifyQueue.messageQueue.find((e: NotifyMessage) => e.mid === mid)) {
      this.makeNotification(msg);
    }
    
  }
}
