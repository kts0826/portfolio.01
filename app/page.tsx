'use client';

import { useEffect, useState, useRef } from 'react';
import HeroCanvas from './components/HeroCanvas';

const TYPING_TEXTS = [
  'AI 콘텐츠 크리에이터',
  '3D 아티스트',
  'VFX 영상 제작자',
  'AI 이미지 생성자',
];

function useTypingEffect(texts: string[], speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setTextIdx((i) => (i + 1) % texts.length);
    }
    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  return displayed;
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

const skillGroups = [
  {
    category: '편집 툴',
    emoji: '🎨',
    tools: [
      { name: 'Photoshop', logoPath: '/logos/photoshop.png' },
      { name: 'Illustrator', logoPath: '/logos/illustrator.svg' },
      { name: 'After Effects', logoPath: '/logos/aftereffects.png' },
    ]
  },
  {
    category: 'AI 툴',
    emoji: '🤖',
    tools: [
      { name: 'ComfyUI', logoPath: '/logos/comfyui.png' },
      { name: 'Midjourney', logoPath: '/logos/midjourney.png' },
      { name: 'Kling', logoPath: '/logos/kling.png' },
    ]
  },
  {
    category: 'LLM',
    emoji: '🧠',
    tools: [
      { name: 'ChatGPT', logoPath: '/logos/chatgpt.svg' },
      { name: 'Gemini', logoPath: '/logos/gemini.svg' },
      { name: 'Claude', logoPath: '/logos/claude.svg' },
    ]
  },
  {
    category: '3D',
    emoji: '🎲',
    tools: [
      { name: 'Maya', logoPath: '/logos/maya.svg' },
      { name: 'Substance Painter', logoPath: '/logos/substance-painter.svg' },
    ]
  },
];

const imageSeries = [
  {
    category: '남성' as const,
    title: "Men's",
    subtitle: '남성 패션 · 포멀 · 아웃도어',
    description: '스튜디오 포멀룩부터 도심 거리, 통나무집, 캠프파이어까지 남성의 다양한 무드를 담은 시리즈.',
    images: [
      { src: '/works/studio-m/그레이_포멀_스튜디오.png', pos: '50% 0%' },
      { src: '/works/lifestyle-m/베이지_트렌치_도심.png', pos: '50% 0%' },
      { src: '/works/lifestyle-m/네이비_캐주얼_로그캐빈.png', pos: '50% 0%' },
      { src: '/works/formal-outdoor/브라운_캠핑_캠프파이어.png', pos: '50% 20%' },
    ],
    tags: ['ComfyUI', 'AI 이미지', '패션', '룩북'],
  },
  {
    category: '여성' as const,
    title: "Women's",
    subtitle: '여성 패션 · 스튜디오 · 시티',
    description: '블랙 스튜디오 무드부터 도시 빌딩 앞 수트룩, 스트리트 데님까지 여성 패션 시리즈.',
    images: [
      { src: '/works/mood-w/블랙수트_에지_스튜디오.png', pos: '50% 0%' },
      { src: '/works/mood-w/블랙레더_볼드_스튜디오.png', pos: '50% 0%' },
      { src: '/works/lifestyle-w/베이지_수트_시티.png', pos: '50% 0%' },
      { src: '/works/lifestyle-w/데님_캐주얼_스트리트.png', pos: '50% 0%' },
    ],
    tags: ['ComfyUI', 'AI 이미지', '화보', '포트레이트'],
  },
  {
    category: '제품' as const,
    title: 'Product',
    subtitle: '제품 상세페이지 · 광고 이미지',
    description: 'ChatGPT로 제작한 향수·시계 제품 광고 이미지 및 상세페이지 시리즈.',
    images: [
      { src: '/works/product/향수_매거진_커버.png', pos: '50% 0%' },
      { src: '/works/product/향수_상세페이지_01.png', pos: '50% 0%' },
      { src: '/works/product/향수_상세페이지_02.png', pos: '50% 0%' },
      { src: '/works/product/시계_상세페이지.png', pos: '50% 0%' },
    ],
    tags: ['ChatGPT', 'AI 이미지', '제품 페이지', '브랜딩'],
  },
  {
    category: '일러스트' as const,
    title: 'Illustration',
    subtitle: '일러스트 작업물',
    description: '캐릭터 일러스트 및 웹소설 북커버 작업물.',
    images: [
      { src: '/works/illustration/illustration-01.png', pos: '50% 50%' },
      { src: '/works/illustration/illustration-02.png', pos: '50% 50%' },
      { src: '/works/illustration/illustration-03.png', pos: '50% 50%' },
      { src: '/works/illustration/illustration-04.png', pos: '50% 50%' },
    ],
    tags: [],
  },
];

