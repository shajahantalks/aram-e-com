import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  ArrowRight,
  Flame,
  Award,
  Truck,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { Language, TempleVideoConfig } from '../../types';
import { TEMPLE_VIDEO_PRESETS, DEFAULT_TEMPLE_VIDEO_CONFIG } from '../../services/storageService';
import { templeBell } from '../../utils/audio';

interface HeroBannerProps {
  language: Language;
  onExplore: () => void;
  onViewStory: () => void;
  videoConfig?: TempleVideoConfig;
  onSelectPreset?: (presetId: string) => void;
  onOpenAdminVideo?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  onExplore,
  onViewStory,
  videoConfig = DEFAULT_TEMPLE_VIDEO_CONFIG,
  onSelectPreset,
  onOpenAdminVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(videoConfig.muted ?? true);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>(videoConfig.activePresetId || 'brihadeeswarar');

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = videoConfig.playbackSpeed || 1;
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Autoplay policy prevented playback, set paused
          setIsPlaying(false);
        });
      }
    }
  }, [videoConfig.videoUrl, videoConfig.playbackSpeed, isMuted, isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    if (!nextMuted) {
      templeBell.ring();
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setActivePreset(presetId);
    if (onSelectPreset) {
      onSelectPreset(presetId);
    }
  };

  const currentPresetData = TEMPLE_VIDEO_PRESETS.find((p) => p.id === activePreset) || TEMPLE_VIDEO_PRESETS[0];
  const activeVideoUrl = videoConfig.videoUrl || currentPresetData.videoUrl;
  const activePosterUrl = videoConfig.posterUrl || currentPresetData.posterUrl;

  const overlayOpacityPercent = (videoConfig.overlayOpacity ?? 55) / 100;
  const amberTintPercent = (videoConfig.amberTint ?? 65) / 100;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#5c340d] via-[#78430e] to-[#3a1603] text-yellow-50 py-10 lg:py-16 border-b-4 border-yellow-400 shadow-xl transition-all">
      {/* Kolam Geometric Pattern Background Overlay */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FDE047_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

      {/* Decorative Traditional Temple Arch Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-yellow-400/25 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Sacred Golden Particle Sparks if enabled */}
      {videoConfig.showParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-yellow-300 blur-2xs animate-ping [animation-duration:3s]" />
          <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 rounded-full bg-amber-400 blur-2xs animate-pulse [animation-duration:2.5s]" />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-yellow-200 blur-2xs animate-ping [animation-duration:4s]" />
          <div className="absolute bottom-1/4 right-1/8 w-2 h-2 rounded-full bg-amber-300 blur-2xs animate-pulse [animation-duration:3.5s]" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Preset Video Selector Ribbon */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-stone-950/60 backdrop-blur-md p-2.5 rounded-2xl border border-yellow-400/40 text-xs">
          <div className="flex items-center gap-2 text-yellow-300 font-bold px-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-heading tracking-wide uppercase text-[11px] sm:text-xs">
              {language === 'ta' ? 'நேரலை கோவில் தரிசன வீடியோ' : 'Live Temple Sanctum Video'}
            </span>
          </div>

          {/* Quick preset tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {TEMPLE_VIDEO_PRESETS.map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`px-3 py-1 rounded-xl transition text-[11px] font-bold cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-yellow-400 text-stone-950 shadow-md font-black border border-yellow-200'
                      : 'bg-white/10 hover:bg-white/20 text-yellow-200/90'
                  }`}
                >
                  <span>🪔</span>
                  <span>{language === 'ta' ? preset.nameTa.split('•')[0] : preset.name.split('•')[0]}</span>
                </button>
              );
            })}

            {onOpenAdminVideo && (
              <button
                onClick={onOpenAdminVideo}
                className="ml-2 px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                title="Admin Video Studio"
              >
                <span>Edit Video ⚙️</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Auspicious Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-950/80 border border-yellow-400/80 text-yellow-300 text-xs sm:text-sm font-semibold backdrop-blur-xs shadow-md">
              <Flame className="w-4 h-4 text-yellow-400 animate-flame" />
              <span className="font-tamil">
                {language === 'ta'
                  ? (videoConfig.badgeTextTa || 'மங்கல துவக்கம் • தெய்வ அருள் நிறைந்த பாரம்பரியம்')
                  : (videoConfig.badgeText || 'Auspicious Heritage • Pure Tamil Temple Traditions')}
              </span>
            </div>

            {/* Main Brand Title & Tagline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white font-heading">
                {language === 'ta' ? (
                  <>
                    <span className="text-yellow-300 font-tamil block drop-shadow-sm">
                      {videoConfig.titleTa ? videoConfig.titleTa : 'அறம் பிராண்ட்'}
                    </span>
                    தமிழ் பாரம்பரிய & கோவில் கலைப் பொக்கிஷங்கள்
                  </>
                ) : (
                  <>
                    Sacred Splendor of <br />
                    <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
                      {videoConfig.title ? videoConfig.title : 'Tamil Temple Traditions'}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-yellow-100/90 max-w-2xl font-light leading-relaxed">
                {language === 'ta'
                  ? (videoConfig.subtitleTa ||
                    'சுவாமிமலை வெண்கல சிலைகள், நாச்சியார்கோவில் பித்தளை விளக்குகள், காஞ்சி கைத்தறி பட்டு மற்றும் மரச்செக்கு எண்ணெய்கள் — தலைமுறை கைவினைக் கலைஞர்களிடமிருந்து நேரடியாக உங்கள் இல்லத்திற்கு.')
                  : (videoConfig.subtitle ||
                    'Authentic Swamimalai lost-wax bronzes, Nachiyar Koil brass Deepams, Kanchipuram mulberry silks, and stone-ground Chettinad pantry treasures — shipped directly with temple blessings.')}
              </p>
            </div>

            {/* Thirukkural Blessing Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-950/90 to-amber-950/70 border-l-4 border-yellow-400 border-t border-r border-b border-yellow-400/40 text-xs sm:text-sm shadow-lg">
              <p className="font-tamil text-yellow-300 font-bold text-sm sm:text-base mb-1">
                "{videoConfig.quoteText || 'அறத்தான் வருவதே இன்பம்மற் றெல்லாம் புறத்த புகழும் இல.'}"
              </p>
              <p className="text-yellow-200/80 italic text-[11px] sm:text-xs">
                {videoConfig.quoteCitation ||
                  '— திருக்குறள் 39 • "True joy stems from righteousness (Aram); all other pleasure is hollow."'}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExplore}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-stone-950 font-black text-sm sm:text-base shadow-xl hover:shadow-yellow-400/40 transition-all flex items-center gap-2 group cursor-pointer border border-yellow-200"
              >
                <span>
                  {language === 'ta' ? 'அனைத்து பொருட்களை காண்க' : 'Explore Traditional Catalog'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onViewStory}
                className="px-6 py-3.5 rounded-full border-2 border-yellow-300/80 hover:bg-yellow-400/15 text-yellow-200 font-bold text-sm transition flex items-center gap-2 cursor-pointer backdrop-blur-xs"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>
                  {language === 'ta' ? 'அறம் பாரம்பரிய கதை' : 'Our Artisan Heritage'}
                </span>
              </button>
            </div>

            {/* Key Trust Signals */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-yellow-700/50 text-center">
              <div className="flex flex-col items-center">
                <Award className="w-5 h-5 text-yellow-400 mb-1" />
                <span className="text-xs font-bold text-white">100% GI Tagged</span>
                <span className="text-[10px] text-yellow-200/80">Authentic Heritage</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-yellow-400 mb-1" />
                <span className="text-xs font-bold text-white">Safe Sacred Transit</span>
                <span className="text-[10px] text-yellow-200/80">All-India & Global</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-yellow-400 mb-1" />
                <span className="text-xs font-bold text-white">Razorpay & COD</span>
                <span className="text-[10px] text-yellow-200/80">100% Secure Checkout</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column: Temple Animation Video Theatre Player */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg">
              {/* Grand Temple Architecture Brass-Framed Video Container */}
              <div className="relative rounded-3xl overflow-hidden border-3 border-yellow-400 shadow-2xl bg-stone-950 group">
                {/* HTML5 Temple Video Element */}
                <video
                  ref={videoRef}
                  src={activeVideoUrl}
                  poster={activePosterUrl}
                  autoPlay={videoConfig.autoplay}
                  loop={videoConfig.loop}
                  muted={isMuted}
                  playsInline
                  onLoadedData={() => {
                    setVideoLoaded(true);
                    setVideoError(false);
                  }}
                  onError={() => {
                    setVideoError(true);
                  }}
                  className="w-full h-80 sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Fallback image if video fails to load from external network */}
                {videoError && (
                  <img
                    src={activePosterUrl}
                    alt="Sacred Temple Sanctum"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Atmospheric Tint & Shading Overlays */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: `rgba(20, 10, 2, ${overlayOpacityPercent})`,
                  }}
                />

                <div
                  className="absolute inset-0 pointer-events-none mix-blend-color"
                  style={{
                    backgroundColor: `rgba(245, 158, 11, ${amberTintPercent * 0.4})`,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#200b02] via-transparent to-yellow-950/40 pointer-events-none" />

                {/* Animated Diya Flames at Bottom Left if enabled */}
                {videoConfig.showFlames && (
                  <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-yellow-400/70 flex items-center gap-3 shadow-xl z-20">
                    <div className="w-11 h-11 rounded-full bg-yellow-400/20 flex items-center justify-center border-2 border-yellow-400 shadow-md">
                      <span className="text-2xl animate-flame">🪔</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-yellow-300">
                        {currentPresetData.name.split('•')[0]}
                      </p>
                      <p className="text-[10px] text-yellow-200/90 font-medium">
                        {currentPresetData.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Floating Artisan Seal Badge */}
                <div className="absolute top-4 right-4 bg-yellow-400 text-stone-950 px-3.5 py-1.5 rounded-full font-black text-xs flex items-center gap-1.5 shadow-xl border border-yellow-200 z-20">
                  <Heart className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                  <span>Handcrafted Heritage</span>
                </div>

                {/* Video Playback & Sound Control Bar */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded-full bg-black/75 hover:bg-yellow-400 text-yellow-300 hover:text-stone-950 border border-yellow-400/70 shadow-lg transition cursor-pointer"
                    title={isPlaying ? 'Pause Sanctum Video' : 'Play Sanctum Video'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2.5 rounded-full bg-black/75 hover:bg-yellow-400 text-yellow-300 hover:text-stone-950 border border-yellow-400/70 shadow-lg transition cursor-pointer"
                    title={isMuted ? 'Unmute Temple Bells' : 'Mute Sound'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Decorative Kolam Dots on outer frame */}
              <div className="absolute -bottom-4 -right-4 w-28 h-28 border-2 border-dashed border-yellow-400/70 rounded-full pointer-events-none animate-spin [animation-duration:35s]" />
              <div className="absolute -top-4 -left-4 w-20 h-20 border-2 border-dotted border-yellow-400/50 rounded-full pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
