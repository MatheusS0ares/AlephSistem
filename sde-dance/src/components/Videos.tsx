"use client";

import { useRef, useState } from "react";
import { site } from "@/config/site";

export default function Videos() {
  const hasVideos = site.videos.length > 0;

  if (!hasVideos) return <VideoPlaceholder />;

  return (
    <section id="videos" className="py-28 lg:py-36" style={{ backgroundColor: "var(--color-blackout)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <p className="eyebrow mb-3">Em cena</p>
        <h2 className="font-semibold leading-tight mb-14"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)", fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
          Assista aos espetáculos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(site.videos as ReadonlyArray<{ youtubeId: string; titulo: string; descricao?: string }>).map((v) => (
            <VideoCard key={v.youtubeId} video={v} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoCard({ video }: { video: { youtubeId: string; titulo: string; descricao?: string } }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden group cursor-pointer"
        style={{ backgroundColor: "rgba(11,10,12,0.8)", border: "1px solid rgba(244,239,231,0.07)" }}
        onClick={() => setPlaying(true)}>
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {/* Thumbnail */}
            <img
              src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
              alt={video.titulo}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(11,10,12,0.4)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: "rgba(231,182,92,0.9)", borderColor: "var(--color-spot)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--color-blackout)", marginLeft: "3px" }} aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
      <div>
        <h3 className="font-medium text-sm" style={{ color: "var(--color-bone)" }}>{video.titulo}</h3>
        {video.descricao && (
          <p className="text-xs mt-1" style={{ color: "var(--color-ash)" }}>{video.descricao}</p>
        )}
      </div>
    </div>
  );
}

function VideoPlaceholder() {
  return (
    <section id="videos" className="py-20" style={{ backgroundColor: "var(--color-blackout)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-y"
          style={{ borderColor: "rgba(110,16,35,0.25)" }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(110,16,35,0.3)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                style={{ color: "var(--color-spot)" }} aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--color-bone)" }}>
                Vídeos de espetáculos em breve
              </p>
              <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                {/* TODO-CLIENTE: adicionar IDs do YouTube em site.ts → videos[] */}
                // TODO-CLIENTE: videos do YouTube/Instagram
              </p>
            </div>
          </div>
          <a href={site.contact.instagram} target="_blank" rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 text-sm transition-colors duration-200"
            style={{ color: "var(--color-spot)" }}>
            Ver no Instagram
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
