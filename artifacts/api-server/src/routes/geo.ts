import { Router } from "express";
import { db, countries, regions, zones, woredas } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// ─── Hardcoded fallback geo data ─────────────────────────────────────────────

const FALLBACK_COUNTRIES = [
  { id: "eth", name: "Ethiopia", code: "ETH" },
  { id: "uga", name: "Uganda",   code: "UGA" },
  { id: "ken", name: "Kenya",    code: "KEN" },
];

const FALLBACK_REGIONS: Record<string, { id: string; name: string; countryId: string }[]> = {
  eth: [
    { id: "eth-tigray",   name: "Tigray",                                         countryId: "eth" },
    { id: "eth-afar",     name: "Afar",                                            countryId: "eth" },
    { id: "eth-amhara",   name: "Amhara",                                          countryId: "eth" },
    { id: "eth-oromia",   name: "Oromia",                                          countryId: "eth" },
    { id: "eth-somali",   name: "Somali",                                          countryId: "eth" },
    { id: "eth-bng",      name: "Benishangul-Gumuz",                               countryId: "eth" },
    { id: "eth-snnpr",    name: "South Ethiopia Peoples' Region (SNNPR)",          countryId: "eth" },
    { id: "eth-sidama",   name: "Sidama",                                          countryId: "eth" },
    { id: "eth-gambella", name: "Gambella",                                        countryId: "eth" },
    { id: "eth-harari",   name: "Harari",                                          countryId: "eth" },
    { id: "eth-addis",    name: "Addis Ababa City Administration",                 countryId: "eth" },
    { id: "eth-dire",     name: "Dire Dawa City Administration",                   countryId: "eth" },
    { id: "eth-central",  name: "Central Ethiopia",                                countryId: "eth" },
    { id: "eth-south",    name: "South Ethiopia",                                  countryId: "eth" },
    { id: "eth-southwest","name": "Southwest Ethiopia",                             countryId: "eth" },
  ],
  uga: [
    { id: "uga-central",  name: "Central Uganda",  countryId: "uga" },
    { id: "uga-eastern",  name: "Eastern Uganda",  countryId: "uga" },
    { id: "uga-northern", name: "Northern Uganda", countryId: "uga" },
    { id: "uga-western",  name: "Western Uganda",  countryId: "uga" },
  ],
  ken: [
    { id: "ken-nairobi",  name: "Nairobi County",    countryId: "ken" },
    { id: "ken-mombasa",  name: "Mombasa County",    countryId: "ken" },
    { id: "ken-kisumu",   name: "Kisumu County",     countryId: "ken" },
    { id: "ken-nakuru",   name: "Nakuru County",     countryId: "ken" },
    { id: "ken-eldoret",  name: "Uasin Gishu County",countryId: "ken" },
    { id: "ken-nyeri",    name: "Nyeri County",      countryId: "ken" },
    { id: "ken-meru",     name: "Meru County",       countryId: "ken" },
    { id: "ken-kakamega", name: "Kakamega County",   countryId: "ken" },
  ],
};

