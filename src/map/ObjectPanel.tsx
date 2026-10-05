import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { VerifiedObject } from '../types/objects';
import { T, useT } from '../i18n';
import { isOfflineMode } from '../offline';

function fmtCoord(v: number, pos: string, neg: string) {
  return `${Math.abs(v)}° ${v >= 0 ? pos : neg}`;
}

interface Props {
  object: VerifiedObject;
  onClose: () => void;
  onOpenStory: (storyId: string) => void;
}

export const ObjectPanel: React.FC<Props> = ({ object: o, onClose, onOpenStory }) => {
  const t = useT();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [o.id]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <aside
      aria-label={o.name}
      onKeyDown={onKeyDown}
      className="rounded-xl border border-white/10 bg-[#11151f] p-4 text-[#ece7dc] sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 ref={headingRef} tabIndex={-1} className="font-serif text-xl outline-none focus-visible:ring-2 focus-visible:ring-[#7fd6e8]">
          {o.name}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('map.close')}
          className="shrink-0 rounded-full border border-white/20 p-2 text-[#9aa0a6] hover:text-[#ece7dc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <figure className="mt-3">
        <img src={o.image} alt={o.name} loading="lazy" className="max-h-96 w-full rounded-lg object-cover object-center" />
        <figcaption className="mt-1 text-xs text-[#9aa0a6]">
          <T k="map.credit" />: {o.image_credit}
        </figcaption>
      </figure>

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 ">
        <dt className="text-[#9aa0a6]"><T k="map.mission" /></dt>
        <dd>{o.mission}</dd>
        <dt className="text-[#9aa0a6]"><T k="map.agency" /></dt>
        <dd>{o.agency}</dd>
        <dt className="text-[#9aa0a6]"><T k="map.coordinates" /></dt>
        <dd>
          {fmtCoord(o.lat, 'N', 'S')}, {fmtCoord(o.lon, 'E', 'W')}
        </dd>
        <dt className="text-[#9aa0a6]"><T k="map.leftBehind" /></dt>
        <dd>{o.left_behind}</dd>
        <dt className="text-[#9aa0a6]"><T k="map.lastContact" /></dt>
        <dd>{o.last_contact}</dd>
      </dl>

      <div className="mt-4 space-y-3 text-sm leading-relaxed">
        <p>
          <strong className="block text-xs uppercase tracking-wide text-[#9aa0a6]"><T k="map.whyLeft" /></strong>
          {o.why_left}
        </p>
        <p>
          <strong className="block text-xs uppercase tracking-wide text-[#9aa0a6]"><T k="map.science" /></strong>
          {o.science_enabled}
        </p>
      </div>

      <p className="mt-4 break-words border-t border-white/10 pt-3 text-xs text-[#9aa0a6]">
        <T k="map.source" />:{' '}
        {isOfflineMode() ? (
          <span>{o.source_url}</span>
        ) : (
          <a href={o.source_url} target="_blank" rel="noopener noreferrer" className="text-[#7fd6e8] underline">
            {o.source_url}
          </a>
        )}{' '}
        · <T k="map.dataset" />: {o.dataset_id}
      </p>

      {o.story_id && (
        <button
          type="button"
          onClick={() => onOpenStory(o.story_id as string)}
          className="mt-4 rounded-full bg-[#c1440e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d3521a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fd6e8]"
        >
          <T k="map.story" />
        </button>
      )}
    </aside>
  );
};
