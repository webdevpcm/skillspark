export const DEMO_PASSWORD = 'Password123!';

export const usersSeedData = [
  // --- Seekers ---
  {
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'seeker',
    seekerProfile: {
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
      interests: ['internship', 'job', 'startup project'],
      education: { college: 'UC Berkeley', course: 'B.S. Computer Science', year: '2025' },
      experienceLevel: 'Fresher',
      availability: 'full-time',
      location: 'San Francisco, CA',
      remotePreference: true,
      portfolioLinks: {
        github: 'https://github.com/alexrivera-demo',
        linkedin: 'https://linkedin.com/in/alexrivera-demo',
        projects: 'https://alexrivera-portfolio.dev'
      },
      bio: 'Enthusiastic frontend engineer specializing in responsive modern React applications and clean UI components.'
    }
  },
  {
    name: 'Maya Patel',
    email: 'maya.patel@example.com',
    role: 'seeker',
    seekerProfile: {
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'REST APIs', 'Git'],
      interests: ['job', 'startup project'],
      education: { college: 'Georgia Tech', course: 'M.S. Software Engineering', year: '2024' },
      experienceLevel: 'Junior',
      availability: 'full-time',
      location: 'Atlanta, GA',
      remotePreference: true,
      portfolioLinks: {
        github: 'https://github.com/mayapatel-demo',
        linkedin: 'https://linkedin.com/in/mayapatel-demo',
        projects: 'https://mayapatel-api.dev'
      },
      bio: 'Backend developer focused on scalable microservices, robust relational databases, and clean RESTful APIs.'
    }
  },
  {
    name: 'Liam Chen',
    email: 'liam.chen@example.com',
    role: 'seeker',
    seekerProfile: {
      skills: ['Figma', 'Adobe XD', 'UI/UX', 'Wireframing', 'CSS', 'HTML'],
      interests: ['internship', 'startup project'],
      education: { college: 'Rhode Island School of Design', course: 'B.Des Interaction Design', year: '2025' },
      experienceLevel: 'Fresher',
      availability: 'part-time',
      location: 'New York, NY',
      remotePreference: true,
      portfolioLinks: {
        github: '',
        linkedin: 'https://linkedin.com/in/liamchen-design',
        projects: 'https://behance.net/liamchen-demo'
      },
      bio: 'Passionate UI/UX designer obsessed with intuitive user journeys, accessibility, and high-fidelity prototypes in Figma.'
    }
  },
  {
    name: 'Sophia Zhang',
    email: 'sophia.zhang@example.com',
    role: 'seeker',
    seekerProfile: {
      skills: ['Python', 'SQL', 'Data Analysis', 'Pandas', 'Tableau', 'Excel'],
      interests: ['job', 'learn skills'],
      education: { college: 'University of Washington', course: 'B.S. Informatics & Data Science', year: '2024' },
      experienceLevel: 'Junior',
      availability: 'full-time',
      location: 'Seattle, WA',
      remotePreference: false,
      portfolioLinks: {
        github: 'https://github.com/sophiazhang-data',
        linkedin: 'https://linkedin.com/in/sophiazhang-demo',
        projects: 'https://public.tableau.com/app/profile/sophiazhang'
      },
      bio: 'Data analyst turning complex business datasets into actionable dashboards and predictive statistical models.'
    }
  },
  {
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'seeker',
    seekerProfile: {
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Git', 'Tailwind CSS'],
      interests: ['job', 'startup project'],
      education: { college: 'University of Texas at Austin', course: 'B.S. Electrical & Computer Engineering', year: '2023' },
      experienceLevel: 'Mid',
      availability: 'full-time',
      location: 'Austin, TX',
      remotePreference: true,
      portfolioLinks: {
        github: 'https://github.com/davidkim-fullstack',
        linkedin: 'https://linkedin.com/in/davidkim-demo',
        projects: 'https://davidkim.me'
      },
      bio: 'Full-stack MERN & TypeScript builder with 3 years building end-to-end SaaS products and developer tooling.'
    }
  },

  // --- Entrepreneurs ---
  {
    name: 'Maya Lin (EcoPack Innovations)',
    email: 'maya.lin@ecopack.io',
    role: 'entrepreneur',
    entrepreneurProfile: {
      ventureName: 'EcoPack Innovations',
      tagline: 'Mushroom mycelium packaging replacing toxic polystyrene foams',
      problem: 'Single-use plastic foam packaging produces millions of tons of non-biodegradable landfill waste annually. We engineered scalable, compostable mycelium-based buffers.',
      stage: 'Idea',
      industry: 'CleanTech & Circular Economy',
      lookingFor: ['Technical Co-founder', 'Full-stack Developer', 'Industry Mentor'],
      skillsNeeded: ['React', 'Node.js', 'UI/UX', 'Python', 'Product Management'],
      location: 'San Francisco, CA',
      remote: true,
      pitchDeckUrl: 'https://ecopack-pitch.example.com',
      bio: 'Biomaterials engineer and 2x hackathon winner passionate about eliminating plastic from logistics through biological packaging solutions.'
    }
  },
  {
    name: 'Kavita Rao (FinLearn AI)',
    email: 'kavita.rao@finlearn.io',
    role: 'entrepreneur',
    entrepreneurProfile: {
      ventureName: 'FinLearn AI',
      tagline: 'Hyper-personalized conversational financial literacy tutor for teens',
      problem: 'Young adults enter college and the workforce without practical knowledge of budgeting, credit, and investing. FinLearn AI offers an interactive, gamified AI copilot.',
      stage: 'Building',
      industry: 'EdTech & FinTech',
      lookingFor: ['Technical Co-founder', 'UI/UX Designer', 'Marketing Lead'],
      skillsNeeded: ['React', 'Python', 'FastAPI', 'Figma', 'Content Writing'],
      location: 'Bengaluru, IN',
      remote: true,
      pitchDeckUrl: 'https://finlearn-pitch.example.com',
      bio: 'Former financial analyst turned founder building interactive AI agents to democratize wealth literacy for the next generation.'
    }
  },

  // --- Startups ---
  {
    name: 'Sarah Connor (Nexus Health)',
    email: 'founder@nexushealth.io',
    role: 'startup',
    startupProfile: {
      startupName: 'Nexus Health',
      description: 'AI-assisted medical imaging workflows for early oncology detection in primary care settings.',
      stage: 'Building',
      domain: 'HealthTech & AI',
      skillsNeeded: ['Python', 'Deep Learning', 'React', 'FastAPI'],
      location: 'Boston, MA',
      remote: true,
      website: 'https://nexushealth-ai.example.com'
    }
  },
  {
    name: 'Carlos Mendez (EcoTrack)',
    email: 'carlos@ecotrack.co',
    role: 'startup',
    startupProfile: {
      startupName: 'EcoTrack',
      description: 'Automated Scope 3 carbon accounting platform helping SMBs audit emissions seamlessly.',
      stage: 'Launched',
      domain: 'ClimateTech & Enterprise SaaS',
      skillsNeeded: ['Node.js', 'React', 'PostgreSQL', 'Data Analysis'],
      location: 'Denver, CO',
      remote: true,
      website: 'https://ecotrack-carbon.example.com'
    }
  },
  {
    name: 'Aisha Al-Mansoor (CodeSprint)',
    email: 'aisha@codesprint.edu',
    role: 'startup',
    startupProfile: {
      startupName: 'CodeSprint',
      description: 'Gamified coding challenge platform empowering university students to prepare for tech interviews.',
      stage: 'Idea',
      domain: 'EdTech & Gaming',
      skillsNeeded: ['React', 'JavaScript', 'Node.js', 'UI/UX'],
      location: 'San Jose, CA',
      remote: true,
      website: 'https://codesprint-demo.example.com'
    }
  },
  {
    name: 'Vikram Joshi (FlowPay)',
    email: 'vikram@flowpay.finance',
    role: 'startup',
    startupProfile: {
      startupName: 'FlowPay',
      description: 'Zero-fee instant cross-border settlement rails for digital creators and freelance contractors.',
      stage: 'Building',
      domain: 'FinTech',
      skillsNeeded: ['Go', 'TypeScript', 'PostgreSQL', 'Docker'],
      location: 'New York, NY',
      remote: false,
      website: 'https://flowpay.example.com'
    }
  },
  {
    name: 'Zoe Bennett (OmniStudio)',
    email: 'zoe@omnistudio.ai',
    role: 'startup',
    startupProfile: {
      startupName: 'OmniStudio',
      description: 'Generative design workspace that turns text prompts into multi-screen responsive UI kits.',
      stage: 'Launched',
      domain: 'Generative AI & Design Tools',
      skillsNeeded: ['Figma', 'TypeScript', 'React', 'Python'],
      location: 'San Francisco, CA',
      remote: true,
      website: 'https://omnistudio.example.com'
    }
  },

  // --- Mentors ---
  {
    name: 'Marcus Vance',
    email: 'marcus.vance@mentor.com',
    role: 'mentor',
    mentorProfile: {
      expertiseAreas: ['Fundraising', 'Product Management', 'Leadership', 'Sales'],
      yearsOfExperience: 15,
      experienceType: '2x Venture-backed Founder & Angel Investor',
      currentRole: 'Managing Partner at SeedLaunch Ventures',
      weeklyAvailability: '2-3 hours/week',
      menteePreference: ['founders', 'job seekers'],
      linkedin: 'https://linkedin.com/in/marcusvance-investor',
      bio: 'Advised 40+ early stage teams through seed to Series B rounds. Happy to review pitch decks and go-to-market playbooks.'
    }
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@mentor.com',
    role: 'mentor',
    mentorProfile: {
      expertiseAreas: ['UI/UX', 'Figma', 'Design Systems', 'Wireframing'],
      yearsOfExperience: 10,
      experienceType: 'Product Design Leadership',
      currentRole: 'Staff Product Designer at Stripe',
      weeklyAvailability: '1-2 hours/week',
      menteePreference: ['students', 'job seekers'],
      linkedin: 'https://linkedin.com/in/elenarostova-design',
      bio: 'Obsessed with micro-interactions, systematic design foundations, and helping junior designers build stand-out portfolios.'
    }
  },
  {
    name: 'Dr. Anil Mehta',
    email: 'anil.mehta@mentor.com',
    role: 'mentor',
    mentorProfile: {
      expertiseAreas: ['Python', 'Machine Learning', 'Data Analysis', 'Deep Learning'],
      yearsOfExperience: 14,
      experienceType: 'AI Research & Applied Enterprise ML',
      currentRole: 'Principal AI Scientist at Microsoft',
      weeklyAvailability: '3 hours/week',
      menteePreference: ['students', 'founders'],
      linkedin: 'https://linkedin.com/in/dranilmehta',
      bio: 'Passionate about translating cutting-edge ML research into high-leverage business applications.'
    }
  },
  {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@mentor.com',
    role: 'mentor',
    mentorProfile: {
      expertiseAreas: ['React', 'JavaScript', 'TypeScript', 'Communication'],
      yearsOfExperience: 12,
      experienceType: 'Web Architecture & Engineering Management',
      currentRole: 'VP of Engineering at CloudWave',
      weeklyAvailability: '2 hours/week',
      menteePreference: ['students', 'job seekers', 'founders'],
      linkedin: 'https://linkedin.com/in/sarahjenkins-tech',
      bio: 'Former boot camp grad turned VP of Engineering. Specializing in frontend architecture, career roadmaps, and interview prep.'
    }
  },
  {
    name: 'Rachel Green',
    email: 'rachel.green@mentor.com',
    role: 'mentor',
    mentorProfile: {
      expertiseAreas: ['Digital Marketing', 'SEO', 'Content Writing', 'Growth'],
      yearsOfExperience: 8,
      experienceType: 'B2B Growth & Inbound Demand Gen',
      currentRole: 'Head of Growth at Retool',
      weeklyAvailability: '1 hour/week',
      menteePreference: ['founders', 'job seekers'],
      linkedin: 'https://linkedin.com/in/rachelgreen-growth',
      bio: 'Growth strategist helping early-stage startups establish predictable organic acquisition channels and viral loops.'
    }
  },

  // --- Recruiters ---
  {
    name: 'Samantha Grey (Apex Talent)',
    email: 'sgrey@apextalent.com',
    role: 'recruiter',
    recruiterProfile: {
      companyName: 'Apex Talent Partners',
      companyWebsite: 'https://apextalent.example.com',
      position: 'Senior Technical Recruiter',
      hiringAreas: ['Frontend Development', 'Backend Development', 'Mobile']
    }
  },
  {
    name: 'Jordan Blake (Horizon Ventures)',
    email: 'jordan@horizonventures.com',
    role: 'recruiter',
    recruiterProfile: {
      companyName: 'Horizon Ventures Portfolio Talent',
      companyWebsite: 'https://horizonventures.example.com',
      position: 'Head of Portfolio Talent',
      hiringAreas: ['Full Stack', 'Data & AI', 'Product Management']
    }
  },
  {
    name: 'Priya Sharma (ByteWave Labs)',
    email: 'priya@bytewave.io',
    role: 'recruiter',
    recruiterProfile: {
      companyName: 'ByteWave Labs',
      companyWebsite: 'https://bytewave.example.com',
      position: 'Lead Tech Recruiter',
      hiringAreas: ['Frontend Development', 'Design & UI/UX']
    }
  },
  {
    name: 'Mark Henderson (CloudScale)',
    email: 'mhenderson@cloudscale.net',
    role: 'recruiter',
    recruiterProfile: {
      companyName: 'CloudScale Solutions',
      companyWebsite: 'https://cloudscale.example.com',
      position: 'Director of Talent Acquisition',
      hiringAreas: ['DevOps & Cloud', 'Backend Development', 'Database']
    }
  },
  {
    name: 'Chloe Laurent (NextGen Media)',
    email: 'chloe@nextgenmedia.agency',
    role: 'recruiter',
    recruiterProfile: {
      companyName: 'NextGen Media',
      companyWebsite: 'https://nextgenmedia.example.com',
      position: 'Talent Acquisition Manager',
      hiringAreas: ['Marketing', 'Design & UI/UX', 'Content Writing']
    }
  }
];

