import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight, Play, Camera, Menu, X, ArrowDownRight } from "lucide-react";
import React, { useState, useEffect, useRef, ReactNode, MouseEvent as ReactMouseEvent, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Hls from 'hls.js';
import { FluidGlass } from "./components/FluidGlass";

function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: ReactMouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function VideoPlayer({ src, className }: { src: string, className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (src.endsWith('.m3u8')) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      }
    } else {
      video.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      loop
      muted
      playsInline
    />
  );
}

const HERO_VIDEO = "https://stream.mux.com/01yW6GoUz01OTXk5w1Rt1MHkJWlCGIwj46SUONJZ4DJUE.m3u8";

const FILM_ARCHIVE = [
  { id: 1, url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4", title: "Midnight Echo", tag: "NOIR" },
  { id: 2, url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_214311_24de0b75-7eaa-4f42-86d8-8c2014ca2851.mp4", title: "Neon Pulse", tag: "URBAN" },
  { id: 3, url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_105838_084968f2-4415-42a4-971a-3bec54539549.mp4", title: "Glass City", tag: "VISION" },
  { id: 4, url: "https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8", title: "Abstract Flow", tag: "STREAM" },
  { id: 5, url: "https://stream.mux.com/blULaJm2RMbAmsrwxLrBdgEx9yI1do2yM89vHTkdA6I.m3u8", title: "Vivid Dream", tag: "CINEMA" },
  { id: 6, url: "https://stream.mux.com/Si6ej2ZRrxRCnTYBXSScDRCdd7CGnyTqiPszZcw3z4I.m3u8", title: "Static Void", tag: "EXPERIMENTAL" },
  { id: 7, url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_101827_abebfeec-f243-466b-b494-7f6814c0fbbf.mp4", title: "Urban Ghost", tag: "STREET" },
  { id: 8, url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_182501_0216c2be-1b2f-40d3-8716-0d4f42e73b44.mp4", title: "Digital Bloom", tag: "MOTION" },
  { id: 9, url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4", title: "Shadow Play", tag: "DARK" },
  { id: 10, url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4", title: "Light Speed", tag: "KINETIC" },
  { id: 11, url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4", title: "Slow Burn", tag: "EDITORIAL" },
  { id: 12, url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4", title: "Chrome Heart", tag: "VOGUE" }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <div className="relative min-h-screen selection:bg-black selection:text-brand overflow-x-hidden cursor-none bg-black">
      <div className="film-grain" />
      
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Custom Cursor */}
      <motion.div 
        className="custom-cursor hidden md:block"
        animate={{ 
          x: mousePos.x - 10, 
          y: mousePos.y - 10,
          scale: isHovering ? 2 : 1
        }}
        transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.5 }}
      />
      <motion.div 
        className="custom-cursor-follower hidden md:block"
        animate={{ 
          x: mousePos.x - 20, 
          y: mousePos.y - 20,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200, mass: 0.8 }}
      />

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-20"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <VideoPlayer 
                src={selectedVideo} 
                className="w-full h-full object-contain"
              />
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-6 right-6 p-4 bg-brand text-black rounded-full hover:scale-110 transition-transform z-10"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 px-6 py-8 flex justify-between items-center bg-transparent mix-blend-difference">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl condensed font-bold tracking-tighter text-white"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          BRIQUSION <span className="font-light opacity-60">CINEMA</span>
        </motion.div>
        
        <div className="hidden md:flex gap-12 font-medium text-xs condensed text-white">
          {['Collections', 'Typography', 'Film', 'About'].map((item) => (
            <motion.a 
              key={item}
              href="#"
              whileHover={{ y: -2 }}
              className="hover:opacity-60 transition-opacity"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {item}
            </motion.a>
          ))}
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-50 md:hidden"
        >
          {isMenuOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-brand z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {['Collections', 'Typography', 'Film', 'About'].map((item) => (
              <a 
                key={item}
                href="#"
                onClick={() => setIsMenuOpen(false)}
                className="text-5xl condensed font-black text-black"
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 overflow-hidden bg-black">
          <div className="absolute inset-0 z-0 opacity-20">
            <VideoPlayer 
              src={HERO_VIDEO} 
              className="w-full h-full object-cover contrast-125"
            />
          </div>

          {/* 3D Fluid Glass Integration */}
          <div className="absolute inset-0 z-0">
             <Canvas
               camera={{ position: [0, 0, 5], fov: 45 }}
               dpr={[1, 2]}
               gl={{ antialias: true, alpha: true }}
             >
               <Suspense fallback={null}>
                 <ambientLight intensity={0.5} />
                 <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                 <pointLight position={[-10, -10, -10]} />
                 <FluidGlass 
                   mode="lens" 
                   lensProps={{
                     transmission: 1,
                     roughness: 0,
                     ior: 1.5,
                     chromaticAberration: 0.06,
                     thickness: 1,
                     anisotropy: 0.5
                   }} 
                 />
               </Suspense>
             </Canvas>
          </div>

          <motion.div 
            className="w-full max-w-7xl relative z-10"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="overflow-hidden py-10">
              <div className="flex justify-center flex-wrap gap-x-[1vw]">
                {"BRIQUSION".split("").map((char, index) => (
                  <motion.div
                    key={index}
                    className="overflow-hidden"
                  >
                    <motion.span
                      className="text-[20vw] md:text-[18vw] cinematic-text text-brand tracking-[-0.04em] inline-block"
                      initial={{ y: "100%", rotate: 10 }}
                      animate={{ y: 0, rotate: 0 }}
                      transition={{ 
                        duration: 1.2, 
                        delay: index * 0.05, 
                        ease: [0.22, 1, 0.36, 1] 
                      }}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      style={{ y: index % 2 === 0 ? y1 : y2 }}
                    >
                      {char}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-[-2vw] px-4 gap-8">
              <motion.div 
                className="max-w-xs space-y-4 text-white"
                variants={fadeIn}
              >
                <p className="text-xs uppercase tracking-widest font-semibold opacity-60">Introducing</p>
                <h2 className="text-4xl condensed leading-none">New Condensed Font For Modern Film</h2>
              </motion.div>

              <motion.div 
                className="flex items-center gap-4"
                variants={fadeIn}
              >
                <Magnetic>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-brand text-black rounded-full condensed font-bold hover:bg-white hover:text-black transition-all flex items-center gap-2 group cursor-pointer"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    Explore Specimen <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Magnetic>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="absolute bottom-12 flex flex-col items-center gap-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-40 text-brand">Scroll to Explore</span>
            <div className="w-px h-12 bg-brand/20" />
          </motion.div>
        </section>

        {/* Film Section */}
        <section className="py-32 px-6 bg-brand text-black border-y border-black/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] bg-black rounded-2xl overflow-hidden group border border-black/10 cursor-pointer"
              onClick={() => setSelectedVideo(FILM_ARCHIVE[0].url)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <VideoPlayer 
                src={FILM_ARCHIVE[0].url}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 bg-brand/90 backdrop-blur-md rounded-full flex items-center justify-center border border-black/20 group"
                >
                  <Play size={24} className="fill-black translate-x-0.5 group-hover:scale-110 transition-transform" />
                </motion.div>
              </div>
              <div className="absolute bottom-8 left-8 text-white">
                <span className="text-[10px] uppercase tracking-widest block mb-2 opacity-50 italic">Experimental Film</span>
                <p className="text-3xl condensed">The Geometry of Silence</p>
              </div>
            </motion.div>

            <div className="space-y-12">
              <motion.div 
                className="inline-block"
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <div className="text-[10vw] font-black leading-none condensed opacity-10 absolute -left-10 lg:-left-20 pointer-events-none">CINEMATIC</div>
                <h3 className="text-6xl md:text-8xl condensed leading-[0.85] relative z-10">
                  CINEMATIC<br />PRECISION.
                </h3>
              </motion.div>

              <motion.div 
                className="space-y-6 max-w-lg"
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <p className="text-lg font-light leading-relaxed opacity-80 serif italic">
                  Typography is the visual manifestation of voice. Briqusion was crafted to speak in the language of contemporary cinema—bold, condensed, and unapologetically modern.
                </p>
                <div className="h-px w-20 bg-black/20" />
                <div className="grid grid-cols-2 gap-8 text-xs font-medium condensed text-black/60">
                  <div className="space-y-2">
                    <p className="uppercase tracking-widest text-black/40">Visual Type</p>
                    <p>High Contrast Mono</p>
                  </div>
                  <div className="space-y-2">
                    <p className="uppercase tracking-widest text-black/40">Weight Range</p>
                    <p>Thin to Heavy Display</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Film Collection Grid - Masonry style feel with motion */}
        <section id="collections" className="py-32 px-6 bg-black text-brand">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.4em] opacity-40 italic">The Archive</p>
                <h3 className="text-6xl md:text-8xl condensed leading-none uppercase">FILM COLLECTION</h3>
              </div>
              <p className="text-xs uppercase condensed max-w-[200px] text-right opacity-60">A curated selection of experimental motion and visual fragments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FILM_ARCHIVE.map((video, index) => (
                <motion.div 
                  key={video.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  className={`relative bg-zinc-900 overflow-hidden group border border-white/5 cursor-pointer
                    ${index % 3 === 0 ? 'md:row-span-2' : ''}`}
                  onClick={() => setSelectedVideo(video.url)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <VideoPlayer 
                    src={video.url} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] condensed tracking-[0.2em] px-3 py-1 bg-brand text-black rounded font-bold">{video.tag}</span>
                    </div>
                    
                    <div className="space-y-1">
                       <p className="text-[9px] condensed opacity-40 italic font-medium uppercase text-white">Archive Fragment #{video.id}</p>
                       <h4 className="text-2xl condensed font-bold tracking-tight uppercase text-brand group-hover:translate-x-2 transition-transform duration-500">{video.title}</h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Awesome Grid Section */}
        <section className="py-32 px-6 bg-brand">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                className="aspect-square bg-black text-brand flex flex-col justify-between p-12 overflow-hidden relative group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 z-0">
                  <Canvas
                    camera={{ position: [0, 0, 5], fov: 45 }}
                    dpr={[1, 2]}
                  >
                    <Suspense fallback={null}>
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} />
                      <FluidGlass 
                        mode="cube"
                        cubeProps={{
                          transmission: 1,
                          roughness: 0,
                          ior: 1.3,
                          thickness: 2,
                          chromaticAberration: 0.1
                        }}
                      />
                    </Suspense>
                  </Canvas>
                </div>
                <div className="relative z-10">
                  <div className="text-xs uppercase tracking-[0.4em] font-semibold opacity-30">Concept 01</div>
                  <h4 className="text-[12vw] leading-none condensed font-black group-hover:scale-110 transition-transform duration-700">AWE</h4>
                </div>
                <div className="absolute right-[-10%] bottom-[-10%] opacity-10 group-hover:opacity-20 transition-opacity">
                   <Play size={300} className="fill-brand" />
                </div>
              </motion.div>

              <motion.div 
                className="aspect-[16/9] md:aspect-auto bg-black text-brand p-12 flex flex-col justify-end rounded-tr-[100px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-between items-start mb-8">
                   <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center">
                     <Camera size={20} className="text-black" />
                   </div>
                   <ArrowDownRight size={32} />
                </div>
                <p className="serif italic text-3xl leading-tight">Capturing the essence of modern motion through vertical geometry.</p>
              </motion.div>

              <motion.div 
                className="aspect-[16/9] md:aspect-auto bg-zinc-900 border border-black/5 order-last md:order-none rounded-bl-[100px] overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                 <VideoPlayer 
                   src={FILM_ARCHIVE[4].url} 
                   className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                 />
              </motion.div>

              <motion.div 
                className="aspect-square bg-black text-brand border border-black/10 flex flex-col justify-start p-12"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h4 className="text-[12vw] leading-none condensed font-black text-right">SOME</h4>
                <div className="mt-auto flex justify-between items-end">
                   <div className="space-y-1">
                     <div className="w-8 h-px bg-brand/40" />
                     <div className="w-12 h-px bg-brand/40" />
                     <div className="w-6 h-px bg-brand/40" />
                   </div>
                   <p className="text-[10px] uppercase tracking-widest opacity-40">Section 04 / Layout</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-48 px-6 text-center relative overflow-hidden bg-black text-brand">
          <div className="absolute inset-0 pointer-events-none opacity-5">
             <div className="text-[30vw] condensed font-black select-none whitespace-nowrap -translate-x-1/4">GREAT WORK GREAT WORK</div>
          </div>
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <h5 className="text-4xl md:text-7xl condensed leading-[0.9] tracking-tight">
                "THE ONLY WAY TO DO GREAT WORK IS TO LOVE WHAT YOU DO."
              </h5>
              <div className="flex flex-col items-center gap-4">
                <div className="w-px h-12 bg-brand/20" />
                <p className="text-xs uppercase tracking-[0.5em] font-bold opacity-60">Steve Jobs</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Character Map Section */}
        <section className="py-32 px-6 bg-brand text-black border-y border-black/10">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="w-full flex justify-between items-end mb-24">
               <div className="space-y-4">
                 <p className="text-xs font-bold uppercase tracking-widest opacity-40">Specimen</p>
                 <h6 className="text-6xl condensed leading-none uppercase">Alphabet<br />Characters</h6>
               </div>
               <div className="hidden md:block text-right">
                  <p className="text-8xl condensed font-black opacity-10">SPEC-01</p>
               </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-13 gap-y-12 w-full text-center">
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                <motion.div 
                  key={letter}
                  className="text-5xl md:text-6xl condensed font-bold hover:opacity-50 transition-opacity cursor-default"
                  whileHover={{ scale: 1.2, y: -5 }}
                >
                  {letter}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-40 px-6 text-center bg-black">
          <motion.div 
            className="max-w-3xl mx-auto space-y-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <h2 className="text-8xl md:text-[12vw] condensed font-black leading-none uppercase tracking-tighter text-brand">
              READY FOR<br />THE SHOW?
            </h2>
            <Magnetic>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-12 py-6 bg-brand text-black rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white transition-all flex items-center mx-auto gap-4 group cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                Acquire Type License <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </Magnetic>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 bg-black text-brand/40 border-t border-brand/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase font-bold tracking-[0.2em]">
          <p>© 2026 BRIQUSION COLLECTION. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-brand transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand transition-colors">Vimeo</a>
            <a href="#" className="hover:text-brand transition-colors">Fonts</a>
          </div>
          <p>EST. 1968 / TIME 1983</p>
        </div>
      </footer>
    </div>
  );
}
