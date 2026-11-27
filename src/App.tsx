import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { PERSONAL_INFO, PROJECTS, EXPERIENCES, SKILL_CATEGORIES } from './data/portfolioData';
import type { Project } from './data/portfolioData';
import { STORY, STORY_LINES, PROLOGUE } from './data/story';
import type { StoryCase, MiniKind, Choice } from './data/story';
import { narrator } from './narrator';
import { GithubIcon, LinkedinIcon } from './components/Icons';
import { InkDefs, Wanderer, Mountains, Cloud, SpeedLines, InkEdge, Pillar, PanelArt } from './components/Ink';
import { ArrowUpRight, Mail, Phone, FileText, X, Download, Volume2, VolumeX, Bot, Lock, Search, Hourglass, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = (n: number) => String(n).padStart(2, '0');

/* ---------- text helpers ---------- */
function Words({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`words ${className}`} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span className="w" key={i} aria-hidden="true">
          <span>{w}&nbsp;</span>
        </span>
      ))}
    </span>
  );
}
function Chars({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((c, i) => (
        <span className="cw" key={i} aria-hidden="true">
          <span className="ch">{c === ' ' ? ' ' : c}</span>
        </span>
      ))}
    </span>
  );
}
function Caption({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`caption ${className}`}>{children}</div>;
}
function ActLabel({ act, name, light = false }: { act: string; name: string; light?: boolean }) {
  return (
    <div className={`act-label ${light ? 'light' : ''}`}>
      <span className="seal-sm">{act}</span>
      <span className="act-line" />
      <span>{name}</span>
    </div>
  );
}

/* ---------- problem mini-scenes (pure CSS loops) ---------- */
function Mini({ kind }: { kind: MiniKind }) {
  return (
    <div className={`mini mini-${kind}`} aria-hidden="true">
      {kind === 'glitch' && (
        <>
          <div className="bubble">
            <span className="g1">Dose: 5,000 mg daily.</span>
            <span className="g2">Dose: 5,000 mg daily.</span>
          </div>
          <span className="q q1">?</span>
          <span className="q q2">?</span>
          <span className="q q3">!</span>
        </>
      )}
      {kind === 'pile' && (
        <>
          <div className="papers">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} style={{ animationDelay: `${i * 0.35}s` }} />
            ))}
          </div>
          <Clock className="clock" />
        </>
      )}
      {kind === 'collide' && (
        <>
          <div className="slot">SAT · 3:00 PM</div>
          <div className="bk a">Ali</div>
          <div className="bk b">Sara</div>
          <span className="boom">✕</span>
        </>
      )}
      {kind === 'pingpong' && (
        <>
          <span className="pp-dot l" />
          <span className="pp-dot r" />
          <span className="env">✉</span>
          <span className="re">Re: Re: Re: Re:</span>
        </>
      )}
      {kind === 'locked' && (
        <>
          <Bot className="bot" />
          <Lock className="lock" />
        </>
      )}
      {kind === 'messy' && (
        <>
          <div className="sheet">
            {['42', 'N/A', '#REF!', '??', '3,1O', '', '7', 'null', 'abc', '#DIV/0', '12', '—'].map((v, k) => (
              <span key={k} className={/[#?a-z]/i.test(v) || v === '' ? 'bad' : ''} style={{ animationDelay: `${(k % 5) * 0.3}s` }}>
                {v}
              </span>
            ))}
          </div>
          <div className="scan">SCAN_0042.pdf</div>
        </>
      )}
      {kind === 'search' && (
        <>
          <div className="dots">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
          <Search className="mag" />
          <Hourglass className="hg" />
        </>
      )}
    </div>
  );
}

