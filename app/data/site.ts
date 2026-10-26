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
  href: string;
  note?: string;
}

export const PROJECTS: Project[] = [
  {
    title: "Wildfire CNN→VLM cascade",
    desc: "Two-tier smoke detection for Jetson-class edge hardware. A ~1 ms YOLO gate clears most frames and escalates only uncertain ones to a fine-tuned Gemma vision-language model that returns structured JSON.",
    stack: "Python · YOLO · Gemma · Jetson",
    href: "https://github.com/S-Sigdel/wildfire-cnn-vlm-cascade",
    note: "Paper",
  },
  {
    title: "vimhjkl",
    desc: "Drills the Vim techniques vimtutor skips, in real vim, graded on your keystrokes. 230 challenges across 66 skills.",
    stack: "Python · Vim",
    href: "https://github.com/S-Sigdel/vimhjkl",
    note: "AUR · Homebrew",
  },
  {
    title: "hyprdrover",
    desc: "Snapshots and restores Hyprland window layouts: workspaces, positions, sizes, and the apps that were open.",
    stack: "Rust",
    href: "https://github.com/S-Sigdel/hyprdrover",
  },
  {
    title: "Memory allocator",
    desc: "A dynamic memory allocator written from scratch in C, following the GNU malloc interface.",
    stack: "C",
    href: "https://github.com/S-Sigdel/Memory-Allocator-in-C",
  },
  {
    title: "Curtain",
    desc: "Load-balanced web service with a PostgreSQL fallback and Redis-sharded ingestion with async stream consumers.",
    stack: "Python · Redis · PostgreSQL · Docker",
    href: "https://github.com/S-Sigdel/Curtain",
    note: "Won Scalability Track, MLH Production Engineering Hackathon",
  },
  {
    title: "SenseNav",
    desc: "LiDAR obstacle detection turned into 360° spatial audio, so you can hear where things are. Arduino and custom circuitry.",
    stack: "C++ · Arduino",
    href: "https://github.com/S-Sigdel/SenseNav",
  },
  {
    title: "Bionic arm hand tracking",
    desc: "OpenCV hand tracking that drives the servos of a 3D-printed prosthetic arm in real time.",
    stack: "Python · OpenCV · Arduino",
    href: "https://github.com/S-Sigdel/handTrackingForBionicArm",
  },
  {
    title: "Switchback",
    desc: "Offline spaced-repetition trainer for the NeetCode 150. Standard-library Python, no accounts.",
    stack: "Python",
    href: "https://github.com/S-Sigdel/switchback",
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
      "Selected for the 12-week Production Engineering track MLH runs with Meta, working in a small pod mentored by Meta production engineers.",
      "Took a Flask service from localhost to production: Linux server setup, Bash automation, a SQL database, Docker containers behind Nginx, and GitHub Actions CI/CD gated on automated tests.",
      "Instrumented services with Prometheus and Grafana, then used them to load-test, find bottlenecks, and troubleshoot networking and service failures.",
      "Shipped every change through issues, branches, and reviewed pull requests, and finished with Meta-style production engineering interviews.",
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
  href: string;
}

export const HACKATHONS: Hackathon[] = [
  { title: "Hermes", event: "Midnight Hackathon", prize: "AI Track", href: "https://devpost.com/software/hermes-7txsej" },
  { title: "Acroswe", event: "HackPrinceton Spring 2025", prize: "Best Use of Blockchain + AI", href: "https://devpost.com/software/acroswe" },
  { title: "noBrainstorm", event: "Hack@Davidson 2025", prize: "Second Overall", href: "https://devpost.com/software/nobrainstorm" },
  { title: "Curtain", event: "MLH Production Engineering Hackathon", prize: "Scalability Track", href: "https://devpost.com/software/curtain" },
  { title: "Zepic", event: "LA Hacks 2026", href: "https://devpost.com/software/zepic" },
  { title: "SpecGuardian", event: "GitLab AI Hackathon", href: "https://devpost.com/software/viewtower" },
  { title: "Tribe28", event: "Team USA × Google Cloud Hackathon", href: "https://devpost.com/software/propeller" },
  { title: "Richie Rich", event: "HackPrinceton Fall 2025", href: "https://devpost.com/software/richie-rich" },
  { title: "Ripple", event: "UMiami Horizon AI Hackathon 2025", href: "https://devpost.com/software/ripple-dkzc4j" },
  { title: "NightSeeker", event: "Midnight Hackathon", href: "https://devpost.com/software/nightseeker" },
];

export const DEVPOST = "https://devpost.com/S-Sigdel";
