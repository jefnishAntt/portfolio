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
  ArrowUpRight,
  ImageIcon,
  Heart,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { PROJECTS, EXPERIENCE, EDUCATION, SKILLS, SOCIAL_LINKS } from "@/config";


// --- Components ---

function MathStructure() {
  const groupRef = useRef<THREE.Group>(null!);
  const lineRef = useRef<THREE.LineSegments>(null!);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { width } = useThree((state) => state.viewport);

  // Responsive scaling for the 3D model
  const responsiveScale = width < 7 ? 0.7 : 1;
  const responsivePosition: [number, number, number] = width < 7 ? [0, 0, -1] : [-3, 0.1, -2];

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

export default function Portfolio() {
  const { scrollYProgress } = useScroll();
  const [activeImageId, setActiveImageId] = useState<string | null>(null);

  const smoothYProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const yTranslate = useTransform(smoothYProgress, [0, 0.2], [0, -50]);
  const heroOpacity = useTransform(smoothYProgress, [0, 0.15], [1, 0]);

  return (
    <>
      <Header />
      <main className="relative pt-16 md:pt-20 selection:bg-[#c2a47a] selection:text-white overflow-x-hidden font-sans">

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
        <div className="fixed inset-0 z-100 pointer-events-none opacity-[0.06] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />

        {/* 3. HERO SECTION */}
        <section className="relative -mt-16 md:-mt-20 min-h-screen flex items-center z-10 px-6 md:px-12 lg:px-20">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
            <div aria-hidden className="hidden lg:block" />

            <motion.div
              style={{ y: yTranslate, opacity: heroOpacity }}
              className="w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto text-center lg:text-left"
            >
              <div className="mb-6 md:mb-8 flex items-center justify-center lg:justify-start gap-3 md:gap-4 opacity-60">
                <div className="h-px w-4 md:w-8 bg-[#1a1815]" />
                <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] md:tracking-[0.35em] font-bold">
                  Hey there, this is
                </span>
              </div>

              <h1 className="font-display text-[20vw] sm:text-8xl md:text-9xl lg:text-[6.5rem] xl:text-[7.5rem] font-bold tracking-tighter leading-[0.85] lowercase text-[#1a1815]">
                jefnish
              </h1>

              <div className="mt-4 md:mt-5">
                <p className="text-base md:text-lg leading-relaxed text-[#1a1815]/80">
                  I&apos;m a full-stack engineer based in Tamil Nadu, India. I build with{" "}
                  <span className="text-[#8c6b42] font-medium">
                    React, Next.js, TypeScript, Rust, and Python
                  </span>
                  {" "}— everything from high-throughput systems to my own LLM/RAG side project. Off the clock, I&apos;m doing calisthenics, lost in poetry or a sci-fi novel, or working through a self-help book.
                </p>
                <a
                  href="#connect-section"
                  className="group inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] uppercase tracking-[0.25em] font-bold text-[#8c6b42] hover:text-[#1a1815] transition-colors"
                >
                  Say hi
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
            <div className="w-px h-12 md:h-16 bg-gradient-to-b from-[#1a1815] to-transparent" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] md:tracking-[0.4em]">Scroll</span>
          </div>
        </section>

        {/* 4. ABOUT SECTION */}
        <section id="about-section" className="relative min-h-screen py-20 md:py-32 px-6 md:px-20 z-10 border-t border-[#1a1815]/10 bg-[#e8e2d2]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            <div className="lg:col-span-8">
              <div className="space-y-3 mb-8 md:mb-12">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">/ about me</span>
                <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-[#1a1815]">Capability</h2>
              </div>

              <div className="space-y-8 md:space-y-12">
                <p className="text-lg md:text-xl font-medium leading-relaxed text-[#1a1815]">
                  I&apos;m currently a Frontend Developer at Haddy Designs, where I own <span className="text-secondary">systems end-to-end — API design, database schema, deployment, and production support</span>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-[#1a1815]/80">
                  <p className="text-sm md:text-base leading-relaxed">
                    I build and scale web and desktop applications with React, Next.js, TypeScript, Rust, and Python, deployed and monitored on AWS (Amplify, Route 53, RDS).
                  </p>
                  <p className="text-sm md:text-base leading-relaxed">
                    On the side, I&apos;m building a self-directed LLM/RAG pipeline for natural-language Q&amp;A over documents.
                  </p>
                </div>

                <div className="space-y-5">
                  {SKILLS.map((category) => (
                    <div key={category.name} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                      <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#1a1815] font-bold opacity-50 sm:w-40 shrink-0">{category.name}</h4>
                      <div className="flex flex-wrap items-center gap-y-1.5">
                        {category.items.map((tech, i) => (
                          <span key={tech} className="flex items-center">
                            <span className="font-mono text-[10px] uppercase tracking-wide font-bold text-[#1a1815]/70">
                              {tech}
                            </span>
                            {i < category.items.length - 1 && (
                              <span className="mx-2 text-[#1a1815]/25">/</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm md:text-base leading-relaxed text-[#1a1815]/80">
                  Outside of work, I&apos;m into calisthenics, poetry, sci-fi novels, and self-help books.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 mt-10 lg:mt-24">
              <div className="bg-[#1a1815] text-[#e8e2d2] p-8 md:p-10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 opacity-50">
                  <Cpu size={14} className="text-[#c2a47a]" />
                  <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Philosophy</span>
                </div>
                <p className="text-lg md:text-xl mb-8 font-medium leading-snug">"Better a fool for five minutes than a fool for life."</p>
                <div className="space-y-4 opacity-60 text-[9px] font-mono uppercase tracking-widest">
                  <div className="border-t border-white/10 pt-4">Primary Focus: <span className="text-[#c2a47a]">DSA</span></div>
                  <div>Secondary Focus: <span className="text-[#c2a47a]">AI</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. EXPERIENCE */}
        <section id="experience-section" className="relative bg-[#e8e2d2] py-20 md:py-32 px-6 md:px-24 z-10 border-t border-[#1a1815]/10">
          <div className="max-w-6xl mx-auto mb-10 md:mb-16 border-b border-[#1a1815]/20 pb-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary font-bold block mb-2">/ experience</span>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-[#1a1815]">Track Record</h2>
          </div>

          <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
            {EXPERIENCE.map((job) => (
              <div key={job.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                <div className="md:col-span-4">
                  <h3 className="font-display text-2xl md:text-3xl font-semibold text-[#1a1815]">{job.role}</h3>
                  <p className="text-sm md:text-base font-medium text-secondary mt-1">{job.company}</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest opacity-50 mt-3">{job.duration}</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest opacity-50">{job.location}</p>
                </div>
                <ul className="md:col-span-8 space-y-4">
                  {job.points.map((point, idx) => (
                    <li key={idx} className="text-sm md:text-base leading-relaxed text-[#1a1815]/80 pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-secondary">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 6. PROJECTS */}
        <section id="projects-section" className="relative bg-[#e8e2d2] py-20 md:py-32 px-6 md:px-24 z-10">
          <div className="max-w-6xl mx-auto mb-10 md:mb-16 border-b border-[#1a1815]/20 pb-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary font-bold block mb-2">/ projects</span>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-[#1a1815]">Digital LAB</h2>
          </div>

          <div className="max-w-6xl mx-auto">
            {PROJECTS.map((project) => (
              <div key={project.id} className="group relative py-8 md:py-12 border-b border-[#1a1815]/10 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-4">
                <span className="md:col-span-1 font-mono text-[10px] font-bold text-secondary">{project.id}</span>

                <div className="md:col-span-6 flex items-center gap-4">
                  <h3 className="font-display text-3xl md:text-5xl font-semibold group-hover:translate-x-2 transition-transform duration-500">{project.title}</h3>
                  <button
                    className="hidden md:block p-2 rounded-full border border-[#1a1815]/20 hover:bg-[#1a1815] hover:text-[#e8e2d2] transition-all"
                    onMouseEnter={() => setActiveImageId(project.id)}
                    onMouseLeave={() => setActiveImageId(null)}
                  >
                    <ImageIcon size={14} />
                  </button>
                </div>

                <p className="md:col-span-3 text-sm leading-relaxed opacity-70">{project.desc}</p>

                <div className="md:col-span-2 flex justify-end items-center gap-3 w-full md:w-auto">
                  <a href={project.githubUrl} className="p-2 rounded-full border border-[#1a1815]/10 hover:bg-[#1a1815]/5 transition-all"><Github size={16} /></a>
                  <a href={project.liveUrl} className="p-2 rounded-full bg-[#1a1815] text-[#e8e2d2] hover:bg-secondary transition-all"><ArrowUpRight size={16} /></a>
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

        {/* 7. EDUCATION */}
        <section id="education-section" className="relative bg-[#e8e2d2] py-20 md:py-32 px-6 md:px-24 z-10 border-t border-[#1a1815]/10">
          <div className="max-w-6xl mx-auto mb-10 md:mb-16 border-b border-[#1a1815]/20 pb-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary font-bold block mb-2">/ education</span>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-[#1a1815]">Foundations</h2>
          </div>

          <div className="max-w-6xl mx-auto space-y-10 md:space-y-14">
            {EDUCATION.map((edu) => (
              <div key={edu.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                <div className="md:col-span-4">
                  <p className="font-mono text-[9px] uppercase tracking-widest opacity-50 mt-1">{edu.duration}</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest opacity-50">{edu.location}</p>
                </div>
                <div className="md:col-span-8">
                  <h3 className="font-display text-xl md:text-2xl font-semibold text-[#1a1815]">{edu.degree}</h3>
                  <p className="text-sm md:text-base font-medium text-secondary mt-1">{edu.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. FOOTER */}
        <footer id="connect-section" className="relative py-16 md:py-20 px-6 z-10 bg-primary text-primary border-t border-[#1a1815]/10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="mt-12 font-mono text-[9px] uppercase tracking-widest opacity-40">
              Designed &amp; built by Jefnish · Tamil Nadu, India · 2026
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}


// sub components

const Header = () => {
  const { scrollYProgress } = useScroll();
  const showLine = useTransform(scrollYProgress, [0, 0.02], [0, 1]);
  const smoothLine = useSpring(showLine, { stiffness: 120, damping: 24 });

  return (
    <header className="fixed top-0 bg-primary w-full px-6 md:px-12 h-14 md:h-16 flex flex-row justify-between items-center z-110 pointer-events-none">
      <div className="pointer-events-auto">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-[#1a1815] group"
        >
          JEFNISH
          <span className="block h-px w-0 bg-border-primary group-hover:w-full transition-all duration-500" />
        </button>
      </div>

      <div className="flex items-center gap-4 pointer-events-auto">
        <nav className="hidden sm:flex gap-4 font-mono text-[10px] md:tracking-[0.25em] tracking-[0.15em] uppercase font-bold opacity-90">
          {["About", "Experience", "Projects", "Education", "Connect"].map((name, index) => (
            <div key={name} className="flex items-center gap-4">
              {/* Render the slash before every item EXCEPT the first one */}
              {index > 0 && <span className="text-gray-400 pointer-events-none">/</span>}

              <Link href={`#${name.toLowerCase()}-section`} className="hover:text-[#8c6b42] transition-colors">
                {name}
              </Link>
            </div>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3 md:gap-4 bg-[#1a1815] text-[#e8e2d2] px-3 py-1 md:px-4 md:py-2 rounded-bl-xl shadow-2xl">
        {SOCIAL_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#c2a47a] transition-all hover:scale-110"
            >
              <Icon size={14} />
            </a>
          );
        })}
        <a
          href="mailto:jefnish007@gmail.com"
          className="hover:text-[#c2a47a] transition-all hover:scale-110"
        >
          <Mail size={14} />
        </a>
      </div>

      {/* Scroll-triggered bottom border that grows from center */}
      <motion.div className="absolute left-0 right-0 bottom-0 h-px pointer-events-none overflow-hidden">
        <motion.span
          style={{ scaleX: smoothLine }}
          className="block h-px bg-border-secondary origin-center w-full"
        />
      </motion.div>
    </header>
  );
}
