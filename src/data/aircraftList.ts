// This list is a copy from the var 'models' on https://server.fseconomy.net/airport.jsp
// Processing afterwards:
// - ID converted from 'string' to 'number'.
//
// Regex in vscode:
// Search: (id:\s*)'(\d+)'
// Replace: $1$2

interface AircraftDefinition {
  id: number;
  name: string;
}

export const aircraftList: AircraftDefinition[] = [
  {
    id: 95,
    name: 'Aermacchi - Lockheed AL-60',
  },
  {
    id: 26,
    name: 'Aero Design AC500C',
  },
  {
    id: 25,
    name: 'Aero Design AC680S',
  },
  {
    id: 228,
    name: 'Aero Vodochody L-39',
  },
  {
    id: 119,
    name: 'Aeronca Champion',
  },
  {
    id: 71,
    name: 'Agusta A109',
  },
  {
    id: 326,
    name: 'Agusta Westland AW139',
  },
  {
    id: 406,
    name: 'Agusta Westwind AW109SP (X-Trident)',
  },
  {
    id: 290,
    name: 'Airbus A320',
  },
  {
    id: 361,
    name: 'Airbus A320 (MSFS)',
  },
  {
    id: 285,
    name: 'Airbus A321',
  },
  {
    id: 353,
    name: 'Airbus H135 HPG',
  },
  {
    id: 395,
    name: 'Airbus Helicopters H130 (EC130 B4 XP)',
  },
  {
    id: 354,
    name: 'Airbus Helicopters H145',
  },
  {
    id: 386,
    name: 'Airbus Helicopters H145 (HPG)',
  },
  {
    id: 400,
    name: 'Airbus Helicopters H160',
  },
  {
    id: 409,
    name: 'Airbus Helicopters H225',
  },
  {
    id: 192,
    name: 'Aircreation 582SL',
  },
  {
    id: 275,
    name: 'Airspeed AS-57 Ambassador',
  },
  {
    id: 201,
    name: 'Alenia C-27J Spartan',
  },
  {
    id: 304,
    name: 'Alenia C-27J Spartan (IRIS)',
  },
  {
    id: 36,
    name: 'American Champion Scout',
  },
  {
    id: 125,
    name: 'Antonov An-14',
  },
  {
    id: 116,
    name: 'Antonov AN-2',
  },
  {
    id: 153,
    name: 'Antonov An-24',
  },
  {
    id: 231,
    name: 'Antonov An-26 Curl',
  },
  {
    id: 169,
    name: 'Antonov An-28',
  },
  {
    id: 256,
    name: 'Antonov An-32',
  },
  {
    id: 310,
    name: 'ATR 42-500',
  },
  {
    id: 154,
    name: 'ATR 72-500',
  },
  {
    id: 287,
    name: 'Auster J/1 Autocrat',
  },
  {
    id: 62,
    name: 'Australia GAF N22 Nomad',
  },
  {
    id: 60,
    name: 'Aviat A-1 Husky',
  },
  {
    id: 366,
    name: 'Aviat Pitts Special (MSFS)',
  },
  {
    id: 309,
    name: 'Avro Anson MK-1',
  },
  {
    id: 368,
    name: 'Avro Lancaster',
  },
  {
    id: 251,
    name: 'BAC Jet Provost T5',
  },
  {
    id: 270,
    name: 'BAe 146-100 (Avro RJ70)',
  },
  {
    id: 263,
    name: 'BAe Jetstream 32',
  },
  {
    id: 193,
    name: 'BAe Jetstream 41',
  },
  {
    id: 274,
    name: 'Basler BT-67',
  },
  {
    id: 259,
    name: 'Beagle B 206 Basset',
  },
  {
    id: 190,
    name: 'Beechcraft 17',
  },
  {
    id: 55,
    name: 'Beechcraft 18',
  },
  {
    id: 67,
    name: 'Beechcraft 1900C',
  },
  {
    id: 68,
    name: 'Beechcraft 1900C Freighter',
  },
  {
    id: 8,
    name: 'Beechcraft 1900D',
  },
  {
    id: 7,
    name: 'Beechcraft Baron 58',
  },
  {
    id: 97,
    name: 'Beechcraft Baron 58 - Turbo/tip tanks',
  },
  {
    id: 405,
    name: 'Beechcraft Baron 58 RTW',
  },
  {
    id: 44,
    name: 'Beechcraft Bonanza A36',
  },
  {
    id: 394,
    name: 'Beechcraft Bonanza A36 Waiz RTW',
  },
  {
    id: 31,
    name: 'Beechcraft Bonanza F33',
  },
  {
    id: 29,
    name: 'Beechcraft Bonanza V35',
  },
  {
    id: 80,
    name: 'Beechcraft Debonair',
  },
  {
    id: 288,
    name: 'Beechcraft Duchess 76',
  },
  {
    id: 188,
    name: 'Beechcraft Duke B60',
  },
  {
    id: 34,
    name: 'Beechcraft King Air 200',
  },
  {
    id: 160,
    name: 'Beechcraft King Air 300',
  },
  {
    id: 33,
    name: 'Beechcraft King Air 350',
  },
  {
    id: 81,
    name: 'Beechcraft King Air C90',
  },
  {
    id: 35,
    name: 'Beechcraft Queen Air',
  },
  {
    id: 79,
    name: 'Beechcraft Queen Air 80S',
  },
  {
    id: 262,
    name: 'Beechcraft Royal Turbine Duke B60',
  },
  {
    id: 410,
    name: 'Beechcraft Starship 2000A',
  },
  {
    id: 175,
    name: 'Beechcraft T-34 Mentor',
  },
  {
    id: 51,
    name: 'Beechcraft Twin Bonanza 50',
  },
  {
    id: 76,
    name: 'Bell 205A-1/UH-1C',
  },
  {
    id: 69,
    name: 'Bell 206B',
  },
  {
    id: 254,
    name: 'Bell 206L RTW N3911Z',
  },
  {
    id: 219,
    name: 'Bell 212',
  },
  {
    id: 156,
    name: 'Bell 407',
  },
  {
    id: 355,
    name: 'Bell 407 (Nemeth)',
  },
  {
    id: 103,
    name: 'Bell 412',
  },
  {
    id: 344,
    name: 'Bell 429',
  },
  {
    id: 75,
    name: 'Bell 430',
  },
  {
    id: 222,
    name: 'Bell 430 RTW N430Q',
  },
  {
    id: 271,
    name: 'Bell 47G-2',
  },
  {
    id: 268,
    name: 'Bell UH-1H Huey',
  },
  {
    id: 131,
    name: 'Bellanca 260',
  },
  {
    id: 46,
    name: 'Beriev BE-103',
  },
  {
    id: 301,
    name: 'Boeing 221A Monomail',
  },
  {
    id: 284,
    name: 'Boeing 247D',
  },
  {
    id: 381,
    name: 'Boeing 247D W42',
  },
  {
    id: 194,
    name: 'Boeing 377',
  },
  {
    id: 281,
    name: 'Boeing 727-100/200',
  },
  {
    id: 282,
    name: 'Boeing 737-800',
  },
  {
    id: 338,
    name: 'Boeing 747-400',
  },
  {
    id: 197,
    name: 'Boeing B-17G',
  },
  {
    id: 356,
    name: 'Boeing B314 Clipper',
  },
  {
    id: 377,
    name: 'Boeing Model 40B-4',
  },
  {
    id: 189,
    name: 'Boeing Stearman',
  },
  {
    id: 343,
    name: 'Boeing Vertol CH-46D Sea Knight (BV107)',
  },
  {
    id: 232,
    name: 'Boeing Vertol CH-47 Chinook',
  },
  {
    id: 283,
    name: 'Bombardier Challenger 300',
  },
  {
    id: 380,
    name: 'Bombardier Challenger 650',
  },
  {
    id: 243,
    name: 'Bombardier CL-415',
  },
  {
    id: 216,
    name: 'Bombardier CRJ-200ER',
  },
  {
    id: 249,
    name: 'Bombardier CRJ700-ER',
  },
  {
    id: 211,
    name: 'Bombardier Dash-8 Q400',
  },
  {
    id: 220,
    name: 'Bombardier Lear 60',
  },
  {
    id: 203,
    name: 'Bristol Britannia 300',
  },
  {
    id: 314,
    name: 'Bristol Mark 32 Superfreighter',
  },
  {
    id: 207,
    name: 'Britten Norman BN-2A Mk3-3 Trislander',
  },
  {
    id: 84,
    name: 'Britten-Norman BN-2B Islander',
  },
  {
    id: 250,
    name: 'Bucker Jungmann 131',
  },
  {
    id: 258,
    name: 'CASA CN235',
  },
  {
    id: 376,
    name: 'Cessna 140',
  },
  {
    id: 3,
    name: 'Cessna 152 Aerobat',
  },
  {
    id: 280,
    name: 'Cessna 162 Skycatcher',
  },
  {
    id: 1,
    name: 'Cessna 172 Skyhawk',
  },
  {
    id: 11,
    name: 'Cessna 177 Cardinal',
  },
  {
    id: 57,
    name: 'Cessna 177RG Cardinal',
  },
  {
    id: 6,
    name: 'Cessna 182 Skylane',
  },
  {
    id: 401,
    name: 'Cessna 182 Spirit of Columbus',
  },
  {
    id: 92,
    name: 'Cessna 185 Skywagon',
  },
  {
    id: 87,
    name: 'Cessna 195',
  },
  {
    id: 43,
    name: 'Cessna 206 Stationair',
  },
  {
    id: 113,
    name: 'Cessna 207 Stationair 8',
  },
  {
    id: 22,
    name: 'Cessna 208 Caravan',
  },
  {
    id: 9,
    name: 'Cessna 210 Centurion',
  },
  {
    id: 10,
    name: 'Cessna 310',
  },
  {
    id: 385,
    name: 'Cessna 310R (Milviz MSFS)',
  },
  {
    id: 61,
    name: 'Cessna 337 Skymaster',
  },
  {
    id: 261,
    name: 'Cessna 340A',
  },
  {
    id: 93,
    name: 'Cessna 404 Titan',
  },
  {
    id: 407,
    name: 'Cessna 408 SkyCourier',
  },
  {
    id: 214,
    name: 'Cessna 414A Chancellor',
  },
  {
    id: 41,
    name: 'Cessna 421 Golden Eagle',
  },
  {
    id: 42,
    name: 'Cessna 441 Conquest II',
  },
  {
    id: 166,
    name: 'Cessna Citation CJ1',
  },
  {
    id: 372,
    name: 'Cessna Citation CJ4 (MSFS)',
  },
  {
    id: 165,
    name: 'Cessna Citation II',
  },
  {
    id: 375,
    name: 'Cessna Citation Longitude',
  },
  {
    id: 167,
    name: 'Cessna Citation X',
  },
  {
    id: 360,
    name: 'Cessna Citation XLS+',
  },
  {
    id: 237,
    name: 'Cessna L-19/O-1 Birddog',
  },
  {
    id: 177,
    name: 'Cessna Mustang',
  },
  {
    id: 334,
    name: 'Cessna Soloy Mk1/MkII U206 Turbo',
  },
  {
    id: 174,
    name: 'Cessna T-50 Bobcat',
  },
  {
    id: 321,
    name: 'Cessna T303 Crusader',
  },
  {
    id: 335,
    name: 'Cessna/Reims F-406 Caravan II',
  },
  {
    id: 77,
    name: 'Cirrus SR20',
  },
  {
    id: 16,
    name: 'Cirrus SR22 G2',
  },
  {
    id: 349,
    name: 'Cirrus Vision SF50',
  },
  {
    id: 139,
    name: 'Columbia 400',
  },
  {
    id: 107,
    name: 'Commander 112',
  },
  {
    id: 39,
    name: 'Commander 115',
  },
  {
    id: 332,
    name: 'Consolidated C-87 Liberator Express',
  },
  {
    id: 94,
    name: 'Consolidated PBY5 Catalina',
  },
  {
    id: 144,
    name: 'Convair 340/440',
  },
  {
    id: 147,
    name: 'Convair 580',
  },
  {
    id: 365,
    name: 'Cub Crafters XCub (MSFS)',
  },
  {
    id: 150,
    name: 'Curtiss C46',
  },
  {
    id: 391,
    name: 'Curtiss JN-4 Jenny',
  },
  {
    id: 358,
    name: 'Curtiss P-40C (A2A)',
  },
  {
    id: 239,
    name: 'Curtiss Robertson Robin J-1',
  },
  {
    id: 327,
    name: 'Dassault Falcon 50',
  },
  {
    id: 206,
    name: 'Dassault Falcon 7X',
  },
  {
    id: 373,
    name: 'DeHavilland Beaver (Thranda XP)',
  },
  {
    id: 369,
    name: 'DeHavilland Cirrus II Moth (Mary Bailey)',
  },
  {
    id: 180,
    name: 'DeHavilland Dash 7',
  },
  {
    id: 151,
    name: 'DeHavilland Dash 8 100/200',
  },
  {
    id: 294,
    name: 'DeHavilland Dash 8 Q300',
  },
  {
    id: 105,
    name: 'DeHavilland DH 89 Dragon Rapide',
  },
  {
    id: 242,
    name: 'DeHavilland DH-82 Tiger Moth',
  },
  {
    id: 106,
    name: 'DeHavilland DH104 Dove',
  },
  {
    id: 306,
    name: 'DeHavilland DH114 Heron',
  },
  {
    id: 226,
    name: 'DeHavilland DH80A Puss Moth',
  },
  {
    id: 238,
    name: 'DeHavilland DHC-1 Chipmunk',
  },
  {
    id: 5,
    name: 'DeHavilland DHC-2 Beaver',
  },
  {
    id: 374,
    name: 'DeHavilland DHC-2 Beaver (Thranda XP)',
  },
  {
    id: 136,
    name: 'DeHavilland DHC-2 Turbo Beaver',
  },
  {
    id: 37,
    name: 'DeHavilland DHC-3 Otter',
  },
  {
    id: 230,
    name: 'DeHavilland DHC-3-T Turbo Otter',
  },
  {
    id: 351,
    name: 'DeHavilland DHC-3T Turbo Otter (Milviz)',
  },
  {
    id: 132,
    name: 'DeHavilland DHC-4 Caribou',
  },
  {
    id: 178,
    name: 'DeHavilland DHC-5 Buffalo',
  },
  {
    id: 298,
    name: 'DeHavilland DHC-6 300 Twin Otter (Aerosoft Extended)',
  },
  {
    id: 45,
    name: 'DeHavilland DHC-6 Twin Otter',
  },
  {
    id: 384,
    name: 'Diamond DA-50RG (Aerobask)',
  },
  {
    id: 13,
    name: 'Diamond DA20 Katana',
  },
  {
    id: 72,
    name: 'Diamond DA40D DiamondStar',
  },
  {
    id: 108,
    name: 'Diamond DA42 Twin Star',
  },
  {
    id: 348,
    name: 'Diamond DA62',
  },
  {
    id: 195,
    name: 'Dornier 228',
  },
  {
    id: 313,
    name: 'Dornier 328',
  },
  {
    id: 141,
    name: 'Dornier Do-27 A4',
  },
  {
    id: 140,
    name: 'Dornier Do-27 B1',
  },
  {
    id: 319,
    name: 'Dornier Do-28 A/B',
  },
  {
    id: 157,
    name: 'Douglas A-26',
  },
  {
    id: 303,
    name: 'Douglas C117D',
  },
  {
    id: 172,
    name: 'Douglas DC-2',
  },
  {
    id: 233,
    name: 'Douglas DC-2 (FSX)',
  },
  {
    id: 18,
    name: 'Douglas DC-3',
  },
  {
    id: 266,
    name: 'Douglas DC-4',
  },
  {
    id: 183,
    name: 'Douglas DC-6',
  },
  {
    id: 267,
    name: 'Douglas DC-6B',
  },
  {
    id: 345,
    name: 'Douglas DC-6B (PMDG)',
  },
  {
    id: 292,
    name: 'Douglas DC-7B',
  },
  {
    id: 293,
    name: 'Douglas DC-7C',
  },
  {
    id: 308,
    name: 'Douglas DC-8 (10-40)',
  },
  {
    id: 244,
    name: 'Eclipse 500',
  },
  {
    id: 149,
    name: 'Embraer 110',
  },
  {
    id: 148,
    name: 'Embraer 120',
  },
  {
    id: 252,
    name: 'Embraer ERJ-135LR',
  },
  {
    id: 221,
    name: 'Embraer ERJ-145LR',
  },
  {
    id: 184,
    name: 'Embraer Legacy 600',
  },
  {
    id: 302,
    name: 'Embraer Phenom 100',
  },
  {
    id: 323,
    name: 'Embraer Phenom 300',
  },
  {
    id: 272,
    name: 'ERCO Ercoupe 415-C',
  },
  {
    id: 330,
    name: 'Eurocopter AS-332 Super Puma',
  },
  {
    id: 83,
    name: 'Eurocopter AS-350 Ecureuil',
  },
  {
    id: 339,
    name: 'Eurocopter AS365',
  },
  {
    id: 162,
    name: 'Eurocopter BK117',
  },
  {
    id: 98,
    name: 'Eurocopter Colibri EC 120',
  },
  {
    id: 213,
    name: 'Eurocopter EC-135',
  },
  {
    id: 218,
    name: 'Fairchild 24R',
  },
  {
    id: 357,
    name: 'Fairchild C-119 (AH)',
  },
  {
    id: 134,
    name: 'Fairchild C119',
  },
  {
    id: 171,
    name: 'Fairchild C123',
  },
  {
    id: 96,
    name: 'Fairchild Metro III',
  },
  {
    id: 245,
    name: 'Fairchild PT19/26 Cornell',
  },
  {
    id: 346,
    name: 'Fokker 50',
  },
  {
    id: 390,
    name: 'Fokker F.VIIb/3m',
  },
  {
    id: 399,
    name: 'Fokker F.VIIb/3m Smith Pacific',
  },
  {
    id: 212,
    name: 'Fokker F27-500 Friendship',
  },
  {
    id: 179,
    name: 'Ford Tri-Motor',
  },
  {
    id: 90,
    name: 'Found Bush Hawk',
  },
  {
    id: 89,
    name: 'Gippsland GA8 Airvan',
  },
  {
    id: 138,
    name: 'Globe Swift',
  },
  {
    id: 63,
    name: 'Grumman G-21 Goose',
  },
  {
    id: 123,
    name: 'Grumman G-44 Widgeon',
  },
  {
    id: 322,
    name: 'Grumman G-73 Mallard',
  },
  {
    id: 331,
    name: 'Grumman G-73T Turbo Mallard',
  },
  {
    id: 114,
    name: 'Grumman HU-16B Albatross',
  },
  {
    id: 297,
    name: 'Grumman S2/C1',
  },
  {
    id: 146,
    name: 'Grumman Tiger',
  },
  {
    id: 260,
    name: 'Grumman Turbo Goose',
  },
  {
    id: 347,
    name: 'Gulfstream Twin Commander 690B (Carenado)',
  },
  {
    id: 315,
    name: 'Hawker 850XP',
  },
  {
    id: 135,
    name: 'Hawker Siddeley HS-748',
  },
  {
    id: 117,
    name: 'Helio Super Courier H-295/U-10b',
  },
  {
    id: 383,
    name: 'Honda HA-420 HondaJet',
  },
  {
    id: 210,
    name: 'Howard DGA-15',
  },
  {
    id: 20,
    name: 'Howard Aero 500',
  },
  {
    id: 333,
    name: 'Hughes 269',
  },
  {
    id: 59,
    name: 'Hughes/McDonnell Douglas MD500E',
  },
  {
    id: 196,
    name: 'Ilyushin Il-14',
  },
  {
    id: 202,
    name: 'Ilyushin Il-18D',
  },
  {
    id: 200,
    name: 'Junkers Ju-52',
  },
  {
    id: 223,
    name: 'Junkers W33 EW Flight',
  },
  {
    id: 224,
    name: 'Junkers W33/34',
  },
  {
    id: 101,
    name: 'Kazan Helicopter Plant Mi-17-1V-GA',
  },
  {
    id: 389,
    name: 'Kitfox Series 5 STi',
  },
  {
    id: 40,
    name: 'Lake Renegade',
  },
  {
    id: 387,
    name: 'Lancair Evolution',
  },
  {
    id: 255,
    name: 'Lancair IV-P',
  },
  {
    id: 110,
    name: 'Lancair Legacy',
  },
  {
    id: 164,
    name: 'Lear 45',
  },
  {
    id: 311,
    name: 'Learjet 24B',
  },
  {
    id: 312,
    name: 'Learjet 24B - Tip Tanks',
  },
  {
    id: 336,
    name: 'Learjet 35A',
  },
  {
    id: 402,
    name: 'Learjet 35A (FSW)',
  },
  {
    id: 241,
    name: 'LearJet LJ25D',
  },
  {
    id: 130,
    name: 'Let L 410 UVP-E',
  },
  {
    id: 112,
    name: 'Let L 410 UVP-T',
  },
  {
    id: 279,
    name: 'Liberty XL2',
  },
  {
    id: 185,
    name: 'Lockheed C-130 (Capt Sim)',
  },
  {
    id: 181,
    name: 'Lockheed C-130 (Generic)',
  },
  {
    id: 182,
    name: 'Lockheed Constellation',
  },
  {
    id: 340,
    name: 'Lockheed L049 (A2A)',
  },
  {
    id: 111,
    name: 'Lockheed L10A Electra',
  },
  {
    id: 209,
    name: 'Lockheed L10E Amelia Special',
  },
  {
    id: 320,
    name: 'Lockheed Lodestar',
  },
  {
    id: 378,
    name: 'Lockheed P-38 Lightning',
  },
  {
    id: 204,
    name: 'Lockheed P-3C (L-188)',
  },
  {
    id: 159,
    name: 'Lockheed Vega',
  },
  {
    id: 88,
    name: 'Luscombe 8A',
  },
  {
    id: 371,
    name: 'Luscombe Phantom 145',
  },
  {
    id: 229,
    name: 'Martin 404',
  },
  {
    id: 12,
    name: 'Maule M-7',
  },
  {
    id: 337,
    name: 'McDonnell Douglas DC-10-30F',
  },
  {
    id: 300,
    name: 'Messerschmitt Bf 108 B',
  },
  {
    id: 235,
    name: 'Meyers 200D',
  },
  {
    id: 341,
    name: 'Mil Mi-2',
  },
  {
    id: 122,
    name: 'Mitsubishi MU-2B',
  },
  {
    id: 15,
    name: 'Mooney M20 Bravo',
  },
  {
    id: 289,
    name: 'Mooney M20 Juliet',
  },
  {
    id: 227,
    name: 'Morane-Saulnier MS-760',
  },
  {
    id: 362,
    name: 'Mudry CAP 10 (MSFS)',
  },
  {
    id: 324,
    name: 'NAMC YS-11',
  },
  {
    id: 264,
    name: 'New Standard D25A',
  },
  {
    id: 64,
    name: 'Noorduyn Norseman',
  },
  {
    id: 173,
    name: 'North American B-25',
  },
  {
    id: 305,
    name: 'North American P-51D Mustang',
  },
  {
    id: 291,
    name: 'North American T-28 Trojan',
  },
  {
    id: 253,
    name: 'North American T-39 Sabreliner',
  },
  {
    id: 234,
    name: 'North American T-6G Texan',
  },
  {
    id: 398,
    name: 'Pacific P-750 XSTOL',
  },
  {
    id: 99,
    name: 'Pacific Aerospace 750XL',
  },
  {
    id: 397,
    name: 'Partenavia P68B',
  },
  {
    id: 65,
    name: 'Piaggio 166 Albatross',
  },
  {
    id: 66,
    name: 'Piaggio 180 Avanti',
  },
  {
    id: 137,
    name: 'Piaggio P-149D',
  },
  {
    id: 24,
    name: 'Pilatus PC-12',
  },
  {
    id: 408,
    name: 'Pilatus PC-24',
  },
  {
    id: 14,
    name: 'Pilatus PC-6 Porter',
  },
  {
    id: 23,
    name: 'Piper J-3 Cub',
  },
  {
    id: 225,
    name: 'Piper PA-12 Super Cruiser RTW',
  },
  {
    id: 73,
    name: 'Piper PA-18 Super Cub',
  },
  {
    id: 86,
    name: 'Piper PA-20 Pacer',
  },
  {
    id: 74,
    name: 'Piper PA-22 Super Pacer',
  },
  {
    id: 115,
    name: 'Piper PA-22 Tri-Pacer',
  },
  {
    id: 19,
    name: 'Piper PA-23 Apache',
  },
  {
    id: 56,
    name: 'Piper PA-23 Aztec',
  },
  {
    id: 54,
    name: 'Piper PA-24 Comanche',
  },
  {
    id: 316,
    name: 'Piper PA-24 Comanche (A2A)',
  },
  {
    id: 2,
    name: 'Piper PA-28 Archer',
  },
  {
    id: 52,
    name: 'Piper PA-28 Arrow',
  },
  {
    id: 4,
    name: 'Piper PA-28 Cherokee 180',
  },
  {
    id: 30,
    name: 'Piper PA-28 Dakota',
  },
  {
    id: 50,
    name: 'Piper PA-28 Warrior',
  },
  {
    id: 161,
    name: 'Piper PA-30 Twin Comanche',
  },
  {
    id: 28,
    name: 'Piper PA-31 Navajo',
  },
  {
    id: 127,
    name: 'Piper PA-31T Cheyenne II',
  },
  {
    id: 126,
    name: 'Piper PA-31T1 Cheyenne I/IA',
  },
  {
    id: 128,
    name: 'Piper PA-31T2 Cheyenne IIXL',
  },
  {
    id: 53,
    name: 'Piper PA-32 Cherokee Six/ Saratoga',
  },
  {
    id: 170,
    name: 'Piper PA-32 Saratoga TC',
  },
  {
    id: 21,
    name: 'Piper PA-34 Seneca',
  },
  {
    id: 27,
    name: 'Piper PA-38 Tomahawk',
  },
  {
    id: 38,
    name: 'Piper PA-42-1000 Cheyenne 400',
  },
  {
    id: 186,
    name: 'Piper PA-44 Seminole',
  },
  {
    id: 32,
    name: 'Piper PA-46 Meridian',
  },
  {
    id: 49,
    name: 'Piper PA-60 Aerostar',
  },
  {
    id: 396,
    name: 'Progressive Aerodyne SeaRey RTW',
  },
  {
    id: 152,
    name: 'PZL Wilga',
  },
  {
    id: 379,
    name: 'PZL-104M Wilga 2000 (Thranda XP)',
  },
  {
    id: 191,
    name: 'Quest Kodiak',
  },
  {
    id: 240,
    name: 'Rans S-7 Courier',
  },
  {
    id: 168,
    name: 'Raytheon Beechjet / Hawker',
  },
  {
    id: 176,
    name: 'Raytheon Premier1',
  },
  {
    id: 199,
    name: 'Republic Seabee',
  },
  {
    id: 198,
    name: 'Robin DR400',
  },
  {
    id: 367,
    name: 'Robin DR400-100 Cadet (MSFS)',
  },
  {
    id: 328,
    name: 'Robin HR200',
  },
  {
    id: 120,
    name: 'Robin/Apex DR221',
  },
  {
    id: 82,
    name: 'Robinson R22',
  },
  {
    id: 118,
    name: 'Robinson R44',
  },
  {
    id: 393,
    name: 'Robinson R44 Raven II',
  },
  {
    id: 329,
    name: 'Robinson R66 Turbine',
  },
  {
    id: 265,
    name: 'Rockwell Commander 114',
  },
  {
    id: 47,
    name: 'Rockwell Twin Commander 690B',
  },
  {
    id: 382,
    name: 'Rutan Long EZ RTW',
  },
  {
    id: 215,
    name: 'Ryan L-17 Navion',
  },
  {
    id: 317,
    name: 'Saab 2000',
  },
  {
    id: 143,
    name: 'Saab 340B',
  },
  {
    id: 247,
    name: 'SAAB Scandia 90',
  },
  {
    id: 364,
    name: 'Savage Cub (MSFS)',
  },
  {
    id: 325,
    name: 'Scottish Aviation Twin Pioneer',
  },
  {
    id: 404,
    name: 'Short SD3-30',
  },
  {
    id: 205,
    name: 'Shorts SD3-60',
  },
  {
    id: 133,
    name: 'Shorts Skyvan',
  },
  {
    id: 388,
    name: 'SIAI-Marchetti S.205 18/R',
  },
  {
    id: 17,
    name: 'SIAI-Marchetti SF260',
  },
  {
    id: 246,
    name: 'SIAI-Marchetti SM.1019A',
  },
  {
    id: 155,
    name: 'Sikorsky S-43',
  },
  {
    id: 236,
    name: 'Sikorsky S-55',
  },
  {
    id: 187,
    name: 'Sikorsky S-76',
  },
  {
    id: 359,
    name: 'Sikorsky S-92A Cougar',
  },
  {
    id: 342,
    name: 'Sikorsky UH-60 Blackhawk',
  },
  {
    id: 78,
    name: 'Socata TB-10 Tobago',
  },
  {
    id: 121,
    name: 'Socata TB21GT Trinidad',
  },
  {
    id: 100,
    name: 'Socata TBM 700',
  },
  {
    id: 296,
    name: 'Socata TBM 850',
  },
  {
    id: 363,
    name: 'Socata TBM 930 (MSFS)',
  },
  {
    id: 102,
    name: 'Spartan 7W Executive',
  },
  {
    id: 163,
    name: 'Stinson 108',
  },
  {
    id: 208,
    name: 'Stinson L-5B Sentinel',
  },
  {
    id: 91,
    name: 'Stinson Reliant',
  },
  {
    id: 350,
    name: 'Supermarine Spitfire',
  },
  {
    id: 299,
    name: 'Supermarine Walrus MK 1',
  },
  {
    id: 352,
    name: 'Tecnam P2006T',
  },
  {
    id: 403,
    name: 'Tecnam P2012 Traveller',
  },
  {
    id: 217,
    name: 'Tecnam P92 Echo',
  },
  {
    id: 370,
    name: 'Travel Air Mystery Ship 613',
  },
  {
    id: 248,
    name: 'Tupolev Tu-124',
  },
  {
    id: 392,
    name: "Van's RV-10",
  },
  {
    id: 58,
    name: 'Vans RV-7/7A',
  },
  {
    id: 277,
    name: 'Vickers Viscount',
  },
  {
    id: 129,
    name: 'Waco Classic YMF',
  },
  {
    id: 158,
    name: 'Westland Seaking',
  },
  {
    id: 145,
    name: 'Yakovlev Yak-12A',
  },
  {
    id: 142,
    name: 'Yakovlev Yak-18T',
  },
  {
    id: 286,
    name: 'Yakovlev Yak-40',
  },
  {
    id: 104,
    name: 'Zenair CH 801',
  },
  {
    id: 257,
    name: 'Zepplin NT',
  },
  {
    id: 124,
    name: 'Zlin Z-43',
  },
];
