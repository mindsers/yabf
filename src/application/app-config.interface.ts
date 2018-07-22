import { InjectionToken } from '../injector/injection-token.class'

export const APP_CONFIG = new InjectionToken<IAppConfig>()

export interface IAppConfig {
  server: {
    port: number;
  }
  cors?: {
    activated?: boolean;
    headers?: string[];
    origins: string[];
  }
  assets?: {
    location: string;
  }
  locales?: {
    list?: string[];
    default?: string;
  }
}
