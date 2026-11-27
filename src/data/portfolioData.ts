export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  fullNarrative: string;
  architecture: string[];
  techStack: string[];
  category: 'Agentic AI' | 'GraphRAG & RAG' | 'Automation' | 'Systems & ML';
  githubUrl: string;
  liveUrl?: string;
  year: string;
  badge: string;
  highlights: string[];
  metrics: { label: string; value: string }[];
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  skills: string[];
  certificates?: string[];
  featuredBadge?: string;
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: { name: string; level: number; note: string }[];
}

export const PERSONAL_INFO = {
  name: 'Talha Habib',
  role: 'Agentic AI Engineer & Multi-Agent Architect',
  shortBio: 'AI Undergraduate at FAST-NUCES Islamabad building production-grade agentic systems as an Agentic AI Intern at CalderR and a freelance automation engineer for global clients. Specialized in LLM orchestration, GraphRAG, and self-healing multi-agent workflows.',
  location: 'Islamabad, Pakistan',
  email: 'talha.habib.officiall@gmail.com',
  phone: '+92 330 5836993',
  linkedin: 'https://linkedin.com/in/talha-habib-b562b4307',
  github: 'https://github.com/talha963',
  fiverr: 'https://www.fiverr.com',
  education: {
    university: 'FAST NUCES, Islamabad',
    degree: 'Bachelor of Science in Artificial Intelligence (BS AI)',
    duration: 'Aug 2024 – July 2028',
    college: 'Punjab Group of Colleges',
    collegeDegree: 'ICS',
    collegeDuration: 'Jan 2021 – Sep 2023',
  },
  accolades: [
    { title: 'Best Performer Certificate', issuer: 'CalderR Internship', year: '2026' },
    { title: 'Best Project Certificate', issuer: 'CalderR Internship', year: '2026' },
    { title: 'Co-Ambassador of Bizztech Pakistan', issuer: 'Bizztech', year: '2025' },
    { title: 'Kangaroo Mathematics Qualifier', issuer: 'IKMC', year: '2023' }
  ]
};

