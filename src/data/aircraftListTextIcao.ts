export interface AircraftListTextIcao {
  text: string;
  icao: string;
}

/**
 * Allows to map a Text Model name (as used by FSE) to an ICAO designator (used for e.g. Simbrief)
 * Source table: https://en.wikipedia.org/wiki/List_of_aircraft_type_designators
 * Note: do not make overrides in this list. Use 'aircraftListTextIcaoOverrides' for that.
 */
export const aircraftListTextIcao: AircraftListTextIcao[] = [
  {
    text: 'Antonov An-124 Ruslan',
    icao: 'A124',
  },
  {
    text: 'Antonov An-140',
    icao: 'A140',
  },
  {
    text: 'Antonov An-148',
    icao: 'A148',
  },
  {
    text: 'Antonov An-158',
    icao: 'A158',
  },
  {
    text: 'Airbus A319neo',
    icao: 'A19N',
  },
  {
    text: 'Airbus A320neo',
    icao: 'A20N',
  },
  {
    text: 'Airbus A321neo',
    icao: 'A21N',
  },
  {
    text: 'Antonov An-225 Mriya',
    icao: 'A225',
  },
  {
    text: 'Airbus A300-600',
    icao: 'A306',
  },
  {
    text: 'Airbus A300-600 Freighter[4]',
    icao: 'A306',
  },
  {
    text: 'Airbus A300B2, A300B4, and A300C4',
    icao: 'A30B',
  },
  {
    text: 'Airbus A310-200',
    icao: 'A310',
  },
  {
    text: 'Airbus A310-300',
    icao: 'A310',
  },
  {
    text: 'Airbus A318',
    icao: 'A318',
  },
  {
    text: 'Airbus A318 (sharklets)',
    icao: 'A318',
  },
  {
    text: 'Airbus A319',
    icao: 'A319',
  },
  {
    text: 'Airbus A319 (sharklets)',
    icao: 'A319',
  },
  {
    text: 'Airbus A320',
    icao: 'A320',
  },
  {
    text: 'Airbus A320 (sharklets)',
    icao: 'A320',
  },
  {
    text: 'Airbus A321',
    icao: 'A321',
  },
  {
    text: 'Airbus A321 (sharklets)',
    icao: 'A321',
  },
  {
    text: 'Airbus A330-200',
    icao: 'A332',
  },
  {
    text: 'Airbus A330-300',
    icao: 'A333',
  },
  {
    text: 'Airbus A330-200 Freighter',
    icao: 'A332',
  },
  {
    text: 'Airbus A330-300 Freighter',
    icao: 'A333',
  },
  {
    text: 'Airbus A330-700 "BelugaXL"',
    icao: 'A337',
  },
  {
    text: 'Airbus A330-800',
    icao: 'A338',
  },
  {
    text: 'Airbus A330-900',
    icao: 'A339',
  },
  {
    text: 'Airbus A340-200',
    icao: 'A342',
  },
  {
    text: 'Airbus A340-300',
    icao: 'A343',
  },
  {
    text: 'Airbus A340-500',
    icao: 'A345',
  },
  {
    text: 'Airbus A340-600',
    icao: 'A346',
  },
  {
    text: 'Airbus A350-900',
    icao: 'A359',
  },
  {
    text: 'Airbus A350-1000',
    icao: 'A35K',
  },
  {
    text: 'Airbus A380-800',
    icao: 'A388',
  },
  {
    text: 'Airbus A300-600ST "Super Transporter" / "Beluga"',
    icao: 'A3ST',
  },
  {
    text: 'Airbus A400M Atlas',
    icao: 'A400',
  },
  {
    text: 'Hawker Siddeley HS 748',
    icao: 'A748',
  },
  {
    text: 'Gulfstream/Rockwell (Aero) Commander 680',
    icao: 'AC68',
  },
  {
    text: 'Gulfstream/Rockwell (Aero) Turbo Commander 690',
    icao: 'AC90',
  },
  {
    text: 'COMAC ARJ21',
    icao: 'AJ27',
  },
  {
    text: 'Antonov An-12',
    icao: 'AN12',
  },
  {
    text: 'Antonov An-24',
    icao: 'AN24',
  },
  {
    text: 'Antonov An-26',
    icao: 'AN26',
  },
  {
    text: 'Antonov An-28',
    icao: 'AN28',
  },
  {
    text: 'Antonov An-30',
    icao: 'AN30',
  },
  {
    text: 'Antonov An-32',
    icao: 'AN32',
  },
  {
    text: 'Antonov An-72 / An-74',
    icao: 'AN72',
  },
  {
    text: 'Eurocopter AS332 Super Puma',
    icao: 'AS32',
  },
  {
    text: 'Eurocopter AS350 Écureuil / AS550 Fennec',
    icao: 'AS50',
  },
  {
    text: 'Aerospatiale/Alenia ATR 42-300 / 320',
    icao: 'AT43',
  },
  {
    text: 'Aerospatiale/Alenia ATR 42-500',
    icao: 'AT45',
  },
  {
    text: 'Aerospatiale/Alenia ATR 42-600',
    icao: 'AT46',
  },
  {
    text: 'Aerospatiale/Alenia ATR 72-201/-202',
    icao: 'AT72',
  },
  {
    text: 'Aerospatiale/Alenia ATR 72-211/-212',
    icao: 'AT73',
  },
  {
    text: 'Aerospatiale/Alenia ATR 72-212A (500)',
    icao: 'AT75',
  },
  {
    text: 'Aerospatiale/Alenia ATR 72-212A (600)',
    icao: 'AT76',
  },
  {
    text: 'British Aerospace ATP',
    icao: 'ATP',
  },
  {
    text: 'Bell 206 JetRanger',
    icao: 'B06',
  },
  {
    text: 'Bell 206 TwinRanger',
    icao: 'B06T',
  },
  {
    text: 'Eurocopter (MBB) Bo.105',
    icao: 'B105',
  },
  {
    text: 'Beechcraft 1900',
    icao: 'B190',
  },
  {
    text: 'Bell 212',
    icao: 'B212',
  },
  {
    text: 'Boeing 737 MAX 7',
    icao: 'B37M',
  },
  {
    text: 'Boeing 737 MAX 8',
    icao: 'B38M',
  },
  {
    text: 'Boeing 737 MAX 9',
    icao: 'B39M',
  },
  {
    text: 'Boeing 737 MAX 10',
    icao: 'B3XM',
  },
  {
    text: 'Bell 412',
    icao: 'B412',
  },
  {
    text: 'Bell 429',
    icao: 'B429',
  },
  {
    text: 'BAe 146-100 / Avro RJ70',
    icao: 'B461',
  },
  {
    text: 'BAe 146-200 / Avro RJ85',
    icao: 'B462',
  },
  {
    text: 'BAe 146-300 / Avro RJ100',
    icao: 'B463',
  },
  {
    text: 'Boeing B-52 Stratofortress',
    icao: 'B52',
  },
  {
    text: 'Boeing 707',
    icao: 'B703',
  },
  {
    text: 'Boeing 717',
    icao: 'B712',
  },
  {
    text: 'Boeing 720B',
    icao: 'B720',
  },
  {
    text: 'Boeing 727-100',
    icao: 'B721',
  },
  {
    text: 'Boeing 727-200',
    icao: 'B722',
  },
  {
    text: 'Boeing 737-200',
    icao: 'B732',
  },
  {
    text: 'Boeing 737-200 Freighter',
    icao: 'B732',
  },
  {
    text: 'Boeing 737-300',
    icao: 'B733',
  },
  {
    text: 'Boeing 737-300 Winglets',
    icao: 'B733',
  },
  {
    text: 'Boeing 737-300 Freighter',
    icao: 'B733',
  },
  {
    text: 'Boeing 737-400',
    icao: 'B734',
  },
  {
    text: 'Boeing 737-400 Freighter',
    icao: 'B734',
  },
  {
    text: 'Boeing 737-500',
    icao: 'B735',
  },
  {
    text: 'Boeing 737-500 Winglets',
    icao: 'B735',
  },
  {
    text: 'Boeing 737-600',
    icao: 'B736',
  },
  {
    text: 'Boeing 737-800',
    icao: 'B738',
  },
  {
    text: 'Boeing 737-900 / Boeing 737-900ER',
    icao: 'B739',
  },
  {
    text: 'Boeing 737-700 / Boeing 737-700ER',
    icao: 'B737',
  },
  {
    text: 'Boeing 737-700 Winglets',
    icao: 'B737',
  },
  {
    text: 'Boeing 737-800 Winglets',
    icao: 'B738',
  },
  {
    text: 'Boeing 737-800 Freighter Winglets',
    icao: 'B738',
  },
  {
    text: 'Boeing 737-800 Freighter',
    icao: 'B738',
  },
  {
    text: 'Boeing 737-900 Winglets',
    icao: 'B739',
  },
  {
    text: 'Boeing 747-100',
    icao: 'B741',
  },
  {
    text: 'Boeing 747-100 Freighter',
    icao: 'B741',
  },
  {
    text: 'Boeing 747-200',
    icao: 'B742',
  },
  {
    text: 'Boeing 747-200M',
    icao: 'B742',
  },
  {
    text: 'Boeing 747-200F',
    icao: 'B742',
  },
  {
    text: 'Boeing 747-300',
    icao: 'B743',
  },
  {
    text: 'Boeing 747-300M',
    icao: 'B743',
  },
  {
    text: 'Boeing 747-400 / Boeing 747-400ER',
    icao: 'B744',
  },
  {
    text: 'Boeing 747-400M',
    icao: 'B744',
  },
  {
    text: 'Boeing 747-400F / Boeing 747-400ERF',
    icao: 'B744',
  },
  {
    text: 'Boeing 747-8I',
    icao: 'B748',
  },
  {
    text: 'Boeing 747-8F',
    icao: 'B748',
  },
  {
    text: 'Boeing 747SR',
    icao: 'B74R',
  },
  {
    text: 'Boeing 747SR Freighter',
    icao: 'B74R',
  },
  {
    text: 'Boeing 747SP',
    icao: 'B74S',
  },
  {
    text: 'Boeing 757-200',
    icao: 'B752',
  },
  {
    text: 'Boeing 757F',
    icao: 'B752',
  },
  {
    text: 'Boeing 757-300',
    icao: 'B753',
  },
  {
    text: 'Boeing 767-200 / Boeing 767-200ER',
    icao: 'B762',
  },
  {
    text: 'Boeing 767-200 Freighter / Boeing 767-200ER',
    icao: 'B762',
  },
  {
    text: 'Boeing 767-300',
    icao: 'B763',
  },
  {
    text: 'Boeing 767-300 Winglets / Boeing 767-300ER',
    icao: 'B763',
  },
  {
    text: 'Boeing 767-300 Freighter',
    icao: 'B763',
  },
  {
    text: 'Boeing 767-400ER',
    icao: 'B764',
  },
  {
    text: 'Boeing 777-200 / Boeing 777-200ER',
    icao: 'B772',
  },
  {
    text: 'Boeing 777-300',
    icao: 'B773',
  },
  {
    text: 'Boeing 777-8',
    icao: 'B778',
  },
  {
    text: 'Boeing 777-9',
    icao: 'B779',
  },
  {
    text: 'Boeing 777-200 Freighter',
    icao: 'B77L',
  },
  {
    text: 'Boeing 777-200LR',
    icao: 'B77L',
  },
  {
    text: 'Boeing 777-300ER',
    icao: 'B77W',
  },
  {
    text: 'Boeing 787-8',
    icao: 'B788',
  },
  {
    text: 'Boeing 787-9',
    icao: 'B789',
  },
  {
    text: 'Boeing 787-10',
    icao: 'B78X',
  },
  {
    text: 'British Aerospace (BAC) One Eleven',
    icao: 'BA11',
  },
  {
    text: 'Airbus A220-100',
    icao: 'BCS1',
  },
  {
    text: 'Airbus A220-300',
    icao: 'BCS3',
  },
  {
    text: 'Beechcraft (Super) King Air 200',
    icao: 'BE20',
  },
  {
    text: 'Hawker 400',
    icao: 'BE40',
  },
  {
    text: 'Beechcraft 55 Baron',
    icao: 'BE55',
  },
  {
    text: 'Beechcraft 58 Baron',
    icao: 'BE58',
  },
  {
    text: 'Beechcraft Model 76 Duchess',
    icao: 'BE76',
  },
  {
    text: 'Beechcraft Model 99',
    icao: 'BE99',
  },
  {
    text: 'Shorts SC-5 Belfast',
    icao: 'BELF',
  },
  {
    text: 'Beriev Be-200 Altair',
    icao: 'BER2',
  },
  {
    text: 'Boeing 747 LCF Dreamlifter',
    icao: 'BLCF',
  },
  {
    text: 'Pilatus Britten-Norman BN-2A/B Islander',
    icao: 'BN2P',
  },
  {
    text: 'Lockheed L-182 / 282 / 382 (L-100) Hercules',
    icao: 'C130',
  },
  {
    text: 'Cessna 208 Caravan',
    icao: 'C208',
  },
  {
    text: 'CASA / IPTN 212 Aviocar',
    icao: 'C212',
  },
  {
    text: 'Cessna Citation CJ2',
    icao: 'C25A',
  },
  {
    text: 'Cessna Citation CJ3',
    icao: 'C25B',
  },
  {
    text: 'Cessna Citation CJ4',
    icao: 'C25C',
  },
  {
    text: 'Lockheed Martin C-130J Hercules',
    icao: 'C30J',
  },
  {
    text: 'Cessna 310',
    icao: 'C310',
  },
  {
    text: 'Curtiss C-46 Commando',
    icao: 'C46',
  },
  {
    text: 'Lockheed C-5M Super Galaxy',
    icao: 'C5M',
  },
  {
    text: 'Cessna Citation I',
    icao: 'C500',
  },
  {
    text: 'Cessna Citation Mustang',
    icao: 'C510',
  },
  {
    text: 'Cessna CitationJet',
    icao: 'C525',
  },
  {
    text: 'Cessna Citation II',
    icao: 'C550',
  },
  {
    text: 'Cessna Citation V',
    icao: 'C560',
  },
  {
    text: 'Cessna Citation Excel',
    icao: 'C56X',
  },
  {
    text: 'Cessna Citation III, VI, VII',
    icao: 'C650',
  },
  {
    text: 'Cessna Citation Sovereign',
    icao: 'C680',
  },
  {
    text: 'Cessna Citation Longitude',
    icao: 'C700',
  },
  {
    text: 'Cessna Citation X',
    icao: 'C750',
  },
  {
    text: 'COMAC C919',
    icao: 'C919',
  },
  {
    text: 'Bombardier 415',
    icao: 'CL2T',
  },
  {
    text: 'Bombardier BD-100 Challenger 300',
    icao: 'CL30',
  },
  {
    text: 'Canadair Challenger 600',
    icao: 'CL60',
  },
  {
    text: 'CASA/IPTN CN-235',
    icao: 'CN35',
  },
  {
    text: 'Lockheed L-1049 Super Constellation',
    icao: 'CONI',
  },
  {
    text: 'Canadair Regional Jet 100',
    icao: 'CRJ1',
  },
  {
    text: 'Canadair Regional Jet 200',
    icao: 'CRJ2',
  },
  {
    text: 'Canadair Regional Jet 700 | Regional Jet 550',
    icao: 'CRJ7',
  },
  {
    text: 'Canadair Regional Jet 900',
    icao: 'CRJ9',
  },
  {
    text: 'Canadair Regional Jet 1000',
    icao: 'CRJX',
  },
  {
    text: 'Convair CV-240 & -440',
    icao: 'CVLP',
  },
  {
    text: 'Convair CV-580, Convair CV-600, Convair CV-640',
    icao: 'CVLT',
  },
  {
    text: 'Dornier 228',
    icao: 'D228',
  },
  {
    text: 'Fairchild Dornier Do.328',
    icao: 'D328',
  },
  {
    text: 'Diamond DA42',
    icao: 'DA42',
  },
  {
    text: 'Diamond DA62',
    icao: 'DA62',
  },
  {
    text: 'Douglas DC-10-10 / -15 Passenger',
    icao: 'DC10',
  },
  {
    text: 'Douglas DC-10-30 / -40 Passenger',
    icao: 'DC10',
  },
  {
    text: 'Douglas DC-10-30 Combi',
    icao: 'DC10',
  },
  {
    text: 'Douglas DC-10-10 Freighter',
    icao: 'DC10',
  },
  {
    text: 'Douglas DC-10-30 / -40 Freighter',
    icao: 'DC10',
  },
  {
    text: 'Douglas DC-3',
    icao: 'DC3',
  },
  {
    text: 'Douglas DC-6',
    icao: 'DC6',
  },
  {
    text: 'Douglas DC-8-50',
    icao: 'DC85',
  },
  {
    text: 'Douglas DC-8-62',
    icao: 'DC86',
  },
  {
    text: 'Douglas DC-8-72',
    icao: 'DC87',
  },
  {
    text: 'Douglas DC-9-10',
    icao: 'DC91',
  },
  {
    text: 'Douglas DC-9-20',
    icao: 'DC92',
  },
  {
    text: 'Douglas DC-9-30',
    icao: 'DC93',
  },
  {
    text: 'Douglas DC-9-40',
    icao: 'DC94',
  },
  {
    text: 'Douglas DC-9-50',
    icao: 'DC95',
  },
  {
    text: 'De Havilland Canada DHC-2 Turbo-Beaver',
    icao: 'DH2T',
  },
  {
    text: 'De Havilland Canada DHC-8-100 Dash 8 / 8Q',
    icao: 'DH8A',
  },
  {
    text: 'De Havilland Canada DHC-8-200 Dash 8 / 8Q',
    icao: 'DH8B',
  },
  {
    text: 'De Havilland Canada DHC-8-300 Dash 8 / 8Q',
    icao: 'DH8C',
  },
  {
    text: 'De Havilland Canada DHC-8-400 Dash 8Q',
    icao: 'DH8D',
  },
  {
    text: 'De Havilland Canada DHC-4 Caribou',
    icao: 'DHC4',
  },
  {
    text: 'De Havilland Canada DHC-5 Buffalo',
    icao: 'DHC5',
  },
  {
    text: 'De Havilland Canada DHC-6 Twin Otter',
    icao: 'DHC6',
  },
  {
    text: 'De Havilland Canada DHC-7 Dash 7',
    icao: 'DHC7',
  },
  {
    text: 'De Havilland DH.104 Dove',
    icao: 'DOVE',
  },
  {
    text: 'Embraer EMB 110 Bandeirante',
    icao: 'E110',
  },
  {
    text: 'Embraer EMB 120 Brasilia',
    icao: 'E120',
  },
  {
    text: 'Embraer RJ135',
    icao: 'E135',
  },
  {
    text: 'Embraer RJ140',
    icao: 'E135',
  },
  {
    text: 'Embraer RJ145',
    icao: 'E145',
  },
  {
    text: 'Embraer 170',
    icao: 'E170',
  },
  {
    text: 'Embraer 190 / Lineage 1000',
    icao: 'E190',
  },
  {
    text: 'Embraer 195',
    icao: 'E195',
  },
  {
    text: 'Embraer E190-E2',
    icao: 'E290',
  },
  {
    text: 'Embraer E195-E2',
    icao: 'E295',
  },
  {
    text: 'Embraer Legacy 600 / Legacy 650',
    icao: 'E35L',
  },
  {
    text: 'Embraer Phenom 100',
    icao: 'E50P',
  },
  {
    text: 'Embraer Legacy 450 / Praetor 500',
    icao: 'E545',
  },
  {
    text: 'Embraer Legacy 500 / Praetor 600',
    icao: 'E550',
  },
  {
    text: 'Embraer Phenom 300',
    icao: 'E55P',
  },
  {
    text: 'Embraer 175 (long wing)',
    icao: 'E75L',
  },
  {
    text: 'Embraer 175 (short wing)',
    icao: 'E75S',
  },
  {
    text: 'Eclipse 500',
    icao: 'EA50',
  },
  {
    text: 'Eurocopter EC120 Colibri / Harbin HC120',
    icao: 'EC20',
  },
  {
    text: 'Eurocopter EC225 Super Puma',
    icao: 'EC25',
  },
  {
    text: 'Eurocopter EC130',
    icao: 'EC30',
  },
  {
    text: 'Eurocopter EC135 / EC635',
    icao: 'EC35',
  },
  {
    text: 'Eurocopter EC145',
    icao: 'EC45',
  },
  {
    text: 'Eurocopter EC155',
    icao: 'EC55',
  },
  {
    text: 'Eurocopter EC175',
    icao: 'EC75',
  },
  {
    text: 'MD Helicopters MD900 Explorer',
    icao: 'EXPL',
  },
  {
    text: 'Fokker 100',
    icao: 'F100',
  },
  {
    text: 'Fokker F27 Friendship',
    icao: 'F27',
  },
  {
    text: 'Fokker F28 Fellowship',
    icao: 'F28',
  },
  {
    text: 'Dassault Falcon 2000',
    icao: 'F2TH',
  },
  {
    text: 'Reims-Cessna F406 Caravan II',
    icao: 'F406',
  },
  {
    text: 'Fokker 50',
    icao: 'F50',
  },
  {
    text: 'Fokker 70',
    icao: 'F70',
  },
  {
    text: 'Dassault Falcon 900',
    icao: 'F900',
  },
  {
    text: 'Dassault Falcon 50',
    icao: 'FA50',
  },
  {
    text: 'Dassault Falcon 7X',
    icao: 'FA7X',
  },
  {
    text: 'Gulfstream Aerospace G-159 Gulfstream I',
    icao: 'G159',
  },
  {
    text: 'Grumman G-21 Goose',
    icao: 'G21',
  },
  {
    text: 'Gulfstream G280',
    icao: 'G280',
  },
  {
    text: 'Grumman G-73 Turbo Mallard',
    icao: 'G73T',
  },
  {
    text: 'Bombardier BD-700 Global 5000',
    icao: 'GL5T',
  },
  {
    text: 'Bombardier Global Express / Raytheon Sentinel',
    icao: 'GLEX',
  },
  {
    text: 'Gulfstream IV',
    icao: 'GLF4',
  },
  {
    text: 'Gulfstream V',
    icao: 'GLF5',
  },
  {
    text: 'Gulfstream G650',
    icao: 'GLF6',
  },
  {
    text: 'British Aerospace 125 series / Hawker/Raytheon 700/800/800XP/850/900',
    icao: 'H25B',
  },
  {
    text: 'British Aerospace 125-1000 series / Hawker/Raytheon 1000',
    icao: 'H25C',
  },
  {
    text: 'Honda HA-420',
    icao: 'HDJT',
  },
  {
    text: 'De Havilland DH.114 Heron',
    icao: 'HERN',
  },
  {
    text: 'Ilyushin Il-114',
    icao: 'I114',
  },
  {
    text: 'Ilyushin Il-18',
    icao: 'IL18',
  },
  {
    text: 'Ilyushin Il-62',
    icao: 'IL62',
  },
  {
    text: 'Ilyushin Il-76',
    icao: 'IL76',
  },
  {
    text: 'Ilyushin Il-86',
    icao: 'IL86',
  },
  {
    text: 'Ilyushin Il-96',
    icao: 'IL96',
  },
  {
    text: 'Fairchild Dornier 328JET',
    icao: 'J328',
  },
  {
    text: 'British Aerospace Jetstream 31',
    icao: 'JS31',
  },
  {
    text: 'British Aerospace Jetstream 32',
    icao: 'JS32',
  },
  {
    text: 'British Aerospace Jetstream 41',
    icao: 'JS41',
  },
  {
    text: 'Junkers Ju 52/3M',
    icao: 'JU52',
  },
  {
    text: 'Boeing KC-135 Stratotanker',
    icao: 'K35R',
  },
  {
    text: 'Lockheed L-1011 Tristar',
    icao: 'L101',
  },
  {
    text: 'Lockheed L-188 Electra',
    icao: 'L188',
  },
  {
    text: 'LET 410',
    icao: 'L410',
  },
  {
    text: 'Learjet 35 / 36 / C-21A',
    icao: 'LJ35',
  },
  {
    text: 'Learjet 60',
    icao: 'LJ60',
  },
  {
    text: 'McDonnell Douglas MD-11',
    icao: 'MD11',
  },
  {
    text: 'McDonnell Douglas MD-11F',
    icao: 'MD11',
  },
  {
    text: 'McDonnell Douglas MD-11C',
    icao: 'MD11',
  },
  {
    text: 'McDonnell Douglas MD-81',
    icao: 'MD81',
  },
  {
    text: 'McDonnell Douglas MD-82',
    icao: 'MD82',
  },
  {
    text: 'McDonnell Douglas MD-83',
    icao: 'MD83',
  },
  {
    text: 'McDonnell Douglas MD-87',
    icao: 'MD87',
  },
  {
    text: 'McDonnell Douglas MD-88',
    icao: 'MD88',
  },
  {
    text: 'McDonnell Douglas MD-90',
    icao: 'MD90',
  },
  {
    text: 'Mil Mi-24 / Mi-25 / Mi-35',
    icao: 'MI24',
  },
  {
    text: 'MIL Mi-8 / Mi-17 / Mi-171 / Mil-172',
    icao: 'MI8',
  },
  {
    text: 'Mitsubishi Mu-2',
    icao: 'MU2',
  },
  {
    text: 'Aerospatiale (Nord) 262',
    icao: 'N262',
  },
  {
    text: 'Government Aircraft Factories N22B / N24A Nomad',
    icao: 'NOMA',
  },
  {
    text: 'Tecnam P2006T',
    icao: 'P06T',
  },
  {
    text: 'Boeing P-8 Poseidon',
    icao: 'P8',
  },
  {
    text: 'Piaggio P.180 Avanti',
    icao: 'P180',
  },
  {
    text: 'Tecnam P2012 Traveller',
    icao: 'P212',
  },
  {
    text: 'Partenavia P.68',
    icao: 'P68',
  },
  {
    text: 'Piper PA-31 Navajo',
    icao: 'PA31',
  },
  {
    text: 'Piper PA-34 Seneca',
    icao: 'PA34',
  },
  {
    text: 'Piper PA-44 Seminole',
    icao: 'PA44',
  },
  {
    text: 'Pilatus PC-12',
    icao: 'PC12',
  },
  {
    text: 'Pilatus PC-6 Turbo Porter',
    icao: 'PC6T',
  },
  {
    text: 'Pilatus PC-24',
    icao: 'PC24',
  },
  {
    text: 'Avro RJ100',
    icao: 'RJ1H',
  },
  {
    text: 'Avro RJ70',
    icao: 'RJ70',
  },
  {
    text: 'Avro RJ85',
    icao: 'RJ85',
  },
  {
    text: 'Sikorsky S-58T',
    icao: 'S58T',
  },
  {
    text: 'Aerospatiale SN.601 Corvette',
    icao: 'S601',
  },
  {
    text: 'Sikorsky S-61',
    icao: 'S61',
  },
  {
    text: 'Eurocopter (Aerospatiale) SA365C Dauphin 2',
    icao: 'S65C',
  },
  {
    text: 'Sikorsky S-76',
    icao: 'S76',
  },
  {
    text: 'Sikorsky S-92',
    icao: 'S92',
  },
  {
    text: 'Saab 2000',
    icao: 'SB20',
  },
  {
    text: 'Shorts SC-7 Skyvan',
    icao: 'SC7',
  },
  {
    text: 'Saab SF340A/B',
    icao: 'SF34',
  },
  {
    text: 'Cirrus SF50 Vision Jet',
    icao: 'SF50',
  },
  {
    text: 'Shorts SD.330',
    icao: 'SH33',
  },
  {
    text: 'Shorts SD.360',
    icao: 'SH36',
  },
  {
    text: 'Sukhoi Superjet 100-95',
    icao: 'SU95',
  },
  {
    text: 'Fairchild Swearingen Metroliner',
    icao: 'SW4',
  },
  {
    text: 'Tupolev Tu-134',
    icao: 'T134',
  },
  {
    text: 'Tupolev Tu-154',
    icao: 'T154',
  },
  {
    text: 'Tupolev Tu-204 / Tu-214',
    icao: 'T204',
  },
  {
    text: 'Daher TBM 700',
    icao: 'TBM7',
  },
  {
    text: 'Daher TBM 850',
    icao: 'TBM8',
  },
  {
    text: 'Daher TBM 900',
    icao: 'TBM9',
  },
  {
    text: 'Daher TBM 910',
    icao: 'TBM9',
  },
  {
    text: 'Daher TBM 930',
    icao: 'TBM9',
  },
  {
    text: 'Daher TBM 940',
    icao: 'TBM9',
  },
  {
    text: 'Daher TBM 960',
    icao: 'TBM9',
  },
  {
    text: 'Pilatus Britten-Norman BN-2A Mk III Trislander',
    icao: 'TRIS',
  },
  {
    text: 'Bell Boeing V-22 Osprey',
    icao: 'V22',
  },
  {
    text: 'Israel Aircraft Industries 1124 Westwind',
    icao: 'WW24',
  },
  {
    text: 'Harbin Y-12',
    icao: 'Y12',
  },
  {
    text: 'Yakovlev Yak-40',
    icao: 'YK40',
  },
  {
    text: 'Yakovlev Yak-42',
    icao: 'YK42',
  },
  {
    text: 'NAMC YS-11',
    icao: 'YS11',
  },
];
