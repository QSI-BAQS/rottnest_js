import { RottStatusResponseMSG } from "../../obj/CallGraphNet";
import { NotifyID } from "../../service/NotifyService";
import { CallGraphRequestState } from "../../ui/callgraph/CallGraphDefaults";
import { BufferMapKey } from "../../ui/workspace/buffermap/BufferMapCommon";
import { AppServiceMessage } from "../AppServiceMessage";
import { CallGraphPacketKind } from "../CallGraphProtocol";
import { MessageType } from "../Protocol";
import { WebSocketHookDefault } from "./Common";

/**
  * Hooks/Callbacks that are used within the call graph
  * classes to enable a clean interaction with the callgraph
  * instances
  */
export class CallGraphWebSocketHooks extends WebSocketHookDefault {

  constructor() {
  	super();
  	this.setInternalMap(
		  {
		    [CallGraphPacketKind.GraphUnavailable]: super.MakeHookWrapper(this, 'getGraphUnavailable'),
		    [CallGraphPacketKind.GraphNotReady]: super.MakeHookWrapper(this, 'graphNotReadyHook'),
		    [CallGraphPacketKind.RootGraph]: super.MakeHookWrapper(this, 'getRootGraphHook'),
		    [CallGraphPacketKind.Graph]: super.MakeHookWrapper(this, 'getGraphHook'),
		    [CallGraphPacketKind.GetGraphConfirmation]: super.MakeHookWrapper(this,
		    		'getGraphConfirmationHook'),
		    [CallGraphPacketKind.Node]: super.MakeHookWrapper(this, 'getNodeStatusHook'),
		    [CallGraphPacketKind.RunNodeConfirmation]: super.MakeHookWrapper(this, 'runNodeHook'),
		    [CallGraphPacketKind.VisualObject]: super.MakeHookWrapper(this, 'visualObjectHook'),
				[MessageType.CallGraph.RunGraphNode]:
					super.MakeHookWrapper(this, 'getRunGraphNode'),
		  }
  	)
  }

	/**
	  * Requests Root Graph
	  * Will attempt to request the root graph
	  */
  requestRootGraph(context: any) {
    const cgspace = context;
    const container = cgspace.props.wdaggr;
    const appService = container.getServices().getNetworkService();

    appService.sendObj(MessageType.CallGraph.GetRootGraph, JSON.stringify({}))
  }

  /**
    * Gets the run graph node as a response
    * Will make a notification and refresh the context
    */
  getRunGraphNode(context: any, _jsonObj: any, _asm: AppServiceMessage) {
  	
    const container = context.props.architecture;
    const notifyService = container.getServices().getNotifyService();

    notifyService.makeMessageWithTuple(NotifyID.CallGraph.RunGraphNodeConfirm);
    
  }
  
	/**
	  * getGraphConfirmationHook
	  * - noResposne occurs here for now
	  */
  getGraphConfirmationHook(_context: any, _jsonObj: any, _asm: AppServiceMessage) {
  	super.noResponse(_context, _jsonObj, _asm);
  }

	/**
	 * Outlines if the graph is unavailable for the context given
	 */
	getGraphUnavailable(context: any, jsonObj: any, _asm: AppServiceMessage) {
		const graphConfirmKind = jsonObj.payload.kind;
    if(graphConfirmKind === "GraphUnavailable") {
    	context.setRequestState(CallGraphRequestState.Unavailable);
    }
	}

  /**
   * getRootGraphHook - Gets the root graph
   */
  getRootGraphHook(context: any, _jsonObj: any, asm: AppServiceMessage) {
    const parserOps = super.getParserOps();
    const cgspace = context;
    const container = context.props.architecture;
    const notifyService = container.getServices().getNotifyService();
    
		let graph = parserOps.decodeGraph(asm);
		let expands = true;

		cgspace.props.stash.insert('cgviz_chart_gid_data',
				JSON.stringify({ expands, }));

		cgspace.props.stash.insert('node_column',
				JSON.stringify(0));

		if(graph) {
			container.getServices()
				.getCallGraphService()
				.setGraphViewData(graph);
		}

		notifyService.makeMessageWithTuple(NotifyID.CallGraph.GetRootGraphReceived);
		
		cgspace.resetState();
		const nState = {...cgspace.state}
		nState.refresh = true;
		cgspace.setState(nState);

  }

