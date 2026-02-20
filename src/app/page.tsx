"use client";
import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
  Cpu,
  Linkedin,
  ArrowUpRight,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";

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

const projects: Project[] = [
  {
    id: "LIB-01",
    title: "Aethelred",
    year: "2024",
    desc: "A data-governance platform utilizing recursive archival logic.",
    image: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80&w=800",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "LIB-02",
    title: "Omen Lab",
    year: "2025",
    desc: "Generative typography based on geometric distribution models.",
    image: "https://images.unsplash.com/photo-1544391496-1ca7c97457cd?auto=format&fit=crop&q=80&w=800",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "LIB-03",
    title: "Vanguard",
    year: "2026",
    desc: "A dashboard designed with Fibonacci-sequence spatial layouts.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    liveUrl: "#",
    githubUrl: "#",
  },
];

// --- Components ---

function MathStructure() {
  const groupRef = useRef<THREE.Group>(null!);
  const lineRef = useRef<THREE.LineSegments>(null!);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { width } = useThree((state) => state.viewport);
  
  // Responsive scaling for the 3D model
  const responsiveScale = width < 7 ? 0.7 : 1;
  const responsivePosition: [number, number, number] = width < 7 ? [0, 0, -1] : [3, 0.1, -2];

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const nodeCount = 60;
  const radius = 2 * responsiveScale;

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
        if (dist < 1.2 * responsiveScale) linePoints.push(p[i], p[j]);
      }
    }

    return {
      points: p,
      lineGeometry: new THREE.BufferGeometry().setFromPoints(linePoints),
    };
  }, [responsiveScale]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.current.y * 0.5, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.current.x * 0.5 + t * 0.1, 0.05);

    if (lineRef.current) {
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = 0.05 + Math.abs(Math.sin(t * 1.5)) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef} position={responsivePosition}>
        {points.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#fff" emissive="#c2a47a" emissiveIntensity={2} toneMapped={false} />
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

  const smoothYProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const yTranslate = useTransform(smoothYProgress, [0, 0.2], [0, -50]);
  const heroOpacity = useTransform(smoothYProgress, [0, 0.15], [1, 0]);

  return (
    <main className="relative bg-[#e8e2d2] text-[#1a1815] selection:bg-[#c2a47a] selection:text-white overflow-x-hidden font-serif">
      
      {/* 1. CANVAS BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas shadows gl={{ antialias: true }} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
          <color attach="background" args={["#e8e2d2"]} />
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#c2a47a" />
          <MathStructure />
          <fog attach="fog" args={["#e8e2d2", 8, 20]} />
        </Canvas>
      </div>

      {/* 2. VELLUM TEXTURE */}
      <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.06] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />

      {/* 3. NAVIGATION */}
      <nav className="fixed top-0 w-full p-6 md:p-12 flex flex-row justify-between items-start z-[110] pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.8em] font-bold text-[#1a1815] group"
          >
            JEFNISH
            <span className="block h-[1px] w-0 bg-[#8c6b42] group-hover:w-full transition-all duration-500" />
          </button>
        </div>
        
        <div className="flex flex-col items-end gap-4 md:gap-8 pointer-events-auto">
          <div className="hidden sm:flex gap-6 md:gap-10 font-mono text-[10px] uppercase tracking-[0.4em] font-bold opacity-70">
            {["About", "Projects", "Connect"].map((name) => (
              <Link key={name} href={`#${name.toLowerCase()}-section`} className="hover:text-[#8c6b42] transition-colors">
                /{name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 md:gap-5 bg-[#1a1815] text-[#e8e2d2] px-4 py-2 md:px-5 md:py-3 rounded-bl-xl shadow-2xl">
            <a href="#" className="hover:text-[#c2a47a] transition-all hover:scale-110"><Github size={14} /></a>
            <a href="#" className="hover:text-[#c2a47a] transition-all hover:scale-110"><Linkedin size={14} /></a>
          </div>
        </div>
      </nav>

      {/* 4. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center z-10 px-6">
        <motion.div style={{ y: yTranslate, opacity: heroOpacity }} className="text-center w-full max-w-5xl">
          <div className="mb-6 md:mb-8 flex items-center justify-center gap-3 md:gap-4 opacity-60">
            <div className="h-[1px] w-4 md:w-8 bg-[#1a1815]" />
            <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-bold italic">
              Hey there, This is
            </span>
            <div className="h-[1px] w-4 md:w-8 bg-[#1a1815]" />
          </div>

          <h1 className="text-[22vw] md:text-[13rem] font-medium tracking-tighter leading-[0.8] lowercase italic text-[#1a1815]">
            jefnish
          </h1>

          <div className="mt-8 md:mt-12 max-w-2xl mx-auto border-t border-[#1a1815]/10 pt-6 md:pt-8">
             <p className="font-serif italic leading-relaxed text-[#1a1815]/80">
              I am a Software Engineer based in Tamil Nadu, India, who is
              fascinated by{" "}
              <span className="text-[#8c6b42]">
                large-scale, high-impact products,
              </span>{" "}
              smooth user experiences, and the philosophy behind them.
            </p>
          </div>
        </motion.div>

        <div className="absolute bottom-8 md:bottom-12 flex flex-col items-center gap-4 opacity-40">
          <div className="w-px h-12 md:h-16 bg-gradient-to-b from-[#1a1815] to-transparent" />
          <span className="font-mono text-[8px] uppercase tracking-[0.5em] md:tracking-[1em]">Scroll</span>
        </div>
      </section>

      {/* 5. ABOUT SECTION */}
      <section id="about-section" className="relative min-h-screen py-20 md:py-32 px-6 md:px-20 z-10 border-t border-[#1a1815]/10 bg-[#e8e2d2]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          <div className="lg:col-span-8">
            <div className="space-y-3 mb-8 md:mb-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8c6b42] font-bold">01 // About Me</span>
              <h2 className="text-4xl md:text-6xl font-medium italic tracking-tighter text-[#1a1815]">Capability</h2>
            </div>

            <div className="space-y-8 md:space-y-12">
              <p className="text-lg md:text-xl font-medium leading-relaxed italic text-[#1a1815]">
                Developing high-performance interfaces where <span className="text-[#8c6b42]">mathematical precision</span> meets fluid user experience.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-[#1a1815]/80">
                <p className="text-sm md:text-base leading-relaxed">
                  I specialize in building scalable frontend architectures using the React ecosystem and 3D web technologies.
                </p>
                <p className="text-sm md:text-base leading-relaxed">
                  My approach is rooted in technical rigor—ensuring performance standards across all platforms.
                </p>
              </div>

              <div>
                <h4 className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#1a1815] font-bold mb-6 opacity-40 border-b border-[#1a1815]/10 pb-2">Technical Stack</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 md:gap-y-6">
                  {["React / Next.js", "TypeScript", "Three.js", "Python", "Tailwind", "GLSL"].map((tech) => (
                    <div key={tech} className="flex items-center gap-3 group">
                      <div className="w-1 h-1 bg-[#8c6b42] group-hover:w-2 transition-all" />
                      <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-bold">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 mt-10 lg:mt-24">
            <div className="bg-[#1a1815] text-[#e8e2d2] p-8 md:p-10 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 opacity-50">
                <Cpu size={14} className="text-[#c2a47a]" />
                <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Philosophy</span>
              </div>
              <p className="text-lg md:text-xl italic mb-8 font-medium leading-snug">"Code is the foundation of the visual experience."</p>
              <div className="space-y-4 opacity-60 text-[9px] font-mono uppercase tracking-widest">
                <div className="border-t border-white/10 pt-4">Primary Focus: <span className="text-[#c2a47a]">DSA</span></div>
                <div>Secondary Focus: <span className="text-[#c2a47a]">Optimization</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROJECTS */}
      <section id="projects-section" className="relative bg-[#e8e2d2] py-20 md:py-32 px-6 md:px-24 z-10">
        <div className="max-w-6xl mx-auto mb-10 md:mb-16 border-b border-[#1a1815]/20 pb-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8c6b42] font-bold block mb-2">02 // Projects</span>
          <h2 className="text-4xl md:text-6xl italic font-medium tracking-tighter text-[#1a1815]">Digital LAB</h2>
        </div>

        <div className="max-w-6xl mx-auto">
          {projects.map((project) => (
            <div key={project.id} className="group relative py-8 md:py-12 border-b border-[#1a1815]/10 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-4">
              <span className="md:col-span-1 font-mono text-[10px] font-bold text-[#8c6b42]">{project.id}</span>

              <div className="md:col-span-6 flex items-center gap-4">
                <h3 className="text-3xl md:text-5xl italic group-hover:translate-x-2 transition-transform duration-500">{project.title}</h3>
                <button 
                  className="hidden md:block p-2 rounded-full border border-[#1a1815]/20 hover:bg-[#1a1815] hover:text-[#e8e2d2] transition-all"
                  onMouseEnter={() => setActiveImageId(project.id)}
                  onMouseLeave={() => setActiveImageId(null)}
                >
                  <ImageIcon size={14} />
                </button>
              </div>

              <p className="md:col-span-3 text-sm opacity-70 italic">{project.desc}</p>

              <div className="md:col-span-2 flex justify-end items-center gap-3 w-full md:w-auto">
                <a href={project.githubUrl} className="p-2 rounded-full border border-[#1a1815]/10 hover:bg-[#1a1815]/5 transition-all"><Github size={16} /></a>
                <a href={project.liveUrl} className="p-2 rounded-full bg-[#1a1815] text-[#e8e2d2] hover:bg-[#8c6b42] transition-all"><ArrowUpRight size={16} /></a>
              </div>

              {/* Responsive Image Preview (Desktop Only) */}
              <AnimatePresence>
                {activeImageId === project.id && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0 }}
                    className="hidden lg:block absolute left-1/2 top-0 z-[120] pointer-events-none"
                  >
                    <div className="bg-[#e8e2d2] p-2 shadow-2xl border border-[#1a1815]/10">
                      <img src={project.image} alt={project.title} className="w-48 h-64 object-cover grayscale" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer id="connect-section" className="relative py-20 md:py-24 px-6 md:px-24 z-10 bg-[#1a1815] text-[#e8e2d2]">
        <div className="max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-16 md:gap-20">
          <div className="space-y-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] opacity-50 block">Contact</span>
            <a href="mailto:jefnish@folio.dev" className="text-3xl md:text-5xl font-serif italic hover:text-[#c2a47a] transition-colors break-words">
              jefnish007@gmail.com
            </a>
            <div className="flex flex-wrap gap-6 md:gap-10 font-mono text-[10px] uppercase tracking-widest pt-6">
              <span className="hover:text-[#c2a47a] cursor-pointer transition-colors">LinkedIn</span>
              <span className="hover:text-[#c2a47a] cursor-pointer transition-colors">GitHub</span>
              <span className="hover:text-[#c2a47a] cursor-pointer transition-colors">Archive</span>
            </div>
          </div>
          <div className="flex flex-col justify-end md:items-end opacity-40 text-left md:text-right">
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest leading-loose">
              Architecting Digital Artifacts<br />
              Tamil Nadu, India / 2026<br />
              All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}