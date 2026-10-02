export const DEFAULT_SETTINGS={music:.65,effects:.8,shake:.6,quality:'auto',cursor:1};
export const SETTINGS_KEY='gouden-horizon-settings-v6';
export function normalizeSettings(value={}){const out={...DEFAULT_SETTINGS};for(const k of ['music','effects','shake'])if(Number.isFinite(Number(value[k])))out[k]=Math.max(0,Math.min(1,Number(value[k])));if(['auto','high','low'].includes(value.quality))out.quality=value.quality;if([1,1.4].includes(Number(value.cursor)))out.cursor=Number(value.cursor);return out;}
