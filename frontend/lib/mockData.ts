
export interface Company {
  name: string; ticker: string; price: number; change: number; changePercent: number;
  sector: string; industry: string; marketCap: string; logo: string;
  scores: { preEarnings: number; confidence: number; risk: number; hiringVelocity: number; newsSentiment: number; mentions: number };
  radarData: { subject: string; value: number; fullMark: number }[];
  sentimentTrend: { date: string; score: number; volume: number }[];
  hiringData: { dept: string; count: number; color: string }[];
  summary: string; aiInsight: string;
  signals: Signal[]; competitors: Competitor[]; executives: Executive[]; risks: Risk[]; news: NewsItem[];
}
export interface Signal {
  id: string; type: 'buy'|'sell'|'neutral'|'alert'; source: string; message: string;
  confidence: number; timestamp: Date; sentiment: 'positive'|'negative'|'neutral';
  category: 'hiring'|'news'|'pricing'|'executive'|'institutional';
}
export interface Competitor { name: string; ticker: string; threat: 'Low'|'Medium'|'High'; description: string; score: number; icon: string }
export interface Executive { name: string; title: string; action: string; date: string; significance: 'low'|'medium'|'high' }
export interface Risk { id: string; category: string; severity: 'Low'|'Medium'|'High'|'Critical'; description: string; mitigation: string }
export interface NewsItem { id: string; headline: string; source: string; timestamp: Date; sentiment: 'positive'|'negative'|'neutral'; credibility: number; summary: string }
export interface WatchlistItem { ticker: string; name: string; price: number; change: number; changePercent: number; aiScore: number; sparkline: number[]; pinned: boolean }

function st(base: number): { date: string; score: number; volume: number }[] {
  const dates = ['Apr 19','Apr 22','Apr 26','Apr 30','May 3','May 7','May 10','May 14','May 17'];
  let v = base;
  return dates.map(date => { v += (Math.random() - 0.42) * 22; v = Math.max(-90, Math.min(90, v)); return { date, score: Math.round(v), volume: Math.floor(Math.random()*500+100) }; });
}
function sp(base: number, len = 20): number[] {
  let v = base;
  return Array.from({ length: len }, () => { v += (Math.random() - 0.48) * 12; return Math.max(0, Math.round(v)); });
}

const d = (ms: number) => new Date(Date.now() - ms);

