import React, { useEffect, useState } from "react";
import {
  AlertTriangle, ArrowUp, Ban, CalendarDays, Camera, Check, CheckCircle2,
  ChevronLeft, ChevronRight, ClipboardList, Home,
  Plus, Search, Trash2, Users, X
} from "lucide-react";
import defaultGroupPhoto from "./assets/04_Jungschar-2012.jpg";

const TODAY = "2026-10-15";
const STORAGE_KEYS = {
  people: "jungschar.people.v02",
  attendance: "jungschar.attendance.v02",
  schedule: "jungschar.schedule.v023",
  photo: "jungschar.photo.v02"
};

const readStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const peopleSeed = [
  [1,"Akulenko","Mike","X","Sa","I",""],[2,"Biegler","Calvin","","St","I",""],
  [3,"Blackshear","Amaya","X","St","",""],[4,"Brant","Melia","X","J","I",""],
  [5,"Domanski","Celine","","Sa","",""],[6,"Domanski","Kerstin","X","J","I",""],
  [7,"Fast","Tobias","X","St","I",""],[8,"Firus","Lajana","X","Sa","",""],
  [9,"Kalistratov","Jana","X","J","",""],[10,"Kalistratov","Liana","X","Sa","",""],
  [11,"Kindra","Ksenia","X","St","",""],[12,"Kliwer","Fynn","X","St","I",""],
  [13,"Kopp","Hannah","X","J","",""],[14,"Krom","Viktoria","X","J","I",""],
  [15,"Marchuk","Roman","","Sa","I",""],[16,"Marchuk","Vitaly","X","St","",""],
  [17,"Metzler","Alica","X","Sa","I",""],[18,"Negura","Jannik","X","J","I",""],
  [19,"Rudyk","Yevheniia","X","Sa","I",""],[20,"Schefer","Jamian","","J","",""],
  [21,"Scherer","Amelie","X","St","",""],[22,"Schill","Victoria","","Sa","",""],
  [23,"Schwarz","Lauryn","X","Sa","",""],[24,"Shyrai","Arsen","X","Sa","",""],
  [25,"Sippel","Daniel","","J","",""],[26,"Stiller","Ina","","Sa","I",""],
  [27,"Vlasiuk","Lisa","","St","",""],[28,"Vogel","Daniel","X","St","I",""],
  [29,"Wall","Nick","X","J","",""],[30,"Wedernikow","Sophia","X","J","",""]
].map(([id,last,first,hg,v,hj1,hj2]) => ({id,last,first,hg,v,hj1,hj2,duty:"",instrument:""}));

