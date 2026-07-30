"use strict";

const PALETTE=["#20456B","#00786D","#96631A","#7A2E2E","#3F5B2E","#4B3A6B","#1E6E8C","#8A5A1F","#5C6B2E","#6B2E5A","#2E6B4F","#8C3A2E","#37507A","#6B5A1F","#2E5A6B","#7A3A5A","#45632E","#5A3A7A","#1F6B6B","#6B4A2E"];
const WARM=["#96631A","#7A2E2E","#5C6B2E","#8A5A1F","#6B2E5A","#8C3A2E","#6B5A1F","#45632E","#7A3A5A","#5A3A2E","#8A7A1F","#6B4A2E","#7A4A12","#3F5B2E","#8C5A2E","#6B3A5A","#5C4A2E","#7A5A3A","#6B6B2E","#5A2E2E"];
const MONOP=["#2B3138","#3A424A","#454D55","#515962","#5A626B","#42484F","#4D555D","#586069","#3F454C","#4A525A","#555D66","#606974","#464C53","#515A63","#5C646E","#3A4046","#4E565F","#59616B","#444A51","#4F575F"];
const SLATE=["#2B4C6F","#1E6E8C","#2E5A6B","#37507A","#3F5B78","#245A73","#2E6B7A","#405C80","#1F6B6B","#2E4B6B","#4B5C78","#2A6E7A","#345F8C","#4A6B8A","#2E7A8C","#3A5570","#26607A","#465578","#2F6B85","#3B4E6B"];
const FOREST=["#2E6B4F","#3F5B2E","#45632E","#5C6B2E","#2E7A5A","#4A6B2E","#376B45","#5A6B1F","#2E5A3A","#6B5A1F","#4B7A3A","#3A6B2E","#5C7A2E","#2E7A6B","#6B6B2E","#456B5A","#537A3A","#2E6B3A","#6B7A45","#3A5A2E"];
const BERRY=["#6B2E5A","#7A2E4A","#8C3A5A","#5A3A7A","#7A3A5A","#6B2E7A","#8A2E5A","#5C2E6B","#7A2E6B","#6B3A2E","#8C4A6B","#5A2E4A","#7A4A6B","#6B4A7A","#8A5A6B","#5A4A6B","#7A2E5C","#6B2E4A","#8C3A7A","#5A3A5A"];
const THEMES={
  classic:{palette:PALETTE,vars:{}},
  warm:{palette:WARM,vars:{"--page":"#FBF7F1","--ink":"#241C14","--ink-2":"#3A2E22","--muted":"#7A6A55","--faint":"#A99B85","--rule":"#E4DACB"}},
  mono:{palette:MONOP,vars:{"--page":"#FFFFFF","--ink":"#111418","--ink-2":"#2A2F35","--muted":"#5A6069","--faint":"#9AA0A8","--rule":"#E1E4E7"}},
  slate:{palette:SLATE,vars:{"--page":"#F6F8FA","--ink":"#16202B","--ink-2":"#2A3744","--muted":"#5E6C7A","--faint":"#93A1AE","--rule":"#DCE3EA"}},
  forest:{palette:FOREST,vars:{"--page":"#F6F8F2","--ink":"#182016","--ink-2":"#2C3A28","--muted":"#5F6C55","--faint":"#98A588","--rule":"#DEE6D4"}},
  berry:{palette:BERRY,vars:{"--page":"#FBF5F8","--ink":"#241620","--ink-2":"#3A2833","--muted":"#7A5F6E","--faint":"#B399A8","--rule":"#EBDCE4"}}
};
const MODE={taxi:"Taxi",rideshare:"Rideshare",private:"Private car"};
const TYPES={flight:{label:"Flight",c:"#20456B"},hotel:{label:"Hotel",c:"#00786D"},car:{label:"Rental car",c:"#96631A"},ground:{label:"Ground",c:"#6B2E5A"},entertainment:{label:"Entertainment",c:"#7A3A5A"},meal:{label:"Meal",c:"#5C6B2E"},activity:{label:"Activity",c:"#37507A"},transport:{label:"Transport",c:"#2E5A6B"},meeting:{label:"Meeting / work",c:"#4B3A6B"},tour:{label:"Tour",c:"#45632E"},note:{label:"Note",c:"#8A5A1F"}};
const CURRENCIES=["USD","HKD","MOP","EUR","GBP","JPY","CNY","CAD","AUD","SGD","KRW","THB"];
const SYM={USD:"$",HKD:"HK$",MOP:"MOP ",EUR:"€",GBP:"£",JPY:"¥",CNY:"¥",CAD:"C$",AUD:"A$",SGD:"S$",KRW:"₩",THB:"฿"};
const OFFSETS=(()=>{const a=[["","—"]];for(let m=-720;m<=840;m+=60){const s=m<0?"−":"+";const am=Math.abs(m);const hh=String(Math.floor(am/60)).padStart(2,"0");const mm=String(am%60).padStart(2,"0");a.push([String(m),"UTC"+s+hh+":"+mm]);}return a;})();
const WD=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MON=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const MONT=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parseISO(iso){const p=String(iso||"").split("-");return [(+p[0]),(+p[1]),(+p[2])];}
function toEpoch(iso,tm){if(!iso)return null;const [y,m,d]=parseISO(iso);if(!y||!m||!d)return null;let hh=0,mm=0;if(tm){const t=tm.split(":");hh=+t[0]||0;mm=+t[1]||0;}return new Date(y,m-1,d,hh,mm).getTime();}
function dow(iso){const [y,m,d]=parseISO(iso);if(!y)return null;return new Date(y,m-1,d).getDay();}
function fmtStamp(iso){const w=dow(iso);if(w==null)return "";return WD[w]+" "+parseISO(iso)[2];}
function dayNum(iso){const d=parseISO(iso)[2];return d?String(d):"";}
function nightsBetween(a,b){const ea=toEpoch(a),eb=toEpoch(b);if(ea==null||eb==null)return 0;const n=Math.round((eb-ea)/86400000);return n>0?n:0;}
function fmtLong(iso){const [y,m,d]=parseISO(iso);if(!y)return "";return d+" "+MON[m-1]+" "+y;}
function fmtRange(a,b){const [ay,am,ad]=parseISO(a),[by,bm,bd]=parseISO(b);if(!ay)return fmtLong(b);if(!by)return fmtLong(a);if(ay===by&&am===bm)return ad+" – "+bd+" "+MON[am-1]+" "+ay;if(ay===by)return ad+" "+MON[am-1]+" – "+bd+" "+MON[bm-1]+" "+ay;return ad+" "+MON[am-1]+" "+ay+" – "+bd+" "+MON[bm-1]+" "+by;}
function epUTC(iso,tm,off){if(!iso)return null;const [y,m,d]=parseISO(iso);if(!y)return null;let hh=0,mm=0;if(tm){const t=tm.split(":");hh=+t[0]||0;mm=+t[1]||0;}let ms=Date.UTC(y,m-1,d,hh,mm);if(off!==""&&off!=null&&!isNaN(+off))ms-=(+off)*60000;return ms;}
function elapsedStr(f){const a=epUTC(f.departDate,f.departTime,f.departOff),b=epUTC(f.arriveDate,f.arriveTime,f.arriveOff);if(a==null||b==null)return "";let mins=Math.round((b-a)/60000);if(mins<0)return "";const approx=(f.departOff===""||f.arriveOff===""||f.departOff==null||f.arriveOff==null);const h=Math.floor(mins/60),mm=mins%60;return (approx?"~":"")+h+"h "+String(mm).padStart(2,"0")+"m";}
function num(x){const n=parseFloat(String(x==null?"":x).replace(/[, ]/g,""));return isNaN(n)?0:n;}
function money(cur,n){const s=own(SYM,cur)?SYM[cur]:(cur?cur+" ":"");const dec=(cur==="JPY"||cur==="KRW")?0:2;return s+Number(n).toLocaleString("en-US",{minimumFractionDigits:dec,maximumFractionDigits:dec});}
function arrowize(s){return String(s||"").split(/\s*(?:,|→|->)\s*/).map(x=>x.trim()).filter(Boolean).join(" → ");}
function homeLine(dateIso,timeStr,off){const hm=curHome||{};if(hm.off===""||hm.off==null)return null;if(off===""||off==null)return null;if(String(off)===String(hm.off))return null;const utc=epUTC(dateIso,timeStr,off);if(utc==null)return null;const t=utc+(+hm.off)*60000;const d=new Date(t);const p=n=>String(n).padStart(2,"0");return WD[d.getUTCDay()]+" "+p(d.getUTCHours())+":"+p(d.getUTCMinutes())+(hm.label?" "+hm.label:"");}