export const companyData: Record<string, Company> = {
  NVDA: {
    name: 'NVIDIA Corporation', ticker: 'NVDA', price: 1024.86, change: 33.86, changePercent: 3.42,
    sector: 'Technology', industry: 'Semiconductors', marketCap: 'Large Cap', logo: '🟢',
    scores: { preEarnings: 87, confidence: 78, risk: 32, hiringVelocity: 48, newsSentiment: 72, mentions: 1200 },
    radarData: [
      { subject: 'Financial', value: 85, fullMark: 100 }, { subject: 'News', value: 72, fullMark: 100 },
      { subject: 'Technical', value: 80, fullMark: 100 }, { subject: 'Sentiment', value: 72, fullMark: 100 },
      { subject: 'Hiring', value: 88, fullMark: 100 }, { subject: 'Social', value: 65, fullMark: 100 },
    ],
    sentimentTrend: st(20),
    hiringData: [
      { dept: 'Engineering', count: 342, color: '#4F46E5' }, { dept: 'Sales', count: 128, color: '#3B82F6' },
      { dept: 'Research', count: 96, color: '#8B5CF6' }, { dept: 'Operations', count: 64, color: '#06B6D4' },
      { dept: 'Marketing', count: 48, color: '#22C55E' },
    ],
    summary: 'NVIDIA shows strong pre-earnings signals with positive news sentiment, accelerating hiring in AI/ML roles, and increased institutional mentions. Our AI models predict an above-expectation quarterly performance.',
    aiInsight: "NVIDIA's Data Center segment growth acceleration and Blackwell architecture momentum suggest strong upside potential. However, monitor China export restrictions and competitor pressure from AMD.",
    signals: [
      { id: 's1', type: 'buy', source: 'JPMorgan', message: 'Institutional Buy Signal – JPMorgan increased position by 2.3M shares', confidence: 91, timestamp: d(5*60000), sentiment: 'positive', category: 'institutional' },
      { id: 's2', type: 'neutral', source: 'AI Monitor', message: 'Positive News Sentiment – New AI chip demand exceeds expectations', confidence: 84, timestamp: d(12*60000), sentiment: 'positive', category: 'news' },
      { id: 's3', type: 'alert', source: 'Hiring Analytics', message: 'Hiring Spike Detected – 48% increase in AI/ML job postings', confidence: 78, timestamp: d(18*60000), sentiment: 'positive', category: 'hiring' },
      { id: 's4', type: 'sell', source: 'Risk Monitor', message: 'Export Restriction Alert – New US-China chip restrictions under review', confidence: 65, timestamp: d(45*60000), sentiment: 'negative', category: 'news' },
      { id: 's5', type: 'buy', source: 'Goldman Sachs', message: 'Price Target Raised to $1,200 – Strong data center demand visibility', confidence: 88, timestamp: d(2*3600000), sentiment: 'positive', category: 'institutional' },
    ],
    competitors: [
      { name: 'AMD', ticker: 'AMD', threat: 'Medium', description: 'Increasing market share in MI300 chips', score: 62, icon: '🔴' },
      { name: 'TSM', ticker: 'TSM', threat: 'High', description: 'Advanced 3nm production capacity expansion', score: 78, icon: '🔵' },
      { name: 'INTC', ticker: 'INTC', threat: 'Low', description: 'Government contracts and subsidy advantage', score: 38, icon: '🔷' },
    ],
    executives: [
      { name: 'Jensen Huang', title: 'CEO', action: 'Purchased 50,000 shares @ $980', date: '2 days ago', significance: 'high' },
      { name: 'Colette Kress', title: 'CFO', action: 'Spoke at Morgan Stanley Tech Conference', date: '1 week ago', significance: 'medium' },
      { name: 'Mark Stevens', title: 'Board', action: 'Filed Form 4 – Sold 10,000 shares', date: '2 weeks ago', significance: 'low' },
    ],
    risks: [
      { id: 'r1', category: 'Geopolitical', severity: 'High', description: 'US-China export restrictions could impact $4B+ in annual revenue', mitigation: 'Diversify customer base; develop export-compliant chip variants' },
      { id: 'r2', category: 'Competition', severity: 'Medium', description: 'AMD MI300X gaining hyperscaler traction; custom ASIC threat', mitigation: 'Accelerate Blackwell; deepen CUDA ecosystem lock-in' },
      { id: 'r3', category: 'Valuation', severity: 'Medium', description: 'P/E of 65x creates downside risk if earnings disappoint', mitigation: 'Maintain conservative guidance; beat-and-raise cadence' },
      { id: 'r4', category: 'Supply Chain', severity: 'Low', description: 'HBM memory constraints could limit Blackwell GPU shipments', mitigation: 'Multi-source HBM supply; long-term agreements' },
    ],
    news: [
      { id: 'n1', headline: 'NVIDIA Blackwell GPU Demand Surges as AI Infrastructure Boom Continues', source: 'Reuters', timestamp: d(2*3600000), sentiment: 'positive', credibility: 95, summary: 'Record orders for Blackwell architecture GPUs as hyperscalers race to build AI infrastructure.' },
      { id: 'n2', headline: 'US Commerce Dept Reviewing Additional AI Chip Export Restrictions to China', source: 'Bloomberg', timestamp: d(5*3600000), sentiment: 'negative', credibility: 92, summary: 'New restrictions could significantly impact NVIDIA and AMD revenues.' },
      { id: 'n3', headline: 'JPMorgan Raises NVDA Price Target to $1,200 on Strong Data Center Outlook', source: 'CNBC', timestamp: d(8*3600000), sentiment: 'positive', credibility: 88, summary: 'Analysts cited unprecedented demand visibility and improved supply chain execution.' },
    ],
  },
  TSLA: {
    name: 'Tesla, Inc.', ticker: 'TSLA', price: 178.24, change: 3.14, changePercent: 1.80,
    sector: 'Consumer Disc.', industry: 'Electric Vehicles', marketCap: 'Large Cap', logo: '🔴',
    scores: { preEarnings: 54, confidence: 62, risk: 65, hiringVelocity: -12, newsSentiment: 45, mentions: 3800 },
    radarData: [
      { subject: 'Financial', value: 58, fullMark: 100 }, { subject: 'News', value: 45, fullMark: 100 },
      { subject: 'Technical', value: 62, fullMark: 100 }, { subject: 'Sentiment', value: 48, fullMark: 100 },
      { subject: 'Hiring', value: 38, fullMark: 100 }, { subject: 'Social', value: 72, fullMark: 100 },
    ],
    sentimentTrend: st(-10),
    hiringData: [
      { dept: 'Engineering', count: 182, color: '#EF4444' }, { dept: 'Manufacturing', count: 324, color: '#F59E0B' },
      { dept: 'Sales', count: 96, color: '#4F46E5' }, { dept: 'Operations', count: 148, color: '#06B6D4' },
    ],
    summary: 'Tesla shows mixed signals heading into earnings. While FSD progress remains a positive catalyst, delivery miss risk and intensifying competition from BYD weigh on near-term outlook.',
    aiInsight: 'Workforce reduction signals and delivery miss risk suggest cautious positioning. FSD v12 milestone and Energy segment growth offer upside scenarios.',
    signals: [
      { id: 'ts1', type: 'sell', source: 'Delivery Monitor', message: 'Q2 Delivery Miss Risk – Production shortfall estimated 8% below consensus', confidence: 72, timestamp: d(15*60000), sentiment: 'negative', category: 'news' },
      { id: 'ts2', type: 'neutral', source: 'Hiring Analytics', message: 'Workforce Reduction – Job postings down 12% MoM', confidence: 68, timestamp: d(90*60000), sentiment: 'negative', category: 'hiring' },
    ],
    competitors: [
      { name: 'BYD', ticker: 'BYD', threat: 'High', description: 'China market leader with aggressive pricing', score: 74, icon: '🔴' },
      { name: 'RIVN', ticker: 'RIVN', threat: 'Low', description: 'EV truck market competition growing', score: 32, icon: '🟢' },
    ],
    executives: [{ name: 'Elon Musk', title: 'CEO', action: 'Sold $3.5B in shares over past 30 days', date: '5 days ago', significance: 'high' }],
    risks: [{ id: 'tr1', category: 'Demand', severity: 'High', description: 'Slowing EV demand amid high interest rates', mitigation: 'Accelerate model refresh; expand financing' }],
    news: [{ id: 'tn1', headline: 'Tesla Q2 Delivery Estimates Lowered as Competition Intensifies', source: 'Bloomberg', timestamp: d(3*3600000), sentiment: 'negative', credibility: 91, summary: 'Multiple analysts cut Q2 delivery estimates for Tesla.' }],
  },
  META: {
    name: 'Meta Platforms', ticker: 'META', price: 512.44, change: -3.74, changePercent: -0.73,
    sector: 'Communication', industry: 'Social Media', marketCap: 'Large Cap', logo: '🔵',
    scores: { preEarnings: 74, confidence: 81, risk: 38, hiringVelocity: 22, newsSentiment: 68, mentions: 2100 },
    radarData: [
      { subject: 'Financial', value: 78, fullMark: 100 }, { subject: 'News', value: 68, fullMark: 100 },
      { subject: 'Technical', value: 74, fullMark: 100 }, { subject: 'Sentiment', value: 65, fullMark: 100 },
      { subject: 'Hiring', value: 72, fullMark: 100 }, { subject: 'Social', value: 82, fullMark: 100 },
    ],
    sentimentTrend: st(15),
    hiringData: [
      { dept: 'Engineering', count: 256, color: '#4F46E5' }, { dept: 'AI Research', count: 142, color: '#8B5CF6' },
      { dept: 'Sales', count: 118, color: '#3B82F6' }, { dept: 'Operations', count: 86, color: '#06B6D4' },
    ],
    summary: 'Meta shows solid pre-earnings signals driven by Llama 4 momentum and improving ad revenue. AI infrastructure hiring acceleration and positive analyst sentiment support bullish thesis.',
    aiInsight: 'Llama 4 enterprise adoption and Reality Labs cost discipline suggest earnings beat potential. Monitor EU DMA compliance costs and TikTok competition.',
    signals: [{ id: 'ms1', type: 'buy', source: 'UBS', message: 'Llama 4 Launch Momentum – Enterprise AI adoption accelerating', confidence: 85, timestamp: d(8*60000), sentiment: 'positive', category: 'news' }],
    competitors: [{ name: 'TikTok', ticker: 'TIKT', threat: 'High', description: 'Short video market share leader globally', score: 71, icon: '⚫' }],
    executives: [{ name: 'Mark Zuckerberg', title: 'CEO', action: 'Announced $50B AI infrastructure investment', date: '1 week ago', significance: 'high' }],
    risks: [{ id: 'mr1', category: 'Regulatory', severity: 'Medium', description: 'EU DMA compliance costs and potential fines', mitigation: 'Proactive compliance; legal reserve allocation' }],
    news: [{ id: 'mn1', headline: 'Meta AI Llama 4 Launches with Multimodal Capabilities', source: 'TechCrunch', timestamp: d(4*3600000), sentiment: 'positive', credibility: 89, summary: 'Meta released Llama 4 with advanced reasoning and vision capabilities.' }],
  },
  PLTR: {
    name: 'Palantir Technologies', ticker: 'PLTR', price: 24.18, change: 0.51, changePercent: 2.11,
    sector: 'Technology', industry: 'Data Analytics', marketCap: 'Mid Cap', logo: '⚪',
    scores: { preEarnings: 71, confidence: 74, risk: 42, hiringVelocity: 35, newsSentiment: 65, mentions: 890 },
    radarData: [
      { subject: 'Financial', value: 68, fullMark: 100 }, { subject: 'News', value: 65, fullMark: 100 },
      { subject: 'Technical', value: 72, fullMark: 100 }, { subject: 'Sentiment', value: 60, fullMark: 100 },
      { subject: 'Hiring', value: 78, fullMark: 100 }, { subject: 'Social', value: 58, fullMark: 100 },
    ],
    sentimentTrend: st(10),
    hiringData: [
      { dept: 'Engineering', count: 124, color: '#4F46E5' }, { dept: 'Government', count: 88, color: '#3B82F6' },
      { dept: 'Commercial', count: 72, color: '#8B5CF6' }, { dept: 'Research', count: 48, color: '#06B6D4' },
    ],
    summary: 'Palantir shows positive momentum driven by new DoD contract awards and accelerating commercial growth. AIP adoption continues to expand across enterprise clients.',
    aiInsight: 'New government contract awards and commercial AIP traction suggest revenue beat potential. CEO stock sales are a key risk to monitor.',
    signals: [{ id: 'ps1', type: 'buy', source: 'DoD Monitor', message: 'New Government Contract – $480M DoD AI platform deal awarded', confidence: 88, timestamp: d(20*60000), sentiment: 'positive', category: 'news' }],
    competitors: [{ name: 'SNOW', ticker: 'SNOW', threat: 'Medium', description: 'Data platform competition in commercial sector', score: 52, icon: '🔵' }],
    executives: [{ name: 'Alex Karp', title: 'CEO', action: 'Sold $150M in shares via 10b5-1 plan', date: '3 days ago', significance: 'high' }],
    risks: [{ id: 'pr1', category: 'Revenue Concentration', severity: 'Medium', description: 'US government revenue >50% creates concentration risk', mitigation: 'Accelerate commercial expansion' }],
    news: [{ id: 'pn1', headline: 'Palantir Wins $480M DoD Contract for AI-Powered Analytics', source: 'DefenseNews', timestamp: d(6*3600000), sentiment: 'positive', credibility: 94, summary: 'The DoD awarded Palantir a multi-year contract for AI analytics.' }],
  },
  AMD: {
    name: 'Advanced Micro Devices', ticker: 'AMD', price: 156.32, change: 1.92, changePercent: 1.23,
    sector: 'Technology', industry: 'Semiconductors', marketCap: 'Large Cap', logo: '🟠',
    scores: { preEarnings: 71, confidence: 76, risk: 44, hiringVelocity: 31, newsSentiment: 64, mentions: 1450 },
    radarData: [
      { subject: 'Financial', value: 72, fullMark: 100 }, { subject: 'News', value: 64, fullMark: 100 },
      { subject: 'Technical', value: 68, fullMark: 100 }, { subject: 'Sentiment', value: 66, fullMark: 100 },
      { subject: 'Hiring', value: 74, fullMark: 100 }, { subject: 'Social', value: 62, fullMark: 100 },
    ],
    sentimentTrend: st(8),
    hiringData: [
      { dept: 'Engineering', count: 218, color: '#4F46E5' }, { dept: 'AI Research', count: 96, color: '#8B5CF6' },
      { dept: 'Sales', count: 84, color: '#3B82F6' }, { dept: 'Operations', count: 62, color: '#06B6D4' },
    ],
    summary: 'AMD shows positive signals with accelerating MI300X hyperscaler adoption and strong ROCm ecosystem growth. Data center revenue guidance raised for the second consecutive quarter.',
    aiInsight: 'MI300X adoption at Microsoft and Meta exceeding estimates. CUDA ecosystem gap remains the key challenge. Price-competitive positioning is gaining traction.',
    signals: [{ id: 'as1', type: 'buy', source: 'Bernstein', message: 'MI300X Adoption Surge – Hyperscaler wins accelerating above estimates', confidence: 82, timestamp: d(30*60000), sentiment: 'positive', category: 'news' }],
    competitors: [{ name: 'NVDA', ticker: 'NVDA', threat: 'High', description: 'GPU market leader with CUDA ecosystem dominance', score: 92, icon: '🟢' }],
    executives: [{ name: 'Lisa Su', title: 'CEO', action: 'Presented at Computex – MI400 roadmap revealed', date: '1 week ago', significance: 'high' }],
    risks: [{ id: 'ar1', category: 'Competition', severity: 'High', description: 'NVIDIA CUDA ecosystem lock-in difficult to displace', mitigation: 'Invest in ROCm software ecosystem' }],
    news: [{ id: 'an1', headline: 'AMD MI300X Shipments Double as Meta and Microsoft Expand Orders', source: 'Reuters', timestamp: d(5*3600000), sentiment: 'positive', credibility: 90, summary: 'AMD reports stronger-than-expected hyperscaler demand for MI300X.' }],
  },
}

