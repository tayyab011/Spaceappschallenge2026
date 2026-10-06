import { ScienceSite, MineralProportion } from '../types';

export interface CosmoSiteEnrichment {
  plainEnglishTitle: string;
  plainEnglishDiscovery: string;
  purityScore: number;
  radiationLevelUsSv: number;
  densityCurve: {
    min: number;
    current: number;
    max: number;
    unit: string;
    points: number[];
  };
  mineralRatio: MineralProportion[];
  breakdownLabel?: string;
  wireframeLayers: string[];
}

export const COSMO_SITE_DATA: Record<string, CosmoSiteEnrichment> = {
  'oppy-blueberries': {
    plainEnglishTitle: 'Ancient Standing Water & "Blueberries"',
    plainEnglishDiscovery: 'Millions of miniature iron spheres ("blueberries") and sulfate crystals prove that acidic liquid groundwater once soaked this entire Martian plain.',
    purityScore: 78,
    radiationLevelUsSv: 0.7,
    densityCurve: {
      min: 1.2,
      current: 3.4,
      max: 7.9,
      unit: 'g/cm³',
      points: [4, 8, 14, 28, 55, 84, 98, 76, 52, 34, 22, 14, 8, 4],
    },
    mineralRatio: [
      {
        name: 'Hematite (of Iron Phases)',
        formula: 'Fe₂O₃',
        percentage: 35,
        color: '#f59e0b',
        simpleExplanation: 'Spherules that grew inside wet rock pores over thousands of years.',
      },
      {
        name: 'Jarosite (of Iron Phases)',
        formula: 'KFe₃(SO₄)₂(OH)₆',
        percentage: 28,
        color: '#eab308',
        simpleExplanation: 'Water-bearing sulfate salt; impossible to form in dry conditions.',
      },
      {
        name: 'Other Iron Oxide (of Iron Phases)',
        formula: 'FeO(OH) / mixed',
        percentage: 19,
        color: '#fb923c',
        simpleExplanation: 'A related secondary iron oxide phase identified alongside hematite and jarosite.',
      },
      {
        name: 'Other Non-Iron Phases',
        formula: 'Basalt / Silicate Matrix',
        percentage: 18,
        color: '#94a3b8',
        simpleExplanation: 'Remaining rock matrix outside the iron-bearing mineral fraction.',
      },
    ],
    wireframeLayers: ['Regolith Sand', 'Hematite Spherules', 'Jarosite Bedrock', 'Basalt Base'],
  },
  'oppy-jarosite-vugs': {
    plainEnglishTitle: 'Rippled Waves of an Ancient Martian Lake',
    plainEnglishDiscovery: 'Smiling festoon layers in the bedrock prove gentle ripples of liquid water flowed across the surface, rather than wind alone.',
    purityScore: 82,
    radiationLevelUsSv: 0.65,
    densityCurve: {
      min: 1.1,
      current: 2.9,
      max: 6.4,
      unit: 'g/cm³',
      points: [6, 12, 24, 45, 75, 92, 88, 64, 42, 28, 16, 8, 5],
    },
    mineralRatio: [
      {
        name: 'Sulfate Salts / Alteration Phase',
        formula: 'Jarosite / MgSO₄ / Fe-Sulfates',
        percentage: 40,
        color: '#38bdf8',
        simpleExplanation: 'Dissolved minerals left behind when acidic water evaporated.',
      },
      {
        name: 'Basaltic Silicates (Primary Minerals)',
        formula: 'Pyroxene / Feldspar',
        percentage: 50,
        color: '#cbd5e1',
        simpleExplanation: 'Primary minerals remaining from the parent basalt rock.',
      },
      {
        name: 'Iron Oxides / Hematite',
        formula: 'Fe₂O₃',
        percentage: 10,
        color: '#f97316',
        simpleExplanation: 'Secondary iron oxide phase cementing the sedimentary layers together.',
      },
    ],
    wireframeLayers: ['Eolian Dust', 'Ripple Laminae', 'Evaporite Salts', 'Subsurface Hardpan'],
  },
  'spirit-clovis-rock': {
    plainEnglishTitle: 'Water-Soaked Bedrock on Husband Hill',
    plainEnglishDiscovery: 'The Mössbauer spectrometer detected goethite inside the rock—a rust mineral containing chemically bound water molecules.',
    purityScore: 71,
    radiationLevelUsSv: 0.68,
    densityCurve: {
      min: 1.5,
      current: 3.2,
      max: 5.8,
      unit: 'g/cm³',
      points: [5, 10, 20, 38, 62, 86, 94, 72, 48, 30, 18, 10, 6],
    },
    mineralRatio: [
      {
        name: 'Goethite (of Iron Phases)',
        formula: 'α-FeO(OH)',
        percentage: 12,
        color: '#f59e0b',
        simpleExplanation: 'Direct evidence water soaked into and chemically altered this mountain rock.',
      },
      {
        name: 'Unaltered Basaltic Minerals',
        formula: '(Mg,Fe)₂SiO₄ (Pyroxene/Olivine)',
        percentage: 55,
        color: '#64748b',
        simpleExplanation: 'Unaltered basaltic minerals from the original volcano.',
      },
      {
        name: 'Halogens & Salts (Cl/Br)',
        formula: 'Cl / Br',
        percentage: 3,
        color: '#22c55e',
        simpleExplanation: 'Trace halogen salts concentrated by mineral fluids seeping through the hills.',
      },
      {
        name: 'Sulfate & Other Secondary Phases',
        formula: 'SO₃ / Mixed',
        percentage: 30,
        color: '#06b6d4',
        simpleExplanation: 'Remaining secondary alteration minerals and matrix material.',
      },
    ],
    wireframeLayers: ['Columbia Soil', 'Goethite Rind', 'Pitted Basalt', 'Unaltered Core'],
  },
  'spirit-silica-patch': {
    plainEnglishTitle: 'Hydrothermal Hot Spring (Like Yellowstone)',
    plainEnglishDiscovery: 'Accidentally unearthed 90% pure opaline silica—identical to mineral deposits created by hot spring geysers and volcanic steam vents on Earth.',
    purityScore: 91,
    radiationLevelUsSv: 0.62,
    densityCurve: {
      min: 1.0,
      current: 2.1,
      max: 4.5,
      unit: 'g/cm³',
      points: [8, 16, 32, 60, 88, 100, 85, 55, 30, 18, 10, 4],
    },
    mineralRatio: [
      {
        name: 'Pure Opaline Silica',
        formula: 'SiO₂ · nH₂O',
        percentage: 91,
        color: '#e2e8f0',
        simpleExplanation: 'Requires massive boiling water circulation to concentrate to 90% purity.',
      },
      {
        name: 'Volcanic Fumarole Salts',
        formula: 'Ti / Fe',
        percentage: 6,
        color: '#eab308',
        simpleExplanation: 'Leached by acidic volcanic steam plumes.',
      },
      {
        name: 'Carbonate Minerals',
        formula: 'MgCO₃',
        percentage: 3,
        color: '#06b6d4',
        simpleExplanation: 'Neutral water carbonates indicating benign, non-acidic conditions.',
      },
    ],
    wireframeLayers: ['Furrow Dust', '90% Opaline Silica', 'Steam Vent Breccia', 'Volcanic Ash'],
  },

  'apollo15-spur-crater': {
    plainEnglishTitle: 'The Genesis Rock (Primordial Lunar Crust)',
    plainEnglishDiscovery: 'Scott & Irwin discovered a dazzling 4.1-billion-year-old anorthosite rock, proving the newborn Moon was once entirely covered by a molten magma ocean.',
    purityScore: 98,
    radiationLevelUsSv: 1.2,
    densityCurve: {
      min: 2.1,
      current: 2.76,
      max: 3.4,
      unit: 'g/cm³',
      points: [2, 5, 12, 35, 78, 100, 75, 30, 10, 4],
    },
    mineralRatio: [
      {
        name: 'Plagioclase Feldspar (Anorthite)',
        formula: 'CaAl₂Si₂O₈',
        percentage: 98,
        color: '#f8fafc',
        simpleExplanation: 'Light mineral that floated to the surface of the molten Moon ocean like icebergs.',
      },
      {
        name: 'Pyroxene',
        formula: '(Ca,Mg,Fe)SiO₃',
        percentage: 1.5,
        color: '#64748b',
        simpleExplanation: 'Denser mineral from the lunar mantle.',
      },
      {
        name: 'Green Volcanic Glass',
        formula: 'Bead Ejecta',
        percentage: 0.5,
        color: '#10b981',
        simpleExplanation: 'Fired from 400km deep volcanic fire fountains.',
      },
    ],
    wireframeLayers: ['Lunar Soil Fines', 'Genesis Rock Anorthosite', 'Impact Breccia', 'Magma Ocean Crust'],
  },
  'apollo15-hadley-rille': {
    plainEnglishTitle: 'Hadley Rille (Giant Collapsed Lava Tube)',
    plainEnglishDiscovery: 'Surveyed a 300-meter deep, 1.5-km wide canyon, showing layered cliffs formed by super-hot, runny lava torrents 3.3 billion years ago.',
    purityScore: 84,
    radiationLevelUsSv: 1.15,
    densityCurve: {
      min: 2.4,
      current: 3.15,
      max: 3.8,
      unit: 'g/cm³',
      points: [4, 10, 22, 50, 85, 96, 78, 45, 20, 8],
    },
    mineralRatio: [
      {
        name: 'Pigeonite Basalt',
        formula: 'Fe / Mg Silicate',
        percentage: 54,
        color: '#475569',
        simpleExplanation: 'Cooled volcanic flood rock forming the canyon walls.',
      },
      {
        name: 'Plagioclase Feldspar',
        formula: 'CaAl₂Si₂O₈',
        percentage: 36,
        color: '#94a3b8',
        simpleExplanation: 'Interlocking crystal lattice of the mare plains.',
      },
      {
        name: 'Ilmenite (Titanium Ore)',
        formula: 'FeTiO₃',
        percentage: 10,
        color: '#06b6d4',
        simpleExplanation: 'High titanium content characteristic of lunar mare lavas.',
      },
    ],
    wireframeLayers: ['Talus Debris', 'Upper Basalt Unit', 'Columnar Jointing', 'Gorge Base'],
  },

  'sojourner-barnacle-bill': {
    plainEnglishTitle: 'First Chemical Scan of a Martian Rock',
    plainEnglishDiscovery: 'Sojourner used alpha particles and X-rays to discover high silica andesite, proving Mars had diverse volcanoes and recycled crust.',
    purityScore: 72,
    radiationLevelUsSv: 0.65,
    densityCurve: {
      min: 1.8,
      current: 2.85,
      max: 4.2,
      unit: 'g/cm³',
      points: [6, 14, 28, 55, 86, 95, 75, 48, 25, 12],
    },
    mineralRatio: [
      {
        name: 'Andesitic Silica',
        formula: 'SiO₂',
        percentage: 58,
        color: '#e2e8f0',
        simpleExplanation: 'Indicates repeated crustal remelting inside early Mars.',
      },
      {
        name: 'Iron Oxide',
        formula: 'FeO',
        percentage: 13,
        color: '#ea580c',
        simpleExplanation: 'Typical Martian iron concentration in volcanic flows.',
      },
      {
        name: 'Alumina & Magnesium',
        formula: 'Al₂O₃ / MgO',
        percentage: 29,
        color: '#94a3b8',
        simpleExplanation: 'Silicate framework of the flood basin gravel.',
      },
    ],
    wireframeLayers: ['Fine Surface Dust', 'Barnacle Bill Andesite', 'Flood Gravel', 'Scour Channel'],
  },
  'sojourner-yogi-rock': {
    plainEnglishTitle: 'Catastrophic Outflow Flood Mega-Boulder',
    plainEnglishDiscovery: 'Two-meter high boulder leaned in the downstream direction with a moat carved by water, proving torrents washed through Ares Vallis.',
    purityScore: 68,
    radiationLevelUsSv: 0.66,
    densityCurve: {
      min: 1.6,
      current: 2.9,
      max: 4.6,
      unit: 'g/cm³',
      points: [5, 12, 26, 52, 80, 92, 70, 42, 20, 8],
    },
    mineralRatio: [
      {
        name: 'Basaltic Andesite',
        formula: 'Silicate Melt',
        percentage: 62,
        color: '#64748b',
        simpleExplanation: 'Transported hundreds of kilometers from southern highlands.',
      },
      {
        name: 'Sulfur-Rich Soil Dust',
        formula: 'SO₃ / Cl',
        percentage: 22,
        color: '#facc15',
        simpleExplanation: 'Martian dust coating accumulated over eons.',
      },
      {
        name: 'Iron Minerals',
        formula: 'Fe₂O₃',
        percentage: 16,
        color: '#c2410c',
        simpleExplanation: 'Weathered iron mineral coating on rock faces.',
      },
    ],
    wireframeLayers: ['Wind Drift Soil', 'Yogi Boulder', 'Scour Moat Sand', 'Ancient Flood Bed'],
  },
  'luna1-trans-lunar': {
    plainEnglishTitle: 'First Detection of the Solar Wind',
    plainEnglishDiscovery: 'Direct spacecraft sensors confirmed the Sun continuously sends a supersonic stream of charged plasma out into space, shaping the entire Solar System.',
    purityScore: 99,
    radiationLevelUsSv: 4.5,
    densityCurve: {
      min: 0.1,
      current: 5.0,
      max: 12.0,
      unit: 'protons/cm³',
      points: [2, 8, 25, 60, 95, 100, 85, 45, 18, 5],
    },
    mineralRatio: [
      {
        name: 'Protons (Ionized Hydrogen)',
        formula: 'H⁺',
        percentage: 95,
        color: '#38bdf8',
        simpleExplanation: 'Primary supersonic component expelled by the solar corona.',
      },
      {
        name: 'Alpha Particles (Helium)',
        formula: 'He²⁺',
        percentage: 4.5,
        color: '#f59e0b',
        simpleExplanation: 'Helium nuclei flowing outward from the Sun.',
      },
      {
        name: 'Heavy Solar Plasma Ions',
        formula: 'O, C, Fe',
        percentage: 0.5,
        color: '#ec4899',
        simpleExplanation: 'Trace elements stripped of electrons in the solar wind.',
      },
    ],
    wireframeLayers: ['Plasmasphere', 'Magnetopause', 'Bow Shock', 'Interplanetary Wind'],
  },
  'luna1-lunar-flyby': {
    plainEnglishTitle: 'Moon Has No Global Magnetic Field',
    plainEnglishDiscovery: 'Passing within 5,995 km of the Moon, Luna 1 proved the Moon lacks an active liquid core dynamo or global magnetic field.',
    purityScore: 92,
    radiationLevelUsSv: 2.1,
    breakdownLabel: 'Magnetic Field Measurements',
    densityCurve: {
      min: 0.0,
      current: 5.4,
      max: 50.0,
      unit: 'nanoTesla (nT)',
      points: [5, 15, 30, 65, 88, 70, 45, 25, 10],
    },
    mineralRatio: [
      {
        name: 'Interplanetary Magnetic Field',
        formula: 'IMF B-Vector',
        percentage: 98,
        color: '#a855f7',
        simpleExplanation: 'Ambient solar magnetic field undisturbed by the Moon.',
      },
      {
        name: 'Lunar Crustal Anomalies',
        formula: 'Residual Remanence',
        percentage: 2,
        color: '#64748b',
        simpleExplanation: 'Localized fossil magnetic patches in impact basins.',
      },
    ],
    wireframeLayers: ['Deep Space Vacuum', 'Lunar Cislunar Path', '5995km Periapsis', 'Unmagnetized Regolith'],
  },

  'pioneer10-asteroid-belt': {
    plainEnglishTitle: 'Surviving the Asteroid Belt',
    plainEnglishDiscovery: 'First spacecraft to fly through the asteroid belt without colliding with debris, proving safe navigation for future missions to outer planets.',
    purityScore: 88,
    radiationLevelUsSv: 1.8,
    densityCurve: {
      min: 0.0,
      current: 1.2,
      max: 5.0,
      unit: 'particles/m³',
      points: [10, 25, 55, 90, 80, 50, 20, 8],
    },
    mineralRatio: [
      {
        name: 'Silicate Asteroid Dust',
        formula: 'Chondritic Dust',
        percentage: 75,
        color: '#cbd5e1',
        simpleExplanation: 'Microscopic cosmic dust grains.',
      },
      {
        name: 'Carbonaceous Particles',
        formula: 'C-type Debris',
        percentage: 20,
        color: '#475569',
        simpleExplanation: 'Organic-rich ancient solar nebula material.',
      },
      {
        name: 'Iron-Nickel Grains',
        formula: 'Fe-Ni',
        percentage: 5,
        color: '#f59e0b',
        simpleExplanation: 'Metallic fragments from shattered asteroid cores.',
      },
    ],
    wireframeLayers: ['Inner Belt (2.2 AU)', 'Asteroid Concentration', 'Zodiacal Cloud', 'Outer Belt (3.3 AU)'],
  },
  'pioneer10-radiation-encounter': {
    plainEnglishTitle: 'Jupiter Intense Radiation Environment',
    plainEnglishDiscovery: 'Measured Jupiter colossal magnetic shield—larger than the Sun in our sky—and survived radiation 10,000 times stronger than Earth belts.',
    purityScore: 94,
    radiationLevelUsSv: 18.5,
    densityCurve: {
      min: 10,
      current: 1400,
      max: 10000,
      unit: 'rads/hr',
      points: [5, 12, 35, 75, 100, 92, 60, 25, 8],
    },
    mineralRatio: [
      {
        name: 'Trapped Relativistic Electrons',
        formula: 'e⁻ (MeV)',
        percentage: 65,
        color: '#06b6d4',
        simpleExplanation: 'Spun at high velocity by Jupiter magnetic dynamo.',
      },
      {
        name: 'Energetic Protons',
        formula: 'p⁺ (MeV)',
        percentage: 30,
        color: '#f43f5e',
        simpleExplanation: 'Trapped inside inner radiation belts.',
      },
      {
        name: 'Sulfur & Oxygen Ions',
        formula: 'S⁺ / O⁺',
        percentage: 5,
        color: '#eab308',
        simpleExplanation: 'Escaped volcanic gas from moon Io ionized in Jupiter magnetosphere.',
      },
    ],
    wireframeLayers: ['Bow Shock (108 Rj)', 'Magnetopause', 'Radiation Belt Core', 'Jovian Cloud Deck'],
  },

  'voyager1-io-volcanoes': {
    plainEnglishTitle: 'Active Volcanoes on Moon Io',
    plainEnglishDiscovery: 'Discovered that Jupiter moon Io is the most volcanically active world in the Solar System, with explosive fountains shooting sulfur gas 300 km into space.',
    purityScore: 96,
    radiationLevelUsSv: 22.0,
    densityCurve: {
      min: 100,
      current: 650,
      max: 1800,
      unit: 'Kelvin',
      points: [4, 15, 45, 80, 100, 85, 50, 20, 6],
    },
    mineralRatio: [
      {
        name: 'Sulfur Dioxide Frost & Gas',
        formula: 'SO₂',
        percentage: 72,
        color: '#facc15',
        simpleExplanation: 'Frozen snow and erupting gas blanketing Io surface.',
      },
      {
        name: 'Elemental Sulfur Polymer',
        formula: 'S₈',
        percentage: 22,
        color: '#f97316',
        simpleExplanation: 'Creates Io vibrant yellow, orange, and red volcanic plains.',
      },
      {
        name: 'Ultramafic Silicate Magma',
        formula: 'High-Mg Lava',
        percentage: 6,
        color: '#ef4444',
        simpleExplanation: 'Extremely hot lavas (>1500°C) fueled by tidal gravity flexing.',
      },
    ],
    wireframeLayers: ['Io Surface Frost', 'Pele Volcanic Vent', '300km Plume Canopy', 'Plasma Torus'],
  },
  'voyager1-jupiter-ring': {
    plainEnglishTitle: "Jupiter's Faint Dusty Ring",
    plainEnglishDiscovery: "Voyager 1 discovered that Jupiter, like Saturn, has its own faint ring — a thin sheet of micrometer-sized dust grains kicked up from its inner moons.",
    purityScore: 90,
    radiationLevelUsSv: 0.8,
    breakdownLabel: 'Ring Dust Composition & Dynamics',
    densityCurve: {
      min: 0.0,
      current: 0.4,
      max: 1.0,
      unit: 'optical depth (τ)',
      points: [1, 5, 20, 65, 98, 100, 75, 25, 5],
    },
    mineralRatio: [
      {
        name: 'Amorphous Silicate Dust Grains',
        formula: 'SiO₂ (amorphous)',
        percentage: 85,
        color: '#cbd5e1',
        simpleExplanation: 'Micrometer-sized dust grains continuously blasted off inner moons like Metis and Adrastea.',
      },
      {
        name: 'Carbonaceous Dust & Weathered Debris',
        formula: 'Mixed Carbonaceous',
        percentage: 15,
        color: '#475569',
        simpleExplanation: 'Micrometeorite-processed debris darkened by long exposure to space.',
      },
    ],
    wireframeLayers: ['Halo Ring', 'Main Ring', 'Amalthea Gossamer Ring', 'Thebe Gossamer Ring'],
  },

  'pioneer11-f-ring': {
    plainEnglishTitle: 'Discovery of Saturn Narrow F Ring',
    plainEnglishDiscovery: 'First spacecraft to visit Saturn; passed within 21,000 km and discovered the narrow outer F Ring and shepherd moon Epimetheus.',
    purityScore: 95,
    radiationLevelUsSv: 0.75,
    breakdownLabel: 'Ring Composition & Material Phase',
    densityCurve: {
      min: 0.85,
      current: 0.92,
      max: 1.0,
      unit: 'g/cm³',
      points: [2, 8, 30, 75, 100, 70, 30, 8],
    },
    mineralRatio: [
      {
        name: 'Water Ice',
        formula: 'H₂O',
        percentage: 97,
        color: '#7dd3fc',
        simpleExplanation: 'Confined into a narrow ring by gravitational shepherd moons.',
      },
      {
        name: 'Silicate Dust Contaminants',
        formula: 'SiO₂',
        percentage: 3,
        color: '#eab308',
        simpleExplanation: 'Debris from collisions between small ring moons.',
      },
    ],
    wireframeLayers: ['Main Ring Outer Edge', 'Pioneer Gap', 'Narrow F-Ring Core', 'Shepherd Moon Orbit'],
  },
  'pioneer11-saturn-magnetosphere': {
    plainEnglishTitle: "Saturn's Near-Perfect Magnetic Axis",
    plainEnglishDiscovery: "Pioneer 11 found that, unlike Earth and Jupiter, Saturn's magnetic dipole axis is aligned almost perfectly with its rotational axis.",
    purityScore: 92,
    radiationLevelUsSv: 0.5,
    breakdownLabel: 'Magnetic Field & Plasma Environment',
    densityCurve: {
      min: 0,
      current: 22,
      max: 100,
      unit: 'nanoTesla (nT)',
      points: [5, 15, 40, 80, 100, 85, 45, 15],
    },
    mineralRatio: [
      {
        name: 'Magnetospheric Protons & Electrons',
        formula: 'p⁺ / e⁻',
        percentage: 90,
        color: '#38bdf8',
        simpleExplanation: 'Solar wind particles trapped and accelerated by Saturn\'s magnetic field.',
      },
      {
        name: 'Water-Derived Heavy Plasma Ions',
        formula: 'O⁺ / OH⁺ / H₂O⁺',
        percentage: 10,
        color: '#06b6d4',
        simpleExplanation: 'Heavy ions sourced from icy ring and moon material, ionized within the magnetosphere.',
      },
    ],
    wireframeLayers: ['Upper Tholin Haze', 'Bow Shock (24 Rs)', 'Dipole Field Lines', 'Titan Encounter'],
  },
};

