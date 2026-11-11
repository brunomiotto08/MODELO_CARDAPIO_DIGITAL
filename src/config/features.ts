import { siteConfig, type FeatureName } from './site.config';

export type { FeatureName };

/** true quando a feature está ligada em site.config.ts. */
export function isEnabled(name: FeatureName): boolean {
  return siteConfig.features[name];
}

/** Atalho para condicionar a várias features ao mesmo tempo. */
export function allEnabled(...names: FeatureName[]): boolean {
  return names.every(isEnabled);
}