const FALLBACK_ZONES: Record<string, { id: string; name: string; regionId: string }[]> = {
  "eth-amhara": [
    { id: "amh-awi",       name: "Awi",                            regionId: "eth-amhara" },
    { id: "amh-egojjam",   name: "East Gojjam (Misraq Gojjam)",   regionId: "eth-amhara" },
    { id: "amh-wgojjam",   name: "West Gojjam (Mirab Gojjam)",    regionId: "eth-amhara" },
    { id: "amh-cgondar",   name: "Central Gondar",                 regionId: "eth-amhara" },
    { id: "amh-ngondar",   name: "North Gondar (Semien Gondar)",   regionId: "eth-amhara" },
    { id: "amh-sgondar",   name: "South Gondar (Debub Gondar)",    regionId: "eth-amhara" },
    { id: "amh-waghimra",  name: "Waghimra",                       regionId: "eth-amhara" },
    { id: "amh-nwello",    name: "North Wello (Semien Wello)",     regionId: "eth-amhara" },
    { id: "amh-swello",    name: "South Wello (Debub Wello)",      regionId: "eth-amhara" },
    { id: "amh-oromo-sp",  name: "Oromia Special Zone",            regionId: "eth-amhara" },
  ],
  "eth-oromia": [
    { id: "oro-arsi",      name: "Arsi",               regionId: "eth-oromia" },
    { id: "oro-bale",      name: "Bale",               regionId: "eth-oromia" },
    { id: "oro-borena",    name: "Borena",             regionId: "eth-oromia" },
    { id: "oro-ehararghe", name: "East Hararghe",      regionId: "eth-oromia" },
    { id: "oro-eshewa",    name: "East Shewa",         regionId: "eth-oromia" },
    { id: "oro-ewollega",  name: "East Wollega",       regionId: "eth-oromia" },
    { id: "oro-guji",      name: "Guji",               regionId: "eth-oromia" },
    { id: "oro-hgw",       name: "Horo Guduru Wollega",regionId: "eth-oromia" },
    { id: "oro-iab",       name: "Ilu Aba Bora",       regionId: "eth-oromia" },
    { id: "oro-jimma",     name: "Jimma",              regionId: "eth-oromia" },
    { id: "oro-kwellega",  name: "Kellem Wollega",     regionId: "eth-oromia" },
    { id: "oro-nshewa",    name: "North Shewa",        regionId: "eth-oromia" },
    { id: "oro-warsi",     name: "West Arsi",          regionId: "eth-oromia" },
    { id: "oro-whararghe", name: "West Hararghe",      regionId: "eth-oromia" },
    { id: "oro-wshewa",    name: "West Shewa",         regionId: "eth-oromia" },
    { id: "oro-wwollega",  name: "West Wollega",       regionId: "eth-oromia" },
  ],
  "eth-tigray": [
    { id: "tig-central",   name: "Central Tigray",     regionId: "eth-tigray" },
    { id: "tig-eastern",   name: "Eastern Tigray",     regionId: "eth-tigray" },
    { id: "tig-mekele",    name: "Mekele City",        regionId: "eth-tigray" },
    { id: "tig-north",     name: "North Western Tigray",regionId: "eth-tigray" },
    { id: "tig-south",     name: "Southern Tigray",    regionId: "eth-tigray" },
    { id: "tig-western",   name: "Western Tigray",     regionId: "eth-tigray" },
  ],
  "eth-snnpr": [
    { id: "snn-bench-sheko", name: "Bench Sheko",      regionId: "eth-snnpr" },
    { id: "snn-dawro",       name: "Dawro",            regionId: "eth-snnpr" },
    { id: "snn-gamo",        name: "Gamo",             regionId: "eth-snnpr" },
    { id: "snn-gofa",        name: "Gofa",             regionId: "eth-snnpr" },
    { id: "snn-hadiya",      name: "Hadiya",           regionId: "eth-snnpr" },
    { id: "snn-kambata",     name: "Kambata Tambaro",  regionId: "eth-snnpr" },
    { id: "snn-konso",       name: "Konso",            regionId: "eth-snnpr" },
    { id: "snn-wolayita",    name: "Wolayita",         regionId: "eth-snnpr" },
  ],
  "eth-afar": [
    { id: "afar-z1", name: "Zone 1 (Awsi Rasu)",  regionId: "eth-afar" },
    { id: "afar-z2", name: "Zone 2 (Kilbati Rasu)",regionId: "eth-afar" },
    { id: "afar-z3", name: "Zone 3 (Gabi Rasu)",  regionId: "eth-afar" },
    { id: "afar-z4", name: "Zone 4 (Fantena Rasu)",regionId: "eth-afar" },
    { id: "afar-z5", name: "Zone 5 (Hari Rasu)",  regionId: "eth-afar" },
  ],
  "eth-bng": [
    { id: "bng-assosa",    name: "Assosa",         regionId: "eth-bng" },
    { id: "bng-kamashi",   name: "Kamashi",        regionId: "eth-bng" },
    { id: "bng-metekel",   name: "Metekel",        regionId: "eth-bng" },
    { id: "bng-mao-komo",  name: "Mao-Komo",       regionId: "eth-bng" },
    { id: "bng-pawe",      name: "Pawe Special",   regionId: "eth-bng" },
  ],
  "eth-somali": [
    { id: "som-afder",    name: "Afder",           regionId: "eth-somali" },
    { id: "som-dawa",     name: "Dawa",            regionId: "eth-somali" },
    { id: "som-doolo",    name: "Doolo",           regionId: "eth-somali" },
    { id: "som-erer",     name: "Erer",            regionId: "eth-somali" },
    { id: "som-fafen",    name: "Fafen",           regionId: "eth-somali" },
    { id: "som-jarar",    name: "Jarar",           regionId: "eth-somali" },
    { id: "som-korahe",   name: "Korahe",          regionId: "eth-somali" },
    { id: "som-liban",    name: "Liban",           regionId: "eth-somali" },
    { id: "som-nogob",    name: "Nogob",           regionId: "eth-somali" },
    { id: "som-shabelle", name: "Shabelle",        regionId: "eth-somali" },
    { id: "som-shinile",  name: "Shinile",         regionId: "eth-somali" },
  ],
  "eth-gambella": [
    { id: "gam-agnewak",  name: "Agnewak",         regionId: "eth-gambella" },
    { id: "gam-itang",    name: "Itang Special",   regionId: "eth-gambella" },
    { id: "gam-majang",   name: "Majang",          regionId: "eth-gambella" },
    { id: "gam-nuer",     name: "Nuer",            regionId: "eth-gambella" },
  ],
  "uga-central": [
    { id: "uga-c-kampala",  name: "Kampala",        regionId: "uga-central" },
    { id: "uga-c-wakiso",   name: "Wakiso",         regionId: "uga-central" },
    { id: "uga-c-mukono",   name: "Mukono",         regionId: "uga-central" },
    { id: "uga-c-masaka",   name: "Masaka",         regionId: "uga-central" },
  ],
  "uga-eastern": [
    { id: "uga-e-jinja",    name: "Jinja",          regionId: "uga-eastern" },
    { id: "uga-e-mbale",    name: "Mbale",          regionId: "uga-eastern" },
    { id: "uga-e-soroti",   name: "Soroti",         regionId: "uga-eastern" },
  ],
  "uga-northern": [
    { id: "uga-n-gulu",     name: "Gulu",           regionId: "uga-northern" },
    { id: "uga-n-lira",     name: "Lira",           regionId: "uga-northern" },
    { id: "uga-n-arua",     name: "Arua",           regionId: "uga-northern" },
  ],
  "uga-western": [
    { id: "uga-w-fortportal", name: "Fort Portal",  regionId: "uga-western" },
    { id: "uga-w-mbarara",    name: "Mbarara",      regionId: "uga-western" },
    { id: "uga-w-kabale",     name: "Kabale",       regionId: "uga-western" },
  ],
  "ken-nairobi":  [{ id: "ken-nai-central", name: "Nairobi Central Sub-County",  regionId: "ken-nairobi" }],
  "ken-mombasa":  [{ id: "ken-mom-mvita",   name: "Mvita Sub-County",             regionId: "ken-mombasa" }],
  "ken-kisumu":   [{ id: "ken-kis-central", name: "Kisumu Central",               regionId: "ken-kisumu" }],
  "ken-nakuru":   [{ id: "ken-nak-central", name: "Nakuru Town East",             regionId: "ken-nakuru" }],
  "ken-eldoret":  [{ id: "ken-uag-east",    name: "Ainabkoi",                     regionId: "ken-eldoret" }],
};

