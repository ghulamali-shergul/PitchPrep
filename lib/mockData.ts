import { Company, CareerFairCard, ResumeSuggestion, UserProfile, CareerFairEvent } from "./types";

export const mockCareerFairCards: Record<string, CareerFairCard> = {
  google: {
    pitch:
      "Hi, I'm a computer science student passionate about building scalable systems. I was particularly impressed by Google's recent work on Gemini and how it's being integrated across Google Workspace. As someone who's built ML pipelines and loves solving complex problems, I'd love to explore how I could contribute to teams pushing the boundaries of AI at Google.",
    wowFacts: [
      { fact: "Google processes over 8.5 billion searches per day globally", source: "Google Annual Report", sourceUrl: "#" },
      { fact: "Gemini Ultra outperformed human experts on 30+ academic benchmarks", source: "Google DeepMind Blog", sourceUrl: "#" },
      { fact: "Google Cloud revenue grew 26% YoY reaching $33B in 2025", source: "Alphabet Earnings", sourceUrl: "#" },
    ],
    topRoles: ["Software Engineer L3", "Associate Product Manager", "Data Scientist"],
    smartQuestions: [
      "How does the team balance shipping quickly with maintaining Google's infrastructure reliability at scale?",
      "What does the mentorship culture look like for new grads on the Cloud AI team?",
    ],
    followUpMessage:
      "Hi [Name], it was great meeting you at the career fair! I really enjoyed learning about [specific topic]. I'd love to continue our conversation — would you be open to a brief virtual coffee chat? I've attached my resume for reference. Best, [Your Name]",
  },
  jpmorgan: {
    pitch:
      "Hi, I'm a finance and CS double major with a strong interest in how technology is transforming capital markets. I noticed JPMorgan recently launched its blockchain-based settlement platform and invested $2B in tech talent — that intersection of finance and engineering is exactly where I want to build my career.",
    wowFacts: [
      { fact: "JPMorgan processes $10 trillion in daily transactions", source: "JPM Investor Day", sourceUrl: "#" },
      { fact: "The firm employs over 55,000 technologists globally", source: "JPM Tech Report", sourceUrl: "#" },
      { fact: "JPM's AI-powered COiN platform reviews 12,000 contracts in seconds", source: "Bloomberg", sourceUrl: "#" },
    ],
    topRoles: ["Software Engineer Program", "Investment Banking Analyst", "Quantitative Analyst"],
    smartQuestions: [
      "How is JPMorgan thinking about integrating generative AI into risk modeling workflows?",
      "What kinds of rotational experiences are available for new analysts in the Corporate & Investment Bank?",
    ],
    followUpMessage:
      "Hi [Name], thank you for taking the time to speak with me at the career fair! I found our discussion about JPMorgan's technology strategy really insightful. I'd love to stay connected and explore opportunities on the team. Best regards, [Your Name]",
  },
  unitedhealth: {
    pitch:
      "Hi, I'm studying health informatics and computer science, and I'm fascinated by how data can improve patient outcomes. UnitedHealth Group's Optum division is doing incredible work using predictive analytics to reduce hospital readmissions — I'd love to learn how I could contribute to that mission.",
    wowFacts: [
      { fact: "UnitedHealth Group serves over 152 million people worldwide", source: "UHG Annual Report", sourceUrl: "#" },
      { fact: "Optum's AI models have helped reduce unnecessary ER visits by 15%", source: "Optum Insights", sourceUrl: "#" },
      { fact: "UHG invested $3.6B in technology and data analytics in 2025", source: "UHG Investor Day", sourceUrl: "#" },
    ],
    topRoles: ["Data Analyst – Optum", "Software Engineer – Healthcare", "Product Manager – Clinical AI"],
    smartQuestions: [
      "How does Optum balance innovation speed with healthcare compliance and patient privacy requirements?",
      "What does a typical project look like for a new grad on the clinical analytics team?",
    ],
    followUpMessage:
      "Hi [Name], it was wonderful chatting with you about Optum's work in clinical AI! I'm very excited about the intersection of healthcare and technology and would love to explore opportunities further. Thank you for your time! Best, [Your Name]",
  },
  mckinsey: {
    pitch:
      "Hi, I'm a business strategy and analytics student who's led case competitions and worked on operations consulting projects. McKinsey's recent digital transformation practice and your 'New at McKinsey' program for early-career consultants really resonate with how I want to start my career — solving complex problems across industries.",
    wowFacts: [
      { fact: "McKinsey serves 90% of the top 100 companies globally", source: "McKinsey.com", sourceUrl: "#" },
      { fact: "McKinsey's QuantumBlack AI division has grown to 7,000+ data professionals", source: "McKinsey Careers", sourceUrl: "#" },
      { fact: "The firm published 1,200+ articles on business strategy in 2025", source: "McKinsey Insights", sourceUrl: "#" },
    ],
    topRoles: ["Business Analyst", "Junior Associate – Digital", "Data Scientist – QuantumBlack"],
    smartQuestions: [
      "How does McKinsey's staffing model allow new Business Analysts to gain exposure across industries?",
      "What role does QuantumBlack play in traditional strategy engagements?",
    ],
    followUpMessage:
      "Hi [Name], thank you for the engaging conversation about McKinsey's approach to digital transformation! I'd love to learn more about the Business Analyst role and how I might be a good fit. Looking forward to staying in touch. Best, [Your Name]",
  },
  stripe: {
    pitch:
      "Hi, I'm a software engineer passionate about developer tools and payment infrastructure. Stripe's mission to increase the GDP of the internet really resonates with me — especially your recent launch of Stripe AI tools that help businesses optimize revenue. I'd love to explore engineering opportunities here.",
    wowFacts: [
      { fact: "Stripe processes over $1 trillion in total payment volume annually", source: "Stripe Blog", sourceUrl: "#" },
      { fact: "Stripe's API uptime has been 99.999% over the past 3 years", source: "Stripe Status", sourceUrl: "#" },
      { fact: "Over 3.4 million businesses use Stripe in 46+ countries", source: "Stripe Press Kit", sourceUrl: "#" },
    ],
    topRoles: ["Software Engineer – Infrastructure", "Product Manager – Payments", "Solutions Architect"],
    smartQuestions: [
      "How does Stripe maintain its API reliability while shipping new features so rapidly?",
      "What does the engineering culture look like for new grads — do you get to own projects early?",
    ],
    followUpMessage:
      "Hi [Name], I really enjoyed our conversation about Stripe's engineering culture! The focus on developer experience and reliability is exactly the kind of work I'm passionate about. I'd love to continue the conversation. Best, [Your Name]",
  },
  deloitte: {
    pitch:
      "Hi, I'm studying information systems and I've been drawn to how consulting firms are helping enterprises navigate AI adoption. Deloitte's work with federal agencies on digital modernization and your AI Center of Excellence stood out to me — I'd love to bring my technical and analytical skills to that work.",
    wowFacts: [
      { fact: "Deloitte generated $67.2 billion in global revenue in FY2025", source: "Deloitte Annual Review", sourceUrl: "#" },
      { fact: "Deloitte has over 457,000 professionals in 150+ countries", source: "Deloitte About", sourceUrl: "#" },
      { fact: "Named #1 in AI consulting by IDC for 5 consecutive years", source: "IDC MarketScape", sourceUrl: "#" },
    ],
    topRoles: ["Technology Consultant", "Strategy Analyst", "AI & Data Engineer"],
    smartQuestions: [
      "How does Deloitte's consulting model differ between commercial and federal practice areas?",
      "What does career progression look like from Analyst to Senior Consultant?",
    ],
    followUpMessage:
      "Hi [Name], thank you for the great conversation about Deloitte's AI consulting practice! I'm very interested in the Technology Consultant role and would love to learn more about next steps. Best, [Your Name]",
  },
  meta: {
    pitch:
      "Hi, I'm a computer science student focused on distributed systems and social computing. Meta's work on the open-source Llama models and the continued development of the metaverse platform really excites me — I'm interested in how large-scale systems can create meaningful social experiences.",
    wowFacts: [
      { fact: "Meta's family of apps reaches 3.98 billion people monthly", source: "Meta Q4 Earnings", sourceUrl: "#" },
      { fact: "Llama 3 has been downloaded over 300 million times by developers", source: "Meta AI Blog", sourceUrl: "#" },
      { fact: "Meta invested $39B in capital expenditures in 2025, largely on AI infra", source: "Meta Investor Relations", sourceUrl: "#" },
    ],
    topRoles: ["Software Engineer – Infrastructure", "Research Scientist – AI", "Product Designer"],
    smartQuestions: [
      "How does Meta decide which AI models to open-source vs. keep proprietary?",
      "What does the new grad onboarding experience look like at Meta's engineering org?",
    ],
    followUpMessage:
      "Hi [Name], I really enjoyed hearing about Meta's open-source AI strategy at the career fair! I'd love to explore engineering opportunities and learn more about the team. Best, [Your Name]",
  },
  pfizer: {
    pitch:
      "Hi, I'm studying biomedical engineering with a focus on computational drug discovery. Pfizer's rapid development of mRNA technology and your recent AI-driven drug pipeline are exactly the kind of innovation I want to be part of — using technology to accelerate treatments that save lives.",
    wowFacts: [
      { fact: "Pfizer delivered over 4.6 billion COVID vaccine doses globally", source: "Pfizer Impact Report", sourceUrl: "#" },
      { fact: "Pfizer's AI drug discovery platform reduced early-stage timelines by 40%", source: "Pfizer R&D Day", sourceUrl: "#" },
      { fact: "The company invested $11.4B in R&D in 2025", source: "Pfizer Annual Report", sourceUrl: "#" },
    ],
    topRoles: ["Data Scientist – R&D", "Biostatistician", "Software Engineer – Digital Health"],
    smartQuestions: [
      "How is Pfizer integrating AI into the clinical trial design process?",
      "What opportunities exist for computational roles to collaborate directly with lab scientists?",
    ],
    followUpMessage:
      "Hi [Name], it was great chatting about Pfizer's AI-driven drug discovery pipeline! I'm very interested in how computational methods are shaping R&D and would love to explore roles on the team. Best, [Your Name]",
  },
};

