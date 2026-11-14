/* Only hypothetical educational arithmetic. No prices, accounts, orders or external requests. */
(function(root){
'use strict';
const formula={
  call:(s0,k,p,st)=>({stock:st-s0,covered:st-s0+p-Math.max(st-k,0)}),
  distribution:(price,cash,count)=>({before:price*count,afterNAV:price-cash,payout:cash*count,total:(price-cash)*count+cash*count}),
  futures:(entry,exit,mult,count,direction,marginRate)=>({notional:entry*mult*count,margin:entry*mult*count*marginRate/100,pnl:(exit-entry)*mult*count*(direction==='long'?1:-1)}),
  leverage:(r1,r2)=>({index:100*(1+r1/100)*(1+r2/100),inverse:100*(1-r1/100)*(1-r2/100),double:100*(1+2*r1/100)*(1+2*r2/100)})
};
root.ATLAS_FINANCE=Object.freeze(formula);
})(typeof window!=='undefined'?window:globalThis);
