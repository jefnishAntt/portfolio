"use client";
import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import * as THREE from "three";
import {
  Github,
  MoveRight,
  Activity,
  Cpu,
  ArrowRight,
  Linkedin,
  ExternalLink,
  ArrowUpRight,
  ImageIcon,
} from "lucide-react";

// --- Types ---
interface Project {
  id: string;
  title: string;
  year: string;
  desc: string;
  image: string;
  liveUrl: string;
  githubUrl: string;
}

// --- Data ---
const projects: Project[] = [
  {
    id: "MTH-01",
    title: "Aethelred",
    year: "2024",
    desc: "A data-governance platform utilizing recursive archival logic.",
    image: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80&w=800",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "MTH-02",
    title: "Omen Lab",
    year: "2025",
    desc: "Generative typography based on geometric distribution models.",
    image: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80&w=800",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "MTH-03",
    title: "Vanguard",
    year: "2026",
    desc: "A dashboard designed with Fibonacci-sequence spatial layouts.",
    image: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80&w=800",
    liveUrl: "#",
    githubUrl: "#",
  },
];

const currentYear = new Date().getFullYear();

// --- Components ---

function MathStructure() {
  const groupRef = useRef<THREE.Group>(null!);
  const lineRef = useRef<THREE.LineSegments>(null!);
  const mouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const nodeCount = 60;
  const radius = 2;

  const { points, lineGeometry } = useMemo(() => {
    const p: THREE.Vector3[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      p.push(new THREE.Vector3(x * radius, y * radius, z * radius));
    }

    const linePoints: THREE.Vector3[] = [];
    for (let i = 0; i < p.length; i++) {
      for (let j = i + 1; j < p.length; j++) {
        const dist = p[i].distanceTo(p[j]);
        if (dist < 1.2) linePoints.push(p[i], p[j]);
      }
    }

    return {
      points: p,
      lineGeometry: new THREE.BufferGeometry().setFromPoints(linePoints),
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const targetRotationX = mouse.current.y * 0.5;
    const targetRotationY = mouse.current.x * 0.5;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY + t * 0.1, 0.05);

    if (lineRef.current) {
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = 0.05 + Math.abs(Math.sin(t * 1.5)) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef} position={[3, 0, -2]}>
        {points.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial
              color="#fff"
              emissive="#c2a47a"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        ))}
        <lineSegments ref={lineRef} geometry={lineGeometry}>
          <lineBasicMaterial color="#c2a47a" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </lineSegments>
        <mesh>
          <sphereGeometry args={[radius * 0.8, 32, 32]} />
          <meshStandardMaterial color="#c2a47a" wireframe transparent opacity={0.08} />
        </mesh>
      </group>
    </Float>
  );
}