export const mockCompanies: Company[] = [
  {
    id: "1",
    slug: "google",
    name: "Google",
    url: "https://google.com",
    category: "Tech",
    aboutInfo: "Google is a multinational technology company specializing in search, cloud computing, and AI.",
    jobDescription: "Software Engineer L3 – Google Cloud AI Platform",
    notes: "",
    matchScore: 92,
    matchReasoning: "Strong alignment with your CS background, AI interests, and preference for large-scale systems. Google's Cloud AI team matches your ML project experience.",
    hiringNow: true,
    location: "Mountain View, CA",
    topRoles: ["Software Engineer L3", "Associate Product Manager", "Data Scientist"],
    generated: true,
    adminApproved: true,
    careerFairCard: mockCareerFairCards.google,
  },
  {
    id: "2",
    slug: "jpmorgan",
    name: "JPMorgan Chase",
    url: "https://jpmorgan.com",
    category: "Finance",
    aboutInfo: "JPMorgan Chase is the largest bank in the US, offering investment banking, asset management, and treasury services.",
    jobDescription: "Software Engineer Program – Corporate & Investment Bank",
    notes: "",
    matchScore: 85,
    matchReasoning: "Good fit given your finance coursework and programming skills. JPM's technology-first approach in CIB aligns with your interest in fintech.",
    hiringNow: true,
    location: "New York, NY",
    topRoles: ["Software Engineer Program", "Investment Banking Analyst", "Quantitative Analyst"],
    generated: true,
    adminApproved: true,
    careerFairCard: mockCareerFairCards.jpmorgan,
  },
  {
    id: "3",
    slug: "unitedhealth",
    name: "UnitedHealth Group",
    url: "https://unitedhealthgroup.com",
    category: "Healthcare",
    aboutInfo: "UnitedHealth Group is a diversified health care company offering insurance and technology-enabled health services through Optum.",
    jobDescription: "Data Analyst – Optum Health Analytics",
    notes: "",
    matchScore: 78,
    matchReasoning: "Moderate fit — your data analysis skills transfer well, though you'd benefit from more healthcare domain knowledge. Optum's analytics team values your ML background.",
    hiringNow: true,
    location: "Minneapolis, MN",
    topRoles: ["Data Analyst – Optum", "Software Engineer – Healthcare", "Product Manager – Clinical AI"],
    generated: true,
    adminApproved: true,
    careerFairCard: mockCareerFairCards.unitedhealth,
  },
  {
    id: "4",
    slug: "mckinsey",
    name: "McKinsey & Company",
    url: "https://mckinsey.com",
    category: "Consulting",
    aboutInfo: "McKinsey & Company is a global management consulting firm serving leading businesses, governments, and institutions.",
    jobDescription: "Business Analyst – Generalist",
    notes: "",
    matchScore: 80,
    matchReasoning: "Strong analytical and communication skills match BA requirements. Your case competition experience is a plus. Consider building more industry-specific knowledge.",
    hiringNow: false,
    location: "Chicago, IL",
    topRoles: ["Business Analyst", "Junior Associate – Digital", "Data Scientist – QuantumBlack"],
    generated: true,
    adminApproved: true,
    careerFairCard: mockCareerFairCards.mckinsey,
  },
  {
    id: "5",
    slug: "stripe",
    name: "Stripe",
    url: "https://stripe.com",
    category: "Tech",
    aboutInfo: "Stripe is a technology company that builds economic infrastructure for the internet, helping businesses accept payments and manage finances online.",
    jobDescription: "Software Engineer – Infrastructure",
    notes: "Really interested in their developer tools team",
    matchScore: 90,
    matchReasoning: "Excellent fit for your systems programming skills and passion for developer tools. Stripe's engineering culture rewards deep technical ownership — a great match.",
    hiringNow: true,
    location: "San Francisco, CA",
    topRoles: ["Software Engineer – Infrastructure", "Product Manager – Payments", "Solutions Architect"],
    generated: true,
    adminApproved: true,
    careerFairCard: mockCareerFairCards.stripe,
  },
  {
    id: "6",
    slug: "deloitte",
    name: "Deloitte",
    url: "https://deloitte.com",
    category: "Consulting",
    aboutInfo: "Deloitte is a global professional services firm offering consulting, audit, tax, and advisory services.",
    jobDescription: "Technology Consultant – Government & Public Services",
    notes: "",
    matchScore: 74,
    matchReasoning: "Decent fit with your analytical skills. The tech consulting role aligns with your IS coursework. Consider exploring their AI & Data Engineering track.",
    hiringNow: true,
    location: "Washington, DC",
    topRoles: ["Technology Consultant", "Strategy Analyst", "AI & Data Engineer"],
    generated: true,
    adminApproved: true,
    careerFairCard: mockCareerFairCards.deloitte,
  },
  {
    id: "7",
    slug: "meta",
    name: "Meta",
    url: "https://meta.com",
    category: "Tech",
    aboutInfo: "Meta builds technologies that help people connect, find communities, and grow businesses through its family of apps and metaverse platforms.",
    jobDescription: "Software Engineer – Distributed Systems",
    notes: "",
    matchScore: 88,
    matchReasoning: "Strong match with your distributed systems coursework and open-source contributions. Meta's scale offers unmatched learning in systems engineering.",
    hiringNow: true,
    location: "Menlo Park, CA",
    topRoles: ["Software Engineer – Infrastructure", "Research Scientist – AI", "Product Designer"],
    generated: true,
    adminApproved: true,
    careerFairCard: mockCareerFairCards.meta,
  },
  {
    id: "8",
    slug: "pfizer",
    name: "Pfizer",
    url: "https://pfizer.com",
    category: "Healthcare",
    aboutInfo: "Pfizer is a global pharmaceutical and biotechnology company focused on developing medicines, vaccines, and consumer healthcare products.",
    jobDescription: "Data Scientist – R&D Computational Biology",
    notes: "",
    matchScore: 70,
    matchReasoning: "Partial fit — your ML and data skills apply, but you'd need to ramp up on bioinformatics. Good option if you're open to pivoting toward computational biology.",
    hiringNow: false,
    location: "New York, NY",
    topRoles: ["Data Scientist – R&D", "Biostatistician", "Software Engineer – Digital Health"],
    generated: true,
    adminApproved: true,
    careerFairCard: mockCareerFairCards.pfizer,
  },
];

