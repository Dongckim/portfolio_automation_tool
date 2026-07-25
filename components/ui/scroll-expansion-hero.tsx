'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobileState, setIsMobileState] = useState(false);
  const [mobileLines, setMobileLines] = useState<string[]>([]);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    if (isMobileState) return;

    const updateProgress = (delta: number) => {
      const nextProgress = Math.min(Math.max(scrollProgress + delta, 0), 1);
      setScrollProgress(nextProgress);
      if (nextProgress >= 1) {
        setMediaFullyExpanded(true);
        setShowContent(true);
      } else if (nextProgress < 0.75) {
        setShowContent(false);
      }
    };

    const isAtIntro = () => {
      const top = sectionRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      return top >= -1 && top <= 1;
    };
    const handleWheel = (event: WheelEvent) => {
      if (!isAtIntro()) return;
      if (!mediaFullyExpanded) {
        event.preventDefault();
        updateProgress(event.deltaY * 0.00115);
      } else if (event.deltaY < 0 && window.scrollY <= 5) {
        event.preventDefault();
        setMediaFullyExpanded(false);
        updateProgress(event.deltaY * 0.00115);
      }
    };
    const handleTouchStart = (event: TouchEvent) => setTouchStartY(event.touches[0]?.clientY ?? 0);
    const handleTouchMove = (event: TouchEvent) => {
      if (!touchStartY || !isAtIntro()) return;
      const touchY = event.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - touchY;
      if (mediaFullyExpanded && deltaY >= 0) return;
      event.preventDefault();
      if (mediaFullyExpanded && deltaY < 0) setMediaFullyExpanded(false);
      updateProgress(deltaY * 0.005);
      setTouchStartY(touchY);
    };
    const handleTouchEnd = () => setTouchStartY(0);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY, isMobileState]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobileState(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const phrases = ['Capture.', 'Interpret.', 'Respond.', 'In real time.'];
    if (!isMobileState) {
      setMobileLines([]);
      return;
    }

    let phraseIndex = 0;
    let characterIndex = 0;
    let holdTicks = 0;
    setMobileLines([]);
    const typingTimer = window.setInterval(() => {
      const phrase = phrases[phraseIndex];
      if (characterIndex < phrase.length) {
        characterIndex += 1;
        setMobileLines((lines) => {
          const nextLines = [...lines];
          nextLines[phraseIndex] = phrase.slice(0, characterIndex);
          return nextLines;
        });
        return;
      }

      holdTicks += 1;
      const isComplete = phraseIndex === phrases.length - 1;
      const requiredHold = isComplete ? 20 : 7;
      if (holdTicks < requiredHold) return;

      if (isComplete) {
        phraseIndex = 0;
        characterIndex = 0;
        holdTicks = 0;
        setMobileLines([]);
        return;
      }

      phraseIndex += 1;
      characterIndex = 0;
      holdTicks = 0;
    }, 58);

    return () => window.clearInterval(typingTimer);
  }, [isMobileState]);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const copySuffix = ' Interpret. Respond. In real time.';
  const revealedCharacters = Math.round(scrollProgress * copySuffix.length);
  const revealedCopy = `Capture.${copySuffix.slice(0, revealedCharacters)}`;

  return (
    <div ref={sectionRef} className='relative min-h-[100dvh] overflow-x-hidden transition-colors duration-700 ease-in-out'>
      <section className='relative flex min-h-[100dvh] flex-col items-center justify-start overflow-hidden'>
        <div className='relative flex min-h-[100dvh] w-full flex-col items-center'>
          <div className='absolute inset-0 z-0 md:hidden'>
            <Image src={mediaSrc} alt='Smart glasses rotating in the SmartSight introduction' fill className='object-cover' unoptimized priority />
          </div>
          <div className='pointer-events-none absolute inset-x-4 top-1/2 z-10 -translate-y-1/2 text-center mix-blend-difference md:hidden'>
            <h1 className='text-[clamp(2.15rem,10vw,4rem)] font-semibold leading-[0.92] tracking-[-0.075em] text-white' aria-label='Capture. Interpret. Respond. In real time.'>
              {mobileLines.map((line, index) => (
                <span key={`${index}-${line}`} className='block'>
                  {line}{index === mobileLines.length - 1 && <span className='ml-1 inline-block h-[0.82em] w-[2px] animate-pulse bg-white align-[-0.08em]' />}
                </span>
              ))}
            </h1>
          </div>
          <motion.div className='absolute inset-0 z-0 hidden h-full md:block' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Image src={bgImageSrc} alt='Background' width={1920} height={1080} className='h-screen w-screen object-cover object-center' priority unoptimized />
          </motion.div>

          <div className='container relative z-10 mx-auto hidden flex-col items-center justify-start md:flex'>
            <div className='relative flex h-[100dvh] w-full flex-col items-center justify-center'>
              <div className='absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl transition-none' style={{ width: `${mediaWidth}px`, height: `${mediaHeight}px`, maxWidth: '95vw', maxHeight: '85vh', boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)' }}>
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className='relative h-full w-full pointer-events-none'>
                      <iframe width='100%' height='100%' src={mediaSrc.includes('embed') ? `${mediaSrc}${mediaSrc.includes('?') ? '&' : '?'}autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1` : `${mediaSrc.replace('watch?v=', 'embed/')}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=${mediaSrc.split('v=')[1]}`} className='h-full w-full rounded-xl' frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
                      <div className='pointer-events-none absolute inset-0 z-10' />
                      <motion.div className='absolute inset-0 rounded-xl bg-black/30' initial={{ opacity: 0.7 }} animate={{ opacity: 0.5 - scrollProgress * 0.3 }} transition={{ duration: 0.2 }} />
                    </div>
                  ) : (
                    <div className='relative h-full w-full pointer-events-none'>
                      <video src={mediaSrc} poster={posterSrc} autoPlay muted loop playsInline preload='auto' className='h-full w-full rounded-xl object-cover' controls={false} disablePictureInPicture disableRemotePlayback />
                      <div className='pointer-events-none absolute inset-0 z-10' />
                      <motion.div className='absolute inset-0 rounded-xl bg-black/30' initial={{ opacity: 0.7 }} animate={{ opacity: 0.5 - scrollProgress * 0.3 }} transition={{ duration: 0.2 }} />
                    </div>
                  )
                ) : (
                  <div className='relative h-full w-full'>
                    <Image src={mediaSrc} alt='Smart glasses rotating in the SmartSight introduction' width={1280} height={720} className='h-full w-full rounded-xl object-cover' unoptimized priority />
                    <motion.div className='absolute inset-0 rounded-xl bg-black/50' initial={{ opacity: 0.7 }} animate={{ opacity: 0.7 - scrollProgress * 0.3 }} transition={{ duration: 0.2 }} />
                  </div>
                )}
              </div>

              <div className='pointer-events-none relative z-10 flex w-full items-center justify-center text-center mix-blend-difference'>
                <motion.h1
                  className='max-w-none whitespace-nowrap text-center text-[clamp(2rem,4vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.075em] text-white'
                  aria-label='Capture. Interpret. Respond. In real time.'
                >
                  {revealedCopy}
                </motion.h1>
              </div>
            </div>
            <motion.section className='flex w-full flex-col px-8 py-10 md:px-16 lg:py-20' initial={{ opacity: 0 }} animate={{ opacity: showContent ? 1 : 0 }} transition={{ duration: 0.7 }}>{children}</motion.section>
          </div>
          <motion.div
            aria-hidden='true'
            animate={{ opacity: isMobileState ? 1 : Math.max(0, 1 - scrollProgress * 1.8) }}
            className='absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3 text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] md:fixed md:bottom-8 md:z-[60]'
          >
            <div className='relative h-12 w-7 rounded-full border-2 border-current'>
              <motion.span
                className='absolute left-1/2 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-current'
                animate={{ y: [0, 17, 0], opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <span className='text-[11px] font-medium uppercase tracking-[0.42em]'>Scroll</span>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
