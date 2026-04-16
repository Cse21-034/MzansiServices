export interface DirectoryEntry {
  name: string;
  address?: string;
  poBox?: string;
  city?: string;
  country: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  tollfree?: string;
  image?: string; // Path to organization image or logo
  type: 'ministry' | 'parastatal' | 'agency' | 'local_authority' | 'utility' | 'other';
}

export const namibiaDirectory: DirectoryEntry[] = [
  // MINISTRIES
  {
    name: "Office of the President",
    address: "Union Buildings, Government Avenue",
    city: "Pretoria",
    country: "South Africa",
    poBox: "P.O. Box 777",
    phone: "+27 12 300 5000",
    website: "www.gov.za",
    type: "ministry"
  },
  {
    name: "Department of International Relations and Cooperation",
    address: "460 Commissioner Street",
    city: "Pretoria",
    country: "South Africa",
    poBox: "P.O. Box 14643",
    phone: "+27 12 351 0000",
    website: "www.dirco.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Justice and Constitutional Development",
    address: "104 Pretoria Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 315 1111",
    fax: "+27 12 315 1999",
    website: "www.justice.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Defence and Military Veterans",
    address: "Armscor Building, Cnr Simon Vermooten & Nossob Streets",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 314 0911",
    website: "www.defence.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Police",
    address: "Princess Street, Brooklyn",
    city: "Pretoria",
    country: "South Africa",
    poBox: "P.O. Box 3591",
    phone: "+27 11 479 4000",
    website: "www.police.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Agriculture, Land Reform and Rural Development",
    address: "Cnr Rmuthaiga Road & Nossob Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 319 8000",
    website: "www.dalrrd.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Forestry, Fisheries and the Environment",
    address: "East Wing, Eco House, Cnr Andries & Vermeulen Streets",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 399 9000",
    website: "www.dffe.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Mineral Resources and Energy",
    address: "234 Schoeman Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 444 8000",
    website: "www.dmre.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Trade, Industry and Competition",
    address: "Department of Trade, Industry and Competition",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 394 1000",
    website: "www.thedtic.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Basic Education",
    address: "222 Struben Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 357 3000",
    website: "www.education.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Health",
    address: "1 Sophie de Bruyn Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 312 0000",
    website: "www.health.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Social Development",
    address: "HSRC Building, 134 Pretorius Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 312 7500",
    website: "www.dsd.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Public Works and Infrastructure",
    address: "Kasper de Vries Building, 185 Visagie Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 406 7000",
    website: "www.dpw.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Finance",
    address: "1000 East Pretoria Street, Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 315 5000",
    website: "www.finance.gov.za",
    type: "ministry"
  },

  // PARASTATALS
  {
    name: "South African Reserve Bank",
    address: "370 Main Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 313 3911",
    website: "www.sarb.gov.za",
    type: "parastatal",
    image: "/images/parastatalslogos/sarb-logo.png"
  },
  {
    name: "Eskom Holdings SOC Ltd",
    address: "Sunninghill, Sandton",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 629 9000",
    website: "www.eskom.co.za",
    type: "parastatal"
  },
  {
    name: "South African National Standards Body",
    address: "Lyonwood, Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 428 7911",
    website: "www.sabs.co.za",
    type: "parastatal",
    image: "/images/parastatalslogos/sabs-logo.png"
  },
  {
    name: "South African National Defence Force",
    address: "Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 355 9000",
    website: "www.sandf.org.za",
    type: "parastatal"
  },
  {
    name: "Industrial Development Corporation",
    address: "IDC House, 19 Fredman Drive",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 269 3000",
    website: "www.idc.co.za",
    type: "parastatal",
    image: "/images/parastatalslogos/idc-logo.png"  
  },
  {
    name: "South African Revenue Service",
    address: "14 Whiteley Road",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 422 4000",
    website: "www.sars.gov.za",
    type: "parastatal"
  },
  {
    name: "South African Broadcasting Corporation",
    address: "Broadcast Centre, Auckland Park",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 714 9000",
    website: "www.sabc.co.za",
    type: "parastatal"
  },
  {
    name: "South African Police Service",
    address: "333 Pretoria Street",
    city: "Pretoria",
    country: "South Africa",
    tollfree: "10177",
    phone: "+27 12 393 5000",
    website: "www.saps.gov.za",
    type: "parastatal"
  },
  {
    name: "Department of Correctional Services",
    address: "Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 309 8111",
    website: "www.dcs.gov.za",
    type: "parastatal"
  },
  {
    name: "Transnet",
    address: "Johannesburg",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 308 0000",
    website: "www.transnet.net",
    type: "parastatal",
    image: "/images/parastatalslogos/transnet-logo.png"
  },
  {
    name: "Eskom",
    address: "Johannesburg",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 800 8000",
    website: "www.eskom.co.za",
    type: "parastatal",
    image: "/images/parastatalslogos/eskom-logo.png"
  },
  {
    name: "South African Airways",
    address: "OR Tambo International Airport",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 978 1111",
    website: "www.flysaa.com",
    type: "parastatal"
  },
  {
    name: "Johannesburg Water",
    address: "Johannesburg",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 355 0000",
    website: "www.jhbwater.co.za",
    type: "parastatal"
  },
  {
    name: "South African National Parks",
    address: "Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 402 8000",
    website: "www.sanparks.org",
    type: "parastatal"
  },
  {
    name: "Deeds Office",
    address: "Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 401 0100",
    website: "www.deeds.gov.za",
    type: "parastatal"
  },

  // LOCAL AUTHORITIES
  {
    name: "City of Johannesburg",
    address: "Braamfontein",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 375 5555",
    website: "www.joburg.gov.za",
    type: "local_authority"
  },
  {
    name: "City of Cape Town",
    address: "Foreshore",
    city: "Cape Town",
    country: "South Africa",
    phone: "+27 21 400 3000",
    website: "www.capetown.gov.za",
    type: "local_authority"
  },
  {
    name: "City of Tshwane",
    address: "Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 358 0000",
    website: "www.tshwane.gov.za",
    type: "local_authority"
  },
  {
    name: "eThekwini Municipality",
    address: "Durban",
    city: "Durban",
    country: "South Africa",
    phone: "+27 31 311 1111",
    website: "www.durban.gov.za",
    type: "local_authority"
  },
  {
    name: "Ekurhuleni Metropolitan Municipality",
    address: "Johannesburg",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 490 2000",
    website: "www.ekurhuleni.gov.za",
    type: "local_authority"
  },
  {
    name: "Nelson Mandela Bay Municipality",
    address: "Port Elizabeth",
    city: "Port Elizabeth",
    country: "South Africa",
    phone: "+27 41 506 3000",
    website: "www.nelsonmandelabay.gov.za",
    type: "local_authority"
  },
  {
    name: "Gobabis Town Council",
    address: "Town Hall, Main Street",
    city: "Gobabis",
    country: "South Africa",
    phone: "+264 62 563 000",
    website: "www.gobabis.org.na",
    type: "local_authority"
  },
  {
    name: "Rehoboth Town Council",
    address: "Town Hall, Main Street",
    city: "Rehoboth",
    country: "South Africa",
    phone: "+264 63 520 500",
    website: "www.rehoboth.org.na",
    type: "local_authority"
  },
  {
    name: "Mariental Town Council",
    address: "Town Hall, King George Street",
    city: "Mariental",
    country: "South Africa",
    phone: "+264 63 242 500",
    website: "www.mariental.org.na",
    type: "local_authority"
  },
  {
    name: "Keetmanshoop Town Council",
    address: "Town Hall, Main Street",
    city: "Keetmanshoop",
    country: "South Africa",
    phone: "+264 63 222 500",
    website: "www.keetmanshoop.org.na",
    type: "local_authority"
  },

  // UTILITIES & AGENCIES
  {
    name: "Namibia Water Corporation",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 299 6111",
    website: "www.nwc.com.na",
    type: "utility"
  },
  {
    name: "Namibia Power Corporation",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 205 8111",
    website: "www.npc.com.na",
    type: "utility"
  },
  {
    name: "Namibia Airports Company Limited",
    address: "Hosea Kutako International Airport",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 295 6111",
    website: "www.nacl.com.na",
    type: "utility"
  },
  {
    name: "Namibia Ports Authority",
    address: "Walvis Bay",
    city: "Walvis Bay",
    country: "South Africa",
    phone: "+264 64 205 8000",
    website: "www.namports.com.na",
    type: "utility"
  },
  {
    name: "Namibia Transport and Logistics Regulatory Authority",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 250 7000",
    website: "www.ntlra.org.na",
    type: "agency"
  },
  {
    name: "Namibia Environmental Investment Fund",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 285 2000",
    website: "www.neif.org.na",
    type: "agency"
  },
  {
    name: "Namibia Horticulture Board",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 258 2640",
    website: "www.nhb.org.na",
    type: "agency"
  },
  {
    name: "Namibia Investment Centre",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 283 7000",
    website: "www.nic.com.na",
    type: "agency"
  },
  {
    name: "Namibia Trade Point",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 283 7000",
    website: "www.ntp.org.na",
    type: "agency"
  },
  {
    name: "Electoral Commission of Namibia",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 285 3200",
    website: "www.ecn.na",
    type: "agency"
  },
  {
    name: "Namibia Statistics Agency",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 408 8000",
    website: "www.nsa.org.na",
    type: "agency"
  },
  {
    name: "Namibia Office of the Ombudsman",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 223 7162",
    website: "www.ombudsman.org.na",
    type: "agency"
  }
];

export function getDirectoryByType(type: DirectoryEntry['type']): DirectoryEntry[] {
  return namibiaDirectory.filter(entry => entry.type === type);
}