const projects = [
  {
    emoji: '🏆',
    title: '고혼진 AI 영상 광고 공모전',
    videoId: 'kQZmfpYMg0o',
    videoTitle: '비가 머문 자리, 아름다움이 피어나다.',
    description: '빗방울이 머문 자리, 더 맑고 깊은 빛이 피어납니다. 자연의 순수함과 전통의 지혜가 오늘의 피부에 스며드는 30초의 이야기.\n\n덧없는 순간이 아닌, 영원히 남겨지는 아름다움의 기록입니다.',
    tags: ['Midjourney', 'After Effects', 'Photoshop'],
    badge: '공모전 영상',
  },
  {
    emoji: '🎯',
    title: '지역주력 산업 AI영상 콘텐츠 공모전',
    videoId: 'FoA3ChT13xE',
    videoTitle: 'To The Next, Ulsan',
    description: 'AI 도구로 스토리보드를 설계하고, ComfyUI로 이미지와 영상을 생성해 울산 지역 주력산업인 수소차·전기차 부품 분야를 시각화한 홍보 콘텐츠입니다.\n\n중소벤처기업부 주관 2025 지역주력산업 영상 콘텐츠 공모전 출품작입니다.',
    tags: ['ComfyUI', 'AI 영상', '공모전'],
    badge: '공모전 영상',
  },
  {
    emoji: '📖',
    title: '웹 소설 쇼츠 영상',
    videoId: '7qd5CgUp-rQ',
    videoTitle: '웹 소설 쇼츠 영상',
    description: '',
    tags: ['ComfyUI', 'Midjourney', 'Photoshop', 'After Effects'],
    badge: '개인 작업물',
  },
];

const certifications = [
  { name: 'AI-POT 1급', org: '한국생산성본부', year: '2025.08' },
  { name: '컴퓨터그래픽스운용기능사', org: '한국산업인력공단', year: '2024.12' },
  { name: '운전 면허 1종 보통', org: '도로교통공단', year: '2017.08' },
  { name: 'MOS Master', org: 'Microsoft', year: '2024.11' },
  { name: '전산응용기계제도기능사', org: '한국산업인력공단', year: '2020.10' },
  { name: '기계가공조립기능사', org: '한국산업인력공단', year: '2016.07' },
];

const timeline = [
  {
    period: '2025.10 — 2025.11',
    title: 'ComfyUI × 나노바나나 완전정복',
    org: 'Fast Campus',
    desc: 'ComfyUI, Kontext node, Nanobanana node 활용법 및 AI 맥락 편집 영상 제작 기법 습득.',
    type: 'edu',
  },
  {
    period: '2025.10 — 2025.11',
    title: '2025 청년 도전 지원 사업',
    org: '고용노동부',
    desc: '단기 2기 청년 도전지원사업 프로그램 참여.\n\n· 진로 탐색 — 직업 가치관 탐색, 자기소개서 작성 및 면접 준비\n· 직업 체험 — 중장비, 제과제빵, 엑셀\n· 직업 적성 검사 — 직업 심리검사, CST검사, TCI 검사',
    type: 'activity',
  },
  {
    period: '2025.08 — 2025.12',
    title: '공모전 영상',
    org: '고혼진리퍼블릭 · 중소벤처기업부',
    desc: '· 고혼진 Timeless Beauty AI 광고 공모전 (0:30)\n· 2025 지역주력 산업 AI영상 콘텐츠 공모전\n\nAI 툴과 영상 편집 역량을 실전 결과물로 연결.',
    type: 'award',
  },
  {
    period: '2024.06 — 2025.01',
    title: 'MAYA/CG 학과 수업',
    org: 'SBS 컴퓨터 아트학원 (울산)',
    desc: 'Adobe Photoshop, Illustrator, After Effects, Maya 교육 이수.\n3D 모델링에서 영상 제작까지 CG 파이프라인 전반을 학습하고 포트폴리오 제작까지.',
    type: 'edu',
  },
  {
    period: '2021.10 — 2024.05',
    title: '개발팀 주임',
    org: '3D 프린팅 기업 (2년 7개월)',
    desc: '3D 기구 모델링 및 2D 도면 작업, 자사 3D 프린터 설계·제작·출력·AS, 자동차 그립퍼 설계, 울산대학교 연계 3D 프린터 교육 진행.',
    type: 'work',
  },
];

