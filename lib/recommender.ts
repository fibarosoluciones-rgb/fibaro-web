
export type Need = { type:"fibra"|"movil"|"pack"; down?:number; up?:number; datos?:number; minutos?:number; maxPrice?:number; };
export type Tarifa = { id:string; operador:"masmovil"|"pepephone"|"simyo"|"jazztel"; plan:string; precio:number; velocidadDown?:number; velocidadUp?:number; datos?:number; minutos?:number; tv?:boolean; permanenciaMeses?:number; tags?:string[]; };
export type Option = { tipo:"A"|"B"|"C"; motivo:string; tarifa:Tarifa };
const weights = { ajuste:0.55, precio:0.35, permanencia:0.10 };
function scoreAjuste(n:Need,t:Tarifa){let total=0,ok=0;if(n.type!=="movil"){total++;if((t.velocidadDown||0)>=(n.down||0))ok++;}if(n.type!=="movil"){total++;if((t.velocidadUp||0)>=(n.up||0))ok++;}if(n.type!=="fibra"){total++;if((t.datos||0)>=(n.datos||0))ok++;}if(n.type!=="fibra"){total++;if((t.minutos||0)>=(n.minutos||0))ok++;}if(n.maxPrice){total++;if(t.precio<=n.maxPrice)ok++;}return total?ok/total:0;}
function normalizePrice(p:number,min:number,max:number){if(max===min)return 1;return 1-(p-min)/(max-min);}
export function recommend(need:Need,tarifas:Tarifa[]):Option[]{ if(tarifas.length===0)return []; const prices=tarifas.map(t=>t.precio); const min=Math.min(...prices),max=Math.max(...prices);
  const scored=tarifas.map(t=>{const sp=normalizePrice(t.precio,min,max); const sa=scoreAjuste(need,t); const sperm=t.permanenciaMeses?(t.permanenciaMeses<=12?1:0.7):1; const total=weights.ajuste*sa+weights.precio*sp+weights.permanencia*sperm; return {t,sp,sa,sperm,total};});
  const A=[...scored].sort((a,b)=>a.t.precio-b.t.precio)[0]; const hardOK=scored.filter(s=>s.sa>=0.99);
  const C=(hardOK.length?[...hardOK].sort((a,b)=>a.t.precio-b.t.precio)[0]:A); const B=[...scored].sort((a,b)=>b.total-a.total)[0];
  return [{tipo:"A",motivo:"Precio más bajo disponible",tarifa:A.t},{tipo:"B",motivo:"Mejor equilibrio ajuste/precio",tarifa:B.t},{tipo:"C",motivo:"Cumple o supera requisitos al mejor precio",tarifa:C.t}]; }