const scheduleSeed = [
  {
    "date": "2026-08-10",
    "content": "Jungschargebetsstunde",
    "responsible": ""
  },
  {
    "date": "2026-08-17",
    "content": "Speisesaal + Wiese",
    "responsible": ""
  },
  {
    "date": "2026-08-24",
    "content": "Thema: Gebt dem Teufel keinen Raum",
    "responsible": "Samuel"
  },
  {
    "date": "2026-08-29",
    "content": "Fahrradtour / Wiese",
    "responsible": ""
  },
  {
    "date": "2026-08-31",
    "content": "Thema: Bin ich ein Gefäß?",
    "responsible": "Julien"
  },
  {
    "date": "2026-09-07",
    "content": "Thema: Schmuck",
    "responsible": "Stephan"
  },
  {
    "date": "2026-09-14",
    "content": "Jungschargebetsstunde",
    "responsible": ""
  },
  {
    "date": "2026-09-21",
    "content": "- Ausfall -",
    "responsible": ""
  },
  {
    "date": "2026-09-27",
    "content": "Gemeinsame Jungscharstunde mit allen. Thema: Äthiopien",
    "responsible": "Justin Henkel"
  },
  {
    "date": "2026-10-05",
    "content": "Alten- und Krankenbesuch (Schwester Lena Schäfer)",
    "responsible": ""
  },
  {
    "date": "2026-10-12",
    "content": "Jungschargebetsstunde",
    "responsible": ""
  },
  {
    "date": "2026-10-19",
    "content": "Themenreihe: Auszug aus Ägypten. Abschnitt 1: Vorwort + Josef",
    "responsible": "Stephan"
  },
  {
    "date": "2026-10-26",
    "content": "Thema: Reformationstag - Halloween",
    "responsible": "Stephan"
  },
  {
    "date": "2026-11-02",
    "content": "Themenreihe: Auszug aus Ägypten. Abschnitt 2: Knechtschaft - 10. Plage",
    "responsible": "Julien"
  },
  {
    "date": "2026-11-09",
    "content": "Aktion / Megges / Ausflug?",
    "responsible": ""
  },
  {
    "date": "2026-11-16",
    "content": "Jungschargebetsstunde 2011 & 2012",
    "responsible": ""
  },
  {
    "date": "2026-11-23",
    "content": "Vorbereitung  / Einteilung Weihnachtsfeier - Eventuell kleines Thema (Bildervergleiche Gemeinde)",
    "responsible": "Stephan"
  },
  {
    "date": "2026-11-30",
    "content": "Themenreihe: Auszug aus Ägypten. Abschnitt 3: Durchquerung des Roten Meeres",
    "responsible": "Samuel"
  },
  {
    "date": "2026-12-07",
    "content": "Themenreihe: Auszug aus Ägypten. Abschnitt 4: Wüste 1/2",
    "responsible": "Julien"
  },
  {
    "date": "2026-12-14",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2026-12-21",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2026-12-28",
    "content": "- Ferien -",
    "responsible": ""
  },
  {
    "date": "2027-01-04",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-01-11",
    "content": "Themenreihe: Auszug aus Ägypten. Abschnitt 5: Wüste 2/2",
    "responsible": "Stephan"
  },
  {
    "date": "2027-01-18",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-01-25",
    "content": "Thema: Fasching - und die Feiertage des Herrn",
    "responsible": ""
  },
  {
    "date": "2027-02-01",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-02-08",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-02-15",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-02-22",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-03-01",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-03-08",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-03-15",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-03-22",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-03-29",
    "content": "- Passahmontag -",
    "responsible": ""
  },
  {
    "date": "2027-04-05",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-04-12",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-04-19",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-04-26",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-05-03",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-05-10",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-05-17",
    "content": "- Pfingstmontag -",
    "responsible": ""
  },
  {
    "date": "2027-05-24",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-05-31",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-06-07",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-06-14",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-06-21",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-06-28",
    "content": "- Sommerferien -",
    "responsible": ""
  },
  {
    "date": "2027-07-05",
    "content": "- Sommerferien -",
    "responsible": ""
  },
  {
    "date": "2027-07-12",
    "content": "- Sommerferien -",
    "responsible": ""
  },
  {
    "date": "2027-07-19",
    "content": "- Sommerferien -",
    "responsible": ""
  },
  {
    "date": "2027-07-26",
    "content": "- Sommerferien -",
    "responsible": ""
  },
  {
    "date": "2027-08-02",
    "content": "- Sommerferien -",
    "responsible": ""
  },
  {
    "date": "2027-08-09",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-08-16",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-08-23",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-08-30",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-09-06",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-09-13",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-09-20",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-09-27",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-10-04",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-10-11",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-10-18",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-10-25",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-11-01",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-11-08",
    "content": "Jungschargebetsstunde",
    "responsible": ""
  },
  {
    "date": "2027-11-15",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-11-22",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-11-29",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-12-06",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-12-13",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-12-20",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2027-12-27",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-01-03",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-01-10",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-01-17",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-01-24",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-01-31",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-02-07",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-02-14",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-02-21",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-02-28",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-03-06",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-03-13",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-03-20",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-03-27",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-04-03",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-04-10",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-04-17",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-04-24",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-05-01",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-05-08",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-05-15",
    "content": "",
    "responsible": ""
  },
  {
    "date": "2028-05-22",
    "content": "",
    "responsible": ""
  }
];

const attendanceSeed = {
  "2026-08-10":[1,6,7,8,9,10,12,14,16,17,18,20,26,27,28,29],
  "2026-08-17":[1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,23,27,28,29,30],
  "2026-08-24":[1,3,4,5,6,7,8,9,10,11,12,14,16,17,18,19,20,21,22,23,24,26,27,28,29,30],
  "2026-08-29":[1,2,4,5,6,7,9,10,11,12,16,17,18,19,20,22,23,27,28,29,30],
  "2026-08-31":[1,2,3,4,6,7,8,9,10,11,12,13,14,16,17,19,20,21,23,26,27,28,29],
  "2026-09-07":[21],
  "2026-09-14":[1,2,3,4,6,7,8,9,10,12,13,14,15,16,17,23,25,26,27,28],
  "2026-09-27":[1,2,3,4,7,8,9,10,12,13,14,16,18,22,24,26,28,29,30],
  "2026-10-05":[1,2,3,7,8,9,10,11,14,16,17,22,24,26,27,28,29,30],
  "2026-10-12":[1,3,6,7,8,9,10,11,13,14,16,17,20,23,25,26,27,28]
};