const typeLabels: Record<string, string> = {
  work: '경력',
  edu: '교육',
  award: '공모전',
  activity: '대외활동',
  military: '병역',
};

const ArrowIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);


export default function Home() {
  useTypingEffect(TYPING_TEXTS);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'전체' | '남성' | '여성' | '제품' | '일러스트'>('전체');
  const [emailCopied, setEmailCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const imageWorksRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (cat: '전체' | '남성' | '여성' | '제품' | '일러스트') => {
    setActiveCategory(cat);
    setTimeout(() => {
      if (cat === '전체') {
        imageWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        document.getElementById(`series-${cat}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('rlaxotjd0826@gmail.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };
  const [zoomed, setZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const hasDragged = useRef(false);


  const closeLightbox = () => { setLightboxImage(null); setZoomed(false); setPan({ x: 0, y: 0 }); };
  const handleImgClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasDragged.current) { hasDragged.current = false; return; }
    if (zoomed) setPan({ x: 0, y: 0 });
    setZoomed((z) => !z);
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!zoomed) return;
    hasDragged.current = false;
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged.current = true;
    setPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy });
  };
  const handleMouseUp = () => { dragRef.current = null; };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 z-50 w-full bg-[#FF2D00]">
        <div className="w-full flex items-center justify-between px-6 md:px-[8%] lg:px-[10%]" style={{ height: '56px' }}>
          {/* 로고 */}
          <a
            href="#home"
            onClick={() => setMenuOpen(false)}
            className="text-xl font-black tracking-widest text-white hover:text-black transition-colors"
          >
            KTS
          </a>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'About', href: '#about' },
              { label: 'Projects', href: '#projects' },
              { label: 'Career', href: '#career' },
              { label: 'Contact', href: '#contact' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-white hover:text-black transition-colors text-xl font-black italic tracking-tight uppercase whitespace-nowrap"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* 햄버거 버튼 (모바일) */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 z-[60]"
            aria-label="메뉴"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* 모바일 풀스크린 메뉴 */}
      <div
        className={`fixed inset-0 z-40 bg-[#FF2D00] flex flex-col justify-center px-10 transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-2">
          {[
            { label: 'About', href: '#about', sub: '소개' },
            { label: 'Projects', href: '#projects', sub: '작업물' },
            { label: 'Career', href: '#career', sub: '경력 & 이력' },
            { label: 'Contact', href: '#contact', sub: '연락처' },
          ].map(({ label, href, sub }, i) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="group flex items-baseline gap-4 py-5 border-b border-white/20 transition-all"
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : '0ms' }}
            >
              <span
                className="font-black italic uppercase leading-none text-white group-hover:text-black transition-colors"
                style={{ fontSize: 'clamp(32px, 9vw, 80px)', fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {label}
              </span>
              <span className="text-white/50 text-lg font-medium group-hover:text-black/50 transition-colors">{sub}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* ── Hero ── */}
      <section id="home" className="relative min-h-screen flex flex-col justify-end overflow-hidden">

        {/* 배경: Canvas 오른쪽에 절대 배치 */}
        <div className="absolute right-0 top-0 bottom-0 pointer-events-none hidden md:block" style={{ width: '55%' }}>
          <HeroCanvas />
        </div>

        {/* 텍스트 (풀너비, z-10) */}
        <div className="w-full px-6 md:px-[8%] lg:px-[10%] pb-16 pt-20 md:pt-0 relative z-10">
          <p className="text-[#FF2D00] text-[28px] font-bold tracking-[0.4em] uppercase mb-6">
            AI CONTENT CREATOR · 3D ARTIST · VFX
          </p>
          <h1 className="font-black leading-[1.05] tracking-tighter mb-10" style={{ fontSize: 'clamp(72px, 13vw, 200px)' }}>
            <span className="block text-white">김태성</span>
            <span className="block text-[#FF2D00]">AI 콘텐츠</span>
            <span className="block text-white">크리에이터</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8 border-t border-white/15">
            <p className="text-gray-400 text-lg leading-relaxed max-w-lg" style={{ wordBreak: 'keep-all' }}>
              3D 모델링 실무 경험을 바탕으로, Maya와 After Effects,<br />
              AI 제작 도구를 활용해 입체적인 시각 콘텐츠를 만들어갑니다.
            </p>
            <div className="flex gap-3 flex-shrink-0">
              <a href="#projects" className="px-8 py-3.5 bg-[#FF2D00] hover:bg-[#e02800] transition-colors font-bold text-white text-sm tracking-wide">
                작품 보기
              </a>
              <a href="#career" className="px-8 py-3.5 border border-white/25 hover:border-white hover:bg-white/5 transition-colors font-bold text-white text-sm tracking-wide">
                경력 & 이력
              </a>
            </div>
          </div>
        </div>

      </section>

      {/* ── Stats ── */}
      <section className="border-t border-b border-white/10">
        <div className="w-full px-6 md:px-[8%] lg:px-[10%]">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { num: '2년\n7개월', label: '실무 경험' },
              { num: '3회', label: '공모전 영상' },
              { num: '6개', label: '자격증 취득' },
              { num: '4가지', label: 'AI 툴 활용' },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="py-10 px-8">
                  <p className="text-[#FF2D00] font-black mb-1.5 whitespace-pre-line" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>{stat.num}</p>
                  <p className="text-gray-500 text-sm tracking-wide">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-32">
        <div className="w-full px-6 md:px-[8%] lg:px-[10%]">
          <div>
            <FadeIn>
              <p className="text-xl font-black italic tracking-tight text-[#FF2D00] uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>About</p>
            </FadeIn>
            <div>
              <FadeIn>
                <h3 className="font-black leading-tight mb-10" style={{ fontSize: 'clamp(36px, 5vw, 72px)', wordBreak: 'keep-all' }}>
                  정적인 결과물에서<br />
                  <span className="text-[#FF2D00]">움직이는 콘텐츠로</span>
                </h3>
              </FadeIn>
              <FadeIn>
                <div className="space-y-4 text-gray-400 text-lg leading-relaxed mb-16" style={{ wordBreak: 'keep-all' }}>
                  <p>어릴 때부터 무언가를 직접 만들고, 그것이 눈에 보이는 결과물로 완성되는 순간에 큰 즐거움을 느껴왔습니다. 3D 프린팅 기업에서 3D 모델링과 출력 업무를 수행하며 아이디어를 입체적인 결과물로 구현하는 실무 경험을 쌓았습니다.</p>
                  <p>정적인 출력물에서 나아가 조명, 구도, 움직임, 편집이 더해진 영상 콘텐츠로 표현 범위를 넓히고 싶다는 목표가 생겼습니다. 이후 Maya, After Effects와 ComfyUI, Midjourney, Kling 등 생성형 AI 도구를 학습하며<br />영상 콘텐츠 제작 역량을 키웠습니다.</p>
                </div>
              </FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-stretch">
                {skillGroups.map((group, groupIdx) => (
                  <FadeIn key={groupIdx} delay={groupIdx * 80} className="h-full">
                    <div className="h-full bg-[#141414] border border-white/10 hover:border-white/20 p-6 transition-colors">
                      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
                        <span className="text-xl">{group.emoji}</span>
                        <h4 className="font-black text-2xl text-white tracking-tight uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{group.category}</h4>
                      </div>
                      <div className="flex flex-col gap-4">
                        {group.tools.map((tool) => (
                          <div key={tool.name} className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
                              <img src={tool.logoPath} alt={tool.name} className="w-8 h-8 object-contain" />
                            </div>
                            <p className="text-xl text-gray-200 font-medium">{tool.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="py-32 border-t border-white/10">
        <div className="w-full px-6 md:px-[8%] lg:px-[10%]">
          <div className="mb-16">
            <FadeIn>
              <p className="text-xl font-black italic tracking-tight text-[#FF2D00] uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Projects</p>
            </FadeIn>
            <FadeIn>
              <h3 className="font-black leading-tight" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
                주요 <span className="text-[#FF2D00]">작업물</span>
              </h3>
            </FadeIn>
            <FadeIn>
              <p className="mt-4 text-white text-[28px] leading-relaxed">제작 기여도 100%</p>
            </FadeIn>
          </div>

          {/* Image Works */}
          <div ref={imageWorksRef} />
          <FadeIn>
            <div className="flex flex-col gap-3 mb-4">
              <p className="text-xl font-black italic tracking-tight text-gray-500 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Image Works</p>
              <div className="flex gap-2 flex-wrap">
                {(['전체', '남성', '여성', '제품', '일러스트'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-5 py-2 text-base font-bold tracking-wider transition-all ${
                      activeCategory === cat
                        ? 'bg-[#FF2D00] text-white'
                        : 'border border-white/20 text-gray-500 hover:border-white/50 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="space-y-px mb-24">
            {imageSeries.map((series, si) => (
              <FadeIn key={si} delay={si * 80}>
                <div id={`series-${series.category}`} className="p-6 bg-[#0a0a0a] border border-white/8 hover:border-white/15 transition-all">
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <h4 className="text-2xl font-black text-white">{series.title}</h4>
                      <p className="text-lg text-gray-500 mt-0.5">{series.subtitle}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {series.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 text-lg border border-white/15 text-gray-500">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-500 text-lg mb-5" style={{ wordBreak: 'keep-all' }}>{series.description}</p>
                  <div className={`grid grid-cols-2 gap-2 ${series.images.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
                    {series.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLightboxImage(img.src)}
                        className="relative aspect-[2/3] overflow-hidden group/img cursor-pointer"
                      >
                        <img
                          src={img.src}
                          alt={`${series.title} ${idx + 1}`}
                          className="w-full h-full object-cover transition-all duration-500 group-hover/img:scale-105 grayscale group-hover/img:grayscale-0"
                          style={{ objectPosition: img.pos }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-300" />
                      </button>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Video Works */}
          <FadeIn>
            <p className="text-xl font-black italic tracking-tight text-gray-500 uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Video Works</p>
          </FadeIn>
          <div className="border-t border-white/10">
            {projects.map((p, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div
                  className="flex items-center gap-5 py-4 border-b border-white/10 group hover:bg-white/[0.02] transition-colors cursor-pointer px-2"
                  onClick={() => setActiveVideo(p.videoId)}
                >
                  <span className="text-lg text-gray-700 font-mono w-6 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <div className="relative w-20 md:w-36 aspect-video flex-shrink-0 overflow-hidden bg-white/5">
                    <img
                      src={`https://img.youtube.com/vi/${p.videoId}/hqdefault.jpg`}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-black/50 group-hover:bg-[#FF2D00]/80 flex items-center justify-center transition-colors">
                        <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xl group-hover:text-[#FF2D00] transition-colors break-keep">{p.title}</p>
                    <p className="text-lg text-gray-600 mt-0.5">{p.tags.join(' · ')}</p>
                  </div>
                  <span className="text-lg px-2.5 py-1 border border-white/15 text-gray-500 flex-shrink-0 hidden md:block">{p.badge}</span>
                  <ArrowIcon className="w-4 h-4 text-gray-700 group-hover:text-[#FF2D00] transition-colors flex-shrink-0" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Career ── */}
      <section id="career" className="py-32 border-t border-white/10">
        <div className="w-full px-6 md:px-[8%] lg:px-[10%]">
          <div className="mb-16">
            <FadeIn>
              <p className="text-xl font-black italic tracking-tight text-[#FF2D00] uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Career</p>
            </FadeIn>
            <FadeIn>
              <h3 className="font-black leading-tight" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
                경력 & <span className="text-[#FF2D00]">이력</span>
              </h3>
            </FadeIn>
          </div>

          <div className="border-t border-white/10">
            {timeline.map((item, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="flex items-start gap-4 md:gap-8 py-7 border-b border-white/10 group hover:bg-white/[0.02] transition-colors px-2">
                  <span className="text-[23px] font-bold text-[#FF2D00] uppercase tracking-wider w-24 flex-shrink-0 pt-0.5 whitespace-nowrap">{typeLabels[item.type]}</span>
                  <span className="text-[23px] font-mono text-gray-600 w-28 flex-shrink-0 pt-0.5 hidden md:block">{item.period}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[23px] text-white mb-0.5 break-keep">{item.title}</p>
                    <p className="text-[19px] text-[#FF2D00]/70 mb-2 break-keep">{item.org}</p>
                    {item.desc && <p className="text-gray-500 text-[19px] leading-relaxed break-keep whitespace-pre-line">{item.desc}</p>}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Certifications */}
          <FadeIn>
            <div className="mt-20">
              <p className="text-xl font-black italic tracking-tight text-[#FF2D00] uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Certifications</p>
              <div className="border-t border-white/10">
                {certifications.map((cert, i) => (
                  <FadeIn key={i} delay={i * 40}>
                    <div className="flex items-center gap-4 py-4 border-b border-white/10 hover:bg-white/[0.02] transition-colors px-2 group">
                      <span className="text-sm md:text-[23px] font-mono text-gray-700 w-6 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm md:text-[19px] text-white group-hover:text-[#FF2D00] transition-colors break-keep">{cert.name}</p>
                        <p className="text-sm md:text-[19px] text-gray-600 break-keep">{cert.org}</p>
                      </div>
                      <span className="text-xs md:text-[19px] font-mono text-gray-600 flex-shrink-0">{cert.year}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-32 border-t border-white/10">
        <div className="w-full px-6 md:px-[8%] lg:px-[10%]">
          <div>
            <FadeIn>
              <p className="text-xl font-black italic tracking-tight text-[#FF2D00] uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Contact</p>
            </FadeIn>
            <FadeIn>
              <div>
                <h3 className="font-black leading-tight mb-8" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
                  함께 성장할<br />
                  <span className="text-[#FF2D00]">기회를 기다립니다</span>
                </h3>
                <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-lg" style={{ wordBreak: 'keep-all' }}>
                  3D 모델링, 영상 제작, AI 콘텐츠 제작 분야에서 함께 성장할 수 있는 기회를 찾고 있습니다.
                  포트폴리오와 관련해 궁금한 점이 있다면 편하게 연락 주세요.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href="https://mail.google.com/mail/?view=cm&to=rlaxotjd0826@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-[#FF2D00] hover:bg-[#e02800] transition-colors font-bold text-white tracking-wide"
                  >
                    📧 이메일 보내기
                  </a>
                  <button
                    onClick={copyEmail}
                    className="px-8 py-4 border border-white/25 hover:border-white hover:bg-white/5 transition-colors font-bold text-white tracking-wide"
                  >
                    📋 이메일 복사
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="mt-24 pt-8 border-t border-white/10 text-gray-700 text-lg tracking-wider">
            © 2026 Kim Tae-Sung. All rights reserved.
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="flex items-start gap-4">
            <div className="overflow-hidden flex items-center justify-center" style={{ maxHeight: '90vh' }}>
              <img
                src={lightboxImage}
                alt="확대 이미지"
                className="max-w-full max-h-[90vh] block select-none"
                style={{
                  transform: zoomed ? `translate(${pan.x}px, ${pan.y}px) scale(2)` : 'scale(1)',
                  transition: dragRef.current ? 'none' : 'transform 0.3s ease',
                  cursor: zoomed ? (dragRef.current ? 'grabbing' : 'zoom-out') : 'zoom-in',
                }}
                onClick={handleImgClick}
                onMouseDown={handleMouseDown}
                draggable={false}
              />
            </div>
            <div
              className="hidden md:flex flex-col items-start gap-3 pt-1 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-bold transition-colors whitespace-nowrap"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                닫기
              </button>
              <span className="text-white/40 text-sm font-medium whitespace-nowrap">
                {zoomed ? '클릭하여 축소 · 드래그로 이동' : '클릭하여 확대'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Video Modal ── */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setActiveVideo(null)}
        >
          <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-10 right-0 flex items-center gap-1.5 text-white/50 hover:text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              닫기
            </button>
            <div className="aspect-video overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 이메일 복사 토스트 ── */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-10 py-5 bg-white text-black font-bold text-lg tracking-wide whitespace-nowrap transition-all duration-300 ${emailCopied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        ✅ 이메일이 복사되었습니다.
      </div>

    </div>
  );
}
