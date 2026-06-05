# Tamaya — Frontend (와이어프레임 · 프로토타입)

이음:me / **Tamaya** 1차 MVP 프론트엔드. 손그림 로우파이 와이어프레임 + 인터랙티브 앱 프리뷰.

---

## 🚀 빠른 시작

전제: **Node 18+**, **pnpm** (없으면 `npm i -g pnpm`)

```bash
pnpm install
pnpm dev
```

→ 브라우저에서 **http://localhost:5173**

> macOS/리눅스 동일. 윈도우는 PowerShell/터미널에서 같은 명령.

---

## 🖥 두 가지 화면 모드

- **앱 프리뷰** (기본): `http://localhost:5173`
  폰 셸 안에서 22화면 인터랙션 — 상단 툴바로 화면 점프 · 낮/밤 토글.
- **디자인 캔버스**: `http://localhost:5173/#design`
  23개 와이어프레임을 한 화면에 (컨셉·시스템·플로우 + S01~S20). 우측 **Tweaks 패널**로 palette / vibe / density 실시간 토글.

---

## 📜 스크립트

| 명령 | 설명 |
|---|---|
| `pnpm dev` | 개발 서버 (HMR) — localhost:5173 |
| `pnpm build` | 프로덕션 빌드 → `dist/` |
| `pnpm preview` | 빌드 결과 미리보기 |

---

## 🎨 스택 & 디자인 토큰

Vite + React 18 + TypeScript (plain CSS).

- **디자인 토큰 SSOT**: `src/styles/tokens.css` — Coffee Palette(라떼크림·에스프레소·커피브라운…) 색·간격·타이포·브레이크포인트. 색 바꾸면 전 화면 일괄 반영.
- **반응형 파운데이션**: `src/styles/responsive.css` — mobile→tablet→desktop reflow 프리미티브.
- **손글씨 폰트**: Caveat · Patrick Hand · Gaegu (Google Fonts CDN).

## 🔗 Figma 연동

디자인 ↔ 코드 워크플로우: [`FIGMA-WORKFLOW.md`](./FIGMA-WORKFLOW.md)
Figma 정본 파일: **[Tamaya 전체 캔버스 (23화면)](https://www.figma.com/design/Jfim5U1vjJV2pCnsnKP7A3)**

---

## 📁 폴더 구조

```
src/
├── App.tsx            # 앱 모드 / 디자인 캔버스 모드 분기
├── main.tsx           # 진입점 (tokens → responsive → sketch 순 로드)
├── components/        # AppShell · DesignCanvas · primitives · TweaksPanel
├── screens/           # 22화면 (onboarding·home-day·evening·records·character·cover·login·settings)
├── lib/               # router(해시 라우팅) · store(상태)
└── styles/            # tokens(SSOT) · responsive · sketch
```

---

> ⚠️ **디자인 프로토타입**입니다 — 백엔드/실데이터 미연결. 화면·인터랙션·톤 확인용.