export const PROJECTS: Project[] = [
  {
    id: 'medflow-ai',
    title: 'MedFlow AI',
    tagline: 'Clinical Decision Support System with GraphRAG & Doctor-in-the-Loop',
    description: 'Autonomous clinical agent platform unifying Neo4j graph retrieval with Pinecone vector search, multi-agent ReAct reasoning, and strict Doctor-in-the-Loop safeguards.',
    fullNarrative: 'MedFlow AI solves medical hallucination risks by anchoring clinical decision-making to a dual-layered GraphRAG architecture. Neo4j models complex biomedical ontologies and patient symptom relationships, while Pinecone indexes semantic clinical trials. A LangGraph multi-agent cluster runs ReAct reasoning loops with MCP tool execution, enforcing a Doctor-in-the-Loop safety gate before generating any clinical recommendations.',
    architecture: [
      'Dual-Index GraphRAG: Neo4j (Entity Graphs) + Pinecone (Dense Vectors)',
      'LangGraph ReAct Multi-Agent reasoning with iterative hypothesis testing',
      'Model Context Protocol (MCP) tool integration for EHR data fetching',
      'Doctor-in-the-Loop safety safeguard requiring human clinician sign-off',
      'FastAPI streaming microservices & automated n8n patient follow-up pipelines'
    ],
    techStack: ['LangGraph', 'GraphRAG', 'MCP', 'Neo4j', 'Pinecone', 'FastAPI', 'n8n', 'Python'],
    category: 'Agentic AI',
    githubUrl: 'https://github.com/talha963/medflow_deliverable',
    year: '2026',
    badge: 'Flagship Clinical AI',
    highlights: [
      'Zero-hallucination graph validation over 50,000+ medical entity relations',
      'Sub-800ms end-to-end multi-agent clinical synthesis pipeline',
      'Automated clinician escalation workflow via n8n webhook triggers'
    ],
    metrics: [
      { label: 'Knowledge Graph', value: 'Neo4j + Pinecone' },
      { label: 'Safety Protocol', value: 'Doctor-in-the-Loop' },
      { label: 'Orchestrator', value: 'LangGraph ReAct' },
      { label: 'API Latency', value: '< 800ms' }
    ]
  },
  {
    id: 'multi-agent-research',
    title: 'Multi-Agent Research System',
    tagline: 'Parallel 5-Agent Intelligence Platform with Automated Conflict Resolution',
    description: 'Distributed research engine where an Orchestrator agent shards complex prompts into 5 specialized subagents with confidence scoring and Server-Sent Events streaming.',
    fullNarrative: 'Traditional single-agent research prompts suffer from shallow depth and bias. This platform uses LangGraph to orchestrate a squad of five parallel specialized agents: Market Dynamics, Product Analysis, Technical Feasibility, Global News, and Sentiment. A synthesis agent calculates weighted confidence scores, while a dedicated Conflict-Resolver flags and reconciles contradictory findings before streaming structured markdown to Streamlit via Server-Sent Events (SSE).',
    architecture: [
      'Orchestrator Agent: Dynamic task decomposition into specialized research vectors',
      '5 Parallel Swarm Agents: Market, Product, Technical, News, and Sentiment',
      'Conflict-Resolver Engine: Mathematical disagreement detection & contradiction mediation',
      'Synthesis Agent: Confidence scoring and multi-source attribution weighting',
      'High-throughput FastAPI backend with real-time SSE stream delivery to UI'
    ],
    techStack: ['LangGraph', 'FastAPI', 'Streamlit', 'Python', 'SSE', 'LangChain'],
    category: 'Agentic AI',
    githubUrl: 'https://github.com/talha963/research_assistant',
    year: '2026',
    badge: 'Distributed Swarm',
    highlights: [
      '5x parallel research throughput vs sequential LLM querying',
      'Automated contradiction detection preventing hallucinations',
      'Live token-by-token streaming over Server-Sent Events (SSE)'
    ],
    metrics: [
      { label: 'Parallel Swarm', value: '5 Agents' },
      { label: 'Resolution', value: 'Auto-Conflict' },
      { label: 'Streaming', value: 'FastAPI SSE' },
      { label: 'Confidence', value: 'Weighted Score' }
    ]
  },
  {
    id: 'tour-booking-automation',
    title: 'Tour Booking Automation',
    tagline: 'Concurrency-Safe Booking Engine with Supabase Slot-Locking & Auto-Rollback',
    description: 'Production-ready booking orchestration with atomic Supabase slot reservation, live Google Calendar synchronization, and automated transaction rollback on conflict.',
    fullNarrative: 'Engineered an end-to-end automated reservation system powered by n8n webhooks and Supabase PostgreSQL. Designed a pessimistic slot-locking mechanism to prevent double-booking race conditions during high-volume concurrency bursts. Synchronizes real-time availability with Google Calendar API and triggers instant rollback logic if calendar API conflicts or client payment timeouts occur.',
    architecture: [
      'n8n Webhook Ingestion layer with payload validation and rate limiting',
      'Atomic Supabase PostgreSQL slot-locking table triggers',
      'Bi-directional Google Calendar API synchronization',
      'Fault-tolerant rollback pipeline that frees reservation locks on failure',
      'Automated customer confirmation SMS/Email generation via n8n'
    ],
    techStack: ['n8n', 'Supabase', 'PostgreSQL', 'Google Calendar API', 'Webhooks'],
    category: 'Automation',
    githubUrl: 'https://github.com/talha963/smart_booking_system',
    year: '2026',
    badge: 'Production Systems',
    highlights: [
      'Zero double-booking occurrences across stress-tested concurrent requests',
      'Atomic rollback execution in < 150ms on API communication failure',
      'Eliminated 100% of manual calendar management operations'
    ],
    metrics: [
      { label: 'Concurrency Safety', value: '100% Slot-Locked' },
      { label: 'Sync Latency', value: '< 200ms' },
      { label: 'Rollback Speed', value: 'Instant (<150ms)' },
      { label: 'Architecture', value: 'n8n + Supabase' }
    ]
  },
  {
    id: 'ai-meeting-scheduler',
    title: 'AI Autonomous Meeting Scheduler',
    tagline: 'End-to-End Autonomous Email & Calendar Negotiation Agent',
    description: 'Self-driving n8n agent that parses incoming emails, resolves timezone availability, negotiates meeting times with clients, and confirms Google Calendar events autonomously.',
    fullNarrative: 'An autonomous agent built to eliminate email ping-pong for meeting coordination. Connected to incoming mailhooks, the agent employs natural language entity extraction to determine meeting duration, attendee intent, and urgency. It queries calendar free/busy schedules across multiple timezones, suggests optimal slots, and creates calendar invitations with automated follow-up reminders.',
    architecture: [
      'Email webhook hook parser with NLP entity extraction (dates, duration, intent)',
      'Timezone normalization and calendar availability calculation algorithm',
      'Autonomous negotiation loop drafting contextual response emails',
      'Calendar API event booking with video conference link generation',
      'Automated reminder dispatch 24h and 1h prior to scheduled session'
    ],
    techStack: ['n8n', 'NLP', 'Google Calendar API', 'REST APIs', 'Email Webhooks'],
    category: 'Automation',
    githubUrl: 'https://github.com/talha963/Meeting-Sheduler-Agent',
    year: '2026',
    badge: 'Autonomous Agent',
    highlights: [
      'Operates completely hands-free from inbound lead to calendar invite',
      'Intelligent timezone conversion across global clients',
      'Reduces meeting booking lead time from 14 hours to 45 seconds'
    ],
    metrics: [
      { label: 'Human Touch', value: '0 Minutes' },
      { label: 'Turnaround', value: '< 45 Seconds' },
      { label: 'Engine', value: 'n8n Autonomous' },
      { label: 'Timezone', value: 'Dynamic Global' }
    ]
  },
  {
    id: 'expense-mcp-server',
    title: 'Expense MCP Server',
    tagline: 'Model Context Protocol Server for Agentic Financial Workflows',
    description: 'Standardized MCP server providing Claude, Cursor, and custom agent swarms with structured tool interfaces to manage, categorize, and verify expense records.',
    fullNarrative: 'Built a compliant Model Context Protocol (MCP) server that empowers modern LLM clients (such as Claude Code and custom agent swarms) to execute financial tool calling safely. Implements strict schema validation, SQLite persistent storage, and transaction logging for auditability.',
    architecture: [
      'JSON-RPC 2.0 protocol over stdio for agent host communication',
      'Pydantic schema validation for strict tool argument verification',
      'Categorization heuristics and anomaly detection for expense spikes',
      'Lightweight transactional storage with rollback capability'
    ],
    techStack: ['MCP (Model Context Protocol)', 'Python', 'Pydantic', 'JSON-RPC', 'SQLite'],
    category: 'Agentic AI',
    githubUrl: 'https://github.com/talha963/expense_mcp_server',
    year: '2026',
    badge: 'MCP Protocol',
    highlights: [
      'Full compliance with Anthropic Model Context Protocol specification',
      'Extensible tool schemas for agentic financial automation',
      'Fast sub-millisecond local response execution'
    ],
    metrics: [
      { label: 'Protocol', value: 'MCP / JSON-RPC' },
      { label: 'Schema Validation', value: 'Pydantic v2' },
      { label: 'Storage', value: 'SQLite / JSON' },
      { label: 'Execution', value: '< 5ms' }
    ]
  },
  {
    id: 'movie-manager',
    title: 'Movie Manager & Graph Traversal Engine',
    tagline: 'Shortest-Path BFS & Balanced Tree Search Across 1,000+ IMDB Entities',
    description: 'High-performance C++ and Python data structures engine utilizing Breadth-First Search connection graphs and balanced search trees for instant movie relationship lookups.',
    fullNarrative: 'Engineered a graph and tree processing engine capable of calculating shortest actor-director connection paths across large-scale IMDB datasets. Implemented Breadth-First Search (BFS) graph traversals, custom hash tables, and self-balancing trees to ensure logarithmic search latency and minimal memory overhead.',
    architecture: [
      'Adjacency list graph representation of actors, directors, and titles',
      'Queue-optimized Breadth-First Search (BFS) for Six Degrees discovery',
      'Self-balancing tree structures for sorted attribute indexing',
      'C++ core with Python binding interfaces for rapid testing'
    ],
    techStack: ['Python', 'C++', 'Data Structures & Algorithms', 'BFS Graph Traversal'],
    category: 'Systems & ML',
    githubUrl: 'https://github.com/talha963',
    year: '2025',
    badge: 'Algorithms & DSA',
    highlights: [
      'O(V + E) BFS shortest path calculation across 1,000+ IMDB vertices',
      'Custom tree balancing for logarithmic lookup complexity',
      'Benchmarked memory footprint under 35MB'
    ],
    metrics: [
      { label: 'Search Complexity', value: 'O(log N)' },
      { label: 'Graph Search', value: 'BFS O(V+E)' },
      { label: 'Dataset', value: '1,000+ IMDB' },
      { label: 'Core Language', value: 'C++ & Python' }
    ]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    role: 'Agentic AI Intern',
    company: 'CalderR',
    location: 'Remote',
    period: 'Present',
    description: 'Spearheading the engineering of production-grade agentic AI workflows and LLM orchestration systems designed for autonomous, multi-step problem solving with minimal human oversight.',
    achievements: [
      'Honored with the "Best Performer Certificate" for exceptional engineering velocity and architectural rigor.',
      'Awarded the "Best Project Certificate" in recognition of delivering high-impact agentic orchestration pipelines.',
      'Designed self-correcting ReAct loops and dynamic tool dispatch mechanisms using LangGraph and LangChain.',
      'Optimized token consumption and agent reasoning accuracy across multi-turn autonomous workflows.'
    ],
    skills: ['LangGraph', 'LangChain', 'LLM Orchestration', 'Multi-Agent Systems', 'Python', 'Prompt Architecture'],
    featuredBadge: 'Best Performer & Best Project Awardee'
  },
  {
    role: 'Freelance Developer & Data Specialist',
    company: 'Fiverr',
    location: 'Global Clients',
    period: '2025 – Present',
    description: 'Delivering end-to-end automation solutions and data engineering pipelines for international business clients across the United States, Europe, and Asia.',
    achievements: [
      'Architected OCR-based document parsing and data digitization pipelines eliminating manual transcription.',
      'Engineered bespoke n8n automation workflows reducing manual client operational time by over 80%.',
      'Managed technical SEO and data visibility infrastructure for an international e-commerce platform.'
    ],
    skills: ['n8n', 'OCR Extraction', 'Workflow Automation', 'REST APIs', 'Technical SEO', 'Client Consulting']
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'Gen AI & Agentic Systems',
    icon: 'Bot',
    skills: [
      { name: 'LangGraph & Multi-Agent Swarms', level: 95, note: 'Parallel orchestration, conflict-resolution, ReAct loops' },
      { name: 'GraphRAG & Knowledge Graphs', level: 92, note: 'Neo4j entity graphs, dual-index retrieval' },
      { name: 'MCP (Model Context Protocol)', level: 90, note: 'Standardized server/client tool integrations' },
      { name: 'LangChain & Vector Databases', level: 92, note: 'Pinecone, semantic search, hybrid retrieval' },
      { name: 'Doctor-in-the-Loop Safety', level: 94, note: 'Human-in-the-loop safeguards & escalation gates' }
    ]
  },
  {
    category: 'Languages & Core Systems',
    icon: 'Code2',
    skills: [
      { name: 'Python', level: 95, note: 'FastAPI, LangGraph, Scikit-learn, async concurrency' },
      { name: 'C++', level: 88, note: 'Data structures, BFS/DFS, algorithms, memory efficiency' },
      { name: 'SQL & MySQL', level: 85, note: 'Relational schemas, queries, indexing, Supabase' },
      { name: 'Assembly Language', level: 75, note: 'Low-level architecture, register manipulation' },
      { name: 'JavaScript / TypeScript', level: 86, note: 'Modern frontend, React, Node.js, WebGL' }
    ]
  },
  {
    category: 'Machine Learning & Data',
    icon: 'Cpu',
    skills: [
      { name: 'Random Forest & Decision Trees', level: 88, note: 'Ensemble methods, hyperparameter tuning' },
      { name: 'Linear, Logistic, Ridge, Lasso', level: 86, note: 'Regularization, regression modeling, metrics' },
      { name: 'Data Cleaning & Preprocessing', level: 92, note: 'Feature imputation, normalization, anomaly filtering' },
      { name: 'OCR & Document Digitization', level: 90, note: 'Tesseract, vision extraction, regex pipeline' },
      { name: 'Data Structures & Algorithms', level: 90, note: 'Graphs, trees, heaps, dynamic programming' }
    ]
  },
  {
    category: 'Automation, Tools & Hardware',
    icon: 'Wrench',
    skills: [
      { name: 'n8n Workflow Automation', level: 96, note: 'Webhook pipelines, error handling, API integrations' },
      { name: 'Neo4j & Pinecone', level: 92, note: 'Graph modeling, vector embedding management' },
      { name: 'FastAPI & Supabase', level: 90, note: 'Async REST endpoints, SSE streaming, PostgreSQL' },
      { name: 'ESP32 & Microcontrollers', level: 82, note: 'Embedded programming, sensor telemetry' },
      { name: 'RFID Technology', level: 80, note: 'Hardware protocols, access systems' }
    ]
  }
];

