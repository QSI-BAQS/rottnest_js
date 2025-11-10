

// TASK: 23/10/2025 - Redid the endpoints here
// Make sure this is updated in the task list
// This is also happening in RottnestPy
// Along with its 
export const MSG_GLOBAL_MAP = {
	"arch_list": "rottnest.arch.list",
	"arch_get": "rottnest.arch.get",
	"arch_set": "rottnest.arch.set",
	"arch_get_config": "rottnest.arch.get_config",
	"arch_set_config": "rottnest.arch.set_config",
	"arch_save_config": "rottnest.arch.save_config",
	"process_list": "rottnest.prgs.process_list",
	"program_list": "rottnest.prgs.program_list",
	"program_get" : "rottnest.prgs.program_get",
	"program_get_current": "rottnest.prgs.get_current",
	"program_set_current" : "rottnest.prgs.set_current",	
	"program_get_config": "rottnest.prgs.get_config",
	"program_set_config": "rottnest.prgs.set_config",
	"program_save_config": "rottnest.prgs.save_config",
	"get_root_graph" : "rottnest.callgraph.get_root_graph",
	"get_graph" : "rottnest.callgraph.get_graph",
	"run_result": "rottnest.data.run_result",
	
}

export class MessageType {

  // Arch Symbol list
	static Arch = {
		GetList: "rottnest.arch.get_list",
		GetCurrent: "rottnest.arch.get_current",
		SetCurrent: "rottnest.arch.set_current",
		GetConfig: "rottnest.arch.get_config",
		SetConfig: "rottnest.arch.set_config",
		SaveConfig: "rottnest.arch.save_config",
		LoadConfig: "rottnest.arch.load_config",
	}
	 // Executable Symbol list
	static Executable = {
		GetList: "rottnest.executable.get_list",
		GetCurrent: "rottnest.executable.get_current",
		SetCurrent : "rottnest.executable.setcurrent",
		GetConfig: "rottnest.executable.getconfig",
		SetConfig: "rottnest.executable.setconfig",
		SaveConfig: "rottnest.executable.saveconfig",
		LoadConfig: "rottnest.executable.loadconfig",
	}
	 // Callgraph Symbol list
	static CallGraph = {
		GetRootGraph : "rottnest.callgraph.get_root_graph",
		GetGraph: "rottnest.callgraph.get_graph",
		RunGraphNode: "rottnest.callgraph.run_graph_node",
	}
	// Data Symbol list
	static Data = {
		RunResult: "rottnest.data.run_result",
	}
  // Layout Symbol list
  static Layout = {
  	Use: "rottnest.layout.run",
	}
  // Error Symbol list
  static Error: string = "rottnest.err";
}



