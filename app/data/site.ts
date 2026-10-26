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

export const HACKATHONS = [
  { title: "Acroswe", where: "Princeton", won: true, href: "https://devpost.com/software/acroswe" },
  { title: "noBrainstorm", where: "Davidson College", won: true, href: "https://devpost.com/software/nobrainstorm" },
  { title: "Richie Rich", where: "Princeton", href: "https://devpost.com/software/richie-rich" },
  { title: "Ripple", where: "University of Miami", href: "https://devpost.com/software/ripple" },
  { title: "NightSeeker", where: "Online", href: "https://devpost.com/software/nightseeker" },
];

export const DEVPOST = "https://devpost.com/S-Sigdel";
