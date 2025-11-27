export interface Project {
  title: string;
  desc: string;
  languages: string[];
  color?: string;
  link?: string;
  images: string[];
  location?: string;
  isDevpost?: boolean;
  isWinner?: boolean;
}

export const PROJECTS: Project[] = [
    {
      title: "SenseNav",
      desc: "Spatial audio navigation system combining LiDAR obstacle detection with 360° spatial audio feedback. Built with Arduino and custom circuitry for real-time processing. Features binaural panning, distance-based audio cues, and obstacle prioritization for enhanced accessibility.",
      languages: ["Arduino", "C++", "Circuitry"],
      color: "text-blue",
      link: "https://github.com/S-Sigdel/SenseNav",
      images: ["/senseNav.jpeg", "/sensenavmidas.jpeg"],
      location: "MIT, Cambridge"
    },
    {
      title: "Hand Tracking for Bionic Arm",
      desc: "Computer vision system for controlling a bionic arm using hand tracking. Python-based OpenCV processing with Arduino servo control for real-time gesture recognition and prosthetic manipulation.",
      languages: ["Python", "Arduino", "OpenCV"],
      color: "text-pink",
      link: "https://github.com/S-Sigdel/handTrackingForBionicArm",
      images: ["/handTracking.png", "/realtimeHandTracking.png", "/3dprintedmodel.png"]
    },
    {
      title: "Devpost Portfolio",
      desc: "Collection of hackathon projects showcasing full-stack development, AI/ML integration, and innovative solutions across multiple domains.",
      languages: ["Python", "JavaScript", "TypeScript", "Blockchain"],
      color: "text-peach",
      link: "https://devpost.com/S-Sigdel?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav",
      images: [],
      isDevpost: true
    }
];

export const DEVPOST_PROJECTS: Project[] = [
    {
      title: "Richie Rich",
      desc: "AI-powered financial assistant that helps you spend smarter and grow wealth effortlessly. Combines transaction data, receipts, and AI insights to find better deals, save more, and invest the difference in stocks.",
      languages: ["Capital One API", "Next.js", "TypeScript", "Gemini", "GPT", "Python"],
      link: "https://devpost.com/software/richie-rich",
      location: "Princeton University, Princeton",
      images: ["/richierichdashboard.jpg", "/richierichsavingopportunities.jpg"]
    },
    {
      title: "NightSeeker",
      desc: "Identity verification system that proves your skills, not your identity. Secure authentication platform for developers and professionals.",
      languages: ["Midnight Blockchain", "Next.js", "OpenAI"],
      link: "https://devpost.com/software/nightseeker",
      location: "Online",
      images: ["/nightseekerEndorsement.jpg", "/midnightHackathon.png"]
    },
    {
      title: "Acroswe",
      desc: "AI neural networks predict home prices; buy via blockchain NFT/crypto. Secure, instant ownership with smart contracts. Real estate investment made accessible through technology.",
      languages: ["Heuristic ML", "Ethereum", "Web3", "React"],
      link: "https://devpost.com/software/acroswe",
      location: "Princeton University, Princeton",
      images: ["/acroswefrontend.jpg", "/heuristicfunctionacroswe.png"],
      isWinner: true
    },
    {
      title: "Ripple",
      desc: "Learning gamified. Interactive educational platform that makes learning engaging through game mechanics and real-time feedback.",
      languages: ["Cloud Run", "Firebase", "Go", "Next.js", "React", "Tesseract"],
      link: "https://devpost.com/software/ripple",
      location: "University of Miami, Miami",
      images: ["/ripplegamedemo.png", "/RippleWorkflow.jpg"]
    },
    {
      title: "noBrainstorm",
      desc: "The only whiteboard you need. Collaborative whiteboard platform for teams to brainstorm, plan, and create together in real-time.",
      languages: ["Next.js", "OpenAI", "tldraw", "TypeScript"],
      link: "https://devpost.com/software/nobrainstorm",
      location: "Davidson College, Davidson",
      images: ["/approachComparisionNobrainstorm.png", "/nobrainstormgraph.png"],
      isWinner: true
    }
];
