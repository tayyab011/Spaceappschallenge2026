import JSZip from 'jszip';
import { NASA_MISSIONS } from '../data/nasaMissions';
//added with ai studio
export async function generateNasaMissionZip(): Promise<Blob> {
  const zip = new JSZip();

  // 1. Master Research Dossier in Markdown
  let markdownDossier = `# NASA FRONTIER: PLANETARY ROBOTIC EXPLORATION DOSSIER
**Compiled from Official NASA Archival Records, Science Reports, and Astromaterials Catalogues**
Generated: ${new Date().toISOString()}

---

## EXECUTIVE SUMMARY
This research dossier contains technical, geological, chemical, and historical documentation for eight of humanity's most transformative robotic planetary exploration missions. Each mission entry details the specific observations recorded by the spacecraft, the experimental instruments and methodologies employed, the definitive determinations reached by the scientific community, and the enduring impact on our understanding of the Solar System.

---
`;

  NASA_MISSIONS.forEach((m) => {
    markdownDossier += `
## ${m.number}. ${m.name} — ${m.missionFormalName}
* **Agency:** ${m.agency}
* **Launch Date:** ${m.launchDate}
* **Encounter / Arrival:** ${m.encounterOrArrivalDate}
* **Mission Duration:** ${m.missionDuration}
* **Target / Location:** ${m.targetDestination} — ${m.landingOrFlybyLocation}
* **Mission Architecture:** ${m.missionType === 'surface_rover' ? 'Surface Robotic Rover / Traverse' : 'Deep Space Orbital Flyby'}
* **Spacecraft Mass:** ${m.specs.vehicleMassKg} kg
* **Power Source:** ${m.specs.powerSource} (${m.specs.powerOutputWatts} W)
* **Communications:** ${m.specs.communications}
* **Mobility / Propulsion:** ${m.specs.mobilityOrPropulsion}

### Environmental Context
* **Surface Gravity:** ${m.environment.gravityMps2} m/s²
* **Atmosphere:** ${m.environment.atmosphereDescription}
* **Ambient Thermal Regime:** ${m.environment.ambientTempKelvin}
* **Diurnal Cycle:** ${m.environment.dayLength}

### Mission Briefing
${m.briefing}

### Scientific Instrumentation Payload
`;

    m.instruments.forEach((inst) => {
      markdownDossier += `
#### ${inst.name} (${inst.acronym})
* **Classification:** ${inst.type.toUpperCase()}
* **Purpose:** ${inst.purpose}
* **Description:** ${inst.description}
* **Target Elements / Phenomena:** ${inst.targetElementsOrPhenomena.join(', ')}
* **Measurement Units:** ${inst.dataUnit}
* **Primary Calibration Test:** ${inst.sampleTestName}
`;
    });

    markdownDossier += `
### Investigation Sites & Landmark Discoveries
`;

    m.sites.forEach((site, sIdx) => {
      markdownDossier += `
#### Site ${sIdx + 1}: ${site.name} (${site.subTitle})
* **Historical Date:** ${site.historicalDate}
* **Geological Feature:** ${site.geologicFeature}
* **Primary Instrument:** ${site.primaryInstrumentId}

##### 1. What the Spacecraft Observed
${site.observations.summary}
${site.observations.empiricalPoints.map((p) => `- ${p}`).join('\n')}

##### 2. How It Measured It
${site.measurementMethod.summary}
* **Instruments Utilized:** ${site.measurementMethod.instrumentsUsed.join(', ')}
* **Test Protocols:**
${site.measurementMethod.testProtocol.map((p) => `  - ${p}`).join('\n')}

##### 3. What Scientists Determined
${site.scientificDeterminations.summary}
* **Key Conclusions:**
${site.scientificDeterminations.keyConclusions.map((c) => `  - ${c}`).join('\n')}
${
  site.scientificDeterminations.chemicalFormulasOrModels && site.scientificDeterminations.chemicalFormulasOrModels.length > 0
    ? `* **Chemical Formulas & Physical Models:**\n${site.scientificDeterminations.chemicalFormulasOrModels.map((f) => `  - \`${f}\``).join('\n')}`
    : ''
}

##### 4. Why It Matters to Humanity
${site.whyItMatters.summary}
${site.whyItMatters.impactOnScience.map((imp) => `- ${imp}`).join('\n')}

##### Primary NASA Sources & Citations
${site.nasaSources.map((src) => `- **${src.title}** (${src.citation})`).join('\n')}
`;
    });

    markdownDossier += `
### Historical Significance
${m.historicalSignificance}

### NASA Primary Source Citation
${m.nasaPrimarySource}

---
`;
  });

  zip.file('NASA_Frontier_Research_Dossier.md', markdownDossier);

  // 2. Machine-Readable JSON Database
  zip.file('nasa_missions_dataset.json', JSON.stringify(NASA_MISSIONS, null, 2));

  // 3. Spectral Datasets Folder with CSVs
  const spectraFolder = zip.folder('empirical_spectral_datasets');
  if (spectraFolder) {
    NASA_MISSIONS.forEach((m) => {
      m.instruments.forEach((inst) => {
        const spec = inst.referenceSpectra;
        let csv = `x_${spec.xLabel.replace(/[^a-zA-Z0-9]/g, '_')},y_${spec.yLabel.replace(/[^a-zA-Z0-9]/g, '_')},annotation\n`;
        spec.points.forEach((pt) => {
          csv += `${pt.x},${pt.y},"${pt.label || ''}"\n`;
        });
        spectraFolder.file(`${m.id}_${inst.id}_spectrum.csv`, csv);
      });
    });
  }

  // 4. Standalone Offline HTML Explorer
  const offlineHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NASA Frontier: Offline Mission Archive</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #07090e; color: #e2e8f0; line-height: 1.6; margin: 0; padding: 2rem; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { color: #f8fafc; border-bottom: 2px solid #06b6d4; padding-bottom: 0.5rem; font-size: 2rem; }
    h2 { color: #38bdf8; margin-top: 2rem; }
    h3 { color: #f59e0b; }
    .card { background: #111827; border: 1px solid #1e293b; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .badge { display: inline-block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #06b6d4; font-family: monospace; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
    th, td { text-align: left; padding: 0.5rem; border-bottom: 1px solid #1e293b; }
    th { color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>NASA FRONTIER: PLANETARY ROBOTIC EXPLORATION</h1>
    <p>Offline Scientific Reference Archive & Laboratory Telemetry Data.</p>
    ${NASA_MISSIONS.map(
      (m) => `
      <div class="card">
        <span class="badge">Mission #${m.number} · ${m.agency}</span>
        <h2>${m.name} — ${m.missionFormalName}</h2>
        <p><strong>Target:</strong> ${m.targetDestination} (${m.landingOrFlybyLocation})</p>
        <p><strong>Encounter:</strong> ${m.encounterOrArrivalDate}</p>
        <p>${m.briefing}</p>
        <h3>Primary Discoveries & Determinations</h3>
        <ul>
          ${m.sites.map((s) => `<li><strong>${s.name}:</strong> ${s.scientificDeterminations.summary}</li>`).join('')}
        </ul>
        <p style="font-size: 0.85rem; color: #94a3b8;"><strong>Primary Source:</strong> ${m.nasaPrimarySource}</p>
      </div>
    `
    ).join('')}
  </div>
</body>
</html>`;

  zip.file('offline_archive_reader.html', offlineHtml);

  // 5. Readme
  const readme = `NASA FRONTIER EXPLORATION ARCHIVE
====================================
Dataset Version: 2026.1-Official
Data Grounding: NASA Jet Propulsion Laboratory (JPL), NASA Goddard Space Flight Center (GSFC), NASA Ames Research Center (ARC), and NASA Johnson Space Center (JSC) Astromaterials Curatorial Facility.

CONTENTS:
1. NASA_Frontier_Research_Dossier.md — Complete scientific reference document
2. nasa_missions_dataset.json — Raw structured data
3. empirical_spectral_datasets/ — Instrument spectra CSVs (APXS, Mössbauer, Magnetometer, Plasma)
4. offline_archive_reader.html — Portable offline HTML browser

All observations, instrument measurements, scientific determinations, and citations follow verified NASA planetary mission historical reports.
`;
  zip.file('README.txt', readme);

  return await zip.generateAsync({ type: 'blob' });
}
