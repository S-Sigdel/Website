export const LINKS = [
  { label: "GitHub", href: "https://github.com/S-Sigdel" },
  { label: "GitLab", href: "https://gitlab.com/S-Sigdel" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sakshyam-sigdel-74b8a6232/" },
  { label: "Résumé", href: "/Resume.pdf" },
];

export interface Project {
  title: string;
  desc: string;
  stack: string;
  href?: string;
  note?: string;
  writeup?: string;
  // Either a screenshot or a few lines of the real thing
  image?: string;
  snippet?: string[];
}

export const PROJECTS: Project[] = [
  {
    title: "Wildfire CNN→VLM cascade",
    desc: "Two-tier smoke detection for Jetson-class edge hardware. A ~1 ms YOLO gate clears most frames and escalates only uncertain ones to a fine-tuned Gemma vision-language model that returns structured JSON.",
    stack: "Python · YOLO · Gemma · Jetson",
    note: "Paper",
    snippet: [
      "frame → YOLO smoke gate (~1 ms)",
      "  p < 0.20     → CLEAR",
      "  0.20 – 0.85  → Gemma VLM → JSON",
      "  p ≥ 0.85     → SMOKE_HIGH",
    ],
  },
  {
    title: "Curtain",
    desc: "Load-balanced web service with a PostgreSQL fallback and Redis-sharded ingestion with async stream consumers, watched in Grafana.",
    stack: "Python · Redis · PostgreSQL · Docker",
    href: "https://github.com/S-Sigdel/Curtain",
    image: "/curtain2.png",
  },
  {
    title: "vimhjkl",
    desc: "Drills the Vim techniques vimtutor skips, in real vim, graded on your keystrokes. 230 challenges across 66 skills.",
    stack: "Python · Vim",
    href: "https://github.com/S-Sigdel/vimhjkl",
    note: "AUR · Homebrew",
    image: "/vimhjkl.png",
  },
  {
    title: "SenseNav",
    desc: "LiDAR obstacle detection turned into 360° spatial audio, so you can hear where things are. Arduino and custom circuitry.",
    stack: "C++ · Arduino",
    href: "https://github.com/S-Sigdel/SenseNav",
    image: "/sensenavmidas.jpeg",
  },
  {
    title: "hyprdrover",
    desc: "Snapshots and restores Hyprland window layouts: workspaces, positions, sizes, and the apps that were open.",
    stack: "Rust",
    href: "https://github.com/S-Sigdel/hyprdrover",
    note: "AUR",
    image: "/hyprdrover.png",
  },
  {
    title: "Bionic arm hand tracking",
    desc: "OpenCV hand tracking that drives the servos of a 3D-printed prosthetic arm in real time.",
    stack: "Python · OpenCV · Arduino",
    href: "https://github.com/S-Sigdel/handTrackingForBionicArm",
    image: "/handTracking.png",
  },
];

export interface Contribution {
  project: string;
  desc: string;
  date: string;
  href: string;
  writeup?: string;
}

export const OPEN_SOURCE: Contribution[] = [
  {
    project: "procps-ng",
    desc: "Fixed vmstat reporting context switches roughly 800x too low on its first line, a bug in every release since 2023.",
    date: "Oct 2026",
    href: "https://gitlab.com/procps-ng/procps/-/merge_requests/310",
    writeup: "/blog/vmstat-one-word-fix",
  },
];

export interface Experience {
  role: string;
  org: string;
  period: string;
  where: string;
  note?: string;
  bullets: string[];
}

export const EXPERIENCE: Experience[] = [
  {
    role: "MLH Fellow, Production Engineering",
    org: "Major League Hacking × Meta",
    period: "Summer 2026",
    where: "Remote",
    bullets: [
      "Worked in a pod of 13 fellows mentored by Meta production engineers, talking through how production systems fail and debugging production-style incidents together.",
      "Had weekly one-on-ones with mentors, and presented the /proc chapter in the pod's Linux study sessions.",
      "Practiced the production engineering stack end to end: Linux, Bash, databases, Docker, Nginx, CI/CD, monitoring and networking.",
    ],
  },
  {
    role: "Undergraduate Researcher, Agentic AI Systems",
    org: "University of Southern Mississippi",
    period: "Jan 2026 – Present",
    where: "Hattiesburg, MS",
    note: "PI: Dr. Rabab Abdelfattah",
    bullets: [
      "Building a Python orchestration layer that connects smoke and fire detection models to planning agents for autonomous UAV flight decisions.",
      "Designed a replayable logging pipeline for agent decision traces, so multi-agent runs can be evaluated and debugged reproducibly.",
    ],
  },
];

export interface Hackathon {
  title: string;
  event: string;
  prize?: string;
  image?: string;
  desc?: string;
  href: string;
}

export const HACKATHONS: Hackathon[] = [
  {
    title: "Hermes",
    event: "Midnight Hackathon",
    prize: "AI Track",
    image: "/hermes.jpg",
    desc: "Anonymous forum where you prove karma, age and membership with zero-knowledge proofs.",
    href: "https://devpost.com/software/hermes-7txsej",
  },
  {
    title: "Acroswe",
    event: "HackPrinceton Spring 2025",
    prize: "Best Use of Blockchain + AI",
    image: "/acroswefrontend.jpg",
    desc: "Home price prediction, with purchases settled as NFTs on-chain.",
    href: "https://devpost.com/software/acroswe",
  },
  {
    title: "noBrainstorm",
    event: "Hack@Davidson 2025",
    prize: "Second Overall",
    image: "/nobrainstormgraph.png",
    desc: "Whiteboard that turns brainstorms into graphs, plans and to-do lists with AI.",
    href: "https://devpost.com/software/nobrainstorm",
  },
  {
    title: "Curtain",
    event: "MLH Production Engineering Hackathon",
    prize: "Scalability Track",
    image: "/curtain1.jpg",
    desc: "Load-balanced service with Redis sharding and a PostgreSQL fallback.",
    href: "https://devpost.com/software/curtain",
  },
  { title: "Zepic", event: "LA Hacks 2026", href: "https://devpost.com/software/zepic" },
  { title: "SpecGuardian", event: "GitLab AI Hackathon", href: "https://devpost.com/software/viewtower" },
  { title: "Tribe28", event: "Team USA × Google Cloud Hackathon", href: "https://devpost.com/software/propeller" },
  { title: "Richie Rich", event: "HackPrinceton Fall 2025", href: "https://devpost.com/software/richie-rich" },
  { title: "Ripple", event: "UMiami Horizon AI Hackathon 2025", href: "https://devpost.com/software/ripple-dkzc4j" },
  { title: "NightSeeker", event: "Midnight Hackathon", href: "https://devpost.com/software/nightseeker" },
];

export const DEVPOST = "https://devpost.com/S-Sigdel";
