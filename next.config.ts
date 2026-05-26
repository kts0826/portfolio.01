import type { NextConfig } from "next";

const securityHeaders = [
  // 클릭재킹 방지 — 다른 사이트의 iframe에 이 페이지를 넣지 못하게 함
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // MIME 타입 스니핑 방지 — 브라우저가 파일 형식을 임의로 추측하지 못하게 함
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // 외부 링크 클릭 시 referrer 정보 제한
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // HTTPS 강제 — 1년간 HTTPS로만 접속
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // 불필요한 브라우저 기능 차단 (카메라, 마이크, 위치정보 등)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // CSP — 허용된 출처의 리소스만 로드
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://i.ytimg.com https://*.ytimg.com https://img.youtube.com",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "connect-src 'self'",
      "font-src 'self'",
      "media-src 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
