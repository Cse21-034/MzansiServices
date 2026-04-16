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
    address: "Government Office Park, Ausspannplatz",
    city: "Johannesburg",
    country: "South Africa",
    poBox: "P.O. Box 13339",
    phone: "+264 61 288 5000",
    website: "www.op.gov.na",
    type: "ministry"
  },
  {
    name: "Department of of International Relations and Cooperation",
    address: "Ausspannplatz",
    city: "Johannesburg",
    country: "South Africa",
    poBox: "P.O. Box 23468",
    phone: "+264 61 408 0600",
    website: "www.mirco.gov.na",
    type: "ministry"
  },
  {
    name: "Department of of Justice",
    address: "1 Katutura Street, Klein-Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 288 6111",
    fax: "+264 61 226 656",
    website: "www.justice.gov.na",
    type: "ministry"
  },
  {
    name: "Department of of Defence",
    address: "Ausspannplatz, Government Office Park",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 280 5000",
    website: "www.mod.gov.na",
    type: "ministry"
  },
  {
    name: "Department of of Safety and Security",
    address: "Ausspannplatz",
    city: "Johannesburg",
    country: "South Africa",
    poBox: "P.O. Box 13468",
    phone: "+264 61 202 8111",
    website: "www.safety.gov.na",
    type: "ministry"
  },
  {
    name: "Department of of Agriculture, Water and Land Reform",
    address: "Government Office Park",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 280 5000",
    website: "www.mawlr.gov.na",
    type: "ministry"
  },
  {
    name: "Department of of Fisheries and Marine Resources",
    address: "Strand Street, Walvis Bay",
    city: "Walvis Bay",
    country: "South Africa",
    phone: "+264 64 205 8000",
    website: "www.mfmr.gov.na",
    type: "ministry"
  },
  {
    name: "Department of of Mines and Energy",
    address: "Government Office Park",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 284 8200",
    website: "www.mme.gov.na",
    type: "ministry"
  },
  {
    name: "Department of of Trade, Industry and Entrepreneurship",
    address: "Ausspannplatz",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 283 7000",
    website: "www.mtie.gov.na",
    type: "ministry"
  },
  {
    name: "Department of of Education",
    address: "Government Office Park",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 292 3000",
    website: "www.moe.gov.na",
    type: "ministry"
  },
  {
    name: "Department of of Health and Social Services",
    address: "Katutura Street",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 203 8000",
    website: "www.mhss.gov.na",
    type: "ministry"
  },
  {
    name: "Department of of Gender Equality, Poverty Eradication and Social Welfare",
    address: "Government Office Park",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 283 6000",
    website: "www.gepesw.gov.na",
    type: "ministry"
  },
  {
    name: "Department of of Public Enterprises",
    address: "Ausspannplatz",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 288 0000",
    website: "www.mpe.gov.na",
    type: "ministry"
  },
  {
    name: "Department of of Finance",
    address: "Ausspannplatz",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 280 5000",
    website: "www.mof.gov.na",
    type: "ministry"
  },

  // PARASTATALS
  {
    name: "Bank of Namibia",
    address: "Post Street Mall, Post Street",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 283 5111",
    website: "www.bon.com.na",
    type: "parastatal",
    image: "/images/parastatalslogos/bank-of-mzansi-logo.png"
  },
  {
    name: "Namib Desert Resources",
    address: "Swakopmund",
    city: "Swakopmund",
    country: "South Africa",
    phone: "+264 64 410 600",
    website: "www.ndr.com.na",
    type: "parastatal"
  },
  {
    name: "Namibia Standard Agency",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 288 1000",
    website: "www.nsa.gov.na",
    type: "parastatal",
    image: "/images/parastatalslogos/namibia-standards-logo.png"
  },
  {
    name: "Namibia Defence Force",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 280 5000",
    website: "www.ndf.gov.na",
    type: "parastatal"
  },
  {
    name: "Namibia Development Corporation",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 290 6111",
    website: "www.ndc.gov.na",
    type: "parastatal",
    image: "/images/parastatalslogos/namibia-development-corporation-logo.png"
  },
  {
    name: "Namibia Qualification Authority",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 204 6600",
    website: "www.nqa.org.na",
    type: "parastatal",
    image: "/images/parastatalslogos/namibia-qualification-authority-logo.png"
  },
  {
    name: "Namibia Innovation Hub",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 256 2660",
    website: "www.nih.com.na",
    type: "parastatal",
    image: "/images/parastatalslogos/namibia-innovation-hub-logo.png"
  },
  {
    name: "Namibia Institute for Public Policy Analysis",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 208 6000",
    website: "www.nippa.org.na",
    type: "parastatal"
  },
  {
    name: "Namibia Financial Services Commission",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 208 8500",
    website: "www.nfsc.org.na",
    type: "parastatal"
  },
  {
    name: "Namibia Police Service",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    tollfree: "10177",
    phone: "+264 61 202 8111",
    website: "www.police.gov.na",
    type: "parastatal"
  },
  {
    name: "Namibia Correctional Service",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 206 4000",
    website: "www.ncs.gov.na",
    type: "parastatal"
  },
  {
    name: "Namibia Savings Bank",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 290 6111",
    website: "www.nsb.com.na",
    type: "parastatal",
    image: "/images/parastatalslogos/namibia-savings-bank-logo.png"
  },
  {
    name: "Namibia Stock Exchange",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 224 5000",
    website: "www.nsx.com.na",
    type: "parastatal",
    image: "/images/parastatalslogos/namibia-stock-exchange-logo.png"
  },
  {
    name: "Namibia Technology Centre",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 206 5000",
    website: "www.ntc.com.na",
    type: "parastatal"
  },
  {
    name: "Communications Regulatory Authority",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 222 6000",
    website: "www.cran.na",
    type: "parastatal"
  },
  {
    name: "Namibia Telecommunications Limited",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 205 8000",
    website: "www.ntl.com.na",
    type: "parastatal",
    image: "/images/parastatalslogos/namibia-telecommunications-logo.png"
  },
  {
    name: "Namibia Higher Education Council",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 204 6600",
    website: "www.nhec.org.na",
    type: "parastatal"
  },
  {
    name: "Namibia Tourism Board",
    address: "Werner List Street, Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 284 2111",
    email: "info@namibiatourism.com.na",
    website: "www.namibiatourism.com.na",
    type: "parastatal",
    image: "/images/parastatalslogos/namibia-tourism-board-logo.png"
  },
  {
    name: "Namibia Training Authority",
    address: "Windhoek",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 208 6600",
    website: "www.nta.org.na",
    type: "parastatal"
  },
  {
    name: "Namibia Revenue Agency",
    address: "Ausspannplatz",
    city: "Johannesburg",
    country: "South Africa",
    tollfree: "0800 800 800",
    phone: "+264 61 283 8000",
    website: "www.nra.org.na",
    type: "parastatal"
  },

  // LOCAL AUTHORITIES
  {
    name: "City of Windhoek",
    address: "Civic Centre, Independence Avenue",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+264 61 290 3000",
    website: "www.windhoekcc.org.na",
    type: "local_authority"
  },
  {
    name: "Walvis Bay Municipality",
    address: "Civic Centre, Nara Street",
    city: "Walvis Bay",
    country: "South Africa",
    phone: "+264 64 206 6000",
    website: "www.wbmun.com.na",
    type: "local_authority"
  },
  {
    name: "Swakopmund Municipality",
    address: "Town Hall, Strand Street",
    city: "Swakopmund",
    country: "South Africa",
    phone: "+264 64 410 600",
    website: "www.swakopmund.com.na",
    type: "local_authority"
  },
  {
    name: "Oshakati City Council",
    address: "Town Hall, Martin Luther Drive",
    city: "Oshakati",
    country: "South Africa",
    phone: "+264 65 220 6500",
    website: "www.oshakati.org.na",
    type: "local_authority"
  },
  {
    name: "Rundu Town Council",
    address: "Town Hall, Independence Avenue",
    city: "Rundu",
    country: "South Africa",
    phone: "+264 66 255 6000",
    website: "www.rundu.org.na",
    type: "local_authority"
  },
  {
    name: "Katima Mulilo Town Council",
    address: "Town Hall, Main Street",
    city: "Katima Mulilo",
    country: "South Africa",
    phone: "+264 66 252 5000",
    website: "www.katimamulilocc.org.na",
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