export const signalsFeed: Signal[] = [
  { id: 'f1', type: 'buy', source: 'JPMorgan', message: 'NVDA: Institutional Buy Signal – $2.3B position increase', confidence: 91, timestamp: d(5*60000), sentiment: 'positive', category: 'institutional' },
  { id: 'f2', type: 'neutral', source: 'AI Monitor', message: 'NVDA: Positive sentiment surge in AI/GPU news cycle', confidence: 84, timestamp: d(12*60000), sentiment: 'positive', category: 'news' },
  { id: 'f3', type: 'alert', source: 'Hiring Analytics', message: 'NVDA: 48% spike in AI/ML engineering postings MoM', confidence: 78, timestamp: d(18*60000), sentiment: 'positive', category: 'hiring' },
  { id: 'f4', type: 'sell', source: 'Risk Monitor', message: 'TSLA: Delivery miss risk – Q2 estimates revised down 8%', confidence: 72, timestamp: d(25*60000), sentiment: 'negative', category: 'news' },
  { id: 'f5', type: 'buy', source: 'Goldman Sachs', message: 'META: Llama 4 enterprise adoption beats expectations', confidence: 88, timestamp: d(40*60000), sentiment: 'positive', category: 'institutional' },
  { id: 'f6', type: 'neutral', source: 'Exec Monitor', message: 'PLTR: CEO Alex Karp sold $150M via 10b5-1 plan', confidence: 65, timestamp: d(55*60000), sentiment: 'neutral', category: 'executive' },
  { id: 'f7', type: 'buy', source: 'Bernstein', message: 'AMD: MI300X hyperscaler adoption accelerating above plan', confidence: 82, timestamp: d(90*60000), sentiment: 'positive', category: 'news' },
  { id: 'f8', type: 'alert', source: 'Regulatory', message: 'NVDA: US-China AI chip export rules under review', confidence: 68, timestamp: d(2*3600000), sentiment: 'negative', category: 'news' },
  { id: 'f9', type: 'buy', source: 'Wedbush', message: 'TSLA: FSD v12 milestone beat internal targets significantly', confidence: 81, timestamp: d(3*3600000), sentiment: 'positive', category: 'news' },
  { id: 'f10', type: 'neutral', source: 'Supply Monitor', message: 'AMD: TSMC CoWoS packaging allocation secured for H2', confidence: 75, timestamp: d(4*3600000), sentiment: 'neutral', category: 'news' },
  { id: 'f11', type: 'buy', source: 'DoD Monitor', message: 'PLTR: $480M DoD AI analytics platform contract awarded', confidence: 88, timestamp: d(5*3600000), sentiment: 'positive', category: 'news' },
  { id: 'f12', type: 'sell', source: 'Competition', message: 'TSLA: BYD expands into European market with aggressive pricing', confidence: 74, timestamp: d(6*3600000), sentiment: 'negative', category: 'news' },
  { id: 'f13', type: 'buy', source: 'UBS', message: 'META: EU DMA compliance fines risk substantially reduced', confidence: 71, timestamp: d(7*3600000), sentiment: 'positive', category: 'news' },
  { id: 'f14', type: 'neutral', source: 'Price Monitor', message: 'NVDA H100 GPU pricing stable – no demand-driven increase', confidence: 80, timestamp: d(8*3600000), sentiment: 'neutral', category: 'pricing' },
  { id: 'f15', type: 'buy', source: 'Citi', message: 'NVDA: Blackwell demand exceeds supply through Q4 2024', confidence: 92, timestamp: d(9*3600000), sentiment: 'positive', category: 'news' },
  { id: 'f16', type: 'alert', source: 'Insider Monitor', message: 'NVDA: Jensen Huang purchased 50K shares at $980 – Form 4', confidence: 85, timestamp: d(12*3600000), sentiment: 'positive', category: 'executive' },
  { id: 'f17', type: 'buy', source: 'KeyBanc', message: 'PLTR: Commercial revenue accelerating in financial services', confidence: 79, timestamp: d(15*3600000), sentiment: 'positive', category: 'news' },
  { id: 'f18', type: 'sell', source: 'Valuation', message: 'NVDA: P/E at 65x – elevated downside on any earnings miss', confidence: 69, timestamp: d(16*3600000), sentiment: 'negative', category: 'news' },
  { id: 'f19', type: 'neutral', source: 'Market', message: 'AMD: Server CPU market share stable at 24.3%', confidence: 73, timestamp: d(18*3600000), sentiment: 'neutral', category: 'news' },
  { id: 'f20', type: 'buy', source: 'Hiring', message: 'META: AI research hiring up 42% – Llama 4 expansion', confidence: 77, timestamp: d(20*3600000), sentiment: 'positive', category: 'hiring' },
]

