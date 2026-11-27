/* The hiring story — told through SKILLS, not just projects.
   Each chapter: a suspense question to the viewer → a pause → the skill that solves it → proof. */

export type MiniKind = 'glitch' | 'pile' | 'collide' | 'pingpong' | 'locked' | 'search' | 'messy';

export interface DNode {
  id: string;
  x: number;
  y: number;
  label: string;
  kind?: 'in' | 'core' | 'human' | 'out';
  step: number;
}

export interface Choice {
  label: string;
  reply: string;
}

export interface StoryCase {
  id: string;
  mini: MiniKind;
  problemTitle: string;
  quote: string;
  pain: string;
  /* suspense question */
  question: string;
  choices: [Choice, Choice];
  /* the skill */
  skill: string;
  skillLine: string;
  approach: string;
  tools: string[];
  nodes: DNode[];
  edges: [string, string, ('hot' | 'dash')?][];
  results: { value: string; label: string }[];
  proof: { label: string; projectId?: string }[];
  voFix: string;
  voResult: string;
}

export const PROLOGUE = {
  question: 'Before we begin… tell me. What is slowing your team down right now?',
  options: [
    { id: 'trust', label: 'Our AI can’t be trusted' },
    { id: 'automation', label: 'Too much manual work' },
    { id: 'integration', label: 'Our systems don’t talk' },
    { id: 'data', label: 'Our data is a mess' },
  ],
  reply: 'Hold that thought. Let’s see if it shows up in this story.',
  timeoutReply: 'No answer? That’s fine. Most teams aren’t sure either. Let’s find out together.',
};

export const STORY_LINES = {
  title: 'Every company has a story. Most of them begin the same way: with a problem nobody has time to fix.',
  company: 'Meet the company. Smart people, big plans, and a pile of problems that just will not go away.',
  agreed: 'Sound familiar? If you nodded even once, keep watching.',
  arrival: 'Then, one day, someone walks through the door.',
  hero: 'Talha Habib. An AI engineer who builds systems that think in teams, check each other’s work, and know when to ask a human.',
  fixIntro: 'He doesn’t bring slides. He brings skills. Six problems, six skills. But first, you get to choose.',
  finale: 'The problems were real. So were the skills that solved them. Your problem could be the next chapter. Let’s write it together.',
};

