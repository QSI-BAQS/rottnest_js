


/**
 * CURRENT WIP, Protocol is currently not
 * settled, for testing purposes, we will
 * have a remap component to minimise excessive
 * changes
 */
export const MSG_REMAP = {
	"subtype": "arch_lat2d_get_subtypes",
	"get_router": "arch_lat2d_get_router",
	"use_arch": "arch_lat2d_use",
	"run_result": "arch_lat2d_run_result",
	"get_args" : "arch_lat2d_get_args",
	"err": "err",
}

/**
 * Global Map as we are currently developing
 * a proper set of message types
 */
// export const MSG_GLOBAL_MAP = {
// 	"arch_list": "arch_meta_arch_list",
// 	"arch_get": "arch_meta_arch_get",
// 	"arch_get_config": "arch_meta_arch_get_config",
// 	"arch_set_config": "arch_meta_arch_set_config",
// 	"arch_save_config": "arch_meta_arch_save_config",
// 	"process_list": "prgs_process_list",
// 	"program_list": "prgs_program_list",
// 	"program_get" : "prgs_program_get",
// 	"program_get_current": "prgs_program_get_current",
// 	"program_set_current" : "prgs_program_set_current",	
// 	"program_get_config": "prgs_program_get_config",
// 	"program_set_config": "prgs_program_set_config",
// 	"program_save_config": "prgs_program_save_config",
// 	"get_root_graph" : "callgraph_get_root_graph",
// 	"get_graph" : "callgraph_get_graph",
// }

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