export const watchlistItems: WatchlistItem[] = [
  { ticker: 'NVDA', name: 'NVIDIA Corporation', price: 1024.86, change: 33.86, changePercent: 3.42, aiScore: 87, sparkline: sp(900, 20), pinned: true },
  { ticker: 'TSLA', name: 'Tesla, Inc.', price: 178.24, change: 3.14, changePercent: 1.80, aiScore: 54, sparkline: sp(160, 20), pinned: false },
  { ticker: 'META', name: 'Meta Platforms', price: 512.44, change: -3.74, changePercent: -0.73, aiScore: 74, sparkline: sp(480, 20), pinned: true },
  { ticker: 'PLTR', name: 'Palantir Technologies', price: 24.18, change: 0.51, changePercent: 2.11, aiScore: 71, sparkline: sp(22, 20), pinned: false },
  { ticker: 'AMD', name: 'Advanced Micro Devices', price: 156.32, change: 1.92, changePercent: 1.23, aiScore: 71, sparkline: sp(145, 20), pinned: false },
  { ticker: 'MSFT', name: 'Microsoft Corporation', price: 415.26, change: 5.12, changePercent: 1.25, aiScore: 82, sparkline: sp(400, 20), pinned: false },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 176.44, change: 2.18, changePercent: 1.25, aiScore: 78, sparkline: sp(165, 20), pinned: false },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 184.72, change: 3.44, changePercent: 1.90, aiScore: 80, sparkline: sp(172, 20), pinned: false },
  { ticker: 'AAPL', name: 'Apple Inc.', price: 189.30, change: -0.82, changePercent: -0.43, aiScore: 69, sparkline: sp(185, 20), pinned: false },
  { ticker: 'CRM', name: 'Salesforce Inc.', price: 278.54, change: 4.22, changePercent: 1.54, aiScore: 66, sparkline: sp(265, 20), pinned: false },
]

