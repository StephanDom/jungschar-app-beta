import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AlertTriangle, ArrowUp, Ban, BookOpen, CalendarDays, Camera, Cake, Check, CheckCircle2,
  ChevronLeft, ChevronRight, ClipboardList, Download, Home,
  Mail, Pencil, Plus, Search, ShieldCheck, Trash2, Undo2, Upload, Users, X
} from "lucide-react";
import defaultGroupPhoto from "./assets/04_Jungschar-2012.jpg";

const TODAY = "2026-10-15";
const APP_VERSION = "2.0.0-dev";
const APP_BUILD_DATE = "23.10.2026";
const STORAGE_KEYS = {
  people: "jungschar.people.v02",
  attendance: "jungschar.attendance.v02",
  confirmedAttendance: "jungschar.confirmedAttendance.v02",
  schedule: "jungschar.schedule.v023",
  preachers: "jungschar.preachers.v01",
  preacherRoster: "jungschar.preacherRoster.v01",
  photo: "jungschar.photo.v02",
  leaderBirthdays: "jungschar.leaderBirthdays.v01",
  nextEventNotes: "jungschar.nextEventNotes.v01",
  nextEventNoteDone: "jungschar.nextEventNoteDone.v01",
  homeNoteOpen: "jungschar.homeNoteOpen.v01",
  eventNotesOpen: "jungschar.eventNotesOpen.v01",
  dataUpdatedAt: "jungschar.dataUpdatedAt.v01"
};

const readStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const formatBirthdayInput = value => {
  const digits=String(value||"").replace(/\D/g,"").slice(0,4);
  return digits.length>2?`${digits.slice(0,2)}.${digits.slice(2)}`:digits;
};

const personDetailsSeed = {
  "1": {
    "v": "Sa",
    "duty": "",
    "instrument": "Klav., Git., Pos., Akk."
  },
  "2": {
    "v": "St",
    "duty": "Stühle",
    "instrument": "Gitarre"
  },
  "3": {
    "v": "St",
    "duty": "Kaffe&Kuchen",
    "instrument": "Klavier, Cello"
  },
  "4": {
    "v": "J",
    "duty": "Salate",
    "instrument": "Klavier"
  },
  "5": {
    "v": "Sa",
    "duty": "",
    "instrument": "Klavier"
  },
  "6": {
    "v": "J",
    "duty": "Geburtstagskarten",
    "instrument": "Harfe, Mandoline"
  },
  "7": {
    "v": "St",
    "duty": "Liederbücher",
    "instrument": "Trompete"
  },
  "8": {
    "v": "Sa",
    "duty": "Kaffe&Kuchen",
    "instrument": "Klavier, Querflöte"
  },
  "9": {
    "v": "J",
    "duty": "Geburtstagskarten",
    "instrument": "Mandoline"
  },
  "10": {
    "v": "Sa",
    "duty": "Anwesenheitsliste",
    "instrument": "Mandoline, Klavier"
  },
  "11": {
    "v": "St",
    "duty": "",
    "instrument": ""
  },
  "12": {
    "v": "St",
    "duty": "",
    "instrument": "Klavier, Akkordeon"
  },
  "13": {
    "v": "J",
    "duty": "Gebetsliste",
    "instrument": "Klavier"
  },
  "14": {
    "v": "J",
    "duty": "",
    "instrument": "Akkordeon"
  },
  "15": {
    "v": "Sa",
    "duty": "",
    "instrument": ""
  },
  "16": {
    "v": "St",
    "duty": "Stühle",
    "instrument": "Klavier"
  },
  "17": {
    "v": "Sa",
    "duty": "Programm",
    "instrument": "Querflöte, Klavier"
  },
  "18": {
    "v": "J",
    "duty": "Liederbücher",
    "instrument": "Klavier, Geige"
  },
  "19": {
    "v": "Sa",
    "duty": "",
    "instrument": ""
  },
  "20": {
    "v": "J",
    "duty": "",
    "instrument": ""
  },
  "21": {
    "v": "St",
    "duty": "",
    "instrument": ""
  },
  "22": {
    "v": "Sa",
    "duty": "",
    "instrument": ""
  },
  "23": {
    "v": "Sa",
    "duty": "",
    "instrument": "Klavier"
  },
  "24": {
    "v": "Sa",
    "duty": "",
    "instrument": "Geige"
  },
  "25": {
    "v": "J",
    "duty": "",
    "instrument": ""
  },
  "26": {
    "v": "Sa",
    "duty": "Salate, Fragebox",
    "instrument": "Klavier"
  },
  "27": {
    "v": "St",
    "duty": "",
    "instrument": ""
  },
  "28": {
    "v": "St",
    "duty": "",
    "instrument": "Klav., Tromp., Git."
  },
  "29": {
    "v": "J",
    "duty": "Stühle",
    "instrument": ""
  },
  "30": {
    "v": "J",
    "duty": "Anwesenh., Fragebox",
    "instrument": "Geige, Klavier"
  }
};

const birthdayByName = {
  "Negura Janick":"09.01","Shyrai Arsen":"15.02","Schefer Jamian":"15.02","Domanski Kerstin":"06.03",
  "Stiller Ina":"07.03","Kalistratov Jana":"13.03","Kalistratov Liana":"13.03","Wedernikow Sophia":"13.03",
  "Krom Viktoria":"22.03","Brant Melia":"23.03","Marchuk Vitali":"16.04","Akulenko Mike":"27.04",
  "Metzler Alica":"04.05","Vogel Daniel":"04.05","Domanski Celine":"09.06","Kuhai Alica":"19.07",
  "Firus Lajana":"22.07","Fast Tobias":"19.08","Biegler Calvin":"25.08","Blackshear Amaya":"04.09",
  "Sippel Daniel":"09.09","Scherer Amelie":"16.09","Rudyk Yevheniia":"20.09","Kopp Hannah":"19.10",
  "Schwarz Lauryn":"24.10","Kliwer Fynn":"26.11","Wall Nick":"29.11","Marchuk Roman":"02.12"
};
const leaderBirthdaySeed = {"Stephan Domanski":"01.03","Julien Vogel":"26.03","Samuel Kliwer":"30.08","Davis Kliwer":"21.11"};

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
].map(([id,last,first,hg,v,hj1,hj2]) => {
  const key=`${last} ${first}`;
  const aliases={"Negura Jannik":"Negura Janick","Marchuk Vitaly":"Marchuk Vitali"};
  return {id,last,first,hg,v:personDetailsSeed[id]?.v||v,hj1,hj2,duty:personDetailsSeed[id]?.duty||"",instrument:personDetailsSeed[id]?.instrument||"",birthday:birthdayByName[aliases[key]||key]||""};
});

