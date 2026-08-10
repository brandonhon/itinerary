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
/* Home zones are picked by name, not by UTC offset — few people know their own
   offset, and a fixed offset is simply wrong on the far side of a DST change.
   The offset is derived from the zone at the actual instant instead. Flight
   legs still use a raw offset: those are per-airport and often in a zone the
   traveler never sets foot in outside the layover. */
/* One entry per distinct year-round behaviour, named for the best-known city
   that has it — 57 instead of the IANA list's 418.

   Deduplicated on the winter/summer offset PAIR, not on today's offset. Those
   are not the same thing: in January, Chicago and Costa Rica are both UTC−06:00
   and only diverge in July, so collapsing by current offset would hand a Costa
   Rica traveler Chicago's DST rules and be an hour wrong for half the year. 37 offsets, 57 behaviours; every one is represented exactly once. */
const TZ_ZONES=["Pacific/Pago_Pago","America/Adak","Pacific/Honolulu","Pacific/Marquesas","America/Anchorage",
"Pacific/Gambier","America/Los_Angeles","Pacific/Pitcairn","America/Denver","America/Phoenix",
"America/Mexico_City","America/Chicago","America/Bogota","America/New_York","Pacific/Easter",
"America/Caracas","America/Halifax","America/St_Johns","America/Sao_Paulo","America/Miquelon",
"America/Santiago","America/Nuuk","America/Noronha","Atlantic/Azores","Atlantic/Cape_Verde",
"Africa/Accra","Antarctica/Troll","Europe/London","Africa/Lagos","Europe/Paris",
"Africa/Johannesburg","Africa/Cairo","Europe/Moscow","Asia/Tehran","Asia/Dubai",
"Asia/Kabul","Asia/Karachi","Asia/Kolkata","Asia/Kathmandu","Asia/Dhaka",
"Asia/Yangon","Asia/Bangkok","Asia/Shanghai","Australia/Eucla","Asia/Tokyo",
"Australia/Darwin","Australia/Brisbane","Australia/Adelaide","Australia/Sydney","Pacific/Guadalcanal",
"Australia/Lord_Howe","Pacific/Fiji","Pacific/Norfolk","Pacific/Auckland","Pacific/Tongatapu",
"Pacific/Chatham","Pacific/Kiritimati"];
const TZ_ORDER=["America","Europe","Asia","Africa","Australia","Pacific","Atlantic","Indian","Antarctica","Arctic"];
function tzCity(tz){const s=String(tz).split("/");return (s[s.length-1]||tz).replace(/_/g," ");}
/* Formatting an instant into a zone is the only reliable primitive the platform
   offers here, so everything (wall clock, offset, abbreviation) is read back
   out of one formatToParts call. */
