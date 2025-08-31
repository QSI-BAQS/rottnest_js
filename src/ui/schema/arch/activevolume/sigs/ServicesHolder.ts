import { CGResult, CUResultMixed } from "../obj/CallGraph.ts";
import { AppServiceClient } from "./exported.ts";
import { RunChartContainer } from "./runchart/RunChart.tsx";

/**
 * Service Declarations
 */
declare class RefreshService{
 triggerRefresh(): void;
};
declare class NotifyService{};
declare class NetworkService{
 getNetworkService(): AppServiceClient;
 
};
declare class InputHookService{};
declare class HelpService{};
declare class ProgramPluginService{};
declare class ArchPluginService{};
declare class ValidationService{};

declare class RunResultService{
 checkIfRequested(idx: string): boolean;

 checkIfFinished(idx: string): boolean;

 decodeAndSort(jsonObj: any): [string, any]

 getTotalArray(): Array<CGResult>;
 getEndComp(): Array<CGResult>;

 RunChartTemplate(): RunChartContainer;

 getVolumeSet(): Array<CUResultMixed>
};
declare class Services{};

/**
 * ServicesHolder is the container that will
 * hold a reference to all the services, this is to also
 * produce individual components but also produce a `Services`
 * object
 */
export interface ServicesHolder {

  getRefreshService(): RefreshService;

  getNotifyService(): NotifyService;

  getNetworkService(): NetworkService;

  getInputService(): InputHookService;

  getHelpService(): HelpService;

  getProgramPluginService(): ProgramPluginService;

  getArchPluginService(): ArchPluginService

  getValidationService(): ValidationService;

  getRunResultService(): RunResultService;

  getServices(): Services;

}

