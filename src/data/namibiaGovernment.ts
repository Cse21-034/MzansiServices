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
  type: 'ministry'| 'parastatal' | 'agency' | 'local_authority' | 'utility' | 'other';
}

export const namibiaDirectory: DirectoryEntry[] = [
  // NATIONAL DEPARTMENTS - SOUTH AFRICA
  {
    name: "The Presidency",
    address: "Union Buildings, Government Avenue",
    city: "Pretoria",
    country: "South Africa",
    poBox: "P.O. Box 42",
    phone: "+27 12 300 3111",
    website: "www.thepresidency.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Finance",
    address: "440 Madiba Street, Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 315 5061",
    website: "www.treasury.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Home Affairs",
    address: "Silverton, Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 406 2524",
    website: "www.dha.gov.za",
    type: "ministry"
  },
  {
    name: "Department of International Relations and Cooperation",
    address: "460 Soutpansberg Road, Arcadia",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 351 1000",
    website: "www.dirco.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Justice and Constitutional Development",
    address: "670 Madiba Street, Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 315 1600",
    website: "www.justice.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Defence and Military Veterans",
    address: "Armscor Close, Centurion",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 355 1000",
    website: "www.defenceweb.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Police",
    address: "230 Pretorius Street, Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 393 5911",
    website: "www.saps.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Public Service and Administration",
    address: "468 Madiba Street, Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 314 7600",
    website: "www.dpsa.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Trade, Industry and Competition",
    address: "77 Meintjes Street, Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 394 0655",
    website: "www.thedtic.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Small Business Development",
    address: "Mulbarton, Johannesburg",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 717 7600",
    website: "www.dsbd.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Higher Education and Training",
    address: "Meiring Naude Road, Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 312 5400",
    website: "www.dhet.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Basic Education",
    address: "Sol Plaatje House, 222 Schoeman Street, Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 312 5000",
    website: "www.education.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Health",
    address: "Cnr Thabo Sehume & Rivonia Streets, Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 395 8000",
    website: "www.health.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Social Development",
    address: "Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 312 7600",
    website: "www.dsd.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Transport",
    address: "333 Pretorius Street, Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 309 8000",
    website: "www.dot.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Public Works and Infrastructure",
    address: "Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 406 7000",
    website: "www.dpw.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Agriculture, Land Reform and Rural Development",
    address: "Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 319 7911",
    website: "www.dalrrd.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Water and Sanitation",
    address: "Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 336 7500",
    website: "www.dws.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Forestry, Fisheries and the Environment",
    address: "Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 399 9991",
    website: "www.dffe.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Sports, Arts and Culture",
    address: "Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 304 5000",
    website: "www.dsac.gov.za",
    type: "ministry"
  },

  // STATE-OWNED ENTERPRISES (PARASTATALS)
  {
    name: "South African Airways (SAA)",
    address: "OR Tambo International Airport",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 921 0222",
    website: "www.flysaa.com",
    type: "parastatal"
  },
  {
    name: "Eskom Holdings SOC Ltd",
    address: "Megawatt Park, Maxwell Drive, Sunninghill",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 800 3111",
    website: "www.eskom.co.za",
    type: "parastatal"
  },
  {
    name: "Transnet National Ports Authority",
    address: "Durban",
    city: "Durban",
    country: "South Africa",
    phone: "+27 31 308 7911",
    website: "www.transnetnpa.net",
    type: "parastatal"
  },
  {
    name: "South African Railway Safety Regulator",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 309 8000",
    website: "www.rsr.org.za",
    type: "parastatal"
  },
  {
    name: "Telkom South Africa",
    address: "Johannesburg",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 10 220 1000",
    website: "www.telkom.co.za",
    type: "parastatal"
  },
  {
    name: "SACCI (South African Chamber of Commerce and Industry)",
    address: "Johannesburg",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 833 2859",
    website: "www.sacci.org.za",
    type: "agency"
  },
  {
    name: "SARS (South African Revenue Service)",
    address: "Cape Town",
    city: "Cape Town",
    country: "South Africa",
    phone: "+27 21 409 7000",
    website: "www.sars.gov.za",
    type: "agency"
  },
  {
    name: "Companies and Intellectual Property Commission (CIPC)",
    address: "Pretoria",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 394 9500",
    website: "www.cipc.co.za",
    type: "agency"
  },
  {
    name: "City of Johannesburg",
    address: "Braamfontein",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 375 5555",
    website: "www.joburg.org.za",
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
];