export function getEnrichedSiteData(site: ScienceSite): ScienceSite & CosmoSiteEnrichment {
  const enrich = COSMO_SITE_DATA[site.id] || {
    plainEnglishTitle: site.name,
    plainEnglishDiscovery: site.scientificDeterminations.summary,
    purityScore: 78,
    radiationLevelUsSv: 0.7,
    densityCurve: {
      min: 1.2,
      current: 3.4,
      max: 7.9,
      unit: 'g/cm³',
      points: [4, 8, 14, 28, 55, 84, 98, 76, 52, 34, 22, 14, 8, 4],
    },
    mineralRatio: [
      {
        name: 'Primary Mineral Phase',
        formula: 'Fe / Si',
        percentage: 60,
        color: '#f59e0b',
        simpleExplanation: 'Major rock-forming mineral phase identified by spacecraft sensors.',
      },
      {
        name: 'Secondary Alteration Mineral',
        formula: 'Hydrated Oxides',
        percentage: 40,
        color: '#06b6d4',
        simpleExplanation: 'Formed through geological and atmospheric interactions.',
      },
    ],
    wireframeLayers: ['Surface Dust', 'Bedrock Regolith', 'Mineral Vein', 'Subsurface Core'],
  };

  return {
    ...site,
    ...enrich,
  };
}