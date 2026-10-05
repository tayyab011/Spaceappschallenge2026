export type Anchor = 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn';

export interface OrbiterItem {
  id: string;
  name: string;
  kind: 'Orbiter' | 'Flyby';
  target: string;
  last_contact: string;
  anchor: Anchor;
  story: string;
  status: 'operating' | 'silent' | 'ended-by-design' | 'deliberate-impact' | 'left-behind';
  location_state: 'on-surface' | 'orbiting-target' | 'solar-orbit' | 'leaving-solar-system' | 'impacted';
  current_status: string;
  hardware: string;
  verified: boolean;
  image: string;
  last_known_location?: string;
  why_left?: string;
  science_enabled?: string;
  sourceUrl?: string;
}

export const ORBITERS: OrbiterItem[] = [
  // 1. Viking 1 Orbiter
  {
    id: 'viking-1-orbiter',
    name: 'Viking 1 Orbiter',
    kind: 'Orbiter',
    target: 'Mars',
    anchor: 'mars',
    status: 'silent',
    location_state: 'orbiting-target',
    hardware: 'Mars orbiter with twin TV cameras, an infrared thermal mapper and an atmospheric water detector; it also relayed data from the Viking 1 lander',
    current_status: 'Not communicating; no active mission operations. Last known to be orbiting Mars.',
    last_contact: '17 August 1980',
    why_left: 'The orbiter ran out of attitude-control gas after more than four years at Mars, so it could no longer point its antenna and cameras. Controllers moved it to a higher orbit and shut it down; it stayed in orbit around Mars.',
    science_enabled: 'Photographed most of Mars in detail, mapped surface temperatures and atmospheric water vapor, and helped pick and support the Viking 1 landing site. It also took close-up images of the moon Phobos.',
    story: 'viking-1',
    verified: false,
    image: '/assets/objects/viking-1-lander.jpg',
    sourceUrl: "https://science.nasa.gov/mission/viking/",
  },

  // 2. Viking 2 Orbiter
  {
    id: 'viking-2-orbiter',
    name: 'Viking 2 Orbiter',
    kind: 'Orbiter',
    target: 'Mars',
    anchor: 'mars',
    status: 'silent',
    location_state: 'orbiting-target',
    hardware: 'Mars orbiter with twin TV cameras, an infrared thermal mapper and an atmospheric water detector; it also relayed data from the Viking 2 lander',
    current_status: 'Not communicating; no active mission operations. Last known to be orbiting Mars.',
    last_contact: '17 August 1980',
    why_left: 'A leak in the propulsion system used up the orbiter\'s attitude-control gas, so it could no longer be pointed reliably. It was moved to a higher orbit and shut down, and it stayed in orbit around Mars.',
    science_enabled: 'Photographed most of Mars in detail, mapped surface temperatures and atmospheric water vapor, and supported the Viking 2 lander. It also took close-up images of the moon Deimos.',
    story: 'viking-2',
    verified: false,
    image: '/assets/objects/viking-1-lander.jpg',
    sourceUrl: "https://science.nasa.gov/mission/viking/",
  },

  // 3. Mars Global Surveyor
  {
    id: 'mars-global-surveyor',
    name: 'Mars Global Surveyor',
    kind: 'Orbiter',
    target: 'Mars',
    anchor: 'mars',
    status: 'silent',
    location_state: 'orbiting-target',
    hardware: 'Mars orbiter with a high-resolution camera, a laser altimeter, a thermal emission spectrometer and a magnetometer',
    current_status: 'Not communicating; no active mission operations. Last known to be orbiting Mars.',
    last_contact: '2 November 2006',
    why_left: 'Contact was lost in November 2006 after a commanding error left the spacecraft in a bad orientation and its batteries overheated. NASA could not recover it, and it stayed in orbit around Mars.',
    science_enabled: 'Produced the first detailed global topographic map of Mars, found gullies and layered deposits that point to water, and detected magnetized crust. Its images also helped scout landing sites for later missions.',
    story: 'mars-global-surveyor',
    verified: false,
    image: '/assets/objects/mars_global_surveyor.jpg',
    sourceUrl: "https://science.nasa.gov/mission/mars-global-surveyor/",
  },

  // 4. Mariner 4
  {
    id: 'mariner-4',
    name: 'Mariner 4',
    kind: 'Flyby',
    target: 'Mars',
    anchor: 'mars',
    status: 'silent',
    location_state: 'solar-orbit',
    hardware: 'Mars flyby probe with a single TV camera, a magnetometer and cosmic-dust and particle detectors',
    current_status: 'Not communicating; no active mission operations. Presumed still in orbit around the Sun.',
    last_contact: '21 December 1967',
    why_left: 'A flyby probe cannot stop at Mars, so it passed the planet in July 1965 and kept going into solar orbit. Contact ended in December 1967 when its attitude-control gas ran out and it could no longer keep its antenna pointed at Earth.',
    science_enabled: 'Returned the first close-up pictures of another planet, 21 images showing a cratered surface. Radio measurements showed a thin atmosphere, and it found no strong magnetic field around Mars.',
    story: 'mariner-4',
    verified: false,
    image: '/assets/objects/mariner04.gif',
    sourceUrl: "https://science.nasa.gov/mission/mariner-4/",
  },

  // 5. Mariner 6
  {
    id: 'mariner-6',
    name: 'Mariner 6',
    kind: 'Flyby',
    target: 'Heliocentric orbit after Mars flyby',
    anchor: 'mars',
    status: 'silent',
    location_state: 'solar-orbit',
    hardware: 'Mars flyby probe with two TV cameras, an infrared spectrometer, an ultraviolet spectrometer and an infrared radiometer',
    current_status: 'Not communicating; no active mission operations. Presumed still in orbit around the Sun.',
    last_contact: 'Not specified',
    why_left: 'A flyby probe cannot stop at Mars, so after its close approach on 31 July 1969 it continued into solar orbit. The date of its last contact is not specified in this record.',
    science_enabled: 'Returned 75 pictures of the Martian equator and measured the atmosphere and surface temperatures. It found the polar caps are made mostly of frozen carbon dioxide.',
    story: 'mariner-6',
    verified: false,
    image: '/assets/objects/mariner06-07.gif',
    sourceUrl: "https://science.nasa.gov/mission/mariner-6/",
  },

  // 6. Mariner 7
  {
    id: 'mariner-7',
    name: 'Mariner 7',
    kind: 'Flyby',
    target: 'Heliocentric orbit after Mars flyby',
    anchor: 'mars',
    status: 'silent',
    location_state: 'solar-orbit',
    hardware: 'Mars flyby probe with two TV cameras, an infrared spectrometer, an ultraviolet spectrometer and an infrared radiometer',
    current_status: 'Not communicating; no active mission operations. Presumed still in orbit around the Sun.',
    last_contact: 'Not specified',
    why_left: 'A flyby probe cannot stop at Mars, so after its close approach on 5 August 1969 it continued into solar orbit. The date of its last contact is not specified in this record.',
    science_enabled: 'Returned 126 pictures covering the southern hemisphere and the south polar cap. Its measurements of the atmosphere and surface temperatures complemented those of Mariner 6.',
    story: 'mariner-7',
    verified: false,
    image: '/assets/objects/mariner06-07.gif',
    sourceUrl: "https://science.nasa.gov/mission/mariner-7/",
  },

  // 7. Mariner 2
  {
    id: 'mariner-2',
    name: 'Mariner 2',
    kind: 'Flyby',
    target: 'Heliocentric orbit after Venus flyby',
    anchor: 'venus',
    status: 'silent',
    location_state: 'solar-orbit',
    hardware: 'Venus flyby probe with microwave and infrared radiometers, a magnetometer and solar-wind and cosmic-dust detectors',
    current_status: 'Not communicating; no active mission operations. Presumed still in orbit around the Sun.',
    last_contact: 'January 1963 at 07:00 UT',
    why_left: 'A flyby probe cannot stop at Venus, so after passing the planet in December 1962 it continued into solar orbit. Contact ended in January 1963 after it had completed its mission.',
    science_enabled: 'Made the first successful flyby of another planet. It showed that Venus has a very hot surface and no detectable magnetic field, and it measured the solar wind in interplanetary space.',
    story: 'mariner2',
    verified: false,
    image: '/assets/objects/mariner02.gif',
    sourceUrl: "https://science.nasa.gov/mission/mariner-2/",
  },

  // 8. Mariner 5
  {
    id: 'mariner-5',
    name: 'Mariner 5',
    kind: 'Flyby',
    target: 'Heliocentric Orbit Venus flyby',
    anchor: 'venus',
    status: 'silent',
    location_state: 'solar-orbit',
    hardware: 'Venus flyby probe with an ultraviolet photometer, a magnetometer, solar-wind detectors and a radio occultation experiment',
    current_status: 'Not communicating; no active mission operations. Presumed still in orbit around the Sun.',
    last_contact: '4 December 1967, temporarily regained on 14 October 1968',
    why_left: 'A flyby probe cannot stop at Venus, so after passing the planet in October 1967 it continued into solar orbit. Its mission ended on 4 December 1967; contact was briefly regained on 14 October 1968 and then lost again.',
    science_enabled: 'Showed that the Venus atmosphere is much denser and hotter than earlier measurements suggested. It also confirmed that Venus has no strong magnetic field.',
    story: 'mariner5',
    verified: false,
    image: '/assets/objects/mariner05.gif',
    sourceUrl: "https://science.nasa.gov/mission/mariner-5/",
  },

  // 9. Mariner 10
  {
    id: 'mariner-10',
    name: 'Mariner 10',
    kind: 'Flyby',
    target: 'Mercury & Venus',
    anchor: 'mercury',
    status: 'silent',
    location_state: 'solar-orbit',
    hardware: 'Venus and Mercury flyby probe with TV cameras, a magnetometer, plasma instruments and an ultraviolet spectrometer',
    current_status: 'Not communicating; no active mission operations. Presumed still in orbit around the Sun.',
    last_contact: 'March 24, 1975',
    why_left: 'Its attitude-control gas ran out after three Mercury flybys, so it could no longer point its antenna at Earth. Controllers switched off its transmitter in March 1975, and it stayed in solar orbit.',
    science_enabled: 'Made the first close flybys of Mercury and imaged about half of its surface. It discovered a magnetic field at Mercury and was the first spacecraft to use a gravity assist from another planet.',
    story: 'mariner10',
    verified: false,
    image: '/assets/objects/mariner10-a3ef4a7a.gif',
    sourceUrl: "https://science.nasa.gov/mission/mariner-10/",
  },

  // 10. Pioneer 10
  {
    id: 'pioneer-10',
    name: 'Pioneer 10',
    kind: 'Flyby',
    target: 'Jupiter flyby, then deep space',
    anchor: 'jupiter',
    status: 'silent',
    location_state: 'leaving-solar-system',
    hardware: 'Jupiter flyby probe powered by nuclear generators, with an imaging photopolarimeter and radiation and magnetic-field instruments',
    current_status: 'Not communicating; no active mission operations. Still travelling out of the solar system.',
    last_contact: 'January 23, 2003',
    why_left: 'After its Jupiter flyby it kept going on an escape path out of the solar system. Its power supply faded until the signal became too weak to detect; the last signal arrived on 23 January 2003.',
    science_enabled: 'Was the first spacecraft to cross the asteroid belt and the first to fly past Jupiter. It measured the planet\'s intense radiation belts and magnetic field and returned close-up images.',
    story: 'pioneer10',
    verified: false,
    image: '/assets/objects/jupiter-pioneer-10-art-jpg-20ff5cb4.webp',
    sourceUrl: "https://science.nasa.gov/mission/pioneer-10/",
  },

  // 11. Pioneer 11
  {
    id: 'pioneer-11',
    name: 'Pioneer 11',
    kind: 'Flyby',
    target: 'Jupiter & Saturn flybys, then deep space',
    anchor: 'saturn',
    status: 'silent',
    location_state: 'leaving-solar-system',
    hardware: 'Jupiter and Saturn flyby probe powered by nuclear generators, with an imaging photopolarimeter and radiation and magnetic-field instruments',
    current_status: 'Not communicating; no active mission operations. Still travelling out of the solar system.',
    last_contact: '1995',
    why_left: 'After its Saturn flyby it kept going on an escape path out of the solar system. Contact ended in 1995, when its power supply could no longer run the transmitter and instruments.',
    science_enabled: 'Was the first spacecraft to fly past Saturn. It found a new ring and a new moon, measured Saturn\'s magnetic field, and took the first views of Jupiter\'s polar regions.',
    story: 'pioneer11',
    verified: false,
    image: '/assets/objects/Pioneer11-1600-fb0b5cbf.jpg',
    sourceUrl: "https://science.nasa.gov/mission/pioneer-11/",
  },

  // 12. Mariner 9
  {
    id: 'mariner-9',
    name: 'Mariner 9',
    kind: 'Orbiter',
    target: 'Mars',
    anchor: 'mars',
    status: 'silent',
    location_state: 'orbiting-target',
    hardware: 'Mars orbiter with wide- and narrow-angle TV cameras, an infrared spectrometer and an ultraviolet spectrometer',
    current_status: 'Not communicating; no active mission operations. Last known to be orbiting Mars.',
    last_contact: '1972-10-27',
    why_left: 'The orbiter ran out of attitude-control gas after almost a year at Mars, so it could no longer be pointed. Controllers shut it down on 27 October 1972 and it stayed in orbit around Mars.',
    science_enabled: 'Was the first spacecraft to orbit another planet. It mapped most of Mars, revealed giant volcanoes and the huge canyon system now called Valles Marineris, and took the first close images of Phobos and Deimos.',
    story: 'mariner-9',
    verified: false,
    image: '/assets/objects/mariner09.jpg',
    sourceUrl: "https://science.nasa.gov/mission/mariner-9/",
  },

  // 13. Deep Space 1
  {
    id: 'deep-space-1',
    name: 'Deep Space 1',
    kind: 'Flyby',
    target: 'Solar orbit after asteroid Braille and comet Borrelly flybys',
    anchor: 'mars',
    status: 'ended-by-design',
    location_state: 'solar-orbit',
    hardware: 'Flyby / ion-propulsion technology demonstrator',
    current_status: 'Routine mission operations ended by command or planned retirement.',
    last_contact: '2001-12-18 (mission shutdown; later engineering contacts, if any, require owner review).',
    last_known_location: 'Heliocentric orbit after asteroid and comet flybys; exact present position not tracked here.',
    why_left: 'Controllers retired the spacecraft after its extended mission; this was a commanded shutdown rather than an unexplained loss.',
    science_enabled: 'Tested 12 technologies including ion propulsion and autonomous navigation; imaged comet Borrelly and studied asteroid Braille, helping later electric-propulsion missions.',
    story: '',
    verified: false,
    image: '/assets/objects/nm_ds_1.gif',
    sourceUrl: "https://science.nasa.gov/mission/deep-space-1/",
  },

  // 14. Mars Observer
  {
    id: 'mars-observer',
    name: 'Mars Observer',
    kind: 'Orbiter',
    target: 'Last tracked approaching Mars; final trajectory is uncertain',
    anchor: 'mars',
    status: 'silent',
    location_state: 'solar-orbit',
    hardware: 'Mars orbiter; lost before orbit insertion',
    current_status: 'Not communicating; no active mission operations.',
    last_contact: '1993-08-21 in NASA HEASARC; NASA Science lists mission end 1993-08-22. Date conflict retained for owner review.',
    last_known_location: 'Last tracked approaching Mars; subsequent orbit and exact present location unknown. solar-orbit is a provisional category, not a confirmed orbit.',
    why_left: 'Contact was lost before Mars orbit insertion. A propulsion-system rupture was considered probable; the precise failure and final trajectory remain uncertain.',
    science_enabled: 'No planned Mars orbital mapping returned. Cruise gamma-ray observations included GRB 930706; replacement instruments later flew on other Mars missions.',
    story: '',
    verified: true,
    image: '/assets/objects/mars_observer.jpg',
    sourceUrl: 'https://science.nasa.gov/mission/mars-observer/',
  },

  // 15. Apollo 10 Snoopy ascent stage
  {
    id: 'apollo-10-snoopy',
    name: 'Apollo 10 Snoopy ascent stage',
    kind: 'Orbiter',
    target: 'Heliocentric orbit after the lunar rehearsal; exact present position unknown',
    anchor: 'venus',
    status: 'left-behind',
    location_state: 'solar-orbit',
    hardware: 'Discarded Lunar Module ascent stage',
    current_status: 'Inactive; discarded after the crew returned to the command module.',
    last_contact: '1969-05 (mission-era tracking; exact final transmission not established)',
    last_known_location: 'Sent into solar orbit after the Apollo 10 lunar rehearsal; no live position is claimed.',
    why_left: 'The ascent stage was jettisoned after rendezvous and no longer needed for the crew return.',
    science_enabled: 'The lunar module rehearsed descent and rendezvous procedures, reducing risk for Apollo 11.',
    story: '',
    verified: true,
    image: '/assets/objects/apollo10_cm_as10_27_3873.jpg',
    sourceUrl: "https://www.nasa.gov/missions/apollo/apollo-10-mission-details/",
  },
];