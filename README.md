# Talha Habib — "A Story About Your Next Hire"

A portfolio told as an interactive short film about **skills**. The viewer's company has problems, the viewer is asked questions and answers them (or waits through a suspense pause), and each answer leads to the skill that solves it, with real projects as proof.

Built with React, Vite and Tailwind 4, using GSAP ScrollTrigger and Lenis. Fonts: Playfair Display, Courier Prime and Plus Jakarta Sans, all self-hosted.

## The story
| Scene | What happens |
|---|---|
| Title | Choose narration on or off → the doors open → the camera dives into the sun |
| **Prologue question** | "What is slowing your team down right now?" The viewer picks an answer, and the site remembers it |
| Act I · The problem | "Your Company, Inc." with six animated problems → "Sound familiar?" → an AGREED stamp on each one |
| Act II · The arrival | The hidden doors open and Talha walks in |
| Act III · Six skill chapters | Each chapter: **suspense question** (scroll pauses → 3 s silence → choices + countdown → reply → auto-continue) → **skill scene** (problem → approach → diagram draws → results → proof projects). The chapter matching the viewer's prologue answer is marked "★ You said this was slowing you down" |
| Act IV · Proof | Experience and skills (no narration) |
| Act V · Your chapter | Contact, personalised: "You said ‘X’. Skill 0N is how I'd fix it." |

Skills covered: GraphRAG & AI safety · Multi-agent orchestration · Workflow automation · Tool integration & APIs (MCP) · Machine learning & data · Core engineering.

## Editing
- Questions, choices, replies, skills, diagrams, results and voice-over lines: `src/data/story.ts`
- Personal info, projects, experience and skill levels: `src/data/portfolioData.ts`
- Voice-over engine (the browser's built-in speech): `src/narrator.ts`

## Run
```bash
npm install && npm run dev
npm run build   # → dist/
```
