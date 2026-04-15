
import { MouseEvent, Component } from "react";
import styles from '../../styles/NotifyView.module.css';
import { CloseOutlined } from "@ant-design/icons";

/**
 * Notification message
 */
export type NotifyMessage = {
  header: string
  body: string
  mid?: string
}

/**
 * Notification queue, it allows for utilisation of the
 * 
 */
export class NotifyQueue {

  messageQueue: Array<NotifyMessage> = []

  /**
   * Enqueues a message in the queue
   */
  enqueueMessage(msg: NotifyMessage) {
    this.messageQueue.push(msg);
  }

  /**
   * Dequeues a mesasge
   */
  dequeueMessage(): NotifyMessage | null {
    const msg = this.messageQueue.shift();
    if(msg) {
      return msg;
    } else {
      return null;
    }
  }

  /**
   * Creates a proxy object for the dequeued
   * message
   */
  dequeueProxy() {
    const queue = this;
    const m = this.dequeueMessage();
    if(m === null) { return null }
    else {
      return new NotifyMessageViewProxy(queue, m);
    }
  }

  /**
   * Checks to see if the queue is empty
   */
  isEmpty() {
    return this.messageQueue.length === 0;
  }

}

/**
 * State ifnormation for message space
 */
export type NotifySpaceData = {
  activeView: NotifyMessageViewProxy | null
}

/**
 * Properties for the message space
 */
export type NotifyQueueProps = {
  queue: NotifyQueue
}

/**
 * A component which space occupies a portion of the screen
 * to deliver messages to the user
 */
export class NotifyMessageSpace extends Component<NotifyQueueProps, NotifySpaceData> {

  state:NotifySpaceData = {
    activeView: null,
  };

  timer: ReturnType<typeof setTimeout> | null = null;
  
  checkQueueAndPop() {
    
    const av = this.state.activeView;
    const queue = this.props.queue;
    if(av === null) {
      if(!queue.isEmpty()) {
        const nstate = {...this.state};
        const ref = this;
        const newMsgProxy = queue.dequeueProxy();
        
        if(nstate.activeView === null) {
          nstate.activeView = newMsgProxy;
          nstate.activeView?.attachDeactivate(() => {
            const bstate = {...ref.state};
            bstate.activeView = null;
            ref.setState(bstate);
          })
          
        } else if(nstate.activeView.message.mid === undefined ||
          nstate.activeView.message.mid !== newMsgProxy?.message.mid) {
          nstate.activeView = newMsgProxy;
          nstate.activeView?.attachDeactivate(() => {
            const bstate = {...ref.state};
            bstate.activeView = null;
            ref.setState(bstate);
          })
        }
        this.setState(nstate);
        
      }
    }
  }

  /**
   * On mount, it will check and see if it is to get the next message
   */
  componentDidMount(): void {
    this.checkQueueAndPop()
  }

  /**
   * On update, it will check and see if it is to get a the next message
   */
  componentDidUpdate(): void {
    this.checkQueueAndPop()
  }

  render() {
    const av = this.state.activeView;
    if(av !== null) {
      const view = av.getElement();
      return (<>{view}</>);
    } else {
      return <></>
    }
  }
}


export class NotifyMessageViewProxy {

  queue: NotifyQueue;
  message: NotifyMessage
  finished: boolean = false;
  finFn: () => void = () => {}

  constructor(queue: NotifyQueue, message: NotifyMessage) {
    this.queue = queue;
    this.message = message;
    this.finished = false;
    this.finFn = () => {};
  }

  setFinished() {
    this.finished;
    this.finFn();
  }

  isFinished() {
    return this.finished;
  }

  attachDeactivate(fn: () => void) {
    this.finFn = fn;
  }

  getElement() {
    const proxy = this;
    const message = this.message;
    const finFn = this.finFn;
    return <NotifyMessageView proxy={proxy} message={message} deactivate={finFn} />
  }
}

export type NotifyViewProps = {
  proxy: NotifyMessageViewProxy
  message: NotifyMessage
  deactivate: () => void
}

export type NotifyViewState = {
  toShow: boolean,
  isFocusedOn: boolean,
  timedOut: boolean
}

/**
 * MessageView, component that will outline the notification
 * that has been given to it
 */
export class NotifyMessageView extends Component<NotifyViewProps, NotifyViewState> {

  static TimeOutMillis = 2200;

  state: NotifyViewState = {
    toShow: true,
    isFocusedOn: false,
    timedOut: false
  }

  timer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Gives the notification a lifetime
   * It will disappear unless focused on
   */
  timeAndRemove() {
    const ref = this;
    if(this.timer === null) {
      this.timer = setTimeout(() => {
        if(!ref.state.isFocusedOn) {
          const nstate = {...ref.state};
          ref.state.toShow = false;
          ref.setState(nstate);
          ref.props.proxy.setFinished();
          ref.props.deactivate();
        } else {
          ref.state.timedOut = true;
        }
      }, NotifyMessageView.TimeOutMillis);
    }
  }

  componentDidMount(): void {
    this.timeAndRemove();
  }
  
  componentWillUnmount() {
    if(this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  render() {
    const proxy = this.props.proxy;
    const hmsg = this.props.message.header;
    const bmsg = this.props.message.body;
    //const toShow = this.state.toShow;
    const deactivate = this.props.deactivate;
    const ref = this;
  
    const toClose = (_e: MouseEvent<HTMLButtonElement>) => {
      proxy.setFinished();
      deactivate()
    }

    // It will hold the element
    const onHover = (_e: MouseEvent<HTMLDivElement>) => {
      ref.state.isFocusedOn = true;
    }

    // If a mouse is hoving it will stay alive until the mouse leaves
    const onLeave = (_e: MouseEvent<HTMLDivElement>) => {
      ref.state.isFocusedOn = false;
      if(ref.state.timedOut) {
        ref.props.proxy.setFinished();
        ref.props.deactivate();
      }
    }

    return (
      <div className={styles.messageView} onMouseOver={onHover} onMouseLeave={onLeave}>
        <header className={styles.messageViewHeader}>
          {hmsg}
          <button className={styles.messageViewExit} onClick={toClose}><CloseOutlined /></button>
        </header>
        <section className={styles.messageViewBody}>{bmsg}</section>
      </div>)
  }
  
}