export const companiesList = [
  { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', marketCap: '$2.5T', aiRank: 1, score: 87, change: 3.42 },
  { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', marketCap: '$3.1T', aiRank: 2, score: 82, change: 1.25 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication', marketCap: '$2.2T', aiRank: 3, score: 78, change: 1.25 },
  { ticker: 'AMZN', name: 'Amazon.com', sector: 'Consumer Disc.', marketCap: '$1.9T', aiRank: 4, score: 80, change: 1.90 },
  { ticker: 'META', name: 'Meta Platforms', sector: 'Communication', marketCap: '$1.3T', aiRank: 5, score: 74, change: -0.73 },
  { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', marketCap: '$253B', aiRank: 6, score: 71, change: 1.23 },
  { ticker: 'PLTR', name: 'Palantir Technologies', sector: 'Technology', marketCap: '$51B', aiRank: 7, score: 71, change: 2.11 },
  { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Disc.', marketCap: '$568B', aiRank: 8, score: 54, change: 1.80 },
  { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', marketCap: '$2.9T', aiRank: 9, score: 69, change: -0.43 },
  { ticker: 'CRM', name: 'Salesforce', sector: 'Technology', marketCap: '$270B', aiRank: 10, score: 66, change: 1.54 },
  { ticker: 'SNOW', name: 'Snowflake Inc.', sector: 'Technology', marketCap: '$48B', aiRank: 11, score: 58, change: -1.20 },
  { ticker: 'PANW', name: 'Palo Alto Networks', sector: 'Technology', marketCap: '$98B', aiRank: 12, score: 72, change: 0.88 },
  { ticker: 'SHOP', name: 'Shopify Inc.', sector: 'Technology', marketCap: '$88B', aiRank: 13, score: 65, change: 2.12 },
  { ticker: 'UBER', name: 'Uber Technologies', sector: 'Technology', marketCap: '$141B', aiRank: 14, score: 70, change: 1.44 },
  { ticker: 'PYPL', name: 'PayPal Holdings', sector: 'Financials', marketCap: '$72B', aiRank: 15, score: 52, change: -0.65 },
  { ticker: 'SQ', name: 'Block Inc.', sector: 'Financials', marketCap: '$40B', aiRank: 16, score: 55, change: 0.92 },
  { ticker: 'COIN', name: 'Coinbase Global', sector: 'Financials', marketCap: '$52B', aiRank: 17, score: 48, change: -2.34 },
  { ticker: 'RBLX', name: 'Roblox Corporation', sector: 'Communication', marketCap: '$22B', aiRank: 18, score: 49, change: 1.08 },
  { ticker: 'ABNB', name: 'Airbnb Inc.', sector: 'Consumer Disc.', marketCap: '$88B', aiRank: 19, score: 63, change: 0.54 },
  { ticker: 'NET', name: 'Cloudflare Inc.', sector: 'Technology', marketCap: '$40B', aiRank: 20, score: 68, change: 1.82 },
]

export const reportsList = [
  { id: 'r1', title: 'NVDA Pre-Earnings Intelligence', ticker: 'NVDA', type: 'Pre-Earnings', date: '2024-05-17', pages: 24, score: 87 },
  { id: 'r2', title: 'Semiconductor Sector Analysis Q2 2024', ticker: 'SECTOR', type: 'Sector Report', date: '2024-05-15', pages: 48, score: 78 },
  { id: 'r3', title: 'TSLA Risk Assessment Report', ticker: 'TSLA', type: 'Risk Report', date: '2024-05-14', pages: 18, score: 54 },
  { id: 'r4', title: 'AI Competitor Intelligence: Q2 2024', ticker: 'MULTI', type: 'Competitor Analysis', date: '2024-05-12', pages: 36, score: 82 },
  { id: 'r5', title: 'META Earnings Signal Report', ticker: 'META', type: 'Pre-Earnings', date: '2024-05-10', pages: 22, score: 74 },
  { id: 'r6', title: 'PLTR Government Contract Monitor', ticker: 'PLTR', type: 'Signal Report', date: '2024-05-08', pages: 16, score: 71 },
]

export const newsItems: NewsItem[] = [
  { id: 'nw1', headline: 'NVIDIA Blackwell GPU Demand Surges as AI Infrastructure Boom Continues', source: 'Reuters', timestamp: d(2*3600000), sentiment: 'positive', credibility: 95, summary: 'Record orders for Blackwell architecture GPUs as hyperscalers race to build AI infrastructure.' },
  { id: 'nw2', headline: 'US Commerce Dept Reviewing Additional AI Chip Export Restrictions to China', source: 'Bloomberg', timestamp: d(5*3600000), sentiment: 'negative', credibility: 92, summary: 'New restrictions could significantly impact NVIDIA and AMD revenues in the China market.' },
  { id: 'nw3', headline: 'Meta AI Llama 4 Launches with Multimodal Capabilities, Challenging OpenAI', source: 'TechCrunch', timestamp: d(7*3600000), sentiment: 'positive', credibility: 89, summary: 'Meta released Llama 4 with advanced reasoning and vision capabilities.' },
  { id: 'nw4', headline: 'Tesla Q2 Delivery Estimates Lowered as Competition from BYD Intensifies', source: 'WSJ', timestamp: d(10*3600000), sentiment: 'negative', credibility: 94, summary: 'Multiple analysts cut Q2 delivery estimates amid growing Chinese EV competition.' },
  { id: 'nw5', headline: 'Palantir Wins $480M DoD Contract for AI-Powered Battlefield Analysis', source: 'DefenseNews', timestamp: d(12*3600000), sentiment: 'positive', credibility: 91, summary: 'The DoD awarded Palantir a multi-year contract for AI analytics.' },
  { id: 'nw6', headline: 'AMD MI300X Orders Double as Microsoft and Meta Expand Infrastructure', source: "Barron's", timestamp: d(14*3600000), sentiment: 'positive', credibility: 88, summary: 'AMD sees dramatically increased MI300X orders from major hyperscalers.' },
  { id: 'nw7', headline: 'Fed Signals Two Rate Cuts in 2024 – Tech Stocks Rally on Lower Rate Outlook', source: 'CNBC', timestamp: d(18*3600000), sentiment: 'positive', credibility: 96, summary: 'Federal Reserve minutes indicate growing consensus for rate cuts, boosting tech stocks.' },
  { id: 'nw8', headline: 'Apple WWDC Preview: AI Features Coming to iPhone in Competition with Google', source: 'The Verge', timestamp: d(22*3600000), sentiment: 'neutral', credibility: 87, summary: 'Apple to announce on-device AI features at WWDC 2024.' },
  { id: 'nw9', headline: 'Semiconductor Supply Chain Normalizes as TSMC Capacity Ramp Accelerates', source: 'DigiTimes', timestamp: d(26*3600000), sentiment: 'positive', credibility: 85, summary: 'TSMC reports improved capacity utilization as demand for advanced chips recovers.' },
  { id: 'nw10', headline: 'Short Sellers Increase Bets Against TSLA as Delivery Data Disappoints', source: 'Bloomberg', timestamp: d(30*3600000), sentiment: 'negative', credibility: 90, summary: 'Short interest in Tesla reaches a three-year high following Q1 delivery miss.' },
]

export const marketTape = [
  { symbol: 'S&P 500', price: 5321.41, change: 0.63 },
  { symbol: 'NASDAQ', price: 16832.62, change: 1.02 },
  { symbol: 'DOW JONES', price: 39869.38, change: -0.12 },
  { symbol: 'VIX', price: 12.45, change: -2.18 },
  { symbol: 'GOLD', price: 2395.60, change: 0.71 },
  { symbol: 'OIL', price: 82.14, change: -0.34 },
  { symbol: 'BTC', price: 67842.00, change: 1.45 },
  { symbol: '10Y YIELD', price: 4.42, change: -0.08 },
]

export const TRACKED_TICKERS = ['NVDA', 'TSLA', 'META', 'PLTR', 'AMD']
export const TICKERS = Object.keys(companyData)

export function getCompany(ticker: string): Company {
  return companyData[ticker.toUpperCase()] || companyData['NVDA']
}