/* ---------- solution diagram (drawn on scroll) ---------- */
function Diagram({ c }: { c: StoryCase }) {
  const W = 104;
  const H = 38;
  const X = (x: number) => 56 + (x - 70) * 1.3;
  const byId = Object.fromEntries(c.nodes.map((n) => [n.id, { ...n, x: X(n.x) }]));
  return (
    <svg className="diagram" viewBox="0 0 740 340" aria-label={`${c.skill} approach`}>
      {c.edges.map(([a, b, mode], i) => {
        const A = byId[a];
        const B = byId[b];
        const x1 = A.x + W / 2;
        const x2 = B.x - W / 2;
        const mx = (x1 + x2) / 2;
        return (
          <path
            key={i}
            className={`edge-p ${mode ?? ''}`}
            data-step={B.step}
            d={`M${x1} ${A.y} C${mx} ${A.y} ${mx} ${B.y} ${x2} ${B.y}`}
            pathLength={1}
          />
        );
      })}
      {c.nodes.map((n) => (
        <g key={n.id} className={`node ${n.kind ?? ''}`} data-step={n.step} transform={`translate(${X(n.x)} ${n.y})`}>
          <g className="node-in">
            <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={3} />
            <text y={4} textAnchor="middle">
              {n.label}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}

/* ---------- subtitles + narration toggle ---------- */
function Subtitles() {
  const [line, setLine] = useState<string | null>(null);
  useEffect(() => narrator.subscribe(setLine), []);
  if (!line) return null;
  return (
    <div className="subs" key={line} role="status" aria-live="polite">
      <span className="subs-tag">VO</span>
      <span className="subs-text">{line}</span>
    </div>
  );
}
function SoundToggle() {
  const [on, setOn] = useState(narrator.enabled);
  if (!narrator.supported) return null;
  return (
    <button
      className={`sound ${on ? 'on' : ''}`}
      onClick={() => {
        narrator.setEnabled(!on);
        setOn(!on);
      }}
      data-cursor={on ? 'Mute' : 'Voice'}
      aria-label={on ? 'Turn narration off' : 'Turn narration on'}
    >
      {on ? <Volume2 size={18} /> : <VolumeX size={18} />}
      <span>{on ? 'Narration on' : 'Narration off'}</span>
      {on && (
        <i className="eq">
          <b />
          <b />
          <b />
        </i>
      )}
    </button>
  );
}

/* ---------- intro: the gate + choose sound ---------- */
function Intro({ onOpen }: { onOpen: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl2 = useRef<gsap.core.Timeline | null>(null);
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    if (REDUCED) {
      onOpen();
      setGone(true);
      return;
    }
    const ctx = gsap.context(() => {
      const o = { v: 0 };
      gsap
        .timeline({ onComplete: () => setReady(true) })
        .from('.intro-presents', { opacity: 0, y: 14, duration: 0.8 })
        .from('.intro-seal', { scale: 2.4, opacity: 0, rotate: -20, duration: 0.6, ease: 'power4.in' }, 0.3)
        .to('.intro-door', { x: (i) => (i ? 5 : -5), duration: 0.05, yoyo: true, repeat: 3 }, '>')
        .to(o, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => setCount(Math.round(o.v)) }, 0.4);
      tl2.current = gsap
        .timeline({ paused: true, onComplete: () => setGone(true) })
        .to('.intro-ui', { opacity: 0, y: 20, duration: 0.35 })
        .to('.intro-seal', { scale: 1.15, duration: 0.2 }, '<')
        .call(onOpen, [], '>')
        .to('.intro-door.l', { xPercent: -101, duration: 1.3, ease: 'expo.inOut' }, '<')
        .to('.intro-door.r', { xPercent: 101, duration: 1.3, ease: 'expo.inOut' }, '<')
        .to('.intro-sun', { scale: 6, opacity: 0, duration: 1.3, ease: 'expo.inOut' }, '<');
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = (voice: boolean) => {
    narrator.setEnabled(voice);
    tl2.current?.play();
  };

  if (gone) return null;
  return (
    <div className="intro" ref={root}>
      <div className="intro-sun" />
      <div className="intro-door l">
        <div className="seal-half">
          <div className="intro-seal">TH</div>
        </div>
      </div>
      <div className="intro-door r">
        <div className="seal-half">
          <div className="intro-seal">TH</div>
        </div>
      </div>
      <div className="intro-presents">
        Talha Habib presents
        <em>A story about your next hire</em>
      </div>
      <div className="intro-ui">
        {!ready ? (
          <div className="intro-count">Loading the reel · {pad(Math.min(count, 99))}</div>
        ) : (
          <div className="intro-choice">
            {narrator.supported && (
              <button className="btn btn-red" onClick={() => start(true)} data-cursor="Play">
                <Volume2 size={17} /> Watch with narration
              </button>
            )}
            <button className="btn btn-line" onClick={() => start(false)} data-cursor="Play">
              <VolumeX size={17} /> Watch silently
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- modals ---------- */
function ProjectModal({ project, index, onClose }: { project: Project; index: number; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <button className="modal-x" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="modal-art">
          <PanelArt kind={index} />
          <span className="modal-num">{pad(index + 1)}</span>
        </div>
        <div className="modal-body">
          <span className="stamp">{project.badge}</span>
          <h3>{project.title}</h3>
          <p className="modal-tag">{project.tagline}</p>
          <p className="lead">{project.fullNarrative}</p>
          <div className="modal-metrics">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <span>{m.label}</span>
                <strong>{m.value}</strong>
              </div>
            ))}
          </div>
          <h4>Architecture</h4>
          <ul>
            {project.architecture.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <h4>Highlights</h4>
          <ul>
            {project.highlights.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <div className="chips">
            {project.techStack.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="modal-actions">
            <a className="btn btn-red" href={project.githubUrl} target="_blank" rel="noreferrer">
              <GithubIcon className="ico" /> View on GitHub <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
function ResumeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal resume" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <div className="resume-head">
          <strong>Talha Habib — Résumé</strong>
          <div>
            <a className="btn btn-red sm" href="/Talha_Habib_Resume.pdf" download>
              <Download size={15} /> Download
            </a>
            <button className="modal-x static" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>
        <iframe src="/Talha_Habib_Resume.pdf#toolbar=0" title="Resume" />
      </div>
    </div>
  );
}

/* ---------- suspense question scene ---------- */
export interface QCtl {
  lock: (el: HTMLElement) => boolean;
  release: (el: HTMLElement) => void;
  isJumping: () => boolean;
}
type Phase = 'idle' | 'ask' | 'choose' | 'reply';
function QuestionScene({
  id,
  kicker,
  question,
  choices,
  timeoutReply,
  onPick,
  ctl,
  wide = false,
}: {
  id?: string;
  kicker: string;
  question: string;
  choices: Choice[];
  timeoutReply: string;
  onPick?: (i: number | null) => void;
  ctl: QCtl;
  wide?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [picked, setPicked] = useState<number | null>(null);
  const [reply, setReply] = useState('');
  const phaseRef = useRef<Phase>('idle');
  const locked = useRef(false);
  const done = useRef(false);
  const timers = useRef<number[]>([]);
  const set = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };
  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const finish = (k: number | null) => {
    if (phaseRef.current === 'reply') return;
    clear();
    done.current = true;
    const r = k === null ? timeoutReply : choices[k].reply;
    setPicked(k);
    setReply(r);
    set('reply');
    narrator.say(r);
    onPick?.(k);
    if (locked.current) {
      timers.current.push(
        window.setTimeout(() => {
          locked.current = false;
          if (ref.current) ctl.release(ref.current);
        }, 3400),
      );
    }
  };
  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 45%',
      onEnter: () => {
        if (done.current || phaseRef.current !== 'idle' || ctl.isJumping()) return;
        locked.current = ctl.lock(el);
        set('ask');
        narrator.say(question);
        /* the suspense gap: question, then silence, then the choices */
        timers.current.push(window.setTimeout(() => set('choose'), 3000));
        timers.current.push(window.setTimeout(() => finish(null), 3000 + 6500));
      },
    });
    return () => {
      st.kill();
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const words = question.split(' ');
  return (
    <section className={`qscene ph-${phase}`} ref={ref} id={id}>
      <div className="q-spot" />
      <div className="q-inner">
        <span className="q-kicker">{kicker}</span>
        <h2 className="q-text" aria-label={question}>
          {words.map((w, k) => (
            <span className="qw" key={k} style={{ '--i': k } as React.CSSProperties} aria-hidden="true">
              {w}{' '}
            </span>
          ))}
        </h2>
        <div className="q-think" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className={`q-choices ${wide ? 'wide' : ''}`}>
          {choices.map((c, k) => (
            <button
              key={c.label}
              className={`q-choice ${picked === k ? 'picked' : ''}`}
              onClick={() => finish(k)}
              disabled={phase === 'reply' || phase === 'ask'}
              data-cursor="Pick"
            >
              <span>{String.fromCharCode(65 + k)}</span>
              {c.label}
            </button>
          ))}
        </div>
        <div className="q-timer" aria-hidden="true">
          <b />
        </div>
        <p className="q-reply">{reply}</p>
      </div>
    </section>
  );
}

/* ---------- one skill chapter ---------- */
function SkillScene({ c, i, onOpen, mine }: { c: StoryCase; i: number; onOpen: (projectId: string) => void; mine: boolean }) {
  return (
    <section className="case" data-case={i}>
      <div className="case-inner">
        <header className="case-head">
          <span className="case-num">Skill {pad(i + 1)}</span>
          <h3>
            {c.skill} <em>— {c.skillLine}</em>
          </h3>
          {mine && <span className="mine">★ You said this was slowing you down</span>}
        </header>
        <div className="case-grid">
          <div className="case-problem">
            <span className="tag-red">The problem</span>
            <Mini kind={c.mini} />
            <p className="case-quote">{c.quote}</p>
            <p className="case-pain">{c.pain}</p>
            <div className="solved">Solved</div>
          </div>
          <div className="case-arrow" aria-hidden="true">
            <svg viewBox="0 0 60 30">
              <path d="M2 15 H50 M40 5 L54 15 L40 25" pathLength={1} />
            </svg>
            <span>Talha</span>
          </div>
          <div className="case-fix">
            <span className="tag-ink">How Talha solves it</span>
            <p className="approach">{c.approach}</p>
            <div className="chips tools">
              {c.tools.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <Diagram c={c} />
          </div>
        </div>
        <div className="case-results">
          {c.results.map((r) => (
            <div className="result" key={r.label}>
              <strong>{r.value}</strong>
              <span>{r.label}</span>
            </div>
          ))}
          <div className="proof">
            <span>Proof</span>
            {c.proof.map((p) =>
              p.projectId ? (
                <button key={p.label} className="proof-link" onClick={() => onOpen(p.projectId!)} data-cursor="Open">
                  {p.label} <ArrowUpRight size={14} />
                </button>
              ) : (
                <em key={p.label}>{p.label}</em>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================= */

export default function App() {
  const [opened, setOpened] = useState(false);
  const [project, setProject] = useState<number | null>(null);
  const [resume, setResume] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (REDUCED) return;
    const lenis = new Lenis({ lerp: 0.09 });
    lenisRef.current = lenis;
    lenis.stop();
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const locked = !opened || project !== null || resume;
    document.documentElement.style.overflow = locked ? 'hidden' : '';
    if (lenisRef.current) {
      if (locked) lenisRef.current.stop();
      else lenisRef.current.start();
    }
  }, [opened, project, resume]);

  /* title-card entrance */
  useLayoutEffect(() => {
    if (!opened) return;
    narrator.say(STORY_LINES.title);
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero-sun', { scale: 0.4, opacity: 0, duration: 1.8 })
        .from('.hero-mtn', { yPercent: 40, duration: 1.6 }, 0)
        .from('.hero-cloud.l', { xPercent: -60, duration: 1.8 }, 0)
        .from('.hero-cloud.r', { xPercent: 60, duration: 1.8 }, 0)
        .from('.hero-figure', { y: 80, opacity: 0, duration: 1.4 }, 0.3)
        .from('.hero-name .ch', { yPercent: 115, stagger: 0.035, duration: 1.2 }, 0.3)
        .from('.hero-fade', { y: 24, opacity: 0, stagger: 0.1, duration: 1 }, 0.7)
        .from('.nav, .sound', { y: -40, opacity: 0, duration: 1 }, 0.6);
    }, rootRef);
    return () => ctx.revert();
  }, [opened]);

  /* scroll story */
  useLayoutEffect(() => {
    if (REDUCED) return;
    /* pick the voice-over line for a scene's progress */
    const beats = (lines: string[], marks: number[]) => (self: ScrollTrigger) => {
      let k = 0;
      marks.forEach((m, j) => {
        if (self.progress >= m) k = j;
      });
      narrator.say(lines[k]);
    };

    const ctx = gsap.context(() => {
      gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (s) => document.querySelector('.nav')?.classList.toggle('nav-hidden', s.direction === 1 && s.scroll() > 300),
      });

      /* TITLE — dive into the sun, cut to black */
      const sun = document.querySelector<HTMLElement>('.hero-sun')!;
      const sunScale = () => {
        const hero = document.querySelector<HTMLElement>('.hero')!;
        const cx = sun.offsetLeft + sun.offsetWidth / 2;
        const cy = sun.offsetTop + sun.offsetHeight / 2;
        const W = hero.offsetWidth;
        const H = window.innerHeight;
        const far = Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy));
        return (far * 2) / sun.offsetWidth + 0.2;
      };
      gsap
        .timeline({
          scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=150%', scrub: 1, pin: true, invalidateOnRefresh: true, onUpdate: beats([STORY_LINES.title], [0]) },
        })
        .to('.hero-name .ch', { yPercent: -120, stagger: 0.02, duration: 0.5, ease: 'power2.in' }, 0)
        .to('.hero-fade', { opacity: 0, y: -30, stagger: 0.03, duration: 0.4 }, 0)
        .to('.hero-cloud.l', { xPercent: -90, duration: 1 }, 0.1)
        .to('.hero-cloud.r', { xPercent: 90, duration: 1 }, 0.1)
        .to('.hero-mtn', { yPercent: 60, scale: 1.2, duration: 1 }, 0.1)
        .to('.hero-figure', { yPercent: 40, scale: 1.4, opacity: 0, duration: 0.8 }, 0.2)
        .to('.hero-sun', { scale: sunScale, duration: 1.2, ease: 'power2.in' }, 0.35)
        .to('.hero-black', { opacity: 1, duration: 0.35 }, 1.3);

      /* ACT I — the company and its problems */
      const mmA = gsap.matchMedia();
      mmA.add({ desk: '(min-width: 900px)', mob: '(max-width: 899px)' }, (mc) => {
        const desk = mc.conditions?.desk;
        const t = gsap.timeline({
          scrollTrigger: { trigger: '.company', start: 'top top', end: '+=300%', scrub: 1, pin: true, onUpdate: beats([STORY_LINES.company, STORY_LINES.agreed], [0, 0.72]) },
        });
        t.from('.company-head > *', { y: 40, opacity: 0, stagger: 0.1, duration: 0.4 }, 0);
        if (desk) {
          t.from('.tower', { yPercent: 70, duration: 0.8, ease: 'power2.out' }, 0.1).from('.tower-sign', { scale: 0, duration: 0.3 }, 0.7);
        }
        t.from('.pcard', { scale: 0.4, opacity: 0, rotate: (k) => (k % 2 ? 8 : -8), stagger: 0.45, duration: 0.45, ease: 'back.out(1.6)' }, 0.8)
          .to('.company-head', { opacity: 0, y: -30, duration: 0.3 }, 3.8)
          .from('.familiar', { opacity: 0, scale: 1.3, duration: 0.4 }, 3.9)
          .from('.agreed', { scale: 3, opacity: 0, rotate: -25, stagger: 0.12, duration: 0.3, ease: 'power4.in' }, 4.2)
          .to('.pcard', { x: () => gsap.utils.random(-4, 4), duration: 0.05, stagger: 0.12 }, 4.2)
          .to({}, { duration: 0.6 });
      });

      /* ACT II — the arrival (hidden doors) */
      gsap
        .timeline({ scrollTrigger: { trigger: '.gate', start: 'top top', end: '+=240%', scrub: 1, pin: true, onUpdate: beats([STORY_LINES.arrival, STORY_LINES.hero], [0, 0.6]) } })
        .from('.gate-frame', { scale: 0.7, y: 60, duration: 0.6 }, 0)
        .from('.gate-cap', { opacity: 0, y: 20, duration: 0.3 }, 0.3)
        .to('.gate-cap', { opacity: 0, duration: 0.2 }, 0.8)
        .to('.gate-seal', { rotate: 90, scale: 1.2, duration: 0.4 }, 0.7)
        .to('.gate-seal', { scale: 0, opacity: 0, duration: 0.3 }, 1.05)
        .to('.gdoor.l', { rotateY: -108, duration: 1.2, ease: 'power2.inOut' }, 1)
        .to('.gdoor.r', { rotateY: 108, duration: 1.2, ease: 'power2.inOut' }, 1)
        .fromTo('.gate-walker', { scale: 0.25, opacity: 0, yPercent: 10 }, { scale: 2.6, opacity: 1, yPercent: 30, duration: 1.3, ease: 'power2.in' }, 1.2)
        .to('.gate-walker', { opacity: 0, duration: 0.25 }, 2.3)
        .to('.gate-frame', { scale: 2.6, duration: 1.4, ease: 'power2.in' }, 1.1)
        .to('.gate-frame', { opacity: 0, duration: 0.3 }, 2.2)
        .to('.gate-pillars.l', { xPercent: -120, duration: 1.4 }, 1)
        .to('.gate-pillars.r', { xPercent: 120, duration: 1.4 }, 1)
        .fromTo('.page', { scale: 0.75, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, 2.1)
        .from('.page .mp', { y: 70, opacity: 0, rotate: (k) => (k % 2 ? 2 : -2), stagger: 0.12, duration: 0.5 }, 2.4)
        .to({}, { duration: 0.6 });

      /* ACT III — fix intro card */
      ScrollTrigger.create({ trigger: '.fix-intro', start: 'top 60%', end: 'bottom 40%', onToggle: (s) => s.isActive && narrator.say(STORY_LINES.fixIntro) });

      /* ACT III — each case */
      const mmC = gsap.matchMedia();
      mmC.add({ desk: '(min-width: 900px)', mob: '(max-width: 899px)' }, (mc) => {
        const desk = mc.conditions?.desk;
        gsap.utils.toArray<HTMLElement>('.case').forEach((el, idx) => {
          const c = STORY[idx];
          const q = gsap.utils.selector(el);
          /* arrival: panels slam in as soon as the chapter appears */
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } })
            .from(q('.case-head > *'), { y: 30, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out' }, 0)
            .from(q('.case-problem'), { xPercent: -25, opacity: 0, rotate: -3, duration: 0.8, ease: 'expo.out' }, 0.1)
            .from(q('.case-arrow path'), { strokeDashoffset: 1, duration: 0.5 }, 0.5)
            .from(q('.case-arrow span'), { opacity: 0, duration: 0.3 }, 0.7)
            .from(q('.case-fix'), { xPercent: 15, opacity: 0, duration: 0.8, ease: 'expo.out' }, 0.5);
          /* the fix draws itself as you scroll */
          const t = gsap.timeline(
            desk
              ? {
                  scrollTrigger: {
                    trigger: el,
                    start: 'top top',
                    end: '+=150%',
                    scrub: 1,
                    pin: true,
                    onEnter: () => narrator.say(c.voFix),
                    onUpdate: beats([c.voFix, c.voResult], [0, 0.72]),
                  },
                }
              : { scrollTrigger: { trigger: q('.case-fix')[0], start: 'top 70%', toggleActions: 'play none none reverse' } },
          );
          [0, 1, 2, 3, 4].forEach((s) => {
            const at = s * 0.3;
            t.from(q(`.edge-p[data-step="${s}"]`), { strokeDashoffset: 1, opacity: 0, duration: 0.25 }, at - 0.12 < 0 ? 0 : at - 0.12).from(q(`.node[data-step="${s}"] .node-in`), { scale: 0, duration: 0.2, ease: 'back.out(2)' }, at);
          });
          t.from(q('.result, .proof'), { y: 40, opacity: 0, stagger: 0.1, duration: 0.25 }, 1.6)
            .from(q('.solved'), { scale: 3, opacity: 0, rotate: -30, duration: 0.25, ease: 'power4.in' }, 1.9)
            .to(q('.mini'), { opacity: 0.25, duration: 0.2 }, 2.0)
            .to({}, { duration: 0.4 });
          if (!desk) {
            ScrollTrigger.create({ trigger: q('.case-fix')[0], start: 'top 60%', onEnter: () => narrator.say(c.voFix), onEnterBack: () => narrator.say(c.voFix) });
            ScrollTrigger.create({ trigger: q('.case-results')[0], start: 'top 80%', onEnter: () => narrator.say(c.voResult) });
          }
        });
      });

      /* ACT IV — proof (no voice-over: quiet zone) */
      ScrollTrigger.create({ trigger: '.proof-zone', start: 'top 70%', end: 'bottom 30%', onToggle: (s) => s.isActive && narrator.say(null) });
      gsap.fromTo('.journey-speed', { rotate: 0 }, { rotate: 40, ease: 'none', scrollTrigger: { trigger: '.journey', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('.tl-progress', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 65%', end: 'bottom 65%', scrub: true } });
      gsap.utils.toArray<HTMLElement>('.tl-item').forEach((el, k) => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top 78%', toggleActions: 'play none none reverse' } })
          .fromTo(el.querySelector('.tl-card'), { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', scale: 1.1 }, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', scale: 1, rotate: k % 2 ? 0.5 : -0.5, duration: 1, ease: 'expo.out' })
          .from(el.querySelector('.tl-dot'), { scale: 0, duration: 0.5, ease: 'back.out(3)' }, 0.1);
      });
      const skew = gsap.quickTo('.marquee-track', 'skewX', { duration: 0.4, ease: 'power3' });
      ScrollTrigger.create({ onUpdate: (s) => skew(gsap.utils.clamp(-10, 10, s.getVelocity() / -250)) });
      gsap.utils.toArray<HTMLElement>('.bar-fill').forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: Number(el.dataset.level) / 100, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
      });
      gsap.utils.toArray<HTMLElement>('.skill-card').forEach((el, k) => {
        gsap.from(el, { y: 90, rotate: k % 2 ? 3 : -3, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
      });

      /* ACT V — your chapter */
      gsap
        .timeline({ scrollTrigger: { trigger: '.contact', start: 'top top', end: '+=140%', scrub: 1, pin: true, onUpdate: beats([STORY_LINES.finale], [0]) } })
        .from('.c-sun', { scale: 0, duration: 0.8, ease: 'power2.out' }, 0)
        .from('.c-figure', { yPercent: 60, opacity: 0, duration: 0.6 }, 0.3)
        .from('.c-speed', { opacity: 0, scale: 0.6, duration: 0.6 }, 0.2)
        .to('.c-speed', { rotate: 30, duration: 2 }, 0.2)
        .from('.contact-big .w > span', { yPercent: 115, stagger: 0.08, duration: 0.5 }, 0.6)
        .from('.contact-fade', { y: 40, opacity: 0, stagger: 0.08, duration: 0.4 }, 0.9);
      ScrollTrigger.create({ trigger: '.footer', start: 'top 95%', onEnter: () => narrator.say(null) });

      /* generic reveals — after pins */
      gsap.utils.toArray<HTMLElement>('.reveal-words').forEach((el) => {
        gsap.from(el.querySelectorAll('.w > span'), { yPercent: 115, stagger: 0.05, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } });
      });
      gsap.utils.toArray<HTMLElement>('.act-line').forEach((el) => {
        gsap.from(el, { scaleX: 0, duration: 1.2, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 90%' } });
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
      });
    }, rootRef);

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  /* cursor + magnetic */
  useEffect(() => {
    if (REDUCED || !window.matchMedia('(pointer: fine)').matches) return;
    document.body.classList.add('has-cursor');
    const dot = document.querySelector<HTMLElement>('.cursor-dot')!;
    const ring = document.querySelector<HTMLElement>('.cursor-ring')!;
    const label = ring.querySelector('span')!;
    const dx = gsap.quickTo(dot, 'x', { duration: 0.1 });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.1 });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
    const move = (e: MouseEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]');
      ring.classList.toggle('hover', !!t);
      label.textContent = t?.dataset.cursor ?? '';
      ring.classList.toggle('labeled', !!t?.dataset.cursor);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    const hs = gsap.utils.toArray<HTMLElement>('.magnetic').map((el) => {
      const m = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4, ease: 'power3' });
      };
      const l = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      el.addEventListener('mousemove', m);
      el.addEventListener('mouseleave', l);
      return { el, m, l };
    });
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      hs.forEach(({ el, m, l }) => {
        el.removeEventListener('mousemove', m);
        el.removeEventListener('mouseleave', l);
      });
    };
  }, []);

  const jumping = useRef(false);
  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const l = lenisRef.current;
    if (l) {
      jumping.current = true;
      l.start();
      l.scrollTo(el, { duration: 1.6, force: true, onComplete: () => (jumping.current = false) });
    } else el.scrollIntoView({ behavior: 'smooth' });
  };
  /* question scenes: pause the scroll, then carry the viewer on */
  const ctl: QCtl = {
    isJumping: () => jumping.current,
    lock: (el) => {
      const l = lenisRef.current;
      if (!l) return false;
      l.scrollTo(el, { duration: 0.9, force: true, lock: true, onComplete: () => l.stop() });
      return true;
    },
    release: (el) => {
      const l = lenisRef.current;
      if (!l) return;
      l.start();
      const next = el.nextElementSibling as HTMLElement | null;
      if (next) l.scrollTo(next, { offset: 2, duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
    },
  };
  const openProject = (id: string) => setProject(PROJECTS.findIndex((p) => p.id === id));
  const pickLabel = PROLOGUE.options.find((o) => o.id === pick)?.label;
  const pickIndex = STORY.findIndex((c) => c.id === pick);
  const allSkills = SKILL_CATEGORIES.flatMap((c) => c.skills.map((s) => s.name.split(' & ')[0]));

  return (
    <div ref={rootRef}>
      <InkDefs />
      <Intro onOpen={() => setOpened(true)} />
      <div className="paper-grain" />
      <div className="progress" />
      <div className="cursor-dot" />
      <div className="cursor-ring">
        <span />
      </div>
      {opened && <SoundToggle />}
      <Subtitles />

      <nav className="nav">
        <button className="logo" onClick={() => go('top')} data-cursor="Top">
          <span className="seal-sm">TH</span> Talha Habib
        </button>
        <div className="nav-links">
          {[
            ['company', 'The problem'],
            ['gate', 'The arrival'],
            ['fixes', 'The fixes'],
            ['journey', 'Proof'],
            ['contact', 'Contact'],
          ].map(([id, l]) => (
            <button key={id} onClick={() => go(id)}>
              {l}
            </button>
          ))}
        </div>
        <button className="btn btn-ink sm" onClick={() => setResume(true)}>
          <FileText size={14} /> Résumé
        </button>
      </nav>

      {/* TITLE CARD */}
      <section className="hero" id="top">
        <div className="hero-sun" />
        <Cloud className="hero-cloud l" />
        <Cloud className="hero-cloud r" flip />
        <Mountains className="hero-mtn" />
        <Wanderer className="hero-figure" />
        <div className="hero-content">
          <div className="hero-fade hero-kicker">A story about your next hire</div>
          <h1 className="hero-name">
            <Chars text="Talha" className="line" />
            <Chars text="Habib" className="line red" />
          </h1>
          <p className="hero-fade hero-role">Agentic AI Engineer &amp; Multi-Agent Architect</p>
          <Caption className="hero-fade hero-cap">
            Scroll to watch a company’s problems — and how I solve them, one at a time.
          </Caption>
          <div className="hero-fade hero-ctas">
            <button className="btn btn-red magnetic" onClick={() => go('company')}>
              Start the story <ArrowUpRight size={17} />
            </button>
            <a className="btn btn-line magnetic" href={PERSONAL_INFO.github} target="_blank" rel="noreferrer">
              <GithubIcon className="ico" /> GitHub
            </a>
            <a className="btn btn-line magnetic" href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer">
              <LinkedinIcon className="ico" /> LinkedIn
            </a>
          </div>
        </div>
        <div className="hero-fade scroll-cue">Scroll to begin ↓</div>
        <div className="hero-black" />
      </section>

      {/* PROLOGUE — the viewer's question */}
      <QuestionScene
        kicker="Prologue · A question for you"
        question={PROLOGUE.question}
        choices={PROLOGUE.options.map((o) => ({ label: o.label, reply: PROLOGUE.reply }))}
        timeoutReply={PROLOGUE.timeoutReply}
        onPick={(k) => setPick(k === null ? null : PROLOGUE.options[k].id)}
        ctl={ctl}
        wide
      />

      {/* ACT I — THE PROBLEM */}
      <section className="company" id="company">
        <div className="night-sky" />
        <div className="tower">
          <div className="tower-sign">Your Company, Inc.</div>
          <div className="tower-body">
            {Array.from({ length: 40 }).map((_, k) => (
              <span key={k} className={k % 7 === 3 || k % 11 === 5 ? 'alarm' : ''} style={{ animationDelay: `${(k % 9) * 0.37}s` }} />
            ))}
          </div>
        </div>
        <div className="company-head">
          <ActLabel act="I" name="Act one · The problem" light />
          <h2>Meet the company. <em>Big plans. Stubborn problems.</em></h2>
        </div>
        <div className="familiar">
          <h2>Sound familiar?</h2>
          <p>If you nodded even once — keep watching.</p>
        </div>
        <div className="pcards">
          {STORY.map((c, k) => (
            <div className="pcard" key={c.id} style={{ '--k': k } as React.CSSProperties}>
              <Mini kind={c.mini} />
              <div className="pcard-txt">
                <span className="pcard-n">Problem {pad(k + 1)}</span>
                <strong>{c.problemTitle}</strong>
                <p>{c.quote}</p>
              </div>
              <span className="agreed">Agreed</span>
            </div>
          ))}
        </div>
      </section>

      {/* ACT II — THE ARRIVAL */}
      <section className="gate" id="gate">
        <div className="page">
          <div className="page-head mp">
            <ActLabel act="II" name="Act two · The arrival" />
          </div>
          <div className="page-grid">
            <div className="mp mpanel big">
              <SpeedLines className="mp-speed" count={60} seed={21} />
              <h2>
                Talha Habib. <em>Builds AI that works in teams.</em>
              </h2>
              <Caption>{PERSONAL_INFO.shortBio}</Caption>
            </div>
            <div className="mp mpanel">
              <h4>Education</h4>
              <p><b>{PERSONAL_INFO.education.university}</b></p>
              <p>{PERSONAL_INFO.education.degree}</p>
              <span className="mono">{PERSONAL_INFO.education.duration}</span>
            </div>
            <div className="mp mpanel red">
              <h4>Recognised for</h4>
              <ul>
                {PERSONAL_INFO.accolades.map((a) => (
                  <li key={a.title}>
                    {a.title} <span>· {a.issuer}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mp mpanel">
              <h4>Right now</h4>
              <p>Agentic AI Intern at <b>CalderR</b> (Best Performer &amp; Best Project) and freelance automation engineer for clients worldwide.</p>
            </div>
          </div>
        </div>
        <div className="gate-pillars l">
          <Pillar className="pillar" />
          <Pillar className="pillar" />
        </div>
        <div className="gate-pillars r">
          <Pillar className="pillar" />
          <Pillar className="pillar" />
        </div>
        <div className="gate-frame">
          <div className="gate-lintel" />
          <div className="gate-doors">
            <div className="gdoor l" />
            <div className="gdoor r" />
            <div className="gate-seal">TH</div>
          </div>
        </div>
        <Wanderer className="gate-walker" />
        <Caption className="gate-cap">Then, one day, someone knocks.</Caption>
      </section>

      {/* ACT III — THE FIX */}
      <section className="fix-intro">
        <ActLabel act="III" name="Act three · The fix" />
        <h2 className="reveal-words">
          <Words text="No slides. Just skills." />
        </h2>
        <p data-reveal>Six problems. Six skills. Before each one, a question for you. Answer it, or just wait.</p>
      </section>
      {STORY.map((c, k) => (
        <Fragment key={c.id}>
          <QuestionScene
            id={k === 0 ? 'fixes' : undefined}
            kicker={pick === c.id ? `Question ${k + 1} of 6 · You said this one hurts` : `Question ${k + 1} of 6 · ${c.problemTitle}`}
            question={c.question}
            choices={c.choices}
            timeoutReply={`Time’s up. ${c.choices[1].reply}`}
            ctl={ctl}
          />
          <SkillScene c={c} i={k} onOpen={openProject} mine={pick === c.id} />
        </Fragment>
      ))}

      {/* ACT IV — PROOF */}
      <div className="proof-zone">
        <InkEdge className="edge" seed={9} />
        <section className="journey" id="journey">
          <SpeedLines className="journey-speed" count={80} seed={13} color="#1c1a17" />
          <div className="section">
            <ActLabel act="IV" name="Act four · The proof" light />
            <h2 className="sec-title light reveal-words">
              <Words text="Where I’ve been building." />
            </h2>
            <div className="timeline">
              <div className="tl-line">
                <div className="tl-progress" />
              </div>
              {EXPERIENCES.map((e, k) => (
                <div className={`tl-item ${k % 2 ? 'right' : 'left'}`} key={e.company}>
                  <div className="tl-dot" />
                  <div className="tl-card">
                    <div className="tl-meta">
                      <span>{e.period}</span>
                      <span>{e.location}</span>
                    </div>
                    <h3>{e.role}</h3>
                    <h4>{e.company}</h4>
                    {e.featuredBadge && <div className="stamp red">★ {e.featuredBadge}</div>}
                    <p>{e.description}</p>
                    <ul>
                      {e.achievements.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                    <div className="chips">
                      {e.skills.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <InkEdge className="edge flip" seed={17} />

        <section className="skills" id="skills">
          <SpeedLines className="skills-burst" count={70} seed={31} color="rgba(11,10,9,.07)" />
          <div className="section">
            <h2 className="sec-title reveal-words">
              <Words text="The toolkit behind the fixes." />
            </h2>
          </div>
          <div className="marquee">
            <div className="marquee-track">
              {[...allSkills, ...allSkills].map((s, k) => (
                <span key={k}>{s} <i>●</i></span>
              ))}
            </div>
          </div>
          <div className="marquee rev">
            <div className="marquee-track">
              {[...allSkills.slice().reverse(), ...allSkills.slice().reverse()].map((s, k) => (
                <span key={k} className="it">{s} <i>●</i></span>
              ))}
            </div>
          </div>
          <div className="section skill-grid">
            {SKILL_CATEGORIES.map((c, ci) => (
              <div className="skill-card" key={c.category}>
                <div className="skill-head">
                  <span className="seal-sm">{ci + 1}</span>
                  <h3>{c.category}</h3>
                </div>
                {c.skills.map((s) => (
                  <div className="skill" key={s.name}>
                    <div className="skill-row">
                      <strong>{s.name}</strong>
                      <span>{s.level}%</span>
                    </div>
                    <div className="bar">
                      <div className="bar-fill" data-level={s.level} />
                    </div>
                    <small>{s.note}</small>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ACT V — YOUR CHAPTER */}
      <section className="contact" id="contact">
        <SpeedLines className="c-speed" count={120} seed={41} color="#efe9dc" />
        <div className="c-sun">
          <Wanderer className="c-figure" robe="#0b0a09" />
        </div>
        <div className="contact-inner">
          <div className="contact-fade">
            <ActLabel act="V" name="Act five · Your chapter" light />
          </div>
          <h2 className="contact-big">
            <Words text="Your problem" />
            <Words text="is the next chapter." className="red" />
          </h2>
          {pickLabel && pickIndex >= 0 && (
            <p className="contact-fade contact-pick">
              You said <b>“{pickLabel}.”</b> Skill {pad(pickIndex + 1)}, {STORY[pickIndex].skill}, is how I’d fix it.
            </p>
          )}
          <Caption className="contact-fade">Open to Agentic AI engineering roles, internships and freelance builds. Tell me what’s broken — I usually reply within a day.</Caption>
          <div className="contact-fade contact-links">
            <a className="btn btn-red magnetic" href={`mailto:${PERSONAL_INFO.email}`}>
              <Mail size={17} /> {PERSONAL_INFO.email}
            </a>
            <a className="btn btn-paper magnetic" href={`tel:${PERSONAL_INFO.phone.replace(/\s/g, '')}`}>
              <Phone size={17} /> {PERSONAL_INFO.phone}
            </a>
          </div>
          <div className="contact-fade contact-socials">
            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer"><LinkedinIcon className="ico" /> LinkedIn</a>
            <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer"><GithubIcon className="ico" /> GitHub</a>
            <button onClick={() => setResume(true)}><FileText size={15} /> Résumé</button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Talha Habib</span>
        <span>The end — or the beginning.</span>
        <button onClick={() => go('top')}>Watch again ↑</button>
      </footer>

      {project !== null && project >= 0 && <ProjectModal project={PROJECTS[project]} index={project} onClose={() => setProject(null)} />}
      {resume && <ResumeModal onClose={() => setResume(false)} />}
    </div>
  );
}
