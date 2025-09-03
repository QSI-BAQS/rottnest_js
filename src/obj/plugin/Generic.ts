/**
 * The plugin entry data that can be moved between views
 */
export type PluginData = {
  plgKey: string
  plgValue: string,
  params: Array<[string, string, any]>,
}