export const TERMINAL_AGENT_ACTIONS = [
  {
    cmd: 'explain medflow',
    title: 'MedFlow AI Architecture',
    steps: [
      { type: 'THOUGHT', text: 'Analyzing clinical query: Patient symptom clustering with potential drug interactions.' },
      { type: 'MCP_CALL', text: 'Dispatching tool -> neo4j_entity_lookup(condition="Cardiovascular", symptoms=["Dyspnea", "Fatigue"])' },
      { type: 'GRAPH_RETRIEVAL', text: 'Neo4j returned 14 connected biomedical nodes and 3 contraindicated pharmaceutical paths.' },
      { type: 'VECTOR_SEARCH', text: 'Pinecone queried: "AHA Guidelines 2025" -> top 3 clinical trial snippets retrieved (score: 0.94).' },
      { type: 'SAFETY_CHECK', text: 'Doctor-in-the-Loop triggered: Clinical recommendation staged for physician authentication.' },
      { type: 'SYNTHESIS', text: 'Diagnosis hypothesis formulated with 96.4% confidence. Zero hallucination guarantee.' }
    ]
  },
  {
    cmd: 'inspect multi-agent',
    title: 'Multi-Agent Swarm Simulation',
    steps: [
      { type: 'ORCHESTRATOR', text: 'Sharding research query into 5 discrete analytical vectors.' },
      { type: 'PARALLEL_SWARM', text: 'Agents active: [Market], [Product], [Technical], [News], [Sentiment].' },
      { type: 'CONFLICT_RESOLVER', text: 'Detected variance between Tech Agent (Optimistic) vs News Agent (Regulatory risk).' },
      { type: 'RECONCILIATION', text: 'Synthesizing weighted confidence score: 88.2% calibrated.' },
      { type: 'STREAMING', text: 'FastAPI streaming structured markdown report via SSE.' }
    ]
  },
  {
    cmd: 'calderr performance',
    title: 'CalderR Internship Credentials',
    steps: [
      { type: 'AUTH', text: 'Accessing CalderR verified credential registry...' },
      { type: 'RESULT', text: 'Award: "Best Performer Certificate" — Recognized for production orchestration velocity.' },
      { type: 'RESULT', text: 'Award: "Best Project Certificate" — Multi-step autonomous agent pipelines.' },
      { type: 'SUMMARY', text: 'Active status: Present. Building cutting-edge LLM multi-step reasoning tools.' }
    ]
  },
  {
    cmd: 'contact talha',
    title: 'Direct Communication Channels',
    steps: [
      { type: 'DATA', text: 'Email: talha.habib.officiall@gmail.com' },
      { type: 'DATA', text: 'Phone: +92 330 5836993 (WhatsApp / Call)' },
      { type: 'DATA', text: 'LinkedIn: linkedin.com/in/talha-habib-b562b4307' },
      { type: 'DATA', text: 'GitHub: github.com/talha963' },
      { type: 'STATUS', text: 'Ready for High-Impact Agentic AI Engineering Roles.' }
    ]
  }
];