export const opportunitiesSeedData = [
  // 1. Matches Alex Rivera with 100 score
  {
    title: 'Frontend Developer Intern',
    type: 'internship',
    description: 'Join our product engineering squad building our customer-facing web dashboard. You will build reusable UI components in React, integrate GraphQL/REST endpoints, and ensure high responsiveness.',
    requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
    niceToHave: ['Git'],
    levels: ['Fresher', 'Student'],
    location: 'San Francisco, CA',
    remote: true,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    ownerRole: 'recruiter',
    ownerIndex: 0 // Apex Talent
  },
  // 2. Matches Alex with 53 score (and missing Figma, Adobe XD)
  {
    title: 'Junior UI/UX Designer',
    type: 'job',
    description: 'We are seeking a junior UI/UX designer to translate user research into high-fidelity mockups, design interactive flows, and collaborate closely with frontend developers.',
    requiredSkills: ['Figma', 'Adobe XD', 'CSS'],
    niceToHave: ['HTML'],
    levels: ['Fresher'],
    location: 'Remote',
    remote: true,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    ownerRole: 'recruiter',
    ownerIndex: 2 // ByteWave Labs
  },
  // 3. Backend role - 0 overlap with Alex Rivera
  {
    title: 'Junior Backend Developer',
    type: 'job',
    description: 'Build robust microservices, optimize database schemas, and create high-throughput event processing pipelines with Node.js and MongoDB.',
    requiredSkills: ['Node.js', 'MongoDB', 'Express'],
    niceToHave: ['Docker'],
    levels: ['Junior'],
    location: 'Austin, TX',
    remote: true,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    ownerRole: 'startup',
    ownerIndex: 1 // EcoTrack
  },
  // 4. Matches Maya Patel strongly
  {
    title: 'Cloud Backend Engineer (Python/Django)',
    type: 'job',
    description: 'Looking for a backend engineer proficient in Python and Django to maintain our core transactional APIs, manage PostgreSQL databases, and deploy onto AWS containers.',
    requiredSkills: ['Python', 'Django', 'PostgreSQL', 'REST APIs'],
    niceToHave: ['Docker', 'AWS'],
    levels: ['Junior', 'Mid'],
    location: 'Atlanta, GA',
    remote: true,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    ownerRole: 'recruiter',
    ownerIndex: 3 // CloudScale
  },
  // 5. Matches Sophia Zhang strongly
  {
    title: 'Junior Data Analyst',
    type: 'job',
    description: 'Extract business insights from relational data marts, build interactive visual dashboards in Tableau, and assist growth leads with cohort retention analyses.',
    requiredSkills: ['Python', 'SQL', 'Data Analysis'],
    niceToHave: ['Tableau', 'Excel'],
    levels: ['Junior', 'Fresher'],
    location: 'Seattle, WA',
    remote: false,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    ownerRole: 'recruiter',
    ownerIndex: 1 // Horizon Ventures
  },
  // 6. Matches David Kim strongly
  {
    title: 'Full Stack Engineer (TypeScript & React)',
    type: 'job',
    description: 'Lead feature development across the stack from our Node.js backends to React/Tailwind frontends. Great opportunity to shape architecture at scale.',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    niceToHave: ['Tailwind CSS', 'Docker'],
    levels: ['Junior', 'Mid'],
    location: 'Remote',
    remote: true,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    ownerRole: 'startup',
    ownerIndex: 3 // FlowPay
  },
  // 7. Matches Liam Chen strongly
  {
    title: 'Product Design & UI/UX Intern',
    type: 'internship',
    description: 'Work alongside senior designers to create component libraries, conduct usability tests, and draft design specs for mobile and desktop web applications.',
    requiredSkills: ['Figma', 'UI/UX', 'Wireframing'],
    niceToHave: ['Adobe XD'],
    levels: ['Student', 'Fresher'],
    location: 'New York, NY',
    remote: true,
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    ownerRole: 'recruiter',
    ownerIndex: 4 // NextGen Media
  },
  // 8. Open-source Startup Project
  {
    title: 'Open Source React Web App Contributor',
    type: 'project',
    description: 'Collaborate with early-stage founders to build an open-source collaborative code challenge web app. Perfect for students wanting real portfolio contributions.',
    requiredSkills: ['React', 'JavaScript', 'CSS'],
    niceToHave: ['Git', 'HTML'],
    levels: ['Student', 'Fresher'],
    location: 'Remote',
    remote: true,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    ownerRole: 'startup',
    ownerIndex: 2 // CodeSprint
  },
  // 9. AI Diagnostics Backend
  {
    title: 'AI Pipeline & Backend Intern',
    type: 'internship',
    description: 'Assist in packaging computer vision machine learning models into high-speed FastAPI endpoints and deploying them to secure medical cloud infrastructures.',
    requiredSkills: ['Python', 'FastAPI', 'Docker'],
    niceToHave: ['Machine Learning', 'AWS'],
    levels: ['Student', 'Fresher', 'Junior'],
    location: 'Boston, MA',
    remote: true,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    ownerRole: 'startup',
    ownerIndex: 0 // Nexus Health
  },
  // 10. Climate Data Project
  {
    title: 'Emissions Data Pipeline Specialist',
    type: 'project',
    description: 'Help build Python data scraping and parsing scripts to ingest supplier energy utility bills and calculate automated carbon equivalents.',
    requiredSkills: ['Python', 'SQL', 'Data Analysis'],
    niceToHave: ['Pandas'],
    levels: ['Fresher', 'Junior'],
    location: 'Denver, CO',
    remote: true,
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
    ownerRole: 'startup',
    ownerIndex: 1 // EcoTrack
  },
  // 11. Digital Marketing Intern
  {
    title: 'Digital Marketing & SEO Associate',
    type: 'internship',
    description: 'Manage organic SEO keywords, draft tech blog pieces, and execute targeted Google Ads campaigns to drive qualified B2B SaaS demo requests.',
    requiredSkills: ['SEO', 'Content Writing', 'Digital Marketing'],
    niceToHave: ['Google Ads'],
    levels: ['Student', 'Fresher'],
    location: 'Remote',
    remote: true,
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    ownerRole: 'recruiter',
    ownerIndex: 4 // NextGen Media
  },
  // 12. Generative AI Design Engineer
  {
    title: 'Generative UI Engineering Fellow',
    type: 'project',
    description: 'Build algorithmic canvas rendering systems connecting Figma plugin APIs with generative layout engines.',
    requiredSkills: ['TypeScript', 'React', 'Figma'],
    niceToHave: ['UI/UX'],
    levels: ['Junior', 'Mid'],
    location: 'San Francisco, CA',
    remote: true,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    ownerRole: 'startup',
    ownerIndex: 4 // OmniStudio
  },
  // 13. Mobile Flutter Engineer
  {
    title: 'Mobile App Developer (Flutter)',
    type: 'job',
    description: 'Design and build cross-platform mobile apps for iOS and Android with Flutter and Firebase backends.',
    requiredSkills: ['Flutter', 'REST APIs', 'Git'],
    niceToHave: ['UI/UX'],
    levels: ['Junior', 'Mid'],
    location: 'Remote',
    remote: true,
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    ownerRole: 'recruiter',
    ownerIndex: 0 // Apex Talent
  },
  // 14. DevOps Cloud Architect
  {
    title: 'Cloud & Kubernetes DevOps Specialist',
    type: 'job',
    description: 'Architect multi-region Kubernetes clusters on AWS, write Terraform configurations, and streamline CI/CD pipelines with GitHub Actions.',
    requiredSkills: ['AWS', 'Kubernetes', 'Docker', 'CI/CD'],
    niceToHave: ['Linux'],
    levels: ['Mid'],
    location: 'San Francisco, CA',
    remote: true,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    ownerRole: 'recruiter',
    ownerIndex: 3 // CloudScale
  },
  // 15. Closed job to demonstrate closed state handling
  {
    title: 'Senior Product Manager (Closed)',
    type: 'job',
    description: 'Filled position: Drove roadmaps for developer productivity platforms.',
    requiredSkills: ['Product Management', 'Leadership', 'Communication'],
    niceToHave: ['SQL'],
    levels: ['Mid'],
    location: 'Remote',
    remote: true,
    deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'closed',
    ownerRole: 'recruiter',
    ownerIndex: 1 // Horizon Ventures
  },
  // 16. Entrepreneur Founding Opportunity
  {
    title: 'Founding Web Engineer (CleanTech MVP)',
    type: 'project',
    description: 'Join EcoPack Innovations as our founding frontend engineer. Help build our carbon-savings calculator and customer ordering portal.',
    requiredSkills: ['React', 'JavaScript', 'Tailwind CSS'],
    niceToHave: ['Node.js', 'UI/UX'],
    levels: ['Student', 'Fresher', 'Junior'],
    location: 'San Francisco, CA',
    remote: true,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    ownerRole: 'entrepreneur',
    ownerIndex: 0 // Maya Lin
  }
];