function SAMPLE(){return {
  eyebrow:"Travel Itinerary",titles:["Lisbon","Porto"],tripStart:"2026-09-18",tripEnd:"2026-09-27",
  showCosts:true,dayGrouped:true,showSummaryPage:true,splitShared:true,theme:"classic",
  baseCurrency:"USD",rates:{HKD:"7.80",MOP:"8.03",EUR:"0.92",GBP:"0.79",JPY:"157",CNY:"7.2",CAD:"1.36",AUD:"1.52",SGD:"1.35",KRW:"1370",THB:"36"},
  people:[{name:"Alex Rivera",homeOff:"-360",homeLabel:"MDT"},{name:"Sam Chen",homeOff:"-420",homeLabel:"PDT"}],
  entities:[
    {type:"flight",owner:"0",carrier:"United",flightNos:"UA0918, UA1450",originCode:"DEN",originName:"Denver",departDate:"2026-09-18",departTime:"16:20",departOff:"-360",departZone:"MDT",destCode:"LIS",destName:"Lisbon",arriveDate:"2026-09-19",arriveTime:"11:05",arriveOff:"60",arriveZone:"WEST",connections:"EWR · 1h 40m",link:"",conf:"UA7Q2LM",cost:"1180.44",currency:"USD",note:"Overnight transatlantic."},
    {type:"flight",owner:"1",carrier:"Delta",flightNos:"DL0244, DL0118",originCode:"SEA",originName:"Seattle",departDate:"2026-09-18",departTime:"13:10",departOff:"-420",departZone:"PDT",destCode:"LIS",destName:"Lisbon",arriveDate:"2026-09-19",arriveTime:"12:50",arriveOff:"60",arriveZone:"WEST",connections:"JFK · 2h 05m",link:"",conf:"DLK83RP",cost:"1342.90",currency:"USD",note:""},
    {type:"hotel",owner:"shared",name:"Hotel Baixa Terrace",area:"Baixa",address:"Rua Áurea 121, Lisbon. Steps from Praça do Comércio; Baixa-Chiado Metro two blocks north.",checkIn:"2026-09-19",checkOut:"2026-09-24",link:"https://maps.google.com/?q=Rua+Aurea+121+Lisbon",conf:"BTL-99120",cost:"940.00",currency:"EUR",note:""},
    {type:"activity",owner:"shared",name:"Tram 28 & Alfama walk",place:"Martim Moniz stop",date:"2026-09-20",time:"10:00",link:"",conf:"",cost:"",currency:"EUR",note:"Board early to beat the queue; ride to Alfama, then wander down to the cathedral."},
    {type:"meal",owner:"shared",name:"Dinner at Cervejaria Ramiro",venue:"Intendente",date:"2026-09-21",time:"20:00",link:"",conf:"",cost:"",currency:"EUR",note:"Seafood; expect a wait. Garlic prawns, then a steak sandwich to finish."},
    {type:"entertainment",owner:"shared",name:"Fado night at Tasca do Chico",venue:"Bairro Alto",date:"2026-09-22",time:"21:30",link:"",conf:"",cost:"",currency:"EUR",note:"Small room, arrive by 21:00 for a seat."},
    {type:"ground",owner:"shared",mode:"private",from:"Lisbon hotel",to:"Santa Apolónia station",date:"2026-09-24",time:"09:30",provider:"Welcome Pickups",link:"",conf:"",cost:"28.00",currency:"EUR",note:"Pre-booked car to the train."},
    {type:"transport",owner:"shared",mode:"Train",from:"Lisbon (Santa Apolónia)",to:"Porto (Campanhã)",date:"2026-09-24",time:"10:30",provider:"CP · Alfa Pendular",link:"",conf:"",cost:"",currency:"EUR",note:"About 3h. Buy Conforto class for the quiet car."},
    {type:"hotel",owner:"shared",name:"Porto Ribeira Suites",area:"Ribeira",address:"Rua da Fonte Taurina 18, Porto. Riverfront; walk to Ponte Luís I in five minutes.",checkIn:"2026-09-24",checkOut:"2026-09-27",link:"",conf:"PRS-4471",cost:"510.00",currency:"EUR",note:""},
    {type:"meal",owner:"shared",name:"Lunch at Cantina 32",venue:"Rua das Flores",date:"2026-09-25",time:"13:00",link:"",conf:"",cost:"",currency:"EUR",note:"Book a day ahead for the terrace."},
    {type:"activity",owner:"shared",name:"Douro Valley wine day",place:"Pinhão",date:"2026-09-26",time:"08:30",link:"",conf:"DV-2261",cost:"190.00",currency:"EUR",note:"Full-day tour: two quintas and a river cruise. Pickup from the hotel lobby."},
    {type:"meeting",owner:"0",name:"Client sync — Porto office",location:"Boavista · video optional",date:"2026-09-25",time:"09:30",endTime:"10:30",withWhom:"Regional team",link:"",conf:"",cost:"",currency:"USD",note:"Keep it short; join from the hotel if the walk runs late."},
    {type:"note",owner:"shared",title:"Reconfirm Douro pickup",body:"Call the operator the evening before to confirm the 08:30 hotel pickup.",date:"2026-09-25",time:"18:00"},
    {type:"meal",owner:"shared",name:"Lunch at Time Out Market",venue:"Cais do Sodré",date:"2026-09-20",time:"13:30",link:"",conf:"",cost:"",currency:"EUR",note:"Grab a shared table; try the Marlene Vieira stall."},
    {type:"note",owner:"shared",title:"Buy Douro tickets online",body:"Reserve the wine-day tour before it sells out for the 26th.",date:"2026-09-19",time:"20:00"},
    {type:"activity",owner:"shared",name:"Belém: Jerónimos & Tower",place:"Belém",date:"2026-09-21",time:"10:00",link:"",conf:"",cost:"",currency:"EUR",note:"Take tram 15 from Praça da Figueira; go early before the coach tours."},
    {type:"meal",owner:"shared",name:"Pastéis de Belém",venue:"Belém",date:"2026-09-21",time:"12:30",link:"",conf:"",cost:"",currency:"EUR",note:"Eat them warm with cinnamon; the queue moves fast."},
    {type:"meal",owner:"shared",name:"Petiscos crawl",venue:"Bairro Alto",date:"2026-09-22",time:"19:00",link:"",conf:"",cost:"",currency:"EUR",note:"A few small plates before the fado show."},
    {type:"activity",owner:"shared",name:"LX Factory browse",place:"Alcântara",date:"2026-09-23",time:"16:00",link:"",conf:"",cost:"",currency:"EUR",note:"Bookshops, design stalls and a coffee under the bridge."},
    {type:"entertainment",owner:"shared",name:"Sunset at Miradouro da Graça",venue:"Graça",date:"2026-09-23",time:"19:00",link:"",conf:"",cost:"",currency:"EUR",note:"Bring a drink; arrive 30 minutes before sundown for a spot."},
    {type:"activity",owner:"shared",name:"Livraria Lello",place:"Porto centre",date:"2026-09-25",time:"10:30",link:"",conf:"",cost:"",currency:"EUR",note:"Buy the timed ticket ahead; the voucher counts toward a book."},
    {type:"meal",owner:"shared",name:"Francesinha at Café Santiago",venue:"Porto centre",date:"2026-09-25",time:"19:30",link:"",conf:"",cost:"",currency:"EUR",note:"The city's signature sandwich; come hungry."},
    {type:"flight",owner:"0",carrier:"United",flightNos:"UA1802, UA0961",originCode:"OPO",originName:"Porto",departDate:"2026-09-27",departTime:"13:40",departOff:"60",departZone:"WEST",destCode:"DEN",destName:"Denver",arriveDate:"2026-09-27",arriveTime:"21:30",arriveOff:"-360",arriveZone:"MDT",connections:"IAD · 1h 15m",link:"",conf:"",cost:"",currency:"USD",note:""},
    {type:"flight",owner:"1",carrier:"Delta",flightNos:"DL0119, DL0245",originCode:"OPO",originName:"Porto",departDate:"2026-09-27",departTime:"15:10",departOff:"60",departZone:"WEST",destCode:"SEA",destName:"Seattle",arriveDate:"2026-09-27",arriveTime:"23:55",arriveOff:"-420",arriveZone:"PDT",connections:"JFK · 1h 55m",link:"",conf:"",cost:"",currency:"USD",note:""}
  ],
  checklistHeading:"Before departure",
  checklist:[
    {title:"Passport & EU entry",body:"Six months validity; no visa needed for a stay under 90 days."},
    {title:"Notify your bank",body:"Set a travel notice so cards work in Portugal without holds."},
    {title:"Download offline maps",body:"Lisbon and Porto tiles for when data is spotty in the old town."},
    {title:"Tram 28 backup",body:"If the queue is long, Tram 12 covers a similar loop with fewer crowds."}
  ],
  emergency:[
    {label:"Hotel Baixa Terrace",value:"+351 21 000 0000"},
    {label:"Porto Ribeira Suites",value:"+351 22 000 0000"},
    {label:"US Embassy Lisbon",value:"+351 21 727 3300"},
    {label:"Travel insurance",value:"Policy WX-4471 · +1 800 000 0000"},
    {label:"ICE contact",value:"Jordan Rivera · +1 720 555 0148"}
  ],
  footer:["All times local","WEST = UTC+1","Rev. 1 · Draft"]
};}
function BLANK(){return {eyebrow:"Travel Itinerary",titles:["Destination"],tripStart:"",tripEnd:"",showCosts:true,dayGrouped:false,showSummaryPage:false,splitShared:false,theme:"classic",baseCurrency:"USD",rates:{},people:[{name:"",homeOff:"",homeLabel:""}],entities:[],checklistHeading:"Before departure",checklist:[],emergency:[],footer:["","",""]};}
let state=SAMPLE();
let curHome={};

/* Single quotes are deliberately not escaped: every attribute emitted by this
   file is double-quoted. If you add one, quote it with " or extend esc(). */
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
/* Lookup keys (theme, currency, item type, ground mode) come from trip data a
   share link controls, so a plain obj[key] can hit an inherited member —
   TYPES["constructor"] is truthy and SYM["constructor"] stringifies a whole
   function into the totals. Every table lookup goes through this. */
function own(o,k){return Object.prototype.hasOwnProperty.call(o,k);}
/* Trip data can arrive from a share link someone else built, so a raw
   href would let `javascript:` run on click. Allow navigable schemes
   only; bare hostnames are promoted to https. Anything else is dropped. */