export const mockResumeSuggestions: ResumeSuggestion[] = [
  {
    id: "1",
    type: "add-metrics",
    title: "Add quantifiable metrics to internship bullet",
    description: "Your internship bullet lacks measurable impact. Adding metrics makes it 40% more likely to pass ATS screening.",
    before: "Developed a dashboard for the marketing team to track campaign performance",
    after: "Developed an interactive analytics dashboard used by 25+ marketers, reducing campaign reporting time by 60% and enabling real-time ROI tracking across 12 concurrent campaigns",
    priority: "high",
  },
  {
    id: "2",
    type: "rewrite-bullet",
    title: "Strengthen project description with action verbs",
    description: "Replace passive language with strong action verbs and specific technologies to stand out to recruiters.",
    before: "Was responsible for working on the backend of a web application using Node.js",
    after: "Architected and deployed a RESTful API serving 10K+ daily requests using Node.js, Express, and PostgreSQL, improving response latency by 35% through query optimization",
    priority: "high",
  },
  {
    id: "3",
    type: "reorder-skills",
    title: "Reorder skills to match job description",
    description: "Move Python, SQL, and cloud technologies higher in your skills section — these appear in 4 of your 5 target job descriptions.",
    priority: "medium",
  },
  {
    id: "4",
    type: "highlight-experience",
    title: "Highlight relevant coursework for consulting roles",
    description: "Add a 'Relevant Coursework' section featuring your strategy, operations, and data analytics classes to strengthen consulting applications.",
    priority: "medium",
  },
  {
    id: "5",
    type: "rewrite-bullet",
    title: "Rewrite leadership bullet to show impact",
    description: "Your club leadership description focuses on duties rather than achievements. Reframe to highlight outcomes.",
    before: "Served as president of the Computer Science Club and organized weekly meetings and events",
    after: "Led a 120-member Computer Science Club, organizing 15+ technical workshops and a hackathon with 200 participants that generated 3 industry partnerships",
    priority: "medium",
  },
  {
    id: "6",
    type: "add-metrics",
    title: "Quantify your research contribution",
    description: "Your research bullet doesn't convey the scale or significance of your work. Add specifics.",
    before: "Assisted professor with machine learning research on natural language processing",
    after: "Co-authored NLP research paper analyzing 50K+ text samples using transformer models, achieving 94% classification accuracy and presenting findings at a regional AI symposium",
    priority: "low",
  },
];

