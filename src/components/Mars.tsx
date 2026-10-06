
import React, { useState } from 'react';

type Planet = 'mars' | 'moon';

const MODELS = {
  mars: {
    name: 'Mars',
    subtitle: 'The Red Planet',
    description:
      'Explore Mars and the InSight lander through an interactive 3D model.',
    modelUrl:
      'https://sketchfab.com/models/50bb6eb0d1104d43bf684d2b0f70de1d/embed?autostart=1&autospin=0.15',
    sketchfabUrl:
      'https://sketchfab.com/3d-models/mars-insight-lander-and-volcanic-regions-50bb6eb0d1104d43bf684d2b0f70de1d',
    creator: 'Quanta Magazine',
    icon: '🔴',
  },

  moon: {
    name: 'Moon',
    subtitle: "Earth's Silent Companion",
    description:
      'Explore the Moon through an interactive 3D model and discover the world visited by humanity.',
    modelUrl:
      'https://sketchfab.com/models/870de693475d436c8e925ab0bcda4ca4/embed?autostart=1&autospin=0.15',
    sketchfabUrl:
      'https://sketchfab.com/3d-models/moon-870de693475d436c8e925ab0bcda4ca4',
    creator: 'Mieke Roth',
    icon: '🌕',
  },
};

export const Mars: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>('mars');

  const planet = MODELS[selectedPlanet];

  return (
    <div className="min-h-screen bg-[#050816] text-white">

     
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-8 text-center">

        <p className="text-sm uppercase tracking-[0.4em] text-orange-400">
          Planetary Archive
        </p>

        <h1 className="mt-3 text-5xl font-bold md:text-7xl">
          Worlds Beyond Earth
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-gray-400">
          Choose a world and explore it through an interactive 3D model.
        </p>

      </section>
      <section className="mx-auto max-w-4xl px-6">

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedPlanet('mars')}
            className={`group rounded-2xl border p-6 text-left transition-all duration-300 ${
              selectedPlanet === 'mars'
                ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10'
                : 'border-white/10 bg-white/5 hover:border-orange-500/50 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl">🔴</span>

              <div>
                <h2 className="text-2xl font-semibold">
                  Mars
                </h2>

                <p className="text-sm text-gray-400">
                  The Red Planet
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedPlanet('moon')}
            className={`group rounded-2xl border p-6 text-left transition-all duration-300 ${
              selectedPlanet === 'moon'
                ? 'border-blue-400 bg-blue-400/10 shadow-lg shadow-blue-400/10'
                : 'border-white/10 bg-white/5 hover:border-blue-400/50 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl">🌕</span>

              <div>
                <h2 className="text-2xl font-semibold">
                  Moon
                </h2>

                <p className="text-sm text-gray-400">
                  Earth's Silent Companion
                </p>
              </div>
            </div>
          </button>

        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-6">

          <div className="flex items-center gap-3">
            <span className="text-4xl">
              {planet.icon}
            </span>

            <div>
              <h2 className="text-3xl font-bold">
                {planet.name}
              </h2>

              <p className="text-gray-400">
                {planet.subtitle}
              </p>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-gray-400">
            {planet.description}
          </p>

        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">

          <div className="relative h-[500px] w-full md:h-[650px]">

            <iframe
              key={selectedPlanet}
              title={planet.name}
              src={planet.modelUrl}
              className="absolute inset-0 h-full w-full"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
            />

          </div>

        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500">
              3D Model
            </p>

            <p className="mt-1 text-gray-300">
              Created by {planet.creator}
            </p>
          </div>

          <a
            href={planet.sketchfabUrl}
            target="_blank"
            rel="nofollow noreferrer"
            className="text-sm font-medium text-[#1CAAD9] hover:underline"
          >
            View on Sketchfab →
          </a>

        </div>


        <section className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-transparent p-8">

          <p className="text-sm uppercase tracking-widest text-orange-400">
            Explore the Archive
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Two worlds. Countless stories.
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-gray-400">
            From robotic explorers on Mars to the footprints left by humans
            on the Moon, these worlds hold the stories of machines and people
            that ventured beyond Earth.
          </p>

        </section>

      </main>

    </div>
  );
};
