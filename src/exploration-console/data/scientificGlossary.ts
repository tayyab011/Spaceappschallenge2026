export interface GlossaryTerm {
  term: string;
  shortName: string;
  simpleExplanation: string;
  analogyOrExample: string;
  usedInMissions: string[];
}

export const SCIENTIFIC_GLOSSARY: Record<string, GlossaryTerm> = {
  apxs: {
    term: 'Alpha Particle X-ray Spectrometer (APXS)',
    shortName: 'APXS Sensor',
    simpleExplanation: 'A small contact sensor placed against rocks that fires harmless radioactive particles into the rock to detect every single chemical element present (such as iron, sulfur, chlorine, and silicon).',
    analogyOrExample: 'Like a chemical barcode scanner for rocks on alien worlds.',
    usedInMissions: ['Sojourner', 'Spirit', 'Opportunity'],
  },
  mossbauer: {
    term: 'Mössbauer Spectrometer',
    shortName: 'Mössbauer Instrument',
    simpleExplanation: 'A specialized physics instrument that investigates how iron atoms are arranged inside minerals, revealing if the rock rusted in ancient liquid water or was created dry inside lava.',
    analogyOrExample: 'Like an MRI scan specifically tuned to read the oxidation history of iron.',
    usedInMissions: ['Spirit', 'Opportunity'],
  },
  rat: {
    term: 'Rock Abrasion Tool (RAT)',
    shortName: 'RAT Grinder',
    simpleExplanation: 'A diamond-toothed motorized grinding wheel mounted on the rover robotic arm that cuts away the weathered, dusty outer millimeter of a rock to expose fresh interior rock.',
    analogyOrExample: 'Like a planetary dentist drill that cleans off billions of years of cosmic weathering.',
    usedInMissions: ['Spirit', 'Opportunity'],
  },
  microscopic_imager: {
    term: 'Microscopic Imager',
    shortName: 'Hand-Lens Microscope',
    simpleExplanation: 'An extreme macro lens camera that captures tiny mineral grains, crystal structures, and spherical sediment beads at the thickness of a human hair.',
    analogyOrExample: 'Like a geologist magnifying hand-lens examining grain boundaries on the spot.',
    usedInMissions: ['Spirit', 'Opportunity'],
  },
  anorthosite: {
    term: 'Anorthosite (Genesis Rock)',
    shortName: 'Anorthosite',
    simpleExplanation: 'A rare, pale, crystal-rich rock formed over 4 billion years ago when the entire infant Moon was a molten ocean of magma. Light minerals floated to the top to form the original lunar crust.',
    analogyOrExample: 'Like ice cubes floating to the surface of a freezing pond—the primordial crust of the Moon.',
    usedInMissions: ['Apollo 15'],
  },
  jarosite: {
    term: 'Jarosite Mineral',
    shortName: 'Jarosite',
    simpleExplanation: 'A potassium and iron sulfate mineral that can only grow and crystallize inside acidic standing or slow-moving liquid water.',
    analogyOrExample: 'Proof that liquid water was present long enough to dissolve and precipitate mineral salts.',
    usedInMissions: ['Opportunity'],
  },
  hematite_blueberries: {
    term: 'Hematite Concretions ("Blueberries")',
    shortName: 'Hematite Blueberries',
    simpleExplanation: 'Millions of miniature 1-to-4 millimeter iron-rich spheres that precipitated out of groundwater soaking porous sedimentary sand on ancient Mars.',
    analogyOrExample: 'Similar to how pearls form layer-by-layer inside an oyster, these formed inside water-soaked sandstone.',
    usedInMissions: ['Opportunity'],
  },
  goethite: {
    term: 'Goethite',
    shortName: 'Goethite Mineral',
    simpleExplanation: 'An iron-bearing hydroxide mineral with chemically bonded water molecules (H-O-Fe). It cannot form without liquid water.',
    analogyOrExample: 'Mineral proof of water locked directly into the crystalline structure of the stone.',
    usedInMissions: ['Spirit'],
  },
  silica: {
    term: 'Hydrothermal Silica Deposit',
    shortName: 'Pure Silica Bed',
    simpleExplanation: 'Bright white patches of 90%+ pure silica uncovered when Spirit dragged a stuck front wheel. It formed in ancient volcanic hot springs or acidic steam vents.',
    analogyOrExample: 'Identical to the mineral deposits found around geysers in Yellowstone National Park on Earth.',
    usedInMissions: ['Spirit'],
  },
  solar_wind: {
    term: 'Solar Wind',
    shortName: 'Solar Wind',
    simpleExplanation: 'A continuous, supersonic stream of charged particles (protons, electrons, and helium ions) released from the Sun’s upper atmosphere into interplanetary space.',
    analogyOrExample: 'An invisible cosmic breeze radiating outward from the Sun at hundreds of miles per second.',
    usedInMissions: ['Luna 1', 'Pioneer 10', 'Voyager 1'],
  },
  ion_trap: {
    term: 'Charged Particle Ion Trap',
    shortName: 'Ion Trap',
    simpleExplanation: 'An electrical sensor that uses charged metal grids to catch and measure the speed, number, and electrical charge of particles flying through space.',
    analogyOrExample: 'A robotic net that counts charged atoms flying past the spacecraft.',
    usedInMissions: ['Luna 1'],
  },
  magnetometer: {
    term: 'Fluxgate Magnetometer',
    shortName: 'Magnetometer',
    simpleExplanation: 'A precision sensor that detects the strength and direction of magnetic fields in space or around planetary bodies.',
    analogyOrExample: 'An ultra-sensitive 3D compass that measures whether a planet has an active molten core shield.',
    usedInMissions: ['Luna 1', 'Pioneer 10', 'Pioneer 11', 'Voyager 1'],
  },
  spectrometer: {
    term: 'Spectrometer',
    shortName: 'Spectrometer',
    simpleExplanation: 'A device that breaks light, X-rays, or gamma rays into different wavelengths to identify what elements make up an object without touching it.',
    analogyOrExample: 'Like listening to a musical chord and being able to identify every single individual note.',
    usedInMissions: ['Sojourner', 'Spirit', 'Opportunity', 'Voyager 1'],
  },
};
