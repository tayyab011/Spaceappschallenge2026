import React, { Suspense, useEffect, useRef, useState,ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImageIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { prefersReducedMotion } from '../a11y';

interface BookPage {
  label: string;
  title: string;
  text: ReactNode;
  bullets?: ReactNode[];
  imageUrl: string;
  caption: string;
  credit: string;
  modelUrl?: string;
}

interface BotBook {
  id: string;
  name: string;
  place: string;
  coverImageUrl?: string;
  recordIds?: string[];
  sourceUrls?: string[];
  pages: [BookPage, BookPage, BookPage, BookPage]; 
}


const BOOKS: BotBook[] = [
  {
    id: "sojourner",
    name: "Sojourner",
    place: "Mars",
    coverImageUrl: "/assets/objects/4067-pathfinder-PIA01551-modest-web-ae16d9b6.jpg",
    recordIds: ["sojourner-pathfinder"],
    sourceUrls: ["https://science.nasa.gov/mission/mars-pathfinder/"],
    pages: [
      {
        label: "Origin",
        title: "A Small Rover, A Big First",
        imageUrl: "/assets/objects/4067-pathfinder-PIA01551-modest-web-ae16d9b6.jpg",
        caption: "Sojourner rover on Mars",
        credit: "NASA",
        text: `On December 4, 1996, NASA launched Mars Pathfinder with a small rover folded inside it.

Named after Sojourner Truth, Sojourner reached Ares Vallis on July 4, 1997. Airbags cushioned the spacecraft's arrival, and the lander's petals opened to reveal the rover.

When its six wheels rolled onto the ground, Sojourner became the first rover to operate on Mars.`,
      },
      {
        label: "Goals",
        title: "Prove a New Way to Explore",
        imageUrl: "/assets/objects/mars-pathfinder-7-pathfinder-and-sojourner-on-ma-e3b04115.jpg",
        caption: "Sojourner rover on Mars",
        credit: "NASA",
        text: `Sojourner was built to demonstrate that a small robot could drive on Mars, avoid obstacles, and investigate rocks and soil.

Its cameras guided its movements. An Alpha Proton X-ray Spectrometer measured chemical elements, while solar panels supplied electricity.

The rover sent its observations through Pathfinder, which relayed them to Earth.

Its planned mission was only seven sols, or Martian days. Every successful drive also taught engineers how future rovers could explore.`,
      },
      {
        label: "Discoveries",
        title: "What It Found",
        imageUrl: "/assets/objects/8648-PIA01133-full2-d5306e90.jpg",
        caption: "Martian terrain",
        credit: "NASA",
        text: `Sojourner examined rocks including Yogi and Barnacle Bill, comparing their chemistry with nearby soil.

Together with Pathfinder's observations, its measurements revealed varied rocks and evidence that powerful ancient floods had shaped the landing region.

It also demonstrated wheels, navigation, and obstacle avoidance on real Martian ground.

Those engineering results helped prepare the larger rovers that followed. Its short route showed that useful exploration did not have to remain confined to one landing point.`,
      },
      {
        label: "Now",
        title: "Resting at Ares Vallis",
        imageUrl: "/assets/objects/mars-pathfinder-11-sojourner-apxs-on-yogi-rock-1-53e0633a.jpg",
        caption: "Resting at Ares Vallis",
        credit: "NASA",
        modelUrl: "",
        text: `Sojourner remains near Pathfinder in Ares Vallis.

Pathfinder's last communication reached Earth on September 27, 1997, cutting off the rover's connection home.

The expedition had lasted almost three months, far beyond Sojourner's planned seven-sol mission. Its final movements and exact resting point remain uncertain because no later messages reached Earth.

The rover had no return vehicle. It stayed on Mars after demonstrating an approach that would become central to exploring the planet.`,
      },
    ],
  },
  {
    id: "spirit",
    name: "Spirit",
    place: "Mars",
    coverImageUrl: "/assets/objects/rover2-1-df042d60.jpg",
    recordIds: ["spirit"],
    sourceUrls: [
      "https://science.nasa.gov/mission/mer-spirit/",
      "https://www.jpl.nasa.gov/news/press_kits/MSLLanding.pdf",
      "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-instruments/",
    ],
    pages: [
      {
        label: "Origin",
        title: "One of Mars’ Twin Explorers",
        imageUrl: "/assets/objects/rover2-1-df042d60.jpg",
        caption: "One of Mars’ Twin Explorers",
        credit: "NASA",
        text: `On June 10, 2003, NASA launched Spirit toward Mars. It was one of two Mars Exploration Rovers, alongside its twin, Opportunity.

Spirit landed in Gusev Crater on January 4, 2004, Universal Time. Scientists had chosen the site because its shape suggested that it might once have held a lake.

But the rover's first observations revealed a volcanic plain rather than the lake deposits scientists hoped to find. To investigate further, Spirit would have to leave its landing area and travel toward the Columbia Hills.`,
      },
      {
        label: "Goals",
        title: "Search for a Watery Past",
        imageUrl: "/assets/objects/mer-bythenumbers-infographic-feb2019-4ce6ccc5.jpg",
        caption: "Spirit & Opportunity",
        credit: "NASA",
        text: `Spirit's main goal was to examine rocks and soil for evidence of past water activity, helping scientists understand whether ancient Mars had environments that could have supported life.

Its six wheels carried a solar-powered laboratory. Panoramic cameras surveyed the landscape, while a Microscopic Imager examined rock textures. An Alpha Particle X-ray Spectrometer measured chemical elements, and a Mössbauer Spectrometer identified iron-bearing minerals.

Its Rock Abrasion Tool ground through weathered rock surfaces to expose material underneath. A miniature thermal emission spectrometer studied minerals from a distance.

The mission was planned for 90 Martian days.

Spirit continued exploring for years.`,
      },
      {
        label: "Discoveries",
        title: "What It Found",
        imageUrl: "/assets/objects/outofthisworldrecords-updated-2019-02-b1fd4b22.png",
        caption: "Comparison of distances traveled by lunar and Mars vehicles",
        credit: "NASA",
        text: `In the Columbia Hills, Spirit found rocks and minerals that had been altered by water, revealing a wetter history than its landing site initially suggested.

One important discovery came from an unexpected problem. A broken wheel dragged through the soil, scraping away the surface and exposing silica-rich material. Scientists interpreted the deposit as evidence of ancient hot springs or steam vents.

Spirit also examined carbonate-bearing rock, providing evidence that some ancient water had been less acidic.

These discoveries did not prove that life had existed on Mars. They showed that the planet once had environments where conditions may have been suitable for it—and gave scientists specific places and processes to investigate.`,
      },
      {
        label: "Now",
        title: "Resting on Mars",
        imageUrl: "/assets/objects/sol016-lander-pan-pia05117-cb29dbe7.jpg",
        caption: "Spirit & Oppy on Mars",
        credit: "NASA",
        text: `After traveling about 7.7 kilometers, Spirit became stuck in soft soil at a location called Troy, near Home Plate in Gusev Crater, in 2009.

Controllers tried to free it, but the rover could not reach a position that would give its solar panels enough sunlight during the approaching Martian winter.

Its last communication reached Earth on March 22, 2010. NASA continued recovery attempts before ending them on May 25, 2011.

Today, Spirit remains at Troy.

It had been built for a 90-sol mission. Instead, it spent more than six years investigating Mars, climbing into the hills and finding evidence of water that had not been obvious where it landed.

Its journey ended in the soil, but the measurements it sent home remain part of how scientists understand ancient Mars.`,
      },
    ],
  },
  {
    id: "opportunity",
    name: "Opportunity",
    place: "Mars",
    coverImageUrl: "/assets/objects/solar-panels-on-rover-seen-from-above-80d811d3.jpeg",
    recordIds: ["opportunity"],
    sourceUrls: [
      "https://science.nasa.gov/mission/mer-opportunity/",
      "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-highlights/",
      "https://www.jpl.nasa.gov/news/six-things-to-know-about-nasas-opportunity-mars-rover/",
    ],
    pages: [
      {
        label: "Origin",
        title: "Spirit’s Twin",
        imageUrl: "/assets/objects/solar-panels-on-rover-seen-from-above-80d811d3.jpeg",
        caption: "Spirit’s Twin",
        credit: "NASA",
        text: `On July 7, 2003, NASA launched a small robotic geologist toward Mars.

Its name was Opportunity.

Designed as one of NASA's Mars Exploration Rovers, Opportunity landed on January 24, 2004, in California time—January 25 in Universal Time. It arrived in Meridiani Planum, inside a small impact crater named Eagle Crater.

It carried solar panels, six wheels, onboard computers, cameras, antennas, and scientific instruments including a Microscopic Imager, APXS, Mössbauer Spectrometer, and Rock Abrasion Tool.`,
      },
      {
        label: "Goals",
        title: "Read the Rocks",
        imageUrl: "/assets/objects/rover-tracks-on-a-hillside-with-a-dust-devil-see-1933e031.jpeg",
        caption: "Martian Valley",
        credit: "NASA",
        text: `Opportunity's main goal was to investigate rocks and soil for evidence that liquid water had once existed on Mars.

Its cameras mapped the landscape, while its instruments analyzed rocks and minerals. A miniature thermal emission spectrometer studied minerals from a distance. The Rock Abrasion Tool ground away weathered surfaces, exposing material underneath.

The mission was planned to last only 90 Martian days.

But Opportunity kept moving.

It crossed plains, explored craters, climbed slopes, and sent thousands of images and scientific measurements back to Earth.`,
      },
      {
        label: "Discoveries",
        title: "What It Found",
        imageUrl: "/assets/objects/rover-casting-a-shadow-a2b3b17d.jpeg",
        caption: "Alone on Mars",
        credit: "NASA",
        text: `Inside Eagle Crater, Opportunity found small hematite-rich spheres nicknamed the “blueberries.” They provided evidence of water-related processes.

It became the first rover to identify and characterize sedimentary rocks on another planet. Sulfate-rich rocks and sedimentary textures also showed that water had affected the ground.

In 2006, it reached Victoria Crater, about 800 meters wide, and studied its exposed layers.

Later, at Endeavour Crater, it found clay minerals associated with relatively neutral-pH water—evidence of an environment that may have been more favorable for life.

These discoveries revealed habitable conditions, not proof that life had existed.`,
      },
      {
        label: "Now",
        title: "Silenced by a Global Storm",
        imageUrl: "/assets/objects/Mars-Exploration-Rover-Spirit-and-Opportunity-3767b584.png",
        caption: "Oppy 3D Structure",
        credit: "NASA",
        modelUrl: "",
        text: `Opportunity was supposed to work for 90 sols.

Instead, it survived for almost 15 years, traveling 45.16 kilometers—28.06 miles—and investigating more than 100 craters.

In June 2018, a planet-wide dust storm blocked sunlight from reaching its solar panels. Its last communication reached Earth on June 10.

NASA continued listening and attempting to restore contact, but Opportunity never responded. The mission officially ended on February 13, 2019.

Today, it remains in Perseverance Valley on the western rim of Endeavour Crater.

Its wheels are still, but its discoveries remain: years of evidence that water had shaped another world.

It was built for 90 sols. It worked for nearly 15 years.

Silent, but not forgotten.`,
      },
    ],
  },
  {
    id: "pioneer10",
    name: "Pioneer 10",
    place: "Deep Space",
    coverImageUrl: "/assets/objects/jupiter-pioneer-10-art-jpg-20ff5cb4.webp",
    recordIds: ["pioneer-10"],
    sourceUrls: ["https://science.nasa.gov/mission/pioneer-10/"],
    pages: [
      {
        label: "Origin",
        title: "First Beyond the Asteroid Belt",
        imageUrl: "/assets/objects/jupiter-pioneer-10-art-jpg-20ff5cb4.webp",
        caption: "First Beyond the Asteroid Belt",
        credit: "NASA",
        text: `Pioneer 10 launched on March 2, 1972, heading toward Jupiter.

First, it had to cross the asteroid belt, a region no spacecraft had yet traveled through. Engineers needed to learn whether particles there posed a serious danger.

Pioneer 10 crossed successfully and reached Jupiter in December 1973.

It became the first spacecraft to investigate the giant planet up close, opening a route that later outer-planet explorers would follow.`,
      },
      {
        label: "Goals",
        title: "Explore Jupiter",
        imageUrl: "/assets/objects/arc-1974-ac73-9344orig-3d3ee44b.jpg",
        caption: "Explore Jupiter",
        credit: "NASA",
        text: `Pioneer 10 was built to study Jupiter and the space along its route.

Radioisotope generators supplied electricity far from strong sunlight. An imaging photopolarimeter produced pictures and measured reflected light. A magnetometer, charged-particle instruments, and dust detectors investigated magnetic fields, radiation, and particles.

The spacecraft spun for stability and transmitted observations through its antenna.

Its measurements would help scientists understand Jupiter and prepare later spacecraft for the planet's challenging environment.`,
      },
      {
        label: "Discoveries",
        title: "What It Found",
        imageUrl: "/assets/objects/Pioneer-10-Ganymede-1-6213fc43.jpeg",
        caption: "Photo  of Jupiter taked by Pioneer 10",
        credit: "NASA",
        text: `Pioneer 10 returned the first close observations of Jupiter and pictures of the planet and its moons.

It measured an enormous magnetic environment and intense radiation belts, revealing hazards invisible in ordinary photographs.

Its safe asteroid-belt crossing also showed that the route was usable.

The mission supplied both discoveries and practical warnings. Later explorers could use its measurements to plan encounters and protect their equipment against conditions the first visitor had investigated.`,
      },
      {
        label: "Now",
        title: "Drifting Into Deep Space",
        imageUrl: "/assets/objects/pioneer-nasa-629e121e.jpg",
        caption: "Drifting Into Deep Space",
        credit: "NASA",
        modelUrl: "",
        text: `Jupiter's gravity placed Pioneer 10 on an escape trajectory.

It continued outward rather than remaining in orbit around the planet. As its generators aged, they supplied less electricity.

Its final weak signal reached Earth on January 23, 2003.

The spacecraft now travels silently away from the planetary region, carrying its engraved plaque. Its exact current position is not measured by an active mission.

Pioneer 10 never had a return journey planned. Its discoveries came home while the spacecraft continued farther away.`,
      },
    ],
  },
  {
    id: "pioneer11",
    name: "Pioneer 11",
    place: "Deep Space",
    coverImageUrl: "/assets/objects/Pioneer11-1600-fb0b5cbf.jpg",
    recordIds: ["pioneer-11"],
    sourceUrls: ["https://science.nasa.gov/mission/pioneer-11/"],
    pages: [
      {
        label: "Origin",
        title: "Pioneer 10’s Sister",
        imageUrl: "/assets/objects/Pioneer11-1600-fb0b5cbf.jpg",
        caption: "Pioneer 10’s Sister",
        credit: "NASA",
        text: `Pioneer 11 launched on April 6, 1973, following Pioneer 10 toward Jupiter.

Its route would continue farther. A close Jupiter encounter in December 1974 redirected it toward Saturn.

In September 1979, it became the first spacecraft to visit the ringed planet.

Before Voyager arrived, Pioneer 11 investigated Saturn's surroundings, turning a destination previously studied from Earth into a place where instruments could gather direct measurements.`,
      },
      {
        label: "Goals",
        title: "Reach the Ringed Planet",
        imageUrl: "/assets/objects/Saturn-and-its-rings-d4abdfbb.jpeg",
        caption: "Reach the Ringed Planet",
        credit: "NASA",
        text: `Radioisotope generators powered Pioneer 11 far from the Sun.

Its imaging photopolarimeter produced pictures and measured light. Magnetic-field, radiation, plasma, and dust instruments examined the environment.

Scientists wanted to compare Jupiter and Saturn, investigate moons and rings, and assess hazards for later flybys.

Jupiter's gravity assist helped the spacecraft reach Saturn.

The mission combined planetary science with preparation, supplying information that Voyager planners could use before sending their own spacecraft into the region.`,
      },
      {
        label: "Discoveries",
        title: "What It Found",
        imageUrl: "/assets/objects/Fuzzy-color-image-of-Jupiter-b2622095.jpeg",
        caption: "Photo of Jupiter taken by Pioneer 11",
        credit: "NASA",
        text: `Pioneer 11 returned views of Jupiter's polar regions and studied how its magnetic environment responded to the solar wind.

At Saturn, it detected the planet's magnetic field, discovered the narrow F ring, and reported a previously unknown satellite.

Ring and particle measurements helped assess the route ahead.

The brief encounter could not answer every question, but it supplied the first close evidence about Saturn and useful comparisons between the two giant planets.`,
      },
      {
        label: "Now",
        title: "Lost Contact",
        imageUrl: "/assets/objects/ac73-9344-1280-ad97a78e.jpg",
        caption: "Lost Contact",
        credit: "NASA",
        modelUrl: "",
        text: `After Saturn, Pioneer 11 continued on a trajectory leading out of the solar system.

Declining power limited its ability to maneuver and point its antenna toward Earth. Routine operations ended on September 30, 1995.

A few minutes of engineering data arrived on November 24, before contact ended as Earth moved outside the antenna's view.

The spacecraft now travels silently outward with its plaque, without a precisely tracked live position.

Its first visit to Saturn remained part of the preparation for much longer investigations.`,
      },
    ],
  },
  {
    id: "viking-1",
    name: "Viking 1",
    place: "Mars",
    coverImageUrl: "/assets/objects/viking_lander_model.gif",
    recordIds: ["viking-1-lander"],
    sourceUrls: ["https://science.nasa.gov/mission/viking/"],
    pages: [
      {
        label: "Origin",
        title: "The First Successful Landing on Mars",
        imageUrl: "/assets/objects/viking_lander_model.gif",
        caption: "The First Successful Landing on Mars",
        credit: "NSSDCA",
        text: `Viking 1 launched on August 20, 1975, carrying an orbiter and a lander.

The orbiter reached Mars in June 1976 and inspected possible landing areas.

On July 20, the lander touched down in Chryse Planitia and transmitted pictures from the ground.

Its arrival began a sustained investigation of the surface. While its partner surveyed from orbit, Viking 1 could measure weather and examine soil directly where it stood.`,
      },
      {
        label: "Goals",
        title: "Search Mars From Orbit and the Surface",
        imageUrl: "/assets/objects/viking.jpg",
        caption: "Search Mars From Orbit and the Surface",
        credit: "NASA",
        text: `The orbiter mapped Mars and measured temperatures and atmospheric water vapor.

The lander carried two cameras, a sampler arm, weather sensors, a gas chromatograph–mass spectrometer, and an X-ray fluorescence spectrometer.

Three biology experiments searched for evidence of life. A seismometer failed to deploy properly.

Radioisotope generators supplied electricity, and the orbiter helped relay messages.

The mission connected global observations with close soil and environmental tests, investigating whether Mars held evidence of biological activity.`,
      },
      {
        label: "Discoveries",
        title: "A Complex and Unexpected Mars",
        imageUrl: "/assets/objects/v1.jpg",
        caption: "A Complex and Unexpected Mars",
        credit: "NASA",
        text: `Viking 1 documented a cold, rocky landscape, changing weather, and sulfur-rich soil containing elements such as silicon, iron, and calcium.

Its biology experiments produced surprising reactions, but the organic-chemistry experiment detected no organic compounds. The results established no clear evidence of life.

The Viking orbiters documented ancient channels and floods. Together, they returned 52,663 images and mapped about 97 percent of Mars at roughly 300-meter resolution.

The mission supplied discoveries—and scientific questions that remained unresolved.`,
      },
      {
        label: "Now",
        title: "Silent on the Martian Surface",
        imageUrl: "/assets/objects/bk1.jpg",
        caption: "Launch of Viking 1",
        credit: "NASA",
        text: `Viking 1's lander remains in Chryse Planitia.

A faulty command disrupted communication in November 1982, and recovery attempts failed. NASA records November 11 as its final transmission and November 13 as the mission-end date.

Its orbiter had already been shut down on August 7, 1980, as attitude-control fuel ran low.

The lander stayed on the surface; the orbiter was left in Mars orbit.

Their working lives ended separately, but their observations remained available for later study.`,
      },
    ],
  },
  {
    id: "mariner2",
    name: "Mariner 2",
    place: "Venus",
    coverImageUrl: "/assets/objects/mariner02.gif",
    recordIds: ["mariner-2"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-2/"],
    pages: [
      {
        label: "Origin",
        title: "The First Successful Planetary Mission",
        imageUrl: "/assets/objects/mariner02.gif",
        caption: "The First Successful Planetary Mission",
        credit: "NASA",
        text: `Mariner 2 launched on August 27, 1962, weeks after Mariner 1's failed launch.

Its destination was Venus, whose clouds concealed the conditions beneath them.

On December 14, the spacecraft passed the planet and became the first to complete a successful scientific encounter with another world.

Scientists could now compare distant observations with measurements taken nearby, testing ideas about a planet that telescopes alone could not fully explain.`,
      },
      {
        label: "Goals",
        title: "A Close Look at Venus",
        imageUrl: "/assets/objects/p-1-90824865-60-years-ago-the-mariner-2-gave-us--ebaab001.jpg",
        caption: "A Close Look at Venus",
        credit: "NASA",
        text: `Mariner 2 carried microwave and infrared radiometers to measure energy from Venus.

A magnetometer searched for magnetic fields. Solar-plasma, energetic-particle, and dust detectors investigated space along the route.

Solar panels and a battery supplied electricity.

It carried no camera.

The mission investigated the atmosphere and heat while testing deep-space navigation and communication. Its brief encounter had to produce measurements useful enough to improve understanding of the world hidden under the clouds.`,
      },
      {
        label: "Discoveries",
        title: "A Hot and Hostile Venus",
        imageUrl: "/assets/objects/Two-men-displaying-a-25-foot-printout-of-all-the-3a4541c3.jpeg",
        caption: "A Hot and Hostile Venus",
        credit: "NASA",
        text: `Mariner 2's measurements showed that Venus was extremely hot, challenging hopes of a mild environment beneath its clouds.

It detected no planetary magnetic field at its flyby distance and measured the solar wind between planets.

These observations demonstrated what nearby instruments could reveal when telescopes left questions unresolved.

Later missions would refine the details, but Mariner 2 supplied the first successful close scientific encounter and helped establish the harsh conditions of its destination.`,
      },
      {
        label: "Now",
        title: "A Silent Traveler",
        imageUrl: "/assets/objects/mariner-1-3-artist-impression-1280-90a53565.jpg",
        caption: "A Silent Traveler",
        credit: "NASA",
        text: `Mariner 2 continued into orbit around the Sun after passing Venus.

It had no system for landing or braking into Venus orbit. Its final signal reached Earth on January 3, 1963.

The spacecraft is now inactive on its solar trajectory, without an actively measured exact present position.

Its working life was brief.

The achievement lasted: a spacecraft had reached another planet, collected scientific evidence, and sent it home, establishing a beginning that later planetary exploration could build on.`,
      },
    ],
  },
  {
    id: "mariner10",
    name: "Mariner 10",
    place: "Mercury",
    coverImageUrl: "/assets/objects/mariner10-a3ef4a7a.gif",
    recordIds: ["mariner-10"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-10/"],
    pages: [
      {
        label: "Origin",
        title: "The Journey to Mercury",
        imageUrl: "/assets/objects/mariner10-a3ef4a7a.gif",
        caption: "The Journey to Mercury",
        credit: "NASA",
        text: `Mariner 10 launched on November 3, 1973, heading for Venus and Mercury.

In February 1974, Venus's gravity redirected it toward Mercury. The first Mercury encounter followed on March 29.

Its route brought it back twice more.

A planet never previously visited by spacecraft now received three opportunities for close investigation, while the journey demonstrated how one world's gravity could help an explorer reach another.`,
      },
      {
        label: "Goals",
        title: "Exploring Mercury and Venus",
        imageUrl: "/assets/objects/Mariner-10-e787934b.jpeg",
        caption: "Exploring Mercury and Venus",
        credit: "NASA",
        text: `Television cameras photographed terrain. Infrared and ultraviolet instruments investigated temperatures and thin surrounding gases.

A magnetometer and plasma and particle instruments examined magnetic conditions. Solar panels supplied electricity.

The mission also tested a gravity assist, using a planet to change the spacecraft's speed and direction while reducing the work needed from onboard fuel.

Its instruments investigated two worlds, and its route helped demonstrate a navigation technique that later, more ambitious missions could use.`,
      },
      {
        label: "Discoveries",
        title: "Revealing Mercury",
        imageUrl: "/assets/objects/earth-and-moon-in-space-39e167a4.jpeg",
        caption: "Revealing Mercury",
        credit: "NASA",
        text: `Mariner 10 photographed roughly 45 percent of Mercury, revealing a heavily cratered surface.

It discovered an unexpected magnetic field and investigated Mercury's extremely thin atmosphere, more accurately called an exosphere.

At Venus, it observed cloud patterns.

The successful gravity assist also showed that planetary encounters could be linked.

Mercury still had unseen terrain, but its first visitor supplied a foundation for understanding the planet and a useful method for planning future journeys.`,
      },
      {
        label: "Now",
        title: "The Final Signal",
        imageUrl: "/assets/objects/mariner-10-1280x1280-2-77b331a8.jpg",
        caption: "The Final Signal",
        credit: "NASA",
        text: `After its third Mercury flyby in March 1975, Mariner 10 exhausted its attitude-control gas.

It could no longer point reliably. Controllers switched off the transmitter on March 24.

The spacecraft remained in orbit around the Sun, not Mercury. Its exact current position is not actively tracked.

Its encounters had already returned photographs, magnetic measurements, and evidence that a gravity-assisted route could work.

The mission ended when its pointing supply ran out, leaving those discoveries available for the explorers that followed.`,
      },
    ],
  },
  {
    id: "apollo15",
    name: "Apollo 15",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo_15_cm.jpg",
    recordIds: ["apollo-15"],
    sourceUrls: [
      "https://www.nasa.gov/missions/apollo/apollo-15-mission-details/",
      "https://science.nasa.gov/solar-system/moon/genesis-rock/",
    ],
    pages: [
      {
        label: "Origin",
        title: "A New Kind of Moon Mission",
        imageUrl: "/assets/objects/apollo_15_cm.jpg",
        caption: "A New Kind of Moon Mission",
        credit: "NASA",
        text: `Apollo 15 launched on July 26, 1971, with David Scott, James Irwin, and Alfred Worden.

It was the first Apollo landing mission equipped for a longer stay and wider exploration with a rover.

Scott and Irwin landed Falcon at Hadley-Apennine on July 30 while Worden worked in orbit.

The rover would help the surface crew reach geological targets across the mountain-front landscape and Hadley Rille during their limited time on the Moon.`,
      },
      {
        label: "Goals",
        title: "Exploring Hadley-Apennine",
        imageUrl: "/assets/objects/as17_147_22526.jpg",
        caption: "Exploring Hadley-Apennine",
        credit: "NASA",
        text: `Falcon carried supplies, geological tools, a folding Lunar Roving Vehicle, and an Apollo Lunar Surface Experiments Package.

Scott and Irwin would examine rocks, collect samples, and deploy instruments, including seismic and heat-flow equipment.

Worden used cameras and scientific instruments in the command and service modules to investigate the Moon from orbit.

The mission combined fieldwork, continuing surface measurements, and a wider orbital survey, connecting close observations with the larger landscape around them.`,
      },
      {
        label: "Discoveries",
        title: "Exploring the Moon on Wheels",
        imageUrl: "/assets/objects/apollo_15_lm.jpg",
        caption: "Exploring the Moon on Wheels",
        credit: "NASA",
        text: `The astronauts traveled about 27.9 kilometers and collected roughly 77 kilograms of samples.

Among them was the Genesis Rock, an anorthosite that helped investigate the Moon's early crust.

Hadley Rille and nearby terrain added evidence about volcanic and geological history.

Surface experiments continued after departure, while orbital measurements covered regions beyond the crew's routes.

Apollo 15 connected observations made in the field with material scientists could examine directly back on Earth.`,
      },
      {
        label: "Now",
        title: "A Mission That Came Home",
        imageUrl: "/assets/objects/S71-37963-large-66ce2d79.jpg",
        caption: "A Mission That Came Home",
        credit: "NASA",
        text: `The crew returned to Earth on August 7, 1971, after a twelve-day mission.

Their command module came home. The whole spacecraft was not abandoned on the Moon.

Falcon's descent stage, rover, and deployed equipment remain at Hadley-Apennine because they were not required for the return trip.

The ascent stage returned the crew to orbit and was later deliberately impacted.

The expedition ended, but its samples and instrument records continued supporting research long after the astronauts were home.`,
      },
    ],
  },
  {
    id: "viking-2",
    name: "Viking 2",
    place: "Mars",
    coverImageUrl: "/assets/objects/viking-1.webp",
    recordIds: ["viking-2-lander"],
    sourceUrls: ["https://science.nasa.gov/mission/viking/"],
    pages: [
      {
        label: "Origin",
        title: "Viking 1's Twin on Mars",
        imageUrl: "/assets/objects/viking-1.webp",
        caption: "Viking 1's Twin on Mars",
        credit: "NASA",
        text: `Viking 2 launched in September 1975 with another orbiter-and-lander team.

It entered Mars orbit in August 1976. On September 3, its lander touched down in Utopia Planitia, far from Viking 1.

A second location offered a valuable comparison.

Scientists could investigate whether the conditions observed at the first site represented Mars more widely or whether another part of the planet would reveal a different environment.`,
      },
      {
        label: "Goals",
        title: "Study Mars and Search for Life",
        imageUrl: "/assets/objects/sagan_viking.jpg",
        caption: "Study Mars and Search for Life",
        credit: "NASA",
        text: `The orbiter carried cameras, an infrared thermal mapper, and a water-vapor detector.

The lander brought two cameras, a sampler arm, weather sensors, a seismometer, a gas chromatograph–mass spectrometer, and an X-ray fluorescence spectrometer.

Three biology experiments searched for evidence of life. Radioisotope generators provided electricity.

The mission compared both Viking sites and investigated the surface and atmosphere, connecting measurements from the ground with observations of the larger planet.`,
      },
      {
        label: "Discoveries",
        title: "A Different Face of Mars",
        imageUrl: "/assets/objects/mars.jpg",
        caption: "A Different Face of Mars",
        credit: "NASA",
        text: `Viking 2 photographed a rocky plain and seasonal frost, recorded weather, and measured soil chemistry and behavior.

Its biology experiments produced puzzling reactions without establishing that life existed.

The orbiters' maps and images of Mars and its moons supplied wider context.

Comparing the landers helped scientists investigate differences between environments.

Viking 2 provided another detailed place in the scientific record, showing why an entire planet could not be understood through one landing alone.`,
      },
      {
        label: "Now",
        title: "A Long-Quiet Lander",
        imageUrl: "/assets/objects/viking_lander_model.gif",
        caption: "A Long-Quiet Lander",
        credit: "NASA",
        text: `Viking 2's lander remains in Utopia Planitia.

Its batteries failed, and operations ended on April 11, 1980. It had no wheels or return vehicle.

The orbiter had ended earlier, on July 25, 1978, after a propulsion-system leak depleted attitude-control gas. It was left in Mars orbit.

The partners had different working lives.

Their radios are silent now, but their weather records, photographs, and soil tests remain available to researchers examining the planet they visited.`,
      },
    ],
  },
  {
    id: "mars-global-surveyor",
    name: "Mars Global Surveyor",
    place: "Mars",
    coverImageUrl: "/assets/objects/mgs_768.jpg",
    recordIds: ["mars-global-surveyor"],
    sourceUrls: [
      "https://science.nasa.gov/mission/mars-global-surveyor/",
      "https://www.jpl.nasa.gov/news/report-reveals-likely-causes-of-mars-spacecraft-loss/",
    ],
    pages: [
      {
        label: "Origin",
        title: "Mapping Mars From Orbit",
        imageUrl: "/assets/objects/mgs_768.jpg",
        caption: "Mapping Mars From Orbit",
        credit: "NASA",
        text: `Mars Global Surveyor launched on November 7, 1996, to restore a mapping effort interrupted by the loss of Mars Observer.

It reached Mars in September 1997, then used repeated passes through the upper atmosphere to reshape its orbit through aerobraking.

By 1999, systematic surveying could begin.

Remaining in orbit let the spacecraft revisit locations, investigating both enduring geological features and changes happening over time.`,
      },
      {
        label: "Goals",
        title: "Survey the Entire Planet",
        imageUrl: "/assets/objects/Mars_Observer_preparations.jpg",
        caption: "Mars_Observer_preparations",
        credit: "NASA",
        text: `A camera investigated landforms, and a laser altimeter measured heights.

A thermal emission spectrometer studied minerals and temperatures. A magnetometer and electron reflectometer investigated magnetic properties, while radio science examined gravity and the atmosphere.

A relay antenna passed messages between surface missions and Earth.

The mission studied Mars as a whole and supported future exploration, supplying maps for landing decisions and context for discoveries made by spacecraft on the ground.`,
      },
      {
        label: "Discoveries",
        title: "Evidence of Water and a Changing Mars",
        imageUrl: "/assets/objects/mars-dust-storms-global-pia03170.webp",
        caption: "Evidence of Water and a Changing Mars",
        credit: "NASA",
        text: `Mars Global Surveyor produced a detailed global height map and found strongly magnetized ancient crust.

Its identification of hematite deposits helped guide Opportunity's landing-site selection.

Images documented gullies, layered terrain, dust storms, and changing polar regions, raising questions about water and climate.

It also scouted landing sites and relayed rover data.

Its discoveries became tools for later missions, helping scientists choose destinations and interpret what their explorers found there.`,
      },
      {
        label: "Now",
        title: "A Decade of Mars Exploration",
        imageUrl: "/assets/objects/ZyIw1.jpg",
        caption: "A Decade of Mars Exploration",
        credit: "NASA",
        text: `Its last communication reached Earth on November 2, 2006.

A review linked the loss to earlier computer-memory and commanding errors that led to an unsafe orientation, an overheated battery, and depleted power.

Recovery attempts failed.

The spacecraft is silent, last known in Mars orbit, without an actively measured exact present position.

Its observing mission ended, but its maps and archived images remained useful. Scientists could continue investigating Mars through information collected during its years above the planet.`,
      },
    ],
  },
  {
    id: "mars-pathfinder",
    name: "Mars Pathfinder",
    place: "Mars",
    coverImageUrl: "/assets/objects/marspath1.gif",
    recordIds: ["sojourner-pathfinder"],
    sourceUrls: ["https://science.nasa.gov/mission/mars-pathfinder/"],
    pages: [
      {
        label: "Origin",
        title: "The Mission That Sent Sojourner to Mars",
        imageUrl: "/assets/objects/marspath1.gif",
        caption: "The Mission That Sent Sojourner to Mars",
        credit: "NASA",
        text: `Mars Pathfinder launched on December 4, 1996, carrying Sojourner.

On July 4, 1997, it reached Ares Vallis. A parachute slowed its descent, rockets reduced speed, and airbags cushioned the final bounces.

Once it settled, the lander's petals opened.

Pathfinder would remain stationary while its rover visited nearby rocks.

The arrival began a mission that tested a new landing approach and a partnership between a fixed science station and a mobile explorer.`,
      },
      {
        label: "Goals",
        title: "Prove a New Way to Explore Mars",
        imageUrl: "/assets/objects/marspath3.gif",
        caption: "Prove a New Way to Explore Mars",
        credit: "NASA",
        text: `Pathfinder demonstrated a relatively inexpensive landing system while collecting science and supporting a rover.

Its stereo camera surveyed the terrain. An atmospheric and meteorology package measured conditions during descent and on the ground.

Solar panels provided power, and the radio relayed Sojourner's observations.

The lander supplied a wider view and the connection home.

The rover investigated individual targets. Together, the two machines could examine more than either could have accomplished independently.`,
      },
      {
        label: "Discoveries",
        title: "Evidence of a Warmer, Wetter Mars",
        imageUrl: "/assets/objects/marspsite.gif",
        caption: "Evidence of a Warmer, Wetter Mars",
        credit: "NASA",
        text: `Pathfinder returned more than 16,500 images and extensive weather observations. Sojourner supplied hundreds of close views and chemical analyses.

The measurements revealed differences among rocks and evidence that ancient floods had shaped the region.

The mission also proved that airbag landing and rover support could work on Mars.

That engineering success helped prepare Spirit and Opportunity.

Pathfinder investigated one place while demonstrating how later explorers could reach and travel across their own destinations.`,
      },
      {
        label: "Now",
        title: "Resting at Ares Vallis",
        imageUrl: "/assets/objects/marsrover.gif",
        caption: "Resting at Ares Vallis",
        credit: "NASA",
        text: `The lander, named the Carl Sagan Memorial Station, remains in Ares Vallis with Sojourner nearby.

Its final data transmission arrived on September 27, 1997. Later contact attempts failed, leaving the precise cause uncertain.

Pathfinder had no return rocket and stayed at its landing site.

Its radio could no longer relay the rover's measurements.

The expedition ended, but the successful landing approach and rover partnership continued influencing missions designed for much longer exploration of Mars.`,
      },
    ],
  },
  {
    id: "phoenix",
    name: "Phoenix",
    place: "Mars",
    coverImageUrl: "/assets/objects/phoenix_lander.jpg",
    recordIds: ["phoenix"],
    sourceUrls: ["https://science.nasa.gov/mission/mars-phoenix/"],
    pages: [
      {
        label: "Origin",
        title: "Digging Into the Martian Arctic",
        imageUrl: "/assets/objects/phoenix_lander.jpg",
        caption: "Digging Into the Martian Arctic",
        credit: "NASA",
        text: `Phoenix launched on August 4, 2007, using hardware developed for an earlier canceled mission.

On May 25, 2008, it landed in Vastitas Borealis on Mars's northern arctic plains.

It had no wheels.

A robotic arm and onboard laboratories would investigate one location, where scientists expected ice close below the surface.

The lander's mission depended on what it could dig up and measure during its working season in the Martian north.`,
      },
      {
        label: "Goals",
        title: "Search for Water and Habitability",
        imageUrl: "/assets/objects/phoenix_3352.jpg",
        caption: "Search for Water and Habitability",
        credit: "NASA",
        text: `Phoenix's arm dug trenches and delivered samples to small ovens in the Thermal and Evolved Gas Analyzer.

Heating revealed gases released from the material.

The Microscopy, Electrochemistry and Conductivity Analyzer investigated soil through methods including wet chemistry.

Stereo and arm cameras recorded the work, while a weather station monitored the atmosphere.

Solar panels powered the mission, which examined water's history and the polar environment's potential habitability.`,
      },
      {
        label: "Discoveries",
        title: "Water Ice Beneath the Surface",
        imageUrl: "/assets/objects/phoenix_440.gif",
        caption: "Water Ice Beneath the Surface",
        credit: "NASA",
        text: `Phoenix exposed bright material that disappeared after exposure, consistent with ice turning directly into vapor.

Heating a sample confirmed water ice.

Soil tests detected perchlorate, and weather observations revealed snow falling from clouds.

These findings linked buried ice with an active polar environment.

They supplied evidence about water and chemistry, without demonstrating living organisms.

Phoenix showed that a fixed lander could investigate several parts of Mars's water story within the reach of one robotic arm.`,
      },
      {
        label: "Now",
        title: "A Lander Frozen in the Arctic",
        imageUrl: "/assets/objects/sunPhoenix.jpg",
        caption: "A Lander Frozen in the Arctic",
        credit: "NASA",
        text: `Phoenix remains on Mars's northern plains.

Shortening days and worsening weather reduced solar power. Its last signal reached Earth on November 2, 2008.

The lander was not designed to survive the severe winter indefinitely, and it had no way to leave.

Later orbital images showed damage consistent with winter conditions.

Its digging season ended after confirming water ice and investigating the soil above it, helping scientists understand a region where much of Mars's water remains frozen.`,
      },
    ],
  },
  {
    id: "apollo-15-lrv",
    name: "Apollo 15 LRV",
    place: "Moon",
    coverImageUrl: "/assets/objects/as17_147_22526.jpg",
    recordIds: ["apollo-15-lrv"],
    sourceUrls: [
      "https://www.nasa.gov/missions/apollo/apollo-15-mission-details/",
      "https://science.nasa.gov/solar-system/moon/genesis-rock/",
    ],
    pages: [
      {
        label: "Origin",
        title: "A Rover Built for the Moon",
        imageUrl: "/assets/objects/as17_147_22526.jpg",
        caption: "A Rover Built for the Moon",
        credit: "NASA",
        text: `The Apollo 15 Lunar Roving Vehicle traveled to the Moon folded against Falcon's descent stage.

David Scott and James Irwin deployed it at Hadley-Apennine in July 1971.

It became the first car driven on the Moon.

Earlier crews had walked between targets. The rover let this expedition reach more distant outcrops and carry equipment and samples, greatly extending what the astronauts could accomplish during a short visit.`,
      },
      {
        label: "Goals",
        title: "Explore Beyond Walking Distance",
        imageUrl: "/assets/objects/as17_146_22367.jpg",
        caption: "Explore Beyond Walking Distance",
        credit: "NASA",
        text: `Four independently driven wheels, electric motors, and batteries carried two astronauts over rough ground.

Navigation equipment helped track their route. A television camera and communications equipment connected the expedition with Earth.

The rover carried tools and samples while conserving time and energy.

It was driven by astronauts, not designed as an independent robot.

Its scientific purpose was to make more geological targets accessible within the limited time available on the surface.`,
      },
      {
        label: "Discoveries",
        title: "A New Way to Explore the Moon",
        imageUrl: "/assets/objects/lrv_deployment_art.jpg",
        caption: "A New Way to Explore the Moon",
        credit: "NASA",
        text: `The rover covered about 27.9 kilometers.

It helped the crew examine Hadley Rille, mountain-front terrain, and different rock exposures, supporting the return of roughly 77 kilograms of samples.

Those samples included the Genesis Rock, a clue to the early lunar crust.

The astronauts and their instruments made the discoveries.

The rover enabled them by carrying the crew farther and making it possible to connect observations across a much wider landscape.`,
      },
      {
        label: "Now",
        title: "Still Parked on the Moon",
        imageUrl: "/assets/objects/as15_88_11901.jpg",
        caption: "Still Parked on the Moon",
        credit: "NASA",
        text: `The rover remains parked near Apollo 15's landing area at Hadley-Apennine.

The astronauts left it on August 2, 1971, when Falcon's ascent stage returned them toward orbit.

There was no room or requirement to bring it home.

It carried no independent long-term science instruments, so exploration ended when its drivers departed.

The vehicle stayed on the Moon, while the samples it helped collect went to Earth.

Its brief driving career had expanded what one expedition could learn.`,
      },
    ],
  },
  {
    id: "insight",
    name: "InSight",
    place: "Mars",
    coverImageUrl: "/assets/objects/insight.jpg",
    recordIds: ["insight"],
    sourceUrls: [
      "https://science.nasa.gov/mission/insight/",
      "https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/",
    ],
    pages: [
      {
        label: "Origin",
        title: "Listening to the Heart of Mars",
        imageUrl: "/assets/objects/insight.jpg",
        caption: "Listening to the Heart of Mars",
        credit: "NASA",
        text: `InSight launched on May 5, 2018, and landed in Elysium Planitia on November 26.

The site offered safe ground for placing instruments beside the lander.

The mission would stay in one place.

While rovers examined visible rocks and landscapes, InSight investigated layers beneath them.

Its arm deployed equipment that would study Mars through vibrations and radio measurements, giving scientists evidence about an interior no surface camera could directly photograph.`,
      },
      {
        label: "Goals",
        title: "Look Beneath the Surface",
        imageUrl: "/assets/objects/38686_Mars-InSight-Solar-Panels-Open-pia196641.jpg",
        caption: "Look Beneath the Surface",
        credit: "NASA",
        text: `SEIS, a sensitive seismometer, detected marsquakes.

Radio tracking through the RISE experiment measured the planet's wobble. A heat-flow probe called HP3 was meant to burrow underground and measure escaping heat.

Cameras, an arm, weather sensors, and a magnetometer supported the experiments. Solar arrays supplied power.

The mission investigated how Mars and other rocky planets formed, using carefully measured signals to examine structures hidden below the surface.`,
      },
      {
        label: "Discoveries",
        title: "The Sounds and Secrets of Mars",
        imageUrl: "/assets/objects/D000M1436_724026330EDR_F0000_0817M_.jpg",
        caption: "The Sounds and Secrets of Mars",
        credit: "NASA",
        text: `InSight detected more than 1,300 marsquakes.

Their vibrations helped estimate the structure of the crust, mantle, and core. Some signals were linked to fresh meteorite impacts.

Radio observations added information about rotation and the core.

The heat probe failed to reach its planned depth because the soil did not provide the expected friction.

The mission produced major interior discoveries alongside an incomplete experiment, showing both the possibilities of its methods and the difficulties of working in unfamiliar ground.`,
      },
      {
        label: "Now",
        title: "Silent Beneath the Martian Sky",
        imageUrl: "/assets/objects/SsGBxVZMFznSQXkiNeeoyM.jpg",
        caption: "Silent Beneath the Martian Sky",
        credit: "NASA",
        text: `Dust gradually covered InSight's solar panels and reduced available electricity.

Its final communication arrived on December 15, 2022. NASA declared the mission over on December 21 after unsuccessful contact attempts.

The lander remains in Elysium Planitia with its instruments beside it. It has no wheels or return vehicle.

InSight no longer records new marsquakes.

Its archived signals remain available, allowing researchers to continue investigating the interior after the lander that measured them became inactive.`,
      },
    ],
  },
  {
    id: "mariner-4",
    name: "Mariner 4",
    place: "Mars",
    coverImageUrl: "/assets/objects/mariner04.gif",
    recordIds: ["mariner-4"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-4/"],
    pages: [
      {
        label: "Origin",
        title: "The First Close-Up Look at Mars",
        imageUrl: "/assets/objects/mariner04.gif",
        caption: "The First Close-Up Look at Mars",
        credit: "NASA",
        text: `Mariner 4 launched on November 28, 1964, carrying a camera toward Mars.

Its encounter on July 14–15, 1965, produced the first close photographs of the surface.

As the data arrived, engineers made a hand-colored preview from the image numbers while awaiting computer processing.

Mars had inspired centuries of speculation.

The spacecraft could now replace some distant guesses with direct observations of actual terrain on another planet.`,
      },
      {
        label: "Goals",
        title: "See Mars Up Close",
        imageUrl: "/assets/objects/m04_1_2a.jpg",
        caption: "See Mars Up Close",
        credit: "NASA",
        text: `A television camera and tape recorder captured and stored flyby images.

A magnetometer, plasma and energetic-particle detectors, and a cosmic-dust detector examined the environment.

Changes in the radio signal as Mars passed between the spacecraft and Earth investigated the atmosphere. Solar panels supplied power.

The mission combined photography, environmental measurements, and deep-space communication.

Its instruments had only a brief planetary encounter, so observations had to be recorded successfully and transmitted afterward.`,
      },
      {
        label: "Discoveries",
        title: "A Cratered, Unexpected Mars",
        imageUrl: "/assets/objects/38754_Mars-Mariner-4-first-tv-image-color-next-to-black-and-white.jpg",
        caption: "A Cratered, Unexpected Mars",
        credit: "NASA",
        text: `Mariner 4 returned 21 complete pictures and part of a twenty-second, showing a heavily cratered landscape.

Radio measurements revealed a thin atmosphere, and it detected no strong global magnetic field.

The photographs covered only a small part of Mars, so they could not describe the whole planet.

Even with that limitation, they transformed the basis for later exploration.

Future missions could investigate questions grounded in close observations rather than imagined canals or assumptions that Mars resembled Earth.`,
      },
      {
        label: "Now",
        title: "Drifting Through Solar Orbit",
        imageUrl: "/assets/objects/6805_Mariner-4-animation-spacecraft-engine-burn-full2.jpg",
        caption: "Drifting Through Solar Orbit",
        credit: "NASA",
        text: `Mariner 4 continued into solar orbit after passing Mars.

Following extended observations and later dust encounters, its pointing-gas supply ran low. Communication ended on December 21, 1967.

It is inactive and presumed to remain in orbit around the Sun, without an exact position supplied by active tracking.

It had never been intended to stop at Mars.

The flyby ended, but the pictures remained—a first close view that later explorers would expand into a much more complete understanding.`,
      },
    ],
  },
  {
    id: "mariner-6",
    name: "Mariner 6",
    place: "Mars",
    coverImageUrl: "/assets/objects/mariner06-07.gif",
    recordIds: ["mariner-6"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-6/"],
    pages: [
      {
        label: "Origin",
        title: "A Closer Look at Mars",
        imageUrl: "/assets/objects/mariner06-07.gif",
        caption: "A Closer Look at Mars",
        credit: "NASA",
        text: `Mariner 6 launched on February 25, 1969, as the first of a pair revisiting Mars after Mariner 4.

Mariner 7 followed another route a few days behind.

On July 31, Mariner 6 passed close to the equatorial region.

The encounter was brief, but the paired mission offered an advantage: observations from the first spacecraft could help improve the second's plan before it reached the planet.`,
      },
      {
        label: "Goals",
        title: "Study Mars From a Close Flyby",
        imageUrl: "/assets/objects/Mariner_6_7_solar_orbit.png",
        caption: "Study Mars From a Close Flyby",
        credit: "NASA",
        text: `Two television cameras returned broad and close views.

Infrared and ultraviolet spectrometers studied the surface and atmosphere. An infrared radiometer measured temperatures, and a radio-occultation experiment investigated atmospheric conditions.

Solar panels supplied power.

The mission assessed Mars's environment and helped prepare later explorers.

Pictures showed the terrain, while other instruments added information about temperatures and atmospheric composition, producing a more useful investigation than photographs alone could provide.`,
      },
      {
        label: "Discoveries",
        title: "A Heavily Cratered Mars",
        imageUrl: "/assets/objects/jupitrtbym7.png",
        caption: "Mariner 7 far encounter color composite, created using Red, Green and Blue filter images",
        credit: "Wikipedia",
        text: `Mariner 6 photographed heavily cratered and chaotic terrain, extending the limited view returned by Mariner 4.

Spectral and temperature observations supported a carbon-dioxide-rich atmosphere and frozen carbon dioxide in the south polar cap.

The southern findings helped controllers adjust Mariner 7's upcoming work.

One mission's discoveries were already improving another's investigation.

The paired encounters showed how observations reaching Earth could change what a spacecraft still approaching Mars would examine.`,
      },
      {
        label: "Now",
        title: "A Silent Flyby Pioneer",
        imageUrl: "/assets/objects/mariner_1_3_artist_impression-1280.jpg",
        caption: "A Silent Flyby Pioneer",
        credit: "NASA",
        text: `Mariner 6 continued into orbit around the Sun after the flyby.

NASA reports data being received until mid-1971, although a precise final-contact date is not established here.

It is now silent and presumed to remain on its solar trajectory.

Its mission included no landing or Mars orbit-insertion maneuver.

The short encounter had ended as designed, leaving scientists with additional terrain and environmental measurements they could use when planning spacecraft able to investigate Mars for much longer.`,
      },
    ],
  },
  {
    id: "mariner-7",
    name: "Mariner 7",
    place: "Mars",
    coverImageUrl: "/assets/objects/Mariner_7_lift-off.jpg",
    recordIds: ["mariner-7"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-7/"],
    pages: [
      {
        label: "Origin",
        title: "The Second Eye on Mars",
        imageUrl: "/assets/objects/Mariner_7_lift-off.jpg",
        caption: "The Second Eye on Mars",
        credit: "NASA",
        text: `Mariner 7 launched on March 27, 1969, following Mariner 6 toward Mars.

Days before the encounter, communication faltered. Controllers recovered a faint signal and switched antennas.

They also revised the plan using its twin's observations.

On August 5, Mariner 7 passed Mars with increased attention to the southern polar region.

A difficult approach had been recovered in time for the spacecraft to investigate the planet.`,
      },
      {
        label: "Goals",
        title: "Build on Mariner 6",
        imageUrl: "/assets/objects/Mars_full_disk_approach_view_from_Mariner_7.jpg",
        caption: "Build on Mariner 6",
        credit: "NASA",
        text: `Two television cameras, infrared and ultraviolet spectrometers, an infrared radiometer, and a radio-occultation experiment investigated Mars.

Solar panels supplied electricity.

The instruments measured terrain, atmospheric composition, and temperatures.

The mission complemented Mariner 6's equatorial views with observations farther south.

Its revised plan made the partnership useful beyond simply doubling the spacecraft: the first encounter's findings could guide the second, helping scientists investigate regions that had already produced interesting clues.`,
      },
      {
        label: "Discoveries",
        title: "Mars From the Southern Hemisphere",
        imageUrl: "/assets/objects/jupitrtbym7.png",
        caption: "Mariner 7 far encounter color composite, created using Red, Green and Blue filter images",
        credit: "Wikipedia",
        text: `Mariner 7 returned 126 images of cratered terrain, the south polar region, and the broad Hellas basin.

Some pictures showed Phobos's irregular shape.

Atmospheric and temperature measurements complemented Mariner 6's results, strengthening the picture of a cold world with a thin carbon-dioxide atmosphere.

The encounter also demonstrated the importance of the team on Earth.

Their response to the communication problem preserved the opportunity for these observations to reach the scientific record.`,
      },
      {
        label: "Now",
        title: "Beyond Mars",
        imageUrl: "/assets/objects/mariner_1_3_artist_impression-1280.jpg",
        caption: "Beyond Mars",
        credit: "NASA",
        text: `Mariner 7 continued into solar orbit after passing Mars.

NASA reports receiving data until mid-1971. An exact final-transmission date is not established here.

It is now silent and presumed to remain on that trajectory, without active tracking of its precise present position.

The spacecraft was never intended to stop at Mars.

Its mission remains an example of a troubled approach recovered in time, adding important southern observations to humanity's early close investigation of the planet.`,
      },
    ],
  },
  {
    id: "mariner-9",
    name: "Mariner 9",
    place: "Mars",
    coverImageUrl: "/assets/objects/mariner09.jpg",
    recordIds: ["mariner-9"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-9/"],
    pages: [
      {
        label: "Origin",
        title: "The First Spacecraft to Orbit Another Planet",
        imageUrl: "/assets/objects/mariner09.jpg",
        caption: "The First Spacecraft to Orbit Another Planet",
        credit: "NASA",
        text: `Mariner 9 launched on May 30, 1971, and reached Mars on November 14.

It became the first spacecraft to orbit another planet.

A huge dust storm initially concealed much of the ground.

Unlike a flyby mission, Mariner 9 could wait.

When the atmosphere cleared, its cameras revealed terrain earlier encounters had missed. Remaining at Mars turned an obscured arrival into an investigation that transformed scientists' understanding of the planet.`,
      },
      {
        label: "Goals",
        title: "Map Mars From Orbit",
        imageUrl: "/assets/objects/mariner-1971.webp",
        caption: "Map Mars From Orbit",
        credit: "NASA",
        text: `Wide- and narrow-angle television cameras mapped the surface.

Infrared and ultraviolet spectrometers studied temperatures and atmospheric properties. Radio measurements investigated the atmosphere and gravity.

Solar arrays supplied power.

The mission aimed to map most of Mars, monitor changes, and photograph Phobos and Deimos.

Repeated orbits gave it more than one opportunity to observe.

That advantage was crucial when weather delayed the survey: the spacecraft could still begin detailed work after the dust cleared.`,
      },
      {
        label: "Discoveries",
        title: "A Completely Different Mars",
        imageUrl: "/assets/objects/Underside+boxart.webp",
        caption: "A Completely Different Mars",
        credit: "NASA",
        text: `Mariner 9 revealed giant volcanoes, including Olympus Mons, and the canyon system named Valles Marineris.

It photographed channels that raised questions about ancient water.

The spacecraft returned 7,329 images, mapped about 85 percent of Mars, and photographed both moons.

The observations showed a much more varied world than earlier crater-dominated pictures suggested.

Its maps helped later missions investigate volcanism, geological history, and the processes that had shaped the surface.`,
      },
      {
        label: "Now",
        title: "Still Circling Mars",
        imageUrl: "/assets/objects/mariner_1_3_artist_impression-1280.jpg",
        caption: "Still Circling Mars",
        credit: "NASA",
        text: `Mariner 9's final contact came on October 27, 1972, when its nitrogen supply for pointing was exhausted.

It was left inactive in Mars orbit.

NASA's historical account predicted a possible impact around 2020, but that prediction is not confirmation of an impact.

These sources do not establish its exact current location or whether it remains in orbit.

Its inactive status is certain; its present resting place is not.

The thousands of images it returned remain a lasting part of Mars exploration.`,
      },
    ],
  },
  {
    id: "pioneer5",
    name: "Pioneer 5",
    place: "Solar Orbit",
    coverImageUrl: "/assets/objects/Ready-for-Orbit-0b706a30.jpeg",
    recordIds: ["pioneer-5"],
    sourceUrls: ["https://science.nasa.gov/mission/pioneer-5/"],
    pages: [
      {
        label: "Origin",
        title: "A Pioneer Between Earth and Venus",
        imageUrl: "/assets/objects/Ready-for-Orbit-0b706a30.jpeg",
        caption: "A Pioneer Between Earth and Venus",
        credit: "NASA",
        text: `Pioneer 5 launched on March 11, 1960, during the early years of deep-space exploration.

An earlier Venus-encounter plan had become a journey around the Sun between Earth's and Venus's orbits.

Its destination was interplanetary space rather than a landing site.

The spacecraft would investigate an environment future missions needed to cross, while testing whether useful measurements could reach Earth across distances that were still a major communication challenge.`,
      },
      {
        label: "Goals",
        title: "Testing Deep Space Technology",
        imageUrl: "/assets/objects/Pioneer-5-main-6d90f78c.jpg",
        caption: "Pioneer 5 close up",
        credit: "NASA",
        text: `A magnetometer measured magnetic fields.

An ionization chamber, Geiger-Müller tube, and proportional counter telescope investigated radiation. A micrometeoroid instrument detected particles, and an aspect sensor helped establish orientation.

Solar cells provided electricity.

Its Telebit digital telemetry system sent readings home.

The mission tested both scientific measurement and communication. Collecting information was only part of the task; the growing distance also had to be crossed successfully by the signals carrying it.`,
      },
      {
        label: "Discoveries",
        title: "Mapping the Space Between Planets",
        imageUrl: "/assets/objects/pioneer-5-7de36f84-b7b8-4396-ad04-e3364832dd1-re-73fbd6b5.jpeg",
        caption: "Mapping the Space Between Planets",
        credit: "NASA",
        text: `Pioneer 5 confirmed a weak magnetic field in interplanetary space and collected radiation observations.

Its communication system demonstrated that digital measurements could reach Earth from millions of kilometers away.

The results helped establish the space between planets as an environment for investigation.

They also supplied engineering experience for later spacecraft.

Longer missions and more complex instruments would depend on reliable communication across even greater distances, building on capabilities this early explorer helped test.`,
      },
      {
        label: "Now",
        title: "Still Circling the Sun",
        imageUrl: "/assets/objects/element115-final-pass-385cd01f.jpg",
        caption: "Still Circling the Sun",
        credit: "NASA",
        text: `Pioneer 5 was last contacted on June 26, 1960, about 36.4 million kilometers from Earth.

It was already following a solar orbit and had no planetary landing or return mission.

NASA describes it as a derelict spacecraft circling the Sun. Its exact current position is not continuously tracked.

Its working life was brief.

The measurements and communication experience remained part of the preparation for spacecraft that would travel farther and stay connected for much longer.`,
      },
    ],
  },
  {
    id: "lunarorbiter1",
    name: "Lunar Orbiter 1",
    place: "Moon",
    coverImageUrl: "/assets/objects/lunar-orbiter-render-93cde28b.jpg",
    recordIds: ["lunar-orbiter-1"],
    sourceUrls: ["https://science.nasa.gov/mission/lunar-orbiter-1/"],
    pages: [
      {
        label: "Origin",
        title: "The First U.S. Orbiter of the Moon",
        imageUrl: "/assets/objects/lunar-orbiter-render-93cde28b.jpg",
        caption: "The First U.S. Orbiter of the Moon",
        credit: "NASA",
        text: `Lunar Orbiter 1 launched on August 10, 1966, to scout the Moon before Apollo astronauts arrived.

It entered lunar orbit on August 14, becoming the first U.S. spacecraft to do so.

Its photographs would show candidate landing regions more closely than Earth-based views allowed.

The mission had a practical purpose: help identify where a crew could descend safely.

Before humans could explore the ground, this spacecraft would help planners examine possible destinations.`,
      },
      {
        label: "Goals",
        title: "Finding Safe Landing Sites",
        imageUrl: "/assets/objects/lunar-orbiter-1-launch-2-spacecraft-2-0d2d5f38.jpg",
        caption: "Finding Safe Landing Sites",
        credit: "NASA",
        text: `Wide- and narrow-angle lenses exposed photographic film.

The spacecraft developed it onboard, scanned it, and transmitted the images by radio.

Solar panels provided electricity, and an engine established lunar orbit.

Radiation and micrometeoroid detectors investigated hazards, while radio tracking helped measure gravity.

The mission combined landing-site photography with environmental and navigation information, giving planners a closer surface view and practical experience operating near the Moon.`,
      },
      {
        label: "Discoveries",
        title: "A New View of the Moon",
        imageUrl: "/assets/objects/1272-lunar-orbiter-moon-jf-35b484c0.jpg",
        caption: "A New View of the Moon",
        credit: "NASA",
        text: `Lunar Orbiter 1 photographed possible landing areas with detail unavailable from Earth.

It also took the first photograph of Earth from the vicinity of the Moon, placing our world above the lunar horizon.

Engineering problems limited some high-resolution results, but the mission still demonstrated useful orbital reconnaissance.

Its observations helped prepare later exploration.

The spacecraft supplied both practical views of the ground astronauts might visit and a new perspective on the world they would leave behind.`,
      },
      {
        label: "Now",
        title: "Its Final Orbit",
        imageUrl: "/assets/objects/1-lunar-orbiter-spacecraft-in-moon-orbit-detlev--5ed48b51.jpg",
        caption: "Its Final Orbit",
        credit: "NASA",
        text: `Controllers deliberately impacted Lunar Orbiter 1 into the far side on October 29, 1966.

Its pointing gas was low and other systems were deteriorating. The ending also prevented radio interference with Lunar Orbiter 2.

The collision destroyed the spacecraft.

Its final area is historically estimated rather than an identified intact wreck.

The pictures had already reached Earth.

The scout's flight ended, but its landing maps remained part of preparing the explorers that followed.`,
      },
    ],
  },
  {
    id: "lunarorbiter2",
    name: "Lunar Orbiter 2",
    place: "Moon",
    coverImageUrl: "/assets/objects/lunar_orbiter_render.jpg",
    recordIds: ["lunar-orbiter-2"],
    sourceUrls: ["https://science.nasa.gov/mission/lunar-orbiter-2/"],
    pages: [
      {
        label: "Origin",
        title: "Mapping the Moon for Apollo",
        imageUrl: "/assets/objects/lunar_orbiter_render.jpg",
        caption: "Mapping the Moon for Apollo",
        credit: "NASA",
        text: `Lunar Orbiter 2 launched on November 6, 1966, following the first mission's useful survey.

It entered orbit on November 10, then lowered its closest passes for detailed photography.

The focus was candidate landing regions across the equatorial near side.

Apollo needed more than a broad lunar map.

Planners required evidence about specific locations, including the terrain and hazards that could determine whether a place was suitable for a crew.`,
      },
      {
        label: "Goals",
        title: "Searching for Safe Landing Sites",
        imageUrl: "/assets/objects/images (3).jpeg",
        caption: "Searching for Safe Landing Sites",
        credit: "NASA",
        text: `Like Lunar Orbiter 1, it carried a dual-lens camera, onboard film processing, and a scanner for radio transmission.

Solar panels supplied power.

Radiation and micrometeoroid instruments examined the environment, while tracking investigated gravity.

Its assignment included thirteen primary and seventeen secondary candidate sites.

The mission linked geological reconnaissance with engineering needs, helping planners examine ground hazards and understand forces that could affect approaching spacecraft.`,
      },
      {
        label: "Discoveries",
        title: "Revealing the Lunar Surface",
        imageUrl: "/assets/objects/Disc-copernicus crater.jpg",
        caption: "Disc-copernicus crater on the Lunar Surface",
        credit: "NASA",
        text: `Lunar Orbiter 2 photographed landing areas, crater terrain, and Ranger 8's impact region.

An oblique picture of Copernicus Crater showed its depth especially clearly.

After photography, orbit changes enabled tracking over a wider region to improve gravity knowledge.

The images assessed hazards below, while tracking investigated forces above.

Both were useful to Apollo, where a successful arrival depended on navigation as well as choosing ground safe enough for a lunar module.`,
      },
      {
        label: "Now",
        title: "Its Final Impact",
        imageUrl: "/assets/objects/Disc-copernicus crater.jpg",
        caption: "Disc-copernicus crater on the Lunar Surface",
        credit: "NASA",
        text: `Lunar Orbiter 2 was deliberately impacted into the far side on October 11, 1967.

Its attitude-control gas was nearly exhausted, and retirement prevented interference with later missions.

It was destroyed and no longer remained in orbit.

NASA provides an approximate impact area, not a modern identification of every piece of debris.

Its photographic work was complete.

The images and gravity measurements remained available, helping turn possible Apollo destinations into carefully studied landing sites.`,
      },
    ],
  },
  {
    id: "lunarorbiter3",
    name: "Lunar Orbiter 3",
    place: "Moon",
    coverImageUrl: "/assets/objects/lunar_orbiter_render.jpg",
    recordIds: ["lunar-orbiter-3"],
    sourceUrls: ["https://science.nasa.gov/mission/lunar-orbiter-3/"],
    pages: [
      {
        label: "Origin",
        title: "A Closer Look at the Moon",
        imageUrl: "/assets/objects/lunar_orbiter_render.jpg",
        caption: "A Closer Look at the Moon",
        credit: "NASA",
        text: `Lunar Orbiter 3 launched on February 5, 1967, after earlier scouts had identified promising landing regions.

It entered lunar orbit on February 8.

The task was to inspect and confirm sites rather than start the search again.

Repeated and overlapping photographs could reveal terrain shape concealed in a single view.

The mission helped prepare choices for Surveyor landers and the Apollo crews who would eventually investigate those destinations directly.`,
      },
      {
        label: "Goals",
        title: "Finding and Studying Landing Sites",
        imageUrl: "/assets/objects/lunar_orbiter_program_14_lo_3_launch.jpg",
        caption: "lunar orbiter program 14 lo 3 launch",
        credit: "NASA",
        text: `A dual-lens photographic system exposed and developed film, then scanned it for transmission.

Solar panels, a main engine, and pointing thrusters supported the work.

Micrometeoroid and radiation instruments measured the environment, and radio tracking investigated gravity.

Overlapping views helped assess relief and hazards.

The mission was built to reduce uncertainty about later routes and destinations, supplying repeated observations rather than leaving planners dependent on one flat photograph of each location.`,
      },
      {
        label: "Discoveries",
        title: "Detailed Views of the Moon",
        imageUrl: "/assets/objects/tsiolkovsky crater.jpg",
        caption: "Tsiolkovsky crater of the Moon",
        credit: "NASA",
        text: `A film-readout malfunction prevented some pictures from reaching Earth, but Lunar Orbiter 3 completed its site-confirmation objectives.

Its images joined earlier surveys in selecting preliminary Apollo sites, including regions later visited by Apollo 11 and Apollo 12.

Tracking also tested an orbit resembling Apollo's.

The main contribution was practical confidence in terrain and orbital behavior.

Its observations helped prepare a human journey whose safety depended on careful reconnaissance before the crew arrived.`,
      },
      {
        label: "Now",
        title: "Its Final Orbit",
        imageUrl: "/assets/objects/tsiolkovsky crater.jpg",
        caption: "Its Final Orbit",
        credit: "NASA",
        text: `Controllers sent Lunar Orbiter 3 into the Moon on October 9, 1967, after its photography and tracking work.

It was destroyed near the western lunar limb.

These records provide an approximate historical impact location.

The controlled ending retired a spacecraft no longer needed for its assignment.

Its maps and tracking information had already reached Earth.

The spacecraft did not survive, but its work continued helping decide where later explorers could go and how they could reach those places.`,
      },
    ],
  },
  {
    id: "lunarorbiter4",
    name: "Lunar Orbiter 4",
    place: "Moon",
    coverImageUrl: "/assets/objects/lunar_orbiter_render.jpg",
    recordIds: ["lunar-orbiter-4"],
    sourceUrls: ["https://science.nasa.gov/mission/lunar-orbiter-4/"],
    pages: [
      {
        label: "Origin",
        title: "Mapping Almost the Entire Moon",
        imageUrl: "/assets/objects/lunar_orbiter_render.jpg",
        caption: "Mapping Almost the Entire Moon",
        credit: "NASA",
        text: `Lunar Orbiter 4 launched on May 4, 1967, with a broader task than earlier landing-site surveys.

Its nearly polar orbit, reached on May 8, let it photograph farther north and south.

The mission investigated lunar geography and geological history.

A camera-door problem threatened photography, but controllers found a way to continue.

The spacecraft would help scientists connect major landforms across the Moon rather than study only isolated landing patches.`,
      },
      {
        label: "Goals",
        title: "A Global Survey of the Moon",
        imageUrl: "/assets/objects/lunar_orbiter_program_17_lo_4_launch.jpg",
        caption: "lunar orbiter program 17 lo 4 launch",
        credit: "NASA",
        text: `The dual-lens film system developed and scanned pictures onboard before radio transmission.

Solar panels, an engine, and pointing equipment supported its route.

Radiation and micrometeoroid measurements examined the environment, while tracking supplied gravity information.

The mission aimed for connected photographic coverage.

Seeing craters, basins, and mountains within a wider setting could help scientists investigate their relationships and history, extending the survey beyond the immediate needs of landing-site selection.`,
      },
      {
        label: "Discoveries",
        title: "A New Map of the Moon",
        imageUrl: "/assets/objects/Mare_Orientale.jpg",
        caption: "Mare Orientale of the Moon",
        credit: "NASA",
        text: `Lunar Orbiter 4 photographed about 99 percent of the near side and substantial far-side regions, including views near the south pole.

Its images showed relationships among craters, basins, and mountain systems such as Mare Orientale.

Camera and readout problems limited some results.

The returned survey still became a major foundation for lunar mapping.

It helped scientists interpret individual features through the larger landscapes around them, providing evidence about processes that had shaped the surface.`,
      },
      {
        label: "Now",
        title: "Its Final Descent",
        imageUrl: "/assets/objects/Mare_Orientale.jpg",
        caption: "Mare Orientale of the Moon",
        credit: "NASA",
        text: `Contact was lost on July 17, 1967, before controlled retirement.

The Moon's uneven gravity caused the orbit to decay.

NASA's mission history gives October 6 as the impact date; the supplied archive-derived record presumes impact by late October.

The supported conclusion is destruction on the Moon, without an identified precise impact location.

Its ending was less certain than planned.

Much of the survey had already reached Earth, where the photographs continued supporting scientific work.`,
      },
    ],
  },
  {
    id: "lunarorbiter5",
    name: "Lunar Orbiter 5",
    place: "Moon",
    coverImageUrl: "/assets/objects/lunar_orbiter_render.jpg",
    recordIds: ["lunar-orbiter-5"],
    sourceUrls: ["https://science.nasa.gov/mission/lunar-orbiter-5/"],
    pages: [
      {
        label: "Origin",
        title: "The Final Lunar Orbiter",
        imageUrl: "/assets/objects/lunar_orbiter_render.jpg",
        caption: "The Final Lunar Orbiter",
        credit: "NASA",
        text: `Lunar Orbiter 5 launched on August 1, 1967, as the final scout in the series.

It entered near-polar orbit on August 5 and began photography two days later.

Earlier missions had surveyed landing regions and much of the wider surface.

This spacecraft would fill gaps, revisit important sites, and examine missed far-side areas.

Its mission helped complete a photographic record that would support both Apollo preparation and broader investigations of lunar geology.`,
      },
      {
        label: "Goals",
        title: "Completing the Lunar Survey",
        imageUrl: "/assets/objects/lunar_orbiter_program_20_lo_5_launch.jpg",
        caption: "Completing the Lunar Survey",
        credit: "NASA",
        text: `Wide- and narrow-angle lenses exposed film developed and scanned onboard.

Solar arrays supplied power.

Radiation and micrometeoroid instruments investigated hazards, and tracking refined gravity knowledge.

Photography included additional Apollo and Surveyor sites, scientifically interesting regions, and missing far-side coverage.

The mission combined surface maps with operational experience.

Its observations would help later explorers understand both the places they might visit and the orbital conditions they needed to navigate.`,
      },
      {
        label: "Discoveries",
        title: "Completing the Picture of the Moon",
        imageUrl: "/assets/objects/OIP.jpg",
        caption: "First Image of Farside of the Moon",
        credit: "NASA",
        text: `Lunar Orbiter 5 filled major gaps in far-side photography and supplied detailed views of landing and science targets.

Together, the five Lunar Orbiters photographed almost the entire Moon.

Tracking improved predictions of gravitational changes to spacecraft orbits. The mission also photographed Earth.

The series provided more than images.

Apollo planners gained a nearly global photographic record and practical experience near the Moon, both useful when preparing a crewed journey to the surface.`,
      },
      {
        label: "Now",
        title: "The Final Impact",
        imageUrl: "/assets/objects/OIP.jpg",
        caption: "First Image of Farside of the Moon",
        credit: "NASA",
        text: `Lunar Orbiter 5 was commanded to impact the Moon on January 31, 1968, after its survey and tracking work.

It was destroyed on the near side rather than left as an uncontrolled active radio source.

Its impact position is historically approximate.

The ending closed the Lunar Orbiter series.

The spacecraft had inspected destinations for other explorers.

Its photographs remained on Earth, preserving the work of a robotic program that helped prepare the human missions that followed.`,
      },
    ],
  },
  {
    id: "grail-a",
    name: "GRAIL",
    place: "Moon",
    coverImageUrl: "/assets/objects/grail.jpg",
    recordIds: ["grail-a"],
    sourceUrls: ["https://science.nasa.gov/mission/grail/"],
    pages: [
      {
        label: "Origin",
        title: "Listening to the Moon’s Gravity",
        imageUrl: "/assets/objects/grail.jpg",
        caption: "Listening to the Moon’s Gravity",
        credit: "NASA",
        text: `GRAIL-A and GRAIL-B launched together on September 10, 2011.

Students later named them Ebb and Flow.

They reached lunar orbit around the turn of the year and began flying in formation.

Small changes in their separation were central to the experiment.

Different regions of the Moon would alter their motion through gravity, letting the mission investigate hidden structures that ordinary surface photographs could not directly reveal.`,
      },
      {
        label: "Goals",
        title: "Mapping the Moon from Within",
        imageUrl: "/assets/objects/grail.jpg",
        caption: "Mapping the Moon from Within",
        credit: "NASA",
        text: `Each spacecraft carried a Lunar Gravity Ranging System to measure their separation precisely.

Different gravitational pulls changed that distance.

Solar panels supplied power, and MoonKAM cameras let students request lunar images.

The mission mapped gravity, investigated the crust and interior, and studied the effects of impacts and geological processes.

Two spacecraft working together could convert subtle changes in motion into evidence about material below the visible surface.`,
      },
      {
        label: "Discoveries",
        title: "Seeing Inside the Moon",
        imageUrl: "/assets/objects/grail_2.jpg",
        caption: "Seeing Inside the Moon",
        credit: "NASA",
        text: `Ebb and Flow produced an exceptionally detailed lunar gravity map.

It revealed a heavily fractured crust and supported thinner crustal estimates than earlier work suggested.

The results helped explain mass concentrations, or mascons, that disturb lunar orbits, and exposed buried structures.

These were discoveries made through motion.

The mission gave scientists a way to investigate the interior without directly sampling hidden layers, adding another perspective on the Moon's geological history.`,
      },
      {
        label: "Now",
        title: "Its Final Descent",
        imageUrl: "/assets/objects/GRAIL_s_Final_Resting_Spot.jpg",
        caption: "GRAIL_s_Final_Resting_Spot",
        credit: "NASA",
        text: `Ebb and Flow deliberately impacted a mountain near the north pole on December 17, 2012.

The extended mission was complete and fuel was low.

Controlled trajectories kept them away from historic landing sites.

Both were destroyed, leaving impact sites rather than intact orbiters. The area was named for Sally Ride, who supported student imaging.

Their flight ended, but the gravity map remained available for researchers investigating the hidden structure their paired motion had helped reveal.`,
      },
    ],
  },
  {
    id: "ladee",
    name: "LADEE",
    place: "Moon",
    coverImageUrl: "/assets/objects/ladee.jpg",
    recordIds: ["ladee"],
    sourceUrls: [
      "https://science.nasa.gov/mission/ladee/",
      "https://science.nasa.gov/mission/ladee/ladee-science-and-instruments/",
    ],
    pages: [
      {
        label: "Origin",
        title: "Exploring the Moon’s Thin Atmosphere",
        imageUrl: "/assets/objects/ladee.jpg",
        caption: "Exploring the Moon’s Thin Atmosphere",
        credit: "NASA",
        text: `LADEE launched from Wallops in September 2013—September 6 locally and September 7 in Universal Time.

The Lunar Atmosphere and Dust Environment Explorer investigated the Moon's extremely thin atmosphere and dust.

It entered orbit in October, then flew low enough to sample near-surface conditions.

The Moon lacked thick air like Earth's.

Its faint gases and tiny particles nevertheless formed an environment that the spacecraft could measure and help scientists understand.`,
      },
      {
        label: "Goals",
        title: "Studying the Lunar Atmosphere",
        imageUrl: "/assets/objects/201309060009HQ~large.jpg",
        caption: "Studying the Lunar Atmosphere",
        credit: "NASA",
        text: `A neutral mass spectrometer identified gases.

An ultraviolet and visible spectrometer studied faint light from gases and dust, while the Lunar Dust Experiment detected grains.

The spacecraft also carried a laser communications demonstration. Solar power supported its orbit.

Scientists investigated changes in the exosphere and whether dust could explain old horizon-light observations.

The instruments measured conditions too sparse for ordinary experience, connecting small signals with processes around an almost airless world.`,
      },
      {
        label: "Discoveries",
        title: "A Closer Look at the Lunar Exosphere",
        imageUrl: "/assets/objects/ladee-lunar-orbit.png",
        caption: "A Closer Look at the Lunar Exosphere",
        credit: "NASA",
        text: `LADEE revealed a persistent dust cloud generated by meteoroid impacts and identified neon in the exosphere.

Its measurements connected changes with sunlight, the solar wind, and incoming material.

The laser experiment demonstrated high-rate communication between the Moon and Earth.

These results improved understanding of the Moon's surroundings and processes affecting other airless bodies.

Even without a thick atmosphere, the destination had a changing environment that careful instruments could investigate.`,
      },
      {
        label: "Now",
        title: "Its Final Impact",
        imageUrl: "/assets/objects/201309060009HQ~large.jpg",
        caption: "Its Final Impact",
        credit: "NASA",
        text: `LADEE completed its science mission and an extension before a planned impact on April 18, 2014, Universal Time.

Lowering its orbit allowed closer measurements, but lunar gravity would eventually bring it down.

Its impact crater was later identified near Sundman V on the far side.

The spacecraft was destroyed.

Its observations had already reached Earth, leaving a detailed record of gases and dust that would otherwise have been much harder to study.`,
      },
    ],
  },
  {
    id: "mariner5",
    name: "Mariner 5",
    place: "Venus",
    coverImageUrl: "/assets/objects/mariner05.gif",
    recordIds: ["mariner-5"],
    sourceUrls: ["https://science.nasa.gov/mission/mariner-5/"],
    pages: [
      {
        label: "Origin",
        title: "A Close Encounter with Venus",
        imageUrl: "/assets/objects/mariner05.gif",
        caption: "A Close Encounter with Venus",
        credit: "NASA",
        text: `Mariner 5 began as a backup for Mariner 4's Mars mission.

Engineers later modified it for Venus.

It launched on June 14, 1967, and passed the planet on October 19.

The spacecraft had no camera.

Its instruments would investigate the atmosphere and nearby space through measurements, giving hardware prepared for one journey a different mission and helping scientists examine conditions hidden beneath Venus's bright clouds.`,
      },
      {
        label: "Goals",
        title: "Revealing Venus from Space",
        imageUrl: "/assets/objects/KSC-67PC-0184.jpg",
        caption: "Launch of Mariner 5",
        credit: "NASA",
        text: `The key experiment followed a radio signal as Venus's atmosphere bent and weakened it.

Those changes revealed atmospheric properties.

An ultraviolet photometer, magnetometer, solar-plasma probe, and radiation detector supplied other measurements. Solar panels provided power.

The mission studied pressure, temperature, charged particles, and solar-wind interactions.

Its record would come from instrument readings, demonstrating how signals and particles could explain a world even when the spacecraft carried no camera.`,
      },
      {
        label: "Discoveries",
        title: "A Hot, Dense World",
        imageUrl: "/assets/objects/KSC-67PC-0184.jpg",
        caption: "Launch of Mariner 5",
        credit: "NASA",
        text: `Radio observations revealed a dense, hot atmosphere.

Mariner 5 detected no Earth-like planetary magnetic field, but showed how Venus's ionosphere could deflect the solar wind.

Scientists compared its results with those from the Soviet Venera 4 probe.

The combined evidence corrected earlier interpretations.

The mission helped build a more reliable description of Venus, showing why measurements from different explorers could become especially useful when examined together.`,
      },
      {
        label: "Now",
        title: "The Mission Continues in Silence",
        imageUrl: "/assets/objects/mariner05.gif",
        caption: "The Mission Continues in Silence",
        credit: "NASA",
        text: `Mariner 5 continued into solar orbit after Venus's gravity altered its path.

Contact was lost on December 4, 1967.

Controllers briefly detected it again on October 14, 1968, but received no additional telemetry. Attempts ended on November 5.

It is silent and presumed to remain in solar orbit, without a precise live position.

Its brief return signal did not begin another scientific chapter.

The atmospheric measurements already received remained part of understanding the planet its adapted hardware had investigated.`,
      },
    ],
  },
  {
    id: "surveyor1",
    name: "Surveyor 1",
    place: "Moon",
    coverImageUrl: "/assets/objects/surveyor_beach.jpg",
    recordIds: ["surveyor-1"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-1/"],
    pages: [
      {
        label: "Origin",
        title: "The First U.S. Soft Landing",
        imageUrl: "/assets/objects/surveyor_beach.jpg",
        caption: "The First U.S. Soft Landing",
        credit: "NASA",
        text: `Surveyor 1 launched on May 30, 1966, to test a task essential to Apollo: land gently on the Moon and keep working.

On June 2, radar, a braking rocket, and small descent engines brought it to Oceanus Procellarum.

It became the first U.S. spacecraft to complete a successful lunar soft landing.

Before astronauts depended on their own equipment, this robotic mission demonstrated an actual controlled arrival.`,
      },
      {
        label: "Goals",
        title: "Proving the Moon Could Be Landed On",
        imageUrl: "/assets/objects/images (5).jpeg",
        caption: "Proving the Moon Could Be Landed On",
        credit: "NASA",
        text: `A television camera photographed the ground and landing gear.

Engineering sensors measured temperatures, structural conditions, and descent performance. Solar panels and batteries supplied power.

The mission tested radar-guided landing and whether the surface could support a spacecraft.

Surveyor 1 carried neither the scooping arm nor chemical-analysis instrument used by some later Surveyors.

Its pictures and engineering measurements answered practical questions about both the descent and the ground on which Apollo would need to stand.`,
      },
      {
        label: "Discoveries",
        title: "The Moon Up Close",
        imageUrl: "/assets/objects/surv1_lro_thumb.png",
        caption: "The Moon Up Close",
        credit: "NASA",
        text: `Surveyor 1 returned more than 11,000 images.

They showed nearby terrain and the way its footpads rested on the surface.

The photographs and engineering data demonstrated that lunar ground could support a landed spacecraft.

The successful descent was itself a major result.

Apollo planners now had evidence from a machine that had actually landed, reducing uncertainty about the final stage of a journey where correct navigation had to become a safe arrival.`,
      },
      {
        label: "Now",
        title: "Its Final Silence",
        imageUrl: "/assets/objects/images (4).jpeg",
        caption: "Its Final Silence",
        credit: "NASA",
        text: `Surveyor 1 remains in Oceanus Procellarum.

Its picture-taking mission ended in July 1966 as power declined near lunar sunset. Engineers continued occasional checks until January 7, 1967.

It had no ascent vehicle and was intended to stay.

The lander is inactive today.

Its observations had already helped prepare Apollo, leaving the spacecraft as part of the record of how robots tested the lunar destination before people could safely explore it.`,
      },
    ],
  },
  {
    id: "surveyor3",
    name: "Surveyor 3",
    place: "Moon",
    coverImageUrl: "/assets/objects/surveyor_nasm.jpg",
    recordIds: ["surveyor-3"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-3/"],
    pages: [
      {
        label: "Origin",
        title: "Testing the Lunar Soil",
        imageUrl: "/assets/objects/surveyor_nasm.jpg",
        caption: "Testing the Lunar Soil",
        credit: "NASA",
        text: `Surveyor 3 launched on April 17, 1967, carrying the program's first surface-sampling arm.

It reached Oceanus Procellarum on April 20, Universal Time.

Reflective rocks confused the radar, causing two bounces before it settled.

Its instruments could still work.

The lander would test lunar soil directly. Two years later, Apollo 12 astronauts would visit the same machine, adding an unusual second chapter to its robotic mission.`,
      },
      {
        label: "Goals",
        title: "Digging Into the Moon",
        imageUrl: "/assets/objects/as12-48-7134_1280.jpg",
        caption: "Digging Into the Moon",
        credit: "NASA",
        text: `A television camera recorded the terrain and the soil-mechanics surface sampler.

The scoop dug trenches, pressed on the ground, and moved material to investigate how it behaved.

Solar panels and batteries powered the work.

The mission tested landing and assessed whether the ground could support Apollo's larger lunar module.

Direct contact added evidence beyond pictures, connecting physical soil tests with the engineering questions that mattered to future human arrivals.`,
      },
      {
        label: "Discoveries",
        title: "Soil Strong Enough to Land",
        imageUrl: "/assets/objects/as12-48-7134_1280.jpg",
        caption: "Soil Strong Enough to Land",
        credit: "NASA",
        text: `Surveyor 3 returned 6,326 pictures and performed trenching, bearing, and impact tests.

Its observations supported the conclusion that lunar ground could hold an Apollo lander.

In November 1969, Apollo 12 astronauts visited and brought selected parts, including its camera, to Earth.

Researchers could then examine hardware after prolonged lunar exposure.

A robot that helped prepare a human landing became an object of that crew's investigation, supplying another kind of evidence when parts of it came home.`,
      },
      {
        label: "Now",
        title: "Visited by Apollo 12",
        imageUrl: "/assets/objects/detail_as12-48-7121_orig.jpg",
        caption: "Visited by Apollo 12",
        credit: "NASA",
        text: `Most of Surveyor 3 remains in its crater in Oceanus Procellarum, near Apollo 12's site.

Its last contact was on May 4, 1967. It never recovered useful operations after lunar night.

Apollo 12 removed only selected parts.

The rest stayed because the lander had no return engine.

Some hardware reached Earth for study, while most remained beside the ground it had tested—a rare mission ending that linked robotic and human exploration at the same place.`,
      },
    ],
  },
  {
    id: "surveyor5",
    name: "Surveyor 5",
    place: "Moon",
    coverImageUrl: "/assets/objects/first chemistry set on moon.jpg",
    recordIds: ["surveyor-5"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-5/"],
    pages: [
      {
        label: "Origin",
        title: "Analyzing the Moon’s Chemistry",
        imageUrl: "/assets/objects/first chemistry set on moon.jpg",
        caption: "Analyzing the Moon’s Chemistry",
        credit: "NASA",
        text: `Surveyor 5 launched on September 8, 1967, with equipment to investigate soil chemistry.

A helium leak threatened the descent, but engineers adjusted the landing sequence.

On September 11, it reached Mare Tranquillitatis safely.

Earlier Surveyors had tested landing and soil mechanics.

This mission added a different question: what elements made up the ground?

Its safe arrival let a small laboratory begin direct chemical analysis of another world's surface.`,
      },
      {
        label: "Goals",
        title: "What Is the Moon Made Of?",
        imageUrl: "/assets/objects/su5_67_h_1340.gif",
        caption: "Surveyor 5 image of the footpad resting in the lunar soil",
        credit: "NASA",
        text: `An alpha-scattering instrument replaced the scoop used on Surveyor 3.

It sent particles toward the soil and measured returning signals to estimate elemental composition.

A television camera recorded the site, and a footpad magnet investigated magnetic properties. Solar panels supplied energy.

The mission combined Apollo preparation with the first direct surface chemical analysis on another world.

Its instruments connected what the ground looked like with what it was made of.`,
      },
      {
        label: "Discoveries",
        title: "Reading the Lunar Soil",
        imageUrl: "/assets/objects/surveyor_beach.jpg",
        caption: "Reading the Lunar Soil",
        credit: "NASA",
        text: `Surveyor 5 found soil resembling basalt in composition, connecting lunar material with volcanic rock familiar on Earth.

The camera returned thousands of pictures.

A brief engine-firing experiment examined how exhaust disturbed the ground.

Together, the observations linked chemistry, appearance, and landing conditions.

The mission showed that a robot could do more than photograph its destination: it could test the material beneath its feet and supply evidence an ordinary image could not reveal.`,
      },
      {
        label: "Now",
        title: "Its Final Transmission",
        imageUrl: "/assets/objects/as12-48-7134_1280.jpg",
        caption: "Its Final Transmission",
        credit: "NASA",
        text: `Surveyor 5 remains on a small crater's slope in Mare Tranquillitatis.

It operated during several daylight periods before communication ended in December 1967.

NASA's overview and the archive-derived record differ by a day on final contact, so December is the common supported date.

Its landing was one-way, with no ascent system.

The laboratory stopped working at the ground it had tested, while its measurements remained part of the early direct investigation of lunar chemistry.`,
      },
    ],
  },
  {
    id: "surveyor6",
    name: "Surveyor 6",
    place: "Moon",
    coverImageUrl: "/assets/objects/webp.webp",
    recordIds: ["surveyor-6"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-6/"],
    pages: [
      {
        label: "Origin",
        title: "A Lander That Moved",
        imageUrl: "/assets/objects/webp.webp",
        caption: "A Lander That Moved",
        credit: "NASA",
        text: `Surveyor 6 launched on November 7, 1967, and landed in Sinus Medii on November 10.

It began with photography and chemical analysis.

Then the mission added an unusual maneuver.

On November 17, the spacecraft fired its engines and landed a short distance away.

The move let its camera inspect original footpad marks and view familiar terrain from another position, adding new measurements through a very brief journey.`,
      },
      {
        label: "Goals",
        title: "Studying the Moon from the Ground",
        imageUrl: "/assets/objects/surveyor_beach.jpg",
        caption: "Studying the Moon from the Ground",
        credit: "NASA",
        text: `A television camera, alpha-scattering instrument, and footpad magnet investigated terrain, elemental composition, and magnetic material.

Solar panels and batteries provided power.

The mission assessed Apollo landing conditions and compared soil with earlier sites.

The planned hop enabled inspection of disturbed ground and paired views of terrain.

The spacecraft did not need to travel far.

A small movement could create a useful comparison unavailable while it stood only at its original touchdown point.`,
      },
      {
        label: "Discoveries",
        title: "The First Lunar Hop",
        imageUrl: "/assets/objects/images (7).jpeg",
        caption: "The First Lunar Hop",
        credit: "NASA",
        text: `Surveyor 6 returned 29,952 images and about thirty hours of chemical data, finding a basalt-like surface.

Its hop rose roughly three meters and moved about two and a half meters—the first powered takeoff from the Moon.

Pictures of the original landing marks helped investigate soil behavior.

Paired views added information about terrain shape.

Even a short movement changed what the spacecraft could measure, demonstrating another way to investigate a landing site.`,
      },
      {
        label: "Now",
        title: "Its Final Contact",
        imageUrl: "/assets/objects/images (7).jpeg",
        caption: "Its Final Contact",
        credit: "NASA",
        text: `Surveyor 6 remains near its second touchdown point in Sinus Medii.

It entered hibernation for lunar night in November 1967.

Contact briefly returned on December 14, but produced no useful new data.

The hop was a local experiment, not an escape from the Moon. There was no return mission.

Its final position became its permanent resting place.

The short distance traveled had already supplied new ground observations and a milestone in lunar exploration.`,
      },
    ],
  },
  {
    id: "surveyor7",
    name: "Surveyor 7",
    place: "Moon",
    coverImageUrl: "/assets/objects/surveyor_beach.jpg",
    recordIds: ["surveyor-7"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-7/"],
    pages: [
      {
        label: "Origin",
        title: "The Scientific Surveyor",
        imageUrl: "/assets/objects/surveyor_beach.jpg",
        caption: "The Scientific Surveyor",
        credit: "NASA",
        text: `Surveyor 7 launched on January 7, 1968, as the last spacecraft in the original series.

Earlier landers had answered many Apollo preparation questions.

This one would investigate a different environment.

On January 10, it landed near Tycho Crater in the southern highlands.

Comparing highland material with the darker plains studied previously would extend the program into broader science, examining how different lunar regions differed in composition and physical properties.`,
      },
      {
        label: "Goals",
        title: "Exploring the Lunar Highlands",
        imageUrl: "/assets/objects/surveyor_7_landing_site.png",
        caption: "surveyor_7_landing_site",
        credit: "NASA",
        text: `A television camera, alpha-scattering instrument, and soil sampler investigated structure and chemistry.

Footpad magnets, mirrors, and engineering sensors added observations. Solar panels powered the station.

When the chemistry instrument failed to lower fully, the sampler pushed it into position and later moved it among targets.

The mission investigated a highland site through images, soil manipulation, and chemical tests, adding a comparison with locations examined by earlier Surveyors.`,
      },
      {
        label: "Discoveries",
        title: "A Different Side of the Moon",
        imageUrl: "/assets/objects/surveyortycho.gif",
        caption: "Tycho Crater panaroma",
        credit: "NASA",
        text: `Surveyor 7 returned more than 21,000 pictures and about a hundred hours of chemical measurements across two lunar days.

Its scoop dug trenches and moved rocks.

Highland material contained less iron-group material than mare soils measured earlier.

The lander also detected laser beams sent from Earth.

Its results supported important differences between lunar regions and demonstrated another way to connect a surface instrument with researchers investigating it from home.`,
      },
      {
        label: "Now",
        title: "The Final Surveyor",
        imageUrl: "/assets/objects/Tycho crater.jpg",
        caption: "Tycho Crater",
        credit: "NASA",
        text: `Surveyor 7 remains on the ejecta blanket north of Tycho, material thrown outward when the crater formed.

Operations ended on February 21, 1968, after two daylight periods.

It had no ascent vehicle and was intended to stay.

The original Surveyor series ended its exploration at this highland site.

The spacecraft is inactive, but its measurements preserved an important comparison, helping show why the Moon's different regions could not be treated as one uniform surface.`,
      },
    ],
  },
  {
    id: "ranger7",
    name: "Ranger 7",
    place: "Moon",
    coverImageUrl: "/assets/objects/ranger.gif",
    recordIds: ["ranger-7"],
    sourceUrls: ["https://science.nasa.gov/mission/ranger-7/"],
    pages: [
      {
        label: "Origin",
        title: "The First Successful Close-Up",
        imageUrl: "/assets/objects/ranger.gif",
        caption: "The First Successful Close-Up",
        credit: "NASA",
        text: `Ranger 7 launched on July 28, 1964, after a difficult sequence of earlier Ranger missions.

This spacecraft would not land gently.

On July 31, its cameras worked as the ground approached.

The final minutes were its main assignment.

While Apollo was being prepared, Ranger 7 could show details telescopes could not resolve, supplying close evidence about terrain that future landing spacecraft—and eventually astronauts—would encounter.`,
      },
      {
        label: "Goals",
        title: "Seeing the Moon Before Impact",
        imageUrl: "/assets/objects/ra7_b001.gif",
        caption: "the first picture of the Moon by a U.S. spacecraft, on 31 July 1964",
        credit: "NASA",
        text: `Six television cameras in two independent channels photographed the surface at different scales.

Solar panels, batteries, radio transmitters, and antennas kept the pictures reaching Earth.

Ranger 7 had no landing legs or soft-landing equipment.

It was built to impact the Moon.

Approaching the ground allowed increasingly detailed images, but left limited time for transmission.

The design used a one-way trajectory to collect reconnaissance that later missions could use for safer arrivals.`,
      },
      {
        label: "Discoveries",
        title: "The Moon in Unprecedented Detail",
        imageUrl: "/assets/objects/ranger7pn199.gif",
        caption: "Images by ranger 7 before impact",
        credit: "NASA",
        text: `In roughly seventeen minutes, Ranger 7 returned 4,308 photographs.

Small craters and textures became visible beyond the capabilities of Earth-based telescopes. Final images reached about half-meter resolution.

Relatively smooth mare terrain appeared promising for Apollo, but the photographs also exposed hazards requiring careful selection.

The successful camera system supplied both science and practical planning evidence.

Its short approach helped connect distant maps with the actual ground a future lander would have to reach.`,
      },
      {
        label: "Now",
        title: "Its Final Descent",
        imageUrl: "/assets/objects/ra7_b100.gif",
        caption: "Ranger 7 B-camera image of Guericke crater",
        credit: "NASA",
        text: `Ranger 7 struck Mare Cognitum on July 31, 1964.

The name means Sea That Has Become Known, reflecting its photographic contribution.

The spacecraft was destroyed, leaving debris rather than an intact lander.

This was the planned ending.

The closest images reached Earth before transmission stopped.

Its last minutes became part of preparing missions whose own success would depend on arriving with equipment designed to survive and continue working on the surface.`,
      },
    ],
  },
  {
    id: "ranger8",
    name: "Ranger 8",
    place: "Moon",
    coverImageUrl: "/assets/objects/ranger.gif",
    recordIds: ["ranger-8"],
    sourceUrls: ["https://science.nasa.gov/mission/ranger-8/"],
    pages: [
      {
        label: "Origin",
        title: "Searching for Apollo Landing Ground",
        imageUrl: "/assets/objects/ranger.gif",
        caption: "Searching for Apollo Landing Ground",
        credit: "NASA",
        text: `Ranger 8 launched on February 17, 1965, following Ranger 7's successful encounter.

The target was Mare Tranquillitatis, the Sea of Tranquility.

Apollo planners needed a closer record of the region.

On February 20, the cameras photographed the surface during final approach.

The spacecraft would not remain intact.

Its mission was to transmit useful observations before a planned collision, adding another area to the close-up evidence available for future landing decisions.`,
      },
      {
        label: "Goals",
        title: "Photographing Mare Tranquillitatis",
        imageUrl: "/assets/objects/ra8_a030.gif",
        caption: "Ritter and Sabine craters on the Moon",
        credit: "NASA",
        text: `Six television cameras used two channels to return broad views and finer details.

Solar panels and batteries powered the spacecraft and radio equipment.

It carried no soft-landing system.

The photographs connected large features with small hazards, helping assess terrain for crewed exploration.

The closer the spacecraft approached, the more detail it could record.

Its mission depended on making the final part of an impact trajectory useful to scientists and engineers preparing later arrivals.`,
      },
      {
        label: "Discoveries",
        title: "A Safer Landing Site",
        imageUrl: "/assets/objects/ra8_b045.gif",
        caption: "Ranger 8 image of the Mare Tranquillitatis (Sea of Tranquillity) ",
        credit: "NASA",
        text: `Ranger 8 transmitted 7,137 photographs.

Its cameras began earlier than Ranger 7's, allowing broad images to be compared with Earth-based observations before the closer views arrived.

The sequence documented craters and details useful to Apollo planning.

Alongside the other successful Rangers, it bridged the gap between telescopic maps and terrain a spacecraft would encounter.

The mission supplied another closely examined region for planners to consider before sending explorers able to remain on the ground.`,
      },
      {
        label: "Now",
        title: "Its Final Impact",
        imageUrl: "/assets/objects/ra8_b001.gif",
        caption: "Ptolemaeus and Alphonsus craters on the Moon",
        credit: "NASA",
        text: `Ranger 8 impacted Mare Tranquillitatis on February 20, 1965.

Its location is different from Apollo 11's later landing site, although both are in the Sea of Tranquility.

The collision destroyed the spacecraft as designed.

The radio stopped when its cameras and transmitters reached the ground.

The pictures were already on Earth.

Its brief encounter helped prepare later missions that would approach the same broad region with equipment intended to land gently and keep operating afterward.`,
      },
    ],
  },
  {
    id: "ranger9",
    name: "Ranger 9",
    place: "Moon",
    coverImageUrl: "/assets/objects/ranger.gif",
    recordIds: ["ranger-9"],
    sourceUrls: ["https://science.nasa.gov/mission/ranger-9/"],
    pages: [
      {
        label: "Origin",
        title: "The Final Ranger",
        imageUrl: "/assets/objects/ranger.gif",
        caption: "The Final Ranger",
        credit: "NASA",
        text: `Ranger 9 launched on March 21, 1965, for the program's final flight.

Its target was Alphonsus Crater, chosen for geological interest rather than simply flat terrain.

On March 24, cameras pointed along the flight direction during approach.

Television coverage based on the images let people watch the ground draw closer.

The mission would end at impact, but first it would give scientists and the public another detailed view of the Moon.`,
      },
      {
        label: "Goals",
        title: "Looking Into Alphonsus Crater",
        imageUrl: "/assets/objects/ra9_a060.gif",
        caption: " The upraised area at lower center is the central peak of Alphonsus crater floor",
        credit: "NASA",
        text: `Six television cameras in two independent channels supplied pictures at different scales.

Solar panels and batteries provided electricity, while radios transmitted the sequence.

The mission investigated crater terrain and lunar geology.

Like Rangers 7 and 8, it carried no soft-landing equipment.

It photographed throughout the final approach.

The instruments had to transmit observations while the same flight path that made the views more detailed carried the spacecraft toward its planned destruction.`,
      },
      {
        label: "Discoveries",
        title: "A Final Look at the Lunar Highlands",
        imageUrl: "/assets/objects/ra9_b001.gif",
        caption: "Ptolemaeus, Alphonsus, and Albategnius craters on the Moon",
        credit: "NASA",
        text: `Ranger 9 returned 5,814 photographs inside and around Alphonsus.

Television presentations made the encounter accessible beyond the scientific team.

The three successful Rangers supplied close views of contrasting landscapes and experience in navigation and imaging.

Their observations helped prepare later lunar science and engineering.

Ranger 9 added crater terrain to that record while showing people at home how exploration could unfold through pictures arriving from a spacecraft near another world.`,
      },
      {
        label: "Now",
        title: "Its Final Image",
        imageUrl: "/assets/objects/ra9_p012.gif",
        caption: "Final two images taken by Ranger 9 before impact",
        credit: "NASA",
        text: `Ranger 9 impacted inside Alphonsus Crater on March 24, 1965.

The spacecraft was destroyed, ending transmissions at the surface.

Its remains are debris, not an intact vehicle.

The collision was planned.

The final pictures existed because the probe continued approaching the ground.

The Ranger program ended with a successful photographic encounter, leaving evidence that later missions could use as they moved from photographing the surface toward landing, sampling, and human exploration.`,
      },
    ],
  },
  {
    id: "viking-1-orbiter",
    name: "Viking 1 Orbiter",
    place: "Mars",
    coverImageUrl: "/assets/objects/viking-1-lander.jpg",
    recordIds: ["viking-1-orbiter"],
    sourceUrls: ["https://science.nasa.gov/mission/viking/"],
    pages: [
      {
        label: "Origin",
        title: "The Partner That Stayed Overhead",
        imageUrl: "/assets/objects/viking-1-lander.jpg",
        caption: "Viking 1 Orbiter",
        credit: "NASA",
        text: `Viking 1 Orbiter launched on August 20, 1975, carrying its lander toward Mars.

It entered orbit on June 19, 1976, then photographed possible landing areas.

After the lander reached Chryse Planitia, the orbiter continued overhead.

The partners supplied different views.

One investigated a fixed place directly; the other surveyed wider regions and helped connect those local observations with a larger understanding of the planet.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/viking.jpg",
        caption: "Viking 1 Orbiter",
        credit: "NASA",
        text: `Two television cameras mapped terrain and inspected landing sites.

An infrared thermal mapper measured temperatures, while an atmospheric water detector measured water vapor.

Solar arrays provided electricity.

The orbiter also relayed lander data.

Its mission combined global science with support: deliver the lander, assist communication, and investigate regions beyond the surface station's reach.

Repeated orbits allowed observations of lasting landforms and changing conditions, supplying context for findings from the ground.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/v1.jpg",
        caption: "Viking 1 Orbiter",
        credit: "NASA",
        text: `The orbiter photographed landforms associated with ancient flowing water and surveyed large parts of Mars.

It watched clouds, dust, and polar changes.

Temperature and water-vapor measurements helped investigate climate and seasons, while close photographs added information about Phobos.

With Viking 2 Orbiter, it built a detailed planetary record useful to geology research and later landing choices.

Returning repeatedly let scientists study changes rather than rely on one brief encounter.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/bk1.jpg",
        caption: "Viking 1 Orbiter",
        credit: "NASA",
        text: `Viking 1 Orbiter was shut down on August 7, 1980, after more than four years and 1,488 Mars orbits.

Its attitude-control gas was running out.

Controllers raised the orbit before retirement.

It is silent, last known orbiting Mars, without a live position supplied by these sources.

The lander continued longer and had a separate ending.

The orbiter's global observations and relay contribution remained in the mission record after its own work was complete.`,
      },
    ],
  },
  {
    id: "viking-2-orbiter",
    name: "Viking 2 Orbiter",
    place: "Mars",
    coverImageUrl: "/assets/objects/viking-1-lander.jpg",
    recordIds: ["viking-2-orbiter"],
    sourceUrls: ["https://science.nasa.gov/mission/viking/"],
    pages: [
      {
        label: "Origin",
        title: "A Second Watch Over Mars",
        imageUrl: "/assets/objects/viking-1-lander.jpg",
        caption: "Viking 2 Orbiter",
        credit: "NASA",
        text: `Viking 2 Orbiter launched with its lander in September 1975 and entered Mars orbit on August 7, 1976.

It surveyed the planet while the team prepared the Utopia Planitia landing.

The lander descended on September 3, but the orbiter continued.

Its route allowed observations beyond the two surface stations.

The partnership connected a local investigation of soil and weather with a much wider view of the planet.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/v2.webp",
        caption: "Viking 2 Orbiter",
        credit: "NASA",
        text: `Two television cameras photographed terrain.

An infrared thermal mapper measured temperatures, and an atmospheric water detector followed water vapor.

Solar panels supplied power, while radios relayed lander information.

The mission mapped Mars, supported landing, and supplied context for surface measurements.

Later orbit changes improved opportunities to investigate Deimos.

Adjusting its route was part of the scientific planning, helping the spacecraft examine both the larger planet and its smaller moon more effectively.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/v2.jpg",
        caption: "Viking 2 Orbiter",
        credit: "NASA",
        text: `Viking 2 Orbiter added images and measurements to Viking's extensive survey.

They documented varied geology, weather, and seasonal changes.

Close views improved knowledge of Deimos.

With its companion orbiter, it demonstrated the value of repeated observations over one passing visit.

Its relay work connected surface results with the wider mission.

A fixed lander could describe its surroundings, while orbital measurements showed how that small location fitted into a much larger world.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/viking-1-lander.jpg",
        caption: "Viking 2 Orbiter",
        credit: "NASA",
        text: `A propulsion-system leak depleted Viking 2 Orbiter's attitude-control gas.

Controllers left it in a higher orbit, and operations ended on July 25, 1978.

It is silent, last known orbiting Mars, without an actively measured current position in these sources.

Its lander continued until April 1980.

The partners traveled together but had different working lives.

The orbiter's images, environmental observations, and relay work remained useful after it could no longer continue the investigation.`,
      },
    ],
  },
  {
    id: "deep-space-1",
    name: "Deep Space 1",
    place: "Mars",
    coverImageUrl: "/assets/objects/nm_ds_1.gif",
    recordIds: ["deep-space-1"],
    sourceUrls: ["https://science.nasa.gov/mission/deep-space-1/"],
    pages: [
      {
        label: "Origin",
        title: "A Test Flight With a Comet Ahead",
        imageUrl: "/assets/objects/nm_ds_1.gif",
        caption: "Deep Space 1",
        credit: "NASA",
        text: `Deep Space 1 launched on October 24, 1998, mainly to test technology for future spacecraft.

It traveled in solar orbit using an ion engine and unusually independent navigation.

Its journey later included asteroid Braille and comet Borrelly.

A mission built to evaluate engineering ideas would also become a scientific explorer.

The extended journey let useful equipment do more than prove it could work: it could help investigate actual objects in deep space.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/ds1.tif",
        caption: "Deep Space 1",
        credit: "NASA",
        text: `The spacecraft tested twelve technologies, including ion propulsion, autonomous optical navigation, a solar-power concentrator, and compact instruments.

The engine accelerated charged xenon particles, supplying small thrust over long periods.

A combined camera and imaging spectrometer investigated targets. A compact plasma instrument sampled the environment.

The mission reduced uncertainty for future projects.

Engineers could study actual deep-space performance rather than depend only on tests conducted near home.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/ds1.jpg",
        caption: "Deep Space 1",
        credit: "NASA",
        text: `Ion propulsion and onboard navigation demonstrated useful capabilities.

The Braille flyby returned measurements, but navigation problems limited close photographs.

After recovery from a star-tracker failure, Deep Space 1 encountered Borrelly in September 2001 and photographed its dark, elongated nucleus.

The comet supplied valuable science beyond the original technology tests.

Its record included difficulties and successful recovery, helping later teams understand both what the equipment could achieve and what problems could interrupt it.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "public/assets/objects/ds1(1).jpg",
        caption: "Deep Space 1",
        credit: "NASA",
        text: `Deep Space 1 was retired on December 18, 2001, after its extended mission, with pointing fuel low.

The ion engine was switched off and normal operations ended.

A receiver remained on for possible future contact, but an attempt in March 2002 failed.

It is inactive on its solar trajectory, without an actively measured precise location.

Its own encounters ended.

The technology experience it supplied remained available for planners developing missions that could use those capabilities on longer scientific journeys.`,
      },
    ],
  },
  {
    id: "mars-observer",
    name: "Mars Observer",
    place: "Mars",
    coverImageUrl: "/assets/objects/mars_observer.jpg",
    recordIds: ["mars-observer"],
    sourceUrls: ["https://science.nasa.gov/mission/mars-observer/"],
    pages: [
      {
        label: "Origin",
        title: "The Mapmaker That Never Began Its Map",
        imageUrl: "/assets/objects/mars_observer.jpg",
        caption: "Mars Observer",
        credit: "NASA",
        text: `Mars Observer launched on September 25, 1992, carrying instruments for a global survey awaited since Viking.

It spent almost a year traveling toward Mars.

Then, in August 1993, days before planned orbit insertion, communication stopped.

The mapping mission never began.

The spacecraft had carried its instruments nearly to their destination, but the scientific work would have to continue through other missions and later versions of its equipment.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/Mars_Observer_-_m1.gif",
        caption: "Mars Observer",
        credit: "NASA",
        text: `A camera, laser altimeter, and thermal emission spectrometer would map landforms, heights, and minerals.

A pressure-modulator infrared radiometer studied the atmosphere. A magnetometer and electron reflectometer investigated magnetic properties, and a gamma-ray spectrometer measured composition.

Radio science examined gravity and the atmosphere. A relay receiver supported future surface work.

Solar arrays powered the spacecraft.

Together, the instruments were designed for a global orbital investigation beyond the scope of a lander or brief flyby.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/Mars_Observer_preparations.jpg",
        caption: "Mars Observer",
        credit: "NASA",
        text: `Mars Observer returned none of its intended orbital mapping.

Cruise observations included a gamma-ray burst, but that was not the promised planetary survey.

Its instrument designs nevertheless continued on other missions, including Mars Global Surveyor.

The planned questions had another opportunity.

Its legacy included useful equipment concepts carried forward, rather than discoveries from a mapping campaign that had never begun.

The distinction matters: scientific purpose and completed scientific results are different parts of a mission's story.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/Mars_Observer_-_spacecraft_diagram_-rev2.png",
        caption: "Mars Observer",
        credit: "NASA",
        text: `Contact was lost shortly before orbit insertion in August 1993.

NASA accounts use August 21 for loss of contact and August 22 for mission end.

Investigators considered a propulsion-system rupture most likely, but final telemetry did not settle the cause.

Its later trajectory and precise location remain unknown.

It cannot confidently be placed in Mars orbit or solar orbit.

The unanswered ending belongs in its history, alongside scientific plans that later spacecraft continued after Mars Observer stopped communicating.`,
      },
    ],
  },
  {
    id: "apollo-10-snoopy",
    name: "Apollo 10 Snoopy ascent stage",
    place: "Solar Orbit",
    coverImageUrl: "/assets/objects/apollo10_cm_as10_27_3873.jpg",
    recordIds: ["apollo-10-snoopy"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-10-mission-details/"],
    pages: [
      {
        label: "Origin",
        title: "The Rehearsal That Went Around the Sun",
        imageUrl: "/assets/objects/apollo10_cm_as10_27_3873.jpg",
        caption: "Apollo 10 Snoopy ascent stage",
        credit: "NASA",
        text: `Snoopy launched with Apollo 10 on May 18, 1969.

John Young remained in Charlie Brown, the command module, while Thomas Stafford and Eugene Cernan flew the lunar module toward the surface.

They approached to roughly fifteen kilometers, then returned to orbit.

No landing was planned.

The mission rehearsed much of Apollo 11's journey, testing equipment and procedures close to the Moon before another crew would depend on them for a landing.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo10 (1).webp",
        caption: "Apollo 10 Snoopy ascent stage",
        credit: "NASA",
        text: `The lunar module carried descent and ascent engines, landing radar, guidance, life support, and radios.

The lower stage supported the approach; the ascent stage held the cabin and return engine.

The mission tested navigation, descent procedures, and rendezvous.

Snoopy had to separate, maneuver near the Moon, and return its crew to Charlie Brown.

This was a rehearsal in the actual environment, checking systems and procedures that would soon support a human landing.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo10 (3).jpg",
        caption: "Apollo 10 Snoopy ascent stage",
        credit: "NASA",
        text: `Apollo 10 returned measurements and photographs useful to Apollo 11.

Stafford and Cernan practiced the lunar-module sequence and rendezvous while the team checked navigation and communication.

No samples came home because the crew did not land.

The main achievement was engineering knowledge.

The mission reduced uncertainty about reaching the surface and returning safely.

Snoopy's successful rehearsal supplied experience that calculations and ground tests alone could not fully provide.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo10 (1).jpg",
        caption: "Apollo 10 Snoopy ascent stage",
        credit: "NASA",
        text: `After the astronauts returned to Charlie Brown, Snoopy's ascent stage was separated and sent into solar orbit in May 1969.

It was no longer needed for the journey home.

NASA confirms the disposal, but these sources do not establish its exact position or final-transmission time.

The inactive ascent stage is distinct from the descent stage, which followed another trajectory.

Snoopy never landed.

Its rehearsal helped prepare a landing, while the empty cabin continued without the astronauts it had carried.`,
      },
    ],
  },
  {
    id: "cassini",
    name: "Cassini",
    place: "Saturn",
    coverImageUrl: "/assets/objects/1-pia18410-cassini-titan-crop.webp",
    recordIds: ["cassini"],
    sourceUrls: [
      "https://science.nasa.gov/mission/cassini/",
      "https://www.nasa.gov/news-release/cassini-finds-global-ocean-in-saturns-moon-enceladus/",
      "https://science.nasa.gov/mission/cassini/the-journey/timeline/",
    ],
    pages: [
      {
        label: "Origin",
        title: "A Long Journey to the Ringed Planet",
        imageUrl: "/assets/objects/1-pia18410-cassini-titan-crop.webp",
        caption: "Cassini",
        credit: "NASA/JPL",
        text: `Cassini launched on October 15, 1997, carrying Europe's Huygens probe.

Gravity assists helped the pair reach Saturn, where Cassini entered orbit in 2004.

The spacecraft would investigate the planet, rings, and moons for thirteen years.

In 2005, it delivered Huygens to Titan.

Cassini continued orbital exploration, returning to destinations where new findings could guide later encounters and change the questions scientists wanted to investigate next.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/cassini (1).jfif",
        caption: "Cassini",
        credit: "NASA/JPL",
        text: `Radioisotope generators supplied electricity far from the Sun.

Cameras, radar, and infrared and ultraviolet instruments studied Saturn, rings, and moons.

A magnetometer, plasma instruments, a dust analyzer, and a mass spectrometer examined particles and the environment. Radio science probed interiors.

Huygens investigated Titan during descent and on the surface.

Repeated encounters allowed comparisons over time, connecting different kinds of evidence across the planetary system rather than relying on one brief visit.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/cassini (1).jpg",
        caption: "Cassini",
        credit: "NASA/JPL",
        text: `Cassini discovered water-rich plumes from Enceladus and supplied evidence for a global ocean beneath its ice.

At Titan, it revealed lakes and seas of liquid methane and ethane.

It documented storms, complex ring structures, and interactions among moons and rings.

The discoveries made ocean worlds important to habitability research, without proving life existed.

Years of observations created a detailed archive, allowing scientists to investigate the Saturn system after the spacecraft's own mission ended.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/cassini (2).jpg",
        caption: "Cassini",
        credit: "NASA/JPL",
        text: `With fuel running low, controllers directed Cassini into Saturn's atmosphere on September 15, 2017.

It sent measurements until it could no longer point its antenna toward Earth.

Heat and pressure destroyed the spacecraft. There is no solid-surface wreck.

The ending protected Titan and Enceladus from possible future collisions and contamination by an uncontrolled spacecraft.

Cassini's final journey preserved destinations its discoveries had helped make scientifically important.

The spacecraft was gone, but thirteen years of observations remained.`,
      },
    ],
  },
  {
    id: "surveyor-2",
    name: "Surveyor 2",
    place: "Moon",
    coverImageUrl: "/assets/objects/surveyor-3.gif",
    recordIds: ["surveyor-2"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-2/"],
    pages: [
      {
        label: "Origin",
        title: "A Landing Lost to a Tumble",
        imageUrl: "/assets/objects/surveyor-3.gif",
        caption: "Surveyor 2",
        credit: "NSSDCA",
        text: `Surveyor 2 launched on September 20, 1966, hoping to repeat Surveyor 1's soft landing.

Its destination was near Sinus Medii.

During a correction, one of three small engines failed to fire. Uneven thrust sent the spacecraft into a tumble.

Controllers attempted recovery, but the planned arrival was no longer achievable.

A lander built to operate on the ground had lost the stable flight needed to reach that ground safely.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/Surveyor_2_launch.jpg",
        caption: "Surveyor 2 launch",
        credit: "NSSDCA",
        text: `Surveyor 2 carried a television camera, descent radar, a braking rocket, vernier engines, and engineering sensors.

Solar panels and batteries would power surface operations.

The mission demonstrated controlled landing and returned images and engineering information for Apollo preparation.

Its thrusters had to guide correction and descent together.

When one failed, the instruments could no longer be delivered under the conditions needed for their planned work.

The scientific opportunity depended first on a safe arrival.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/s2 (2).jpg",
        caption: "Surveyor 2",
        credit: "NSSDCA",
        text: `Surveyor 2 returned no surface photographs or soil observations.

Its loss did not establish discoveries about its target site.

Flight behavior and recovery attempts became part of the program's engineering experience, showing the consequences of unreliable propulsion and orientation.

Other Surveyors continued Apollo preparation.

Its instruments explain what the mission was meant to do, while the failed approach explains why those observations never became scientific results from the lunar ground.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/s2 (1).jfif",
        caption: "Surveyor 2",
        credit: "NSSDCA",
        text: `Contact ended on September 22, 1966. Surveyor 2 impacted the Moon on September 23.

Its remains are believed to be southeast of Copernicus, but an identified wreck is not established here.

The position is a historical estimate.

The failed correction prevented controlled descent and the spacecraft was destroyed before surface work began.

Its loss remained part of learning to land safely, a challenge later missions still had to solve even after successfully completing the journey to the Moon.`,
      },
    ],
  },
  {
    id: "surveyor-4",
    name: "Surveyor 4",
    place: "Moon",
    coverImageUrl: "/assets/objects/surveyor-3.gif",
    recordIds: ["surveyor-4"],
    sourceUrls: ["https://science.nasa.gov/mission/surveyor-4/"],
    pages: [
      {
        label: "Origin",
        title: "Silence in the Final Descent",
        imageUrl: "/assets/objects/surveyor-3.gif",
        caption: "Surveyor 4",
        credit: "NSSDCA",
        text: `Surveyor 4 launched on July 14, 1967, toward Sinus Medii.

Surveyor 3 had demonstrated how a scoop could test lunar soil, and the new lander would continue that work.

The journey appeared successful until July 17.

Signals stopped in the final minutes of descent.

The team never received confirmation of a safe landing, and the surface investigation for which the camera and sampler had been prepared never began.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/Surveyor_4_launch.jpg",
        caption: "Surveyor 4",
        credit: "NSSDCA",
        text: `A television camera would photograph the site, while a surface sampler dug and tested soil.

A sampler magnet investigated iron-bearing material.

Radar, a braking rocket, and vernier engines controlled descent. Solar panels and batteries supported operations afterward.

The mission combined landing demonstration with ground measurements relevant to Apollo.

Its instruments depended on successful touchdown.

Communication failed before the stage of the mission where those tools could investigate the destination they had been carried toward.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/s4(1).jpg",
        caption: "Surveyor 4",
        credit: "NSSDCA",
        text: `Surveyor 4 returned no surface images or soil measurements.

Carrying the instruments does not mean their intended observations were completed.

The failure added an unresolved descent loss to the Surveyor engineering record, rather than a scientific discovery at the site.

The camera and sampler represented real questions about lunar ground.

No successful surface investigation reached Earth.

Later spacecraft would need to continue the work that this mission had approached but never had the opportunity to perform.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/surveyor-3.gif",
        caption: "Surveyor 4",
        credit: "NSSDCA",
        text: `Signals stopped around 02:03 Universal Time on July 17, 1967, about two and a half minutes before landing.

NASA suspected a braking-rocket explosion, but the cause was not conclusively established.

The impact location is unknown. Sinus Medii was the target, not a confirmed wreck site.

The spacecraft is presumed destroyed.

No later contact clarified the ending.

Its final descent remains uncertain, an important limit in what the available evidence can tell us about the mission.`,
      },
    ],
  },
  {
    id: "lunar-prospector",
    name: "Lunar Prospector",
    place: "Moon",
    coverImageUrl: "assets/objects/lunarprosp.gif",
    recordIds: ["lunar-prospector"],
    sourceUrls: ["https://science.nasa.gov/mission/lunar-prospector/"],
    pages: [
      {
        label: "Origin",
        title: "Searching the Moon Without a Camera",
        imageUrl: "assets/objects/lunarprosp.gif",
        caption: "Lunar Prospector",
        credit: "NSSDCA",
        text: `Lunar Prospector launched in January 1998—January 6 in Florida and January 7 in Universal Time.

It entered polar orbit to investigate composition, magnetic fields, gravity, and possible resources.

Its mission did not rely on a photographic tour.

The cold, shadowed poles were especially important.

Signals measured from orbit could reveal clues hidden from ordinary images, helping scientists understand the Moon and decide where future missions should investigate more closely.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/Lunar_Prospector_in_Clean_Room_-_GPN-2000-001543.jpg",
        caption: "Lunar Prospector",
        credit: "NSSDCA",
        text: `Gamma-ray, neutron, and alpha-particle spectrometers examined particles associated with the surface and environment.

A magnetometer and electron reflectometer studied magnetic fields. Radio tracking measured gravity, and solar cells supplied power.

The mission mapped elements and searched for polar-ice evidence.

These were indirect measurements, not samples.

Scientists interpreted signals from repeated passes, comparing regions and building a global picture of properties that were difficult to investigate through surface photography alone.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "public/assets/objects/Lunar_prospectus_concentrations.jpg",
        caption: "Lunar_prospectus_concentrations",
        credit: "NSSDCA",
        text: `Neutron measurements detected extra hydrogen near both poles, consistent with water ice mixed into the ground.

This was evidence for ice, not a direct sample or photograph.

Lunar Prospector also mapped elements, magnetic fields, and gravity, improving knowledge of composition and interior structure.

The polar results gave later explorers strong reasons to investigate shadowed regions.

Its observations identified promising questions and destinations, showing how useful clues could be obtained without a camera-led mission.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/Lunar_Prospector_transparent.png",
        caption: "Lunar Prospector",
        credit: "NSSDCA",
        text: `Controllers deliberately impacted Lunar Prospector into a permanently shadowed area of Shoemaker Crater on July 31, 1999.

Observers hoped the collision might release detectable water, but no water-vapor signal was found.

The spacecraft was destroyed in the approximate impact region.

Mapping was complete, and the final descent was an additional experiment.

That last test did not supply the hoped-for detection.

Its earlier polar measurements remained important evidence, helping guide continuing investigation of the Moon's cold, shadowed ground.`,
      },
    ],
  },
  {
    id: "mars-polar-lander",
    name: "Mars Polar Lander",
    place: "Mars",
    coverImageUrl: "assets/objects/mars_polar_lander.jpg",
    recordIds: ["mars-polar-lander"],
    sourceUrls: [
      "https://science.nasa.gov/mission/mars-polar-lander-deep-space-2/",
      "https://llis.nasa.gov/lesson/938",
    ],
    pages: [
      {
        label: "Origin",
        title: "A Polar Arrival Without an Answer",
        imageUrl: "assets/objects/mars_polar_lander.jpg",
        caption: "Mars Polar Lander",
        credit: "NSSDCA",
        text: `Mars Polar Lander launched on January 3, 1999, toward the edge of the south polar cap.

It carried two small Deep Space 2 probes.

Layers of ice and dust could preserve clues to climate history.

The spacecraft reached Mars on December 3.

After atmospheric entry began, controllers waited for a surface message.

None arrived.

The journey had reached the planet, but not the confirmed safe landing required for its instruments to begin their polar investigation.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/maars polar lander (2).jpg",
        caption: "Mars Polar Lander",
        credit: "NSSDCA",
        text: `A robotic arm delivered soil to a thermal and evolved-gas analyzer, which heated samples and examined released gases.

Cameras documented terrain and digging. A meteorology package measured weather, and a microphone was intended to record sounds.

Solar panels provided power.

The Deep Space 2 penetrators tested another method of subsurface investigation.

The mission connected local polar material and conditions with larger questions about Mars's water and climate history.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/maars polar lander (1).jpg",
        caption: "Mars Polar Lander",
        credit: "NSSDCA",
        text: `The lander and both small probes returned no planned surface science.

They did not confirm ice or provide the intended polar climate record.

Investigations identified weaknesses in testing and touchdown-sensing software.

Those findings supplied engineering lessons, especially about checking complete landing sequences.

The mission's instruments show its purpose, but completed surface discoveries cannot be attributed to them.

Its scientific questions remained for other explorers, while the failure helped later teams assess what needed more careful testing.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "public/assets/objects/maars polar lander (1).png",
        caption: "Mars Polar Lander",
        credit: "NSSDCA",
        text: `The final communication came before atmospheric entry on December 3, 1999.

Investigators judged that landing-leg deployment probably produced a false touchdown indication, shutting the engines off too early.

No descent telemetry could prove the scenario directly.

The lander is presumed destroyed near its intended south-polar region, but the crash site remains unconfirmed.

Contact efforts ended in January 2000.

Its ending includes a likely explanation and an uncertain location, alongside scientific work that never had the chance to begin.`,
      },
    ],
  },
  {
    id: "apollo-11-descent-stage",
    name: "Apollo 11 descent stage",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo-11-descent-stage.jpg",
    recordIds: ["apollo-11-descent-stage"],
    sourceUrls: ["https://www.nasa.gov/mission/apollo-11/"],
    pages: [
      {
        label: "Origin",
        title: "Eagle's Foundation at Tranquility Base",
        imageUrl: "/assets/objects/apollo-11-descent-stage.jpg",
        caption: "Apollo 11 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Eagle's descent stage launched with Apollo 11 on July 16, 1969.

It formed the lower half of the lunar module carrying Neil Armstrong and Buzz Aldrin, while Michael Collins remained in orbit.

On July 20, its engine guided the crew to Mare Tranquillitatis.

The landing legs touched the ground.

The stage became the base for the first human visit to the Moon, delivering the people and equipment needed to begin surface exploration.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo-11-descent-stage.jpg",
        caption: "Apollo 11 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `The stage carried the descent engine, propellant, landing gear, and equipment bays.

Its cargo included tools, the early surface experiment package with a passive seismometer and dust detector, and a separate laser reflector.

It landed the crew and supported their work.

Afterward, the ascent stage would launch from it.

The lower structure was designed for arrival and departure support, not a return to Earth or an independent long-term scientific mission.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo-11-descent-stage.jpg",
        caption: "Apollo 11 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Armstrong and Aldrin collected about 21.55 kilograms of samples for direct study on Earth.

The seismometer recorded lunar vibrations, and the laser reflector enabled Earth–Moon distance measurements.

The descent stage made these investigations possible by delivering the expedition.

It did not make the measurements independently.

Its contribution was a safe arrival, creating the opportunity for sampling, deployed experiments, and human examination at a place where no crew had previously stood.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo-11-descent-stage.jpg",
        caption: "Apollo 11 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Eagle's ascent stage lifted Armstrong and Aldrin back toward Collins on July 21, 1969.

The descent stage remained at Tranquility Base because only the upper stage was needed to leave.

It is inactive near the equipment and footprints.

Liftoff marks the stages' separation, not a final message from a long-running descent-stage experiment.

The crew came home.

The landing structure stayed, preserving part of the arrival that began human exploration of the lunar surface.`,
      },
    ],
  },
  {
    id: "apollo-12-descent-stage",
    name: "Apollo 12 descent stage",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo-12-descent-stage.jpg",
    recordIds: ["apollo-12-descent-stage"],
    sourceUrls: ["https://www.nasa.gov/mission/apollo-12/"],
    pages: [
      {
        label: "Origin",
        title: "Intrepid Beside an Earlier Explorer",
        imageUrl: "/assets/objects/apollo-12-descent-stage.jpg",
        caption: "Apollo 12 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Intrepid's descent stage launched with Apollo 12 on November 14, 1969.

On November 19, it carried Pete Conrad and Alan Bean into Oceanus Procellarum while Richard Gordon stayed in orbit.

The landing placed them near Surveyor 3.

That precision enabled an unusual investigation.

The astronauts could revisit a robotic explorer, collect nearby samples, and return selected spacecraft parts for study after years of exposure to the lunar environment.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo-12-descent-stage.jpg",
        caption: "Apollo 12 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `The descent engine, tanks, and landing gear controlled and supported arrival.

Equipment bays carried tools and ALSEP.

Its instruments included a seismometer, magnetometer, solar-wind instrument, ion detectors, a thin-atmosphere gauge, and a dust detector.

The lower stage delivered the crew and equipment, then became the ascent stage's launch platform.

It supported a short human expedition and the deployment of a station built for a much longer scientific investigation.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo12_lunar_module.jpg",
        caption: "Apollo 12 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Conrad and Bean collected about 34 kilograms of samples and returned roughly ten kilograms of Surveyor 3 parts, including its camera.

The rocks supported geological research.

The hardware allowed study of exposure effects.

ALSEP continued measuring after the crew left.

Intrepid's descent stage enabled both immediate fieldwork and a longer watch, delivering people and instruments to a place where a human expedition could investigate an earlier robotic mission directly.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo-12-descent-stage.jpg",
        caption: "Apollo 12 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `The stage remains in Oceanus Procellarum near Surveyor Crater.

Intrepid's upper stage carried the astronauts away on November 20, 1969.

The lower structure stayed as designed and had no independent return system.

The nearby ALSEP worked separately and had its own later shutdown.

The crew returned with samples and pieces of Surveyor 3.

Intrepid's foundation remained beside the landscape where robotic and human exploration had met, after delivering the visit that made those investigations possible.`,
      },
    ],
  },
  {
    id: "apollo-14-descent-stage",
    name: "Apollo 14 descent stage",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo-14-descent-stage.jpg",
    recordIds: ["apollo-14-descent-stage"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-14-mission-details/"],
    pages: [
      {
        label: "Origin",
        title: "Antares Returns to Fra Mauro",
        imageUrl: "/assets/objects/apollo-14-descent-stage.jpg",
        caption: "Apollo 14 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Antares launched with Apollo 14 on January 31, 1971.

Alan Shepard and Edgar Mitchell would investigate Fra Mauro while Stuart Roosa remained in orbit.

The region had been Apollo 13's planned destination.

After engineers worked around an abort-switch problem, Antares landed on February 5.

Its lower stage delivered the crew to impact-fragmented terrain, giving the postponed investigation another opportunity to examine evidence of major events in lunar history.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo-14-descent-stage.jpg",
        caption: "Apollo 14 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `The stage carried the engine, propellant, landing gear, and equipment bays.

Cargo included tools, a wheeled handcart, and ALSEP.

Passive and active seismic equipment, charged-particle and ion detectors, an atmosphere gauge, and a dust detector supported science.

Its task was to deliver and support the expedition, then provide a platform for ascent.

The heavy landing structure was not needed for the journey home, allowing more equipment to be brought for surface work.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo-14-descent-stage.jpg",
        caption: "Apollo 14 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `The crew collected about 42 kilograms of rocks and soil, including breccias formed from impact fragments.

Observations near Cone Crater helped investigate material associated with the Imbrium basin.

Deployed instruments studied ground structure, moonquakes, and the environment.

Antares enabled the science by delivering the crew and equipment.

The evidence came from samples and experiments, not an abandoned engine.

A successful landing created the opportunity to investigate a much older history preserved in the ground.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo-14-descent-stage.jpg",
        caption: "Apollo 14 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Antares's ascent stage returned the astronauts to orbit on February 6, 1971.

The descent stage remained in Fra Mauro after its landing work was complete.

It is inactive.

Nearby ALSEP equipment and the separate laser reflector had different working lives.

Leaving the lander did not end all science at the site.

The crew returned with samples, while the lower structure stayed at the destination it had safely delivered them to, preserving part of the expedition's arrival.`,
      },
    ],
  },
  {
    id: "apollo-15-descent-stage",
    name: "Apollo 15 descent stage",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo-15-descent-stage.jpg",
    recordIds: ["apollo-15-descent-stage"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-15-mission-details/"],
    pages: [
      {
        label: "Origin",
        title: "Falcon Brings a Rover to the Mountains",
        imageUrl: "/assets/objects/apollo-15-descent-stage.jpg",
        caption: "Apollo 15 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Falcon's descent stage launched with Apollo 15 on July 26, 1971.

Four days later, it brought David Scott and James Irwin to Hadley-Apennine while Alfred Worden worked in orbit.

It supported a longer stay and more equipment than earlier landings.

A rover traveled folded against the stage.

The crew could now reach more distant geological targets, connecting observations across the landscape rather than staying close to the landing point.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo-15-descent-stage.jpg",
        caption: "Apollo 15 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Falcon carried the landing engine, fuel, legs, supplies, tools, and Lunar Roving Vehicle.

Its ALSEP cargo included seismic, magnetic, solar-wind, ion, dust, and heat-flow experiments.

The larger mission also investigated the Moon from orbit.

The stage delivered equipment and supported the stay before serving as the ascent platform.

It connected mobile crew exploration with fixed experiments, supplying the cargo for a brief journey across the terrain and a much longer scientific watch.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo-15-descent-stage.jpg",
        caption: "Apollo 15 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Scott and Irwin used the rover to travel about 27.9 kilometers, investigate Hadley Rille, and collect about 77 kilograms of samples.

The Genesis Rock supplied evidence from the early crust.

Other material and observations added clues to volcanic history.

Deployed experiments continued afterward.

These discoveries came from the expedition Falcon had delivered.

The lower stage enabled wider-ranging science, but the abandoned descent engine itself did not become an independent source of continuing measurements.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo-15-descent-stage.jpg",
        caption: "Apollo 15 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Falcon's upper stage departed on August 2, 1971.

The descent stage remains inactive at Hadley-Apennine, near the rover and experiments.

Only the cabin and ascent equipment were needed to return Scott and Irwin to Worden.

The crew came home; the landing structure stayed.

That was the design.

Its lower half remains at the starting point of Apollo's first rover expedition, after delivering equipment that helped the astronauts explore farther and leave instruments working behind them.`,
      },
    ],
  },
  {
    id: "apollo-16-descent-stage",
    name: "Apollo 16 descent stage",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo-16-descent-stage.jpg",
    recordIds: ["apollo-16-descent-stage"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-16-mission-details/"],
    pages: [
      {
        label: "Origin",
        title: "Orion Arrives in the Highlands",
        imageUrl: "/assets/objects/apollo-16-descent-stage.jpg",
        caption: "Apollo 16 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Orion launched with Apollo 16 on April 16, 1972.

John Young and Charles Duke would explore Descartes while Ken Mattingly worked in orbit.

A spacecraft problem delayed landing during checks.

Touchdown came on April 21 in Universal Time—April 20 in the United States.

The descent stage brought the crew to highlands different from earlier mare sites, allowing direct tests of ideas about the geological origins of the region.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo-16-descent-stage.jpg",
        caption: "Apollo 16 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `The descent engine, tanks, and landing legs delivered and supported Orion.

Equipment bays carried a rover, tools, and ALSEP.

Passive and active seismic equipment, a magnetometer, and a heat-flow experiment investigated the site. A separate ultraviolet camera broadened observations.

The stage supported an extended surface visit before becoming the base for launch.

Its successful arrival would let the crew examine highland rocks directly and leave instruments for continuing measurements after departure.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo-16-descent-stage.jpg",
        caption: "Apollo 16 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Young and Duke returned about 96 kilograms of samples.

Many were impact-formed breccias, changing interpretations that had emphasized volcanic origins.

Seismic and magnetic instruments added measurements.

The heat-flow experiment did not operate after its cable was broken during setup.

The mission recorded both discoveries and an incomplete experiment.

Orion delivered the opportunity for science, but not every instrument achieved its plan. Returned rocks and working equipment still changed scientists' understanding of the highlands.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo-16-descent-stage.jpg",
        caption: "Apollo 16 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Orion's ascent stage left on April 24, 1972, Universal Time.

The descent stage remained at Descartes.

It had no return system for its heavy engine-and-leg structure.

The crew, samples, and cabin returned to orbit without it.

The separately deployed ALSEP continued until its later shutdown in 1977.

Orion's foundation is inactive where the crew began exploring, after making possible a highland expedition whose samples would challenge earlier explanations of the landscape.`,
      },
    ],
  },
  {
    id: "apollo-17-descent-stage",
    name: "Apollo 17 descent stage",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo-17-descent-stage.jpg",
    recordIds: ["apollo-17-descent-stage"],
    sourceUrls: ["https://www.nasa.gov/missions/apollo/apollo-17-mission-details/"],
    pages: [
      {
        label: "Origin",
        title: "Challenger in the Last Apollo Valley",
        imageUrl: "/assets/objects/apollo-17-descent-stage.jpg",
        caption: "Apollo 17 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Challenger launched with Apollo 17 on December 7, 1972.

Eugene Cernan and geologist Harrison Schmitt landed in Taurus-Littrow on December 11 while Ronald Evans worked in orbit.

This was Apollo's final lunar landing.

The valley offered mountain material and younger volcanic deposits for comparison.

The descent stage brought the rover, supplies, and instruments needed for the crew's expedition and for science that would continue after the astronauts departed.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "public/assets/objects/apollo_17_lm.jpg",
        caption: "Apollo 17 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `The lower stage carried the engine, propellant, legs, rover, and equipment bays.

ALSEP cargo included heat-flow equipment, seismic profiling instruments, an atmospheric mass spectrometer, an ejecta-and-meteorite experiment, and a surface gravimeter.

Tools supported sampling.

The stage sustained the visit, then served as the launch platform.

Its cargo supported two timescales: the astronauts' short fieldwork and a station designed to remain investigating the valley after the final Apollo landing crew returned home.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo-17-descent-stage.jpg",
        caption: "Apollo 17 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `The crew returned about 110 kilograms of samples.

Orange soil contained glass beads formed in ancient volcanic eruptions.

Field observations connected valley deposits with surrounding mountains.

Experiments investigated heat, shallow structure, and the environment.

A design problem prevented the gravimeter's intended gravity experiment.

Challenger enabled this work by delivering the expedition.

The scientific record included successful observations, returned material, and limitations researchers needed to account for when interpreting the instruments' results.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo-17-descent-stage.jpg",
        caption: "Apollo 17 descent stage",
        credit: "NASA (image via NSSDCA)",
        text: `Challenger's upper stage lifted off on December 14, 1972.

The descent stage remains in Taurus-Littrow near the rover and other equipment.

Its heavy landing structure was not required for the return trip.

The ascent stage was later deliberately impacted elsewhere.

The lower stage is the part that stayed where the astronauts worked.

The crew left with samples from Apollo's final surface expedition, while Challenger's inactive foundation remained at the place that had made those discoveries possible.`,
      },
    ],
  },
  {
    id: "apollo-12-alsep",
    name: "Apollo 12 ALSEP station",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo12_lunar_module.jpg",
    recordIds: ["apollo-12-alsep"],
    sourceUrls: [
      "https://www.nasa.gov/mission/apollo-12/",
      "https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a12a",
    ],
    pages: [
      {
        label: "Origin",
        title: "A Station That Outlasted Its Visitors",
        imageUrl: "/assets/objects/apollo12_lunar_module.jpg",
        caption: "Apollo 12 ALSEP station",
        credit: "NSSDCA",
        text: `Pete Conrad and Alan Bean deployed Apollo 12's ALSEP in Oceanus Procellarum in November 1969.

Cables connected the instruments to a central station, activated on November 19.

The astronauts left the next day.

This first full Apollo Lunar Surface Experiments Package was designed to remain working.

It extended the expedition into a long-term investigation, recording events and changes that a brief human visit could not capture.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo12_lunar_module.jpg",
        caption: "Apollo 12 ALSEP station",
        credit: "NSSDCA",
        text: `A SNAP-27 radioisotope generator converted heat into electricity without depending on daylight.

A passive seismometer measured vibrations. A magnetometer examined fields, and a solar-wind spectrometer investigated particles from the Sun.

Ion detectors, a cold-cathode gauge, and a dust detector studied the sparse environment.

The central station distributed power and sent measurements.

The package connected several experiments at one location, continuing the scientific work without astronauts remaining to operate each instrument.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo12_lunar_module.jpg",
        caption: "Apollo 12 ALSEP station",
        credit: "NSSDCA",
        text: `The seismometer recorded moonquakes and impacts, helping investigate the interior.

Later stations made those observations more useful through comparisons across a seismic network.

Particle and magnetic measurements recorded responses to the Sun and Earth's magnetic surroundings.

Its contribution was a sustained record.

Events months or years after the crew's departure could still be measured.

The station supplied evidence about changes over time, adding information a short expedition could not obtain by staying only a few days.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo12_lunar_module.jpg",
        caption: "Apollo 12 ALSEP station",
        credit: "NSSDCA",
        text: `The station remains near Apollo 12's site, separate from Intrepid.

NASA ended ALSEP scientific operations on September 30, 1977, after years of service and the end of funded support.

Instruments were switched off. Carrier signals continued briefly, but were not new science measurements.

The hardware stayed where deployed.

Its active investigation ended; the archive remained.

The astronauts visited briefly, while their station worked for years, leaving records that researchers could continue studying after transmissions stopped.`,
      },
    ],
  },
  {
    id: "apollo-14-alsep",
    name: "Apollo 14 ALSEP station",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo_14_lm.jpg",
    recordIds: ["apollo-14-alsep"],
    sourceUrls: [
      "https://www.nasa.gov/missions/apollo/apollo-14-mission-details/",
      "https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a14a",
    ],
    pages: [
      {
        label: "Origin",
        title: "A Second Listening Post",
        imageUrl: "/assets/objects/apollo_14_lm.jpg",
        caption: "Apollo 14 ALSEP station",
        credit: "NSSDCA",
        text: `Alan Shepard and Edgar Mitchell deployed Apollo 14's ALSEP near Antares in Fra Mauro on February 5, 1971.

Setup was part of the first moonwalk.

The station added another long-term site to the program begun by Apollo 12.

The astronauts would study rocks and return home.

Their equipment would remain, helping turn separate landing locations into a wider scientific network that could investigate the Moon beyond each crew's brief stay.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo_14_lm.jpg",
        caption: "Apollo 14 ALSEP station",
        credit: "NSSDCA",
        text: `A central station and SNAP-27 generator supplied communication and power.

A passive seismometer measured natural vibrations. An active seismic experiment used known signals to investigate shallow layers.

Charged-particle and suprathermal-ion instruments studied the space environment. A cold-cathode gauge and dust detector examined the tenuous surroundings.

The nearby laser reflector was separate.

The package extended the crew's work through instruments that could measure the ground and environment without a person staying beside them.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo_14_lm.jpg",
        caption: "Apollo 14 ALSEP station",
        credit: "NSSDCA",
        text: `Seismic measurements investigated shallow structure and, through comparisons with other stations, the deeper interior.

Particle observations studied material from the Sun and changes as the Moon crossed Earth's magnetic environment.

Years of measurements supplied evidence unavailable during a short visit.

Researchers could compare events across sites and later return to archived observations.

The station contributed both a location and a timespan, maintaining an investigation at Fra Mauro long after the crew had completed its own expedition.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo_14_lm.jpg",
        caption: "Apollo 14 ALSEP station",
        credit: "NSSDCA",
        text: `The hardware remains near Fra Mauro.

Power-related problems affected later operations, and NASA ended ALSEP science on September 30, 1977.

The funded program ended; there was no plan to retrieve the equipment.

The separate laser reflector was not switched off. It needs no onboard electricity to reflect light from Earth.

The powered instruments stopped collecting science.

Their recorded measurements remained, preserving the years of observations that had extended Shepard and Mitchell's short lunar visit.`,
      },
    ],
  },
  {
    id: "apollo-15-alsep",
    name: "Apollo 15 ALSEP station",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo_15_lm.jpg",
    recordIds: ["apollo-15-alsep"],
    sourceUrls: [
      "https://www.nasa.gov/missions/apollo/apollo-15-mission-details/",
      "https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a15a",
    ],
    pages: [
      {
        label: "Origin",
        title: "Listening Beside Hadley's Mountains",
        imageUrl: "/assets/objects/apollo_15_lm.jpg",
        caption: "Apollo 15 ALSEP station",
        credit: "NSSDCA",
        text: `David Scott and James Irwin deployed Apollo 15's ALSEP at Hadley-Apennine in July 1971.

The central station began operating on July 31.

Their rover moved across the landscape, but these instruments stayed in one arranged area.

When Falcon carried the astronauts away, the station remained.

It would investigate vibrations, temperatures, fields, and particles over a longer period, recording events that did not have to fit within the crew's three-day visit.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo_15_lm.jpg",
        caption: "Apollo 15 ALSEP station",
        credit: "NSSDCA",
        text: `A SNAP-27 generator powered a passive seismometer, surface magnetometer, solar-wind spectrometer, suprathermal-ion detector, cold-cathode gauge, and dust detector.

Heat-flow probes in drilled holes measured temperatures below ground.

A separate laser reflector supported distance measurements.

The package investigated internal structure, heat, and the environment.

Its complementary instruments let scientists compare the mountain-front site with other locations, building a broader investigation rather than relying on measurements from one part of the Moon.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo_15_lm.jpg",
        caption: "Apollo 15 ALSEP station",
        credit: "NSSDCA",
        text: `The seismic station strengthened comparisons of moonquakes and impacts across Apollo sites.

Heat-flow observations helped estimate energy escaping from the interior.

Particle and magnetic measurements examined interactions with the space environment.

Researchers could compare Hadley-Apennine with other locations and continue investigating after the crew departed.

Repeated measurements were central to the results.

The station provided evidence about events and changes that a short expedition could not observe directly within its limited time.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo_15_lm.jpg",
        caption: "Apollo 15 ALSEP station",
        credit: "NSSDCA",
        text: `Apollo 15's ALSEP remains near the landing site, separate from Falcon.

NASA ended its scientific operations on September 30, 1977, after extended service.

It was never designed to return.

The separate laser reflector was not disabled by the powered station's shutdown.

The radioed science ended, while the measurements remained in the archive.

The crew's exploration lasted days and the instruments worked for years, leaving evidence that could continue supporting research after both working lives were complete.`,
      },
    ],
  },
  {
    id: "apollo-16-alsep",
    name: "Apollo 16 ALSEP station",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo_16_lm.jpg",
    recordIds: ["apollo-16-alsep"],
    sourceUrls: [
      "https://www.nasa.gov/missions/apollo/apollo-16-mission-details/",
      "https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a16a",
    ],
    pages: [
      {
        label: "Origin",
        title: "A Highland Station With a Broken Cable",
        imageUrl: "/assets/objects/apollo_16_lm.jpg",
        caption: "Apollo 16 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: `John Young and Charles Duke deployed Apollo 16's ALSEP in the Descartes highlands on April 21, 1972.

The central station began operating that day.

A mishap damaged part of the plan: the heat-flow experiment's cable was broken.

The remaining instruments could still work.

The station began its continuing investigation with useful equipment ready and one measurement no longer possible, adding another location to the lunar scientific network despite the setback.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo_16_lm.jpg",
        caption: "Apollo 16 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: `A SNAP-27 generator supplied electricity, and the central station transmitted data.

A passive seismometer measured natural vibrations. Active seismic equipment used known signals to investigate shallow ground.

A surface magnetometer studied the local field.

The heat-flow experiment was intended to measure subsurface temperatures, but its damaged cable prevented operation.

The package continued studying the highlands through its working instruments, while the broken experiment marked a limit in the science it could provide.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo_16_lm.jpg",
        caption: "Apollo 16 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: `Seismic and magnetic measurements supplied evidence from terrain unlike earlier mare sites.

Comparisons across the Apollo network helped investigate the crust and deeper interior.

The active seismic experiment examined near-surface layers.

No intended heat-flow measurements came from the damaged equipment.

That missing result belongs in the scientific record.

The station contributed important observations, but not every planned answer. Researchers needed to consider both its successful data and its limitations when assessing what the highland installation established.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo_16_lm.jpg",
        caption: "Apollo 16 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: `The station remains in Descartes, with the central unit roughly a hundred meters from Orion.

Scientific operations ended on September 30, 1977, alongside the other ALSEPs.

The heat-flow equipment had already been inactive since setup.

The installation stayed because it was permanent surface equipment, while astronauts and samples returned.

Its working instruments eventually stopped transmitting.

Their observations remained available, preserving another site in the network that helped investigate the Moon below the surface.`,
      },
    ],
  },
  {
    id: "apollo-17-alsep",
    name: "Apollo 17 ALSEP station",
    place: "Moon",
    coverImageUrl: "/assets/objects/apollo_17_lm.jpg",
    recordIds: ["apollo-17-alsep"],
    sourceUrls: [
      "https://www.nasa.gov/missions/apollo/apollo-17-mission-details/",
      "https://pds.nasa.gov/ds-view/pds/viewContext.jsp?identifier=urn%3Anasa%3Apds%3Acontext%3Ainstrument_host%3Aspacecraft.a17a",
    ],
    pages: [
      {
        label: "Origin",
        title: "The Last Apollo Watch",
        imageUrl: "/assets/objects/apollo_17_lm.jpg",
        caption: "Apollo 17 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: `Eugene Cernan and Harrison Schmitt deployed Apollo 17's ALSEP in Taurus-Littrow in December 1972.

Its central station began operating on December 12.

This final installation carried different instruments from earlier Apollo stations.

When the astronauts departed on December 14, the package remained.

The program's human visits were ending, but science at the last landing site would continue through equipment built to investigate the valley without another crew returning.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/apollo_17_lm.jpg",
        caption: "Apollo 17 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: `A SNAP-27 generator powered heat-flow probes and seismic profiling equipment.

A mass spectrometer investigated the extremely thin atmosphere.

An ejecta-and-meteorite experiment detected particles, while a surface gravimeter was intended for precise gravity measurements.

The central station connected power and communication.

The package extended the expedition into a continuing investigation of heat, shallow structure, and the environment at the valley where Apollo's final landing crew had collected samples and examined geological targets.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "/assets/objects/apollo_17_lm.jpg",
        caption: "Apollo 17 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: `Heat-flow and seismic observations supplied information about thermal properties and shallow structure.

The atmospheric experiment investigated gases near the ground.

Other instruments faced limits.

A design error prevented the gravimeter's intended gravity measurements, and the particle instrument's response complicated interpretation.

The archive includes successful data and documented problems.

Later scientists could evaluate both, using the station's record carefully rather than assuming every instrument had achieved its original plan.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/apollo_17_lm.jpg",
        caption: "Apollo 17 ALSEP station",
        credit: "NASA (image via NSSDCA)",
        text: `The station remains in Taurus-Littrow near Challenger's descent stage, deployed separately from the lander.

NASA ended science operations on September 30, 1977, after several years.

The equipment stayed because no return mission was planned.

The astronauts' departure had not ended its work; the later program shutdown did.

Apollo's final surface installation became inactive, but its archive preserved years of measurements from a valley the crew had visited for only a short time.`,
      },
    ],
  },
  {
    id: "grail-b",
    name: "GRAIL-B (Flow)",
    place: "Moon",
    coverImageUrl: "/assets/objects/grail_2.jpg",
    recordIds: ["grail-b"],
    sourceUrls: ["https://science.nasa.gov/mission/grail/"],
    pages: [
      {
        label: "Origin",
        title: "Flow, the Other Half of a Lunar Laboratory",
        imageUrl: "/assets/objects/grail_2.jpg",
        caption: "GRAIL-B (Flow)",
        credit: "NASA (GRAIL spacecraft illustration; attribution awaiting owner review)",
        text: `GRAIL-B launched beside GRAIL-A on September 10, 2011.

Students named the spacecraft Flow and Ebb.

Flow reached lunar orbit around New Year 2012, after its companion, and began formation flight.

The mission depended on their changing separation.

Different gravitational pulls altered their movements over different regions.

Flow's partnership with Ebb made it possible to investigate hidden material through motion, providing evidence that neither spacecraft could obtain through surface images alone.`,
      },
      {
        label: "Goals",
        title: "The Work It Was Built to Do",
        imageUrl: "/assets/objects/grail_2.jpg",
        caption: "GRAIL-B (Flow)",
        credit: "NASA (GRAIL spacecraft illustration; attribution awaiting owner review)",
        text: `Flow's Lunar Gravity Ranging System exchanged precise signals with Ebb to measure distance changes.

Variations in gravity altered their motion.

Solar arrays supplied electricity, and MoonKAM let students participate in imaging.

The mission investigated the crust, impact basins, and forces disturbing lunar orbits.

Flow was half of a paired experiment.

Its central measurement required the companion, turning formation flight into a method for investigating structure beneath the visible lunar surface.`,
      },
      {
        label: "Discoveries",
        title: "What Its Journey Made Possible",
        imageUrl: "public/assets/objects/GRAIL_s_gravity_map_of_the_moon.jpg",
        caption: "GRAIL_s_gravity_map_of_the_moon",
        credit: "NASA (GRAIL spacecraft illustration; attribution awaiting owner review)",
        text: `Flow and Ebb produced a detailed gravity map revealing a heavily fractured crust and buried structures.

The observations refined crustal-thickness estimates and helped explain mass concentrations associated with large basins.

These were shared discoveries.

Neither spacecraft alone could make the same separation measurement.

Their motion supplied evidence about the interior, giving scientists another way to investigate geological history and hidden material without directly collecting samples from those deeper layers.`,
      },
      {
        label: "Now",
        title: "Where Its Story Ended",
        imageUrl: "/assets/objects/GRAIL_s_Final_Resting_Spot.jpg",
        caption: "GRAIL_s_Final_Resting_Spot",
        credit: "NASA (GRAIL spacecraft illustration; attribution awaiting owner review)",
        text: `Flow and Ebb ended their extended mission with deliberate impacts near the north pole on December 17, 2012.

Flow struck shortly after Ebb.

Both were destroyed, leaving separate sites near the same mountain in the area named for Sally Ride.

Fuel was low, so the final paths were controlled to avoid historic landing sites.

The paired experiment ended at impact.

Their gravity map remained available, preserving the scientific results of two spacecraft whose connected flight had revealed hidden lunar structure.`,
      },
    ],
  },
];


class ModelErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.2} />;
}

const PageMedia: React.FC<{ page: BookPage }> = ({ page }) => {
  if (page.modelUrl) {
    return (
      <div className="h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d12]">
        <ModelErrorBoundary>
          <Canvas camera={{ position: [2.5, 1.5, 2.5], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.3} />
            <Suspense fallback={null}>
              <GLTFModel url={page.modelUrl} />
            </Suspense>
            <OrbitControls autoRotate={!prefersReducedMotion()} autoRotateSpeed={1} enableZoom enablePan={false} />
          </Canvas>
        </ModelErrorBoundary>
      </div>
    );
  }

  if (page.imageUrl) {
    return (
      <figure className="flex h-full w-full min-h-0 flex-col">
        <img
          src={page.imageUrl}
          alt={page.title}
          className="min-h-0 flex-1 w-full rounded-4xl border border-white/10 object-cover object-center"
        />
        <figcaption className="mt-1.5 flex items-center justify-between gap-2 px-1 text-[12px] leading-tight text-[#979899]">
          <span className="truncate">{page.caption}</span>
          <span className="shrink-0">{page.credit}</span>
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.03]">
      <ImageIcon className="h-6 w-6 text-[#6b7280]" />
      <span className="font-mono text-[10px] uppercase tracking-wide text-[#6b7280]">
        Photo or 3D model coming soon
      </span>
    </div>
  );
};

const SPINE_WIDTHS = [44, 52, 40, 60, 48];
const SPINE_HEIGHTS = ['78%', '90%', '70%', '96%', '84%'];
const COVER_WIDTH = 190;

const BookCard: React.FC<{
  book: BotBook;
  onOpen: () => void;
  onEnter: () => void;
  onLeave: () => void;
  index: number;
}> = ({ book, onOpen, onEnter, onLeave, index }) => {
  const [hovered, setHovered] = useState(false);
  const spineWidth = SPINE_WIDTHS[index % SPINE_WIDTHS.length];
  const spineHeight = SPINE_HEIGHTS[index % SPINE_HEIGHTS.length];

  const enter = () => {
    setHovered(true);
    onEnter();
  };
  const leave = () => {
    setHovered(false);
    onLeave();
  };

  return (
    <motion.button
      type="button"
      layout="position"
      onClick={onOpen}
      onHoverStart={enter}
      onHoverEnd={leave}
      onFocus={enter}
      onBlur={leave}
      aria-label={`Open ${book.name} story`}
      initial={{ opacity: 0, y: 40 }}
      animate={{
        opacity: 1,
        y: hovered ? -10 : 0,
        width: hovered ? COVER_WIDTH : spineWidth,
        height: hovered ? '96%' : spineHeight,
        rotateY: 0,
        scale: 1,
        boxShadow: hovered
          ? '0 34px 46px -14px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.12)'
          : '4px 8px 18px rgba(0,0,0,0.6)',
      }}
      transition={{
        opacity: { duration: 0.5, delay: Math.min(index * 0.04, 1) },
        y: { type: 'spring', stiffness: 240, damping: 24 },
        width: { type: 'spring', stiffness: 240, damping: 26 },
        height: { type: 'spring', stiffness: 240, damping: 26 },
        rotateY: { type: 'spring', stiffness: 200, damping: 22 },
        scale: { type: 'spring', stiffness: 200, damping: 22 },
        boxShadow: { duration: 0.3 },
      }}
      style={{ transformOrigin: 'bottom center' }}
      className="relative shrink-0 self-end overflow-hidden rounded-[3px] border border-white/10 bg-neutral-900 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      {/* Spine view: what you see while the book is resting on the shelf. */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-y-0 left-0 w-[2px] bg-black/50" />
        <div className="absolute inset-y-0 right-0 w-[2px] bg-white/30" />
        <div className="relative flex h-full flex-col items-center justify-between px-1 py-3">
          <span
            className="font-serif text-xs font-medium uppercase tracking-[0.12em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] sm:text-[13px]"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {book.name}
          </span>
          <span className="h-px w-3 bg-white/80" />
          <span
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] sm:text-[11px]"
            style={{ writingMode: 'vertical-rl' }}
          >
            {book.place}
          </span>
        </div>
      </motion.div>

      {/* Front view: the cover that comes forward on hover. */}
      <motion.div
        className="absolute inset-0 flex flex-col"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, delay: hovered ? 0.08 : 0 }}
      >
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={book.name} draggable={false} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-neutral-800" />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pb-3 pt-14">
          <p className="font-serif text-xl leading-tight text-white">{book.name}</p>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/75">{book.place}</p>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      </motion.div>
    </motion.button>
  );
};

const BookModal: React.FC<{ book: BotBook; onClose: () => void }> = ({ book, onClose }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const wheelLockRef = useRef(false);
  const pageScrollRef = useRef<HTMLDivElement | null>(null);
  const touchLockRef = useRef(false);
  const touchStartRef = useRef<{ y: number; target: EventTarget | null; canScrollUp: boolean; canScrollDown: boolean } | null>(null);
  const page = book.pages[pageIndex];

  const goTo = (i: number) => {
    setPageIndex(Math.max(0, Math.min(book.pages.length - 1, i)));
  };

  // Lock background scroll while the story is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(pageIndex + 1);
      if (e.key === 'ArrowLeft') goTo(pageIndex - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pageIndex, onClose]);

  // True when a scrollable element under the pointer can still move in `dir`.
  // In that case the gesture belongs to that element (a section, slider or the
  // page text), and the page must not change yet.
  const innerCanScroll = (target: EventTarget | null, dir: number) => {
    // Check the whole story even when the pointer is over its header, controls or backdrop.
    const story = pageScrollRef.current;
    if (story && story.scrollHeight > story.clientHeight + 1) {
      const atTop = story.scrollTop <= 1;
      const atBottom = story.scrollHeight - story.clientHeight - story.scrollTop <= 1;
      if (dir > 0 ? !atBottom : !atTop) return true;
    }
    let node = target instanceof Element ? target : null;
    while (node && node !== document.body) {
      const overflowY = window.getComputedStyle(node).overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 1) {
        const atTop = node.scrollTop <= 0;
        const atBottom = Math.ceil(node.scrollTop + node.clientHeight) >= node.scrollHeight - 1;
        if (dir > 0 ? !atBottom : !atTop) return true;
      }
      node = node.parentElement;
    }
    return false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!e.deltaY || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const dir = Math.sign(e.deltaY);
    // Let the current page consume the wheel while its scrollbar can still move.
    // Only turn the page once that scrollbar is already at the requested edge.
    if (innerCanScroll(e.target, dir)) return;
    if (wheelLockRef.current || Math.abs(e.deltaY) < 8) return;

    wheelLockRef.current = true;
    goTo(pageIndex + dir);
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 400);
  };

  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    // Capture both edges before the browser scrolls during this swipe.
    touchStartRef.current = {
      y: touch.clientY,
      target: e.target,
      canScrollUp: innerCanScroll(e.target, -1),
      canScrollDown: innerCanScroll(e.target, 1),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || touchLockRef.current) return;

    const touch = e.changedTouches[0];
    if (!touch) return;
    const deltaY = start.y - touch.clientY;
    if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
    const dir = Math.sign(deltaY);
    if (dir > 0 ? start.canScrollDown : start.canScrollUp) return;
    if (innerCanScroll(start.target, dir)) return;

    touchLockRef.current = true;
    goTo(pageIndex + dir);
    window.setTimeout(() => {
      touchLockRef.current = false;
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6 xl:px-36"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#ece7dc] hover:bg-white/20 sm:right-5 sm:top-5"
        aria-label="Close book"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
        {book.pages.map((p, i) => (
          <button
            type="button"
            key={p.label}
            onClick={() => goTo(i)}
            className={`flex items-center gap-2 font-mono text-xs uppercase tracking-wide transition ${
              i === pageIndex ? 'text-[#c1440e]' : 'text-[#6b7280] hover:text-[#9aa0a6]'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${i === pageIndex ? 'bg-[#c1440e]' : 'bg-[#6b7280]'}`} />
            {p.label}
          </button>
        ))}
      </div>

      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#12151c] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-12 sm:py-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-[#9aa0a6]">{book.place}</p>
            <h2 className="font-serif text-3xl text-[#ece7dc] sm:text-4xl">{book.name}</h2>
          </div>
          <span className="font-mono text-sm text-[#6b7280]">
            {pageIndex + 1} / {book.pages.length}
          </span>
        </div>

        <div className="relative flex min-h-0 flex-1 overflow-hidden" style={{ perspective: 1400 }}>
          <AnimatePresence mode="wait">
            <motion.div
              ref={pageScrollRef}
              key={page.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="grid h-full w-full grid-cols-1 content-start gap-8 overflow-y-auto overscroll-contain p-6 sm:grid-cols-2 sm:gap-12 sm:p-12"
            >
              <div className="h-56 sm:h-auto sm:min-h-[320px]">
                <PageMedia page={page} />
              </div>
              <div>
                <p className="font-mono text-sm uppercase tracking-wider text-[#c1440e]">{page.label}</p>
                <h3 className="mt-1 font-serif text-3xl font-normal leading-tight text-[#ece7dc] sm:text-4xl">
                  {page.title}
                </h3>
                <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-[#ece7dc]/85">
                  {page.text}
                </div>
                {page.bullets && (
                  <ul className="mt-5 space-y-3">
                    {page.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-base text-[#ece7dc]/80">
                        <span className="mt-0.5 text-[#c1440e]">✦</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 border-t border-white/10 py-3">
          <button
            type="button"
            onClick={() => goTo(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-[#9aa0a6] hover:text-[#ece7dc] disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" /> Prev
          </button>
          <span className="hidden font-mono text-xs text-[#6b7280] sm:block">
            scroll the text, then keep scrolling to turn pages
          </span>
          <button
            type="button"
            onClick={() => goTo(pageIndex + 1)}
            disabled={pageIndex === book.pages.length - 1}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-[#9aa0a6] hover:text-[#ece7dc] disabled:opacity-30"
          >
            Next <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const AbandonedStories: React.FC = () => {
  const idFromHash = () => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    return BOOKS.some((b) => b.id === id) ? id : null;
  };

  const [openBookId, setOpenBookId] = useState<string | null>(idFromHash);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const openBook = BOOKS.find((b) => b.id === openBookId) ?? null;
  const hoveredBook = BOOKS.find((b) => b.id === hoveredId) ?? null;

  const shelfRef = useRef<HTMLDivElement | null>(null);
  const autoScrollPaused = useRef(false);
  const resumeTimer = useRef<number | null>(null);

  const openById = (id: string | null) => {
    setOpenBookId(id);
    const url = window.location.pathname + window.location.search + (id ? `#${id}` : '');
    window.history.pushState(null, '', url);
  };

  useEffect(() => {
    const sync = () => setOpenBookId(idFromHash());
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const loopRef = useRef(0);
  const openRef = useRef(false);
  openRef.current = !!openBook;

  const pauseAutoScroll = () => {
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    autoScrollPaused.current = true;
  };

  const resumeAutoScroll = () => {
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      autoScrollPaused.current = false;
      resumeTimer.current = null;
    }, 700);
  };

  const pos = useRef(0);
  const vel = useRef(0);
  const drag = useRef({ active: false, lastX: 0, lastT: 0, moved: 0 });

  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;

    const measure = () => {
      const a = shelf.children[0] as HTMLElement | undefined;
      const b = shelf.children[BOOKS.length] as HTMLElement | undefined;
      if (!a || !b) return;
      const first = loopRef.current === 0;
      loopRef.current = b.offsetLeft - a.offsetLeft;
      if (first) pos.current = loopRef.current;
    };
    measure();
    window.addEventListener('resize', measure);

    // Wheel adds momentum instead of jumping.
    const onWheel = (e: WheelEvent) => {
      // Only a genuinely horizontal gesture moves the shelf; vertical wheel is left to the page.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 2 || Math.abs(e.deltaX) < 4) return;
      e.preventDefault();
      vel.current += e.deltaX * 0.0075;
    };
    shelf.addEventListener('wheel', onWheel, { passive: false });

    let frame = 0;
    let last = performance.now();
    let auto = 0;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 40);
      last = now;
      const w = loopRef.current;
      if (w && !drag.current.active) {
        const idle = autoScrollPaused.current || openRef.current || prefersReducedMotion();
        auto += ((idle ? 0 : 0.02) - auto) * Math.min(1, dt * 0.004);
        vel.current *= Math.pow(0.92, dt / 16);
        if (Math.abs(vel.current) < 0.001) vel.current = 0;
        pos.current += (vel.current + auto) * dt;
      }
      if (w) {
        while (pos.current >= 2 * w) pos.current -= w;
        while (pos.current < w) pos.current += w;
        shelf.scrollLeft = pos.current;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      shelf.removeEventListener('wheel', onWheel);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, lastX: e.clientX, lastT: performance.now(), moved: 0 };
    vel.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const now = performance.now();
    const dx = d.lastX - e.clientX;
    d.moved += Math.abs(dx);
    if (d.moved > 6 && !e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    pos.current += dx;
    const dt = Math.max(1, now - d.lastT);
    vel.current = vel.current * 0.6 + (dx / dt) * 0.4;
    d.lastX = e.clientX;
    d.lastT = now;
  };
  const endDrag = () => {
    if (performance.now() - drag.current.lastT > 80) vel.current = 0;
    drag.current.active = false;
  };

  return (
    <section className="relative w-full overflow-hidden bg-black py-6 text-white sm:py-8">
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
        <div className="mb-2 font-mono text-xs uppercase tracking-[0.28em] text-white/50">
          Resting, but not forgotten
        </div>
        <h2 className="font-serif text-[40px] font-medium leading-[0.92] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
          Abandoned Stories
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
          A visual archive of explorers that changed what we know about other worlds. Hover a volume to read its
          title, then click to open its story.
        </p>
      </div>

      {/* Spotlight: shows the full name and tagline of the hovered volume. */}
      <div className="relative z-20 mx-auto mt-6 flex h-[110px] max-w-4xl items-center justify-center px-5 text-center sm:h-[124px]">
        <AnimatePresence mode="wait">
          {hoveredBook ? (
            <motion.div
              key={hoveredBook.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#c1440e] sm:text-sm">
                {hoveredBook.place}
              </p>
              <h3 className="mt-1 font-serif text-4xl text-white sm:text-5xl">{hoveredBook.name}</h3>
              <p className="mt-1 text-base text-white/70 sm:text-lg">{hoveredBook.pages[0].title}</p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-xs uppercase tracking-[0.2em] text-white/45 sm:text-sm"
            >
              {BOOKS.length} volumes · hover to read the title · click to open
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <div
          ref={shelfRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={(e) => {
            if (drag.current.moved > 6) {
              e.stopPropagation();
              e.preventDefault();
              drag.current.moved = 0;
            }
          }}
          onMouseEnter={pauseAutoScroll}
          onMouseLeave={resumeAutoScroll}
          onTouchStart={pauseAutoScroll}
          onTouchEnd={resumeAutoScroll}
          className="relative z-10 flex h-[300px] w-full items-end gap-2.5 cursor-grab select-none overflow-hidden touch-pan-y active:cursor-grabbing px-6 pb-5 sm:h-[380px] sm:px-10 lg:h-[440px]"
        >
          {[0, 1, 2].flatMap((c) => BOOKS.map((book, index) => ({ book, index, c }))).map(({ book, index, c }) => (
            <BookCard
              key={`${book.id}-${c}`}
              book={book}
              index={index}
              onOpen={() => openById(book.id)}
              onEnter={() => {
                setHoveredId(book.id);
                pauseAutoScroll();
              }}
              onLeave={() => {
                setHoveredId(null);
                resumeAutoScroll();
              }}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-5 left-0 right-0 z-20 h-px bg-white/15" />
      </div>

      <div className="mx-auto mt-2 flex max-w-5xl items-center justify-between px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 sm:px-8 sm:text-xs">
        <span>{BOOKS.length} volumes</span>
        <span className="hidden sm:block">drag or swipe</span>
        <span>click to open</span>
      </div>

      <AnimatePresence>
        {openBook && <BookModal book={openBook} onClose={() => openById(null)} />}
      </AnimatePresence>
    </section>
  );
};