const blank = {first:"",last:"",hg:"",v:"",hj1:"",hj2:"",duty:"",instrument:"",joinDate:TODAY};
const fmt = date => new Intl.DateTimeFormat("de-DE",{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric",timeZone:"UTC"}).format(new Date(`${date}T12:00:00Z`));
const shortDate = date => `${date.slice(8,10)}.${date.slice(5,7)}.`;
const sortPeople = list => [...list].sort((a,b)=>a.last.localeCompare(b.last,"de")||a.first.localeCompare(b.first,"de"));
const eventsSeed=[...Object.keys(attendanceSeed),...scheduleSeed.map(item=>item.date)]
  .filter((value,index,array)=>array.indexOf(value)===index).sort()
  .map(date=>({date,cancelled:date==="2026-09-21"}));

function Flag({active,label,onClick,color="green"}){
  const activeStyle=color==="violet"?"border-violet-300 bg-violet-100 text-violet-900":"border-emerald-300 bg-emerald-100 text-emerald-900";
  return <button type="button" onClick={onClick} className={`rounded-2xl border p-3 text-left ${active?activeStyle:"border-slate-200 bg-slate-50 text-slate-500"}`}>
    <div className="flex items-center justify-between gap-2"><span className="text-xs font-black">{label}</span>{active&&<CheckCircle2 size={17}/>}</div>
  </button>;
}

function AddPerson({draft,setDraft,onSave,onClose}){
  return <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 backdrop-blur-sm sm:items-center sm:justify-center">
    <div className="max-h-[92vh] w-full overflow-auto rounded-t-[32px] bg-white p-5 sm:max-w-xl sm:rounded-[32px]">
      <div className="flex justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-blue-600">Teilnehmer</p><h2 className="text-2xl font-black">Teilnehmer hinzufügen</h2></div><button onClick={onClose} className="rounded-full bg-slate-100 p-2"><X/></button></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{[["Vorname","first"],["Nachname","last"],["Eintrittsdatum","joinDate"],["Verantwortlicher Leiter","v"],["Dienst","duty"],["Instrument","instrument"]].map(([label,key])=><label key={key} className={key==="instrument"?"sm:col-span-2":""}><span className="mb-1 block text-sm font-bold text-slate-600">{label}</span><input type={key==="joinDate"?"date":"text"} value={draft[key]} onChange={e=>setDraft({...draft,[key]:e.target.value})} className="w-full rounded-2xl border bg-slate-50 p-3"/></label>)}</div>
      <div className="mt-4 grid grid-cols-3 gap-2"><Flag active={!!draft.hg} label="Heiliger Geist" color="violet" onClick={()=>setDraft({...draft,hg:draft.hg?"":"X"})}/><Flag active={!!draft.hj1} label="Gespräch HJ1" onClick={()=>setDraft({...draft,hj1:draft.hj1?"":"X"})}/><Flag active={!!draft.hj2} label="Gespräch HJ2" onClick={()=>setDraft({...draft,hj2:draft.hj2?"":"X"})}/></div>
      <button disabled={!draft.first.trim()||!draft.last.trim()||!draft.joinDate} onClick={onSave} className="mt-5 w-full rounded-2xl bg-blue-600 py-3.5 font-black text-white disabled:opacity-40">Teilnehmer speichern</button>
    </div>
  </div>;
}

export default function App(){
  const [view,setView]=useState("home");
  const [people,setPeople]=useState(() => sortPeople(readStored(STORAGE_KEYS.people, peopleSeed)));
  const [attendance,setAttendance]=useState(() => readStored(STORAGE_KEYS.attendance, attendanceSeed));
  const [events]=useState(eventsSeed);
  const [schedule,setSchedule]=useState(() => readStored(STORAGE_KEYS.schedule, scheduleSeed));
  const [date,setDate]=useState("2026-10-12");
  const [query,setQuery]=useState("");
  const [showChecked,setShowChecked]=useState(true);
  const [adding,setAdding]=useState(false);
  const [draft,setDraft]=useState(blank);
  const [photo,setPhoto]=useState(() => readStored(STORAGE_KEYS.photo, ""));
  const [showScrollTop,setShowScrollTop]=useState(false);
  const [showVisits,setShowVisits]=useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.people, JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.schedule, JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.photo, JSON.stringify(photo));
    } catch {
      console.warn("Das Gruppenbild ist zu groß für den Browser-Speicher.");
    }
  }, [photo]);

  useEffect(() => {
    const onScroll=()=>setShowScrollTop(window.scrollY>420);
    onScroll();
    window.addEventListener("scroll",onScroll,{passive:true});
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);

  const selectedEvent=events.find(e=>e.date===date)||events[0];
  const eventIndex=events.findIndex(e=>e.date===date);
  const present=new Set(attendance[date]||[]);
  const nextEvent=events.find(e=>e.date>=TODAY&&!e.cancelled);
  const pastEvents=events.filter(e=>e.date<TODAY&&!e.cancelled&&attendance[e.date]);
  const lastFive=pastEvents.slice(-5).reverse();
  const lastThree=pastEvents.slice(-3);
  const missedThree=lastThree.length===3?people.filter(p=>{const wasAlreadyParticipant=lastThree.every(e=>!p.joinDate||e.date>=p.joinDate);return wasAlreadyParticipant&&lastThree.every(e=>!(attendance[e.date]||[]).includes(p.id));}):[];
  const filteredPeople=people.filter(p=>`${p.last} ${p.first}`.toLowerCase().includes(query.toLowerCase()));
  const attendancePeople=filteredPeople.filter(p=>showChecked||!present.has(p.id));
  const overviewEvents=events.filter(e=>e.date<=TODAY&&(attendance[e.date]||e.cancelled));
  const overviewPeople=sortPeople(people);
  const personStats = person => {
    const relevantEvents = pastEvents.filter(event => !person.joinDate || event.date >= person.joinDate);
    const attended = relevantEvents.filter(event => (attendance[event.date] || []).includes(person.id)).length;
    const absent = relevantEvents.length - attended;
    const percent = relevantEvents.length ? Math.round((attended / relevantEvents.length) * 100) : 0;
    const lastFive = relevantEvents.slice(-5).map(event => ({
      date: event.date,
      present: (attendance[event.date] || []).includes(person.id)
    }));
    return { attended, absent, percent, total: relevantEvents.length, lastFive };
  };

  const toggleAttendance=id=>setAttendance(old=>{const next=new Set(old[date]||[]);next.has(id)?next.delete(id):next.add(id);return {...old,[date]:[...next]};});
  const toggleFlag=(id,key)=>setPeople(old=>old.map(p=>p.id===id?{...p,[key]:p[key]?"":"X"}:p));
  const saveNew=()=>{setPeople(old=>sortPeople([...old,{...draft,id:Math.max(0,...old.map(p=>p.id))+1}]));setDraft(blank);setAdding(false);};
  const deletePerson=person=>{if(!window.confirm(`${person.first} ${person.last} wirklich löschen? Die Person wird auch aus allen Anwesenheitslisten entfernt.`))return;setPeople(old=>old.filter(p=>p.id!==person.id));setAttendance(old=>Object.fromEntries(Object.entries(old).map(([eventDate,ids])=>[eventDate,ids.filter(id=>id!==person.id)])));};
  const uploadPhoto=e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>setPhoto(String(reader.result));reader.readAsDataURL(file);};
  const resetPhoto=()=>{setPhoto("");};
  const scheduleFor = eventDate => schedule.find(item=>item.date===eventDate) || {date:eventDate,content:"",responsible:""};
  const updateSchedule = (eventDate,key,value) => setSchedule(old => {
    const exists=old.some(item=>item.date===eventDate);
    const next=exists
      ? old.map(item=>item.date===eventDate?{...item,[key]:value}:item)
      : [...old,{date:eventDate,content:"",responsible:"",[key]:value}];
    return [...next].sort((a,b)=>a.date.localeCompare(b.date));
  });
  const isVisitContent = content => /alten[- ]?\/?\s*und\s*krankenbesuch|alten-\s*und\s*krankenbesuch|altenbesuch|krankenbesuch/i.test(content);
  const extractVisited = content => {
    const bracketMatch=content.match(/\(([^)]+)\)/);
    if(bracketMatch?.[1]) return bracketMatch[1].trim();
    const colonIndex=content.indexOf(":");
    return colonIndex>=0?content.slice(colonIndex+1).trim():content.replace(/^.*?(besuch)\s*/i,"").trim();
  };
  const visitEvents=schedule.filter(item=>isVisitContent(item.content)).sort((a,b)=>a.date.localeCompare(b.date));
  const scrollToTop=()=>window.scrollTo({top:0,behavior:"smooth"});
  const scrollToNextEvent=()=>{
    const target=document.getElementById(`event-${nextEvent.date}`);
    target?.scrollIntoView({behavior:"smooth",block:"start"});
  };
  const nav=[["attendance","Anwesenheit",CheckCircle2],["people","Teilnehmer",Users],["home","Start",Home],["events","Termine",CalendarDays],["overview","Übersicht",ClipboardList]];

  return <div className="min-h-screen bg-[#f3f6fb] pb-28 text-slate-900">
    <main className="mx-auto max-w-5xl space-y-4 p-4">
      {view!=="home"&&<header><p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">Jungschar-App</p><h1 className="text-3xl font-black">Jungschar 2012</h1><p className="text-sm text-slate-500">Datenstand bis 15.10.2026</p></header>}

      {view==="home"&&<>
        <section className="relative h-[430px] overflow-hidden rounded-[34px] bg-slate-900 shadow-xl sm:h-[520px]">
          <img src={photo||defaultGroupPhoto} alt="Gruppenbild der Jungschar 2012" className="h-full w-full object-cover object-center"/>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-transparent to-slate-950/90"/>
          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-5 text-white">
            <div className="rounded-full bg-slate-950/55 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.22em] backdrop-blur-md">Jungschar-App</div>
            <label className="flex cursor-pointer items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-black text-slate-900 shadow-lg backdrop-blur-md">
              <Camera size={16}/>Bild ändern
              <input type="file" accept="image/*" onChange={uploadPhoto} className="hidden"/>
            </label>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
            <p className="text-xs font-black uppercase tracking-[.22em] text-blue-200">Jungschar 2012</p>
            <h1 className="mt-1 text-4xl font-black leading-none drop-shadow-lg sm:text-5xl">Jungschar 2012</h1>
            <p className="mt-2 text-sm font-bold text-white/90">2026 / 2027 · Datenstand 15.10.2026</p>
            <div className="mt-4 rounded-2xl border border-white/20 bg-slate-950/45 p-3 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-blue-200">Jungscharleiter</p>
              <p className="mt-1 text-sm font-bold leading-relaxed">Samuel Kliwer · Davis Kliwer · Stephan Domanski · Julien Vogel</p>
            </div>
            {photo&&<button type="button" onClick={resetPhoto} className="mt-3 text-xs font-bold text-white/80 underline underline-offset-4">Standardbild wiederherstellen</button>}
          </div>
        </section>
        <section className="rounded-[34px] bg-gradient-to-br from-blue-700 to-indigo-950 p-6 text-white shadow-xl"><p className="text-sm text-blue-200">Nächster Termin</p><h2 className="mt-1 text-3xl font-black">{fmt(nextEvent.date)}</h2><button onClick={()=>{setDate(nextEvent.date);setView("attendance")}} className="mt-5 rounded-2xl bg-white px-4 py-3 font-bold text-blue-700">Anwesenheit erfassen</button></section>
        <section className="grid grid-cols-3 gap-3"><div className="rounded-3xl bg-white p-4"><b className="text-2xl">{people.length}</b><p className="text-xs text-slate-500">Teilnehmer</p></div><div className="rounded-3xl bg-white p-4"><b className="text-2xl">{pastEvents.length}</b><p className="text-xs text-slate-500">erfasste Termine</p></div><div className="rounded-3xl bg-white p-4"><b className="text-2xl text-amber-600">{missedThree.length}</b><p className="text-xs text-slate-500">3× gefehlt</p></div></section>
        <section className="rounded-3xl bg-white p-5"><div className="flex items-center gap-2"><AlertTriangle className="text-amber-500"/><b>Letzte 3 erfasste Termine gefehlt</b></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{missedThree.map(p=><div className="rounded-2xl bg-amber-50 p-3" key={p.id}><div className="font-bold">{p.last}, {p.first}</div><div className="mt-1 text-xs text-amber-800">{p.v?<>Verantwortlicher Leiter: <b>{p.v}</b></>:<i>Kein verantwortlicher Leiter hinterlegt</i>}</div></div>)}</div></section>
      </>}

      {view==="attendance"&&<>
        <section className="rounded-3xl bg-white p-4"><div className="flex items-center justify-between"><button disabled={eventIndex<=0} onClick={()=>setDate(events[eventIndex-1].date)} className="rounded-full border p-3 disabled:opacity-20"><ChevronLeft/></button><div className="text-center"><p className="text-xs font-black uppercase tracking-widest text-blue-600">Anwesenheit</p><h2 className="font-black">{fmt(date)}</h2><p className={selectedEvent.cancelled?"text-red-600":"text-emerald-600"}>{selectedEvent.cancelled?"Ausfall":`${present.size} / ${people.length} anwesend`}</p></div><button disabled={eventIndex===events.length-1} onClick={()=>setDate(events[eventIndex+1].date)} className="rounded-full border p-3 disabled:opacity-20"><ChevronRight/></button></div><select value={date} onChange={e=>setDate(e.target.value)} className="mt-4 w-full rounded-2xl border bg-slate-50 p-3">{events.map(e=><option value={e.date} key={e.date}>{fmt(e.date)}{e.cancelled?" · Ausfall":""}</option>)}</select><button onClick={()=>setDate(nextEvent.date)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 py-3 font-bold text-blue-700"><CalendarDays size={18}/>Heute</button></section>
        <div className="flex gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Teilnehmer suchen" className="w-full rounded-2xl border bg-white py-2.5 pl-10"/></div><button onClick={()=>setShowChecked(v=>!v)} className="rounded-2xl border bg-white px-3 text-xs font-bold">{showChecked?"Abgehakte ausblenden":"Alle zeigen"}</button></div>
        {selectedEvent.cancelled?<div className="rounded-3xl bg-red-50 p-5 text-red-700"><Ban className="mb-2"/><b>Dieser Termin ist als Ausfall hinterlegt.</b></div>:<section className="overflow-hidden rounded-3xl bg-white">{attendancePeople.map(p=><button key={p.id} onClick={()=>toggleAttendance(p.id)} className="flex w-full items-center gap-3 border-b p-4 text-left"><span className={`grid h-11 w-11 place-items-center rounded-2xl border-2 ${present.has(p.id)?"border-emerald-600 bg-emerald-600 text-white":"border-slate-200 text-transparent"}`}><Check/></span><b className="flex-1">{p.last}, {p.first}</b></button>)}</section>}
      </>}

      {view==="people"&&<><div className="flex items-center justify-between gap-3"><div><h2 className="text-2xl font-black">Teilnehmer</h2><p className="text-sm text-slate-500">HG, HJ1 und HJ2 direkt ändern</p></div><button onClick={()=>{setDraft(blank);setAdding(true)}} className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-black text-white"><Plus size={18}/>Hinzufügen</button></div><div className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Teilnehmer suchen" className="w-full rounded-2xl border bg-white py-2.5 pl-10"/></div><section className="grid gap-3 sm:grid-cols-2">{filteredPeople.map(p=><article key={p.id} className="rounded-[28px] bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 font-black text-white">{p.first[0]}{p.last[0]}</div><div className="flex-1"><div className="flex items-center gap-2"><span className="grid h-6 min-w-6 place-items-center rounded-full bg-slate-100 px-1 text-[11px] font-black text-slate-600">{overviewPeople.findIndex(person=>person.id===p.id)+1}</span><b>{p.last}, {p.first}</b></div>{p.v&&<div className="mt-1 text-xs font-bold text-blue-700">LEITER · {p.v}</div>}</div><button type="button" onClick={()=>deletePerson(p)} title="Teilnehmer löschen" className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-red-600 hover:bg-red-100"><Trash2 size={18}/></button></div><div className="mt-4 grid grid-cols-3 gap-2"><Flag active={!!p.hg} label="Heiliger Geist" color="violet" onClick={()=>toggleFlag(p.id,"hg")}/><Flag active={!!p.hj1} label="Gespräch HJ1" onClick={()=>toggleFlag(p.id,"hj1")}/><Flag active={!!p.hj2} label="Gespräch HJ2" onClick={()=>toggleFlag(p.id,"hj2")}/></div>{(()=>{const stats=personStats(p);return <div className="mt-4 rounded-2xl bg-slate-50 p-3"><div className="flex items-center justify-between gap-3"><div><span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Letzte 5 Anwesenheiten</span><div className="mt-2 flex items-center gap-2">{stats.lastFive.length?stats.lastFive.map(item=><span key={item.date} title={`${fmt(item.date)} · ${item.present?"anwesend":"abwesend"}`} aria-label={`${fmt(item.date)}: ${item.present?"anwesend":"abwesend"}`} className={`h-4 w-4 rounded-full ring-2 ring-white ${item.present?"bg-emerald-500":"bg-red-500"}`}/>):<span className="text-xs text-slate-400">Noch keine Termine</span>}</div></div><div className="text-right"><span className="block text-2xl font-black text-blue-700">{stats.percent}%</span><span className="text-[10px] text-slate-500">{stats.attended} anwesend · {stats.absent} abwesend</span></div></div></div>})()}</article>)}</section></>}

      {view==="events"&&<><div className="flex items-start justify-between gap-3"><div><h2 className="text-2xl font-black">Termine</h2><p className="text-sm text-slate-500">Stundeninhalte 2026/27 und 2027/28 · Änderungen werden lokal gespeichert</p></div><div className="flex shrink-0 flex-col gap-2"><button type="button" onClick={scrollToNextEvent} className="rounded-2xl bg-blue-600 px-4 py-3 text-xs font-black text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95">Nächster Termin</button><button type="button" onClick={()=>setShowVisits(value=>!value)} className="rounded-2xl bg-teal-700 px-4 py-3 text-xs font-black text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-teal-800 active:scale-95">{showVisits?"Auswertung schließen":"Besuche auswerten"}</button></div></div>{showVisits&&<section className="rounded-3xl border border-teal-200 bg-teal-50 p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-teal-700">Auswertung</p><h3 className="text-xl font-black text-teal-950">Alten- und Krankenbesuche</h3></div><span className="rounded-full bg-teal-700 px-3 py-1 text-xs font-black text-white">{visitEvents.length} Termine</span></div><div className="mt-4 grid gap-3">{visitEvents.length?visitEvents.map(item=><article key={item.date} className="rounded-2xl bg-white p-4"><b className="text-teal-950">{fmt(item.date)}</b><p className="mt-1 text-sm font-bold text-teal-800">Besucht: {extractVisited(item.content)||"nicht angegeben"}</p>{item.responsible&&<p className="mt-1 text-xs text-slate-500">Verantwortlich: <b>{item.responsible}</b></p>}<p className="mt-2 text-xs text-slate-500">{item.content}</p></article>):<p className="text-sm text-teal-900">Keine Alten- oder Krankenbesuche eingetragen.</p>}</div></section>}<section className="grid gap-3">{events.filter(e=>e.date>="2026-08-10"&&e.date<="2028-05-22").map(e=>{const plan=scheduleFor(e.date);const normalizedContent=plan.content.trim().toLowerCase();const isTheme=normalizedContent.startsWith("thema:")||normalizedContent.startsWith("themenreihe:");const isVisit=isVisitContent(plan.content);const isCancellation=e.cancelled||/(ferien|ausfall|passahmontag|pfingstmontag)/i.test(plan.content);return <article id={`event-${e.date}`} key={e.date} className={`scroll-mt-4 rounded-3xl p-4 shadow-sm transition duration-300 ${e.date===nextEvent.date?"border-2 border-blue-500 bg-blue-50/50":isVisit?"border-2 border-teal-400 bg-teal-50/60":"bg-white"}`}><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><b>{fmt(e.date)}</b>{e.date===nextEvent.date&&<span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">Nächster Termin</span>}</div><p className={`mt-1 text-xs font-bold ${isCancellation?"italic text-red-600":attendance[e.date]?"text-emerald-700":"text-slate-500"}`}>{attendance[e.date]?`${attendance[e.date].length} anwesend`:isCancellation?"Ausfall / Ferien":"noch nicht erfasst"}</p></div><button type="button" onClick={()=>{setDate(e.date);setView("attendance")}} className="flex shrink-0 items-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition duration-300 hover:bg-blue-100 active:scale-95">Anwesenheit<ChevronRight size={15}/></button></div><label className={`mt-4 block rounded-2xl p-3 transition duration-300 ${isVisit?"border border-teal-300 bg-teal-50 shadow-sm":isTheme?"border border-amber-300 bg-amber-50 shadow-sm":""}`}><span className={`mb-1 block text-[10px] font-black uppercase tracking-wider ${isVisit?"text-teal-700":isTheme?"text-amber-700":"text-slate-500"}`}>{isVisit?"Alten- und Krankenbesuch":isTheme?"Thema / Themenreihe":"Inhalt"}</span><textarea rows="2" value={plan.content} onChange={event=>updateSchedule(e.date,"content",event.target.value)} placeholder="Inhalt eintragen" className={`w-full resize-none rounded-xl border p-3 text-sm outline-none focus:border-blue-400 ${isCancellation?"italic":""} ${isVisit?"border-teal-200 bg-white font-bold text-teal-950":isTheme?"border-amber-200 bg-white font-bold text-amber-950":"border-slate-200 bg-slate-50 focus:bg-white"}`}/></label><label className="mt-3 block"><span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Verantwortlich</span><input value={plan.responsible} onChange={event=>updateSchedule(e.date,"responsible",event.target.value)} placeholder="Verantwortliche Person eintragen" className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400 focus:bg-white"/></label></article>})}</section></>}

      {view==="overview"&&<><div><h2 className="text-2xl font-black">Gesamtübersicht</h2><p className="text-sm text-slate-500">Alle erfassten Anwesenheiten · horizontal wischen</p></div><section className="overflow-hidden rounded-3xl bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-max border-collapse text-xs"><thead><tr className="bg-slate-900 text-white"><th className="sticky left-0 z-20 w-10 border-r border-slate-700 bg-slate-900 px-2 py-3">Nr.</th><th className="sticky left-10 z-20 min-w-40 border-r border-slate-700 bg-slate-900 px-3 py-3 text-left">Name</th>{overviewEvents.map(e=><th key={e.date} className={`min-w-16 border-r border-slate-700 px-2 py-2 ${e.cancelled?"bg-red-800":""}`}><span className="block">{shortDate(e.date)}</span><span className="text-[10px] font-normal opacity-70">{e.cancelled?"Ausfall":fmt(e.date).slice(0,2)}</span></th>)}</tr></thead><tbody>{overviewPeople.map((p,index)=><tr key={p.id} className={index%2?"bg-slate-50":"bg-white"}><td className={`sticky left-0 z-10 border-b border-r px-2 py-2 text-center font-bold ${index%2?"bg-slate-50":"bg-white"}`}>{index+1}</td><td className={`sticky left-10 z-10 border-b border-r px-3 py-2 font-semibold ${index%2?"bg-slate-50":"bg-white"}`}>{p.last}, {p.first}</td>{overviewEvents.map(e=>{const checked=(attendance[e.date]||[]).includes(p.id);return <td key={e.date} className={`border-b border-r px-2 py-2 text-center ${e.cancelled?"bg-red-50":""}`}>{e.cancelled?"–":checked?<span className="inline-grid h-6 w-6 place-items-center rounded-md bg-emerald-600 font-black text-white">X</span>:<span className="text-slate-300">·</span>}</td>})}</tr>)}</tbody><tfoot><tr className="bg-blue-50 font-black"><td className="sticky left-0 bg-blue-50"></td><td className="sticky left-10 border-r bg-blue-50 px-3 py-3">Anwesend</td>{overviewEvents.map(e=><td key={e.date} className="border-r px-2 py-3 text-center">{e.cancelled?"–":(attendance[e.date]||[]).length}</td>)}</tr></tfoot></table></div></section><div className="rounded-2xl bg-blue-50 p-3 text-xs text-blue-800"><b>Screenshot-Tipp:</b> Handy quer halten und zum gewünschten Zeitraum wischen.</div></>}
    </main>

    <button type="button" aria-label="Nach oben scrollen" onClick={scrollToTop} className={`fixed bottom-24 right-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-white shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-blue-700 active:scale-90 ${showScrollTop?"translate-y-0 opacity-100":"pointer-events-none translate-y-5 opacity-0"}`}><ArrowUp size={22}/></button>

    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl"><div className="mx-auto grid max-w-5xl grid-cols-5 items-end px-2">{nav.map(([id,label,Icon])=>{const isHome=id==="home",active=view===id;return <button key={id} onClick={()=>{setView(id);setQuery("")}} className={`relative flex flex-col items-center gap-1 text-[10px] ${isHome?"-mt-5 pb-3":"py-3"} ${active?"font-black text-blue-700":"text-slate-500"}`}>{isHome?<span className={`grid h-14 w-14 place-items-center rounded-full border-4 border-white shadow-lg ${active?"bg-blue-600":"bg-slate-900"} text-white`}><Icon size={25}/></span>:<Icon size={20}/>}<span className={isHome?"font-black":""}>{label}</span></button>})}</div></nav>
    {adding&&<AddPerson draft={draft} setDraft={setDraft} onSave={saveNew} onClose={()=>setAdding(false)}/>} 
  </div>;
}
