/* CHART ATLAS 2.0 — 캔들 문제은행 + 네 가지 순수 로컬 계산 실습 */
(function(){
'use strict';
const d=window.ATLAS_DATA;
const $=q=>document.querySelector(q);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const won=v=>Math.round(v).toLocaleString('ko-KR')+'원';
const fixed=(v,n=2)=>(v>=0?'+':'')+v.toFixed(n);
const pct=v=>fixed(v,2)+'%';
const numeric=id=>Number($('#'+id).value);
const setText=(id,text)=>{$('#'+id).textContent=String(text);};

// 레슨 단축 이동은 기존 학습진도/모달 로직을 그대로 재사용합니다.
$('.product-topics').addEventListener('click',e=>{
const b=e.target.closest('button[data-topic]');if(!b)return;
const l=d.lessons.find(x=>x.title===b.dataset.topic);if(!l)return;
const all=$('#level-filter button[data-level="전체"]');all.click();
const cat=$('#category-filter button[data-cat="전체"]');cat.click();
const search=$('#lesson-search');search.value='';search.dispatchEvent(new Event('input'));
const card=document.querySelector(`button[data-lesson="${l.id}"]`);if(card)card.click();
});
$('#source-links').innerHTML=d.sources.map(src=>`<a href="${esc(src.url)}" target="_blank" rel="noopener noreferrer" title="${esc(src.desc)}">${esc(src.title)} <span aria-hidden="true">↗</span></a>`).join('');

// 계산식은 별도 공개 객체로 제공: 단위 테스트에서 UI 없이 검증할 수 있습니다.
const formula=window.ATLAS_FINANCE;
window.ATLAS_ACADEMY={formula};
let direction='long';
const outputs=[
{group:'covered-sim',fn:updateCovered},
{group:'distribution-sim',fn:updateDistribution},
{group:'futures-sim',fn:updateFutures},
{group:'leverage-sim',fn:updateLeverage}
];
for(const {group,fn} of outputs)$('#'+group).addEventListener('input',fn);
function updateCovered(){
const s0=numeric('call-base'),k=numeric('call-strike'),p=numeric('call-prem'),st=numeric('call-end');
setText('call-base-v',s0);setText('call-strike-v',k);setText('call-prem-v',p);setText('call-end-v',st);
const r=formula.call(s0,k,p,st);setText('call-plain-result',fixed(r.stock,0));setText('call-covered-result',fixed(r.covered,0));setText('call-diff-result',fixed(r.covered-r.stock,0));
plotPayoff(s0,k,p,st);
}
function updateDistribution(){const price=numeric('dist-price'),cash=numeric('dist-cash'),count=numeric('dist-count');const r=formula.distribution(price,cash,count);
setText('dist-price-v',won(price));setText('dist-cash-v',won(cash));setText('dist-count-v',count+'좌');
setText('dist-before',won(r.before));setText('dist-exnav',won(r.afterNAV));setText('dist-payout',won(r.payout));setText('dist-total',won(r.total));
}
function updateFutures(){const entry=numeric('fut-entry'),exit=numeric('fut-exit'),mult=numeric('fut-mult'),count=numeric('fut-count'),rate=numeric('fut-margin');const r=formula.futures(entry,exit,mult,count,direction,rate);
setText('fut-entry-v',entry);setText('fut-exit-v',exit);setText('fut-count-v',count+'계약');setText('fut-mult-v',won(mult)+'/포인트');setText('fut-margin-v',rate+'%');
setText('fut-notional',won(r.notional));setText('fut-deposit',won(r.margin));setText('fut-result',won(r.pnl));setText('fut-roe',pct(100*r.pnl/r.margin));
$('#fut-result').className=r.pnl<0?'sim-loss':'sim-gain';
}
for(const [id,dir] of [['fut-long','long'],['fut-short','short']])$('#'+id).addEventListener('click',()=>{direction=dir;for(const [bid,d] of [['fut-long','long'],['fut-short','short']]){const b=$('#'+bid),on=d===dir;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));}updateFutures();});
function updateLeverage(){const d1=numeric('lev-d1'),d2=numeric('lev-d2'),r=formula.leverage(d1,d2);setText('lev-d1-v',pct(d1));setText('lev-d2-v',pct(d2));
for(const [key,name] of [['index','index'],['inverse','inverse'],['double','double']]){setText('lev-'+key,r[name].toFixed(2));setText('lev-'+key+'-ret','누적 '+pct(r[name]-100));$('#lev-'+key+'-ret').className=r[name]<100?'sim-loss':'sim-gain';}
}
function plotPayoff(s0,k,p,st){const cv=$('#call-chart');if(!cv)return;const b=cv.getBoundingClientRect();if(b.width<60)return;const dpi=Math.min(2,devicePixelRatio||1);cv.width=Math.round(b.width*dpi);cv.height=Math.round(b.height*dpi);const ctx=cv.getContext('2d');ctx.setTransform(dpi,0,0,dpi,0,0);
const w=b.width,h=b.height,left=48,right=12,top=15,bottom=36;
const xMin=0,xMax=Math.max(200,s0*1.6,k+35,st+10),out=[0,1].flatMap(c=>[formula.call(s0,k,p,xMin),formula.call(s0,k,p,xMax)]).flatMap(o=>Object.values(o));
const yMin=Math.min(...out,-s0)*1.08-4,yMax=Math.max(...out,s0/2)*1.06+4;
const X=v=>left+(v-xMin)/(xMax-xMin)*(w-left-right),Y=v=>top+(yMax-v)/(yMax-yMin)*(h-top-bottom);
ctx.clearRect(0,0,w,h);ctx.font='11px system-ui';ctx.lineWidth=1;
for(let i=0;i<=4;i++){const val=yMin+(yMax-yMin)*i/4,y=Y(val);ctx.strokeStyle='rgba(142,181,205,.13)';ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(w-right,y);ctx.stroke();ctx.fillStyle='#89a7b7';ctx.textAlign='right';ctx.fillText(val.toFixed(0),left-8,y+4);}
ctx.strokeStyle='rgba(245,207,155,.35)';ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(left,Y(0));ctx.lineTo(w-right,Y(0));ctx.moveTo(X(k),top);ctx.lineTo(X(k),h-bottom);ctx.stroke();ctx.setLineDash([]);
function curve(col,method){ctx.beginPath();ctx.lineWidth=2.2;ctx.strokeStyle=col;for(let i=0;i<=160;i++){const x=xMin+(xMax-xMin)*i/160,y=Y(formula.call(s0,k,p,x)[method]);i===0?ctx.moveTo(X(x),y):ctx.lineTo(X(x),y);}ctx.stroke();}
curve('#67d8c5','covered');curve('#e9b978','stock');
const chosen=formula.call(s0,k,p,st);ctx.fillStyle='#67d8c5';ctx.beginPath();ctx.arc(X(st),Y(chosen.covered),4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#9bb1bf';ctx.textAlign='left';ctx.fillText('0',left,h-12);ctx.textAlign='right';ctx.fillText(xMax.toFixed(0),w-right,h-12);ctx.textAlign='center';ctx.fillText('만기 주가',left+(w-left-right)/2,h-12);}

// --- 문제은행: 그림 인식(12), 맥락(24), OHLC 계산(15), 판단(24) 총 75문항.
const pats=d.patterns;
const byId=id=>pats.find(p=>p.id===id);
const patternContexts={
'doji':'시가·종가가 거의 같습니다. 추세 끝에서 관찰',
'hammer':'직전 여러 봉이 하락했습니다. 지지 부근에서 관찰',
'shoot':'직전 여러 봉이 상승했습니다. 저항 부근에서 관찰',
'marubozu-up':'최근 평균보다 긴 빨간 양봉',
'marubozu-down':'최근 평균보다 긴 파란 음봉',
'engulf-up':'직전 하락. 두 번째 큰 양봉이 앞 음봉 몸통을 감쌉니다',
'engulf-down':'직전 상승. 두 번째 큰 음봉이 앞 양봉 몸통을 감쌉니다',
'morning':'직전 하락. 음봉·소형 몸통·큰 양봉 3개가 이어집니다',
'evening':'직전 상승. 양봉·소형 몸통·큰 음봉 3개가 이어집니다',
'inverted':'직전 하락. 작은 몸통 위 긴 윗꼬리가 있습니다',
'hanging':'직전 상승. 작은 몸통 아래 긴 아랫꼬리가 있습니다',
'harami':'큰 몸통 뒤 그 범위 안에 작은 몸통이 나옵니다'
};
const expected={
'doji':'시가·종가가 비슷해 망설임을 보여줄 수 있지만 다음 방향은 불확실합니다.',
'hammer':'하락 추세에서 저가 거부가 나타났지만 후속 강세 확인이 필요합니다.',
'shoot':'상승 뒤 고가에서 되밀렸지만 후속 약세 확인이 필요합니다.',
'marubozu-up':'그 봉 구간에서 상승 압력이 강했음을 나타냅니다.',
'marubozu-down':'그 봉 구간에서 하락 압력이 강했음을 나타냅니다.',
'engulf-up':'하락 뒤 두 번째 양봉이 전 봉의 몸통을 감싸며 반격 가능성을 보입니다.',
'engulf-down':'상승 뒤 두 번째 음봉이 전 봉의 몸통을 감싸며 약세 가능성을 보입니다.',
'morning':'하락 뒤 세 봉에 걸쳐 매수 반격이 나타나는 후보 패턴입니다.',
'evening':'상승 뒤 세 봉에 걸쳐 매도 반격이 나타나는 후보 패턴입니다.',
'inverted':'하락 말미 매수 시도가 나타나지만 반등 확인이 더 필요합니다.',
'hanging':'상승 말미 장중 큰 하락 시도가 있었음을 주의 깊게 봅니다.',
'harami':'직전 큰 몸통 안에서 두 번째 몸통이 줄어들어 추세 둔화 가능성을 점검합니다.'
};
const confirmations={
'doji':'다음 완성봉이 어느 방향으로 이탈하는지 확인합니다.',
'hammer':'선행 하락과 지지 위치, 다음 봉의 상승 확인을 살핍니다.',
'shoot':'선행 상승과 저항 위치, 다음 봉의 하락 확인을 살핍니다.',
'marubozu-up':'기존 고점 돌파 유지·거래량·과열을 확인합니다.',
'marubozu-down':'지지 이탈 유지·거래량·과매도를 확인합니다.',
'engulf-up':'두 번째 양봉의 몸통 범위와 후속 지지 유지를 확인합니다.',
'engulf-down':'두 번째 음봉의 몸통 범위와 후속 약세를 확인합니다.',
'morning':'세 번째 양봉의 종가가 첫 음봉 몸통을 얼마나 회복했는지 확인합니다.',
'evening':'세 번째 음봉의 종가가 첫 양봉 몸통을 얼마나 되돌렸는지 확인합니다.',
'inverted':'하락 선행 여부와 다음 봉의 강세를 확인합니다.',
'hanging':'상승 선행 여부와 다음 봉의 약세를 확인합니다.',
'harami':'직전 큰 몸통을 후속 봉이 어느 방향으로 돌파하는지 확인합니다.'
};
const falseIdeas=['다음 봉 수익률이 100% 확정됩니다.','캔들 하나만으로 손절이 필요 없어집니다.','이 패턴이면 뉴스·거래량은 언제나 무시합니다.'];
const bank=[];
function add(level,type,q,options,answer,explain,pat=null){bank.push({id:'C'+String(bank.length+1).padStart(3,'0'),level,type,q,options,answer,explain,pat});}
// 12 visual identification questions (context indispensable for indistinguishable silhouettes)
pats.forEach((p,i)=>{const distract=[pats[(i+3)%12].ko,pats[(i+5)%12].ko,pats[(i+8)%12].ko];const opts=[p.ko,...distract];const shift=i%4;const rotated=opts.slice(shift).concat(opts.slice(0,shift));add('초급','그림',`그림과 맥락을 읽으세요. ${patternContexts[p.id]} — 가장 가까운 전통적 패턴 명칭은?`,rotated,(4-shift)%4,`${p.ko}: ${p.description} 이름만으로 다음 가격을 확정할 수 없습니다.`,p.id);});
// 12 context + 12 confirmation (pattern-specific correct answers)
pats.forEach((p,i)=>{const options=[expected[p.id],...falseIdeas];const shift=(i+1)%4;const rot=options.slice(shift).concat(options.slice(0,shift));add('중급','판단',`${patternContexts[p.id]}. 이 도식에서 가장 타당한 해석은?`,rot,(4-shift)%4,expected[p.id],p.id);});
pats.forEach((p,i)=>{const options=[confirmations[p.id],'봉 이름만 보고 즉시 방향을 확정합니다.','실제 거래가 중단되었는지는 중요하지 않습니다.','캔들 몸통의 색만 확인하면 충분합니다.'];const shift=(i+2)%4;add('고급','판단',`이 패턴을 관찰했을 때 다음에 검증할 근거로 가장 알맞은 것은? (${p.ko})`,options.slice(shift).concat(options.slice(0,shift)),(4-shift)%4,confirmations[p.id],p.id);});
const numericProblems=[
['시가 100, 종가 108. 몸통 절댓값은?',['8','−8','108','208'],0,'|108−100|=8입니다.'],
['시가 110, 종가 101. 봉의 색(한국식 표기)은?',['빨간 양봉','파란 음봉','도지 확정','장대양봉 확정'],1,'종가가 시가보다 낮아 파란 음봉입니다.'],
['시가 100, 고가 115, 저가 95, 종가 110. 윗꼬리 길이는?',['5','10','15','20'],0,'115−max(100,110)=5입니다.'],
['시가 100, 고가 115, 저가 95, 종가 110. 아랫꼬리 길이는?',['0','5','10','15'],1,'min(100,110)−95=5입니다.'],
['시가 100, 고가 115, 저가 95, 종가 110. 전체 변동폭은?',['10','15','20','25'],2,'115−95=20입니다.'],
['시가 101, 종가 101, 고가 105, 저가 97. 모양 설명은?',['몸통이 거의 없는 도지','큰 양봉','장대음봉','거래량 0'],0,'시가=종가이므로 도지이며 꼬리의 범위는 97~105입니다.'],
['시가 100, 고가 99, 저가 95, 종가 97. 이 OHLC는 유효한가?',['유효','고가가 시가보다 작아 무효','고가가 종가보다 커서 무효','저가가 가장 낮아 무효'],1,'고가 99는 시가 100보다 작을 수 없으므로 데이터 오류입니다.'],
['시가 102, 고가 108, 저가 104, 종가 106. 어떤 값이 잘못되었나?',['종가','고가','저가','시가'],2,'저가 104가 시가 102보다 높아 OHLC 조건에 맞지 않습니다.'],
['시가 95, 종가 100. 시가 대비 상승률은?',['약 5.26%','정확히 5%','−5%','약 10.53%'],0,'(100/95−1)×100≈5.26%입니다.'],
['3분봉을 1분봉 세 개로 집계할 때 종가로 쓰는 값은?',['첫 봉의 종가','마지막 봉의 종가','세 종가 평균','최고가'],1,'상위 봉의 종가는 집계 구간 마지막 봉의 종가입니다.'],
['3분봉을 1분봉 세 개로 집계할 때 거래량은?',['마지막 봉 거래량','세 봉 중 최대치','세 봉 거래량 합계','세 봉 거래량 평균'],2,'같은 구간의 거래량을 합산합니다.'],
['시가 100, 고가 110, 저가 90, 종가 100. 몸통 비율은 전체 폭 대비?',['0%','10%','50%','100%'],0,'몸통은 0, 전체 폭은 20이므로 0%입니다.'],
['전 봉 종가 110, 현 봉 시가 102·종가 105. 어떤 설명이 맞나요?',['양봉이면서 전일 종가보다 낮음','음봉이면서 전일보다 높음','양봉이면서 전일보다 높음','종가가 시가보다 낮음'],0,'종가 105가 시가 102보다 높아 양봉이지만 전 봉 종가 110보다 낮습니다.'],
['고가 110, 저가 90, 종가 108인 봉이 있습니다. 시가로 가능한 값은?',['115','85','100','120'],2,'시가·종가는 반드시 고가 이하·저가 이상이어야 합니다.'],
['어떤 5분봉의 고가는 각 1분봉의 고가 101,103,102,106,104 중 무엇인가요?',['101','103','104','106'],3,'포함된 1분봉 고가의 최댓값인 106을 사용합니다.']
];
numericProblems.forEach(([q,opts,a,ex],i)=>add(i<10?'초급':'중급','계산',q,opts,a,ex,i%3===0?'doji':null));
const cases=[
['고급','매물대 저항을 꼬리로만 돌파한 뒤 종가가 저항 아래로 내려왔습니다. 올바른 판단은?',['완성봉 종가 돌파가 확정됐다','실패 돌파 가능성을 관찰한다','다음 봉 급등 확정','거래량은 항상 0이다'],1,'꼬리 이탈과 종가 안착은 서로 다릅니다.','shoot'],
['중급','하락이 계속되다가 긴 아랫꼬리가 지지 부근에 나타났습니다. 다음으로 중요한 것은?',['다음 봉·지지 유지','즉시 수익 확정','봉의 색만','과거 추세 무시'],0,'지지와 후속 확인이 반등 가설의 근거입니다.','hammer'],
['고급','완성되지 않은 9분봉이 잠시 양봉이 되었습니다. 적절한 설명은?',['시가·종가가 확정됨','종가가 계속 바뀔 수 있어 확정 신호가 아님','미래 봉이 공개됨','매수 위험 0'],1,'미완성 봉은 아직 종가가 확정되지 않았습니다.','doji'],
['중급','같은 도지 모양이 상승 말기와 횡보 중앙에 나왔습니다. 해석은?',['전자는 전환 주의 문맥, 후자는 큰 의미가 없을 수 있음','항상 동일한 하락 확정','둘 다 원금보장','색만 보면 충분'],0,'패턴의 위치와 이전 추세가 다르면 해석도 달라집니다.','doji'],
['고급','큰 거래량과 함께 장대양봉이 나왔습니다. 가장 안전한 표현은?',['다음 날 반드시 상승','해당 구간 상승 참여가 컸을 가능성, 후속 검증 필요','가격 상승 불가능','거래량은 매수만 의미'],1,'거래량은 체결 규모이며 다음 가격을 보장하지 않습니다.','marubozu-up'],
['고급','캔들 패턴의 과거 승률이 높아 보입니다. 확인할 것은?',['선택한 성공 사례의 개수만','정의·표본·거래비용·미래 참조 여부','몸통 색 하나만','이름의 유명세'],1,'백테스트는 표본 편향과 미래 참조를 통제해야 합니다.','engulf-up'],
['중급','상승장악형의 두 번째 봉은 어떤 비교를 요구하나요?',['몸통끼리 범위 비교','꼬리 길이 항상 0','거래량 0','첫 봉과 색 동일'],0,'전통적 상승장악형은 뒤의 양봉 몸통이 앞 음봉 몸통을 감쌉니다.','engulf-up'],
['중급','하락장악형 이후에도 가격이 계속 올라갑니다. 합리적인 대응은?',['패턴이 항상 성공한다고 주장','패턴 가설이 틀릴 수 있음을 인정','호가를 임의 생성','전략 검증 불필요'],1,'패턴은 추세 반전 확정이 아닙니다.','engulf-down'],
['중급','망치형처럼 긴 아랫꼬리가 상승 추세 고점에 나타났습니다. 어느 명칭 맥락이 더 가깝나요?',['교수형','샛별','장대음봉','상승장악형'],0,'같은 모양이라도 상승 뒤에는 교수형 맥락으로 관찰합니다.','hanging'],
['중급','슈팅스타처럼 긴 윗꼬리가 하락 추세 끝에 나타났습니다. 어느 명칭 맥락이 더 가깝나요?',['도지','역망치형','하락장악형','장대양봉'],1,'상승 뒤에는 슈팅스타, 하락 뒤에는 역망치형으로 관찰하는 경우가 많습니다.','inverted'],
['고급','이평선이 횡보장에서 자주 교차합니다. 캔들 패턴과 결합할 때 주의점은?',['서로 독립된 완벽 신호','같은 가격으로 만든 중복 신호의 위험','항상 원금보장','거래량 불필요'],1,'같은 기초가격에서 나온 지표는 독립적인 증거가 아닐 수 있습니다.','harami'],
['중급','샛별 3봉 중 세 번째 큰 양봉이 제대로 형성되는지 보려면?',['세 번째 봉의 마감 확인','첫 봉의 이름만','다음달 배당일만','모든 봉을 미완성으로 보기'],0,'세 번째 봉의 크기와 종가 위치가 패턴 확인에 중요합니다.','morning'],
['중급','석별 3봉에서 약세 반전 가설을 강화할 요소는?',['세 번째 음봉의 되돌림과 후속 약세','세 번째 봉이 아직 시작하지 않음','거래대금 0','주가 급등 보장'],0,'3봉 구조와 후속 거래를 함께 관찰합니다.','evening'],
['고급','저항 돌파가 성공한 것처럼 보였다가 다시 내려옵니다. 왜 계획을 바꿀 수 있나요?',['검증 가능한 가설의 무효화 조건','기본 데이터 삭제','패턴이 미래를 확정','예측 실패가 금지'],0,'트레이딩 가설은 반증 조건을 가져야 합니다.','shoot'],
['고급','가격이 3분봉에서 반등하고 9분봉에서 하락 추세입니다. 중요한 해석은?',['상위와 하위 시간봉 신호 충돌','독립된 상승 신호 2개','9분봉 삭제','시세가 틀렸다'],0,'하위 반등은 상위 하락 속 일시 반등일 수 있습니다.','hammer'],
['초급','빨간 캔들이라면 항상 전 봉 종가보다 높은가요?',['그렇다','아니다, 현 봉 시가보다 종가가 높은 것','전 봉 종가를 알 수 있다','거래량이 0이다'],1,'색은 현 봉 시가 대비 종가의 관계를 나타냅니다.','marubozu-up'],
['초급','파란 음봉이 나타났습니다. 무엇을 직접 알 수 있나요?',['그 봉의 종가가 시가보다 낮음','내일 폭락 확정','외국인 매도 확정','미래 거래량'],0,'음봉 색으로 판단할 수 있는 것은 해당 봉의 시가·종가 관계입니다.','marubozu-down'],
['초급','긴 윗꼬리가 있는 봉이 있습니다. 기본적으로 알 수 있는 것은?',['장중 고가에서 가격이 되밀린 흔적','미래에는 반드시 하락','배당금 발생','거래정지 확정'],0,'윗꼬리는 고점에서 종가 또는 시가 부근으로 되돌아온 움직임을 나타냅니다.','shoot'],
['초급','아랫꼬리가 길면 무조건 매수 신호인가요?',['그렇다','아니다, 위치와 후속 움직임을 본다','원금이 보장된다','하락은 불가능'],1,'긴 꼬리는 움직임의 흔적일 뿐 방향 확정이 아닙니다.','hammer'],
['중급','첫 봉이 매우 크고 둘째 봉 몸통이 그 안에 있습니다. 가장 가까운 것은?',['하라미','장악형','장대음봉 하나','슈팅스타'],0,'하라미는 큰 몸통 뒤에 작은 몸통이 그 범위 안에 있는 형태입니다.','harami'],
['고급','뉴스로 거래가 중단되어 분봉에 빈 구간이 있습니다. 해야 할 일은?',['빈 봉을 실제 체결처럼 보간','원본과 거래 중단 사실을 확인','무조건 상승','캔들 이름만 쓰기'],1,'시세의 공백은 먼저 거래 상태와 원본 데이터로 검증해야 합니다.','doji'],
['고급','3분봉 완성 전에 화면에 나타나는 시가와 종가를 시험에 쓰면?',['완성 봉과 정확히 같다','미완성 값으로 오류가 생길 수 있다','무위험 신호다','모든 OHLC가 0이다'],1,'시점에 따라 계속 변하는 미완성 값은 계산과 판정을 바꿀 수 있습니다.','morning'],
['중급','캔들 도감에서 같은 몸통과 꼬리인데 다른 이름으로 소개됩니다. 왜인가요?',['선행 추세·위치가 다르기 때문','색상 코드 오류','항상 같은 이름이어야 함','거래소마다 시가가 다름'],0,'망치형/교수형과 역망치형/슈팅스타는 선행 추세가 구별에 중요합니다.','hanging'],
['고급','패턴 거래를 검증할 때 거래비용을 뺀 기대값도 봐야 하는 이유는?',['승률이 높아도 손익이 나쁠 수 있기 때문','거래비용은 언제나 음수 수익을 없앰','캔들 색을 바꿀 수 있음','손실이 0이기 때문'],0,'승률·손익비·거래비용·체결 조건을 함께 검증해야 합니다.','engulf-down']
];
cases.forEach(([lvl,q,opts,answer,exp,pat])=>add(lvl,'판단',q,opts,answer,exp,pat));
const Q=bank;
window.ATLAS_ACADEMY.bank=Q;
setText('dojo-bank-size',Q.length);
const key='chart-atlas.dojo.v2';
let records={total:0,missed:[]};try{const raw=JSON.parse(localStorage.getItem(key)||'null');if(raw&&Number.isInteger(raw.total)&&Array.isArray(raw.missed)){records={total:Math.max(0,raw.total),missed:raw.missed.filter(x=>typeof x==='string'&&Q.some(q=>q.id===x))};}}catch{/* unavailable */}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(records));}catch{/* private mode */}};
const refreshHistory=()=>{setText('dojo-history',records.total+'문제');setText('dojo-missed',records.missed.length+'문제');$('#dojo-wrong').disabled=records.missed.length===0;};
refreshHistory();
let deck=[],pos=0,score=0,answered=false,sessionDone=false;
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function pick(){const level=$('#dojo-level').value,type=$('#dojo-type').value,n=$('#dojo-length').value;const eligible=Q.filter(q=>(level==='전체'||q.level===level)&&(type==='전체'||q.type===type));return shuffle(eligible).slice(0,n==='all'?eligible.length:Math.min(+n,eligible.length));}
function renderCandle(pat){if(!pat)return '<div class="dojo-placeholder">OHLC<span>READ THE DATA</span></div>';const p=byId(pat);if(!p)return '';const bars=p.bars,xs=bars.length===1?[125]:bars.length===2?[91,159]:[57,125,193];return `<svg viewBox="0 0 250 165" role="img" aria-label="${esc(p.ko)} 설명용 캔들 도식"><defs><linearGradient id="dojo-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#091c31"/><stop offset="1" stop-color="#102537"/></linearGradient></defs><rect width="250" height="165" fill="url(#dojo-bg)"/><path d="M9 35 H241 M9 67 H241 M9 99 H241" fill="none" stroke="#345061" stroke-dasharray="3 4" stroke-width="0.7"/>${bars.map(([o,h,l,c],i)=>{const x=xs[i],Y=v=>125-v*.93,col=c>=o?'#ef7883':'#6dbbf0';return `<line x1="${x}" y1="${Y(h)}" x2="${x}" y2="${Y(l)}" stroke="${col}" stroke-width="2.5"/><rect x="${x-13}" y="${Math.min(Y(o),Y(c))}" width="26" height="${Math.max(2,Math.abs(Y(o)-Y(c)))}" rx="1.5" fill="${col}"/>`;}).join('')}<text x="125" y="147" text-anchor="middle" font-size="9" letter-spacing="2" fill="#88a9b9">CANDLE STRUCTURE</text></svg>`;}
function show(){sessionDone=false;answered=false;const q=deck[pos];if(!q){finish();return;}setText('dojo-position',`QUESTION ${pos+1} / ${deck.length}`);setText('dojo-points',`정답 ${score} / ${pos}`);$('#dojo-progress').style.width=(100*pos/deck.length)+'%';$('#dojo-visual').innerHTML=renderCandle(q.pat);setText('dojo-category',q.level+' · '+q.type);setText('dojo-question',q.q);$('#dojo-options').innerHTML=q.options.map((o,i)=>`<button type="button" class="quiz-option" data-dojo-answer="${i}"><span>${String.fromCharCode(65+i)}</span>${esc(o)}</button>`).join('');$('#dojo-feedback').hidden=true;$('#dojo-next').disabled=true;setText('dojo-next',pos===deck.length-1?'최종 결과 확인 ↗':'다음 문제 →');}
function finish(){sessionDone=true;setText('dojo-position','SESSION COMPLETE');setText('dojo-points',`정답 ${score} / ${deck.length}`);$('#dojo-progress').style.width='100%';setText('dojo-category','훈련 종료');setText('dojo-question',`${deck.length}문제 중 ${score}문제 정답 · 정답률 ${deck.length?Math.round(100*score/deck.length):0}%`);$('#dojo-visual').innerHTML='<div class="dojo-placeholder">✦<span>KEEP EXPLORING</span></div>';$('#dojo-options').innerHTML='<p class="section-lead">수익률을 맞히는 게임이 아닙니다. 패턴의 이름, 위치, 후속 확인과 반례를 함께 생각하는 습관을 기르세요.</p>';$('#dojo-feedback').hidden=true;$('#dojo-next').disabled=true;refreshHistory();}
function begin(list){deck=list;pos=0;score=0;answered=false;if(!deck.length){setText('dojo-question','선택 조건에 해당하는 문제가 없습니다. 난이도·유형을 바꿔주세요.');$('#dojo-options').innerHTML='';$('#dojo-visual').innerHTML='<div class="dojo-placeholder">◇<span>NO QUESTIONS</span></div>';$('#dojo-next').disabled=true;return;}show();$('#dojo').scrollIntoView({block:'start',behavior:'smooth'});}
$('#dojo-start').addEventListener('click',()=>begin(pick()));
$('#dojo-wrong').addEventListener('click',()=>begin(shuffle(Q.filter(q=>records.missed.includes(q.id)))));
$('#dojo-clear').addEventListener('click',()=>{if(!confirm('이 브라우저의 캔들 훈련 누적 풀이와 오답 기록을 삭제할까요?'))return;records={total:0,missed:[]};save();refreshHistory();});
$('#dojo-options').addEventListener('click',e=>{const b=e.target.closest('button[data-dojo-answer]');if(!b||answered||sessionDone||!deck.length)return;answered=true;const q=deck[pos],chosen=+b.dataset.dojoAnswer,right=chosen===q.answer;score+=Number(right);records.total++;const wrong=new Set(records.missed);right?wrong.delete(q.id):wrong.add(q.id);records.missed=[...wrong];save();refreshHistory();$('#dojo-options').querySelectorAll('button').forEach((o,i)=>{o.disabled=true;if(i===q.answer)o.classList.add('correct');else if(i===chosen)o.classList.add('incorrect');});const feedback=$('#dojo-feedback');feedback.hidden=false;feedback.textContent=(right?'✓ 정답입니다. ':'↳ 다시 생각해보세요. ')+q.explain;setText('dojo-points',`정답 ${score} / ${pos+1}`);$('#dojo-next').disabled=false;});
$('#dojo-next').addEventListener('click',()=>{if(!answered)return;pos++;pos===deck.length?finish():show();});
let raf=false;window.addEventListener('resize',()=>{if(raf)return;raf=true;requestAnimationFrame(()=>{raf=false;updateCovered();});});
updateCovered();updateDistribution();updateFutures();updateLeverage();
})();
