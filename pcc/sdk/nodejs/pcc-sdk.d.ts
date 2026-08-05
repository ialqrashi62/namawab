// Type definitions for @jumanasoft/pcc-sdk-nodejs
declare class PccClient {
  constructor(options?: { baseUrl?: string; headers?: Record<string, string>; timeout?: number });
  catalog(): Promise<any>;
  categories(): Promise<any>;
  module(slug: string): Promise<any>;
  search(query: string): Promise<any>;
  lookup(fn: string): Promise<any>;
  diagnostics(): Promise<any>;
  version(): Promise<any>;
  listModule(slug: string): Promise<any>;
  call(slug: string, fn: string, input?: Record<string, unknown>): Promise<any>;
  record(slug: string, req: any): Promise<any>;
  health(): Promise<{ status: string; version: string }>;
}
export { PccClient };
export const SHORTCUTS: Record<string, { slug: string; module: string; version: string; functions: string[] }>;
export default PccClient;
