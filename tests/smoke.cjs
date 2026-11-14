// Basic smoke checks for educational data and indicator calculations.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{}};vm.createContext(ctx);
for(const path of ['js/lessons.js','js/indicators.js'])vm.runInContext(fs.readFileSync(path,'utf8'),ctx,{filename:path});
const d=ctx.window.ATLAS_DATA,m=ctx.window.ATLAS_MATH;
assert.ok(d.lessons.length>=40,'at least forty lessons');
assert.ok(d.glossary.length>=35,'glossary');
assert.ok(d.patterns.length>=10,'patterns');
for(const lesson of d.lessons){assert.equal(lesson.quiz.options.length,4);assert.ok(lesson.quiz.answer>=0&&lesson.quiz.answer<4);}
assert.equal(m.sma([1,2,3,4,5],3)[4],4);
assert.equal(m.ema([1,2,3,4,5],3)[4],4);
const up=Array.from({length:30},(_,i)=>100+i),flat=Array(30).fill(100);assert.equal(m.rsi(up,14).at(-1),100);assert.equal(m.rsi(flat,14).at(-1),50);
for(const kind of ['rise','fall','range','reversal']){const min=m.generate(kind);assert.equal(min.length,780);for(const b of min){assert.ok(b.h>=Math.max(b.o,b.c));assert.ok(b.l<=Math.min(b.o,b.c));assert.ok(b.v>0);}for(const tf of [3,5,9]){const bars=m.aggregate(min,tf),ind=m.calc(bars);assert.equal(bars.length,2*Math.floor(390/tf));assert.equal(ind.rsi.length,bars.length);assert.equal(ind.macd.line.length,bars.length);assert.equal(ind.dm.adx.length,bars.length);assert.ok(ind.dm.adx.some(Number.isFinite));for(const b of bars){assert.ok(b.minute+tf<=390);}}
}
const bb=m.bollinger(Array(30).fill(100),20);assert.equal(bb.top[20],100);assert.equal(bb.bottom[20],100);
const dayVW=m.vwap([{h:100,l:100,c:100,v:1,day:0},{h:110,l:110,c:110,v:3,day:0},{h:80,l:80,c:80,v:3,day:1}]);assert.equal(dayVW[1],107.5);assert.equal(dayVW[2],80);
console.log(`PASS: ${d.lessons.length} lessons, ${d.patterns.length} patterns, ${d.glossary.length} glossary terms; 4 scenarios × 3 TF; SMA/EMA/RSI/ADX/VWAP/Bands checks`);
