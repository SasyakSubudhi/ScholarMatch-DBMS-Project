// Deterministic 384-D hashed bag-of-words baseline, not a trained AI model.
export function embed(text){const v=Array(384).fill(0);for(const w of text.toLowerCase().match(/[a-z0-9]+/g)||[]){let h=2166136261;for(const c of w)h=Math.imul(h^c.charCodeAt(0),16777619);v[(h>>>0)%384]++;}const n=Math.hypot(...v);return n?v.map(x=>x/n):[1,...Array(383).fill(0)];}