export const ideasSeedData = [
  {
    title: 'AI Diagnostic Assistant for Rural Health Clinics',
    problem: 'Rural clinics lack fast access to specialized radiologists, delaying critical patient screenings by days or weeks.',
    solution: 'A lightweight edge tablet app running offline-first computer vision models that pre-screen chest X-rays and triage high-risk cases.',
    skillsNeeded: ['Python', 'Deep Learning', 'React', 'FastAPI'],
    stage: 'Building',
    ownerRole: 'startup',
    ownerIndex: 0 // Nexus Health
  },
  {
    title: 'Decentralized Carbon Offset Verification Protocol',
    problem: 'Small and medium businesses want verifiable carbon neutrality but cannot afford \$50k audit fees from legacy verification firms.',
    solution: 'An automated IoT sensor and satellite data aggregator that stamps transparent carbon credits onto an open audit ledger.',
    skillsNeeded: ['Python', 'PostgreSQL', 'Docker', 'Data Analysis'],
    stage: 'Building',
    ownerRole: 'startup',
    ownerIndex: 1 // EcoTrack
  },
  {
    title: 'Interactive Peer Code Review Arcade',
    problem: 'CS students graduate without learning how to conduct real production pull request reviews and spot subtle architecture bugs.',
    solution: 'A gamified multiplayer simulator where students review real open-source diffs, earn badges, and compete on code quality benchmarks.',
    skillsNeeded: ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js'],
    stage: 'Idea',
    ownerRole: 'startup',
    ownerIndex: 2 // CodeSprint
  },
  {
    title: 'Micro-Payments Settlement Protocol for Creators',
    problem: 'International freelancers lose 7-12% in hidden currency conversion spreads and intermediary wire fees on small client invoices.',
    solution: 'A localized peer-to-peer payout gateway with instant escrow and zero-spread currency conversion.',
    skillsNeeded: ['Go', 'TypeScript', 'PostgreSQL', 'REST APIs'],
    stage: 'Building',
    ownerRole: 'startup',
    ownerIndex: 3 // FlowPay
  },
  {
    title: 'Generative Design Tokens & Figma-to-Code Sync',
    problem: 'Designers change tokens in Figma, but engineers manually update CSS variables weeks later, causing visual drift.',
    solution: 'A bidirectional real-time bridge that compiles Figma component variants into tested Tailwind React components upon publish.',
    skillsNeeded: ['Figma', 'TypeScript', 'React', 'CSS'],
    stage: 'Launched',
    ownerRole: 'startup',
    ownerIndex: 4 // OmniStudio
  },
  {
    title: 'Campus Peer Study & Skill Barter Platform',
    problem: 'University students frequently need tutoring in specialized tech subjects but cannot afford private tutoring rates.',
    solution: 'A skill-for-skill exchange where students trade hours: e.g. 1 hour of React tutoring in exchange for 1 hour of Data Structures guidance.',
    skillsNeeded: ['React', 'Node.js', 'MongoDB', 'UI/UX'],
    stage: 'Idea',
    ownerRole: 'seeker',
    ownerIndex: 0 // Alex Rivera
  },
  {
    title: 'Biodegradable Mycelium Shipping Protection',
    problem: 'E-commerce logistics generates millions of cubic feet of non-recyclable expanded polystyrene (Styrofoam) waste that takes 500+ years to break down.',
    solution: 'Custom-molded bio-packaging grown from agricultural byproducts and fungal mycelium in under 7 days, 100% home compostable.',
    skillsNeeded: ['React', 'Node.js', 'UI/UX', 'Product Management'],
    stage: 'Idea',
    ownerRole: 'entrepreneur',
    ownerIndex: 0 // Maya Lin
  },
  {
    title: 'FinLearn: Conversational Wealth Copilot for Teens',
    problem: '78% of high school and university graduates flunk basic financial literacy tests, leading to predatory student loans and bad credit.',
    solution: 'An engaging, gamified voice and chat copilot powered by fine-tuned LLMs that models real-world budget, savings, and investment decisions.',
    skillsNeeded: ['React', 'Python', 'FastAPI', 'Figma'],
    stage: 'Building',
    ownerRole: 'entrepreneur',
    ownerIndex: 1 // Kavita Rao
  }
];