export default function RetroPortfolio() {
  const { scrollYProgress } = useScroll();
  const [activeImageId, setActiveImageId] = useState<string | null>(null);

  const smoothYProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const yTranslate = useTransform(smoothYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(smoothYProgress, [0, 0.15], [1, 0]);

  return (
    <main className="relative bg-[#e8e2d2] text-[#1a1815] selection:bg-[#c2a47a] selection:text-white overflow-x-hidden font-serif">
      {/* 1. FIXED CANVAS BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas shadows gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
          <color attach="background" args={["#e8e2d2"]} />
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#c2a47a" />
          <MathStructure />
          <fog attach="fog" args={["#e8e2d2", 8, 20]} />
        </Canvas>
      </div>

      {/* 2. TEXTURE OVERLAY */}
      <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

      {/* 3. NAVIGATION */}
      <nav className="fixed top-0 w-full p-6 md:p-10 flex justify-between items-start z-[110] pointer-events-none">
        <div className="pointer-events-auto">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-[11px] uppercase tracking-[0.6em] font-bold text-[#1a1815] hover:text-[#8c6b42] transition-colors"
          >
            JEFNISH
          </button>
        </div>

        <div className="flex flex-col items-end gap-6 pointer-events-auto">
          <div className="hidden md:flex gap-8 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
            {[
              { name: "About", id: "about-section" },
              { name: "Archive", id: "projects-section" },
              { name: "Connect", id: "contact-section" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
                className="group relative text-[#1a1815] transition-opacity hover:opacity-100 opacity-70"
              >
                <span className="text-[#8c6b42] mr-1">/</span>
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#1a1815] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5 bg-[#1a1815] text-[#e8e2d2] px-5 py-3 rounded-bl-xl shadow-2xl">
            <a href="#" className="hover:text-[#c2a47a] transition-all hover:scale-110">
              <Github size={16} strokeWidth={2.5} />
            </a>
            <a href="#" className="hover:text-[#c2a47a] transition-all hover:scale-110">
              <Linkedin size={16} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </nav>

      {/* 4. HERO SECTION */}
      {/* 4. HERO SECTION */}
<section className="relative h-screen flex flex-col items-center justify-center z-10 overflow-hidden">
  <motion.div
    style={{ y: yTranslate, opacity: heroOpacity }}
    className="relative flex flex-col items-center"
  >
    {/* Top Tagline with a "System Terminal" feel */}
    <div className="flex items-center gap-4 mb-8">
      <div className="h-[1px] w-8 bg-[#8c6b42] animate-scale-x" />
      <span className="font-mono text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-[#1a1815] font-bold">
        Creative Technologist <span className="text-[#8c6b42] opacity-50">//</span> 11.01°N
      </span>
      <div className="h-[1px] w-8 bg-[#8c6b42]" />
    </div>

    {/* Main Title with Layered Depth */}
    <div className="relative group">
      {/* Ghost Background Text (Moves with subtle hover) */}
      <motion.h1 
        className="text-[18vw] md:text-[14rem] font-bold tracking-tighter leading-none lowercase italic absolute top-1 left-1 text-[#8c6b42]/10 select-none blur-[2px]"
        animate={{ x: [0, 5, 0], y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        jefnish
      </motion.h1>

      {/* Main Foreground Text */}
      <h1 className="text-[18vw] md:text-[14rem] font-bold tracking-tighter leading-none lowercase italic relative text-[#1a1815] flex overflow-hidden">
        {"jefnish".split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 1,
              delay: i * 0.1,
              ease: [0.215, 0.61, 0.355, 1],
            }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </h1>
    </div>

    {/* Creative Floating Description */}
    <div className="mt-12 relative w-full max-w-2xl px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#1a1815]/10 pt-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col gap-2"
        >
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#8c6b42] font-bold">Location & Origin</span>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] leading-relaxed text-[#1a1815] font-medium">
            Based in Tamil Nadu, India. <br />
            Crafting digital lore.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col gap-2 text-right md:text-left"
        >
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#8c6b42] font-bold">Core Philosophies</span>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] leading-relaxed text-[#1a1815] font-medium">
            Interactive Design <br />
            Recursive AI Systems
          </p>
        </motion.div>
      </div>

      {/* Center status bracket replacing the asterisk */}
      <motion.div 
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2"
      >
        <span className="text-[#8c6b42] font-mono text-[10px]">[</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold">System Online</span>
        <span className="text-[#8c6b42] font-mono text-[10px]">]</span>
      </motion.div>
    </div>
  </motion.div>

  {/* Refined Scroll Indicator */}
  <div className="absolute bottom-10 flex flex-col items-center gap-4">
    <div className="relative h-16 w-[1px] bg-[#1a1815]/10 overflow-hidden">
      <motion.div 
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="h-1/2 w-full bg-[#8c6b42]"
      />
    </div>
    <span className="font-mono text-[9px] uppercase tracking-[0.5em] font-bold opacity-40">
      Initiate Scroll
    </span>
  </div>
</section>

      {/* 5. ABOUT SECTION */}
      <section id="about-section" className="relative min-h-screen py-32 px-6 md:px-20 z-10 border-t border-[#1a1815]/10 bg-[#e8e2d2]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-1 hidden lg:flex flex-col justify-between py-4 border-r border-[#1a1815]/10">
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] rotate-90 origin-left translate-x-4 whitespace-nowrap font-bold opacity-60">
              Bio_Metric // 2026
            </span>
            <div className="w-2.5 h-2.5 bg-[#8c6b42] rounded-full mx-auto" />
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-4 mb-12">
              <span className="font-mono text-[12px] uppercase tracking-[0.3em] text-[#8c6b42] font-bold">
                01 // Identity
              </span>
              <h2 className="text-7xl md:text-9xl font-bold italic tracking-tighter text-[#1a1815]">
                About me
              </h2>
            </div>

            <div className="space-y-12">
              <p className="text-3xl md:text-4xl font-medium leading-tight tracking-tight text-[#1a1815]">
                Architecting <span className="text-[#8c6b42] font-bold">digital interfaces</span> where
                complex logic meets human-centric motion.
              </p>

              <p className="text-lg md:text-xl text-[#1a1815] italic border-l-4 border-[#8c6b42] pl-8 max-w-2xl leading-relaxed opacity-90">
                "I translate the silence of a blank page into the rhythm of
                functional code. Focusing on the React ecosystem and the tactile
                feel of high-performance animation."
              </p>

              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#1a1815] font-bold mb-8 opacity-60">
                  Applied Toolset
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6">
                  {["ReactJS", "TypeScript", "Three.js", "Python", "Java", "Tailwind"].map((tech) => (
                    <div key={tech} className="flex items-center gap-3 group">
                      <div className="w-1.5 h-1.5 bg-[#8c6b42] group-hover:scale-[2.5] transition-transform" />
                      <span className="font-mono text-xs uppercase tracking-widest font-bold text-[#1a1815]">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center">
            <motion.div
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="bg-[#1a1815] text-[#e8e2d2] p-10 rotate-2 shadow-2xl transition-transform"
            >
              <div className="flex items-center gap-3 mb-6 opacity-70">
                <Activity size={16} className="text-[#c2a47a]" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                  System Status
                </span>
              </div>
              <p className="text-2xl italic mb-6 font-medium">
                "Design is not just what it looks like, but how it works."
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-60 leading-loose font-bold">
                Current Focus: <br />
                Generative UI & <br />
                Recursive Systems
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. PROJECTS SECTION */}
      <section id="projects-section" className="relative min-h-screen py-32 px-6 md:px-20 z-10 border-t border-[#1a1815]/10 bg-[#e8e2d2]">
        <div className="max-w-7xl mx-auto mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[2px] bg-[#8c6b42]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.5em] text-[#8c6b42] font-bold">
              Selected Archive
            </span>
          </div>
          <h2 className="text-6xl md:text-8xl font-bold italic tracking-tighter text-[#1a1815]">
            The Projects
          </h2>
        </div>

        <div className="max-w-7xl mx-auto border-t-2 border-[#1a1815]/10">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative border-b border-[#1a1815]/10 py-12 md:py-16 flex flex-col md:grid md:grid-cols-12 items-center gap-8"
            >
              <div className="md:col-span-1 font-mono text-[11px] text-[#8c6b42] font-bold">
                {project.id}
              </div>

              <div className="md:col-span-5 flex items-center gap-6">
                <h3 className="text-5xl md:text-6xl font-serif italic text-[#1a1815] group-hover:text-[#8c6b42] transition-colors duration-500 font-medium">
                  {project.title}
                </h3>
                
                <div 
                  className="relative cursor-help"
                  onMouseEnter={() => setActiveImageId(project.id)}
                  onMouseLeave={() => setActiveImageId(null)}
                >
                  <div className="p-3 rounded-full border-2 border-[#1a1815]/20 bg-[#e8e2d2] hover:bg-[#1a1815] hover:text-[#e8e2d2] transition-all duration-300">
                    <ImageIcon size={18} strokeWidth={2} />
                  </div>

                  <AnimatePresence>
                    {activeImageId === project.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: -10, scale: 1 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-0 mb-4 z-[100] pointer-events-none"
                      >
                        <div className="w-48 h-64 md:w-64 md:h-80 bg-white p-2 shadow-2xl">
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="md:col-span-4">
                <p className="text-base text-[#1a1815] max-w-sm font-medium leading-relaxed">
                  {project.desc}
                </p>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 w-full">
                <a href={project.githubUrl} className="w-12 h-12 flex items-center justify-center border-2 border-[#1a1815]/10 rounded-full hover:bg-black hover:text-white transition-all">
                  <Github size={20} />
                </a>
                <a href={project.liveUrl} className="w-12 h-12 flex items-center justify-center bg-[#8c6b42] text-white rounded-full hover:bg-[#1a1815] transition-all">
                  <MoveRight size={22} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CONTACT SECTION */}
      <footer id="contact-section" className="relative min-h-screen flex flex-col justify-between py-20 px-6 md:px-20 z-10 border-t border-[#1a1815]/10 bg-[#e8e2d2]">
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 border-b border-[#1a1815]/10">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">Index // 04</span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#1a1815]">End of File</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">Timestamp</span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#1a1815]">{new Date().toLocaleDateString("en-GB")}</span>
          </div>
          <div className="hidden md:flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#1a1815]">Active for hire</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">Location</span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#1a1815] text-right">Tamil Nadu, IN</span>
          </div>
        </div>

        <div className="text-center relative py-20">
          <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-[0.03] select-none">
            <span className="text-[22vw] font-black uppercase tracking-tighter">Connect</span>
          </div>
          <motion.span className="font-mono text-[12px] uppercase tracking-[1em] mb-12 block font-bold text-[#8c6b42]">
            Let's build something legacy
          </motion.span>
          <div className="relative inline-block group">
            <a href="mailto:jefnish@folio.dev" className="text-[12vw] md:text-[9vw] font-bold tracking-tighter leading-none hover:italic transition-all duration-700 block text-[#1a1815]">
              jefnish<span className="text-[#8c6b42]">@</span>folio.dev
            </a>
            <motion.div whileHover={{ scale: 1.1, rotate: 15 }} className="absolute -top-12 -right-8 md:-top-16 md:-right-20 w-24 h-24 md:w-32 md:h-32 bg-[#1a1815] text-[#e8e2d2] rounded-full flex flex-col items-center justify-center shadow-2xl cursor-pointer">
              <ArrowRight size={32} className="-rotate-45" />
              <span className="font-mono text-[10px] uppercase font-bold mt-2">Inquire</span>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end pt-16 border-t border-[#1a1815]/10">
          <div className="flex flex-col gap-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] font-bold opacity-50">Social Archives</span>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {["LinkedIn", "GitHub", "Twitter", "CV"].map((link) => (
                <a key={link} href="#" className="group flex items-center gap-1 font-mono text-[12px] uppercase tracking-widest text-[#1a1815] font-bold hover:text-[#8c6b42] transition-colors">
                  <span>{link}</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center opacity-70">
            <div className="w-10 h-10 border-2 border-[#1a1815]/20 rounded-full flex items-center justify-center mb-4">
              <Cpu size={18} className="text-[#8c6b42]" />
            </div>
            <p className="text-[10px] text-center uppercase tracking-[0.2em] font-bold font-mono">
              Crafted with R3F & Framer <br /> v.2026.11
            </p>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-widest font-bold text-[#1a1815]">© {currentYear} JEFNISH</span>
            <span className="font-mono text-[9px] opacity-60 uppercase font-bold tracking-tighter text-right">Architecture & Design Collective</span>
          </div>
        </div>
      </footer>
    </main>
  );
}