export const STORY: StoryCase[] = [
  {
    id: 'trust',
    mini: 'glitch',
    problemTitle: 'The AI makes things up',
    quote: '“Our AI sounds confident — but it invents answers.”',
    pain: 'Customers stop trusting it. In healthcare or finance, one wrong answer is one too many.',
    question: 'Your AI just told a customer something with total confidence… and it was completely wrong. What do you do?',
    choices: [
      { label: 'Write a stricter prompt', reply: 'Prompts help. But a prompt can’t guarantee the truth. Talha makes the AI prove it.' },
      { label: 'Make it prove every answer', reply: 'Exactly how Talha thinks. No evidence, no answer.' },
    ],
    skill: 'GraphRAG & AI safety',
    skillLine: 'Answers grounded in evidence, checked by a human.',
    approach: 'Knowledge graphs hold the facts and how they connect. Vector search finds the supporting evidence. Agents reason step by step, and a human-in-the-loop gate signs off before anything goes out.',
    tools: ['GraphRAG', 'Neo4j', 'Pinecone', 'LangChain', 'Human-in-the-loop'],
    nodes: [
      { id: 'q', x: 70, y: 170, label: 'Question', kind: 'in', step: 0 },
      { id: 'o', x: 200, y: 170, label: 'Reasoning agent', kind: 'core', step: 1 },
      { id: 'g', x: 330, y: 85, label: 'Knowledge graph', step: 2 },
      { id: 'v', x: 330, y: 255, label: 'Evidence search', step: 2 },
      { id: 's', x: 455, y: 170, label: 'Verified answer', kind: 'core', step: 3 },
      { id: 'd', x: 548, y: 170, label: 'Human sign-off', kind: 'human', step: 4 },
    ],
    edges: [['q', 'o'], ['o', 'g'], ['o', 'v'], ['g', 's'], ['v', 's'], ['s', 'd', 'hot']],
    results: [
      { value: '92%', label: 'GraphRAG & knowledge graphs' },
      { value: '94%', label: 'human-in-the-loop safety design' },
      { value: '50,000+', label: 'relations validated in MedFlow AI' },
    ],
    proof: [{ label: 'MedFlow AI', projectId: 'medflow-ai' }],
    voFix: 'This is GraphRAG and AI safety. Facts live in a knowledge graph, evidence is searched, agents reason step by step, and a human signs off before anything goes out.',
    voResult: 'Proven in MedFlow AI: fifty thousand medical relations, validated.',
  },
  {
    id: 'agents',
    mini: 'pile',
    problemTitle: 'One AI isn’t enough',
    quote: '“Our AI gives shallow, one-sided answers to hard questions.”',
    pain: 'Complex work needs many perspectives. One model sees one.',
    question: 'One impossibly complex task. One AI model. Who do you send?',
    choices: [
      { label: 'A bigger, smarter model', reply: 'Bigger isn’t deeper. Even geniuses work better in teams.' },
      { label: 'A team of specialist agents', reply: 'Right. Talha builds agent teams that split the work, and argue it out.' },
    ],
    skill: 'Multi-agent orchestration',
    skillLine: 'Specialists that work in parallel, and disagree on purpose.',
    approach: 'An orchestrator breaks the job into parts. Specialist agents work in parallel with ReAct reasoning and tools. A resolver catches contradictions before one confident, combined answer comes out.',
    tools: ['LangGraph', 'ReAct loops', 'LangChain', 'FastAPI', 'Streaming (SSE)'],
    nodes: [
      { id: 'q', x: 70, y: 170, label: 'Complex task', kind: 'in', step: 0 },
      { id: 'o', x: 190, y: 170, label: 'Orchestrator', kind: 'core', step: 1 },
      { id: 'a1', x: 320, y: 50, label: 'Specialist 1', step: 2 },
      { id: 'a2', x: 320, y: 130, label: 'Specialist 2', step: 2 },
      { id: 'a3', x: 320, y: 210, label: 'Specialist 3', step: 2 },
      { id: 'a4', x: 320, y: 290, label: 'Specialist 4', step: 2 },
      { id: 'r', x: 445, y: 170, label: 'Conflict resolver', kind: 'human', step: 3 },
      { id: 'out', x: 548, y: 170, label: 'One clear answer', kind: 'out', step: 4 },
    ],
    edges: [['q', 'o'], ['o', 'a1'], ['o', 'a2'], ['o', 'a3'], ['o', 'a4'], ['a1', 'r'], ['a2', 'r'], ['a3', 'r'], ['a4', 'r'], ['r', 'out', 'hot']],
    results: [
      { value: '95%', label: 'LangGraph & multi-agent swarms' },
      { value: '5×', label: 'parallel research throughput' },
      { value: 'Best Project', label: 'award at CalderR' },
    ],
    proof: [{ label: 'Multi-Agent Research System', projectId: 'multi-agent-research' }, { label: 'CalderR internship' }],
    voFix: 'This is multi-agent orchestration. An orchestrator splits the work, specialist agents run in parallel, and a resolver catches every contradiction.',
    voResult: 'Five times the research throughput. And a Best Project award at CalderR.',
  },
  {
    id: 'automation',
    mini: 'collide',
    problemTitle: 'Drowning in manual work',
    quote: '“We copy data between tools all day — and still make mistakes.”',
    pain: 'Hours lost, double bookings, and tired people fixing things by hand.',
    question: 'Your team loses hours every day moving data between tools by hand. What do you do with those hours?',
    choices: [
      { label: 'Hire more people', reply: 'More hands, same mistakes. Talha gives the hours back instead.' },
      { label: 'Let workflows do it', reply: 'Yes. And workflows that never double-book, and undo themselves when something fails.' },
    ],
    skill: 'Workflow automation',
    skillLine: 'Pipelines that run themselves, and recover on their own.',
    approach: 'Webhooks trigger n8n workflows that read, decide and act across your apps. Atomic locks prevent collisions, and automatic rollback undoes anything that fails halfway.',
    tools: ['n8n', 'Webhooks', 'REST APIs', 'Supabase', 'Google Calendar API'],
    nodes: [
      { id: 't', x: 70, y: 170, label: 'Trigger', kind: 'in', step: 0 },
      { id: 'w', x: 200, y: 170, label: 'n8n workflow', kind: 'core', step: 1 },
      { id: 'l', x: 330, y: 95, label: 'Atomic lock', kind: 'human', step: 2 },
      { id: 'n', x: 330, y: 245, label: 'Smart reply', step: 2 },
      { id: 'a', x: 455, y: 95, label: 'Apps updated', step: 3 },
      { id: 'rb', x: 455, y: 245, label: 'Auto-rollback', step: 3 },
      { id: 'ok', x: 548, y: 170, label: 'Done. No humans', kind: 'out', step: 4 },
    ],
    edges: [['t', 'w'], ['w', 'l'], ['w', 'n'], ['l', 'a', 'hot'], ['l', 'rb', 'dash'], ['n', 'a'], ['a', 'ok', 'hot'], ['rb', 'ok', 'dash']],
    results: [
      { value: '96%', label: 'n8n workflow automation' },
      { value: '80%+', label: 'client manual time removed' },
      { value: '14h → 45s', label: 'to book a meeting' },
    ],
    proof: [
      { label: 'Tour Booking Automation', projectId: 'tour-booking-automation' },
      { label: 'AI Meeting Scheduler', projectId: 'ai-meeting-scheduler' },
    ],
    voFix: 'This is workflow automation. Triggers start smart pipelines, locks prevent collisions, and failures roll back on their own.',
    voResult: 'Over eighty percent of manual work removed. Meetings booked in forty-five seconds, not fourteen hours.',
  },
  {
    id: 'integration',
    mini: 'locked',
    problemTitle: 'Our systems don’t talk',
    quote: '“Our AI is smart — but it can’t reach our tools or data.”',
    pain: 'Powerful models stuck outside the business, or let in unsafely.',
    question: 'Your AI is brilliant, but it can’t touch your database. Do you hand it the keys?',
    choices: [
      { label: 'Yes — full access', reply: 'Risky. One bad call and it’s in everything. There’s a safer way.' },
      { label: 'No — build it a safe door', reply: 'Exactly. That door has a name: the Model Context Protocol.' },
    ],
    skill: 'Tool integration & APIs',
    skillLine: 'A safe door between AI and your systems.',
    approach: 'MCP servers give agents typed, validated tools. FastAPI services and Supabase connect the data. Every call is schema-checked and logged, so the AI gets power and you keep control.',
    tools: ['MCP', 'FastAPI', 'Pydantic', 'Supabase', 'PostgreSQL / SQL'],
    nodes: [
      { id: 'a', x: 70, y: 170, label: 'AI agent', kind: 'in', step: 0 },
      { id: 'm', x: 210, y: 170, label: 'MCP server', kind: 'core', step: 1 },
      { id: 'p', x: 350, y: 170, label: 'Validate + log', kind: 'human', step: 2 },
      { id: 'd', x: 500, y: 85, label: 'Database', kind: 'out', step: 3 },
      { id: 'x', x: 500, y: 255, label: 'Business APIs', kind: 'out', step: 3 },
    ],
    edges: [['a', 'm'], ['m', 'p'], ['p', 'd', 'hot'], ['p', 'x', 'hot']],
    results: [
      { value: '90%', label: 'MCP (Model Context Protocol)' },
      { value: '90%', label: 'FastAPI & Supabase' },
      { value: '< 5ms', label: 'validated tool calls' },
    ],
    proof: [{ label: 'Expense MCP Server', projectId: 'expense-mcp-server' }, { label: 'MedFlow AI (MCP tools)', projectId: 'medflow-ai' }],
    voFix: 'This is tool integration. A Model Context Protocol server gives the AI a safe door: every tool call typed, validated, and logged.',
    voResult: 'The AI gets real power. The company keeps control.',
  },
  {
    id: 'data',
    mini: 'messy',
    problemTitle: 'Our data is a mess',
    quote: '“Our insights are trapped in scanned PDFs and messy spreadsheets.”',
    pain: 'No clean data means no reliable models, and decisions made on gut feeling.',
    question: 'Your best insights are buried in scanned PDFs and messy spreadsheets. Can a model learn from that, right now?',
    choices: [
      { label: 'Sure, just feed it in', reply: 'Garbage in, garbage out. The model is only as good as its data.' },
      { label: 'Not until it’s cleaned', reply: 'Right. And cleaning it is where Talha starts.' },
    ],
    skill: 'Machine learning & data',
    skillLine: 'From messy files to models you can trust.',
    approach: 'OCR pipelines digitize documents. Cleaning removes outliers and fills gaps. Feature engineering shapes the signal, and models such as Random Forest, Ridge and Lasso are trained and evaluated properly.',
    tools: ['OCR', 'Python', 'Scikit-learn', 'Feature engineering', 'Random Forest'],
    nodes: [
      { id: 'r', x: 70, y: 170, label: 'Scans & sheets', kind: 'in', step: 0 },
      { id: 'o', x: 200, y: 170, label: 'OCR extraction', kind: 'core', step: 1 },
      { id: 'c', x: 330, y: 95, label: 'Cleaning', step: 2 },
      { id: 'f', x: 330, y: 245, label: 'Features', step: 2 },
      { id: 'm', x: 455, y: 170, label: 'Trained model', kind: 'core', step: 3 },
      { id: 'i', x: 548, y: 170, label: 'Insight', kind: 'out', step: 4 },
    ],
    edges: [['r', 'o'], ['o', 'c'], ['o', 'f'], ['c', 'm'], ['f', 'm'], ['m', 'i', 'hot']],
    results: [
      { value: '92%', label: 'data cleaning & preprocessing' },
      { value: '90%', label: 'OCR & document digitization' },
      { value: '88%', label: 'Random Forest & tree models' },
    ],
    proof: [{ label: 'OCR pipelines for global Fiverr clients' }],
    voFix: 'This is machine learning, done properly. Documents are digitized, data is cleaned, features are engineered, and models are trained and tested.',
    voResult: 'Manual transcription gone. Decisions made on data, not gut feeling.',
  },
  {
    id: 'core',
    mini: 'search',
    problemTitle: 'Everything slows down as we grow',
    quote: '“It worked for a hundred users. Now it crawls.”',
    pain: 'Slow searches, rising costs, and code that can’t keep up.',
    question: 'Your product works fine for a hundred users. What happens at a hundred thousand?',
    choices: [
      { label: 'Buy bigger servers', reply: 'That buys time, not speed. The real fix is in the code.' },
      { label: 'Use better algorithms', reply: 'Yes. The right data structure beats a bigger server every time.' },
    ],
    skill: 'Core engineering',
    skillLine: 'The foundations that make everything else fast.',
    approach: 'Strong fundamentals in Python, C++ and SQL. Graphs, trees and hashing chosen for the job, with complexity measured rather than guessed, so systems stay fast as they grow.',
    tools: ['Python', 'C++', 'Data structures & algorithms', 'SQL', 'TypeScript'],
    nodes: [
      { id: 's', x: 70, y: 170, label: 'Start', kind: 'in', step: 0 },
      { id: 'a', x: 190, y: 80, label: 'Layer 1', step: 1 },
      { id: 'b', x: 190, y: 170, label: 'Layer 1', step: 1 },
      { id: 'c', x: 190, y: 260, label: 'Layer 1', step: 1 },
      { id: 'd', x: 320, y: 115, label: 'Layer 2', step: 2 },
      { id: 'e', x: 320, y: 225, label: 'Layer 2', step: 2 },
      { id: 'f', x: 445, y: 170, label: 'Layer 3', step: 3 },
      { id: 't', x: 548, y: 170, label: 'Found fast', kind: 'out', step: 4 },
    ],
    edges: [['s', 'a'], ['s', 'b', 'hot'], ['s', 'c'], ['a', 'd'], ['b', 'd', 'hot'], ['c', 'e'], ['d', 'f', 'hot'], ['e', 'f'], ['f', 't', 'hot']],
    results: [
      { value: '95%', label: 'Python' },
      { value: '88%', label: 'C++' },
      { value: 'O(V+E)', label: 'shortest-path search, built from scratch' },
    ],
    proof: [{ label: 'Movie Manager & Graph Engine', projectId: 'movie-manager' }],
    voFix: 'This is core engineering. The right data structure, the right algorithm, measured, not guessed.',
    voResult: 'Systems that stay fast as they grow.',
  },
];