const FALLBACK_WOREDAS: Record<string, { id: string; name: string; zoneId: string }[]> = {
  "amh-awi": [
    { id: "awi-ankesha",  name: "Ankesha",           zoneId: "amh-awi" },
    { id: "awi-banja",    name: "Banja",             zoneId: "amh-awi" },
    { id: "awi-dangila",  name: "Dangila Town",      zoneId: "amh-awi" },
    { id: "awi-fageta",   name: "Fageta Lekoma",     zoneId: "amh-awi" },
    { id: "awi-guangua",  name: "Guangua",           zoneId: "amh-awi" },
    { id: "awi-guagusa",  name: "Guagusa Shikudad",  zoneId: "amh-awi" },
    { id: "awi-jawi",     name: "Jawi",              zoneId: "amh-awi" },
    { id: "awi-sekela",   name: "Sekela",            zoneId: "amh-awi" },
  ],
  "amh-egojjam": [
    { id: "egoj-awabel",    name: "Awabel",             zoneId: "amh-egojjam" },
    { id: "egoj-baso",      name: "Baso Liben",         zoneId: "amh-egojjam" },
    { id: "egoj-bibugn",    name: "Bibugn",             zoneId: "amh-egojjam" },
    { id: "egoj-debre-eli", name: "Debre Elias",        zoneId: "amh-egojjam" },
    { id: "egoj-dmarkos",   name: "Debre Markos Town",  zoneId: "amh-egojjam" },
    { id: "egoj-dejene",    name: "Dejene",             zoneId: "amh-egojjam" },
    { id: "egoj-enemay",    name: "Enemay",             zoneId: "amh-egojjam" },
    { id: "egoj-machakel",  name: "Machakel",           zoneId: "amh-egojjam" },
    { id: "egoj-motta",     name: "Motta Town",         zoneId: "amh-egojjam" },
    { id: "egoj-hulet",     name: "Hulet Ej Enese",     zoneId: "amh-egojjam" },
    { id: "egoj-shebel",    name: "Shebel Berenta",     zoneId: "amh-egojjam" },
    { id: "egoj-sinan",     name: "Sinan",              zoneId: "amh-egojjam" },
  ],
  "amh-wgojjam": [
    { id: "wgoj-bahir-dar", name: "Bahir Dar City",     zoneId: "amh-wgojjam" },
    { id: "wgoj-bahir-zuria","name": "Bahir Dar Zuria",  zoneId: "amh-wgojjam" },
    { id: "wgoj-burie",     name: "Burie",              zoneId: "amh-wgojjam" },
    { id: "wgoj-dembecha",  name: "Dembecha",           zoneId: "amh-wgojjam" },
    { id: "wgoj-finote",    name: "Finote Selam Town",  zoneId: "amh-wgojjam" },
    { id: "wgoj-jabi",      name: "Jabi Tehnan",        zoneId: "amh-wgojjam" },
    { id: "wgoj-mecha",     name: "Mecha",              zoneId: "amh-wgojjam" },
    { id: "wgoj-yilmana",   name: "Yilmana Densa",      zoneId: "amh-wgojjam" },
  ],
  "amh-ngondar": [
    { id: "ngon-dabat",     name: "Dabat",              zoneId: "amh-ngondar" },
    { id: "ngon-gondar",    name: "Gondar City",        zoneId: "amh-ngondar" },
    { id: "ngon-gonder-z",  name: "Gonder Zuria",       zoneId: "amh-ngondar" },
    { id: "ngon-debark",    name: "Debark",             zoneId: "amh-ngondar" },
    { id: "ngon-libo",      name: "Libo Kemkem",        zoneId: "amh-ngondar" },
    { id: "ngon-takusa",    name: "Takusa",             zoneId: "amh-ngondar" },
    { id: "ngon-wogera",    name: "Wogera",             zoneId: "amh-ngondar" },
  ],
  "amh-sgondar": [
    { id: "sgon-debre-tab", name: "Debre Tabor Town",   zoneId: "amh-sgondar" },
    { id: "sgon-estie",     name: "Estie",              zoneId: "amh-sgondar" },
    { id: "sgon-fogera",    name: "Fogera",             zoneId: "amh-sgondar" },
    { id: "sgon-guna",      name: "Guna Begemidir",     zoneId: "amh-sgondar" },
    { id: "sgon-libo",      name: "Libo Kemkem",        zoneId: "amh-sgondar" },
    { id: "sgon-tach",      name: "Tach Gayint",        zoneId: "amh-sgondar" },
  ],
  "amh-nwello": [
    { id: "nwel-lalibela",  name: "Lalibela Town",      zoneId: "amh-nwello" },
    { id: "nwel-lasta",     name: "Lasta",              zoneId: "amh-nwello" },
    { id: "nwel-sekota",    name: "Sekota Town",        zoneId: "amh-nwello" },
    { id: "nwel-wag-hemra", name: "Wag Hemra",          zoneId: "amh-nwello" },
  ],
  "amh-swello": [
    { id: "swel-borumeda",  name: "Borumeda",           zoneId: "amh-swello" },
    { id: "swel-dessie",    name: "Dessie City",        zoneId: "amh-swello" },
    { id: "swel-kombolcha", name: "Kombolcha Town",     zoneId: "amh-swello" },
    { id: "swel-kalu",      name: "Kalu",               zoneId: "amh-swello" },
    { id: "swel-kutaber",   name: "Kutaber",            zoneId: "amh-swello" },
  ],
  "oro-arsi": [
    { id: "arsi-asella",    name: "Asella Town",        zoneId: "oro-arsi" },
    { id: "arsi-chole",     name: "Chole",              zoneId: "oro-arsi" },
    { id: "arsi-digalu",    name: "Digalu",             zoneId: "oro-arsi" },
    { id: "arsi-hetosa",    name: "Hetosa",             zoneId: "oro-arsi" },
    { id: "arsi-tiyo",      name: "Tiyo",               zoneId: "oro-arsi" },
  ],
  "oro-jimma": [
    { id: "jim-agaro",      name: "Agaro Town",         zoneId: "oro-jimma" },
    { id: "jim-gomma",      name: "Gomma",              zoneId: "oro-jimma" },
    { id: "jim-jimma",      name: "Jimma City",         zoneId: "oro-jimma" },
    { id: "jim-kersa",      name: "Kersa",              zoneId: "oro-jimma" },
    { id: "jim-limu",       name: "Limu Kosa",          zoneId: "oro-jimma" },
  ],
  "oro-eshewa": [
    { id: "eshewa-ada",     name: "Ada'a",              zoneId: "oro-eshewa" },
    { id: "eshewa-adama",   name: "Adama City",         zoneId: "oro-eshewa" },
    { id: "eshewa-akaki",   name: "Akaki",              zoneId: "oro-eshewa" },
    { id: "eshewa-boset",   name: "Boset",              zoneId: "oro-eshewa" },
    { id: "eshewa-lume",    name: "Lume",               zoneId: "oro-eshewa" },
  ],
  "tig-central": [
    { id: "tigc-ahferom",   name: "Ahferom",            zoneId: "tig-central" },
    { id: "tigc-adwa",      name: "Adwa",               zoneId: "tig-central" },
    { id: "tigc-axum",      name: "Axum City",          zoneId: "tig-central" },
    { id: "tigc-naeder",    name: "Naeder Adet",        zoneId: "tig-central" },
  ],
  "tig-mekele": [
    { id: "mek-ayder",      name: "Ayder",              zoneId: "tig-mekele" },
    { id: "mek-hawelti",    name: "Hawelti",            zoneId: "tig-mekele" },
    { id: "mek-kedamay",    name: "Kedamay Weyane",     zoneId: "tig-mekele" },
    { id: "mek-semha",      name: "Semha",              zoneId: "tig-mekele" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function tryDb<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

router.get("/geo/countries", async (_req, res) => {
  const data = await tryDb(
    () => db.select().from(countries),
    FALLBACK_COUNTRIES,
  );
  res.json(data);
});

router.get("/geo/regions", async (req, res) => {
  const { countryId } = req.query;
  if (!countryId) { res.json([]); return; }
  const data = await tryDb(
    () => db.select().from(regions).where(eq(regions.countryId, countryId as string)),
    FALLBACK_REGIONS[countryId as string] ?? [],
  );
  res.json(data);
});

router.get("/geo/zones", async (req, res) => {
  const { regionId } = req.query;
  if (!regionId) { res.json([]); return; }
  const data = await tryDb(
    () => db.select().from(zones).where(eq(zones.regionId, regionId as string)),
    FALLBACK_ZONES[regionId as string] ?? [],
  );
  res.json(data);
});

router.get("/geo/woredas", async (req, res) => {
  const { zoneId } = req.query;
  if (!zoneId) { res.json([]); return; }
  const data = await tryDb(
    () => db.select().from(woredas).where(eq(woredas.zoneId, zoneId as string)),
    FALLBACK_WOREDAS[zoneId as string] ?? [],
  );
  res.json(data);
});

export default router;