	/**
	  * 
	  *
	  */
  getGraphHook(context: any, _jsonObj: any, asm: AppServiceMessage) {
		const cgspace = context;
    const container = context.props.architecture;
    const notifyService = container.getServices().getNotifyService();
		let parserOps = super.getParserOps()
		let graph = parserOps.decodeGraph(asm);
		let expands = true;
		let expGid = 'invalid';

		if(graph) {
			container.getServices()
				.getCallGraphService()
				.setGraphViewData(graph);

			if(graph.graph) {
				let sz = graph.graph.size;
				if(sz) {	
					if(sz === 1) {
						const e = graph.graph.
						values().map((et: any) => {
							return et;
						}).toArray()[0];
						expands = e.expands;
						expGid = e.id;
					}	
					
				}

			}
		}
		cgspace.props.stash.insert('node_column',
				JSON.stringify(0));
		cgspace.props.stash.insert('cgviz_chart_gid_data',JSON.stringify({
				expands,
				gid: expGid,
				idx: expGid
			}));
	
		let refresh = container.getServices().getRefreshService();
		cgspace.resetState();
		const nState = {...cgspace.state}
		nState.refresh = true;
		context.setRequestState(CallGraphRequestState.Available);

		notifyService.makeMessageWithTuple(NotifyID.CallGraph.GetGraphReceived);
		refresh.triggerRefresh();    
		
  }

  graphNotReadyHook(context: any, jsonObj: any, _asm: AppServiceMessage) {
    // TODO: Need to finish ready hook
		const graphConfirmKind = jsonObj.payload.kind;
    if(graphConfirmKind === "GraphNotReady") {
    	context.setRequestState(CallGraphRequestState.Fetching);
    }
  }

  visualObjectHook(context: any, jsonObj: any, _asm: AppServiceMessage) {
  	// TODO: Need to handle the visual object case
  	// NOTE: We have the data and we can then set it!
  	const stash = context.props.stash;
  	const workspaceArch = context.props.architecture;
		const services = workspaceArch.getServices();
		const refreshService = services.getRefreshService();
		const notifyService = services.getNotifyService();
		
  	const visobj = jsonObj.payload.result;
  	const obj = {
  		simready:true,
  		runready:true,
  		runrequested:true,
  		runfinished:true
  	};

  	const parsedObj = JSON.stringify(visobj);
		stash.insert(BufferMapKey.Visualiser.SimData, JSON.stringify(obj));
  	stash.insert(BufferMapKey.Visualiser.CurrentData, parsedObj);

  	workspaceArch.getStateData()
  		.getVisState()
  		.setVizData(visobj);
		let modMeta = workspaceArch.getModulesMeta();
		modMeta.setEnable("Visualiser");

		notifyService.makeMessageWithTuple(NotifyID.CallGraph.RunGraphNodeConfirm);

		refreshService.triggerRefresh();
  	
	}

  runNodeHook(context: any, jsonObj: any, _asm: AppServiceMessage) {
    const cgspace = context;
    const container = cgspace.props.architecture;
		let rrBuf = container.getServices().getRunResultService();
		//A lot of heavy lifting done with this
		//to address a terrible messaging system
		const [rkind, mdat] = rrBuf.decodeAndSort(jsonObj
							  .payload);
		let shouldUpdate = false;
		//TODO: This is bloody nasty!
		// WARNING: You are dealing with something quite gross here!
		let modMeta = container.getModulesMeta();
		modMeta.setEnable("Visualiser");
		// if(rkind === "CUIDObj" || rkind === "CUIDTotal") {
		// 	modMeta.setEnable("RunChart");
		// 	shouldUpdate = true;
		// }
			
		if(rkind === "VisualResult") {
			container.getStateData()
				.getVisState()
				.setVizData(mdat);
			modMeta.setEnable("Visualiser");
			cgspace.props.stash.insert('viz_sim_data', JSON.stringify({
					simready: true }));
			shouldUpdate = true;
		}

		if(shouldUpdate) {
			container.getServices()
			  .getRefreshService()
			  .triggerRefresh();
		}


  }


  getNodeStatusHook(context: any, _jsonObj: any, asm: AppServiceMessage) {
    const cgspace = context;
		const containerMsg = new RottStatusResponseMSG();
		const rData = asm.parseDataTo(containerMsg);
		if(rData) {
			const cuData = rData
				.curesult;
			cgspace.state.cunitMap	
				.set(cuData.cu_id,
				     cuData);
			cgspace.props.stash
			.insert('node_column',
				JSON
				.stringify(cuData));
				const nState 
				= {...cgspace.state}
			cgspace.setState(nState);
    }
  }
  
}