function safeUrl(u){
  const s=String(u==null?"":u).trim();
  if(!s)return "";
  if(/^(https?|mailto|tel|geo):/i.test(s))return s;
  if(/^[a-z][a-z0-9+.-]*:/i.test(s))return "";
  if(/^[\w.-]+\.[a-z]{2,}(?:[:/?#]|$)/i.test(s))return "https://"+s;
  return "";
}
function inl(s){return esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>");}
function slug(s){return String(s||"itinerary").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,50)||"itinerary";}
/* One data-path is derived from trip data (the per-currency rate inputs), so a
   crafted currency could otherwise steer this walk into Object.prototype. */
const BADKEY=/^(?:__proto__|prototype|constructor)$/;
function setPath(root,path,val){const p=path.split(".");if(p.some(k=>BADKEY.test(k)))return;let o=root;for(let i=0;i<p.length-1;i++){let k=p[i];if(/^\d+$/.test(k))k=+k;if(o[k]==null)o[k]={};o=o[k];}let last=p[p.length-1];if(/^\d+$/.test(last))last=+last;o[last]=val;}
function move(arr,i,d){const j=i+d;if(j<0||j>=arr.length)return;const t=arr[i];arr[i]=arr[j];arr[j]=t;}

/* ===== derivations ===== */
function ents(){return state.entities||[];}
function people(){return (state.people&&state.people.length)?state.people:[{name:""}];}
function multi(){return people().length>1;}
function themeDef(){return own(THEMES,state.theme)?THEMES[state.theme]:THEMES.classic;}
function palette(){return themeDef().palette;}
/* US Letter portrait, fixed: 8.5x11in = 612x792pt = 816x1056 css px. */
const PAGE_WPT=612,PAGE_HPT=792,PAGE_PXH=1056;
function isShared(e){return e.owner==null||e.owner==="shared";}
function listFor(idx){return multi()?ents().filter(e=>{const o=(e.owner==null?"shared":String(e.owner));return o==="shared"||o===String(idx);}):ents();}
function flightsIn(list){return list.filter(e=>e.type==="flight");}
function firstFlight(list){const f=flightsIn(list).slice().sort((a,b)=>(toEpoch(a.departDate,a.departTime)??Infinity)-(toEpoch(b.departDate,b.departTime)??Infinity));return f[0]||null;}
function lastFlight(list){const f=flightsIn(list).slice().sort((a,b)=>(toEpoch(a.arriveDate,a.arriveTime)??-Infinity)-(toEpoch(b.arriveDate,b.arriveTime)??-Infinity));return f[f.length-1]||null;}
function totalNights(list){let n=0;list.forEach(e=>{if(e.type==="hotel")n+=nightsBetween(e.checkIn,e.checkOut);});if(n===0&&state.tripStart&&state.tripEnd)n=nightsBetween(state.tripStart,state.tripEnd);return n;}
function routeLine(list){const f=firstFlight(list);if(!f||!f.originCode||!f.destCode)return "";const lf=lastFlight(list);const home=f.originCode;const round=lf&&lf.destCode===home;const n=totalNights(list);return home+" "+(round?"⇄":"→")+" "+f.destCode+(n?" · "+n+" nights":"");}
function dateRangeStr(){const a=state.tripStart,b=state.tripEnd;if(!a&&!b)return "";if(a&&!b)return fmtLong(a);if(!a&&b)return fmtLong(b);return fmtRange(a,b);}
function statList(list){const out=[];const n=totalNights(list);if(n)out.push({v:String(n),l:"Nights"});const h=list.filter(e=>e.type==="hotel").length;if(h)out.push({v:String(h),l:h===1?"Hotel":"Hotels"});const ff=firstFlight(list),lf=lastFlight(list);if(ff){const e=elapsedStr(ff);if(e)out.push({v:e,l:"Outbound"});}if(lf&&lf!==ff){const e=elapsedStr(lf);if(e)out.push({v:e,l:"Return"});}return out;}
function primaryWhen(e){if(e.type==="flight")return toEpoch(e.departDate,e.departTime);if(e.type==="hotel")return toEpoch(e.checkIn,"15:00");if(e.type==="car")return toEpoch(e.pickupDate,e.pickupTime);return toEpoch(e.date,e.time);}
function labelFor(e){if(e.type==="flight")return (e.carrier||"Air")+(e.originCode&&e.destCode?" "+e.originCode+"–"+e.destCode:"");if(e.type==="hotel")return e.name||"Hotel";if(e.type==="car")return "Rental"+(e.company?" · "+e.company:"");if(e.type==="ground")return (own(MODE,e.mode)?MODE[e.mode]:"Transfer")+(e.to?" · "+e.to:"");if(e.type==="transport")return (e.mode||"Transport")+(e.to?" · "+e.to:"");return e.name||(own(TYPES,e.type)?TYPES[e.type].label:"")||"Item";}

function toBase(cur,amt){const base=state.baseCurrency||"USD";if(cur===base)return amt;const r=state.rates&&state.rates[cur];const rn=parseFloat(r);if(!rn||isNaN(rn))return null;return amt/rn;}
function costData(list){const base=state.baseCurrency||"USD",np=people().length,split=!!state.splitShared&&np>1;const rows=[],totals={};let baseSum=0,missing=false;
  list.forEach(e=>{let c=num(e.cost);if(c<=0)return;const cur=e.currency||"USD";let disp=c,note="";if(split&&isShared(e)){disp=c/np;note=" (1/"+np+")";}rows.push({label:labelFor(e)+note,cur,amount:money(cur,disp)});totals[cur]=(totals[cur]||0)+disp;const b=toBase(cur,disp);if(b==null)missing=true;else baseSum+=b;});
  return {rows,tot:Object.keys(totals).map(cur=>({cur,amount:money(cur,totals[cur])})),base,baseSum,missing,any:rows.length>0};}
function tripCost(){const base=state.baseCurrency||"USD",totals={};let baseSum=0,missing=false;ents().forEach(e=>{const c=num(e.cost);if(c<=0)return;const cur=e.currency||"USD";totals[cur]=(totals[cur]||0)+c;const b=toBase(cur,c);if(b==null)missing=true;else baseSum+=b;});return {tot:Object.keys(totals).map(cur=>({cur,amount:money(cur,totals[cur])})),base,baseSum,missing};}

function tsmall(code,time,zone){const t=time?(time+(zone?" "+zone:"")):"";return [code,t].filter(Boolean).join(" · ");}
function nodesFor(e,id){
  const L=(lead,leadText,text,mono,alt)=>({lead,leadText,text,mono:!!mono,alt:!!alt});
  if(e.type==="flight"){
    const dep={id:id+"d",when:toEpoch(e.departDate,e.departTime),stamp:fmtStamp(e.departDate),title:"Depart "+(e.originName||e.originCode||"—"),titleSmall:tsmall(e.originCode,e.departTime,e.departZone),nodeFill:true,lines:[],link:e.link,meta:{ff:e,end:"dep"}};
    if(e.carrier||e.flightNos)dep.lines.push(L("key",e.carrier||"Flight",arrowize(e.flightNos),true,false));
    if(e.connections)dep.lines.push(L("key","Via",e.connections,false,false));
    if(e.note)dep.lines.push(L("key","Note",e.note,false,false));
    {const hl=homeLine(e.departDate,e.departTime,e.departOff);if(hl)dep.lines.push(L("key","Home",hl,false,true));}
    const arr={id:id+"a",when:toEpoch(e.arriveDate,e.arriveTime),stamp:fmtStamp(e.arriveDate),title:"Arrive "+(e.destName||e.destCode||"—"),titleSmall:tsmall(e.destCode,e.arriveTime,e.arriveZone),nodeFill:true,lines:[],meta:{ff:e,end:"arr"}};
    {const hl=homeLine(e.arriveDate,e.arriveTime,e.arriveOff);if(hl)arr.lines.push(L("key","Home",hl,false,true));}
    return [dep,arr];
  }
  if(e.type==="hotel"){const nt=nightsBetween(e.checkIn,e.checkOut);const node={id:id,when:toEpoch(e.checkIn,"15:00"),stamp:(dayNum(e.checkIn)&&dayNum(e.checkOut))?dayNum(e.checkIn)+" – "+dayNum(e.checkOut):fmtStamp(e.checkIn),title:e.name||"Hotel",titleSmall:[nt?nt+(nt===1?" night":" nights"):"",e.area].filter(Boolean).join(" · "),nodeFill:false,lines:[],link:e.link};if(e.address)node.lines.push(L("none","",e.address));if(e.note)node.lines.push(L("key","Note",e.note));return [node];}
  if(e.type==="car"){const node={id:id,when:toEpoch(e.pickupDate,e.pickupTime),stamp:fmtStamp(e.pickupDate),title:"Rental car"+(e.company?" · "+e.company:""),titleSmall:e.pickupTime||"",nodeFill:true,lines:[],link:e.link};if(e.pickupPlace)node.lines.push(L("key","Pick-up",e.pickupPlace));if(e.dropoffPlace||e.dropoffDate)node.lines.push(L("key","Drop-off",[e.dropoffPlace,e.dropoffDate?fmtStamp(e.dropoffDate):"",e.dropoffTime].filter(Boolean).join(" · ")));if(e.note)node.lines.push(L("none","",e.note));return [node];}
  if(e.type==="ground"){const node={id:id,when:toEpoch(e.date,e.time),stamp:fmtStamp(e.date),title:(e.from&&e.to)?e.from+" → "+e.to:(e.from||e.to||"Transfer"),titleSmall:e.time||"",nodeFill:true,lines:[],link:e.link};node.lines.push(L("badge",own(MODE,e.mode)?MODE[e.mode]:"Taxi",e.note||""));if(e.provider)node.lines.push(L("key","Via",e.provider));return [node];}
  if(e.type==="entertainment"){const node={id:id,when:toEpoch(e.date,e.time),stamp:fmtStamp(e.date),title:e.name||"Entertainment",titleSmall:[e.venue,e.time].filter(Boolean).join(" · "),nodeFill:true,lines:[],link:e.link};if(e.note)node.lines.push(L("none","",e.note));return [node];}
  if(e.type==="meal"){const node={id:id,when:toEpoch(e.date,e.time),stamp:fmtStamp(e.date),title:e.name||"Meal",titleSmall:[e.time,e.venue].filter(Boolean).join(" · "),nodeFill:false,lines:[],link:e.link};if(e.note)node.lines.push(L("none","",e.note));return [node];}
  if(e.type==="transport"){const node={id:id,when:toEpoch(e.date,e.time),stamp:fmtStamp(e.date),title:(e.from&&e.to)?e.from+" → "+e.to:(e.from||e.to||"Transport"),titleSmall:e.time||"",nodeFill:true,lines:[],link:e.link};node.lines.push(L("badge",e.mode||"Transport",e.note||""));if(e.provider)node.lines.push(L("key","Via",e.provider));return [node];}
  if(e.type==="meeting"){const node={id:id,when:toEpoch(e.date,e.time),stamp:fmtStamp(e.date),title:e.name||"Meeting",titleSmall:[e.location,[e.time,e.endTime].filter(Boolean).join("–")].filter(Boolean).join(" · "),nodeFill:true,lines:[],link:e.link};if(e.withWhom)node.lines.push(L("key","With",e.withWhom));if(e.note)node.lines.push(L("none","",e.note));return [node];}
  if(e.type==="tour"){const node={id:id,when:toEpoch(e.date,e.time),stamp:fmtStamp(e.date),title:e.name||"Tour",titleSmall:[e.place,e.time].filter(Boolean).join(" · "),nodeFill:true,lines:[],link:e.link};if(e.provider)node.lines.push(L("key","Operator",e.provider));if(e.note)node.lines.push(L("none","",e.note));return [node];}
  if(e.type==="note"){const node={id:id,when:toEpoch(e.date,e.time),stamp:fmtStamp(e.date),title:e.title||"Note",titleSmall:e.time||"",nodeFill:false,lines:[]};if(e.body)node.lines.push(L("none","",e.body));return [node];}
  const node={id:id,when:toEpoch(e.date,e.time),stamp:fmtStamp(e.date),title:e.name||"Activity",titleSmall:[e.place,e.time].filter(Boolean).join(" · "),nodeFill:true,lines:[],link:e.link};if(e.note)node.lines.push(L("badge","Route",e.note));return [node];
}
function journeyNodes(list){let nodes=[];list.forEach((e,i)=>{nodesFor(e,"n"+i).forEach((n,k)=>{n._ord=i*10+k;nodes.push(n);});});nodes.sort((a,b)=>{const wa=a.when??Infinity,wb=b.when??Infinity;return wa-wb||a._ord-b._ord;});const ff=firstFlight(list),lf=lastFlight(list);if(ff){const idx=nodes.findIndex(n=>n.meta&&n.meta.ff===ff&&n.meta.end==="dep");if(idx>0){const [x]=nodes.splice(idx,1);nodes.unshift(x);}}if(lf){const idx=nodes.findIndex(n=>n.meta&&n.meta.ff===lf&&n.meta.end==="arr");if(idx>-1&&idx<nodes.length-1){const [x]=nodes.splice(idx,1);nodes.push(x);}}const pal=palette();nodes.forEach((n,i)=>{n.color=pal[i%pal.length];});return nodes;}
function confList(list){const rows=[];list.slice().map((e,i)=>({e,w:primaryWhen(e)??Infinity,i})).sort((a,b)=>a.w-b.w||a.i-b.i).forEach(({e})=>{if(!e.conf)return;let sub="",cap="";if(e.type==="flight"){sub="Air"+(e.carrier?" · "+e.carrier:"");cap=[e.originCode,e.destCode].filter(Boolean).join(" → ");}else if(e.type==="hotel"){const nt=nightsBetween(e.checkIn,e.checkOut);sub="Hotel · "+(e.name||"");cap=[fmtStamp(e.checkIn),fmtStamp(e.checkOut)].filter(Boolean).join(" – ")+(nt?" · "+nt+" nights":"");}else if(e.type==="car"){sub="Car"+(e.company?" · "+e.company:"");cap=[e.pickupPlace,e.dropoffPlace].filter(Boolean).join(" → ");}else if(e.type==="ground"){sub=(own(MODE,e.mode)?MODE[e.mode]:"Transfer")+(e.provider?" · "+e.provider:"");cap=[e.from,e.to].filter(Boolean).join(" → ");}else if(e.type==="entertainment"){sub="Show · "+(e.name||"");cap=[fmtStamp(e.date),e.venue].filter(Boolean).join(" · ");}else if(e.type==="meal"){sub="Dining · "+(e.name||"");cap=[fmtStamp(e.date),e.time].filter(Boolean).join(" · ");}else if(e.type==="transport"){sub=(e.mode||"Transport")+(e.provider?" · "+e.provider:"");cap=[e.from,e.to].filter(Boolean).join(" → ");}else if(e.type==="meeting"){sub="Meeting · "+(e.name||"");cap=[fmtStamp(e.date),e.location].filter(Boolean).join(" · ");}else if(e.type==="tour"){sub="Tour · "+(e.name||"");cap=[fmtStamp(e.date),e.provider].filter(Boolean).join(" · ");}else{sub="Activity · "+(e.name||"");cap=[fmtStamp(e.date),e.place].filter(Boolean).join(" · ");}rows.push({sub,val:e.conf,cap});});return rows;}

/* ===== output ===== */
function titleFont(len){if(len<=14)return 34;if(len<=20)return 29;if(len<=28)return 24;if(len<=38)return 20;if(len<=52)return 17;return 15;}
function renderLine(ln){let lead="";if(ln.lead==="badge"&&ln.leadText)lead='<span class="pref">'+esc(ln.leadText)+'</span>';else if(ln.lead==="key"&&ln.leadText)lead='<span class="k">'+esc(ln.leadText)+'</span>';const body=ln.mono?'<span class="mono">'+inl(ln.text)+'</span>':inl(ln.text);return '<p'+(ln.alt?' class="alt"':'')+'>'+lead+body+'</p>';}
function renderNode(n){const fill=n.nodeFill?" node-fill":"";const small=n.titleSmall?' <small>'+esc(n.titleSmall)+'</small>':"";const href=safeUrl(n.link);const tt=href?'<a href="'+esc(href)+'" style="color:inherit;text-decoration:none">'+esc(n.title)+'</a>':esc(n.title);const det=n.lines.length?'\n        <div class="detail">'+n.lines.map(renderLine).join("\n        ")+'</div>':"";return '<div class="leg'+fill+'" style="--seg:'+n.color+'">\n        <div class="leg-head"><span class="stamp">'+esc(n.stamp)+'</span><span class="title">'+tt+small+'</span></div>'+det+'\n      </div>';}
function dayHead(n,when){let lbl="Unscheduled";if(when!=null){const dt=new Date(when);lbl=WD[dt.getDay()]+" "+dt.getDate()+" "+MONT[dt.getMonth()];}return '<div class="dayhead"><span class="dn">Day '+n+'</span><span class="dd">'+esc(lbl)+'</span></div>';}
function dayKey(when){if(when==null)return "u";const dt=new Date(when);return dt.getFullYear()+"-"+dt.getMonth()+"-"+dt.getDate();}
function renderSpine(nodes,grouped){if(!grouped)return nodes.map(renderNode).join("\n\n      ");let out=[],last=null,dn=0;nodes.forEach(n=>{const k=dayKey(n.when);if(k!==last){last=k;dn++;out.push(dayHead(dn,n.when));}out.push(renderNode(n));});return out.join("\n\n      ");}

function mastTitles(s){const titles=(s.titles||[]).map(t=>String(t||"").trim()).filter(Boolean);return {fs:titleFont(titles.join("").length),html:titles.map(esc).join('<span class="sep">/</span>'),plain:titles.join(" / ")};}
function statStrip(stats){return stats.length?'<div class="stats">'+stats.map(x=>'<div class="stat"><b>'+esc(x.v)+'</b><span>'+esc(x.l)+'</span></div>').join("")+'</div>':"";}
function railChecklist(s){if(!(s.checklist||[]).length)return "";const items=s.checklist.map(it=>{const tb=it.title?'<b>'+inl(it.title)+'</b> ':"";return '<li>'+tb+inl(it.body)+'</li>';}).join("\n        ");return '<h2>'+esc(s.checklistHeading||"Before departure")+'</h2>\n      <ul class="chk">\n        '+items+'\n      </ul>\n\n      ';}
function railReference(s){const ref=(s.emergency||[]).filter(x=>x&&(x.label||x.value));if(!ref.length)return "";return '<h2>Reference</h2>\n      '+ref.map(x=>'<div class="rec"><div class="rec-s">'+esc(x.label)+'</div><div class="rec-t">'+esc(x.value)+'</div></div>').join("\n      ")+'\n\n      ';}
function costTable(cd,heading){if(!cd.any&&!(cd.tot&&cd.tot.length))return "";let t='<h2>'+esc(heading)+'</h2>\n      <table class="cost">\n        ';if(cd.rows)t+=cd.rows.map(r=>'<tr><td>'+esc(r.label)+'<span class="sub">'+esc(r.cur)+'</span></td><td>'+esc(r.amount)+'</td></tr>').join("\n        ");
  if(cd.tot.length===1&&cd.tot[0].cur===cd.base){t+='\n        <tr class="tot"><td>Total · '+esc(cd.base)+'</td><td>'+esc(cd.tot[0].amount)+'</td></tr>';}
  else{cd.tot.forEach(tt=>{t+='\n        <tr><td>Subtotal · '+esc(tt.cur)+'</td><td>'+esc(tt.amount)+'</td></tr>';});t+='\n        <tr class="tot"><td>Total · '+esc(cd.base)+(cd.missing?' *':'')+'</td><td>≈ '+esc(money(cd.base,cd.baseSum))+'</td></tr>';}
  t+='\n      </table>';if(cd.missing)t+='\n      <p style="font-family:var(--mono);font-size:8px;color:var(--faint);letter-spacing:.03em;margin-top:5px;line-height:1.4">* Some currencies have no exchange rate set; total is partial.</p>';return t+'\n\n      ';}

function buildSheet(s,list,eyebrowText,home){
  curHome=home||{};
  const mt=mastTitles(s),dr=dateRangeStr(),rl=routeLine(list);
  const mastR=(dr||rl)?'<div class="mast-r">'+(dr?'<div class="daterange">'+esc(dr)+'</div>':'')+(rl?'<div class="mast-meta">'+esc(rl)+'</div>':'')+'</div>':'';
  const main='<main>\n      <h2>Journey</h2>\n      <div class="spine">\n      '+renderSpine(journeyNodes(list),s.dayGrouped)+'\n      </div>\n    </main>';
  const confs=confList(list);
  let rail="";
  if(confs.length)rail+='<h2>Confirmations</h2>\n      '+confs.map(c=>'<div class="rec"><div class="rec-s">'+esc(c.sub)+'</div><div class="rec-v">'+esc(c.val)+'</div><div class="rec-c">'+esc(c.cap)+'</div></div>').join("\n      ")+'\n\n      ';
  if(s.showCosts){const cd=costData(list);if(cd.any)rail+=costTable(cd,"Booked cost");}
  rail+=railChecklist(s)+railReference(s);
  const ft=s.footer||["","",""];
  const foot='<footer><span>'+esc(ft[0]||"")+'</span><span>'+esc(ft[1]||"")+'</span><span>'+esc(ft[2]||"")+'</span></footer>';
  return '<section class="sheet" data-run="'+esc(mt.plain)+'" data-runmeta="'+esc(eyebrowText)+'">\n\n  <div class="mast"><div><div class="eyebrow">'+esc(eyebrowText)+'</div><h1 style="font-size:'+mt.fs+'px">'+mt.html+'</h1></div>'+mastR+'</div>\n\n  '+statStrip(statList(list))+'\n\n  <div class="cols">\n\n    '+main+'\n\n    <aside class="rail">\n\n      '+rail+'\n\n    </aside>\n  </div>\n\n  '+foot+'\n\n</section>';
}
function buildCover(s){
  curHome={};
  const mt=mastTitles(s),dr=dateRangeStr(),ppl=people();
  const sharedList=ents().filter(isShared);
  const stats=[];const n=totalNights(sharedList);if(n)stats.push({v:String(n),l:"Nights"});const h=sharedList.filter(e=>e.type==="hotel").length;if(h)stats.push({v:String(h),l:h===1?"Hotel":"Hotels"});stats.push({v:String(ppl.length),l:"Travelers"});
  const mastR='<div class="mast-r">'+(dr?'<div class="daterange">'+esc(dr)+'</div>':'')+'<div class="mast-meta">'+ppl.length+' travelers</div></div>';
  const main='<main>\n      <h2>Shared plan</h2>\n      <div class="spine">\n      '+renderSpine(journeyNodes(sharedList),s.dayGrouped)+'\n      </div>\n    </main>';
  let rail='<h2>Travelers</h2>\n      '+ppl.map((p,idx)=>{const list=listFor(idx);const rl=routeLine(list);const st=statList(list).filter(x=>x.l==="Outbound"||x.l==="Return").map(x=>x.l+" "+x.v).join(" · ");return '<div class="rec"><div class="rec-s">'+esc(p.name||("Traveler "+(idx+1)))+'</div><div class="rec-t">'+esc(rl||"—")+'</div><div class="rec-c">'+esc(st)+'</div></div>';}).join("\n      ")+'\n\n      ';
  if(s.showCosts){const tc=tripCost();if(tc.tot.length)rail+=costTable({rows:null,tot:tc.tot,base:tc.base,baseSum:tc.baseSum,missing:tc.missing,any:true},"Trip cost");}
  rail+=railChecklist(s)+railReference(s);
  const ft=s.footer||["","",""];
  const foot='<footer><span>'+esc(ft[0]||"")+'</span><span>'+esc(ft[1]||"")+'</span><span>Overview</span></footer>';
  return '<section class="sheet" data-run="'+esc(mt.plain)+'" data-runmeta="'+esc(s.eyebrow+" · Overview")+'">\n\n  <div class="mast"><div><div class="eyebrow">'+esc(s.eyebrow+" · Overview")+'</div><h1 style="font-size:'+mt.fs+'px">'+mt.html+'</h1></div>'+mastR+'</div>\n\n  '+statStrip(stats)+'\n\n  <div class="cols">\n\n    '+main+'\n\n    <aside class="rail">\n\n      '+rail+'\n\n    </aside>\n  </div>\n\n  '+foot+'\n\n</section>';
}
function buildBody(s){const ppl=people(),mm=ppl.length>1;let sheets=[];if(mm&&s.showSummaryPage)sheets.push(buildCover(s));ppl.forEach((p,idx)=>{const list=mm?listFor(idx):ents();const eb=s.eyebrow+(p.name?" · "+p.name:"");sheets.push(buildSheet(s,list,eb,{off:p.homeOff,label:p.homeLabel}));});return sheets.join("\n\n");}

/* ═══════ paginator ═══════════════════════════════════════════
   Injected into, and executed inside, the generated document —
   preview, print and PDF all consume the same paginated result,
   so what you see is exactly what comes out.

   It moves the journey legs and rail blocks out of the flowing
   .sheet source and greedily packs them into fixed-height .page
   boxes, measuring real rendered heights after webfonts settle.
   A block is only placed if it still fits; otherwise it starts
   the next page intact. Checklists and cost tables are the one
   exception — those split by row, since a 20-item list would
   otherwise strand most of a page.

   Output is always US Letter portrait.                        */
const PAGINATOR=`(function(){
var D=document,root=D.documentElement,GUARD=400,OVERSIZE=0;

function el(t,c){var e=D.createElement(t);if(c)e.className=c;return e;}
function overflows(box){return box.scrollHeight>box.clientHeight+0.5;}
function isHead(e){return e.tagName==="H2"||(e.classList&&e.classList.contains("dayhead"));}
function lastHead(host,sel){var h=host.querySelectorAll(sel+":not([data-cont])");return h.length?h[h.length-1]:null;}
function contClone(src){
  var c=src.cloneNode(true);c.setAttribute("data-cont","1");
  var t=c.classList.contains("dayhead")?c.querySelector(".dd"):c;
  if(t)t.textContent=t.textContent+" (cont.)";
  return c;
}

/* Row-splittable blocks: everything else stays atomic. */
function splitSrc(b){
  if(b.tagName==="UL"&&b.classList.contains("chk"))return b;
  if(b.tagName==="TABLE"&&b.classList.contains("cost"))return b.tBodies[0]||b;
  return null;
}
function trySplit(b,host,fits){
  var src=splitSrc(b);if(!src)return 0;
  var kids=[].slice.call(src.children);if(kids.length<2)return 0;
  var head=b.cloneNode(false),sink=head;
  if(b.tagName==="TABLE"){sink=D.createElement("tbody");head.appendChild(sink);}
  host.appendChild(head);
  var n=0;
  for(var i=0;i<kids.length;i++){
    sink.appendChild(kids[i]);
    if(!fits()){sink.removeChild(kids[i]);break;}
    n++;
  }
  for(var j=n;j<kids.length;j++)src.appendChild(kids[j]);   /* un-taken rows go back */
  if(!n){host.removeChild(head);return 0;}
  return n;
}

function fill(queue,host,box){
  var placed=0;
  while(queue.length){
    var b=queue[0];
    host.appendChild(b);
    if(!overflows(box)){queue.shift();placed++;continue;}
    host.removeChild(b);
    var n=trySplit(b,host,function(){return !overflows(box);});
    if(n){placed++;var s=splitSrc(b);if(s&&!s.children.length)queue.shift();}
    /* Taller than a whole page even on its own — place it and count it,
       so the builder can warn that the tail is clipped. */
    else if(!placed){host.appendChild(b);queue.shift();placed++;OVERSIZE++;}
    break;
  }
  var last=host.lastElementChild;                                  /* no stranded headings */
  if(last&&queue.length&&isHead(last)&&placed>1){host.removeChild(last);queue.unshift(last);placed--;}
  return placed;
}

function runHead(t,m){
  var h=el("div","runhead"),a=el("span","rt"),b=el("span","rm");
  a.textContent=t||"";b.textContent=(m?m+" · ":"")+"continued";
  h.appendChild(a);h.appendChild(b);return h;
}
function makePage(mast,stats,mainH2,foot,rt,rm){
  var pg=el("section","page");
  pg.appendChild(mast||runHead(rt,rm));
  if(stats)pg.appendChild(stats);
  var cols=el("div","cols"),m=el("main"),sp=el("div","spine"),r=el("aside","rail");
  if(mainH2)m.appendChild(mainH2);
  m.appendChild(sp);cols.appendChild(m);cols.appendChild(r);pg.appendChild(cols);
  var f=foot?foot.cloneNode(true):el("footer");
  f.appendChild(el("span","pgno"));pg.appendChild(f);
  return pg;
}
/* The columns must have a definite height for scrollHeight to
   mean "overflowing", so pin them once the chrome is in place. */
function lockCols(pg){
  var cols=pg.querySelector(".cols");
  var h=cols.clientHeight-(parseFloat(getComputedStyle(cols).paddingTop)||0);
  if(!(h>0))h=1;
  pg.querySelector("main").style.height=h+"px";
  pg.querySelector(".rail").style.height=h+"px";
}

function layoutSheet(sh){
  var mast=sh.querySelector(".mast"),stats=sh.querySelector(".stats"),foot=sh.querySelector("footer");
  var mainH2=sh.querySelector("main > h2"),spine=sh.querySelector("main .spine"),rail=sh.querySelector(".rail");
  var mq=spine?[].slice.call(spine.children):[];
  var rq=rail?[].slice.call(rail.children):[];
  var rt=sh.getAttribute("data-run")||"",rm=sh.getAttribute("data-runmeta")||"";
  var out=[],first=true,curDay=null,curSec=null,guard=0;
  while(guard++<GUARD){
    var pg=makePage(first?mast:null,first?stats:null,first?mainH2:null,foot,rt,rm);
    D.body.appendChild(pg);
    lockCols(pg);
    var m=pg.querySelector("main"),sp=pg.querySelector(".spine"),r=pg.querySelector(".rail");
    if(!first){                                    /* carry headings across the break */
      if(curDay&&mq.length&&!mq[0].classList.contains("dayhead"))sp.appendChild(contClone(curDay));
      if(curSec&&rq.length&&rq[0].tagName!=="H2")r.appendChild(contClone(curSec));
    }
    fill(mq,sp,m);
    fill(rq,r,r);
    curDay=lastHead(sp,".dayhead")||curDay;
    curSec=lastHead(r,"h2")||curSec;
    out.push(pg);first=false;
    if(!mq.length&&!rq.length)break;
  }
  return out;
}

function paginate(){
  var sheets=[].slice.call(D.querySelectorAll("section.sheet"));
  if(!sheets.length)return 0;
  var pages=[];
  sheets.forEach(function(sh){pages=pages.concat(layoutSheet(sh));});
  sheets.forEach(function(sh){sh.remove();});
  pages.forEach(function(p,i){
    var n=p.querySelector(".pgno");
    if(n)n.textContent="Page "+(i+1)+" of "+pages.length;
  });
  return pages.length;
}

/* Must be the real content height, not root.scrollHeight — that returns
   max(content, viewport), so it would just echo back whatever height the
   host already gave the iframe and the frame could never shrink. body is
   height:auto with no margins, so its border box is exactly the content. */
function contentHeight(){
  var h=D.body.getBoundingClientRect().height;
  return Math.ceil(h>0?h:root.scrollHeight);
}
function go(){
  var n=0;
  try{n=paginate();}
  catch(e){root.classList.remove("paginating");n=D.querySelectorAll(".sheet").length;}
  root.setAttribute("data-paginated","1");
  /* ITIN_ORIGIN is stamped in by wrapDoc so the report goes to the builder and
     nowhere else — this frame is sandboxed and cannot read it for itself. */
  try{parent.postMessage({itin:"paginated",pages:n,over:OVERSIZE,height:contentHeight()},ITIN_ORIGIN);}catch(e){}
}
var fired=false;
function once(){if(fired)return;fired=true;requestAnimationFrame(go);}
setTimeout(once,3000);                             /* fonts.ready can hang offline */
if(D.fonts&&D.fonts.ready)D.fonts.ready.then(once,once);else once();
})();`;

function extraCss(){const th=themeDef();const varOv=Object.keys(th.vars).length?':root{'+Object.keys(th.vars).map(k=>k+":"+th.vars[k]).join(";")+'}':'';
  const dh='.dayhead{margin:6px 0 11px -26px;padding-bottom:5px;border-bottom:1px solid var(--rule);display:flex;align-items:baseline;gap:9px}.dayhead .dn{font-family:var(--mono);font-size:8px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}.dayhead .dd{font-family:var(--cond);font-weight:700;font-size:13px;letter-spacing:.01em}.leg+.dayhead{margin-top:14px}';
  const page='html[data-print] .page{box-shadow:none;margin:0}';
  return '<style>'+varOv+dh+page+'</style>';}
/* Opened from file://, location.origin is "null" and no targetOrigin can match,
   so fall back to "*" there. The payload is a page count and a height. */
function postTarget(){const o=location.origin;return (o&&o!=="null")?o:"*";}
function wrapDoc(bodyHtml,titleText){const css=document.getElementById("itin-css").textContent;
  return '<!DOCTYPE html>\n<html lang="en" class="paginating">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="color-scheme" content="light only">\n<title>'+esc(titleText)+'</title>\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">\n<style>\n'+css+'\n</style>\n'+extraCss()+'\n</head>\n<body>\n'+bodyHtml+'\n<script>var ITIN_ORIGIN='+JSON.stringify(postTarget())+';\n'+PAGINATOR+'<\/script>\n</body>\n</html>';}
function docTitle(){const t=(state.titles||[]).filter(x=>x&&x.trim()).join(" & ");return t+(dateRangeStr()?" — "+dateRangeStr():"");}
function buildDoc(s){return wrapDoc(buildBody(s),docTitle());}
function buildDocFor(idx){const ppl=people();const list=ppl.length>1?listFor(idx):ents();const eb=state.eyebrow+(ppl[idx].name?" · "+ppl[idx].name:"");return wrapDoc(buildSheet(state,list,eb,{off:ppl[idx].homeOff,label:ppl[idx].homeLabel}),docTitle()+(ppl[idx].name?" · "+ppl[idx].name:""));}

/* ===== preview ===== */
const frame=document.getElementById("frame"),pvwrap=document.getElementById("pvwrap"),
      scaleTag=document.getElementById("scaleTag"),pageTag=document.getElementById("pageTag"),
      warnTag=document.getElementById("warnTag");
let pvTimer=null,lastH=1056;
/* The iframe is always given more height than the document needs, so the
   preview never grows its own scrollbar — the outer .preview pane does all
   the scrolling. The slack shows the document's own page background, which
   .preview matches, so the seam is invisible. */
const FRAME_SLACK=48;
/* Preview iframe width: 816px paper + 16px slack each side, so the paper's
   drop-shadow shows on the right as it does on the left. Matches #frame in
   css/app.css. */
const FRAME_W=848;
function applyScale(){
  const w=pvwrap.clientWidth,sc=Math.min(1,w/FRAME_W),h=lastH+FRAME_SLACK;
  frame.style.transform="scale("+sc+")";
  frame.style.height=h+"px";
  pvwrap.style.height=(h*sc)+"px";
  scaleTag.textContent=Math.round(sc*100)+"%";
}
/* Pre-pagination estimate only; the paginator's report supersedes it.
   Measures body, not documentElement, for the same reason contentHeight() does.
   The preview frame is sandboxed into its own origin, so contentDocument reads
   as null there and this contributes nothing — the postMessage height is what
   drives the preview. It still helps on any non-sandboxed frame. */
function measureFrame(){try{const b=frame.contentDocument&&frame.contentDocument.body;if(b)lastH=Math.ceil(b.getBoundingClientRect().height)||lastH;}catch(e){}applyScale();}

/* The document paginates itself and reports back; every consumer
   (preview, print, PDF) waits for that before measuring or capturing. */
function whenPaginated(iframe,html,timeout){
  return new Promise(function(res){
    let done=false;
    const timer=setTimeout(function(){finish(null);},timeout||12000);
    function finish(d){if(done)return;done=true;clearTimeout(timer);window.removeEventListener("message",onMsg);res(d);}
    function onMsg(ev){const d=ev.data;if(d&&d.itin==="paginated"&&ev.source===iframe.contentWindow)finish(d);}
    window.addEventListener("message",onMsg);
    iframe.srcdoc=html;
  });
}
window.addEventListener("message",function(ev){
  const d=ev.data;
  if(!d||d.itin!=="paginated"||ev.source!==frame.contentWindow)return;
  lastH=d.height||lastH;applyScale();
  if(pageTag)pageTag.textContent=d.pages?d.pages+(d.pages===1?" page":" pages"):"";
  // An item taller than a whole page can't be broken cleanly, so its tail
  // is clipped. Say so rather than losing the text quietly.
  if(warnTag)warnTag.textContent=d.over?("⚠ "+d.over+" item"+(d.over===1?" is":"s are")+" too long for one page — text is clipped"):"";
});
function refreshPreview(){frame.srcdoc=buildDoc(state);}
frame.addEventListener("load",measureFrame);
function saveDraft(){try{localStorage.setItem("itin-draft-v4",JSON.stringify(state));}catch(e){}}
function schedulePreview(){clearTimeout(pvTimer);pvTimer=setTimeout(()=>{refreshPreview();saveDraft();},180);}
window.addEventListener("resize",applyScale);

/* ===== form ===== */
const form=document.getElementById("form");
function inp(path,val,ph,mono){return '<input class="f'+(mono?" mono":"")+'" data-path="'+path+'" value="'+esc(val)+'" placeholder="'+esc(ph||"")+'">';}
function area(path,val,ph){return '<textarea class="f" data-path="'+path+'" placeholder="'+esc(ph||"")+'">'+esc(val)+'</textarea>';}
function dateF(path,val){return '<input type="date" class="f" data-path="'+path+'" value="'+esc(val)+'">';}
function timeF(path,val){return '<input type="time" class="f" data-path="'+path+'" value="'+esc(val)+'">';}
function sel(path,val,opts){const o=opts.map(op=>{const v=Array.isArray(op)?op[0]:op,t=Array.isArray(op)?op[1]:op;return '<option value="'+esc(v)+'"'+(String(v)===String(val)?" selected":"")+'>'+esc(t)+'</option>';}).join("");return '<select class="f" data-path="'+path+'">'+o+'</select>';}
function chk(path,val,label){return '<label class="ck"><input type="checkbox" data-path="'+path+'"'+(val?" checked":"")+'> '+esc(label)+'</label>';}
function fld(lb,ctl,wide){return '<div class="field'+(wide?" wide":"")+'"><label class="lb">'+lb+'</label>'+ctl+'</div>';}
function ibtn(act,i,sym,cls,dis){return '<button class="ic'+(cls?" "+cls:"")+'" data-act="'+act+'" data-i="'+i+'"'+(dis?" disabled":"")+'>'+sym+'</button>';}
function ownerOpts(){return [["shared","Both / all travelers"]].concat(people().map((p,idx)=>[String(idx),p.name||("Traveler "+(idx+1))]));}

function tail(e,i){const p="entities."+i;let h='<div class="grid three">'+fld("Confirmation",inp(p+".conf",e.conf,"Code",true))+fld("Cost",inp(p+".cost",e.cost,"0.00"))+fld("Currency",sel(p+".currency",e.currency||"USD",CURRENCIES))+'</div>';h+=fld("Link (map / booking)",inp(p+".link",e.link,"https://…"),true);h+=fld("Note",area(p+".note",e.note,"Optional detail. **bold** supported."),true);return h;}
function entityCard(e,i){
  const p="entities."+i,tm=own(TYPES,e.type)?TYPES[e.type]:{label:e.type,c:"#666"};
  let h='<div class="card" style="border-left-color:'+tm.c+'"><div class="card-h"><span class="tag" style="background:'+tm.c+'">'+esc(tm.label)+'</span><span class="sp"></span>'+ibtn("ent-del",i,"✕","del")+'</div>';
  if(multi())h+=fld("Traveler",sel(p+".owner",e.owner||"shared",ownerOpts()),true);
  if(e.type==="flight"){
    h+='<div class="sub-h">Departure</div><div class="grid three">'+fld("From code",inp(p+".originCode",e.originCode,"DEN"))+fld("From city",inp(p+".originName",e.originName,"Denver"))+fld("Zone label",inp(p+".departZone",e.departZone,"MDT"))+'</div>';
    h+='<div class="grid three">'+fld("Depart date",dateF(p+".departDate",e.departDate))+fld("Depart time",timeF(p+".departTime",e.departTime))+fld("UTC offset",sel(p+".departOff",e.departOff,OFFSETS))+'</div>';
    h+='<div class="sub-h">Arrival</div><div class="grid three">'+fld("To code",inp(p+".destCode",e.destCode,"LIS"))+fld("To city",inp(p+".destName",e.destName,"Lisbon"))+fld("Zone label",inp(p+".arriveZone",e.arriveZone,"WEST"))+'</div>';
    h+='<div class="grid three">'+fld("Arrive date",dateF(p+".arriveDate",e.arriveDate))+fld("Arrive time",timeF(p+".arriveTime",e.arriveTime))+fld("UTC offset",sel(p+".arriveOff",e.arriveOff,OFFSETS))+'</div>';
    h+='<div class="grid">'+fld("Carrier",inp(p+".carrier",e.carrier,"United"))+fld("Flight numbers",inp(p+".flightNos",e.flightNos,"UA0918, UA1450",true))+'</div>';
    h+=fld("Connections / layover",inp(p+".connections",e.connections,"EWR · 1h 40m"),true);
    h+='<div class="hint">Flight numbers: comma-separated, displayed with arrows. Set both UTC offsets for an exact elapsed time; the zone label is just for display.</div>';
    h+=tail(e,i);
  } else if(e.type==="hotel"){
    h+=fld("Name",inp(p+".name",e.name,"Hotel name"),true)+'<div class="grid">'+fld("Check-in",dateF(p+".checkIn",e.checkIn))+fld("Check-out",dateF(p+".checkOut",e.checkOut))+'</div>'+fld("Area",inp(p+".area",e.area,"District"),true)+fld("Address / detail",area(p+".address",e.address,"Street, district…"),true)+tail(e,i);
  } else if(e.type==="car"){
    h+=fld("Company",inp(p+".company",e.company,"Hertz"),true)+'<div class="sub-h">Pick-up</div><div class="grid">'+fld("Place",inp(p+".pickupPlace",e.pickupPlace,"Airport"))+fld("Date",dateF(p+".pickupDate",e.pickupDate))+'</div><div class="grid">'+fld("Time",timeF(p+".pickupTime",e.pickupTime))+'<div></div></div><div class="sub-h">Drop-off</div><div class="grid">'+fld("Place",inp(p+".dropoffPlace",e.dropoffPlace,"Same"))+fld("Date",dateF(p+".dropoffDate",e.dropoffDate))+'</div><div class="grid">'+fld("Time",timeF(p+".dropoffTime",e.dropoffTime))+'<div></div></div>'+tail(e,i);
  } else if(e.type==="ground"){
    h+='<div class="grid">'+fld("Mode",sel(p+".mode",e.mode,[["taxi","Taxi"],["rideshare","Rideshare"],["private","Private car"]]))+fld("Provider (opt.)",inp(p+".provider",e.provider,"Uber / Grab"))+'</div><div class="grid">'+fld("From",inp(p+".from",e.from,"Airport"))+fld("To",inp(p+".to",e.to,"Hotel"))+'</div><div class="grid">'+fld("Date",dateF(p+".date",e.date))+fld("Time",timeF(p+".time",e.time))+'</div>'+tail(e,i);
  } else if(e.type==="entertainment"){
    h+=fld("Name",inp(p+".name",e.name,"Show / event"),true)+fld("Venue",inp(p+".venue",e.venue,"Venue"),true)+'<div class="grid">'+fld("Date",dateF(p+".date",e.date))+fld("Time",timeF(p+".time",e.time))+'</div>'+tail(e,i);
  } else if(e.type==="meal"){
    h+=fld("Name",inp(p+".name",e.name,"Restaurant"),true)+fld("Venue / area",inp(p+".venue",e.venue,"District"),true)+'<div class="grid">'+fld("Date",dateF(p+".date",e.date))+fld("Time",timeF(p+".time",e.time))+'</div>'+tail(e,i);
  } else if(e.type==="transport"){
    h+='<div class="grid">'+fld("Mode",sel(p+".mode",e.mode,[["Train","Train"],["Ferry","Ferry"],["Bus","Bus"],["Coach","Coach"],["Shuttle","Shuttle"],["Other","Other"]]))+fld("Operator (opt.)",inp(p+".provider",e.provider,"Operator"))+'</div><div class="grid">'+fld("From",inp(p+".from",e.from,"Origin"))+fld("To",inp(p+".to",e.to,"Destination"))+'</div><div class="grid">'+fld("Date",dateF(p+".date",e.date))+fld("Time",timeF(p+".time",e.time))+'</div>'+tail(e,i);
  } else if(e.type==="meeting"){
    h+=fld("Subject",inp(p+".name",e.name,"Meeting / task"),true)+fld("Location",inp(p+".location",e.location,"Office / video call"),true)+'<div class="grid three">'+fld("Date",dateF(p+".date",e.date))+fld("Start",timeF(p+".time",e.time))+fld("End",timeF(p+".endTime",e.endTime))+'</div>'+fld("With",inp(p+".withWhom",e.withWhom,"People / team"),true)+tail(e,i);
  } else if(e.type==="tour"){
    h+=fld("Name",inp(p+".name",e.name,"Tour / excursion"),true)+fld("Meeting point",inp(p+".place",e.place,"Where to meet"),true)+'<div class="grid">'+fld("Operator",inp(p+".provider",e.provider,"Operator"))+'<div></div></div><div class="grid">'+fld("Date",dateF(p+".date",e.date))+fld("Time",timeF(p+".time",e.time))+'</div>'+tail(e,i);
  } else if(e.type==="note"){
    h+=fld("Title",inp(p+".title",e.title,"Reminder"),true)+fld("Body",area(p+".body",e.body,"Detail…"),true)+'<div class="grid">'+fld("Date",dateF(p+".date",e.date))+fld("Time",timeF(p+".time",e.time))+'</div>';
  } else {
    h+=fld("Name",inp(p+".name",e.name,"Activity / transfer"),true)+fld("Place",inp(p+".place",e.place,"Location"),true)+'<div class="grid">'+fld("Date",dateF(p+".date",e.date))+fld("Time",timeF(p+".time",e.time))+'</div>'+tail(e,i);
  }
  return h+'</div>';
}

function summaryHTML(){const ppl=people(),mm=ppl.length>1;let h='<div class="row"><span class="kk">Dates</span><span class="vv">'+(esc(dateRangeStr())||"—")+'</span></div>';ppl.forEach((p,idx)=>{const list=listFor(idx);const rl=routeLine(list),stats=statList(list);h+='<div class="row"><span class="kk">'+(mm?esc(p.name||("Traveler "+(idx+1))):"Route")+'</span><span class="vv">'+(esc(rl)||"—")+'</span></div>';h+='<div class="row"><span class="kk">Stats</span><span class="vv"><span class="chips">'+(stats.length?stats.map(x=>'<span class="chip">'+esc(x.v)+' '+esc(x.l)+'</span>').join(""):"—")+'</span></span></div>';});return h;}

function ratesEditor(){const base=state.baseCurrency||"USD";/* Only known currencies get a rate row: the code goes into a data-path, and
   trip data from a share link can put anything in e.currency. */
  const used=[...new Set(ents().map(e=>e.currency||"USD"))].filter(c=>c&&c!==base&&CURRENCIES.indexOf(c)>-1);if(!used.length)return '<div class="hint">Add items with costs in other currencies to set exchange rates here.</div>';let h="";used.forEach(cur=>{const v=(state.rates&&state.rates[cur]!=null)?state.rates[cur]:"";h+='<div class="grid rate"><span class="rlabel">1 '+esc(base)+' =</span><input class="f mono" data-path="rates.'+esc(cur)+'" value="'+esc(v)+'" placeholder="rate"><span class="rsuf">'+esc(cur)+'</span></div>';});return h;}

function renderForm(){
  const s=state;let h="";
  h+='<div class="sec"><h2>Header</h2><div class="sbody">';
  h+=fld("Eyebrow",inp("eyebrow",s.eyebrow,"Travel Itinerary"),true);
  h+='<div class="sub-h">Travelers</div>';
  people().forEach((p,i)=>{h+='<div class="card">'+'<div class="tt">'+inp("people."+i+".name",p.name,"Traveler name")+(people().length>1?ibtn("person-del",i,"✕","del"):"")+'</div>'+'<div class="grid">'+fld("Home timezone",sel("people."+i+".homeOff",p.homeOff||"",OFFSETS))+fld("Home label",inp("people."+i+".homeLabel",p.homeLabel,"CDT"))+'</div>'+'</div>';});
  h+='<div class="addrow"><button class="add" data-act="person-add">+ Add traveler</button></div>';
  if(people().length>1)h+='<div class="hint">Each traveler gets its own page. Assign flights (and anything else that differs) to a traveler; leave shared items on “Both / all.”</div>';
  h+='<div class="sub-h">Titles</div>';
  (s.titles||[]).forEach((t,i)=>{h+='<div class="tt">'+inp("titles."+i,t,"City")+ibtn("title-up",i,"↑",null,i===0)+ibtn("title-down",i,"↓",null,i===s.titles.length-1)+ibtn("title-del",i,"✕","del",s.titles.length<=1)+'</div>';});
  h+='<div class="addrow"><button class="add" data-act="title-add">+ Title</button></div>';
  h+='<div class="grid" style="margin-top:11px">'+fld("Trip start",dateF("tripStart",s.tripStart))+fld("Trip end",dateF("tripEnd",s.tripEnd))+'</div>';
  h+='<div class="hint">Nights, route line, stats and the date range are calculated automatically.</div></div></div>';

  h+='<div class="sec"><h2>Auto summary</h2><div class="sbody"><div class="derived">'+summaryHTML()+'</div></div></div>';

  h+='<div class="sec"><h2>Trip items <span class="ct">'+ents().length+'</span></h2><div class="sbody">';
  ents().forEach((e,i)=>{h+=entityCard(e,i);});
  h+='<div class="sub-h">Getting around</div><div class="addrow"><button class="add" data-act="add-flight">+ Flight</button><button class="add" data-act="add-transport">+ Transport</button><button class="add" data-act="add-car">+ Rental car</button><button class="add" data-act="add-ground">+ Taxi / rideshare</button></div>';
  h+='<div class="sub-h">Stay</div><div class="addrow"><button class="add" data-act="add-hotel">+ Hotel</button></div>';
  h+='<div class="sub-h">Things to do</div><div class="addrow"><button class="add" data-act="add-activity">+ Activity</button><button class="add" data-act="add-tour">+ Tour</button><button class="add" data-act="add-meal">+ Meal</button><button class="add" data-act="add-entertainment">+ Entertainment</button></div>';
  h+='<div class="sub-h">Work & notes</div><div class="addrow"><button class="add" data-act="add-meeting">+ Meeting / work</button><button class="add" data-act="add-note">+ Note</button></div>';
  h+='<div class="hint">The journey orders itself by date and time, and always begins with the first flight and ends with the last flight. Colors are automatic.</div></div></div>';

  h+='<div class="sec"><h2>Reference <span class="ct">'+(s.emergency||[]).length+'</span></h2><div class="sbody">';
  (s.emergency||[]).forEach((x,i)=>{h+='<div class="card"><div class="card-h"><span class="tag" style="background:var(--muted)">Ref '+(i+1)+'</span><span class="sp"></span>'+ibtn("ref-up",i,"↑",null,i===0)+ibtn("ref-down",i,"↓",null,i===s.emergency.length-1)+ibtn("ref-del",i,"✕","del")+'</div><div class="grid">'+fld("Label",inp("emergency."+i+".label",x.label,"Hotel / consulate"))+fld("Value",inp("emergency."+i+".value",x.value,"Phone / policy"))+'</div></div>';});
  h+='<div class="addrow"><button class="add" data-act="ref-add">+ Reference</button></div><div class="hint">Emergency numbers, consulate, insurance policy, ICE contact.</div></div></div>';

  h+='<div class="sec"><h2>Checklist <span class="ct">'+(s.checklist||[]).length+'</span></h2><div class="sbody">';
  h+=fld("Section heading",inp("checklistHeading",s.checklistHeading,"Before departure"),true);
  (s.checklist||[]).forEach((it,i)=>{h+='<div class="card"><div class="card-h"><span class="tag" style="background:var(--muted)">Item '+(i+1)+'</span><span class="sp"></span>'+ibtn("chk-up",i,"↑",null,i===0)+ibtn("chk-down",i,"↓",null,i===s.checklist.length-1)+ibtn("chk-del",i,"✕","del")+'</div>'+fld("Bold lead (opt.)",inp("checklist."+i+".title",it.title,"Passport validity"),true)+fld("Body",area("checklist."+i+".body",it.body,"Detail…"),true)+'</div>';});
  h+='<div class="addrow"><button class="add" data-act="chk-add">+ Item</button></div></div></div>';

  h+='<div class="sec"><h2>Document & display</h2><div class="sbody">';
  h+=chk("showCosts",s.showCosts,"Show cost section");
  h+=chk("dayGrouped",s.dayGrouped,"Group journey into day headers");
  h+=chk("showSummaryPage",s.showSummaryPage,"Add an overview page (multi-traveler)");
  h+='<div class="sub-h">Money</div>';
  h+='<div class="grid">'+fld("Base currency",sel("baseCurrency",s.baseCurrency||"USD",CURRENCIES))+'<div></div></div>';
  h+=chk("splitShared",s.splitShared,"Split shared costs across travelers");
  h+='<div class="sub-h">Exchange rates</div><div id="ratesBox">'+ratesEditor()+'</div>';
  h+='<div class="hint">Rates convert every currency into the base for a single trip total. Theme is in the top bar.</div></div></div>';

  h+='<div class="sec"><h2>Sharing & export</h2><div class="sbody">';
  h+='<div class="hint">Use “Copy link” in the toolbar for a self-contained link with the whole trip embedded in the URL.</div>';
  if(multi()){h+='<div class="sub-h">Export one traveler</div><div class="addrow">'+people().map((p,i)=>'<button class="add" data-act="export-person" data-i="'+i+'">PDF · '+esc(p.name||("Traveler "+(i+1)))+'</button>').join("")+'</div>';}
  h+='</div></div>';

  h+='<div class="sec"><h2>Footer</h2><div class="sbody"><div class="grid one">'+fld("Left",inp("footer.0",s.footer[0],"All times local"))+fld("Center",inp("footer.1",s.footer[1],"Zone note"))+fld("Right",inp("footer.2",s.footer[2],"Rev. 1"))+'</div></div></div>';

  form.innerHTML=h;
  const ts=document.getElementById("themeSel");if(ts)ts.value=state.theme||"classic";
}
function updateSummary(){const d=form.querySelector(".derived");if(d)d.innerHTML=summaryHTML();}
function updateRates(){const b=document.getElementById("ratesBox");if(b)b.innerHTML=ratesEditor();}

/* ===== events ===== */
form.addEventListener("input",e=>{
  const t=e.target,path=t.getAttribute("data-path");if(!path)return;
  setPath(state,path,t.type==="checkbox"?t.checked:t.value);
  // Which currencies need a rate depends on the base and on each item's
  // currency, so that editor has to be rebuilt when either changes.
  if(path==="baseCurrency"||path.endsWith(".currency"))updateRates();
  updateSummary();schedulePreview();
});

const SEEDS={
  transport:()=>({type:"transport",owner:"shared",mode:"Train",from:"",to:"",date:"",time:"",provider:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  meeting:()=>({type:"meeting",owner:"shared",name:"",location:"",date:"",time:"",endTime:"",withWhom:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  tour:()=>({type:"tour",owner:"shared",name:"",place:"",date:"",time:"",provider:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  note:()=>({type:"note",owner:"shared",title:"",body:"",date:"",time:""}),
  flight:()=>({type:"flight",owner:"shared",carrier:"",flightNos:"",originCode:"",originName:"",departDate:"",departTime:"",departOff:"",departZone:"",destCode:"",destName:"",arriveDate:"",arriveTime:"",arriveOff:"",arriveZone:"",connections:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  hotel:()=>({type:"hotel",owner:"shared",name:"",area:"",address:"",checkIn:"",checkOut:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  car:()=>({type:"car",owner:"shared",company:"",pickupPlace:"",pickupDate:"",pickupTime:"",dropoffPlace:"",dropoffDate:"",dropoffTime:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  ground:()=>({type:"ground",owner:"shared",mode:"taxi",from:"",to:"",date:"",time:"",provider:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  entertainment:()=>({type:"entertainment",owner:"shared",name:"",venue:"",date:"",time:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  meal:()=>({type:"meal",owner:"shared",name:"",venue:"",date:"",time:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  activity:()=>({type:"activity",owner:"shared",name:"",place:"",date:"",time:"",link:"",conf:"",cost:"",currency:"USD",note:""})
};
form.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");if(!b)return;
  const act=b.getAttribute("data-act"),i=b.hasAttribute("data-i")?+b.getAttribute("data-i"):null,s=state;
  if(act==="export-person"){exportPDF(buildDocFor(i));return;}
  if(act==="person-add")s.people.push({name:""});
  else if(act==="person-del"){s.people.splice(i,1);if(s.people.length<1)s.people=[{name:""}];s.entities.forEach(en=>{if(en.owner==null||en.owner==="shared")return;const o=+en.owner;if(isNaN(o))return;if(o===i)en.owner="shared";else if(o>i)en.owner=String(o-1);});if(s.people.length<2)s.entities.forEach(en=>{en.owner="shared";});}
  else if(act==="title-add")s.titles.push("");
  else if(act==="title-del"){if(s.titles.length>1)s.titles.splice(i,1);}
  else if(act==="title-up")move(s.titles,i,-1);
  else if(act==="title-down")move(s.titles,i,1);
  else if(act.startsWith("add-")){const k=act.slice(4);if(SEEDS[k])s.entities.push(SEEDS[k]());}
  else if(act==="ent-del")s.entities.splice(i,1);
  else if(act==="ref-add")(s.emergency=s.emergency||[]).push({label:"",value:""});
  else if(act==="ref-del")s.emergency.splice(i,1);
  else if(act==="ref-up")move(s.emergency,i,-1);
  else if(act==="ref-down")move(s.emergency,i,1);
  else if(act==="chk-add")s.checklist.push({title:"",body:""});
  else if(act==="chk-del")s.checklist.splice(i,1);
  else if(act==="chk-up")move(s.checklist,i,-1);
  else if(act==="chk-down")move(s.checklist,i,1);
  else return;
  renderForm();schedulePreview();
});

/* ===== share link (gzip when available, plain-base64 fallback for old links) ===== */
function encodeState(){return btoa(unescape(encodeURIComponent(JSON.stringify(state))));}
function decodeState(str){return JSON.parse(decodeURIComponent(escape(atob(str))));}
function u8ToB64(u8){let s="";const c=0x8000;for(let i=0;i<u8.length;i+=c)s+=String.fromCharCode.apply(null,u8.subarray(i,i+c));return btoa(s);}
function b64ToU8(b64){const s=atob(b64);const u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u;}
function b64url(b){return b.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}
function unb64url(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";return s;}
async function gzipStr(str){const cs=new CompressionStream("gzip");const w=cs.writable.getWriter();w.write(new TextEncoder().encode(str));w.close();const ab=await new Response(cs.readable).arrayBuffer();return new Uint8Array(ab);}
/* A few hundred bytes of gzip can expand to hundreds of megabytes, so read the
   stream in chunks and give up rather than letting a link hang the tab. Well
   clear of a real trip, which is a few tens of KB of JSON. */
const MAX_UNZIP=4*1024*1024;
async function gunzipToStr(u8){
  const ds=new DecompressionStream("gzip");const w=ds.writable.getWriter();w.write(u8);w.close();
  const rd=ds.readable.getReader();const parts=[];let n=0;
  for(;;){
    const {value,done}=await rd.read();
    if(done)break;
    n+=value.length;
    if(n>MAX_UNZIP){rd.cancel();throw new Error("shared trip is too large");}
    parts.push(value);
  }
  return new TextDecoder().decode(await new Blob(parts).arrayBuffer());
}
async function shareLink(){const base=location.href.split("#")[0];const json=JSON.stringify(state);if(typeof CompressionStream!=="undefined"){try{const gz=await gzipStr(json);return base+"#z="+b64url(u8ToB64(gz));}catch(e){}}return base+"#data="+encodeURIComponent(encodeState());}
function normalize(st){const b=BLANK();const o=Object.assign(b,st);if(!o.titles||!o.titles.length)o.titles=["Destination"];if(!o.people||!o.people.length)o.people=[{name:""}];if(!o.footer||o.footer.length<3)o.footer=(o.footer||[]).concat(["","",""]).slice(0,3);o.entities=o.entities||[];return o;}

/* ===== toolbar ===== */
document.getElementById("btnSample").onclick=()=>{state=SAMPLE();renderForm();refreshPreview();saveDraft();};
document.getElementById("btnBlank").onclick=()=>{if(confirm("Clear everything and start blank?")){state=BLANK();renderForm();refreshPreview();saveDraft();}};
document.getElementById("btnSave").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=slug((state.titles||[]).filter(Boolean).join("-"))+"-itinerary.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
document.getElementById("btnLink").onclick=async ()=>{const link=await shareLink();const done=()=>{const btn=document.getElementById("btnLink");const o=btn.textContent;btn.textContent="Copied ✓";setTimeout(()=>btn.textContent=o,1400);};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(link).then(done,()=>prompt("Copy this link:",link));}else prompt("Copy this link:",link);};
document.getElementById("fileLoad").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{state=normalize(JSON.parse(r.result));renderForm();refreshPreview();saveDraft();}catch(err){alert("Could not read that file: "+err.message);}};r.readAsText(f);e.target.value="";};
document.getElementById("themeSel").onchange=function(){state.theme=this.value;refreshPreview();saveDraft();};
function loadScript(src,integrity){return new Promise(function(res,rej){var s=document.createElement("script");s.src=src;if(integrity){s.integrity=integrity;s.crossOrigin="anonymous";}s.onload=res;s.onerror=function(){rej(new Error("load failed"));};document.head.appendChild(s);});}
/* The only third-party code that runs here, and it runs with full access to the
   page. Pinned by hash: a tampered or hijacked CDN response is refused by the
   browser, which surfaces as a load failure and falls back to popupPrint().
   Bump the hash and the version together — cdnjs publishes both. */
async function ensurePdfLibs(){
  if(window.jspdf&&window.html2canvas)return;
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
    "sha512-qZvrmS2ekKPF2mSznTQsxqPgnpkI4DNTlrdUmTzrDgektczlKNRRhy5X5AAOnx5S09ydFYWWNSfcEqDTTHgtNA==");
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
    "sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==");
}
/* Off-screen but laid out at 816px — a display:none or zero-width
   frame would paginate against the wrong viewport.

   Deliberately NOT sandboxed, unlike the preview frame: printing calls
   contentWindow.print() and the PDF path hands contentDocument nodes to
   html2canvas, both of which need same-origin access. The trade is that these
   two frames rely on esc()/safeUrl() alone, so keep that escaping airtight. */
function hiddenFrame(){
  var f=document.createElement("iframe");
  f.setAttribute("aria-hidden","true");
  f.style.cssText="position:fixed;left:-10000px;top:0;width:816px;height:1200px;border:0;background:#fff";
  document.body.appendChild(f);
  return f;
}
/* Last resort only: a pop-up window, which blockers often eat. */
function popupPrint(html){
  var w=null;try{w=window.open("","_blank");}catch(e){}
  if(!w){alert("Allow pop-ups to print or export, or use your browser’s own Print option.");return;}
  w.document.open();w.document.write(html);w.document.close();
  var p=false,go=function(){if(p)return;p=true;try{w.focus();w.print();}catch(e){}};
  w.onload=function(){setTimeout(go,400);};setTimeout(go,1800);
}
async function printDoc(html){
  var btn=document.getElementById("btnPrint"),label=btn?btn.textContent:"";
  if(btn){btn.textContent="Preparing…";btn.disabled=true;}
  var f=hiddenFrame();
  try{
    await whenPaginated(f,html,12000);
    await new Promise(function(r){setTimeout(r,120);});
    f.contentWindow.focus();
    f.contentWindow.print();
    setTimeout(function(){f.remove();},60000);   // removing it early cancels the job
  }catch(err){
    f.remove();popupPrint(html);
  }finally{
    if(btn){btn.textContent=label;btn.disabled=false;}
  }
}
async function exportPDF(html){
  html=html||buildDoc(state);
  var btn=document.getElementById("btnPdf");var label=btn?btn.textContent:"";
  if(btn){btn.textContent="Building PDF…";btn.disabled=true;}
  var iframe=null;
  try{
    await ensurePdfLibs();
    iframe=hiddenFrame();
    await whenPaginated(iframe,html,15000);
    var doc=iframe.contentDocument;
    try{await doc.fonts.ready;}catch(e){}
    doc.documentElement.setAttribute("data-print","1");
    /* Paginated .page elements are exactly one sheet each, so each one
       maps to exactly one PDF page — no slicing through content.
       .sheet is the fallback if the paginator bailed. */
    var pages=Array.prototype.slice.call(doc.querySelectorAll(".page"));
    var exact=pages.length>0;
    if(!exact)pages=Array.prototype.slice.call(doc.querySelectorAll(".sheet"));
    if(!pages.length)throw new Error("nothing to render");
    iframe.style.height=Math.max(1200,doc.documentElement.scrollHeight)+"px";
    await new Promise(function(r){requestAnimationFrame(function(){requestAnimationFrame(r);});});
    var jsPDF=window.jspdf.jsPDF;
    var SCALE=2,pdf=null;
    for(var i=0;i<pages.length;i++){
      var opts={scale:SCALE,backgroundColor:"#ffffff",useCORS:true,logging:false,windowWidth:816,width:816};
      if(exact)opts.height=PAGE_PXH;
      var canvas=await window.html2canvas(pages[i],opts);
      var img=canvas.toDataURL("image/jpeg",0.92);
      var hpt=exact?PAGE_HPT:Math.min(PAGE_HPT,(canvas.height/SCALE)*0.75);  // css px -> pt (72/96)
      if(!pdf)pdf=new jsPDF({unit:"pt",format:[PAGE_WPT,PAGE_HPT],orientation:"portrait"});
      else pdf.addPage([PAGE_WPT,PAGE_HPT]);
      pdf.addImage(img,"JPEG",0,0,PAGE_WPT,hpt);
    }
    var url=URL.createObjectURL(pdf.output("blob"));
    var w=window.open(url,"_blank");
    if(!w){var a=document.createElement("a");a.href=url;a.download=slug((state.titles||[]).filter(Boolean).join("-"))+"-itinerary.pdf";document.body.appendChild(a);a.click();a.remove();}
    setTimeout(function(){URL.revokeObjectURL(url);},60000);
  }catch(err){
    popupPrint(html);
  }finally{
    if(iframe)setTimeout(function(){iframe.remove();},800);
    if(btn){btn.textContent=label;btn.disabled=false;}
  }
}
document.getElementById("btnPdf").onclick=function(){exportPDF();};
document.getElementById("btnPrint").onclick=function(){printDoc(buildDoc(state));};

/* ===== init: URL hash > local draft > sample ===== */
(async function init(){
  const zh=location.hash.match(/z=([^&]+)/), dh=location.hash.match(/data=([^&]+)/);
  if(zh){try{state=normalize(JSON.parse(await gunzipToStr(b64ToU8(unb64url(zh[1])))));}catch(e){}}
  else if(dh){try{state=normalize(decodeState(decodeURIComponent(dh[1])));}catch(e){}}
  else{try{const d=localStorage.getItem("itin-draft-v4");if(d)state=normalize(JSON.parse(d));}catch(e){}}
  renderForm();refreshPreview();
})();