export const defaultProfile: UserProfile = {
  name: "Alex Chen",
  email: "alex.chen@university.edu",
  school: "State University",
  major: "Computer Science & Business",
  graduationYear: "2026",
  preferredRoles: ["Software Engineer", "Product Manager", "Data Scientist", "Business Analyst"],
  preferredIndustries: ["Tech", "Finance"],
  location: "New York, NY",
  visaNotes: "US Citizen – no sponsorship required",
  background: "I interned in finance at a mid-size bank and have done two software engineering internships at startups. I've taken coursework in ML, distributed systems, and business strategy.",
  resumeText: `ALEX CHEN
alex.chen@university.edu | (555) 123-4567 | linkedin.com/in/alexchen | github.com/alexchen

EDUCATION
State University – B.S. Computer Science & Business Administration
GPA: 3.8/4.0 | Expected May 2026
Relevant Coursework: Machine Learning, Distributed Systems, Data Structures, Business Strategy, Financial Accounting

EXPERIENCE
Software Engineering Intern – TechStartup Inc. | Summer 2025
• Developed a dashboard for the marketing team to track campaign performance
• Was responsible for working on the backend of a web application using Node.js
• Collaborated with design team on UI improvements

Finance Intern – MidSize Bank Corp. | Summer 2024
• Assisted with financial modeling and analysis for M&A transactions
• Built Excel models to evaluate potential acquisition targets

PROJECTS
NLP Research Project | Fall 2025
• Assisted professor with machine learning research on natural language processing
• Used Python and PyTorch for model training

LEADERSHIP
Computer Science Club President | 2024-2026
• Served as president of the Computer Science Club and organized weekly meetings and events

SKILLS
JavaScript, Python, Java, SQL, React, Node.js, Git, AWS, Excel, Financial Modeling`,
};

export const mockEvents: CareerFairEvent[] = [
  {
    id: "evt-1",
    name: "Spring 2026 Tech & Engineering Career Fair",
    date: "2026-03-15",
    location: "University Student Center, Main Hall",
    description:
      "Our largest career fair of the year featuring top technology and engineering employers. Open to all majors with a focus on software engineering, data science, and product roles.",
    companyIds: ["1", "5", "7"], // Google, Stripe, Meta
  },
  {
    id: "evt-2",
    name: "Finance & Consulting Career Expo",
    date: "2026-04-02",
    location: "Business School, Atrium B",
    description:
      "Connect with leading banks, consulting firms, and financial services companies. Ideal for students interested in investment banking, consulting, and quantitative roles.",
    companyIds: ["2", "4", "6"], // JPMorgan, McKinsey, Deloitte
  },
  {
    id: "evt-3",
    name: "Healthcare & Life Sciences Career Day",
    date: "2026-04-18",
    location: "Health Sciences Building, Room 200",
    description:
      "Explore opportunities in healthcare, pharmaceuticals, and biotech. Features companies working on clinical AI, drug discovery, and health informatics.",
    companyIds: ["3", "8"], // UnitedHealth, Pfizer
  },
];