const scheduleSeed = [
  {"date":"2024-09-16","content":"Organisatorisches","responsible":""},
  {"date":"2024-09-23","content":"Thema: Gebet","responsible":"Alle"},
  {"date":"2024-09-30","content":"Thema: Gebet","responsible":"Alle"},
  {"date":"2024-10-07","content":"Thema: Schöpfung Tag 1-4","responsible":"Stephan"},
  {"date":"2024-10-21","content":"Programmaufteilung + Probe","responsible":""},
  {"date":"2024-10-28","content":"Programmvorbereitung","responsible":""},
  {"date":"2024-11-04","content":"Thema: Schöpfung Tag 5-7, Programmvorbereitung","responsible":"Stephan"},
  {"date":"2024-11-11","content":"Jungschargebetsstunde","responsible":""},
  {"date":"2024-11-18","content":"Programmvorbereitung","responsible":""},
  {"date":"2025-01-20","content":"Thema: Vergebung","responsible":""},
  {"date":"2025-01-27","content":"Dankgottesdienst + Probe f. Altenbesuch","responsible":""},
  {"date":"2025-02-01","content":"Alten- und Krankenbesuch: Koschmann und Fedja Kotschetkow","responsible":""},
  {"date":"2025-02-03","content":"Gebetsstunde","responsible":""},
  {"date":"2025-02-10","content":"Jungschargebetsstunde","responsible":""},
  {"date":"2025-02-17","content":"Thema: Jesus Christus","responsible":"Stephan"},
  {"date":"2025-02-24","content":"Thema: Von den Verheißungen","responsible":"Samuel"},
  {"date":"2025-03-03","content":"Thema: Glaube","responsible":"Julien"},
  {"date":"2025-03-10","content":"Jungschargebetsstunde","responsible":""},
  {"date":"2025-03-17","content":"Krankenbesuch: Diana Wedernikow","responsible":""},
  {"date":"2025-03-24","content":"Gemeinschaft auf Parkplatz","responsible":""},
  {"date":"2025-03-31","content":"Thema: Bibel","responsible":"Stephan"},
  {"date":"2025-04-07","content":"Thema: Mobbing","responsible":""},
  {"date":"2025-04-28","content":"Programmvorbereitung","responsible":""},
  {"date":"2025-05-05","content":"Programmvorbereitung","responsible":""},
  {"date":"2025-05-19","content":"Vortrag Indien","responsible":""},
  {"date":"2025-05-26","content":"Thema: Der verlorene Sohn","responsible":"Stephan"},
  {"date":"2025-08-25","content":"Allgemeines, Kaffe&Kuchen, Offene Runde","responsible":""},
  {"date":"2025-09-01","content":"Thema: Vertrauen","responsible":"Julien"},
  {"date":"2025-09-08","content":"Alten- und Krankenbesuch (Firus Lydia und Anton Müller)","responsible":""},
  {"date":"2025-09-15","content":"Jungschargebetsstunde","responsible":""},
  {"date":"2025-09-22","content":"Thema: Allgemeine Glaubensgrundsätze 1","responsible":"Stephan"},
  {"date":"2025-09-29","content":"Thema: Christenverfolgung","responsible":"Justin Henkel"},
  {"date":"2025-10-06","content":"Thema: Allgemeine Glaubensgrundsätze 2","responsible":"Stephan"},
  {"date":"2025-10-13","content":"Jungschargebetsstunde","responsible":""},
  {"date":"2025-10-20","content":"Gruppengebetsstunde (+ kurzes Thema: Liebe 1. Kor. 13)","responsible":"Samuel"},
  {"date":"2025-10-27","content":"Thema: Sündenbekenntnis","responsible":"Alex Gornus"},
  {"date":"2025-11-03","content":"Thema: Sei wie die Ameise","responsible":"Julien"},
  {"date":"2025-11-10","content":"Jungschargebetsstunde","responsible":""},
  {"date":"2025-11-17","content":"Alten- und Krankenbesuch (Brant und Schneider)","responsible":""},
  {"date":"2025-11-24","content":"Thema: Heiliger Geist","responsible":"Paul Domanski"},
  {"date":"2025-12-01","content":"Besprechung Weihnachtsfeier","responsible":""},
  {"date":"2025-12-08","content":"Vorbereitung für Weihnachtsfeier","responsible":""},
  {"date":"2025-12-15","content":"Jungschargebetsstunde","responsible":""},
  {"date":"2025-12-22","content":"- Ferien -","responsible":""},
  {"date":"2025-12-29","content":"- Ferien -","responsible":""},
  {"date":"2026-01-05","content":"Gebetswoche","responsible":""},
  {"date":"2026-01-12","content":"Jungschargebetsstunde","responsible":""},
  {"date":"2026-01-19","content":"Thema: Frucht des Geistes","responsible":"Stephan"},
  {"date":"2026-01-26","content":"Thema: Mobbing","responsible":"Matze Isaak"},
  {"date":"2026-02-02","content":"Zeugnisse + Test zu Thema \"Mobbing\" Thema: Der breite und der schmale Weg","responsible":"Julien"},
  {"date":"2026-02-09","content":"Jungschargebetsstunde","responsible":""},
  {"date":"2026-02-16","content":"Ausflug Megges","responsible":""},
  {"date":"2026-02-23","content":"Thema: Medien","responsible":"Stephan"},
  {"date":"2026-03-02","content":"Vorbereitung für Besuch im Altersheim Homburg + Thema: Die Zunge","responsible":"Samuel"},
  {"date":"2026-03-09","content":"Jungschargebetsstunde","responsible":""},
  {"date":"2026-03-16","content":"Einteilung für Vortrag am 12.04.26 + Thema: Schätze, was du hast","responsible":"Julien"},
  {"date":"2026-03-23","content":"Probe für Vortrag am 12.04.26","responsible":""},
  {"date":"2026-03-30","content":"Wiese","responsible":""},
  {"date":"2026-04-06","content":"- Passahmontag -","responsible":""},
  {"date":"2026-04-12","content":"Vortrag im Gottesdienst","responsible":""},
  {"date":"2026-04-13","content":"Jungschargebetsstunde","responsible":""},
  {"date":"2026-04-20","content":"Thema: Und die anderen Religionen","responsible":"Stephan"},
  {"date":"2026-04-27","content":"Thema: Endzeit","responsible":"Paul Domanski"},
  {"date":"2026-05-01","content":"Fahrradtour / Wiese","responsible":""},
  {"date":"2026-05-04","content":"Alten-/Krankenbesuch (Valentina Wiens)","responsible":""},
  {"date":"2026-05-11","content":"Jungschargebetsstunde","responsible":""},
  {"date":"2026-05-18","content":"Thema: Jona / Missionsbefehl","responsible":"Julien"},
  {"date":"2026-05-25","content":"- Pfingstmontag -","responsible":""},
  {"date":"2026-06-01","content":"Thema: Haus auf Sand oder Felsen bauen","responsible":"Samuel"},
  {"date":"2026-06-08","content":"Thema: Bekehrung","responsible":"Keven Akulenko"},
  {"date":"2026-06-15","content":"Jungschargebetsstunde","responsible":""},
  {"date":"2026-06-22","content":"Jahresabschluss, Kaffee&Kuchen, Interne Fragen, Besprechung Ausflüge","responsible":""},
  {"date":"2026-06-26","content":"Ausflug","responsible":""},
  {"date":"2026-06-29","content":"- Sommerferien -","responsible":""},
  {"date":"2026-07-06","content":"- Sommerferien -","responsible":""},
  {"date":"2026-07-13","content":"- Sommerferien -","responsible":""},
  {"date":"2026-07-20","content":"- Sommerferien -","responsible":""},
  {"date":"2026-07-27","content":"- Sommerferien -","responsible":""},
  {"date":"2026-08-03","content":"- Sommerferien -","responsible":""},
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

const preacherRosterSeed = ["Akulenko Mike","Biegler Calvin","Fast Tobias","Kliwer Fynn","Marchuk Roman","Marchuk Vitali","Negura Janick","Schefer Jamian","Shyrai Arsen","Vogel Daniel","Wall Nick"];
const preacherSeed = {"2026-08-31":{askedName:"Marchuk Vitali",preached:true},"2026-09-07":{askedName:"Marchuk Roman",preached:true},"2026-10-05":{askedName:"Fast Tobias",preached:true},"2026-10-19":{askedName:"Vogel Daniel",preached:true}};

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

const blank = {first:"",last:"",birthday:"",hg:"",v:"",hj1:"",hj2:"",duty:"",instrument:"",joinDate:TODAY};
const fmt = date => new Intl.DateTimeFormat("de-DE",{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric",timeZone:"UTC"}).format(new Date(`${date}T12:00:00Z`));
const shortDate = date => `${date.slice(8,10)}.${date.slice(5,7)}.`;
const sortPeople = list => [...list].sort((a,b)=>a.last.localeCompare(b.last,"de")||a.first.localeCompare(b.first,"de"));
const autoGrow = element => { if(!element) return; element.style.height="0px"; element.style.height=`${element.scrollHeight}px`; };
const schoolYearFor = date => { const year=Number(date.slice(0,4)),month=Number(date.slice(5,7)); const start=month>=8?year:year-1; return `${String(start).slice(-2)}/${String(start+1).slice(-2)}`; };
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
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{[["Vorname","first"],["Nachname","last"],["Geburtstag (TT.MM.)","birthday"],["Eintrittsdatum","joinDate"],["Verantwortlicher Leiter","v"],["Dienst","duty"],["Instrument","instrument"]].map(([label,key])=><label key={key} className={key==="instrument"?"sm:col-span-2":""}><span className="mb-1 block text-sm font-bold text-slate-600">{label}</span><input type={key==="joinDate"?"date":"text"} value={draft[key]} onChange={e=>setDraft({...draft,[key]:key==="birthday"?formatBirthdayInput(e.target.value):e.target.value})} inputMode={key==="birthday"?"numeric":undefined} maxLength={key==="birthday"?5:undefined} className="w-full rounded-2xl border bg-slate-50 p-3"/></label>)}</div>
      <div className="mt-4 grid grid-cols-3 gap-2"><Flag active={!!draft.hg} label="Heiliger Geist" color="violet" onClick={()=>setDraft({...draft,hg:draft.hg?"":"X"})}/><Flag active={!!draft.hj1} label="Gespräch HJ1" onClick={()=>setDraft({...draft,hj1:draft.hj1?"":"X"})}/><Flag active={!!draft.hj2} label="Gespräch HJ2" onClick={()=>setDraft({...draft,hj2:draft.hj2?"":"X"})}/></div>
      <button disabled={!draft.first.trim()||!draft.last.trim()||!draft.joinDate} onClick={onSave} className="mt-5 w-full rounded-2xl bg-blue-600 py-3.5 font-black text-white disabled:opacity-40">Teilnehmer speichern</button>
    </div>
  </div>;
}

function AddEvent({draft,setDraft,onSave,onClose}){
  return <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 backdrop-blur-sm sm:items-center sm:justify-center">
    <div className="max-h-[92vh] w-full overflow-auto rounded-t-[32px] bg-white p-5 sm:max-w-xl sm:rounded-[32px]">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-xs font-black uppercase tracking-widest text-blue-600">Termine</p><h2 className="text-2xl font-black">Termin hinzufügen</h2></div>
        <button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2"><X/></button>
      </div>
      <div className="mt-5 grid gap-4">
        <label><span className="mb-1 block text-sm font-bold text-slate-600">Datum</span><input type="date" value={draft.date} onChange={e=>setDraft({...draft,date:e.target.value})} className="w-full rounded-2xl border bg-slate-50 p-3"/></label>
        <label><span className="mb-1 block text-sm font-bold text-slate-600">Inhalt</span><textarea rows="1" ref={autoGrow} value={draft.content} onInput={e=>autoGrow(e.currentTarget)} onChange={e=>{setDraft({...draft,content:e.target.value});autoGrow(e.currentTarget)}} placeholder="Stundeninhalt eintragen" className="w-full resize-none rounded-2xl border bg-slate-50 p-3"/></label>
        <label><span className="mb-1 block text-sm font-bold text-slate-600">Verantwortlich</span><input value={draft.responsible} onChange={e=>setDraft({...draft,responsible:e.target.value})} placeholder="Verantwortliche Person" className="w-full rounded-2xl border bg-slate-50 p-3"/></label>
      </div>
      <button type="button" disabled={!draft.date} onClick={onSave} className="mt-5 w-full rounded-2xl bg-blue-600 py-3.5 font-black text-white disabled:opacity-40">Termin speichern</button>
    </div>
  </div>;
}

export default function App(){
  const currentDate=new Date().toLocaleDateString("en-CA");
  const [view,setView]=useState("home");
  const scrollPositions=useRef({home:0,attendance:0,people:0,events:0,overview:0,preachers:0});
  const pendingScroll=useRef(0);
  const swipeStartX=useRef(null);
    const attendanceInitialized=useRef(false);
  const [swipeOffsets,setSwipeOffsets]=useState({});
  const pendingPastAttendance=useRef(null);
  const [people,setPeople]=useState(() => {
    const stored=readStored(STORAGE_KEYS.people, null);
    if(!stored) return sortPeople(peopleSeed);
    return sortPeople(stored.map(person=>{
      const seed=peopleSeed.find(item=>item.id===person.id);
      if(!seed) return person;
      return {...seed,...person,v:person.v||seed.v||"",duty:person.duty||seed.duty||"",instrument:person.instrument||seed.instrument||"",birthday:person.birthday||seed.birthday||""};
    }));
  });
  const [attendance,setAttendance]=useState(() => readStored(STORAGE_KEYS.attendance, attendanceSeed));
  const [confirmedAttendance,setConfirmedAttendance]=useState(() => readStored(STORAGE_KEYS.confirmedAttendance,Object.keys(readStored(STORAGE_KEYS.attendance,attendanceSeed))));
  const [attendanceDraft,setAttendanceDraft]=useState([]);
  const [attendanceSavedNotice,setAttendanceSavedNotice]=useState(false);
  const [schedule,setSchedule]=useState(() => {const stored=readStored(STORAGE_KEYS.schedule, []);const merged=new Map(scheduleSeed.map(item=>[item.date,item]));stored.forEach(item=>merged.set(item.date,item));return [...merged.values()].sort((a,b)=>a.date.localeCompare(b.date));});
  const [preachers,setPreachers]=useState(() => readStored(STORAGE_KEYS.preachers, preacherSeed));
  const [preacherRoster,setPreacherRoster]=useState(() => readStored(STORAGE_KEYS.preacherRoster, preacherRosterSeed));
  const [newPreacherName,setNewPreacherName]=useState("");
  const events=[...new Set([...Object.keys(attendance),...schedule.map(item=>item.date)])]
    .sort()
    .map(eventDate=>({
      date:eventDate,
      cancelled:/(ferien|ausfall|passahmontag|pfingstmontag)/i.test(schedule.find(item=>item.date===eventDate)?.content||"")
    }));
  const [date,setDate]=useState("2026-10-12");
  const [query,setQuery]=useState("");
  const [peopleFilter,setPeopleFilter]=useState("all");
  const [leaderFilter,setLeaderFilter]=useState("");
  const [showHJOverview,setShowHJOverview]=useState(false);
  const [showChecked,setShowChecked]=useState(true);
  const [adding,setAdding]=useState(false);
  const [draft,setDraft]=useState(blank);
  const [addingEvent,setAddingEvent]=useState(false);
  const [eventDraft,setEventDraft]=useState({date:"",content:"",responsible:""});
  const [photo,setPhoto]=useState(() => readStored(STORAGE_KEYS.photo, ""));
  const [leaderBirthdays,setLeaderBirthdays]=useState(() => readStored(STORAGE_KEYS.leaderBirthdays, leaderBirthdaySeed));
  const [nextEventNotes,setNextEventNotes]=useState(() => readStored(STORAGE_KEYS.nextEventNotes, {}));
  const [nextEventNoteDone,setNextEventNoteDone]=useState(() => readStored(STORAGE_KEYS.nextEventNoteDone, {}));
  const [homeNoteOpen,setHomeNoteOpen]=useState(() => readStored(STORAGE_KEYS.homeNoteOpen, false));
  const [eventNotesOpen,setEventNotesOpen]=useState(() => readStored(STORAGE_KEYS.eventNotesOpen, {}));
  const [showBirthdayList,setShowBirthdayList]=useState(false);
    const [showPreacherOverview,setShowPreacherOverview]=useState(false);
    const [showPreacherManagement,setShowPreacherManagement]=useState(false);
  const [showScrollTop,setShowScrollTop]=useState(false);
  const [showVisits,setShowVisits]=useState(false);
  const [archiveSchoolYear,setArchiveSchoolYear]=useState("all");
  const [archiveAction,setArchiveAction]=useState("visits");
  const currentSchoolYear=schoolYearFor(currentDate);
  const [openEventSchoolYear,setOpenEventSchoolYear]=useState(currentSchoolYear);
  const [showPastAttendanceConfirm,setShowPastAttendanceConfirm]=useState(false);
    const [showLowAttendance,setShowLowAttendance]=useState(false);
  const [editingPersonId,setEditingPersonId]=useState(null);
  const [reportScope,setReportScope]=useState("window");
  const [dataUpdatedAt,setDataUpdatedAt]=useState(() => readStored(STORAGE_KEYS.dataUpdatedAt, null));
  const [syncStatus]=useState("local");
  const dataStandText=dataUpdatedAt?new Date(dataUpdatedAt).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}):"Noch kein gespeicherter Datenstand";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.people, JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(attendance));
  }, [attendance]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.confirmedAttendance,JSON.stringify(confirmedAttendance)); },[confirmedAttendance]);
  useEffect(() => { setAttendanceDraft([...(attendance[date]||[])]); setAttendanceSavedNotice(false); },[date]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.schedule, JSON.stringify(schedule));
  }, [schedule]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.preachers, JSON.stringify(preachers)); }, [preachers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.preacherRoster, JSON.stringify(preacherRoster)); }, [preacherRoster]);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.leaderBirthdays, JSON.stringify(leaderBirthdays)); }, [leaderBirthdays]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.nextEventNotes, JSON.stringify(nextEventNotes)); }, [nextEventNotes]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.nextEventNoteDone, JSON.stringify(nextEventNoteDone)); }, [nextEventNoteDone]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.homeNoteOpen, JSON.stringify(homeNoteOpen)); }, [homeNoteOpen]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.eventNotesOpen, JSON.stringify(eventNotesOpen)); }, [eventNotesOpen]);
  useEffect(() => {
    if(!dataUpdatedAt) return;
    localStorage.setItem(STORAGE_KEYS.dataUpdatedAt,JSON.stringify(dataUpdatedAt));
  },[dataUpdatedAt]);
  const markDataChanged=()=>setDataUpdatedAt(new Date().toISOString());
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.photo, JSON.stringify(photo));
    } catch {
      console.warn("Das Gruppenbild ist zu groß für den Browser-Speicher.");
    }
  }, [photo]);

  useEffect(() => {
    const resetAfterRefresh=()=>{
      setView("home");
      pendingScroll.current=0;
      scrollPositions.current={home:0,attendance:0,people:0,events:0,overview:0,preachers:0};
      attendanceInitialized.current=false;
      window.scrollTo({top:0,left:0,behavior:"auto"});
      const viewport=document.querySelector('meta[name="viewport"]');
      if(viewport) viewport.setAttribute("content","width=device-width, initial-scale=1, viewport-fit=cover");
    };
    resetAfterRefresh();
    window.addEventListener("pageshow",resetAfterRefresh);
    return ()=>window.removeEventListener("pageshow",resetAfterRefresh);
  },[]);
  useEffect(() => {
    const onScroll=()=>setShowScrollTop(window.scrollY>420);
    onScroll();
    window.addEventListener("scroll",onScroll,{passive:true});
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);

  useLayoutEffect(() => {
    window.scrollTo({top:pendingScroll.current,behavior:"auto"});
  },[view]);

  const navigateTo = (target,{resetAll=false,resetTarget=false}={}) => {
    scrollPositions.current[view]=window.scrollY;
    if(resetAll) scrollPositions.current={home:0,attendance:0,people:0,events:0,overview:0,preachers:0};
    if(resetTarget) scrollPositions.current[target]=0;
    pendingScroll.current=scrollPositions.current[target]||0;
    setQuery("");
    if(target===view){window.scrollTo({top:pendingScroll.current,behavior:"auto"});return;}
    setView(target);
  };

  const selectedEvent=events.find(e=>e.date===date)||events[0];
  const eventIndex=events.findIndex(e=>e.date===date);
  const present=new Set(attendanceDraft);
  const savedAttendanceIds=attendance[date]||[];
  const attendanceChanged=[...attendanceDraft].sort((a,b)=>a-b).join(",")!==[...savedAttendanceIds].sort((a,b)=>a-b).join(",");
  const attendanceIsConfirmed=confirmedAttendance.includes(date)&&!attendanceChanged;
  const todayEvent=events.find(event=>event.date===currentDate&&!event.cancelled);
  const nextEvent=todayEvent&&!confirmedAttendance.includes(currentDate)
    ?todayEvent
    :events.find(event=>event.date>currentDate&&!event.cancelled)
      ||events.filter(event=>!event.cancelled).at(-1);
  const pastEvents=events.filter(e=>e.date<=currentDate&&!e.cancelled&&confirmedAttendance.includes(e.date));
  const currentSchoolYearPastEvents=pastEvents.filter(event=>schoolYearFor(event.date)===currentSchoolYear);
  const previousConfirmedEvent=pastEvents.at(-1);
  const lastFive=currentSchoolYearPastEvents.slice(-5).reverse();
  const lastThree=currentSchoolYearPastEvents.slice(-3);
  const personStatsFor = person => {
    const relevantEvents=currentSchoolYearPastEvents.filter(event=>!person.joinDate||event.date>=person.joinDate);
    const attended=relevantEvents.filter(event=>(attendance[event.date]||[]).includes(person.id)).length;
    const absent=relevantEvents.length-attended;
    const percent=relevantEvents.length?Math.round((attended/relevantEvents.length)*100):0;
    const recent=relevantEvents.slice(-5).map(event=>({date:event.date,present:(attendance[event.date]||[]).includes(person.id)}));
    return {attended,absent,percent,total:relevantEvents.length,lastFive:recent};
  };
  const missedThree=lastThree.length===3?people.filter(p=>{const wasAlreadyParticipant=lastThree.every(e=>!p.joinDate||e.date>=p.joinDate);return wasAlreadyParticipant&&lastThree.every(e=>!(attendance[e.date]||[]).includes(p.id));}):[];
  const lowAttendancePeople=people.map(person=>({person,stats:personStatsFor(person)})).filter(item=>item.stats.total>0&&item.stats.percent<=50).sort((a,b)=>a.stats.percent-b.stats.percent||a.person.last.localeCompare(b.person.last,"de"));
  const leaderAliases={sa:"Samuel",st:"Stephan",j:"Julien",d:"Davis"};
  const normalizedLeaderFilter=leaderFilter.trim().toLowerCase();
  const leaderMatches=p=>{if(!normalizedLeaderFilter)return true;const v=String(p.v||"").toLowerCase();return v.includes(normalizedLeaderFilter)||String(leaderAliases[v]||"").toLowerCase().includes(normalizedLeaderFilter)};
  const isPianoPlayer=p=>/klav(?:ier|\.)?/i.test(p.instrument||"");
  const filteredPeople=people.filter(p=>`${p.last} ${p.first}`.toLowerCase().includes(query.toLowerCase())).filter(leaderMatches).filter(p=>peopleFilter==="piano"?isPianoPlayer(p):peopleFilter==="hj1open"?!p.hj1:peopleFilter==="hj2open"?!p.hj2:true);
  const hjOverviewPeople=people.filter(leaderMatches).filter(p=>!p.hj1||!p.hj2);
  const attendancePeople=filteredPeople.filter(p=>showChecked||!present.has(p.id));
  const overviewStartDate=events.find(e=>schoolYearFor(e.date)===currentSchoolYear&&!e.cancelled&&e.date>=`${currentDate.slice(0,4)}-08-01`)?.date||`${currentDate.slice(0,4)}-08-01`;
    const overviewEvents=events.filter(e=>e.date>=overviewStartDate&&e.date<=currentDate&&schoolYearFor(e.date)===currentSchoolYear&&(e.cancelled||confirmedAttendance.includes(e.date)));
  const overviewPeople=sortPeople(people);
  const nextSchedule=schedule.find(item=>item.date===nextEvent.date)||{content:"",responsible:""};
  const eventDayMonth=eventDate=>`${eventDate.slice(8,10)}.${eventDate.slice(5,7)}`;
  const allBirthdays=[...people.filter(p=>p.birthday).map(p=>({name:`${p.first} ${p.last}`,birthday:p.birthday,type:"Teilnehmer"})),...Object.entries(leaderBirthdays).filter(([,birthday])=>birthday).map(([name,birthday])=>({name,birthday,type:"Leiter"}))].sort((a,b)=>{const [ad,am]=a.birthday.split(".").map(Number),[bd,bm]=b.birthday.split(".").map(Number);return (am||99)-(bm||99)||(ad||99)-(bd||99)||a.name.localeCompare(b.name,"de")});
  const birthdayDateForYear=(birthday,year)=>{const [day,month]=birthday.split(".").map(Number);return `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;};
  const upcomingBirthdays=allBirthdays.map(item=>{const year=Number(currentDate.slice(0,4));const thisYear=birthdayDateForYear(item.birthday,year);const nextDate=thisYear>=currentDate?thisYear:birthdayDateForYear(item.birthday,year+1);return {...item,nextDate};}).sort((a,b)=>a.nextDate.localeCompare(b.nextDate)||a.name.localeCompare(b.name,"de"));
  const nextBirthdayDate=upcomingBirthdays[0]?.nextDate;
  const nextBirthdayPeople=upcomingBirthdays.filter(item=>item.nextDate===nextBirthdayDate);
  const birthdayFallsOnNextEvent=nextBirthdayDate===nextEvent.date;
    const preacherEvents=[...events].filter(event=>!event.cancelled);
    const futurePreacherEvents=preacherEvents.filter(event=>event.date>=nextEvent.date);
    const previousPreacherEvent=preacherEvents.filter(event=>event.date<nextEvent.date).at(-1);
    const preacherDisplayEvents=[...(previousPreacherEvent?[previousPreacherEvent]:[]),...futurePreacherEvents];
    const preacherHistory=Object.entries(preachers).filter(([,assignment])=>assignment?.askedName&&assignment.askedName!=="Allgemeine Gebetstunde").map(([date,assignment])=>({date,name:assignment.askedName})).sort((a,b)=>a.date.localeCompare(b.date));
      const preacherOverviewDates=[...new Set(preacherHistory.map(item=>item.date))].sort((a,b)=>a.localeCompare(b));
      const preacherOverviewNames=[...new Set([...preacherRoster,...preacherHistory.map(item=>item.name)])].sort((a,b)=>a.localeCompare(b,"de"));
    const preacherName=eventDate=>preachers[eventDate]?.askedName||"Noch nicht festgelegt";
  const personStats = person => personStatsFor(person);

  const applyAttendanceToggle=(eventDate,id)=>{
    if(eventDate!==date) return;
    setAttendanceDraft(old=>{const next=new Set(old);next.has(id)?next.delete(id):next.add(id);return [...next];});
    setAttendanceSavedNotice(false);
  };
  const confirmAttendance=()=>{
    if(date>currentDate){
      window.alert(`Die Anwesenheit für ${fmt(date)} kann erst am ${new Intl.DateTimeFormat("de-DE",{day:"2-digit",month:"2-digit",year:"numeric",timeZone:"UTC"}).format(new Date(`${date}T12:00:00Z`))} quittiert werden.`);
      return;
    }
    const nextAttendance={...attendance,[date]:[...attendanceDraft]};
    const nextConfirmed=confirmedAttendance.includes(date)?confirmedAttendance:[...confirmedAttendance,date].sort();
    setAttendance(nextAttendance);
    setConfirmedAttendance(nextConfirmed);
    localStorage.setItem(STORAGE_KEYS.attendance,JSON.stringify(nextAttendance));
    localStorage.setItem(STORAGE_KEYS.confirmedAttendance,JSON.stringify(nextConfirmed));
    markDataChanged();
    setAttendanceSavedNotice(true);
    window.setTimeout(()=>setAttendanceSavedNotice(false),2500);
  };
  const toggleAttendance=id=>{
    if(date<TODAY&&!sessionStorage.getItem("jungschar.pastAttendanceUnlocked")){
      pendingPastAttendance.current={date,id};
      setShowPastAttendanceConfirm(true);
      return;
    }
    applyAttendanceToggle(date,id);
  };
  const confirmPastAttendanceEdit=()=>{
    sessionStorage.setItem("jungschar.pastAttendanceUnlocked","true");
    const pending=pendingPastAttendance.current;
    pendingPastAttendance.current=null;
    setShowPastAttendanceConfirm(false);
    if(pending) applyAttendanceToggle(pending.date,pending.id);
  };
  const cancelPastAttendanceEdit=()=>{
    pendingPastAttendance.current=null;
    setShowPastAttendanceConfirm(false);
  };
  const toggleFlag=(id,key)=>{markDataChanged();setPeople(old=>old.map(p=>p.id===id?{...p,[key]:p[key]?"":"X"}:p));};
  const updatePerson=(id,key,value)=>{markDataChanged();setPeople(old=>old.map(p=>p.id===id?{...p,[key]:value}:p));};
  const saveNew=()=>{markDataChanged();setPeople(old=>sortPeople([...old,{...draft,id:Math.max(0,...old.map(p=>p.id))+1}]));setDraft(blank);setAdding(false);};
  const deletePerson=person=>{if(!window.confirm(`${person.first} ${person.last} wirklich löschen? Die Person wird auch aus allen Anwesenheitslisten entfernt.`))return;setPeople(old=>old.filter(p=>p.id!==person.id));setAttendance(old=>Object.fromEntries(Object.entries(old).map(([eventDate,ids])=>[eventDate,ids.filter(id=>id!==person.id)])));};
  const uploadPhoto=e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>setPhoto(String(reader.result));reader.readAsDataURL(file);};
  const resetPhoto=()=>{setPhoto("");};
  const scheduleFor = eventDate => schedule.find(item=>item.date===eventDate) || {date:eventDate,content:"",responsible:""};
  const updateSchedule = (eventDate,key,value) => {markDataChanged();setSchedule(old => {
    const exists=old.some(item=>item.date===eventDate);
    const next=exists
      ? old.map(item=>item.date===eventDate?{...item,[key]:value}:item)
      : [...old,{date:eventDate,content:"",responsible:"",[key]:value}];
    return [...next].sort((a,b)=>a.date.localeCompare(b.date));
  });};
  const saveNewEvent = () => {
    markDataChanged();
    const eventDate=eventDraft.date;
    if(!eventDate) return;
    if(events.some(event=>event.date===eventDate)){
      window.alert("Für dieses Datum ist bereits ein Termin vorhanden.");
      return;
    }
    setSchedule(old=>[...old,{...eventDraft}].sort((a,b)=>a.date.localeCompare(b.date)));
    setDate(eventDate);
    setOpenEventSchoolYear(schoolYearFor(eventDate));
    setEventDraft({date:"",content:"",responsible:""});
    setAddingEvent(false);
  };
  const deleteEvent = eventDate => {
    if(!window.confirm(`${fmt(eventDate)} wirklich löschen? Der Termin und seine Anwesenheitsdaten werden entfernt.`)) return;
    const remainingEvents=events.filter(event=>event.date!==eventDate);
    setSchedule(old=>old.filter(item=>item.date!==eventDate));
    setAttendance(old=>Object.fromEntries(Object.entries(old).filter(([storedDate])=>storedDate!==eventDate)));
    setConfirmedAttendance(old=>old.filter(storedDate=>storedDate!==eventDate));
    setNextEventNotes(old=>{const next={...old};delete next[eventDate];return next;});
    setNextEventNoteDone(old=>{const next={...old};delete next[eventDate];return next;});
    setEventNotesOpen(old=>{const next={...old};delete next[eventDate];return next;});
    if(date===eventDate){
      const replacement=remainingEvents.find(event=>event.date>=TODAY&&!event.cancelled)||remainingEvents.at(-1);
      if(replacement) setDate(replacement.date);
    }
  };
  const handleTouchStart = (event,eventDate) => {
    const touch=event.touches[0];
    swipeStartX.current=touch?{x:touch.clientX,y:touch.clientY,eventDate}:null;
  };
  const handleTouchMove = (event,eventDate) => {
    const start=swipeStartX.current, touch=event.touches[0];
    if(!start||!touch||start.eventDate!==eventDate) return;
    const dx=touch.clientX-start.x, dy=touch.clientY-start.y;
    if(Math.abs(dx)<=Math.abs(dy)) return;
    const offset=Math.max(-96,Math.min(0,dx));
    setSwipeOffsets(old=>({...old,[eventDate]:offset}));
  };
  const handleTouchEnd = (event,eventDate) => {
    const start=swipeStartX.current;
    if(!start||start.eventDate!==eventDate) return;
    const endX=event.changedTouches[0]?.clientX??start.x;
    const distance=endX-start.x;
    swipeStartX.current=null;
    if(distance < -70){
      setSwipeOffsets(old=>({...old,[eventDate]:-96}));
      if(deleteEvent(eventDate)!==false) setSwipeOffsets(old=>{const next={...old};delete next[eventDate];return next;});
    }else setSwipeOffsets(old=>({...old,[eventDate]:0}));
  };
  const updatePreacherAssignment=(eventDate,changes)=>{markDataChanged();setPreachers(old=>({...old,[eventDate]:{askedName:"",preached:false,...old[eventDate],...changes}}));};
  const addPreacher=()=>{const name=newPreacherName.trim();if(!name)return;if(preacherRoster.some(item=>item.toLowerCase()===name.toLowerCase())){window.alert("Diese Person ist bereits in der Predigerliste.");return;}setPreacherRoster(old=>[...old,name].sort((a,b)=>a.localeCompare(b,"de")));setNewPreacherName("");};
  const removePreacher=name=>{if(!window.confirm(`${name} wirklich aus der Predigerliste entfernen? Bereits gespeicherte Termine bleiben erhalten.`))return;setPreacherRoster(old=>old.filter(item=>item!==name));};
  const isVisitContent = content => /alten[- ]?\/?\s*und\s*krankenbesuch|alten-\s*und\s*krankenbesuch|altenbesuch|krankenbesuch/i.test(content);
  const extractVisited = content => {
    const bracketMatch=content.match(/\(([^)]+)\)/);
    if(bracketMatch?.[1]) return bracketMatch[1].trim();
    const colonIndex=content.indexOf(":");
    return colonIndex>=0?content.slice(colonIndex+1).trim():content.replace(/^.*?(besuch)\s*/i,"").trim();
  };
  const schoolYears=["24/25","25/26","26/27","27/28"];
  const themePattern=/(?:themenreihe|thema)\s*:/iu;
  const isThemeContent=content=>themePattern.test(String(content||"").normalize("NFC"));
  const extractThemeContent=content=>{
    const text=String(content||"").normalize("NFC");
    const match=themePattern.exec(text);
    if(!match) return "";
    const labelMatch=text.slice(match.index).match(/(?:themenreihe|thema)\s*:/iu);
    if(!labelMatch) return "";
    const start=match.index+(labelMatch.index||0);
    return text.slice(start).trim();
  };
  const archiveEvents=schedule.filter(item=>item.content&&(archiveAction==="visits"?isVisitContent(item.content):isThemeContent(item.content))).filter(item=>archiveSchoolYear==="all"||schoolYearFor(item.date)===archiveSchoolYear).sort((a,b)=>a.date.localeCompare(b.date));
  const archiveGroups=schoolYears.map(year=>({year,items:archiveEvents.filter(item=>schoolYearFor(item.date)===year)})).filter(group=>group.items.length);
  const eventSchoolYearGroups=schoolYears.map(year=>({year,items:events.filter(item=>schoolYearFor(item.date)===year)}));
  const scrollToTop=()=>window.scrollTo({top:0,behavior:"smooth"});
  const openPreviousEventNote=()=>{
    if(!previousConfirmedEvent) return;
    const eventDate=previousConfirmedEvent.date;
    setOpenEventSchoolYear(schoolYearFor(eventDate));
    setEventNotesOpen(old=>({...old,[eventDate]:true}));
    navigateTo("events");
    window.setTimeout(()=>{
      document.getElementById(`event-${eventDate}`)?.scrollIntoView({behavior:"smooth",block:"start"});
      window.setTimeout(()=>document.getElementById(`note-${eventDate}`)?.focus({preventScroll:true}),350);
    },100);
  };
  const scrollToNextEvent=()=>{
    if(!nextEvent) return;
    const targetSchoolYear=schoolYearFor(nextEvent.date);
    setOpenEventSchoolYear(targetSchoolYear);
    window.setTimeout(()=>{
      const target=document.getElementById(`event-${nextEvent.date}`);
      target?.scrollIntoView({behavior:"smooth",block:"start"});
    },80);
  };
  const addDays=(value,days)=>{const d=new Date(`${value}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);};
  const schoolYearBounds=()=>{const [startShort]=currentSchoolYear.split("/");const century=String(new Date(`${currentDate}T12:00:00Z`).getUTCFullYear()).slice(0,2);const startYear=Number(`${century}${startShort}`);return {start:`${startYear}-08-01`,end:`${startYear+1}-07-31`};};
  const reportEvents=()=>{
    if(reportScope==="schoolYear"){const bounds=schoolYearBounds();return events.filter(event=>event.date>=bounds.start&&event.date<=bounds.end);}
    return events.filter(event=>event.date>=addDays(currentDate,-14)&&event.date<=addDays(currentDate,42));
  };
  const reportAttendanceEvents=events.filter(event=>schoolYearFor(event.date)===currentSchoolYear&&!event.cancelled&&confirmedAttendance.includes(event.date)&&event.date<=currentDate);
  const reportRows=overviewPeople.map(person=>{const relevant=reportAttendanceEvents.filter(event=>!person.joinDate||event.date>=person.joinDate);const count=relevant.filter(event=>(attendance[event.date]||[]).includes(person.id)).length;return {person,count,total:relevant.length,percent:relevant.length?Math.round(count/relevant.length*100):0};});
  const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
  const reportHtml=()=>{
    const selectedEvents=reportEvents();
    const attendanceHeader=reportAttendanceEvents.map(event=>`<th>${escapeHtml(shortDate(event.date))}</th>`).join("");
    const attendanceBody=reportRows.map(({person,count,total,percent},index)=>`<tr><td>${index+1}</td><td>${escapeHtml(`${person.last}, ${person.first}`)}</td>${reportAttendanceEvents.map(event=>`<td class="center">${(attendance[event.date]||[]).includes(person.id)?"X":""}</td>`).join("")}<td>${count}/${total}</td><td>${percent}%</td></tr>`).join("");
    const eventBody=selectedEvents.map(event=>{const plan=scheduleFor(event.date);return `<tr><td>${escapeHtml(fmt(event.date))}</td><td>${escapeHtml(plan.content||"")}</td><td>${escapeHtml(plan.responsible||"")}</td><td>${event.cancelled?"Ausfall":confirmedAttendance.includes(event.date)?`${(attendance[event.date]||[]).length} anwesend`:""}</td></tr>`;}).join("");
    const range=reportScope==="schoolYear"?`Ganzes Schuljahr ${currentSchoolYear}`:"Letzte 2 und nächste 6 Wochen";
    return `<!doctype html><html><head><meta charset="utf-8"><title>Jungschar-Bericht</title><style>body{font-family:Arial,sans-serif;color:#172033;margin:24px}h1{color:#174ea6}h2{margin-top:28px;color:#174ea6}p{color:#536174}table{border-collapse:collapse;width:100%;font-size:11px;margin-top:10px}th{background:#174ea6;color:white}th,td{border:1px solid #b7c1d1;padding:6px;vertical-align:top}.center{text-align:center}.quote{font-weight:bold}.page{page-break-before:always}@media print{body{margin:10mm}table{font-size:9px}thead{display:table-header-group}}</style></head><body><h1>Jungschar 2012</h1><p>Bericht vom ${escapeHtml(fmt(currentDate))} · ${escapeHtml(range)}</p><h2>Anwesenheit aktuelles Schuljahr ${escapeHtml(currentSchoolYear)}</h2><table><thead><tr><th>Nr.</th><th>Name</th>${attendanceHeader}<th>Anwesend</th><th>Quote</th></tr></thead><tbody>${attendanceBody}</tbody></table><div class="page"><h2>Termine</h2><p>${escapeHtml(range)}</p><table><thead><tr><th>Datum</th><th>Inhalt</th><th>Verantwortlich</th><th>Status</th></tr></thead><tbody>${eventBody}</tbody></table></div></body></html>`;
  };
  const exportExcelReport=()=>{const blob=new Blob([reportHtml()],{type:"application/vnd.ms-excel;charset=utf-8"});const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download=`Jungschar-Bericht-${currentDate}.xls`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  const exportPdfReport=()=>{const win=window.open("","_blank");if(!win){window.alert("Bitte Pop-ups für diese Seite erlauben.");return;}win.document.open();win.document.write(reportHtml());win.document.close();win.onload=()=>{win.focus();win.print();};};
  const exportBackup=()=>{
    const storage={};
    for(let index=0;index<localStorage.length;index+=1){
      const key=localStorage.key(index);
      if(key?.startsWith("jungschar.")) storage[key]=localStorage.getItem(key);
    }
    const backup={app:"Jungschar 2012",formatVersion:1,exportedAt:new Date().toISOString(),storage};
    const blob=new Blob([JSON.stringify(backup,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;
    link.download=`Jungschar-Backup-${new Date().toLocaleDateString("en-CA")}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const importBackup=event=>{
    const file=event.target.files?.[0];
    event.target.value="";
    if(!file) return;
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const backup=JSON.parse(String(reader.result));
        if(backup?.app!=="Jungschar 2012"||!backup.storage||typeof backup.storage!=="object") throw new Error("Ungültiges Backup");
        const keys=Object.keys(backup.storage).filter(key=>key.startsWith("jungschar."));
        if(!keys.length) throw new Error("Keine App-Daten gefunden");
        const backupDate=backup.exportedAt?new Date(backup.exportedAt).toLocaleString("de-DE"):"unbekannten Zeitpunkt";
        if(!window.confirm(`Backup vom ${backupDate} wiederherstellen? Die aktuellen lokalen App-Daten werden ersetzt.`)) return;
        Object.keys(localStorage).filter(key=>key.startsWith("jungschar.")).forEach(key=>localStorage.removeItem(key));
        keys.forEach(key=>{if(typeof backup.storage[key]==="string") localStorage.setItem(key,backup.storage[key]);});
        window.alert("Backup wurde wiederhergestellt. Die App wird jetzt neu geladen.");
        window.location.reload();
      }catch{
        window.alert("Diese Datei ist kein gültiges Jungschar-App-Backup.");
      }
    };
    reader.readAsText(file);
  };
  const nav=[["attendance","Anwesenheit",CheckCircle2],["people","Teilnehmer",Users],["home","Start",Home],["events","Termine",CalendarDays],["overview","Übersicht",ClipboardList]];

  return <div className="min-h-screen bg-[#f3f6fb] pb-40 text-slate-900">
    <style>{`
      html { -webkit-text-size-adjust: 100%; }
      @supports (-webkit-touch-callout: none) {
        input:not([type="checkbox"]):not([type="radio"]),
        select,
        textarea {
          font-size: 16px !important;
          line-height: 1.35;
        }
      }
    `}</style>
    <main className="mx-auto max-w-5xl space-y-4 p-4">
      {view!=="home"&&<header><p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">Jungschar-App</p><h1 className="text-3xl font-black">Jungschar 2012</h1><p className="text-sm text-slate-500">Version {APP_VERSION} · {syncStatus==="local"?"lokaler Datenstand":"synchronisiert"} · {dataStandText}</p></header>}

      {view==="home"&&<>
        <section className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cloud-V2</p><p className="truncate text-xs font-bold text-slate-600">Version {APP_VERSION} · Stand {APP_BUILD_DATE}</p></div><div className="shrink-0 text-right"><div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-[10px] font-black text-amber-800"><span className="h-2 w-2 rounded-full bg-amber-500"/>{syncStatus==="local"?"Lokal gespeichert":"Synchronisiert"}</div><p className="mt-1 text-[9px] font-bold text-slate-400">Daten: {dataStandText}</p></div></section>
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
            <h1 className="text-4xl font-black leading-none drop-shadow-lg sm:text-5xl">Jungschar 2012</h1><p className="mt-2 text-lg font-bold text-blue-100 drop-shadow-md sm:text-xl">Die beste Gruppe</p><div className="mt-4 rounded-2xl border border-white/20 bg-slate-950/50 p-3 backdrop-blur-md sm:p-4"><p className="text-[10px] font-black uppercase tracking-[.18em] text-blue-200">Jungscharleiter</p><div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs font-bold leading-tight sm:flex sm:flex-wrap sm:gap-2 sm:text-sm"><span>Samuel Kliwer</span><span>Davis Kliwer</span><span>Stephan Domanski</span><span>Julien Vogel</span></div></div>
            {photo&&<button type="button" onClick={resetPhoto} className="mt-3 text-xs font-bold text-white/80 underline underline-offset-4">Standardbild wiederherstellen</button>}
          </div>
        </section>
        <section className="rounded-[34px] bg-gradient-to-br from-blue-700 to-indigo-950 p-6 text-white shadow-xl"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-blue-200">Nächster Termin</p><h2 className="mt-1 text-3xl font-black">{fmt(nextEvent.date)}</h2></div>{previousConfirmedEvent&&<button type="button" onClick={openPreviousEventNote} title={`Notiz vom vorherigen Termin ${fmt(previousConfirmedEvent.date)} öffnen`} aria-label="Notiz vom vorherigen Termin öffnen" className="flex shrink-0 items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-2 text-blue-100 transition hover:bg-white/20 active:scale-95"><Undo2 size={14}/><Mail size={15}/></button>}</div><div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"><p className="text-[10px] font-black uppercase tracking-wider text-blue-200">Stundeninhalt</p><p className="mt-1 text-sm font-bold leading-relaxed">{nextSchedule.content||"Noch kein Inhalt eingetragen"}</p></div><section className="mt-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"><button type="button" onClick={()=>setHomeNoteOpen(value=>!value)} className="flex w-full items-center justify-between gap-3 text-left"><span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-blue-200"><Pencil size={14}/>Notiz für diesen Termin</span><span className="flex items-center gap-2 text-[10px] font-black text-blue-100">{homeNoteOpen?"Ausblenden":"Anzeigen"}<ChevronRight size={16} className={`transition-transform ${homeNoteOpen?"rotate-90":""}`}/></span></button>{homeNoteOpen&&<div className="mt-3"><textarea rows="2" ref={autoGrow} value={nextEventNotes[nextEvent.date]||""} onInput={event=>autoGrow(event.currentTarget)} onChange={event=>{setNextEventNotes(old=>({...old,[nextEvent.date]:event.target.value}));autoGrow(event.currentTarget)}} placeholder="Was muss ich bis zur nächsten Gruppenstunde beachten?" className="w-full resize-none rounded-xl border border-white/20 bg-white/95 p-3 text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400 sm:text-sm"/><button type="button" onClick={()=>setNextEventNoteDone(old=>({...old,[nextEvent.date]:!old[nextEvent.date]}))} className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-black ${nextEventNoteDone[nextEvent.date]?"border-emerald-300 bg-emerald-500/25 text-emerald-100":"border-white/15 bg-white/5 text-blue-100"}`}><span className={`grid h-5 w-5 place-items-center rounded-md border ${nextEventNoteDone[nextEvent.date]?"border-emerald-300 bg-emerald-500 text-white":"border-white/30"}`}>{nextEventNoteDone[nextEvent.date]&&<Check size={14}/>}</span>{nextEventNoteDone[nextEvent.date]?"Notiz erledigt":"Als erledigt markieren"}</button></div>}</section><div className="mt-3 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/15 bg-white/10 p-3"><p className="text-[10px] font-black uppercase tracking-wider text-blue-200">Verantwortlich</p><p className="mt-1 text-sm font-bold">{nextSchedule.responsible||"Offen"}</p></div><div className="rounded-2xl border border-white/15 bg-white/10 p-3"><p className="text-[10px] font-black uppercase tracking-wider text-blue-200">Segensgebet</p><p className="mt-1 text-sm font-bold">{preacherName(nextEvent.date)}</p></div></div><div className="mt-4 grid gap-2 sm:grid-cols-2"><button onClick={()=>{setDate(nextEvent.date);attendanceInitialized.current=true;navigateTo("attendance")}} className="rounded-2xl bg-white px-4 py-3 font-bold text-blue-700">Anwesenheit erfassen</button><button onClick={()=>navigateTo("preachers",{resetTarget:true})} className="flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 font-bold text-white"><BookOpen size={18}/>Predigerliste öffnen</button></div></section>
        <section className={`rounded-3xl border p-5 shadow-sm ${birthdayFallsOnNextEvent?"border-amber-400 bg-gradient-to-br from-amber-100 to-pink-100 ring-2 ring-amber-300":"border-pink-200 bg-gradient-to-br from-pink-50 to-amber-50"}`}><div className="flex items-start gap-3"><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white ${birthdayFallsOnNextEvent?"bg-amber-500":"bg-pink-500"}`}><Cake size={22}/></div><div className="min-w-0 flex-1"><p className={`text-[10px] font-black uppercase tracking-widest ${birthdayFallsOnNextEvent?"text-amber-800":"text-pink-700"}`}>{birthdayFallsOnNextEvent?"Geburtstag am nächsten Termin":"Nächster Geburtstag"}</p><h3 className="mt-1 text-lg font-black">{nextBirthdayPeople.length?nextBirthdayPeople.map(item=>item.name).join(", "):"Kein Geburtstag hinterlegt"}</h3>{nextBirthdayDate&&<p className="mt-1 text-sm font-bold text-slate-700">{fmt(nextBirthdayDate)}</p>}{birthdayFallsOnNextEvent&&<div className="mt-2 inline-flex rounded-full bg-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950">Fällt auf die Gruppenstunde</div>}<button type="button" onClick={()=>setShowBirthdayList(v=>!v)} className="mt-3 flex items-center gap-1 rounded-xl bg-white/80 px-3 py-2 text-xs font-black text-pink-700 shadow-sm ring-1 ring-pink-200">{showBirthdayList?"Geburtstagsliste schließen":"Alle Geburtstage anzeigen"}<ChevronRight size={14} className={showBirthdayList?"rotate-90":""}/></button></div></div>{showBirthdayList&&<div className="mt-4 border-t border-pink-200 pt-4"><div className="mb-2 text-xs font-black uppercase tracking-wider text-pink-700">Alle Geburtstage</div><div className="grid gap-2 sm:grid-cols-2">{allBirthdays.map(item=><div key={`${item.type}-${item.name}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white/85 p-3"><div><div className="font-bold">{item.name}</div><div className="text-[10px] font-black uppercase tracking-wider text-slate-400">{item.type}</div></div><span className="shrink-0 rounded-full bg-pink-100 px-2.5 py-1 text-xs font-black text-pink-700">{item.birthday}</span></div>)}</div></div>}</section>
          <section className="grid grid-cols-3 gap-3"><div className="rounded-3xl bg-white p-4"><b className="text-2xl">{people.length}</b><p className="text-xs text-slate-500">Teilnehmer</p></div><div className="rounded-3xl bg-white p-4"><b className="text-2xl">{currentSchoolYearPastEvents.length}</b><p className="text-xs text-slate-500">erfasste Termine</p></div><div className="rounded-3xl bg-white p-4"><b className="text-2xl text-amber-600">{missedThree.length}</b><p className="text-xs text-slate-500">3× gefehlt</p></div></section>
        <section className="rounded-3xl bg-white p-5"><div className="flex items-center gap-2"><AlertTriangle className="text-amber-500"/><b>Letzte 3 erfasste Termine gefehlt</b></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{missedThree.length?missedThree.map(p=><div className="rounded-2xl bg-amber-50 p-3" key={p.id}><div className="font-bold">{p.last}, {p.first}</div><div className="mt-1 text-xs text-amber-800">{p.v?<>Verantwortlicher Leiter: <b>{p.v}</b></>:<i>Kein verantwortlicher Leiter hinterlegt</i>}</div></div>):<p className="text-sm text-slate-500">Keine Personen betroffen.</p>}</div><div className="my-5 border-t border-slate-200"/><button type="button" onClick={()=>setShowLowAttendance(value=>!value)} className="flex w-full items-center justify-between gap-3 rounded-2xl bg-red-50 px-3 py-3 text-left"><div className="flex items-center gap-2"><AlertTriangle className="text-red-500"/><b>Gesamtanwesenheit bis 50 %</b></div><div className="flex items-center gap-2"><span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-black text-red-700">{lowAttendancePeople.length}</span><ChevronRight size={18} className={`text-red-600 transition-transform ${showLowAttendance?"rotate-90":""}`}/></div></button>{showLowAttendance&&<div className="mt-3 grid gap-2 sm:grid-cols-2">{lowAttendancePeople.length?lowAttendancePeople.map(({person,stats})=><div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 p-3" key={person.id}><div><div className="font-bold">{person.last}, {person.first}</div><div className="mt-1 text-xs text-red-800">{stats.attended} von {stats.total} Terminen anwesend</div></div><span className="text-lg font-black text-red-700">{stats.percent}%</span></div>):<p className="text-sm text-slate-500">Keine Personen mit 50 % oder weniger.</p>}</div>}</section>
        <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-100 text-blue-700"><ShieldCheck size={22}/></div>
            <div><h3 className="font-black">Datensicherung</h3><p className="mt-1 text-xs leading-relaxed text-slate-500">Sichert Teilnehmer, Anwesenheiten, Termine, Predigerliste, Geburtstage, Einstellungen und das ausgewählte Titelbild.</p></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={exportBackup} className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-3 py-3 text-sm font-black text-white active:scale-[.98]"><Download size={18}/>Backup sichern</button>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 px-3 py-3 text-sm font-black text-white active:scale-[.98]"><Upload size={18}/>Backup laden<input type="file" accept="application/json,.json" onChange={importBackup} className="hidden"/></label>
          </div>
          <p className="mt-3 text-[10px] font-bold text-slate-400">Vor einem App-Update zuerst „Backup sichern“ verwenden.</p>
        </section>
      </>}

      {view==="attendance"&&<>
        <section className="rounded-3xl bg-white p-4"><div className="flex items-center justify-between"><button disabled={eventIndex<=0} onClick={()=>setDate(events[eventIndex-1].date)} className="rounded-full border p-3 disabled:opacity-20"><ChevronLeft/></button><div className="text-center"><p className="text-xs font-black uppercase tracking-widest text-blue-600">Anwesenheit</p><h2 className="font-black">{fmt(date)}</h2><p className={selectedEvent.cancelled?"text-red-600":"text-emerald-600"}>{selectedEvent.cancelled?"Ausfall":`${present.size} / ${people.length} anwesend`}</p></div><button disabled={eventIndex===events.length-1} onClick={()=>setDate(events[eventIndex+1].date)} className="rounded-full border p-3 disabled:opacity-20"><ChevronRight/></button></div><select value={date} onChange={e=>setDate(e.target.value)} className="mt-4 w-full rounded-2xl border bg-slate-50 p-3">{events.map(e=><option value={e.date} key={e.date}>{fmt(e.date)}{e.cancelled?" · Ausfall":""}</option>)}</select><button onClick={()=>setDate(nextEvent.date)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 py-3 font-bold text-blue-700"><CalendarDays size={18}/>Heute</button></section>
        {!selectedEvent.cancelled&&<button type="button" onClick={confirmAttendance} disabled={date>currentDate} className={`flex w-full items-center justify-between rounded-2xl disabled:cursor-not-allowed disabled:opacity-60 px-4 py-3 text-left shadow-sm ${attendanceIsConfirmed?"bg-emerald-600 text-white":"bg-red-600 text-white"}`}><span><span className="block text-[10px] font-black uppercase tracking-wider opacity-80">Anwesenheitsstatus</span><b className="text-sm">{date>currentDate?`Quittieren erst am ${shortDate(date)}`:attendanceIsConfirmed?"Quittiert und aktuell":"Änderungen noch nicht quittiert"}</b></span><span className="rounded-xl bg-white/20 px-3 py-2 text-xs font-black">{attendanceIsConfirmed?"Grün · quittiert":"Rot · quittieren"}</span></button>}
        <div className="flex gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Teilnehmer suchen" className="w-full rounded-2xl border bg-white py-2.5 pl-10"/></div><button onClick={()=>setShowChecked(v=>!v)} className="rounded-2xl border bg-white px-3 text-xs font-bold">{showChecked?"Abgehakte ausblenden":"Alle zeigen"}</button></div>
        {selectedEvent.cancelled?<div className="rounded-3xl bg-red-50 p-5 text-red-700"><Ban className="mb-2"/><b>Dieser Termin ist als Ausfall hinterlegt.</b></div>:<><section className="overflow-hidden rounded-3xl bg-white">{attendancePeople.map(p=><button key={p.id} onClick={()=>toggleAttendance(p.id)} className="flex w-full items-center gap-3 border-b p-4 text-left"><span className={`grid h-11 w-11 place-items-center rounded-2xl border-2 ${present.has(p.id)?"border-emerald-600 bg-emerald-600 text-white":"border-slate-200 text-transparent"}`}><Check/></span><b className="flex-1">{p.last}, {p.first}</b></button>)}</section><section className={`rounded-3xl border p-5 shadow-sm ${attendanceIsConfirmed?"border-emerald-200 bg-emerald-50":"border-red-200 bg-red-50"}`}><div className="flex items-start gap-3"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white ${attendanceIsConfirmed?"bg-emerald-600":"bg-red-600"}`}><CheckCircle2 size={24}/></div><div><h3 className="text-lg font-black">{attendanceIsConfirmed?"Anwesenheit quittiert":"Anwesenheit noch nicht quittiert"}</h3><p className="mt-1 text-xs leading-relaxed text-slate-600">Beim Quittieren werden Fehlzeiten, Prozentwerte und Teilnehmerquoten des aktuellen Schuljahres sofort neu berechnet. Frühere Schuljahre bleiben ohne Einfluss auf die aktuelle Quote. Nachträgliche Änderungen bleiben möglich.</p></div></div><button type="button" onClick={confirmAttendance} disabled={date>currentDate} className={`mt-4 flex w-full items-center disabled:cursor-not-allowed disabled:opacity-60 justify-center gap-2 rounded-2xl py-4 text-base font-black text-white shadow-lg active:scale-[.98] ${attendanceIsConfirmed?"bg-emerald-600":"bg-red-600"}`}><Check size={21}/>{date>currentDate?`Quittieren erst am ${shortDate(date)}`:attendanceIsConfirmed?"Anwesenheit erneut quittieren":"Anwesenheit jetzt quittieren"}</button>{attendanceSavedNotice&&<p className="mt-3 text-center text-xs font-black text-emerald-700">Gespeichert. Alle Listen und Quoten wurden aktualisiert.</p>}</section></>}
      </>}

      {view==="people"&&<>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-2xl font-black">Teilnehmer</h2>
            <p className="text-sm text-slate-500">{people.length} Personen</p>
          </div>
          <button onClick={()=>{setDraft(blank);setAdding(true)}} className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-sm active:scale-95" title="Teilnehmer hinzufügen"><Plus size={20}/></button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18}/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Teilnehmer suchen" className="w-full rounded-2xl border bg-white py-2.5 pl-10 pr-4 shadow-sm"/>
        </div>

        <section className="grid gap-3 sm:grid-cols-2">
          <section className="rounded-3xl bg-white p-4 shadow-sm"><div className="grid gap-3 sm:grid-cols-2"><select value={leaderFilter} onChange={e=>setLeaderFilter(e.target.value)} className="w-full rounded-2xl border bg-slate-50 p-3 text-base sm:text-sm"><option value="">Alle Leiter</option><option value="stephan">Stephan</option><option value="samuel">Samuel</option><option value="julien">Julien</option><option value="davis">Davis</option></select><select value={peopleFilter} onChange={e=>setPeopleFilter(e.target.value)} className="w-full rounded-2xl border bg-slate-50 p-3 text-base sm:text-sm"><option value="all">Alle Teilnehmer</option><option value="piano">Klavierspieler</option><option value="hj1open">HJ1 offen</option><option value="hj2open">HJ2 offen</option></select></div><p className="mt-2 text-xs font-bold text-slate-500">{filteredPeople.length} von {people.length} Personen</p></section><button type="button" onClick={()=>setShowHJOverview(v=>!v)} className="flex w-full items-center justify-between rounded-3xl bg-emerald-700 p-4 text-white"><b>HJ1 und HJ2 kompakt</b><ChevronRight className={showHJOverview?"rotate-90":""}/></button>{showHJOverview&&<section className="rounded-3xl bg-white p-4"><div className="mb-3 grid grid-cols-2 gap-2"><div className="rounded-2xl bg-red-50 p-3 text-center"><span className="text-[10px] font-black uppercase text-red-600">HJ1 offen</span><b className="block text-2xl text-red-700">{hjOverviewPeople.filter(p=>!p.hj1).length}</b></div><div className="rounded-2xl bg-red-50 p-3 text-center"><span className="text-[10px] font-black uppercase text-red-600">HJ2 offen</span><b className="block text-2xl text-red-700">{hjOverviewPeople.filter(p=>!p.hj2).length}</b></div></div><div className="grid gap-2">{hjOverviewPeople.map(p=><div key={p.id} className="rounded-2xl bg-slate-50 p-3"><div className="mb-2"><b>{p.last}, {p.first}</b><small className="block font-bold text-slate-500">Leiter: {leaderAliases[String(p.v||"").toLowerCase()]||p.v||"nicht zugeordnet"}</small></div><div className="grid grid-cols-2 gap-2"><div className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-black ${p.hj1?"bg-emerald-100 text-emerald-800":"bg-red-100 text-red-800"}`}>{p.hj1?<Check size={17}/>:<X size={17}/>} HJ1 {p.hj1?"erledigt":"offen"}</div><div className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-black ${p.hj2?"bg-emerald-100 text-emerald-800":"bg-red-100 text-red-800"}`}>{p.hj2?<Check size={17}/>:<X size={17}/>} HJ2 {p.hj2?"erledigt":"offen"}</div></div></div>)}</div></section>}{filteredPeople.map(p=>{
            const editing=editingPersonId===p.id;
            const stats=personStats(p);
            const number=overviewPeople.findIndex(person=>person.id===p.id)+1;
            return <article key={p.id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 font-black text-white">{number}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-black">{p.last}, {p.first}</div>
                    <div className="mt-0.5 text-[11px] font-bold text-slate-500">{p.birthday||"Geburtstag offen"}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-700">LEITER · {p.v||"–"}</span>
                      <span className="text-lg font-black leading-none text-blue-700">{stats.percent}%</span>
                    </div>
                  </div>
                  <button type="button" onClick={()=>setEditingPersonId(editing?null:p.id)} title={editing?"Bearbeitung schließen":"Teilnehmer bearbeiten"} className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl active:scale-90 ${editing?"bg-emerald-100 text-emerald-700":"bg-slate-100 text-slate-700"}`}>{editing?<Check size={17}/>:<Pencil size={17}/>}</button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="min-w-0 rounded-2xl bg-amber-50 px-3 py-2">
                    <span className="block text-[9px] font-black uppercase tracking-wider text-amber-700">Dienst</span>
                    <span className="mt-0.5 block truncate text-xs font-bold text-amber-950" title={p.duty||"Nicht eingetragen"}>{p.duty||"–"}</span>
                  </div>
                  <div className="min-w-0 rounded-2xl bg-violet-50 px-3 py-2">
                    <span className="block text-[9px] font-black uppercase tracking-wider text-violet-700">Instrument</span>
                    <span className="mt-0.5 block truncate text-xs font-bold text-violet-950" title={p.instrument||"Nicht eingetragen"}>{p.instrument||"–"}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-500">Letzte 5 Anwesenheiten</span>
                    <div className="mt-1.5 flex gap-1.5">{stats.lastFive.length?stats.lastFive.map(item=><span key={item.date} title={`${fmt(item.date)} · ${item.present?"anwesend":"abwesend"}`} className={`h-3.5 w-3.5 rounded-full ring-2 ring-white ${item.present?"bg-emerald-500":"bg-red-500"}`}/>):<span className="text-[10px] text-slate-400">Noch keine Termine</span>}</div>
                  </div>
                  <div className="shrink-0 text-right text-[10px] leading-4">
                    <span className="font-bold text-emerald-700">{stats.attended} anwesend</span><br/>
                    <span className="font-bold text-red-600">{stats.absent} abwesend</span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  <Flag active={!!p.hg} label="HG" color="violet" onClick={()=>toggleFlag(p.id,"hg")}/>
                  <Flag active={!!p.hj1} label="HJ1" onClick={()=>toggleFlag(p.id,"hj1")}/>
                  <Flag active={!!p.hj2} label="HJ2" onClick={()=>toggleFlag(p.id,"hj2")}/>
                </div>
              </div>

              {editing&&<div className="border-t border-blue-100 bg-blue-50/60 p-4">
                <div className="grid gap-3">
                  <label><span className="mb-1 block text-xs font-black text-slate-600">Geburtstag (TT.MM.)</span><input value={p.birthday||""} onChange={e=>updatePerson(p.id,"birthday",formatBirthdayInput(e.target.value))} placeholder="TT.MM." inputMode="numeric" maxLength={5} className="w-full rounded-xl border bg-white p-2.5 text-sm"/></label>
                  <label><span className="mb-1 block text-xs font-black text-slate-600">Leiter</span><input value={p.v||""} onChange={e=>updatePerson(p.id,"v",e.target.value)} className="w-full rounded-xl border bg-white p-2.5 text-sm"/></label>
                  <label><span className="mb-1 block text-xs font-black text-slate-600">Dienst</span><input value={p.duty||""} onChange={e=>updatePerson(p.id,"duty",e.target.value)} className="w-full rounded-xl border bg-white p-2.5 text-sm"/></label>
                  <label><span className="mb-1 block text-xs font-black text-slate-600">Instrument</span><input value={p.instrument||""} onChange={e=>updatePerson(p.id,"instrument",e.target.value)} className="w-full rounded-xl border bg-white p-2.5 text-sm"/></label>
                </div>
                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <button type="button" onClick={()=>setEditingPersonId(null)} className="rounded-xl bg-emerald-600 py-2.5 text-sm font-black text-white active:scale-[.98]">Fertig</button>
                  <button type="button" onClick={()=>deletePerson(p)} title="Teilnehmer löschen" className="grid h-10 w-10 place-items-center rounded-xl bg-red-100 text-red-700"><Trash2 size={17}/></button>
                </div>
              </div>}
            </article>
          })}
        </section>
      </>}

      {view==="preachers"&&<>
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-blue-600">Planung</p><h2 className="text-2xl font-black">Predigerliste</h2><p className="text-sm text-slate-500">Predigten werden nach dem Termin manuell bestätigt</p></div><button type="button" onClick={()=>navigateTo("home")} className="rounded-2xl bg-slate-900 px-4 py-3 text-xs font-black text-white">Zur Startseite</button></div>
        <button type="button" onClick={()=>setShowPreacherOverview(value=>!value)} className="flex w-full items-center justify-between rounded-3xl bg-indigo-700 p-4 text-left text-white shadow-sm"><div><p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Auswertung</p><b>Gesamtübersicht Predigten</b></div><ChevronRight size={20} className={`transition-transform ${showPreacherOverview?"rotate-90":""}`}/></button>
        {showPreacherOverview&&<section className="overflow-hidden rounded-3xl bg-white shadow-sm"><div className="flex items-center justify-between gap-3 p-4"><div><h3 className="font-black">Predigten nach Datum</h3><p className="text-xs text-slate-500">Horizontal wischen, um alle Termine zu sehen.</p></div><span className="shrink-0 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-700">{preacherHistory.length} Predigten</span></div>{preacherOverviewDates.length?<div className="overflow-x-auto border-t border-slate-100"><table className="min-w-max border-collapse text-xs"><thead><tr className="bg-slate-900 text-white"><th className="sticky left-0 z-20 min-w-44 border-r border-slate-700 bg-slate-900 px-3 py-3 text-left">Prediger</th>{preacherOverviewDates.map(eventDate=><th key={eventDate} className="min-w-16 border-r border-slate-700 px-2 py-2"><span className="block">{shortDate(eventDate)}</span><span className="text-[10px] font-normal opacity-70">{schoolYearFor(eventDate)}</span></th>)}<th className="min-w-16 bg-indigo-900 px-2 py-2">Gesamt</th></tr></thead><tbody>{preacherOverviewNames.map((name,index)=>{const total=preacherOverviewDates.filter(eventDate=>preachers[eventDate]?.askedName===name).length;return <tr key={name} className={index%2?"bg-slate-50":"bg-white"}><td className={`sticky left-0 z-10 border-b border-r px-3 py-2 font-semibold ${index%2?"bg-slate-50":"bg-white"}`}>{name}</td>{preacherOverviewDates.map(eventDate=>{const checked=preachers[eventDate]?.askedName===name;return <td key={eventDate} className="border-b border-r px-2 py-2 text-center">{checked?<span className="inline-grid h-6 w-6 place-items-center rounded-md bg-emerald-600 font-black text-white"><Check size={15}/></span>:<span className="text-slate-300">·</span>}</td>})}<td className="border-b bg-indigo-50 px-2 py-2 text-center font-black text-indigo-700">{total}</td></tr>})}</tbody></table></div>:<p className="border-t border-slate-100 p-4 text-sm text-slate-500">Noch keine Predigten eingetragen.</p>}</section>}
        <button type="button" onClick={()=>setShowPreacherManagement(value=>!value)} className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm"><div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Einstellungen</p><b>Prediger verwalten</b></div><ChevronRight size={20} className={`text-slate-500 transition-transform ${showPreacherManagement?"rotate-90":""}`}/></button>
        {showPreacherManagement&&<section className="rounded-3xl bg-white p-4 shadow-sm"><div className="flex gap-2"><input value={newPreacherName} onChange={e=>setNewPreacherName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addPreacher()}} placeholder="Name hinzufügen" className="min-w-0 flex-1 rounded-2xl border bg-slate-50 p-3"/><button type="button" onClick={addPreacher} className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white"><Plus/></button></div><div className="mt-3 flex flex-wrap gap-2">{preacherRoster.map(name=><span key={name} className="flex items-center gap-2 rounded-full bg-slate-100 py-1 pl-3 pr-1 text-xs font-bold">{name}<button type="button" onClick={()=>removePreacher(name)} className="grid h-6 w-6 place-items-center rounded-full bg-red-100 text-red-700"><X size={13}/></button></span>)}</div></section>}
        <section className="grid gap-3">{preacherDisplayEvents.map(event=>{const assignment=preachers[event.date]||{askedName:"",preached:false};const isNext=event.date===nextEvent.date;const isPast=event.date<TODAY;const options=assignment.askedName&&!preacherRoster.includes(assignment.askedName)?[assignment.askedName,...preacherRoster]:preacherRoster;return <article key={event.date} className={`rounded-3xl p-4 shadow-sm ${isNext?"border-2 border-blue-500 bg-blue-50":isPast?"border-2 border-amber-400 bg-amber-50":"bg-white"}`}><div className="flex items-center justify-between gap-3"><div><b>{fmt(event.date)}</b>{isNext&&<span className="ml-2 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-black uppercase text-white">Nächster Termin</span>}{isPast&&<span className="ml-2 rounded-full bg-amber-500 px-2 py-1 text-[10px] font-black uppercase text-slate-950">Letzter Termin</span>}</div></div><label className="mt-4 block"><span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Gefragt wurde</span><select value={assignment.askedName||""} onChange={e=>updatePreacherAssignment(event.date,{askedName:e.target.value,preached:false})} className="w-full rounded-2xl border bg-slate-50 p-3 text-base sm:text-sm"><option value="">Noch niemand festgelegt</option><option value="Allgemeine Gebetstunde">Allgemeine Gebetstunde</option>{options.filter(name=>name!=="Allgemeine Gebetstunde").map(name=><option key={name} value={name}>{name}</option>)}</select></label>{isPast&&assignment.askedName!=="Allgemeine Gebetstunde"&&<button type="button" disabled={!assignment.askedName} onClick={()=>updatePreacherAssignment(event.date,{preached:true})} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 p-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"><Check size={18}/>Als gepredigt bestätigen</button>}</article>})}</section></>}
      {view==="events"&&<><div className="flex items-start justify-between gap-3"><div><h2 className="text-2xl font-black">Termine</h2><p className="text-sm text-slate-500">Stundeninhalte ab 2024 · Änderungen werden lokal gespeichert</p></div><div className="flex shrink-0 flex-col gap-2"><button type="button" onClick={()=>{setEventDraft({date:"",content:"",responsible:""});setAddingEvent(true)}} className="flex items-center justify-center gap-1 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-black text-white shadow-lg active:scale-95"><Plus size={15}/>Termin</button><button type="button" onClick={scrollToNextEvent} className="rounded-2xl bg-blue-600 px-4 py-3 text-xs font-black text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95">Nächster Termin</button><button type="button" onClick={()=>setShowVisits(value=>!value)} className="rounded-2xl bg-teal-700 px-4 py-3 text-xs font-black text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-teal-800 active:scale-95">{showVisits?"Auswertung schließen":"Archiv auswerten"}</button></div></div>{showVisits&&<section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"><div><p className="text-xs font-black uppercase tracking-widest text-blue-600">Stundenarchiv</p><h3 className="text-xl font-black">Auswertung nach Schuljahr</h3></div><div className="mt-4 grid gap-3"><div><span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Aktion</span><div className="grid grid-cols-2 gap-2"><button type="button" onClick={()=>setArchiveAction("visits")} className={`rounded-2xl px-3 py-2.5 text-xs font-black ${archiveAction==="visits"?"bg-teal-700 text-white":"bg-slate-100 text-slate-600"}`}>Alten- und Krankenbesuch</button><button type="button" onClick={()=>setArchiveAction("themes")} className={`rounded-2xl px-3 py-2.5 text-xs font-black ${archiveAction==="themes"?"bg-amber-500 text-slate-950":"bg-slate-100 text-slate-600"}`}>Thema / Themenreihe</button></div></div><div><span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Schuljahr</span><div className="flex gap-2 overflow-x-auto pb-1"><button type="button" onClick={()=>setArchiveSchoolYear("all")} className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ${archiveSchoolYear==="all"?"bg-slate-900 text-white":"bg-slate-100 text-slate-600"}`}>Alle</button>{schoolYears.map(year=><button type="button" key={year} onClick={()=>setArchiveSchoolYear(year)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ${archiveSchoolYear===year?"bg-slate-900 text-white":"bg-slate-100 text-slate-600"}`}>{year}</button>)}</div></div></div><div className="mt-5 grid gap-4">{archiveGroups.length?archiveGroups.map(group=><section key={group.year} className="overflow-hidden rounded-3xl border border-slate-200"><div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white"><b>Schuljahr {group.year}</b><span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-black">{group.items.length}</span></div><div className="divide-y divide-slate-100">{group.items.map(item=><article key={item.date} className="p-4"><div className="flex items-start justify-between gap-3"><b className="text-sm">{fmt(item.date)}</b><span className={`rounded-full px-2 py-1 text-[10px] font-black ${archiveAction==="visits"?"bg-teal-100 text-teal-800":"bg-amber-100 text-amber-800"}`}>{archiveAction==="visits"?"Besuch":"Thema"}</span></div>{archiveAction==="visits"&&<p className="mt-1 text-sm font-bold text-teal-800">Besucht: {extractVisited(item.content)||"nicht angegeben"}</p>}{archiveAction==="themes"&&<p className="mt-1 text-sm font-bold text-amber-800">{extractThemeContent(item.content)}</p>}<p className="mt-1 text-sm text-slate-600">{item.content}</p>{item.responsible&&<p className="mt-2 text-xs text-slate-500">Verantwortlich: <b>{item.responsible}</b></p>}</article>)}</div></section>):<p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Für diesen Filter wurden keine Einträge gefunden.</p>}</div></section>}<section className="grid gap-3">{eventSchoolYearGroups.map(group=>{const isOpen=openEventSchoolYear===group.year;const isCurrent=group.year===currentSchoolYear;return <section key={group.year} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><button type="button" onClick={()=>setOpenEventSchoolYear(isOpen?null:group.year)} className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-left ${isCurrent?"bg-blue-700 text-white":"bg-slate-100 text-slate-800"}`}><div><div className="text-[10px] font-black uppercase tracking-widest opacity-70">Schuljahr</div><div className="text-lg font-black">{group.year}{isCurrent?" · aktuell":""}</div></div><div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-black ${isCurrent?"bg-white/20":"bg-white"}`}>{group.items.length}</span><ChevronRight size={18} className={`transition-transform ${isOpen?"rotate-90":""}`}/></div></button>{isOpen&&<div className="grid gap-3 bg-[#f3f6fb] p-3">{group.items.map(e=>{const plan=scheduleFor(e.date);const normalizedContent=plan.content.trim().toLowerCase();const isTheme=isThemeContent(plan.content);const isVisit=isVisitContent(plan.content);const isCancellation=e.cancelled||/(ferien|ausfall|passahmontag|pfingstmontag)/i.test(plan.content);const noteOpen=e.date===nextEvent.date||!!eventNotesOpen[e.date];return <div id={`event-${e.date}`} key={e.date} className="relative overflow-hidden rounded-3xl bg-red-600"><div className="absolute inset-y-0 right-0 grid w-24 place-items-center text-white"><Trash2 size={22}/></div><article onTouchStart={event=>handleTouchStart(event,e.date)} onTouchMove={event=>handleTouchMove(event,e.date)} onTouchEnd={event=>handleTouchEnd(event,e.date)} style={{transform:`translate3d(${swipeOffsets[e.date]||0}px,0,0)`,touchAction:"pan-y"}} className={`relative z-10 scroll-mt-4 rounded-3xl p-3 shadow-sm transition-[transform] duration-75 ${isTheme?"border-2 border-amber-500 bg-amber-50 ring-2 ring-amber-200":e.date===nextEvent.date?"border-2 border-blue-500 bg-blue-50":isVisit?"border-2 border-teal-400 bg-teal-50":"bg-white"}`}><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><b>{fmt(e.date)}</b>{e.date===nextEvent.date&&<span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">Nächster Termin</span>}{isTheme&&<span className="rounded-full bg-amber-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950">Thema / Themenreihe</span>}</div><p className={`mt-1 text-xs font-bold ${isCancellation?"italic text-red-600":attendance[e.date]?"text-emerald-700":"text-slate-500"}`}>{confirmedAttendance.includes(e.date)?`${(attendance[e.date]||[]).length} anwesend`:isCancellation?"Ausfall / Ferien":"noch nicht quittiert"}</p></div><button type="button" onClick={()=>{setDate(e.date);attendanceInitialized.current=true;navigateTo("attendance")}} className="flex shrink-0 items-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition duration-300 hover:bg-blue-100 active:scale-95">Anwesenheit<ChevronRight size={15}/></button></div><label className={`mt-4 block rounded-2xl p-3 transition duration-300 ${isVisit?"border border-teal-300 bg-teal-50 shadow-sm":isTheme?"border border-amber-300 bg-amber-50 shadow-sm":""}`}><span className={`mb-1 block text-[10px] font-black uppercase tracking-wider ${isVisit?"text-teal-700":isTheme?"text-amber-700":"text-slate-500"}`}>{isVisit?"Alten- und Krankenbesuch":isTheme?"Thema / Themenreihe":"Inhalt"}</span><textarea rows="1" ref={autoGrow} value={plan.content} onInput={event=>autoGrow(event.currentTarget)} onChange={event=>{updateSchedule(e.date,"content",event.target.value);autoGrow(event.currentTarget)}} placeholder="Inhalt eintragen" className={`w-full resize-none rounded-xl border p-3 text-base outline-none focus:border-blue-400 sm:text-sm ${isCancellation?"italic":""} ${isVisit?"border-teal-200 bg-white font-bold text-teal-950":isTheme?"border-amber-200 bg-white font-bold text-amber-950":"border-slate-200 bg-slate-50 focus:bg-white"}`}/></label><section className={`mt-3 rounded-2xl border p-3 ${nextEventNoteDone[e.date]?"border-emerald-200 bg-emerald-50":"border-blue-100 bg-blue-50/60"}`}><div className="flex items-center justify-between gap-3"><button type="button" onClick={()=>{if(e.date!==nextEvent.date)setEventNotesOpen(old=>({...old,[e.date]:!old[e.date]}));}} className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left"><span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-blue-700"><Mail size={14}/>Notiz</span><ChevronRight size={16} className={`shrink-0 text-blue-600 transition-transform ${noteOpen?"rotate-90":""}`}/></button><button type="button" onClick={()=>setNextEventNoteDone(old=>({...old,[e.date]:!old[e.date]}))} className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${nextEventNoteDone[e.date]?"bg-emerald-600 text-white":"bg-white text-slate-500 ring-1 ring-slate-200"}`}><span className={`grid h-4 w-4 place-items-center rounded ${nextEventNoteDone[e.date]?"bg-white/20":"border border-slate-300"}`}>{nextEventNoteDone[e.date]&&<Check size={12}/>}</span>{nextEventNoteDone[e.date]?"Erledigt":"Offen"}</button></div>{noteOpen&&<textarea id={`note-${e.date}`} rows="2" ref={autoGrow} value={nextEventNotes[e.date]||""} onInput={event=>autoGrow(event.currentTarget)} onChange={event=>{setNextEventNotes(old=>({...old,[e.date]:event.target.value}));autoGrow(event.currentTarget)}} placeholder="Notizen zu diesem Termin" className="mt-2 w-full resize-none rounded-xl border border-blue-100 bg-white p-3 text-base font-semibold text-slate-900 outline-none focus:border-blue-400 sm:text-sm"/>}</section><label className="mt-3 block"><span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Verantwortlich</span><input value={plan.responsible} onChange={event=>updateSchedule(e.date,"responsible",event.target.value)} placeholder="Verantwortliche Person eintragen" className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-base outline-none focus:border-blue-400 focus:bg-white sm:text-sm"/></label></article></div>})}</div>}</section>})}</section></>}

      {view==="overview"&&<><div><h2 className="text-2xl font-black">Gesamtübersicht</h2><div className="mt-1 flex items-baseline gap-2"><span className="text-sm font-bold text-slate-500">Aktuelles Schuljahr</span><span className="text-2xl font-black text-blue-700">{currentSchoolYear}</span></div><p className="mt-1 text-xs text-slate-400">ab {shortDate(overviewStartDate)} · horizontal wischen</p></div><section className="rounded-2xl border border-slate-200 bg-white p-3"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-slate-500">Export</span><div className="flex gap-2"><button type="button" onClick={exportExcelReport} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 active:bg-slate-100"><Download size={14}/>Excel</button><button type="button" onClick={exportPdfReport} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 active:bg-slate-100"><Download size={14}/>PDF</button></div></div><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={()=>setReportScope("window")} className={`rounded-xl px-2 py-1.5 text-[11px] font-bold ${reportScope==="window"?"bg-blue-600 text-white":"bg-slate-100 text-slate-600"}`}>2 Wochen + 6 Wochen</button><button type="button" onClick={()=>setReportScope("schoolYear")} className={`rounded-xl px-2 py-1.5 text-[11px] font-bold ${reportScope==="schoolYear"?"bg-blue-600 text-white":"bg-slate-100 text-slate-600"}`}>Schuljahr</button></div></section><section className="overflow-hidden rounded-3xl bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-max border-collapse text-xs"><thead><tr className="bg-slate-900 text-white"><th className="sticky left-0 z-20 w-10 border-r border-slate-700 bg-slate-900 px-2 py-3">Nr.</th><th className="sticky left-10 z-20 min-w-40 border-r border-slate-700 bg-slate-900 px-3 py-3 text-left">Name</th>{overviewEvents.map(e=><th key={e.date} className={`min-w-16 border-r border-slate-700 px-2 py-2 ${e.cancelled?"bg-red-800":""}`}><span className="block">{shortDate(e.date)}</span><span className="text-[10px] font-normal opacity-70">{e.cancelled?"Ausfall":fmt(e.date).slice(0,2)}</span></th>)}</tr></thead><tbody>{overviewPeople.map((p,index)=><tr key={p.id} className={index%2?"bg-slate-50":"bg-white"}><td className={`sticky left-0 z-10 border-b border-r px-2 py-2 text-center font-bold ${index%2?"bg-slate-50":"bg-white"}`}>{index+1}</td><td className={`sticky left-10 z-10 border-b border-r px-3 py-2 font-semibold ${index%2?"bg-slate-50":"bg-white"}`}>{p.last}, {p.first}</td>{overviewEvents.map(e=>{const checked=(attendance[e.date]||[]).includes(p.id);return <td key={e.date} className={`border-b border-r px-2 py-2 text-center ${e.cancelled?"bg-red-50":""}`}>{e.cancelled?"–":checked?<span className="inline-grid h-6 w-6 place-items-center rounded-md bg-emerald-600 font-black text-white">X</span>:<span className="text-slate-300">·</span>}</td>})}</tr>)}</tbody><tfoot><tr className="bg-blue-50 font-black"><td className="sticky left-0 bg-blue-50"></td><td className="sticky left-10 border-r bg-blue-50 px-3 py-3">Anwesend</td>{overviewEvents.map(e=><td key={e.date} className="border-r px-2 py-3 text-center">{e.cancelled?"–":(attendance[e.date]||[]).length}</td>)}</tr></tfoot></table></div></section><div className="rounded-2xl bg-blue-50 p-3 text-xs text-blue-800"><b>Screenshot-Tipp:</b> Handy quer halten und zum gewünschten Zeitraum wischen.</div></>}
    </main>

    <button type="button" aria-label="Nach oben scrollen" onClick={scrollToTop} className={`fixed bottom-32 right-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-white shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-blue-700 active:scale-90 ${showScrollTop?"translate-y-0 opacity-100":"pointer-events-none translate-y-5 opacity-0"}`}><ArrowUp size={22}/></button>

    <nav className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+2px)] z-40 rounded-3xl border bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl"><div className="mx-auto grid max-w-5xl grid-cols-5 items-end px-2">{nav.map(([id,label,Icon])=>{const isHome=id==="home",active=view===id;return <button key={id} onClick={()=>{if(id==="home"){attendanceInitialized.current=false;navigateTo(id,{resetAll:true});return;}if(id==="attendance"&&!attendanceInitialized.current){setDate(nextEvent.date);attendanceInitialized.current=true;}navigateTo(id)}} className={`relative flex flex-col items-center gap-1 text-[10px] ${isHome?"-mt-5 pb-3":"py-3"} ${active?"font-black text-blue-700":"text-slate-500"}`}>{isHome?<span className={`grid h-14 w-14 place-items-center rounded-full border-4 border-white shadow-lg ${active?"bg-blue-600":"bg-slate-900"} text-white`}><Icon size={25}/></span>:<Icon size={20}/>}<span className={isHome?"font-black":""}>{label}</span></button>})}</div></nav>
    {showPastAttendanceConfirm&&<div className="fixed inset-0 z-[70] flex items-end bg-slate-950/55 p-3 backdrop-blur-sm sm:items-center sm:justify-center"><div className="w-full rounded-[28px] bg-white p-5 shadow-2xl sm:max-w-md"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-100 text-amber-700"><AlertTriangle/></div><div><p className="text-xs font-black uppercase tracking-wider text-amber-700">Vergangener Termin</p><h3 className="text-xl font-black">Anwesenheit bearbeiten?</h3></div></div><p className="mt-4 text-sm leading-relaxed text-slate-600">Du möchtest die Anwesenheit vom <b>{fmt(date)}</b> nachträglich ändern. Für die aktuelle App-Sitzung wird die Bearbeitung vergangener Termine danach freigegeben.</p><div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={cancelPastAttendanceEdit} className="rounded-2xl bg-slate-100 py-3 font-black text-slate-700">Abbrechen</button><button type="button" onClick={confirmPastAttendanceEdit} className="rounded-2xl bg-amber-500 py-3 font-black text-slate-950">Freigeben</button></div></div></div>}
    {adding&&<AddPerson draft={draft} setDraft={setDraft} onSave={saveNew} onClose={()=>setAdding(false)}/>} 
    {addingEvent&&<AddEvent draft={eventDraft} setDraft={setEventDraft} onSave={saveNewEvent} onClose={()=>setAddingEvent(false)}/>} 
  </div>;
}