function tzParts(tz,date,extra){
  const o=Object.assign({timeZone:tz,hour12:false,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"},extra||{});
  const p={};new Intl.DateTimeFormat("en-US",o).formatToParts(date).forEach(x=>{p[x.type]=x.value;});
  if(p.hour==="24")p.hour="00";
  return p;
}
function partsOffMin(p,ms){return Math.round((Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)-ms)/60000);}
/* ICU only has a real abbreviation for about a quarter of zones and returns
   "GMT+8" for the rest. Leaving the field blank there was reported as the
   timezone "not filling" for TFU and LIS, so fall back to a compact offset:
   "UTC+1" beats nothing next to a time on the printed page. Deriving initials
   from the long name is tempting and wrong — "Central European Standard Time"
   would give CEST when the real abbreviation is CET. */
function shortZoneLabel(min){
  if(min==null)return "";
  const s=min<0?"−":"+",a=Math.abs(min),h=Math.floor(a/60),m=a%60;
  return "UTC"+s+h+(m?":"+String(m).padStart(2,"0"):"");
}
function offLabel(min){if(min==null)return "";const s=min<0?"−":"+";const a=Math.abs(min);return "UTC"+s+String(Math.floor(a/60)).padStart(2,"0")+":"+String(a%60).padStart(2,"0");}
/* Several formatters per zone, so build the list once and keep it. */
let TZOPTS=null;
function tzOptions(){
  if(TZOPTS)return TZOPTS;
  const now=new Date(),y=now.getUTCFullYear(),groups={};
  const jan=new Date(Date.UTC(y,0,15)),jul=new Date(Date.UTC(y,6,15));
  TZ_ZONES.forEach(tz=>{
    let p,j,u;
    try{
      p=tzParts(tz,now,{timeZoneName:"short"});
      j=partsOffMin(tzParts(tz,jan),jan.getTime());
      u=partsOffMin(tzParts(tz,jul),jul.getTime());
    }catch(e){return;}
    const seg=tz.split("/"),region=seg.length>1?seg[0]:"Other";
    const n=p.timeZoneName||"",abbr=/^(GMT|UTC)/i.test(n)?"":n;
    /* Shifting zones show both offsets, in January/July order — which is the
       exact signature the list is deduplicated on, so no two labels can collide.
       Today's offset alone is ambiguous (in July, New York and Santiago both
       read UTC−04:00), and so is sorting the pair low-to-high: Halifax and
       Santiago both span −04:00/−03:00 and differ only in which half of the
       year each applies to. */
    TZ_OFFSET_SET.add(j);TZ_OFFSET_SET.add(u);
    const meta=(j===u)?offLabel(j):offLabel(j)+"/"+offLabel(u).replace(/^UTC/,"");
    (groups[region]=groups[region]||[]).push([tz,tzCity(tz)+(abbr?" · "+abbr:"")+" ("+meta+")"]);
  });
  TZOPTS=Object.keys(groups).sort((a,b)=>{
    const ia=TZ_ORDER.indexOf(a),ib=TZ_ORDER.indexOf(b);
    return (ia<0?99:ia)-(ib<0?99:ib)||a.localeCompare(b);
  }).map(n=>[n,groups[n].sort((a,b)=>a[1].localeCompare(b[1]))]);
  return TZOPTS;
}
/* Whole hours alone miss real places — India is +05:30, Nepal +05:45,
   Newfoundland −03:30, the Chatham Islands +12:45 — so a flight to any of them
   could not have its offset entered at all, and both the elapsed time and the
   home-time line came out 30 to 45 minutes wrong. The fractional entries come
   from the zone table, which already covers every real offset exactly once, so
   this list follows TZ_ZONES rather than having to be maintained separately. */
const TZ_OFFSET_SET=new Set();
let OFFSET_OPTS=null;
function offsetOpts(){
  if(OFFSET_OPTS)return OFFSET_OPTS;
  tzOptions();                                          /* fills TZ_OFFSET_SET */
  const set=new Set(TZ_OFFSET_SET);
  for(let m=-720;m<=840;m+=60)set.add(m);
  OFFSET_OPTS=[["","—"]].concat([...set].sort((a,b)=>a-b).map(m=>[String(m),offLabel(m)]));
  return OFFSET_OPTS;
}
const WD=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MON=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const MONT=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parseISO(iso){const p=String(iso||"").split("-");return [(+p[0]),(+p[1]),(+p[2])];}
function toEpoch(iso,tm){if(!iso)return null;const [y,m,d]=parseISO(iso);if(!y||!m||!d)return null;let hh=0,mm=0;if(tm){const t=tm.split(":");hh=+t[0]||0;mm=+t[1]||0;}return new Date(y,m-1,d,hh,mm).getTime();}
function dow(iso){const [y,m,d]=parseISO(iso);if(!y)return null;return new Date(y,m-1,d).getDay();}
function fmtStamp(iso){const w=dow(iso);if(w==null)return "";return WD[w]+" "+parseISO(iso)[2];}
function nightsBetween(a,b){const ea=toEpoch(a),eb=toEpoch(b);if(ea==null||eb==null)return 0;const n=Math.round((eb-ea)/86400000);return n>0?n:0;}
/* Month is only range-checked here: hand-edited JSON and share links can carry
   anything, and an out-of-range index printed the literal word "undefined"
   into the document ("1 – 5 undefined 2026"). */
function fmtLong(iso){const [y,m,d]=parseISO(iso);if(!y||!d||!MON[m-1])return "";return d+" "+MON[m-1]+" "+y;}
function fmtRange(a,b){const [ay,am,ad]=parseISO(a),[by,bm,bd]=parseISO(b);if(!ay||!MON[am-1])return fmtLong(b);if(!by||!MON[bm-1])return fmtLong(a);if(ay===by&&am===bm)return ad+" – "+bd+" "+MON[am-1]+" "+ay;if(ay===by)return ad+" "+MON[am-1]+" – "+bd+" "+MON[bm-1]+" "+ay;return ad+" "+MON[am-1]+" "+ay+" – "+bd+" "+MON[bm-1]+" "+by;}
function epUTC(iso,tm,off){if(!iso)return null;const [y,m,d]=parseISO(iso);if(!y)return null;let hh=0,mm=0;if(tm){const t=tm.split(":");hh=+t[0]||0;mm=+t[1]||0;}let ms=Date.UTC(y,m-1,d,hh,mm);if(offKnown(off))ms-=(+off)*60000;return ms;}
function elapsedStr(f){const a=epUTC(f.departDate,f.departTime,f.departOff),b=epUTC(f.arriveDate,f.arriveTime,f.arriveOff);if(a==null||b==null)return "";let mins=Math.round((b-a)/60000);if(mins<0)return "";const approx=(f.departOff===""||f.arriveOff===""||f.departOff==null||f.arriveOff==null);const h=Math.floor(mins/60),mm=mins%60;return (approx?"~":"")+h+"h "+String(mm).padStart(2,"0")+"m";}
function num(x){const n=parseFloat(String(x==null?"":x).replace(/[, ]/g,""));return isNaN(n)?0:n;}
function money(cur,n){const s=own(SYM,cur)?SYM[cur]:(cur?cur+" ":"");const dec=(cur==="JPY"||cur==="KRW")?0:2;return s+Number(n).toLocaleString("en-US",{minimumFractionDigits:dec,maximumFractionDigits:dec});}
/* Connections were one free-text field ("EWR · 1h 40m") and are now a list.
   Older drafts and share links still carry the string, so read through this
   rather than touching e.connections directly. The string becomes a single
   entry, which renders identically to how it always did. */
function connList(e){
  const c=e&&e.connections;
  if(Array.isArray(c))return c.filter(x=>x&&typeof x==="object");
  const t=String(c||"").trim();
  return t?[{place:t,wait:""}]:[];
}
/* Transport can carry several links — a timetable, a station map, a booking —
   so it uses a list where every other type still has one. A legacy single link
   is migrated into the list by normalize(), so nothing is stranded. */
function linkList(e){
  const l=e&&e.links;
  if(Array.isArray(l))return l.filter(x=>x&&typeof x==="object"&&safeUrl(x.url));
  return [];
}
/* Anchors have to be built here rather than escaped as text, so both halves are
   sanitised at the point of use: href through safeUrl, label through esc. */
function linksHtml(e){
  return linkList(e).map(x=>{
    const href=safeUrl(x.url);
    const label=String(x.label||"").trim()||href.replace(/^[a-z]+:\/\//i,"").replace(/\/.*$/,"");
    return '<a href="'+esc(href)+'" style="color:inherit">'+esc(label)+'</a>';
  }).join(" · ");
}
function firstLink(e){const l=linkList(e);return l.length?safeUrl(l[0].url):(e&&e.link)||"";}
/* One entry per stop, for callers that stack them. connText() still joins for
   flights, where a leg has one or two layovers and a single line reads better. */
function connLines(e){
  return connList(e).map(c=>{
    const head=[String(c.place||"").trim(),String(c.wait||"").trim()].filter(Boolean).join(" · ");
    const ch=String(c.change||"").trim();
    return head?(ch?head+" · change to "+ch:head):(ch?"change to "+ch:"");
  }).filter(Boolean);
}
function connText(e){
  return connList(e).map(c=>{
    const head=[String(c.place||"").trim(),String(c.wait||"").trim()].filter(Boolean).join(" · ");
    const ch=String(c.change||"").trim();
    /* A stop where you stay aboard reads "Coimbra-B · 5m"; one where you get
       off and board something else says so, which is the whole difference
       between a call and a change. */
    return head?(ch?head+" · change to "+ch:head):(ch?"change to "+ch:"");
  }).filter(Boolean).join(" → ");
}
function arrowize(s){return String(s||"").split(/\s*(?:,|→|->)\s*/).map(x=>x.trim()).filter(Boolean).join(" → ");}
/* hm.tz is a zone name; hm.off is the older numeric offset, still honoured so
   share links and drafts built before the switch keep rendering. */
function homeLine(dateIso,timeStr,off){
  const hm=curHome||{},tz=hm.tz||"",legacy=!(hm.off===""||hm.off==null);
  if(!tz&&!legacy)return null;
  if(off===""||off==null)return null;
  const utc=epUTC(dateIso,timeStr,off);
  if(utc==null)return null;
  const pad=n=>String(n).padStart(2,"0");
  let wd,hh,mm,homeOff,abbr="";
  if(tz){
    let p;try{p=tzParts(tz,new Date(utc),{weekday:"short",timeZoneName:"short"});}catch(e){return null;}
    homeOff=partsOffMin(p,utc);
    wd=p.weekday;hh=p.hour;mm=p.minute;
    const n=p.timeZoneName||"";abbr=/^(GMT|UTC)/i.test(n)?"":n;
  }else{
    homeOff=+hm.off;
    if(!isFinite(homeOff))return null;   /* garbage in a hand-edited draft */
    const d=new Date(utc+homeOff*60000);
    wd=WD[d.getUTCDay()];hh=pad(d.getUTCHours());mm=pad(d.getUTCMinutes());
  }
  if(homeOff===+off)return null;                 /* same wall clock; nothing to add */
  /* Intl only has a real abbreviation for about a quarter of zones (23%, almost
     all in the Americas) and gives "GMT+1" for the rest, so fall back to the
     city — "Sat 04:05 Lisbon" beats a bare "Sat 04:05". hm.label is the older
     hand-typed override, still honoured for drafts that set one. */
  const label=hm.label||abbr||(tz?tzCity(tz):"");
  return wd+" "+hh+":"+mm+(label?" "+label:"");
}

function SAMPLE(){return {
  eyebrow:"Travel Itinerary",titles:["Lisbon","Porto"],tripStart:"2026-09-18",tripEnd:"2026-09-27",
  showCosts:true,dayGrouped:true,showSummaryPage:true,splitShared:true,theme:"classic",paper:"letter",
  baseCurrency:"USD",rates:{HKD:"7.80",MOP:"8.03",EUR:"0.92",GBP:"0.79",JPY:"157",CNY:"7.2",CAD:"1.36",AUD:"1.52",SGD:"1.35",KRW:"1370",THB:"36"},
  people:[{name:"Alex Rivera",homeTz:"America/Denver"},{name:"Sam Chen",homeTz:"America/Los_Angeles"}],
  entities:[
    {type:"flight",owner:"0",carrier:"United",flightNos:"UA0918, UA1450",originCode:"DEN",originName:"Denver",departDate:"2026-09-18",departTime:"16:20",departOff:"-360",departZone:"MDT",destCode:"LIS",destName:"Lisbon",arriveDate:"2026-09-19",arriveTime:"11:05",arriveOff:"60",arriveZone:"WEST",connections:[{place:"EWR",wait:"1h 40m"}],link:"",conf:"UA7Q2LM",cost:"1180.44",currency:"USD",note:"Overnight transatlantic."},
    {type:"flight",owner:"1",carrier:"Delta",flightNos:"DL0244, DL0118",originCode:"SEA",originName:"Seattle",departDate:"2026-09-18",departTime:"13:10",departOff:"-420",departZone:"PDT",destCode:"LIS",destName:"Lisbon",arriveDate:"2026-09-19",arriveTime:"12:50",arriveOff:"60",arriveZone:"WEST",connections:[{place:"JFK",wait:"2h 05m"}],link:"",conf:"DLK83RP",cost:"1342.90",currency:"USD",note:""},
    {type:"hotel",owner:"shared",name:"Hotel Baixa Terrace",area:"Baixa",address:"Rua Áurea 121, Lisbon. Steps from Praça do Comércio; Baixa-Chiado Metro two blocks north.",checkIn:"2026-09-19",checkInTime:"15:00",checkOut:"2026-09-24",link:"https://maps.google.com/?q=Rua+Aurea+121+Lisbon",conf:"BTL-99120",cost:"940.00",currency:"EUR",note:""},
    {type:"activity",owner:"shared",name:"Tram 28 & Alfama walk",place:"Martim Moniz stop",date:"2026-09-20",time:"10:00",link:"",conf:"",cost:"",currency:"EUR",note:"Board early to beat the queue; ride to Alfama, then wander down to the cathedral."},
    {type:"meal",owner:"shared",name:"Dinner at Cervejaria Ramiro",venue:"Intendente",date:"2026-09-21",time:"20:00",link:"",conf:"",cost:"",currency:"EUR",note:"Seafood; expect a wait. Garlic prawns, then a steak sandwich to finish."},
    {type:"entertainment",owner:"shared",name:"Fado night at Tasca do Chico",venue:"Bairro Alto",date:"2026-09-22",time:"21:30",link:"",conf:"",cost:"",currency:"EUR",note:"Small room, arrive by 21:00 for a seat."},
    {type:"ground",owner:"shared",mode:"private",from:"Lisbon hotel",to:"Santa Apolónia station",date:"2026-09-24",time:"09:30",off:"60",zone:"WEST",provider:"Welcome Pickups",link:"",conf:"",cost:"28.00",currency:"EUR",note:"Pre-booked car to the train."},
    {type:"transport",owner:"shared",mode:"Train",line:"AP 130",from:"Lisbon (Santa Apolónia)",to:"Porto (Campanhã)",date:"2026-09-24",time:"10:30",off:"60",zone:"WEST",connections:[{place:"Coimbra-B",wait:"5m"}],links:[{label:"CP timetable",url:"https://www.cp.pt/"}],conf:"",cost:"",currency:"EUR",note:"About 3h; buy Conforto class for the quiet car."},
    {type:"car",owner:"shared",company:"Europcar",pickupPlace:"Porto (Campanhã)",pickupDate:"2026-09-24",pickupTime:"14:00",dropoffPlace:"Porto airport (OPO)",dropoffDate:"2026-09-27",dropoffTime:"11:00",off:"60",zone:"WEST",link:"",conf:"EC-70318",cost:"165.00",currency:"EUR",note:"Compact; free cancellation up to 48h before."},
    {type:"hotel",owner:"shared",name:"Porto Ribeira Suites",area:"Ribeira",address:"Rua da Fonte Taurina 18, Porto. Riverfront; walk to Ponte Luís I in five minutes.",checkIn:"2026-09-24",checkOut:"2026-09-27",link:"",conf:"PRS-4471",cost:"510.00",currency:"EUR",note:""},
    {type:"meal",owner:"shared",name:"Lunch at Cantina 32",venue:"Rua das Flores",date:"2026-09-25",time:"13:00",link:"",conf:"",cost:"",currency:"EUR",note:"Book a day ahead for the terrace."},
    {type:"tour",owner:"shared",name:"Douro Valley wine day",place:"Pinhão",date:"2026-09-26",time:"08:30",off:"60",zone:"WEST",provider:"Quinta Tours",link:"",conf:"DV-2261",cost:"190.00",currency:"EUR",note:"Full-day tour: two quintas and a river cruise. Pickup from the hotel lobby."},
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
    {type:"flight",owner:"0",carrier:"United",flightNos:"UA1802, UA0961",originCode:"OPO",originName:"Porto",departDate:"2026-09-27",departTime:"13:40",departOff:"60",departZone:"WEST",destCode:"DEN",destName:"Denver",arriveDate:"2026-09-27",arriveTime:"21:30",arriveOff:"-360",arriveZone:"MDT",connections:[{place:"IAD",wait:"1h 15m"}],link:"",conf:"",cost:"",currency:"USD",note:""},
    {type:"flight",owner:"1",carrier:"Delta",flightNos:"DL0119, DL0245",originCode:"OPO",originName:"Porto",departDate:"2026-09-27",departTime:"15:10",departOff:"60",departZone:"WEST",destCode:"SEA",destName:"Seattle",arriveDate:"2026-09-27",arriveTime:"23:55",arriveOff:"-420",arriveZone:"PDT",connections:[{place:"JFK",wait:"1h 55m"}],link:"",conf:"",cost:"",currency:"USD",note:""}
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
    {label:"Emergency contact",value:"Jordan Rivera · +1 720 555 0148"}
  ],
  footer:["All times local","WEST = UTC+1","Rev. 1 · Draft"]
};}
function BLANK(){return {eyebrow:"Travel Itinerary",titles:["Destination"],tripStart:"",tripEnd:"",showCosts:true,dayGrouped:false,showSummaryPage:false,splitShared:false,theme:"classic",paper:"letter",baseCurrency:"USD",rates:{},people:[{name:"",homeTz:""}],entities:[],checklistHeading:"Before departure",checklist:[],emergency:[],footer:["","",""]};}
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
/* Paper. Letter stays the built-in default in index.html's stylesheet so the
   fallback path still looks right; a non-default choice is injected into the
   generated document by extraCss(). Sizes are given in CSS px at 96dpi, which
   is what the paginator measures and what html2canvas clips to, plus points for
   the PDF page box. A4 is 210x297mm = 793.7 x 1122.5px = 595.28 x 841.89pt. */
const PAPERS={
  letter:{label:"US Letter (8.5 × 11 in)",css:"8.5in",cssH:"11in",pxW:816,pxH:1056,wpt:612,hpt:792},
  a4:{label:"A4 (210 × 297 mm)",css:"210mm",cssH:"297mm",pxW:793.7,pxH:1122.52,wpt:595.28,hpt:841.89}
};
function paperDef(){return own(PAPERS,state.paper)?PAPERS[state.paper]:PAPERS.letter;}
function isShared(e){return e.owner==null||e.owner==="shared";}
/* A card you have only just added has nothing on it, yet a flight still emitted
   "Depart —" and "Arrive —" into the middle of the itinerary. Dates, times and
   a defaulted mode do not make an item worth printing — and they must not, or
   seeding a date on an empty card would resurrect it and, because the seed is
   the trip start, park it at the very top. The card stays in the form; it just
   does not reach the page until it says something. */
const NOT_CONTENT=/^(type|owner|currency|mode|off|zone|date|time|endTime|departDate|departTime|arriveDate|arriveTime|checkIn|checkInTime|checkOut|pickupDate|pickupTime|dropoffDate|dropoffTime)$/;
function hasContent(e){
  if(!e||typeof e!=="object")return false;
  for(const k of Object.keys(e)){
    if(NOT_CONTENT.test(k))continue;
    const v=e[k];
    if(Array.isArray(v)){
      if(v.some(x=>x&&typeof x==="object"&&Object.values(x).some(y=>String(y==null?"":y).trim())))return true;
      continue;
    }
    if(String(v==null?"":v).trim())return true;
  }
  return false;
}
function listFor(idx){return multi()?ents().filter(e=>{const o=(e.owner==null?"shared":String(e.owner));return o==="shared"||o===String(idx);}):ents();}
function flightsIn(list){return list.filter(e=>e.type==="flight");}
function firstFlight(list){const m=instants(list),f=flightsIn(list).slice().sort((a,b)=>(instEnd(m,a,"dep")??Infinity)-(instEnd(m,b,"dep")??Infinity));return f[0]||null;}
function lastFlight(list){const m=instants(list),f=flightsIn(list).slice().sort((a,b)=>(instEnd(m,a,"arr")??-Infinity)-(instEnd(m,b,"arr")??-Infinity));return f[f.length-1]||null;}
function totalNights(list){let n=0;list.forEach(e=>{if(e.type==="hotel")n+=nightsBetween(e.checkIn,e.checkOut);});if(n===0&&state.tripStart&&state.tripEnd)n=nightsBetween(state.tripStart,state.tripEnd);return n;}
function routeLine(list){const f=firstFlight(list);if(!f||!f.originCode||!f.destCode)return "";const lf=lastFlight(list);const home=f.originCode;const round=lf&&lf.destCode===home;const n=totalNights(list);return home+" "+(round?"⇄":"→")+" "+f.destCode+(n?" · "+n+" nights":"");}
function dateRangeStr(){const a=state.tripStart,b=state.tripEnd;if(!a&&!b)return "";if(a&&!b)return fmtLong(a);if(!a&&b)return fmtLong(b);return fmtRange(a,b);}
function statList(list){const out=[];const n=totalNights(list);if(n)out.push({v:String(n),l:"Nights"});const h=list.filter(e=>e.type==="hotel").length;if(h)out.push({v:String(h),l:h===1?"Hotel":"Hotels"});const ff=firstFlight(list),lf=lastFlight(list);if(ff){const e=elapsedStr(ff);if(e)out.push({v:e,l:"Outbound"});}if(lf&&lf!==ff){const e=elapsedStr(lf);if(e)out.push({v:e,l:"Return"});}return out;}
/* A hotel with no stated check-in time is assumed to be mid-afternoon, which is
   only a guess — and a wrong one against a flight that lands at 15:55, which is
   how a hotel card came to print above the arrival that brought you to it. The
   card can now say when, and this is only the fallback. */
const HOTEL_CHECKIN="15:00";
/* Printed only when it is a real clock time — "25:99" is not one, and left
   unchecked it both printed itself and rolled the hotel into the next day,
   because Date(y,m,d,25,99) quietly normalises. The sort still falls back. */
function checkInShown(e){const t=String(e.checkInTime||"").trim(),m=/^(\d{1,2}):(\d{2})$/.exec(t);return (m&&+m[1]<24&&+m[2]<60)?t:"";}
function checkInAt(e){return checkInShown(e)||HOTEL_CHECKIN;}
/* The one date that identifies an item, whatever its type calls the field. */
function dateOf(e){return e.type==="flight"?e.departDate:e.type==="hotel"?e.checkIn:e.type==="car"?e.pickupDate:e.date;}
function labelFor(e){if(e.type==="flight")return (e.carrier||"Air")+(e.originCode&&e.destCode?" "+e.originCode+"–"+e.destCode:"");if(e.type==="hotel")return e.name||"Hotel";if(e.type==="car")return "Rental"+(e.company?" · "+e.company:"");if(e.type==="ground")return (own(MODE,e.mode)?MODE[e.mode]:"Transfer")+(e.to?" · "+e.to:"");if(e.type==="transport")return (e.mode||"Transport")+(e.to?" · "+e.to:"");return e.name||e.title||(own(TYPES,e.type)?TYPES[e.type].label:"")||"Item";}

/* Reference rates, vendored under data/ and refreshed weekly by CI, so the page
   still talks to no third party while it runs. Loaded once, in the background:
   the document renders immediately on whatever rates are already known and
   re-renders if the table arrives with something new to say. */
let FX=null,FXP=null;
function loadRates(){
  if(!FXP)FXP=fetch("data/rates.json").then(r=>r.ok?r.json():null).catch(()=>null)
    .then(j=>{FX=(j&&j.rates&&typeof j.rates==="object")?j:null;return FX;});
  return FXP;
}
/* Stored against USD; the base here is whatever the user picked, so re-base:
   rate(base -> cur) = usd[cur] / usd[base]. */
function autoRate(cur){
  if(!FX)return null;
  const base=state.baseCurrency||"USD";
  const a=FX.rates[cur],b=FX.rates[base];
  if(!a||!b||!isFinite(a)||!isFinite(b))return null;
  return a/b;
}
/* A hand-entered rate always wins — the reference table is a default, not an
   override, so a trip priced at the rate a card actually charged keeps it. */
function rateFor(cur){
  const manual=parseFloat(state.rates&&state.rates[cur]);
  if(manual&&!isNaN(manual))return manual;
  return autoRate(cur);
}
function toBase(cur,amt){const base=state.baseCurrency||"USD";if(cur===base)return amt;const rn=rateFor(cur);if(!rn)return null;return amt/rn;}
/* Rates are held as "1 base = N foreign", so any pair converts through the
   base: into it by dividing, out of it by multiplying. null means a rate is
   missing — the caller shows the original amount rather than inventing one. */
function convert(amt,from,to){
  if(from===to)return amt;
  const base=toBase(from,amt);
  if(base==null)return null;
  const target=state.baseCurrency||"USD";
  if(to===target)return base;
  const rn=rateFor(to);
  if(!rn)return null;
  return base*rn;
}
function personCur(p){const c=p&&p.currency;return (c&&CURRENCIES.indexOf(c)>-1)?c:(state.baseCurrency||"USD");}
/* Every row is shown in the traveler's own currency, with what they actually
   paid noted beside it. A row whose rate is missing keeps its original amount
   and is left out of the total, which is then flagged rather than quietly
   wrong. */
function costData(list,dispCur){
  const disp=dispCur||state.baseCurrency||"USD";
  const np=people().length,split=!!state.splitShared&&np>1;
  const rows=[];let sum=0,missing=false;
  list.forEach(e=>{
    const c=num(e.cost);
    if(c<=0)return;
    const cur=e.currency||"USD";
    let amt=c,note="";
    if(split&&isShared(e)){amt=c/np;note=" (1/"+np+")";}
    const conv=convert(amt,cur,disp);
    if(conv==null){
      missing=true;
      rows.push({label:labelFor(e)+note,sub:cur,amount:money(cur,amt)});
    }else{
      sum+=conv;
      rows.push({label:labelFor(e)+note,sub:cur===disp?"":"paid in "+cur,amount:money(disp,conv)});
    }
  });
  return {rows,disp,sum,missing,any:rows.length>0};
}
function tripCost(){
  const disp=state.baseCurrency||"USD";
  let sum=0,missing=false,any=false;
  ents().forEach(e=>{
    const c=num(e.cost);
    if(c<=0)return;
    any=true;
    const conv=convert(c,e.currency||"USD",disp);
    if(conv==null)missing=true;else sum+=conv;
  });
  return {rows:null,disp,sum,missing,any};
}
/* One place decides how a clock time is written, so a taxi reads "05:35 HKT"
   exactly the way a flight leg reads "18:01 CDT". Before this only flights
   carried a zone and everything else printed a bare time, which on a trip
   spanning two continents said nothing about which continent. */
function atTime(tm,zone){const t=String(tm||"").trim();if(!t)return "";const z=String(zone||"").trim();return z?t+" "+z:t;}
function tsmall(code,time,zone){return [code,atTime(time,zone)].filter(Boolean).join(" · ");}
/* One branch per item type, each written at a different time — which is how the
   same field ended up rendered four different ways (a note labelled here, bare
   there, riding a badge somewhere else). A cross-cutting rule has to be applied
   to every branch and then asserted across all of them, not just the one that
   prompted it. */
function nodesFor(e,id){
  const L=(lead,leadText,text,mono,alt)=>({lead,leadText,text,mono:!!mono,alt:!!alt});
  /* Every timed item can now say which zone its clock is in, so the home-time
     line is no longer a flight-only courtesy — a taxi at 05:35 in Hong Kong is
     16:35 the previous afternoon at home, and that is worth saying on any row
     that knows its offset. */
  const home=(node,dateIso,tm,off)=>{const hl=homeLine(dateIso,tm,off);if(hl)node.lines.push(L("key","Home",hl,false,true));};
  if(e.type==="flight"){
    const dep={id:id+"d",date:e.departDate,stime:e.departTime,off:e.departOff,stamp:fmtStamp(e.departDate),title:"Depart "+(e.originName||e.originCode||"—"),titleSmall:tsmall(e.originCode,e.departTime,e.departZone),nodeFill:true,lines:[],link:e.link,meta:{ff:e,end:"dep"}};
    if(e.carrier||e.flightNos)dep.lines.push(L("key",e.carrier||"Flight",arrowize(e.flightNos),true,false));
    {const via=connText(e);if(via)dep.lines.push(L("key","Via",via,false,false));}
    home(dep,e.departDate,e.departTime,e.departOff);
    if(e.note)dep.lines.push(L("key","Note",e.note,false,false));
    const arr={id:id+"a",date:e.arriveDate,stime:e.arriveTime,off:e.arriveOff,stamp:fmtStamp(e.arriveDate),title:"Arrive "+(e.destName||e.destCode||"—"),titleSmall:tsmall(e.destCode,e.arriveTime,e.arriveZone),nodeFill:true,lines:[],meta:{ff:e,end:"arr"}};
    home(arr,e.arriveDate,e.arriveTime,e.arriveOff);
    return [dep,arr];
  }
  /* The stamp is the check-in day in the same "Fri 14" form every other row
     uses; the checkout gets its own line, the way a rental car's drop-off does.
     It used to be a bare "13 – 20", which was the only date on the page written
     without a weekday — and, spanning a month end, without a month either. */
  if(e.type==="hotel"){const nt=nightsBetween(e.checkIn,e.checkOut);const node={id:id,date:e.checkIn,stime:checkInAt(e),off:"",stamp:fmtStamp(e.checkIn),title:e.name||"Hotel",titleSmall:[atTime(checkInShown(e),""),nt?nt+(nt===1?" night":" nights"):"",e.area].filter(Boolean).join(" · "),nodeFill:false,lines:[],link:e.link};if(e.address)node.lines.push(L("none","",e.address));if(e.checkOut)node.lines.push(L("key","Check-out",fmtStamp(e.checkOut)));if(e.note)node.lines.push(L("key","Note",e.note));return [node];}
  if(e.type==="car"){const node={id:id,date:e.pickupDate,stime:e.pickupTime,off:e.off,stamp:fmtStamp(e.pickupDate),title:"Rental car"+(e.company?" · "+e.company:""),titleSmall:atTime(e.pickupTime,e.zone),nodeFill:true,lines:[],link:e.link};if(e.pickupPlace)node.lines.push(L("key","Pick-up",e.pickupPlace));if(e.dropoffPlace||e.dropoffDate)node.lines.push(L("key","Drop-off",[e.dropoffPlace,e.dropoffDate?fmtStamp(e.dropoffDate):"",atTime(e.dropoffTime,e.zone)].filter(Boolean).join(" · ")));home(node,e.pickupDate,e.pickupTime,e.off);if(e.note)node.lines.push(L("key","Note",e.note));return [node];}
  if(e.type==="ground"){const node={id:id,date:e.date,stime:e.time,off:e.off,stamp:fmtStamp(e.date),title:(e.from&&e.to)?e.from+" → "+e.to:(e.from||e.to||"Transfer"),titleSmall:atTime(e.time,e.zone),nodeFill:true,lines:[],link:e.link};node.lines.push(L("badge",own(MODE,e.mode)?MODE[e.mode]:"Taxi",""));if(e.provider)node.lines.push(L("key","Via",e.provider));home(node,e.date,e.time,e.off);if(e.note)node.lines.push(L("key","Note",e.note));return [node];}
  if(e.type==="entertainment"){const node={id:id,date:e.date,stime:e.time,off:e.off,stamp:fmtStamp(e.date),title:e.name||"Entertainment",titleSmall:[e.venue,atTime(e.time,e.zone)].filter(Boolean).join(" · "),nodeFill:true,lines:[],link:e.link};home(node,e.date,e.time,e.off);if(e.note)node.lines.push(L("key","Note",e.note));return [node];}
  /* nodeFill:false here, as on hotels and notes, is deliberate de-emphasis —
     not an oversight to be brought in line with the filled dots on tours and
     entertainment. Confirmed 2026-07-31. */
  if(e.type==="meal"){const node={id:id,date:e.date,stime:e.time,off:e.off,stamp:fmtStamp(e.date),title:e.name||"Meal",titleSmall:[e.venue,atTime(e.time,e.zone)].filter(Boolean).join(" · "),nodeFill:false,lines:[],link:e.link};home(node,e.date,e.time,e.off);if(e.note)node.lines.push(L("key","Note",e.note));return [node];}
  if(e.type==="transport"){
    const node={id:id,date:e.date,stime:e.time,off:e.off,stamp:fmtStamp(e.date),title:(e.from&&e.to)?e.from+" → "+e.to:(e.from||e.to||"Transport"),titleSmall:atTime(e.time,e.zone),nodeFill:true,lines:[],link:firstLink(e)};
    node.lines.push(L("badge",e.mode||"Transport",""));
    if(String(e.line||"").trim())node.lines.push(L("key","Line",e.line,true,false));
    if(String(e.direction||"").trim())node.lines.push(L("key","Direction",e.direction));
    /* Stacked, one stop per row: a route calling at five places was becoming a
       single unreadable string. The label shows once and the rest align under it. */
    connLines(e).forEach((t,idx)=>node.lines.push(
      idx===0?L("key","Stops",t):{lead:"key",cont:true,text:t}));
    {const lh=linksHtml(e);if(lh)node.lines.push({lead:"key",leadText:"Links",html:lh});}
    home(node,e.date,e.time,e.off);
    /* Note last and on its own line, the way a hotel does it. */
    if(String(e.note||"").trim())node.lines.push(L("key","Note",e.note));
    return [node];
  }
  if(e.type==="meeting"){const node={id:id,date:e.date,stime:e.time,off:e.off,stamp:fmtStamp(e.date),title:e.name||"Meeting",titleSmall:[e.location,atTime([e.time,e.endTime].filter(Boolean).join("–"),e.zone)].filter(Boolean).join(" · "),nodeFill:true,lines:[],link:e.link};if(e.withWhom)node.lines.push(L("key","With",e.withWhom));home(node,e.date,e.time,e.off);if(e.note)node.lines.push(L("key","Note",e.note));return [node];}
  if(e.type==="tour"){const node={id:id,date:e.date,stime:e.time,off:e.off,stamp:fmtStamp(e.date),title:e.name||"Tour",titleSmall:[e.place,atTime(e.time,e.zone)].filter(Boolean).join(" · "),nodeFill:true,lines:[],link:e.link};if(e.provider)node.lines.push(L("key","Via",e.provider));home(node,e.date,e.time,e.off);if(e.note)node.lines.push(L("key","Note",e.note));return [node];}
  /* A Note item's body is its content, not an annotation on something else, so
     it stays unlabelled — a "Note" label under a heading that already says Note
     would just be noise. */
  if(e.type==="note"){const node={id:id,date:e.date,stime:e.time,off:e.off,stamp:fmtStamp(e.date),title:e.title||"Note",titleSmall:atTime(e.time,e.zone),nodeFill:false,lines:[]};if(e.body)node.lines.push(L("none","",e.body));return [node];}
  const node={id:id,date:e.date,stime:e.time,off:e.off,stamp:fmtStamp(e.date),title:e.name||"Activity",titleSmall:[e.place,atTime(e.time,e.zone)].filter(Boolean).join(" · "),nodeFill:true,lines:[],link:e.link};home(node,e.date,e.time,e.off);if(e.note)node.lines.push(L("key","Note",e.note));return [node];
}
/* A range check, not just a number check. "1e999" is Infinity and "1e308" is
   finite but overflows Date once multiplied out to milliseconds — both reached
   icsUTC and emitted "DTSTART:NaNNaNNaNTNaNNaN00Z", which some parsers treat
   as grounds to reject the whole calendar. No real zone is past ±14:00; the
   picker only offers −12:00…+14:00, so anything beyond ±18:00 is not an
   offset a person chose and is dropped rather than trusted. */
const OFF_MAX=1080;
function offKnown(o){const n=+o;return !(o===""||o==null||!isFinite(n)||Math.abs(n)>OFF_MAX);}
/* Every consumer of "when did this happen" has to agree, or one sheet
   contradicts itself. It did: the spine ordered on the real instant while the
   confirmations rail, the masthead route line and the elapsed stats still
   ordered on the wall clock, so a trip crossing a zone came out in two
   different orders on the same page — and the first-flight pin, also on wall
   clock, hauled a later flight to the top and overrode the sort it was meant
   to complement.

   This is the single answer, and everything asks it. One point per timed end
   (a flight has two), each resolved to a real instant. A point with no offset
   of its own borrows from whichever point that has one sits nearest it in time
   — nearest, not merely the one before it. Taking the one before puts a hotel
   booked for the night you land in the zone you took off from, half a world
   from the bed. With no offsets anywhere every instant collapses back to the
   wall clock, so a trip that never states one orders exactly as it always did. */
function instPoints(e){
  if(e.type==="flight")return [{end:"dep",date:e.departDate,time:e.departTime,off:e.departOff},
                               {end:"arr",date:e.arriveDate,time:e.arriveTime,off:e.arriveOff}];
  if(e.type==="hotel")return [{end:"at",date:e.checkIn,time:checkInAt(e),off:e.off}];
  if(e.type==="car")return [{end:"at",date:e.pickupDate,time:e.pickupTime,off:e.off}];
  return [{end:"at",date:e.date,time:e.time,off:e.off}];
}
function instants(list){
  const pts=[];
  list.forEach((e,i)=>instPoints(e).forEach((p,k)=>{p.e=e;p._ord=i*10+k;p._wall=epUTC(p.date,p.time,"");pts.push(p);}));
  pts.sort((a,b)=>{const wa=a._wall??Infinity,wb=b._wall??Infinity;return wa-wb||a._ord-b._ord;});
  const prev=[],next=[];
  let seen=null;pts.forEach((p,i)=>{prev[i]=seen;if(offKnown(p.off))seen=p;});
  seen=null;for(let i=pts.length-1;i>=0;i--){next[i]=seen;if(offKnown(pts[i].off))seen=pts[i];}
  const gap=(x,p)=>(x&&x._wall!=null&&p._wall!=null)?Math.abs(p._wall-x._wall):Infinity;
  const pick=x=>(x&&offKnown(x.off))?x.off:"";
  const m=new Map();
  pts.forEach((p,i)=>{
    const off=offKnown(p.off)?p.off:(gap(prev[i],p)<=gap(next[i],p)?pick(prev[i]):pick(next[i]));
    const r=m.get(p.e)||{};r[p.end]={t:epUTC(p.date,p.time,off),off:off};m.set(p.e,r);
  });
  return m;
}
/* A flight's own moment is its departure; every other type has just the one.
   instOff answers "which offset did this end up resolved against", which is what
   lets the calendar pin exactly what the page pins. An empty answer means no
   offset was resolvable anywhere in the trip — and that must stay floating in
   the .ics, because treating an unstated wall clock as UTC would shift a purely
   domestic trip by the whole of the reader's own offset. */
function instRec(m,e,end){const r=m.get(e);return (r&&r[end])||null;}
function instAt(m,e){const r=instRec(m,e,e.type==="flight"?"dep":"at");return r?r.t:null;}
function instEnd(m,e,end){const r=instRec(m,e,end);return r?r.t:null;}
function instOff(m,e,end){const r=instRec(m,e,end||"at");return r?r.off:"";}
function journeyNodes(list){
  const M=instants(list);
  let nodes=[];
  list.forEach((e,i)=>{nodesFor(e,"n"+i).forEach((n,k)=>{
    n._ord=i*10+k;
    n._inst=instEnd(M,e,e.type==="flight"?(k===0?"dep":"arr"):"at");
    nodes.push(n);
  });});
  nodes.sort((a,b)=>{const ia=a._inst??Infinity,ib=b._inst??Infinity;return ia-ib||a._ord-b._ord;});
  const ff=firstFlight(list),lf=lastFlight(list);
  if(ff){const idx=nodes.findIndex(n=>n.meta&&n.meta.ff===ff&&n.meta.end==="dep");if(idx>0){const [x]=nodes.splice(idx,1);nodes.unshift(x);}}
  if(lf){const idx=nodes.findIndex(n=>n.meta&&n.meta.ff===lf&&n.meta.end==="arr");if(idx>-1&&idx<nodes.length-1){const [x]=nodes.splice(idx,1);nodes.push(x);}}
  const pal=palette();nodes.forEach((n,i)=>{n.color=pal[i%pal.length];});
  return nodes;
}
/* Every caption is built from the same three parts in the same order — when,
   what time, what it is — because this column used to show a date for a dinner,
   a date range for a hotel and no date at all for a flight, which read as three
   different lists stacked on top of each other. */
function confList(list){
  const rows=[];
  const M=instants(list);
  list.slice().map((e,i)=>({e,w:instAt(M,e)??Infinity,i})).sort((a,b)=>a.w-b.w||a.i-b.i).forEach(({e})=>{
    if(!e.conf)return;
    let sub="",when=fmtStamp(e.date),tm=atTime(e.time,e.zone),what="";
    if(e.type==="flight"){sub="Air"+(e.carrier?" · "+e.carrier:"");when=fmtStamp(e.departDate);tm=atTime(e.departTime,e.departZone);what=[e.originCode,e.destCode].filter(Boolean).join(" → ");}
    else if(e.type==="hotel"){const nt=nightsBetween(e.checkIn,e.checkOut);sub="Hotel · "+(e.name||"");when=[fmtStamp(e.checkIn),fmtStamp(e.checkOut)].filter(Boolean).join(" – ");tm=atTime(checkInShown(e),"");what=nt?nt+(nt===1?" night":" nights"):"";}
    else if(e.type==="car"){sub="Car"+(e.company?" · "+e.company:"");when=fmtStamp(e.pickupDate);tm=atTime(e.pickupTime,e.zone);what=[e.pickupPlace,e.dropoffPlace].filter(Boolean).join(" → ");}
    else if(e.type==="ground"){sub=(own(MODE,e.mode)?MODE[e.mode]:"Transfer")+(e.provider?" · "+e.provider:"");what=[e.from,e.to].filter(Boolean).join(" → ");}
    else if(e.type==="entertainment"){sub="Show · "+(e.name||"");what=e.venue||"";}
    else if(e.type==="meal"){sub="Dining · "+(e.name||"");what=e.venue||"";}
    else if(e.type==="transport"){sub=(e.mode||"Transport")+(e.line?" · "+e.line:"");what=[e.from,e.to].filter(Boolean).join(" → ");}
    else if(e.type==="meeting"){sub="Meeting · "+(e.name||"");what=e.location||"";}
    else if(e.type==="tour"){sub="Tour · "+(e.name||"");what=e.provider||"";}
    else{sub="Activity · "+(e.name||"");what=e.place||"";}
    rows.push({sub,val:e.conf,cap:[when,tm,what].filter(Boolean).join(" · ")});
  });
  return rows;
}

/* ===== output ===== */
function titleFont(len){if(len<=14)return 34;if(len<=20)return 29;if(len<=28)return 24;if(len<=38)return 20;if(len<=52)return 17;return 15;}
function renderLine(ln){let lead="";if(ln.lead==="badge"&&ln.leadText)lead='<span class="pref">'+esc(ln.leadText)+'</span>';
  else if(ln.lead==="key"&&ln.leadText)lead='<span class="k">'+esc(ln.leadText)+'</span>';
  /* Second and later rows of a stacked list: an empty label span, which still
     takes its min-width, so the values stay in one column under the heading. */
  else if(ln.lead==="key"&&ln.cont)lead='<span class="k"></span>';
  /* ln.html is only ever set from linksHtml(), which sanitises both the href
     and the label itself. Everything else still goes through inl(). */
  const body=ln.html?ln.html:(ln.mono?'<span class="mono">'+inl(ln.text)+'</span>':inl(ln.text));
  return '<p'+(ln.alt?' class="alt"':'')+'>'+lead+body+'</p>';}
function renderNode(n){const fill=n.nodeFill?" node-fill":"";const small=n.titleSmall?' <small>'+esc(n.titleSmall)+'</small>':"";const href=safeUrl(n.link);const tt=href?'<a href="'+esc(href)+'" style="color:inherit;text-decoration:none">'+esc(n.title)+'</a>':esc(n.title);const det=n.lines.length?'\n        <div class="detail">'+n.lines.map(renderLine).join("\n        ")+'</div>':"";return '<div class="leg'+fill+'" style="--seg:'+n.color+'">\n        <div class="leg-head"><span class="stamp">'+esc(n.stamp)+'</span><span class="title">'+tt+small+'</span></div>'+det+'\n      </div>';}
/* Grouped off the item's own date string rather than off its sort key: the key
   is an instant now, and bucketing instants by day would file a 07:00 flight
   out of Hong Kong under the previous day. A day heading means the local day. */
function dayHead(n,iso){const [,m,d]=parseISO(iso||""),w=dow(iso);
  const lbl=(w==null||!MONT[m-1])?"Unscheduled":WD[w]+" "+d+" "+MONT[m-1];
  return '<div class="dayhead"><span class="dn">Day '+n+'</span><span class="dd">'+esc(lbl)+'</span></div>';}
function dayKey(iso){return iso||"u";}
/* Ungrouped, the spine is one chronological run and the instant order is the
   whole answer. Grouped, the day is the unit and the days have to run forwards
   — which the instant order does not guarantee: fly Tokyo 3 Mar 08:00 into
   Honolulu 2 Mar 20:00 and the later instant carries the earlier local date,
   which printed "Day 2 · Mon 2" beneath "Day 1 · Tue 3" and handed one date two
   different day numbers if the trip came back to it. So bucket by local date
   with the days ascending, and keep true order inside each day. */
function renderSpine(nodes,grouped){
  if(!grouped)return nodes.map(renderNode).join("\n\n      ");
  const byDay=nodes.map((n,i)=>[n,i]).sort((a,b)=>{
    const da=a[0].date||"\uffff",db=b[0].date||"\uffff";      /* undated last, as before */
    return da<db?-1:da>db?1:a[1]-b[1];
  }).map(x=>x[0]);
  let out=[],last=null,dn=0;
  byDay.forEach(n=>{const k=dayKey(n.date);if(k!==last){last=k;dn++;out.push(dayHead(dn,n.date));}out.push(renderNode(n));});
  return out.join("\n\n      ");
}

function mastTitles(s){const titles=(s.titles||[]).map(t=>String(t||"").trim()).filter(Boolean);return {fs:titleFont(titles.join("").length),html:titles.map(esc).join('<span class="sep">/</span>'),plain:titles.join(" / ")};}
function statStrip(stats){return stats.length?'<div class="stats">'+stats.map(x=>'<div class="stat"><b>'+esc(x.v)+'</b><span>'+esc(x.l)+'</span></div>').join("")+'</div>':"";}
/* One flat list where an entry is either {heading} or {title,body}: order does
   the grouping, so reordering is a single array move and nothing needs
   migrating. Items before the first heading entry belong to checklistHeading,
   which is what every existing draft and share link contains. */
function checklistSections(s){
  const out=[];let cur=null;
  (s.checklist||[]).forEach(it=>{
    if(!it||typeof it!=="object")return;
    if(typeof it.heading==="string"){cur={heading:it.heading,items:[]};out.push(cur);return;}
    if(!cur){cur={heading:s.checklistHeading||"Before departure",items:[]};out.push(cur);}
    cur.items.push(it);
  });
  return out.filter(sec=>sec.items.length);          /* an empty section prints nothing */
}
function railChecklist(s){
  const secs=checklistSections(s);
  if(!secs.length)return "";
  return secs.map(sec=>{
    const items=sec.items.map(it=>{
      /* A distinct class, not a bare <b>: inl() also emits <b> for **bold**
         inside the body, and a blanket rule would turn that inline emphasis
         into block elements. */
      const tb=it.title?'<b class="lead">'+inl(it.title)+'</b>':"";
      return '<li>'+tb+inl(it.body)+'</li>';
    }).join("\n        ");
    return '<h2>'+esc(sec.heading||"Checklist")+'</h2>\n      <ul class="chk">\n        '+items+'\n      </ul>';
  }).join("\n\n      ")+'\n\n      ';
}
function railReference(s){const ref=(s.emergency||[]).filter(x=>x&&(x.label||x.value));if(!ref.length)return "";return '<h2>Reference</h2>\n      '+ref.map(x=>'<div class="rec"><div class="rec-s">'+esc(x.label)+'</div><div class="rec-t">'+esc(x.value)+'</div></div>').join("\n      ")+'\n\n      ';}
function costTable(cd,heading){
  if(!cd.any)return "";
  let t='<h2>'+esc(heading)+'</h2>\n      <table class="cost">\n        ';
  if(cd.rows)t+=cd.rows.map(r=>'<tr><td>'+esc(r.label)+
    (r.sub?'<span class="sub">'+esc(r.sub)+'</span>':'')+'</td><td>'+esc(r.amount)+'</td></tr>').join("\n        ");
  t+='\n        <tr class="tot"><td>Total · '+esc(cd.disp)+(cd.missing?' *':'')+'</td><td>'+
    esc(money(cd.disp,cd.sum))+'</td></tr>';
  t+='\n      </table>';
  if(cd.missing)t+='\n      <p style="font-family:var(--mono);font-size:8px;color:var(--faint);letter-spacing:.03em;margin-top:5px;line-height:1.4">* No exchange rate set for every currency; the total covers only what could be converted.</p>';
  return t+'\n\n      ';
}
function buildSheet(s,list,eyebrowText,home,dispCur){
  curHome=home||{};
  list=list.filter(hasContent);      /* one place, so stats and route agree */
  const mt=mastTitles(s),dr=dateRangeStr(),rl=routeLine(list);
  const mastR=(dr||rl)?'<div class="mast-r">'+(dr?'<div class="daterange">'+esc(dr)+'</div>':'')+(rl?'<div class="mast-meta">'+esc(rl)+'</div>':'')+'</div>':'';
  const main='<main>\n      <h2>Journey</h2>\n      <div class="spine">\n      '+renderSpine(journeyNodes(list),s.dayGrouped)+'\n      </div>\n    </main>';
  const confs=confList(list);
  let rail="";
  if(confs.length)rail+='<h2>Confirmations</h2>\n      '+confs.map(c=>'<div class="rec"><div class="rec-s">'+esc(c.sub)+'</div><div class="rec-v">'+esc(c.val)+'</div><div class="rec-c">'+esc(c.cap)+'</div></div>').join("\n      ")+'\n\n      ';
  if(s.showCosts){const cd=costData(list,dispCur);if(cd.any)rail+=costTable(cd,"Booked cost");}
  rail+=railChecklist(s)+railReference(s);
  const ft=s.footer||["","",""];
  const foot='<footer><span>'+esc(ft[0]||"")+'</span><span>'+esc(ft[1]||"")+'</span><span>'+esc(ft[2]||"")+'</span></footer>';
  return '<section class="sheet" data-run="'+esc(mt.plain)+'" data-runmeta="'+esc(eyebrowText)+'">\n\n  <div class="mast"><div><div class="eyebrow">'+esc(eyebrowText)+'</div><h1 style="font-size:'+mt.fs+'px">'+mt.html+'</h1></div>'+mastR+'</div>\n\n  '+statStrip(statList(list))+'\n\n  <div class="cols">\n\n    '+main+'\n\n    <aside class="rail">\n\n      '+rail+'\n\n    </aside>\n  </div>\n\n  '+foot+'\n\n</section>';
}
function buildCover(s){
  curHome={};
  const mt=mastTitles(s),dr=dateRangeStr(),ppl=people();
  const sharedList=ents().filter(e=>isShared(e)&&hasContent(e));
  const stats=[];const n=totalNights(sharedList);if(n)stats.push({v:String(n),l:"Nights"});const h=sharedList.filter(e=>e.type==="hotel").length;if(h)stats.push({v:String(h),l:h===1?"Hotel":"Hotels"});stats.push({v:String(ppl.length),l:"Travelers"});
  const mastR='<div class="mast-r">'+(dr?'<div class="daterange">'+esc(dr)+'</div>':'')+'<div class="mast-meta">'+ppl.length+' travelers</div></div>';
  const main='<main>\n      <h2>Shared plan</h2>\n      <div class="spine">\n      '+renderSpine(journeyNodes(sharedList),s.dayGrouped)+'\n      </div>\n    </main>';
  let rail='<h2>Travelers</h2>\n      '+ppl.map((p,idx)=>{const list=listFor(idx);const rl=routeLine(list);const st=statList(list).filter(x=>x.l==="Outbound"||x.l==="Return").map(x=>x.l+" "+x.v).join(" · ");return '<div class="rec"><div class="rec-s">'+esc(p.name||("Traveler "+(idx+1)))+'</div><div class="rec-t">'+esc(rl||"—")+'</div><div class="rec-c">'+esc(st)+'</div></div>';}).join("\n      ")+'\n\n      ';
  if(s.showCosts){const tc=tripCost();if(tc.any)rail+=costTable(tc,"Trip cost");}
  rail+=railChecklist(s)+railReference(s);
  const ft=s.footer||["","",""];
  const foot='<footer><span>'+esc(ft[0]||"")+'</span><span>'+esc(ft[1]||"")+'</span><span>Overview</span></footer>';
  return '<section class="sheet" data-run="'+esc(mt.plain)+'" data-runmeta="'+esc(s.eyebrow+" · Overview")+'">\n\n  <div class="mast"><div><div class="eyebrow">'+esc(s.eyebrow+" · Overview")+'</div><h1 style="font-size:'+mt.fs+'px">'+mt.html+'</h1></div>'+mastR+'</div>\n\n  '+statStrip(stats)+'\n\n  <div class="cols">\n\n    '+main+'\n\n    <aside class="rail">\n\n      '+rail+'\n\n    </aside>\n  </div>\n\n  '+foot+'\n\n</section>';
}
function buildBody(s){const ppl=people(),mm=ppl.length>1;let sheets=[];if(mm&&s.showSummaryPage)sheets.push(buildCover(s));ppl.forEach((p,idx)=>{const list=mm?listFor(idx):ents();const eb=s.eyebrow+(p.name?" · "+p.name:"");sheets.push(buildSheet(s,list,eb,{tz:p.homeTz,off:p.homeOff,label:p.homeLabel},personCur(p)));});return sheets.join("\n\n");}

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
function once(){
  if(fired)return;fired=true;
  /* Waiting a frame is a preference, not a dependency: rAF is throttled to
     nothing inside a cross-origin iframe that is hidden or clipped out of
     view, which is exactly what the phone layout does to collapse the
     preview. Measuring still works there — only the callback is withheld —
     so race a short timer against the frame and take whichever arrives. */
  var ran=false,run=function(){if(ran)return;ran=true;go();};
  requestAnimationFrame(run);
  setTimeout(run,50);
}
setTimeout(once,3000);                             /* fonts.ready can hang offline */
if(D.fonts&&D.fonts.ready)D.fonts.ready.then(once,once);else once();
})();`;

function extraCss(){const th=themeDef();const varOv=Object.keys(th.vars).length?':root{'+Object.keys(th.vars).map(k=>k+":"+th.vars[k]).join(";")+'}':'';
  const dh='.dayhead{margin:6px 0 11px -26px;padding-bottom:5px;border-bottom:1px solid var(--rule);display:flex;align-items:baseline;gap:9px}.dayhead .dn{font-family:var(--mono);font-size:8px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}.dayhead .dd{font-family:var(--cond);font-weight:700;font-size:13px;letter-spacing:.01em}.leg+.dayhead{margin-top:14px}';
  const page='html[data-print] .page{box-shadow:none;margin:0}';
  /* Letter is already the default in the base stylesheet; anything else has to
     override the box, the @page box and the print width together, or the
     paginator packs to one size while the printer uses another. */
  const pg=paperDef();
  const paper=(state.paper&&state.paper!=="letter")
    ? '.sheet,.page{width:'+pg.css+'}.sheet{min-height:'+pg.cssH+'}.page{height:'+pg.cssH+'}'+
      '@page{size:'+pg.css+' '+pg.cssH+';margin:0}@media print{html,body{width:'+pg.css+'}}'
    : '';
  return '<style>'+varOv+dh+page+paper+'</style>';}
/* Opened from file://, location.origin is "null" and no targetOrigin can match,
   so fall back to "*" there. The payload is a page count and a height. */
function postTarget(){const o=location.origin;return (o&&o!=="null")?o:"*";}
function wrapDoc(bodyHtml,titleText){const css=document.getElementById("itin-css").textContent;
  return '<!DOCTYPE html>\n<html lang="en" class="paginating">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="color-scheme" content="light only">\n<title>'+esc(titleText)+'</title>\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">\n<style>\n'+css+'\n</style>\n'+extraCss()+'\n</head>\n<body>\n'+bodyHtml+'\n<script>var ITIN_ORIGIN='+JSON.stringify(postTarget())+';\n'+PAGINATOR+'<\/script>\n</body>\n</html>';}
function docTitle(){const t=(state.titles||[]).filter(x=>x&&x.trim()).join(" & ");return t+(dateRangeStr()?" — "+dateRangeStr():"");}
function buildDoc(s){return wrapDoc(buildBody(s),docTitle());}
function buildDocFor(idx){const ppl=people();const list=ppl.length>1?listFor(idx):ents();const eb=state.eyebrow+(ppl[idx].name?" · "+ppl[idx].name:"");return wrapDoc(buildSheet(state,list,eb,{tz:ppl[idx].homeTz,off:ppl[idx].homeOff,label:ppl[idx].homeLabel},personCur(ppl[idx])),docTitle()+(ppl[idx].name?" · "+ppl[idx].name:""));}

/* ===== calendar export =====
   One .ics for the whole trip, generated here — no server, same as the PDF.
   Anything whose offset RESOLVED — its own, or inherited from the nearest row
   that has one, exactly as the printed page resolves it — is emitted in UTC and
   stays correct wherever the calendar is read. A row is emitted floating only
   when no offset was resolvable anywhere in the trip: no zone, interpreted
   wherever the reader happens to be. That case must keep floating, because
   treating an unstated wall clock as UTC would shift a purely domestic trip by
   the whole of the reader's own offset.

   Mixing the two used to be automatic, because only flights could hold an
   offset: a calendar set to Chicago would show a 22 Aug Macau airport transfer
   nine hours AFTER the Hong Kong flight it was feeding, since one was pinned to
   an instant and the other was not. */
/* Every line break has to go, not just CRLF and LF: a lone CR reaches this from
   a share link or hand-edited JSON — a textarea can never produce one — and
   parsers that treat CR as a terminator would read whatever follows it as
   further calendar lines. */
function icsEsc(v){return String(v==null?"":v).replace(/\\/g,"\\\\").replace(/;/g,"\\;")
  .replace(/,/g,"\\,").replace(/\r\n|[\r\n]/g,"\\n");}
/* RFC 5545 folds at 75 octets, and these lines carry non-ASCII place names, so
   measure bytes rather than characters. */
function icsFold(line){
  const enc=new TextEncoder();
  if(enc.encode(line).length<=75)return line;
  let out="",cur="",bytes=0;
  for(const ch of line){
    const n=enc.encode(ch).length;
    if(bytes+n>74){out+=cur+"\r\n ";cur="";bytes=0;}
    cur+=ch;bytes+=n;
  }
  return out+cur;
}
function icsDate(iso){return String(iso||"").replace(/-/g,"");}
/* Day arithmetic in UTC, so a date never lands on the hour a zone skips for
   daylight saving and slides to the day before. */
function icsDateAdd(iso,days){
  const [y,m,d]=parseISO(iso);
  if(!y||!m||!d)return icsDate(iso);
  const t=new Date(Date.UTC(y,m-1,d+days)),p=n=>String(n).padStart(2,"0");
  return t.getUTCFullYear()+p(t.getUTCMonth()+1)+p(t.getUTCDate());
}
function icsLocal(iso,tm,plusDays){
  const t=String(tm||"00:00").split(":");
  return (plusDays?icsDateAdd(iso,plusDays):icsDate(iso))+
    "T"+String(t[0]||"00").padStart(2,"0")+String(t[1]||"00").padStart(2,"0")+"00";
}
function icsUTC(ms){
  const d=new Date(ms),p=n=>String(n).padStart(2,"0");
  return d.getUTCFullYear()+p(d.getUTCMonth()+1)+p(d.getUTCDate())+"T"+
    p(d.getUTCHours())+p(d.getUTCMinutes())+"00Z";
}
/* Start, end and whether it is an all-day span, per item type. */
function icsWhen(e,roff){
  if(e.type==="flight"){
    const a=epUTC(e.departDate,e.departTime,e.departOff),b=epUTC(e.arriveDate,e.arriveTime,e.arriveOff);
    if(a!=null&&b!=null&&b>a&&e.departOff!==""&&e.arriveOff!=="")
      return {start:"DTSTART:"+icsUTC(a),end:"DTEND:"+icsUTC(b)};
    if(e.departDate)return {start:"DTSTART:"+icsLocal(e.departDate,e.departTime),end:"DURATION:PT2H"};
    return null;
  }
  /* DTEND is exclusive on an all-day span, so every one of these has to end on
     the day AFTER the last day it covers. Ending it on the same day is a span
     of zero days, which some clients import as nothing at all. */
  if(e.type==="hotel"){
    if(!e.checkIn)return null;
    /* The checkout date is already the day after the last night, so it is used
       as-is — that is what makes the span exactly the nights stayed. Only a
       missing or backwards checkout needs the day added. */
    return {start:"DTSTART;VALUE=DATE:"+icsDate(e.checkIn),
      end:"DTEND;VALUE=DATE:"+(e.checkOut&&e.checkOut>e.checkIn?icsDate(e.checkOut):icsDateAdd(e.checkIn,1))};
  }
  if(e.type==="car"){
    if(!e.pickupDate)return null;
    /* Unlike a hotel, you still have the car on the drop-off day, so that day
       is inside the span and the exclusive end is the one after it. */
    if(e.dropoffDate)return {start:"DTSTART;VALUE=DATE:"+icsDate(e.pickupDate),
      end:"DTEND;VALUE=DATE:"+icsDateAdd(e.dropoffDate>e.pickupDate?e.dropoffDate:e.pickupDate,1)};
    {const ms=offKnown(roff)?epUTC(e.pickupDate,e.pickupTime,roff):null;
     if(ms!=null)return {start:"DTSTART:"+icsUTC(ms),end:"DURATION:PT1H"};}
    return {start:"DTSTART:"+icsLocal(e.pickupDate,e.pickupTime),end:"DURATION:PT1H"};
  }
  if(!e.date)return null;
  if(!e.time)return {start:"DTSTART;VALUE=DATE:"+icsDate(e.date),
    end:"DTEND;VALUE=DATE:"+icsDateAdd(e.date,1)};
  /* Pinned to a real instant when the row states its offset, floating when it
     does not — the same rule a flight has always followed. */
  const ms=offKnown(roff)?epUTC(e.date,e.time,roff):null;
  /* An end time at or before the start is a meeting that runs past midnight —
     a 20:00 dinner ending at 01:00 — so it ends on the next day. Equal times
     say nothing about the length and fall through to the hour below. */
  if(e.type==="meeting"&&e.endTime&&e.endTime!==e.time){
    const plus=e.endTime>e.time?0:1;
    if(ms!=null)return {start:"DTSTART:"+icsUTC(ms),
      end:"DTEND:"+icsUTC(epUTC(e.date,e.endTime,roff)+plus*86400000)};
    return {start:"DTSTART:"+icsLocal(e.date,e.time),end:"DTEND:"+icsLocal(e.date,e.endTime,plus)};
  }
  /* No end time recorded, so an hour — long enough to show up as a block, short
     enough not to swallow the afternoon. */
  if(ms!=null)return {start:"DTSTART:"+icsUTC(ms),end:"DURATION:PT1H"};
  return {start:"DTSTART:"+icsLocal(e.date,e.time),end:"DURATION:PT1H"};
}
function icsWhere(e){
  return String(e.address||e.location||e.venue||e.place||e.pickupPlace||
    (e.type==="flight"?(e.originName||e.originCode||""):"")||e.from||"").trim();
}
function icsDetail(e){
  const bits=[];
  if(e.note)bits.push(e.note);
  if(e.body)bits.push(e.body);
  if(e.conf)bits.push("Confirmation: "+e.conf);
  /* An all-day span cannot carry a clock time, so the two that matter are
     spelled out instead of being silently lost. */
  if(e.type==="hotel"&&checkInShown(e))bits.push("Check-in: "+checkInShown(e));
  if(e.type==="car"&&(e.dropoffDate||e.dropoffTime))
    bits.push("Drop-off: "+[e.dropoffPlace,e.dropoffDate?fmtStamp(e.dropoffDate):"",atTime(e.dropoffTime,e.zone)].filter(Boolean).join(" · "));
  if(e.provider)bits.push("Operator: "+e.provider);
  if(e.withWhom)bits.push("With: "+e.withWhom);
  const via=connText(e);
  if(via)bits.push((e.type==="flight"?"Via: ":"Stops: ")+via);
  if(e.flightNos)bits.push("Flight: "+arrowize(e.flightNos));
  if(e.line)bits.push("Line: "+e.line);
  if(e.direction)bits.push("Direction: "+e.direction);
  linkList(e).forEach(x=>bits.push(safeUrl(x.url)));
  if(e.link&&safeUrl(e.link))bits.push(safeUrl(e.link));
  return bits.join("\n");
}
/* Whoever is asked for: the whole trip by default, or one traveler's own items
   plus everything shared — the same split their printed pages use. A shared
   item keeps the same UID in every file, so importing a traveler's calendar
   alongside the group's updates those events rather than doubling them. */
function buildICS(only,who){
  const stamp=icsUTC(Date.now());
  const host=(location.hostname||"itinerary").replace(/[^\w.-]/g,"");
  const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Itinerary Builder//EN","CALSCALE:GREGORIAN",
    "X-WR-CALNAME:"+icsEsc([docTitle()||"Itinerary",who].filter(Boolean).join(" · "))];
  const list=(only||ents()).filter(hasContent);
  /* The same resolution the printed page uses, so the two cannot disagree about
     when something happens. */
  const M=instants(list);
  /* A UID used to be the item's position in this list, so inserting anything —
     or merely filling in a card that had been empty and filtered out — renumbered
     every later event. Re-importing then produced a second copy of the whole trip
     instead of updating it. Derived from what the event *is* instead, with a
     counter only where that genuinely collides. Editing an item's type, date or
     title still mints a new UID; nothing short of a stored id can avoid that. */
  const seen=new Map();
  list.forEach(e=>{
    const when=icsWhen(e,instOff(M,e,"at"));
    if(!when)return;
    const title=labelFor(e)||"Itinerary item";
    const key=[e.type||"item",icsDate(dateOf(e))||"undated",slug(title)].join("-");
    const n=(seen.get(key)||0)+1;seen.set(key,n);
    lines.push("BEGIN:VEVENT",
      "UID:itin-"+key+(n>1?"-"+n:"")+"@"+host,
      "DTSTAMP:"+stamp,when.start,when.end,
      "SUMMARY:"+icsEsc(title));
    const where=icsWhere(e);
    if(where)lines.push("LOCATION:"+icsEsc(where));
    /* A real URL property, not just a string in the body: calendars render it as
       something you can click. The body still lists every link. */
    const url=firstLink(e);
    if(url)lines.push("URL:"+icsEsc(url));
    const detail=icsDetail(e);
    if(detail)lines.push("DESCRIPTION:"+icsEsc(detail));
    lines.push("END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  return lines.map(icsFold).join("\r\n")+"\r\n";
}

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
const framePaperW=()=>Math.ceil(paperDef().pxW)+32;   /* 16px of slack each side */
/* Below this width the paper cannot be scaled down and stay legible, so it is
   shown at natural size and left to the browser's own zoom instead. Kept in
   sync with the phone media query in css/app.css. */
const PHONE_W=700;
const onPhone=()=>window.matchMedia("(max-width:"+PHONE_W+"px)").matches;
function applyScale(){
  const h=lastH+FRAME_SLACK;
  if(onPhone()){
    /* No transform: scaling to 41% renders body text at ~4.5px. At natural
       size the page scrolls sideways and pinch-zoom works on real text.
       Collapsed, the frame keeps its height and the wrap clips it to nothing,
       so the document still paginates and can report its page count. */
    frame.style.transform="none";
    frame.style.width=framePaperW()+"px";
    frame.style.height=h+"px";
    pvwrap.style.height=document.body.classList.contains("pv-open")?"auto":"0px";
    scaleTag.textContent="100%";
    return;
  }
  const w=pvwrap.clientWidth,sc=Math.min(1,w/framePaperW());
  frame.style.width=framePaperW()+"px";
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
  lastH=d.height||lastH;applyScale();syncTopBtn();
  if(pageTag)pageTag.textContent=d.pages?d.pages+(d.pages===1?" page":" pages"):"";
  // An item taller than a whole page can't be broken cleanly, so its tail
  // is clipped. Say so rather than losing the text quietly.
  if(warnTag)warnTag.textContent=d.over?("⚠ "+d.over+" item"+(d.over===1?" is":"s are")+" too long for one page — text is clipped"):"";
});
function refreshPreview(){frame.srcdoc=buildDoc(state);}
frame.addEventListener("load",measureFrame);
function saveDraft(){try{localStorage.setItem("itin-draft-v4",JSON.stringify(state));}catch(e){}}
/* One level of undo, covering the actions that destroy work with no way back:
   the ✕ buttons, and the three that replace the whole trip. "Load sample" is
   the sharpest of those — it wipes everything without even asking. Deliberately
   not wired to Ctrl+Z, which would fight the browser's own undo inside a text
   field. */
let undoSnap=null,undoWhat="";
function markUndo(what){undoSnap=JSON.stringify(state);undoWhat=what;paintUndo();}
function paintUndo(){
  const b=document.getElementById("btnUndo");if(!b)return;
  b.disabled=!undoSnap;
  b.title=undoSnap?("Undo "+undoWhat):"Nothing to undo";
  b.textContent=undoSnap?("Undo "+undoWhat):"Undo";
}
function doUndo(){
  if(!undoSnap)return;
  try{state=JSON.parse(undoSnap);}catch(e){return;}
  undoSnap=null;undoWhat="";
  renderForm();refreshPreview();saveDraft();paintUndo();
}
function schedulePreview(){clearTimeout(pvTimer);pvTimer=setTimeout(()=>{refreshPreview();saveDraft();},180);}
window.addEventListener("resize",applyScale);

/* ===== form ===== */
const form=document.getElementById("form");
/* aria is for the few inputs that stand alone without a fld() label — a
   placeholder is not a name, and it disappears as soon as you type. */
function inp(path,val,ph,mono,aria){return '<input class="f'+(mono?" mono":"")+'" data-path="'+path+'"'+(aria?' aria-label="'+esc(aria)+'"':"")+' value="'+esc(val)+'" placeholder="'+esc(ph||"")+'">';}
function area(path,val,ph){return '<textarea class="f" data-path="'+path+'" placeholder="'+esc(ph||"")+'">'+esc(val)+'</textarea>';}
function dateF(path,val){return '<input type="date" class="f" data-path="'+path+'" value="'+esc(val)+'">';}
function timeF(path,val){return '<input type="time" class="f" data-path="'+path+'" value="'+esc(val)+'">';}
function sel(path,val,opts){const o=opts.map(op=>{const v=Array.isArray(op)?op[0]:op,t=Array.isArray(op)?op[1]:op;return '<option value="'+esc(v)+'"'+(String(v)===String(val)?" selected":"")+'>'+esc(t)+'</option>';}).join("");return '<select class="f" data-path="'+path+'">'+o+'</select>';}
/* ~400 zones is too many for a flat list, so group them by region. */
function selGroups(path,val,groups){
  const o=groups.map(g=>'<optgroup label="'+esc(g[0])+'">'+g[1].map(op=>'<option value="'+esc(op[0])+'"'+(String(op[0])===String(val)?" selected":"")+'>'+esc(op[1])+'</option>').join("")+'</optgroup>').join("");
  return '<select class="f" data-path="'+path+'"><option value=""'+(val?"":" selected")+'>—</option>'+o+'</select>';
}
function chk(path,val,label){return '<label class="ck"><input type="checkbox" data-path="'+path+'"'+(val?" checked":"")+'> '+esc(label)+'</label>';}
/* A label sitting next to an input is not attached to it — a screen reader
   announces every one of these as an unnamed edit box. The control is built as
   a string before fld() sees it, so stamp an id on its opening tag and point
   the label at it. Ids only need to be unique within the document, so a render
   counter is enough. */
let FIELD_N=0;
function fld(lb,ctl,wide){
  const id="fld"+(++FIELD_N);
  const tagged=String(ctl).replace(/^<(input|select|textarea)\b/,'<$1 id="'+id+'"');
  return '<div class="field'+(wide?" wide":"")+'"><label class="lb" for="'+id+'">'+lb+'</label>'+tagged+'</div>';
}
/* Icon buttons read as "✕" / "↑" / "↓" with nothing else to go on. */
const IBTN_LABEL={"✕":"Delete","↑":"Move up","↓":"Move down"};
function ibtn(act,i,sym,cls,dis){
  const name=(own(IBTN_LABEL,sym)?IBTN_LABEL[sym]:act)+" item "+(i+1);
  return '<button class="ic'+(cls?" "+cls:"")+'" data-act="'+act+'" data-i="'+i+'" aria-label="'+esc(name)+'"'+(dis?" disabled":"")+'>'+sym+'</button>';
}
function ownerOpts(){return [["shared","Both / all travelers"]].concat(people().map((p,idx)=>[String(idx),p.name||("Traveler "+(idx+1))]));}
/* The same four controls on every timed item, so a ferry is entered the way a
   flight leg is. The offset is what lets the row be placed against rows in
   other zones, exported to a calendar as a real instant, and shown in home
   time; the label is only what prints beside the clock. Flights keep their own
   pair per leg, since a departure and an arrival are rarely in one zone. */
function whenRow(p,e){
  return '<div class="grid">'+fld("Date",dateF(p+".date",e.date))+fld("Time",timeF(p+".time",e.time))+'</div>'+
    '<div class="grid">'+fld("UTC offset",sel(p+".off",e.off,offsetOpts()))+fld("Timezone",inp(p+".zone",e.zone,"MDT"))+'</div>';
}

function tail(e,i,noLink){const p="entities."+i;let h='<div class="grid three">'+fld("Confirmation",inp(p+".conf",e.conf,"Code",true))+fld("Cost",inp(p+".cost",e.cost,"0.00"))+fld("Currency",sel(p+".currency",e.currency||"USD",CURRENCIES))+'</div>';if(!noLink)h+=fld("Link (map / booking)",inp(p+".link",e.link,"https://…"),true);h+=fld("Note",area(p+".note",e.note,"Optional detail. **bold** supported."),true);return h;}
/* Shared by flights and transport, which mean different things by it: a flight
   changes vehicle at an airport, a train merely calls at a station. The wording
   follows the type so a bus route never asks for an airport. */
const CONN_WORDS={
  flight:{head:"Connections / layovers",place:"Airport or place",placeHint:"EWR",
          wait:"Layover",waitHint:"1h 40m",one:"connection"},
  transport:{head:"Stops along the way",place:"Station or stop",placeHint:"Coimbra-B",
             wait:"Wait",waitHint:"5m",one:"stop",
             change:"Change to (leave blank if you stay on)",changeHint:"AP 130 / Green line"}
};
function connRows(e,i){
  const w=own(CONN_WORDS,e.type)?CONN_WORDS[e.type]:CONN_WORDS.flight;
  let h='<div class="sub-h">'+esc(w.head)+'</div>';
  connList(e).forEach((c,j)=>{
    const cp="entities."+i+".connections."+j;
    h+='<div class="grid conn">'+fld(w.place,inp(cp+".place",c.place,w.placeHint))+
      fld(w.wait,inp(cp+".wait",c.wait,w.waitHint))+
      '<button class="ic del" data-act="conn-del" data-i="'+i+'" data-j="'+j+'" aria-label="'+
      esc("Delete "+w.one+" "+(j+1))+'">✕</button></div>';
    if(w.change)h+='<div class="conn-change">'+fld(w.change,inp(cp+".change",c.change,w.changeHint),true)+'</div>';
  });
  h+='<div class="addrow"><button class="add" data-act="conn-add" data-i="'+i+'">+ '+
    esc(w.one.charAt(0).toUpperCase()+w.one.slice(1))+'</button></div>';
  return h;
}
function linkRows(e,i){
  let h='<div class="sub-h">Links (Map / Booking)</div>';
  /* The editor lists what is stored, not what renders: a row with a bad or
     half-typed URL must still be visible so it can be fixed. */
  const list=Array.isArray(e.links)?e.links:[];
  list.forEach((x,j)=>{
    const lp="entities."+i+".links."+j;
    h+='<div class="grid conn">'+fld("Label",inp(lp+".label",x.label,"Timetable"))+
      fld("URL",inp(lp+".url",x.url,"https://…"))+
      '<button class="ic del" data-act="link-del" data-i="'+i+'" data-j="'+j+'" aria-label="'+
      esc("Delete link "+(j+1))+'">✕</button></div>';
  });
  h+='<div class="addrow"><button class="add" data-act="link-add" data-i="'+i+'">+ Link</button></div>';
  return h;
}
function entityCard(e,i){
  const p="entities."+i,tm=own(TYPES,e.type)?TYPES[e.type]:{label:e.type,c:"#666"};
  /* The same label and stamp the document itself uses, so the card in the form
     and the leg on the page announce themselves identically. Suppressed while
     the card is still blank, where labelFor() would only invent "Air". */
  const sum=hasContent(e)?[labelFor(e),fmtStamp(dateOf(e))].filter(Boolean).join(" · "):"";
  let h='<div class="card" style="border-left-color:'+tm.c+'"><div class="card-h"><span class="tag" style="background:'+tm.c+'">'+esc(tm.label)+'</span>'+
    (sum?'<span class="card-sum">'+esc(sum)+'</span>':'<span class="sp"></span>')+ibtn("ent-del",i,"✕","del")+'</div>';
  if(multi())h+=fld("Traveler",sel(p+".owner",e.owner||"shared",ownerOpts()),true);
  if(e.type==="flight"){
    h+='<div class="sub-h">Departure</div><div class="grid three">'+fld("From code",inp(p+".originCode",e.originCode,"DEN"))+fld("From city",inp(p+".originName",e.originName,"Denver"))+fld("Timezone",inp(p+".departZone",e.departZone,"MDT"))+'</div>';
    h+='<div class="grid three">'+fld("Depart date",dateF(p+".departDate",e.departDate))+fld("Depart time",timeF(p+".departTime",e.departTime))+fld("UTC offset",sel(p+".departOff",e.departOff,offsetOpts()))+'</div>';
    h+='<div class="sub-h">Arrival</div><div class="grid three">'+fld("To code",inp(p+".destCode",e.destCode,"LIS"))+fld("To city",inp(p+".destName",e.destName,"Lisbon"))+fld("Timezone",inp(p+".arriveZone",e.arriveZone,"WEST"))+'</div>';
    h+='<div class="grid three">'+fld("Arrive date",dateF(p+".arriveDate",e.arriveDate))+fld("Arrive time",timeF(p+".arriveTime",e.arriveTime))+fld("UTC offset",sel(p+".arriveOff",e.arriveOff,offsetOpts()))+'</div>';
    h+='<div class="grid">'+fld("Carrier",inp(p+".carrier",e.carrier,"United"))+fld("Flight numbers",inp(p+".flightNos",e.flightNos,"UA0918, UA1450",true))+'</div>';
    h+=connRows(e,i);
    /* Without both offsets the elapsed time is only a guess and the home-time
       line cannot be worked out at all — but both failures are silent, so say
       so on the card rather than letting the output quietly degrade. */
    if((e.departTime||e.arriveTime)&&(!e.departOff||!e.arriveOff))
      h+='<div class="hint warn">⚠ Set both UTC offsets. Without them the elapsed time is approximate (shown with ~) and the home-time line is left out entirely.</div>';
    h+='<div class="hint">Flight numbers: comma-separated, displayed with arrows. Set both UTC offsets for an exact elapsed time; the timezone is the label shown on the page, like MDT.</div>';
    h+=tail(e,i);
  } else if(e.type==="hotel"){
    h+=fld("Name",inp(p+".name",e.name,"Hotel name"),true)+'<div class="grid three">'+fld("Check-in",dateF(p+".checkIn",e.checkIn))+fld("Check-in time",timeF(p+".checkInTime",e.checkInTime))+fld("Check-out",dateF(p+".checkOut",e.checkOut))+'</div>';
    /* Directly under the field it explains. Every other hint on this card sits
       with its own controls, and a note about check-in read as a footnote to
       the cost when it trailed the whole card. */
    h+='<div class="hint">Check-in time decides where the hotel sits in the journey, and prints beside the name. Left blank it is assumed to be '+HOTEL_CHECKIN+', which will sit above a flight that lands later that afternoon.</div>';
    h+=fld("Area",inp(p+".area",e.area,"District"),true)+fld("Address / detail",area(p+".address",e.address,"Street, district…"),true)+tail(e,i);
  } else if(e.type==="car"){
    /* One offset for the rental, not one per end: the card sorts on its pick-up
       and the drop-off is a detail line under it, so a second offset would add
       a control that changes nothing anybody can see. */
    h+=fld("Company",inp(p+".company",e.company,"Hertz"),true)+
      '<div class="sub-h">Pick-up</div><div class="grid three">'+fld("Place",inp(p+".pickupPlace",e.pickupPlace,"Airport"))+fld("Date",dateF(p+".pickupDate",e.pickupDate))+fld("Time",timeF(p+".pickupTime",e.pickupTime))+'</div>'+
      '<div class="sub-h">Drop-off</div><div class="grid three">'+fld("Place",inp(p+".dropoffPlace",e.dropoffPlace,"Same"))+fld("Date",dateF(p+".dropoffDate",e.dropoffDate))+fld("Time",timeF(p+".dropoffTime",e.dropoffTime))+'</div>'+
      '<div class="grid">'+fld("UTC offset",sel(p+".off",e.off,offsetOpts()))+fld("Timezone",inp(p+".zone",e.zone,"MDT"))+'</div>'+tail(e,i);
  } else if(e.type==="ground"){
    h+='<div class="grid">'+fld("Mode",sel(p+".mode",e.mode,[["taxi","Taxi"],["rideshare","Rideshare"],["private","Private car"]]))+fld("Operator (opt.)",inp(p+".provider",e.provider,"Uber / Grab"))+'</div><div class="grid">'+fld("From",inp(p+".from",e.from,"Airport"))+fld("To",inp(p+".to",e.to,"Hotel"))+'</div>'+whenRow(p,e)+tail(e,i);
  } else if(e.type==="entertainment"){
    h+=fld("Name",inp(p+".name",e.name,"Show / event"),true)+fld("Venue",inp(p+".venue",e.venue,"Venue"),true)+whenRow(p,e)+tail(e,i);
  } else if(e.type==="meal"){
    h+=fld("Name",inp(p+".name",e.name,"Restaurant"),true)+fld("Venue / area",inp(p+".venue",e.venue,"District"),true)+whenRow(p,e)+tail(e,i);
  } else if(e.type==="transport"){
    h+='<div class="grid">'+fld("Mode",sel(p+".mode",e.mode,[["Train","Train"],["Ferry","Ferry"],["Bus","Bus"],["Coach","Coach"],["Shuttle","Shuttle"],["Other","Other"]]))+fld("Line / service",inp(p+".line",e.line,"IC 522 / Line 2",true))+'</div><div class="grid half">'+fld("Direction",inp(p+".direction",e.direction,"towards Cais do Sodré"))+'</div><div class="grid">'+fld("From",inp(p+".from",e.from,"Origin"))+fld("To",inp(p+".to",e.to,"Destination"))+'</div>'+whenRow(p,e)+connRows(e,i)+linkRows(e,i)+tail(e,i,true);
  } else if(e.type==="meeting"){
    h+=fld("Subject",inp(p+".name",e.name,"Meeting / task"),true)+fld("Location",inp(p+".location",e.location,"Office / video call"),true)+'<div class="grid three">'+fld("Date",dateF(p+".date",e.date))+fld("Start",timeF(p+".time",e.time))+fld("End",timeF(p+".endTime",e.endTime))+'</div><div class="grid">'+fld("UTC offset",sel(p+".off",e.off,offsetOpts()))+fld("Timezone",inp(p+".zone",e.zone,"MDT"))+'</div>'+fld("With",inp(p+".withWhom",e.withWhom,"People / team"),true)+tail(e,i);
  } else if(e.type==="tour"){
    h+=fld("Name",inp(p+".name",e.name,"Tour / excursion"),true)+fld("Meeting point",inp(p+".place",e.place,"Where to meet"),true)+'<div class="grid half">'+fld("Operator (opt.)",inp(p+".provider",e.provider,"Quinta Tours"))+'</div>'+whenRow(p,e)+tail(e,i);
  } else if(e.type==="note"){
    h+=fld("Title",inp(p+".title",e.title,"Reminder"),true)+fld("Body",area(p+".body",e.body,"Detail…"),true)+whenRow(p,e);
  } else {
    h+=fld("Name",inp(p+".name",e.name,"Activity / transfer"),true)+fld("Place",inp(p+".place",e.place,"Location"),true)+whenRow(p,e)+tail(e,i);
  }
  return h+'</div>';
}

function summaryHTML(){const ppl=people(),mm=ppl.length>1;let h='<div class="row"><span class="kk">Dates</span><span class="vv">'+(esc(dateRangeStr())||"—")+'</span></div>';ppl.forEach((p,idx)=>{const list=listFor(idx);const rl=routeLine(list),stats=statList(list);h+='<div class="row"><span class="kk">'+(mm?esc(p.name||("Traveler "+(idx+1))):"Route")+'</span><span class="vv">'+(esc(rl)||"—")+'</span></div>';h+='<div class="row"><span class="kk">Stats</span><span class="vv"><span class="chips">'+(stats.length?stats.map(x=>'<span class="chip">'+esc(x.v)+' '+esc(x.l)+'</span>').join(""):"—")+'</span></span></div>';});return h;}

function ratesEditor(){const base=state.baseCurrency||"USD";/* Only known currencies get a rate row: the code goes into a data-path, and
   trip data from a share link can put anything in e.currency. */
  /* A traveler's own currency needs a rate as much as a currency spent in:
     without it nothing can be converted into their column. */
  const wanted=ents().map(e=>e.currency||"USD").concat(people().map(personCur));
  const used=[...new Set(wanted)].filter(c=>c&&c!==base&&CURRENCIES.indexOf(c)>-1);if(!used.length)return '<div class="hint">Add items with costs in other currencies to set exchange rates here.</div>';let h="";used.forEach(cur=>{const v=(state.rates&&state.rates[cur]!=null)?state.rates[cur]:"";const auto=autoRate(cur);
    h+='<div class="grid rate"><span class="rlabel">1 '+esc(base)+' =</span><input class="f mono" data-path="rates.'+esc(cur)+'" aria-label="'+esc(cur+" per "+base)+'" value="'+esc(v)+'" placeholder="'+esc(auto?String(Number(auto.toPrecision(6))):"rate")+'"><span class="rsuf">'+esc(cur)+'</span></div>';});
  h+=FX
    ?'<div class="hint">Reference rates from '+esc(FX.date)+', refreshed weekly — shown greyed and used automatically. Type over one to pin your own.</div>'
    :'<div class="hint">Reference rates could not be loaded; enter rates by hand.</div>';
  return h;}

function renderForm(){
  const s=state;let h="";
  h+='<div class="sec"><h2>Header</h2><div class="sbody">';
  h+=fld("Eyebrow",inp("eyebrow",s.eyebrow,"Travel Itinerary"),true);
  h+='<div class="sub-h">Travelers</div>';
  people().forEach((p,i)=>{h+='<div class="card">'+'<div class="tt">'+inp("people."+i+".name",p.name,"Traveler name",false,"Traveler "+(i+1)+" name")+(people().length>1?ibtn("person-del",i,"✕","del"):"")+'</div>'+fld("Home timezone",selGroups("people."+i+".homeTz",p.homeTz||"",tzOptions()),true)+
      '<div class="grid half">'+fld("Their currency",sel("people."+i+".currency",personCur(p),CURRENCIES))+'</div>'+'</div>';});
  h+='<div class="addrow"><button class="add" data-act="person-add">+ Add traveler</button></div>';
  h+='<div class="hint">Zones that shift for daylight saving list both offsets, January first. The itinerary works out which one applies on each date.</div>';
  if(people().length>1)h+='<div class="hint">Each traveler gets its own page. Assign flights (and anything else that differs) to a traveler; leave shared items on “Both / all.”</div>';
  h+='<div class="sub-h">Titles</div>';
  (s.titles||[]).forEach((t,i)=>{h+='<div class="tt">'+inp("titles."+i,t,"City",false,"Destination title "+(i+1))+ibtn("title-up",i,"↑",null,i===0)+ibtn("title-down",i,"↓",null,i===s.titles.length-1)+ibtn("title-del",i,"✕","del",s.titles.length<=1)+'</div>';});
  h+='<div class="addrow"><button class="add" data-act="title-add">+ Title</button></div>';
  h+='<div class="grid" style="margin-top:11px">'+fld("Trip start",dateF("tripStart",s.tripStart))+fld("Trip end",dateF("tripEnd",s.tripEnd))+'</div>';
  h+='<div class="hint">Nights, the route line and the stats are worked out from the items you add. The date range above is not — it prints exactly as set here.</div></div></div>';

  h+='<div class="sec"><h2>Document & display</h2><div class="sbody">';
  h+=chk("showCosts",s.showCosts,"Show cost section");
  h+=chk("dayGrouped",s.dayGrouped,"Group journey into day headers");
  h+=chk("showSummaryPage",s.showSummaryPage,"Add an overview page (multi-traveler)");
  h+='<div class="grid half" style="margin-top:9px">'+fld("Paper size",sel("paper",state.paper||"letter",
    Object.keys(PAPERS).map(k=>[k,PAPERS[k].label])))+'</div>';
  h+='<div class="hint">The preview, print and PDF all follow this — a page in the preview is one sheet of whichever you pick.</div>';
  h+='<div class="sub-h">Money</div>';
  h+='<div class="grid half">'+fld("Base currency",sel("baseCurrency",s.baseCurrency||"USD",CURRENCIES))+'</div>';
  h+=chk("splitShared",s.splitShared,"Split shared costs across travelers");
  h+='<div class="sub-h">Exchange rates</div><div id="ratesBox">'+ratesEditor()+'</div>';
  h+='<div class="hint">Rates convert every currency into the base for a single trip total. Theme is in the top bar.</div></div></div>';

  h+='<div class="sec"><h2>Trip items <span class="ct">'+ents().length+'</span></h2><div class="sbody">';
  ents().forEach((e,i)=>{h+=entityCard(e,i);});
  h+='<div class="sub-h">Getting around</div><div class="addrow"><button class="add" data-act="add-flight">+ Flight</button><button class="add" data-act="add-transport">+ Transport</button><button class="add" data-act="add-car">+ Rental car</button><button class="add" data-act="add-ground">+ Taxi / rideshare</button></div>';
  h+='<div class="sub-h">Stay</div><div class="addrow"><button class="add" data-act="add-hotel">+ Hotel</button></div>';
  h+='<div class="sub-h">Things to do</div><div class="addrow"><button class="add" data-act="add-activity">+ Activity</button><button class="add" data-act="add-tour">+ Tour</button><button class="add" data-act="add-meal">+ Meal</button><button class="add" data-act="add-entertainment">+ Entertainment</button></div>';
  h+='<div class="sub-h">Work & notes</div><div class="addrow"><button class="add" data-act="add-meeting">+ Meeting / work</button><button class="add" data-act="add-note">+ Note</button></div>';
  h+='<div class="hint">The journey orders itself by date and time, and always begins with the first flight and ends with the last flight. Colors are automatic.<br><br>Set an item\u2019s UTC offset and it is placed against items in other zones by the real instant, exported to your calendar pinned to that instant, and given a home-time line; the timezone beside it is only the label printed on the page, like MDT. Leave both blank on a trip that never changes zone.</div></div></div>';

  h+='<div class="sec"><h2>Auto summary</h2><div class="sbody"><div class="derived">'+summaryHTML()+'</div></div></div>';

  h+='<div class="sec"><h2>Reference <span class="ct">'+(s.emergency||[]).length+'</span></h2><div class="sbody">';
  (s.emergency||[]).forEach((x,i)=>{h+='<div class="card"><div class="card-h"><span class="tag" style="background:var(--muted)">Ref '+(i+1)+'</span><span class="sp"></span>'+ibtn("ref-up",i,"↑",null,i===0)+ibtn("ref-down",i,"↓",null,i===s.emergency.length-1)+ibtn("ref-del",i,"✕","del")+'</div><div class="grid">'+fld("Label",inp("emergency."+i+".label",x.label,"Hotel / consulate"))+fld("Value",inp("emergency."+i+".value",x.value,"Phone / policy"))+'</div></div>';});
  h+='<div class="addrow"><button class="add" data-act="ref-add">+ Reference</button></div><div class="hint">Emergency numbers, consulate, insurance policy, next of kin.</div></div></div>';

  h+='<div class="sec"><h2>Checklist <span class="ct">'+(s.checklist||[]).length+'</span></h2><div class="sbody">';
  h+=fld("First section heading",inp("checklistHeading",s.checklistHeading,"Before departure"),true);
  (s.checklist||[]).forEach((it,i)=>{
    const isHead=typeof it.heading==="string";
    h+='<div class="card'+(isHead?" sechead":"")+'" draggable="true" data-drag="checklist" data-idx="'+i+'">'+
      '<div class="card-h"><span class="drag-h" aria-hidden="true">⠿</span><span class="tag" style="background:'+
      (isHead?"var(--ink2)":"var(--muted)")+'">'+(isHead?"Section":"Item")+'</span><span class="sp"></span>'+
      ibtn("chk-up",i,"↑",null,i===0)+ibtn("chk-down",i,"↓",null,i===s.checklist.length-1)+
      ibtn("chk-del",i,"✕","del")+'</div>';
    h+=isHead
      ? fld("Section heading",inp("checklist."+i+".heading",it.heading,"On arrival"),true)
      : fld("Bold lead (opt.)",inp("checklist."+i+".title",it.title,"Passport validity"),true)+
        fld("Body",area("checklist."+i+".body",it.body,"Detail…"),true);
    h+='</div>';
  });
  h+='<div class="addrow"><button class="add" data-act="chk-add">+ Item</button>'+
     '<button class="add" data-act="sec-add">+ Section heading</button></div>';
  /* The wording has to hold on a phone too, where dragging simply does not
     work: HTML5 drag-and-drop never fires from touch input. */
  h+='<div class="hint">Reorder with ↑ ↓, or by dragging a card with a mouse. Each item belongs to the nearest section heading above it; items above the first heading use the section heading at the top.</div></div></div>';

  h+='<div class="sec"><h2>Sharing & export</h2><div class="sbody">';
  h+='<div class="hint">Use “Copy link” in the toolbar for a self-contained link with the whole trip embedded in the URL.</div>';
  if(multi()){
    h+='<div class="sub-h">Export one traveler</div><div class="addrow">'+people().map((p,i)=>'<button class="add" data-act="export-person" data-i="'+i+'">PDF · '+esc(p.name||("Traveler "+(i+1)))+'</button>').join("")+'</div>';
    h+='<div class="sub-h">Calendar</div><div class="addrow">'+people().map((p,i)=>'<button class="add" data-act="ics-person" data-i="'+i+'">ICS · '+esc(p.name||("Traveler "+(i+1)))+'</button>').join("")+
      '<button class="add" data-act="ics-all">ICS · Everyone</button></div>';
    h+='<div class="hint">A traveler’s calendar carries their own items plus everything shared, matching their printed pages. Shared events keep the same identity in every file, so importing one traveler’s calendar alongside another’s updates them rather than making a second copy. “Everyone” is the same file the toolbar’s Calendar button produces.</div>';
  }
  h+='</div></div>';

  h+='<div class="sec"><h2>Footer</h2><div class="sbody"><div class="grid one">'+fld("Left",inp("footer.0",s.footer[0],"All times local"))+fld("Center",inp("footer.1",s.footer[1],"Zone note"))+fld("Right",inp("footer.2",s.footer[2],"Rev. 1"))+'</div></div></div>';

  form.innerHTML=h;
  const ts=document.getElementById("themeSel");if(ts)ts.value=state.theme||"classic";
}
/* renderForm() replaces the whole panel, so a newly added row has to be found
   again by path and focused explicitly. Prefer a text input over the type or
   owner selects that lead some cards — that is the box you actually type in. */
function focusNew(prefix){
  const hit=[...form.querySelectorAll("[data-path]")].filter(el=>{
    const p=el.getAttribute("data-path");
    return p===prefix||p.startsWith(prefix+".");
  });
  const inputs=hit.filter(x=>x.tagName==="INPUT"&&x.type!=="checkbox");
  /* Skip fields labelled "(opt.)" — on a transfer the first input is the
     optional provider, and the caret belongs in From instead. */
  const wanted=x=>{const f=x.closest(".field"),l=f&&f.querySelector(".lb");return !(l&&/\(opt\.\)/i.test(l.textContent));};
  const el=inputs.find(wanted)||inputs[0]||hit[0];
  if(!el)return;
  el.focus();
  (el.closest(".card")||el).scrollIntoView({block:"center"});
}
function updateSummary(){const d=form.querySelector(".derived");if(d)d.innerHTML=summaryHTML();}
function updateRates(){const b=document.getElementById("ratesBox");if(b)b.innerHTML=ratesEditor();}

/* ===== events ===== */
form.addEventListener("input",e=>{
  const t=e.target,path=t.getAttribute("data-path");if(!path)return;
  const prevVal=PREFILLABLE.test(path)?priorValue(path):undefined;
  setPath(state,path,t.type==="checkbox"?t.checked:t.value);
  // Which currencies need a rate depends on the base and on each item's
  // currency, so that editor has to be rebuilt when either changes.
  if(path==="baseCurrency"||path.endsWith(".currency"))updateRates();
  if(path==="paper")applyScale();
  maybePrefill(path,t.value,prevVal);
  updateSummary();schedulePreview();
});
/* Date pickers can commit a value without firing input, so listen for both. */
form.addEventListener("change",e=>{
  const t=e.target,path=t.getAttribute("data-path");
  if(path)maybePrefill(path,t.value,undefined);
});

/* ===== airport / airline prefill =====
   Vendored lookup tables (data/, rebuilt by scripts/build-data.mjs) — airports
   from OurAirports, airline names from OpenFlights — fetched once on first use,
   since they are only needed while editing a flight and the airport table is
   the larger part of the page's payload. A failed fetch,
   including opening index.html straight off disk, just leaves prefill inert. */
let REFP=null;
const AUTOFILLED=new WeakMap();
function refData(){
  if(!REFP)REFP=Promise.all([
    fetch("data/airports.json").then(r=>r.ok?r.json():{}).catch(()=>({})),
    fetch("data/airlines.json").then(r=>r.ok?r.json():{}).catch(()=>({}))
  ]).then(([ap,al])=>({ap,al}));
  return REFP;
}
/* Fills blanks only, never overwrites — including a value typed while the
   tables were still loading. Writes straight to the field rather than calling
   renderForm(), which would rebuild the panel and steal the caret. */
/* A flight often has no date yet when its airport code is typed, and refusing
   to derive anything then was reported as the offset "not populating no matter
   what airport code i use". Fall back to the trip start, then today. This is
   only safe because prefill can now replace what it wrote itself: the moment a
   real date is entered, the offset is recomputed from it. */
function usableDate(){
  for(const c of arguments){
    const v=String(c||"");
    if(/^\d{4}-\d{2}-\d{2}$/.test(v)){const y=+v.slice(0,4);if(y>=1900&&y<=2999)return v;}
  }
  const t=new Date();
  return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0");
}
/* Derives everything an airport code implies on a given date. off/zone are
   null when the date is missing or half-typed, which is not the same as "this
   airport has no offset" — the caller must not write anything in that case. */
function deriveAirport(ap,code,dateStr){
  if(!own(ap,code))return null;
  const [city,tz]=ap[code];
  const out={city,off:null,zone:null};
  /* Noon keeps the lookup clear of the DST switch itself, which lands in the
     small hours. dateStr has already been through usableDate(), so a
     half-typed year like "0002-09-18" never reaches this. */
  const d=new Date(dateStr+"T12:00:00Z");
  let p;try{p=tzParts(tz,d,{timeZoneName:"short"});}catch(err){return out;}
  const off=partsOffMin(p,d.getTime());
  out.off=String(off);
  const n=p.timeZoneName||"";
  out.zone=/^(GMT|UTC)/i.test(n)?shortZoneLabel(off):n;
  return out;
}
/* changedKey/prevVal describe the edit that triggered this, so a changed
   airport code can be told apart from any other reason to re-run. */
async function prefillFlight(i,changedKey,prevVal){
  const {ap,al}=await refData();
  const e=(state.entities||[])[i];
  if(!e||e.type!=="flight")return;
  let hit=false;
  const marks=AUTOFILLED.get(e)||new Set();
  AUTOFILLED.set(e,marks);
  /* Anything typed by hand is untouchable; a value prefill wrote itself may be
     replaced. Marks live in a WeakMap so they never reach a saved draft or a
     share link. v of "" clears a field, which only a marked field allows. */
  const set=(k,v)=>{
    if(v==null)return;
    const cur=String(e[k]==null?"":e[k]).trim();
    if(cur&&!marks.has(k))return;                 /* typed by the user */
    if(cur===String(v))return;                    /* already correct */
    e[k]=v;marks.add(k);hit=true;
    const el=form.querySelector('[data-path="entities.'+i+'.'+k+'"]');
    if(el&&el!==document.activeElement)el.value=v;
  };
  const side=(codeK,dateK,nameK,offK,zoneK)=>{
    const code=String(e[codeK]||"").trim().toUpperCase();
    /* When the code changes, whatever the OLD airport implied is stale — but a
       draft, the sample or a share link arrives with no marks at all, so those
       values look hand-typed and nothing would ever update. Recognise them by
       deriving the old code and comparing: a field that still matches what the
       previous airport implied was plainly derived, so let it be replaced. A
       genuinely hand-written city will not match, and survives. */
    if(changedKey===codeK&&prevVal){
      const was=deriveAirport(ap,String(prevVal).trim().toUpperCase(),usableDate(e[dateK],state.tripStart));
      if(was&&was.city!==undefined&&String(prevVal).trim().toUpperCase()!==code){
        if(String(e[nameK]||"")===was.city)marks.add(nameK);
        if(was.off!=null&&String(e[offK]||"")===was.off)marks.add(offK);
        if(was.zone!=null&&String(e[zoneK]||"")===was.zone)marks.add(zoneK);
      }
    }
    const now=deriveAirport(ap,code,usableDate(e[dateK],state.tripStart));
    if(!now)return;
    set(nameK,now.city);
    if(now.off==null)return;
    set(offK,now.off);
    /* Clearing matters: moving DEN -> LIS must drop "MDT", not leave a Denver
       label on a Lisbon leg, and Intl has no abbreviation for Lisbon. */
    set(zoneK,now.zone);
  };
  side("originCode","departDate","originName","departOff","departZone");
  side("destCode","arriveDate","destName","arriveOff","arriveZone");
  const pre=String(e.flightNos||"").trim().slice(0,2).toUpperCase();
  if(pre.length===2&&own(al,pre))set("carrier",al[pre]);
  if(hit){updateSummary();schedulePreview();}
}
const PREFILLABLE=/^entities\.(\d+)\.(originCode|destCode|departDate|arriveDate|flightNos)$/;
/* Fires on input, not on blur. An earlier build waited for the change event,
   so typing LIS and watching nothing happen until you tabbed away read as the
   feature being broken. A code is only meaningful at three characters, so that
   is the trigger. */
function maybePrefill(path,value,prevVal){
  const m=PREFILLABLE.exec(path||"");
  if(!m)return;
  const k=m[2],v=String(value==null?"":value).trim();
  if((k==="originCode"||k==="destCode")&&v.length!==3)return;
  if(k==="flightNos"&&v.length<2)return;
  prefillFlight(+m[1],k,prevVal);
}
/* What prefill needs is the code as it stood before the user began editing —
   not the value one keystroke ago. Clearing "DEN" and typing "LIS" makes the
   prior value "LI" by the time the third character lands, which resolves to no
   airport at all. Captured on focus instead. */
let editStart=null;
form.addEventListener("focusin",e=>{
  const path=e.target&&e.target.getAttribute&&e.target.getAttribute("data-path");
  if(path&&PREFILLABLE.test(path))editStart={path,value:getPath(state,path)};
});
function priorValue(path){
  return (editStart&&editStart.path===path)?editStart.value:getPath(state,path);
}
function getPath(root,path){
  let o=root;
  for(const k of String(path).split(".")){
    if(o==null)return undefined;
    o=o[/^\d+$/.test(k)?+k:k];
  }
  return o;
}

const SEEDS={
  transport:()=>({type:"transport",owner:"shared",mode:"Train",line:"",direction:"",from:"",to:"",date:"",time:"",connections:[],links:[],conf:"",cost:"",currency:"USD",note:""}),
  meeting:()=>({type:"meeting",owner:"shared",name:"",location:"",date:"",time:"",endTime:"",withWhom:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  tour:()=>({type:"tour",owner:"shared",name:"",place:"",date:"",time:"",provider:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  note:()=>({type:"note",owner:"shared",title:"",body:"",date:"",time:""}),
  flight:()=>({type:"flight",owner:"shared",carrier:"",flightNos:"",originCode:"",originName:"",departDate:"",departTime:"",departOff:"",departZone:"",destCode:"",destName:"",arriveDate:"",arriveTime:"",arriveOff:"",arriveZone:"",connections:[],link:"",conf:"",cost:"",currency:"USD",note:""}),
  hotel:()=>({type:"hotel",owner:"shared",name:"",area:"",address:"",checkIn:"",checkOut:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  car:()=>({type:"car",owner:"shared",company:"",pickupPlace:"",pickupDate:"",pickupTime:"",dropoffPlace:"",dropoffDate:"",dropoffTime:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  ground:()=>({type:"ground",owner:"shared",mode:"taxi",from:"",to:"",date:"",time:"",provider:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  entertainment:()=>({type:"entertainment",owner:"shared",name:"",venue:"",date:"",time:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  meal:()=>({type:"meal",owner:"shared",name:"",venue:"",date:"",time:"",link:"",conf:"",cost:"",currency:"USD",note:""}),
  activity:()=>({type:"activity",owner:"shared",name:"",place:"",date:"",time:"",link:"",conf:"",cost:"",currency:"USD",note:""})
};
/* Drag to reorder the checklist. Native HTML5 drag-and-drop, delegated on the
   form so it survives every renderForm(). Headings and items live in the same
   flat array, so a drop is one splice — which is exactly why the model is flat. */
let dragFrom=null;
const dragCard=t=>(t&&t.closest)?t.closest("[data-drag]"):null;
form.addEventListener("dragstart",e=>{
  const card=dragCard(e.target);
  if(!card)return;
  dragFrom=+card.getAttribute("data-idx");
  if(e.dataTransfer){e.dataTransfer.effectAllowed="move";
    try{e.dataTransfer.setData("text/plain",String(dragFrom));}catch(err){}}
  card.classList.add("dragging");
});
form.addEventListener("dragover",e=>{
  const card=dragCard(e.target);
  if(dragFrom==null||!card)return;
  e.preventDefault();                              /* required, or drop never fires */
  if(e.dataTransfer)e.dataTransfer.dropEffect="move";
  form.querySelectorAll(".dragover").forEach(x=>x.classList.remove("dragover"));
  if(+card.getAttribute("data-idx")!==dragFrom)card.classList.add("dragover");
});
form.addEventListener("drop",e=>{
  const card=dragCard(e.target);
  if(dragFrom==null||!card)return;
  e.preventDefault();
  const to=+card.getAttribute("data-idx"),from=dragFrom;
  dragFrom=null;
  if(!(to>=0)||to===from)return;
  const arr=state.checklist||[];
  if(from>=arr.length||to>=arr.length)return;
  markUndo("reorder checklist");
  arr.splice(to,0,arr.splice(from,1)[0]);
  renderForm();schedulePreview();
});
form.addEventListener("dragend",()=>{
  dragFrom=null;
  form.querySelectorAll(".dragging,.dragover").forEach(x=>{x.classList.remove("dragging");x.classList.remove("dragover");});
});

/* Firefox seeds an empty <input type="time"> from the current clock, so the
   first ArrowUp lands on whatever minute it happens to be — reported as
   "minutes on time fields start at 23 and not 00". Chrome starts at 00 instead.
   Seed it here so the two agree and neither depends on the time of day.

   Only on the first arrow after focusing an untouched empty field: any other
   key clears the latch, so typing a time normally is left completely alone and
   a half-entered value is never overwritten. */
let freshStep=null;
const seedFor=t=>{
  if(t.type==="time")return "00:00";
  /* A native date picker opens on the field's own value, so the only way to
     have it open on the trip's month is to put a date there first. Trip start,
     or trip end if that is all there is. */
  if(t.type==="date"){
    const d=String(state.tripStart||state.tripEnd||"");
    return /^\d{4}-\d{2}-\d{2}$/.test(d)?d:null;
  }
  return null;
};
const seedField=t=>{
  const v=seedFor(t);
  if(v==null)return false;                   /* no trip dates set: leave it alone */
  t.value=v;
  t.dispatchEvent(new Event("input",{bubbles:true}));   /* run the normal path */
  return true;
};
form.addEventListener("focusin",e=>{
  const t=e.target;
  freshStep=(t&&(t.type==="time"||t.type==="date")&&!t.value)?t:null;
});
form.addEventListener("keydown",e=>{
  const t=e.target;
  if(!t||t!==freshStep)return;
  if(e.key!=="ArrowUp"&&e.key!=="ArrowDown"){freshStep=null;return;}
  freshStep=null;
  if(seedField(t))e.preventDefault();        /* skip the browser's own default */
});
/* Clicking is what opens the picker, and it has to already hold a date by then
   — so seed on mousedown rather than on focus. Tabbing through still leaves an
   empty field empty. */
form.addEventListener("mousedown",e=>{
  const t=e.target;
  if(!t||t.type!=="date"||t.value)return;
  seedField(t);
});

form.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");if(!b)return;
  const act=b.getAttribute("data-act"),i=b.hasAttribute("data-i")?+b.getAttribute("data-i"):null,s=state;
  if(act==="export-person"){exportPDF(buildDocFor(i));return;}
  if(act==="ics-person"){const pp=people()[i];downloadICS(listFor(i),(pp&&pp.name)||("Traveler "+(i+1)));return;}
  if(act==="ics-all"){downloadICS(null,"");return;}
  if(act==="link-add"||act==="link-del"){
    const en=(s.entities||[])[i];
    if(!en)return;
    if(!Array.isArray(en.links))en.links=[];
    if(act==="link-add")en.links.push({label:"",url:""});
    else{markUndo("delete link");en.links.splice(+b.getAttribute("data-j"),1);}
    renderForm();
    if(act==="link-add")focusNew("entities."+i+".links."+(en.links.length-1));
    schedulePreview();
    return;
  }
  if(act==="conn-add"||act==="conn-del"){
    const en=(s.entities||[])[i];
    if(!en)return;
    en.connections=connList(en);            /* migrate the legacy string in place */
    if(act==="conn-add")en.connections.push({place:"",wait:""});
    else{markUndo("delete connection");en.connections.splice(+b.getAttribute("data-j"),1);}
    renderForm();
    if(act==="conn-add")focusNew("entities."+i+".connections."+(en.connections.length-1));
    schedulePreview();
    return;
  }
  let fx=null;                                   /* path prefix of the row just added */
  if(act==="person-add"){s.people.push({name:"",homeTz:""});fx="people."+(s.people.length-1);}
  else if(act==="person-del"){markUndo("delete traveler");s.people.splice(i,1);if(s.people.length<1)s.people=[{name:""}];s.entities.forEach(en=>{if(en.owner==null||en.owner==="shared")return;const o=+en.owner;if(isNaN(o))return;if(o===i)en.owner="shared";else if(o>i)en.owner=String(o-1);});if(s.people.length<2)s.entities.forEach(en=>{en.owner="shared";});}
  else if(act==="title-add"){s.titles.push("");fx="titles."+(s.titles.length-1);}
  else if(act==="title-del"){if(s.titles.length>1){markUndo("delete title");s.titles.splice(i,1);}}
  else if(act==="title-up")move(s.titles,i,-1);
  else if(act==="title-down")move(s.titles,i,1);
  else if(act.startsWith("add-")){const k=act.slice(4);if(own(SEEDS,k)){s.entities.push(SEEDS[k]());fx="entities."+(s.entities.length-1);}}
  else if(act==="ent-del"){markUndo("delete item");s.entities.splice(i,1);}
  else if(act==="ref-add"){(s.emergency=s.emergency||[]).push({label:"",value:""});fx="emergency."+(s.emergency.length-1);}
  else if(act==="ref-del"){markUndo("delete reference");s.emergency.splice(i,1);}
  else if(act==="ref-up")move(s.emergency,i,-1);
  else if(act==="ref-down")move(s.emergency,i,1);
  else if(act==="chk-add"){s.checklist.push({title:"",body:""});fx="checklist."+(s.checklist.length-1);}
  else if(act==="sec-add"){s.checklist.push({heading:""});fx="checklist."+(s.checklist.length-1);}
  else if(act==="chk-del"){markUndo("delete checklist item");s.checklist.splice(i,1);}
  else if(act==="chk-up")move(s.checklist,i,-1);
  else if(act==="chk-down")move(s.checklist,i,1);
  else return;
  renderForm();if(fx)focusNew(fx);schedulePreview();
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
/* Trip data arrives from share links and hand-edited JSON, so anything that
   gets iterated has to actually be an array of objects. A stray value here
   throws inside renderForm(), which init() calls outside its try/catch — the
   form never renders and the tab is dead until the URL is cleared. */
function normalize(st){
  /* Spread rather than Object.assign: assign writes through [[Set]], so an own
     "__proto__" key — which JSON.parse does produce — re-points this object's
     prototype at attacker data instead of landing as an ordinary field. Spread
     defines every key outright, so it cannot. */
  const o={...BLANK(),...st};
  const arr=(k,objects)=>{o[k]=Array.isArray(o[k])?(objects?o[k].filter(x=>x&&typeof x==="object"):o[k]):[];};
  arr("entities",true);arr("checklist",true);arr("emergency",true);arr("people",true);arr("titles",false);
  /* Connections used to be one string. Coerce here rather than at render time:
     setPath walks the live object, so an editor row bound to
     entities.0.connections.0.wait would otherwise index into the string and
     throw "Cannot create property 'wait' on string 'E'". */
  o.entities.forEach(en=>{
    /* Transport used to carry one link and an operator. The link is migrated
       into the list so it is not stranded; the operator is gone by request. */
    if(Array.isArray(en.links))en.links=en.links.filter(x=>x&&typeof x==="object");
    else if(en.type==="transport"&&String(en.link||"").trim())en.links=[{label:"",url:en.link}];
    else if("links" in en)en.links=[];
    if(Array.isArray(en.connections)){en.connections=en.connections.filter(c=>c&&typeof c==="object");return;}
    const t=String(en.connections==null?"":en.connections).trim();
    en.connections=t?[{place:t,wait:""}]:[];
  });
  if(!own(PAPERS,o.paper))o.paper="letter";
  if(!o.titles.length)o.titles=["Destination"];
  if(!o.people.length)o.people=[{name:""}];
  if(!Array.isArray(o.footer)||o.footer.length<3)o.footer=(Array.isArray(o.footer)?o.footer:[]).concat(["","",""]).slice(0,3);
  return o;
}

/* ===== toolbar ===== */
document.getElementById("btnSample").onclick=()=>{markUndo("load sample");state=SAMPLE();renderForm();refreshPreview();saveDraft();};
document.getElementById("btnBlank").onclick=()=>{if(confirm("Clear everything and start blank?")){markUndo("clear");state=BLANK();renderForm();refreshPreview();saveDraft();}};
document.getElementById("btnSave").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=slug((state.titles||[]).filter(Boolean).join("-"))+"-itinerary.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
document.getElementById("btnLink").onclick=async ()=>{const link=await shareLink();const done=()=>{const btn=document.getElementById("btnLink");const o=btn.textContent;btn.textContent="Copied ✓";setTimeout(()=>btn.textContent=o,1400);};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(link).then(done,()=>prompt("Copy this link:",link));}else prompt("Copy this link:",link);};
document.getElementById("fileLoad").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const next=normalize(JSON.parse(r.result));markUndo("load file");state=next;renderForm();refreshPreview();saveDraft();}catch(err){alert("Could not read that file: "+err.message);}};r.readAsText(f);e.target.value="";};
/* Back to top. The preview pane is the scroll container in every layout, so it
   is the thing to scroll — not the window, which never scrolls here. */
const previewPane=document.querySelector(".preview"),btnTop=document.getElementById("btnTop");
const reduceMotion=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function syncTopBtn(){
  if(btnTop&&previewPane)btnTop.classList.toggle("show",previewPane.scrollTop>300);
}
if(previewPane)previewPane.addEventListener("scroll",syncTopBtn,{passive:true});
if(btnTop)btnTop.onclick=()=>{
  previewPane.scrollTo({top:0,behavior:reduceMotion()?"auto":"smooth"});
  btnTop.classList.remove("show");
};
document.getElementById("btnUndo").onclick=doUndo;
/* Phone only (the button is hidden by CSS above 700px): reveal the pages at
   natural size, and re-measure since the wrap was display:none until now. */
document.getElementById("btnPv").onclick=function(){
  const open=document.body.classList.toggle("pv-open");
  this.textContent=open?"Hide pages":"View pages";
  this.setAttribute("aria-expanded",String(open));
  /* Both directions: the collapsed height is an inline style, so closing has to
     recompute it too. Opening only, and "Hide pages" did nothing at all. */
  applyScale();
};
/* Leaves reader mode: dropping the class restores the builder and the rest of
   the toolbar in one go. */
document.getElementById("btnEdit").onclick=function(){
  document.body.classList.remove("from-link");
  document.body.classList.add("pv-open");
  const t=document.getElementById("btnPv");
  if(t){t.textContent="Hide pages";t.setAttribute("aria-expanded","true");}
  applyScale();
};
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
  f.style.cssText="position:fixed;left:-10000px;top:0;width:"+Math.ceil(paperDef().pxW)+"px;height:1200px;border:0;background:#fff";
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
      var opts={scale:SCALE,backgroundColor:"#ffffff",useCORS:true,logging:false,windowWidth:Math.ceil(paperDef().pxW),width:Math.ceil(paperDef().pxW)};
      if(exact)opts.height=paperDef().pxH;
      var canvas=await window.html2canvas(pages[i],opts);
      var img=canvas.toDataURL("image/jpeg",0.92);
      var pg=paperDef();
      var hpt=exact?pg.hpt:Math.min(pg.hpt,(canvas.height/SCALE)*0.75);  // css px -> pt (72/96)
      if(!pdf)pdf=new jsPDF({unit:"pt",format:[pg.wpt,pg.hpt],orientation:"portrait"});
      else pdf.addPage([pg.wpt,pg.hpt]);
      pdf.addImage(img,"JPEG",0,0,pg.wpt,hpt);
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
function icsFileName(who){
  const base=slug((state.titles||[]).filter(Boolean).join("-"))+"-itinerary";
  return (who?base+"-"+slug(who):base)+".ics";
}
function downloadICS(only,who){
  const blob=new Blob([buildICS(only,who)],{type:"text/calendar;charset=utf-8"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=icsFileName(who);
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(a.href);},1000);
}
document.getElementById("btnIcs").onclick=function(){downloadICS(null,"");};
document.getElementById("btnPdf").onclick=function(){exportPDF();};
document.getElementById("btnPrint").onclick=function(){printDoc(buildDoc(state));};

/* ===== init: URL hash > local draft > sample ===== */
(async function init(){
  const zh=location.hash.match(/z=([^&]+)/), dh=location.hash.match(/data=([^&]+)/);
  let ok=false;
  if(zh){try{state=normalize(JSON.parse(await gunzipToStr(b64ToU8(unb64url(zh[1])))));ok=true;}catch(e){}}
  else if(dh){try{state=normalize(decodeState(decodeURIComponent(dh[1])));ok=true;}catch(e){}}
  else{try{const d=localStorage.getItem("itin-draft-v4");if(d)state=normalize(JSON.parse(d));}catch(e){}}
  /* Someone arriving on a share link is reading a trip, not writing one. The
     class only does anything under the phone media query, so a link opened on
     a desktop still gets the full builder. Only set when the link actually
     decoded — a corrupt one falls back to the sample, which is not a trip
     worth reading. */
  if(ok)document.body.classList.add("from-link","pv-open");
  renderForm();refreshPreview();paintUndo();
  /* Not awaited: a slow or missing file must not hold up first paint. */
  loadRates().then(fx=>{if(fx){updateRates();updateSummary();refreshPreview();}});
})();
