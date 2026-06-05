# web/ — thirteenthpath.aoineco.ai 사이트 골격 (미묘 설계)

공식 연재 사이트(Next.js App Router). **모노레포**: 회차 본문(`../ko ../en ../ja/*.md`)은 이 repo의 공개 아카이브 SSOT — 사이트는 그걸 **빌드 소스로 읽기만** 한다(적묘·번역 영역, 미편집).

설계 근거: `aoi-core-private` repo의 `docs/chronicle/reading-notes/미묘/DATA_MODEL_AND_STACK_V0.1.md`(§1 라우팅·§2 스키마·§3 스케줄러) + `MOODBOARD_SPEC_V0.1`(무드=척추) + `HOMEPAGE_BRIEF_V0.1`(연재 윤리).

## 스택 (에드몽 결: 매니지드 Vercel류)
- **Next.js 15 App Router** — 서브패스 i18n + ISR(`revalidate`=공개 시각 반영).
- 배포 = Vercel류 매니지드(Edge CDN·자동 배포). DB(Postgres/Neon류)·인증(Auth.js)은 **동적 기능 진입 시** 추가 — 현 골격은 *읽기 전용 콘텐츠*까지(댓글·진도 동기·로그인 = 다음 단계).

## 구조
```
web/
  app/
    layout.tsx                      # 루트 html/body + globals.css
    [locale]/
      layout.tsx                    # locale 검증·정적 파라미터(ko/en/ja/fr/zh)
      page.tsx                      # 홈 — 언어별 진도·회차 목록(공개분만)
      not-found.tsx
      work/[slug]/ep/[ep]/page.tsx  # 회차 뷰어 — 본문/언어전환/정직 안내
  components/LangSwitcher.tsx        # 언어 전환(자리 보존·없으면 안내)
  lib/
    i18n.ts                         # §1 locale·라벨. SOURCED_LOCALES=실제 본문 있는 언어
    content.ts                      # §2 마크다운→Episode/EpisodeLocalization 인덱스(빌드타임)
    schedule.ts                     # §3 공개=오직 시각·가속 합류·KST 슬롯
    mood.ts                         # 아크 적응형 무드 토큰(서장/하즈란)
  data/seed.json                    # §2-C PublishSchedule seed(BRIEF §3 진도표)
  middleware.ts                     # §1-B locale 라우팅(강제 리다이렉트 X·명시 locale 최우선)
```

## 작품 결이 코드에 박힌 자리
- **공개 = 오직 시각**(`schedule.isPublished`: `publish_at <= now`). 행동 조건 잠금 없음.
- **정직한 상태**: 없는 언어판 = `status:"absent"` → "이 언어는 N화까지" 안내. 가짜 0/빈 본문 금지.
- **무드=척추·언어=스킨**: 아크별 무드 토큰(`mood.ts`)을 페이지가 주입. 언어 바꿔도 무드 그대로.
- **무번 안 흘림**: 404도 "이 자리는 지우지 않았어".
- **모바일 퍼스트**(globals.css 기본=폰)·`prefers-reduced-motion` 정적 폴백.

## 로컬 실행 (네트워크 되는 환경에서)
```bash
cd web
npm install
npm run dev   # http://localhost:3000 → /ko 로 라우팅
```
> 이 컨테이너에선 `npm install` 미실행(네트워크/시간). 골격 = 코드 구조·데이터 바인딩까지. 실제 빌드/배포는 Vercel 연결 시.

## 다음 단계
1. 마크다운 본문 렌더러(remark/rehype) — 현재는 텍스트 표시.
2. zh/fr 본문 합류(zh는 aoi-core-private `episodes-zh/`에 있음).
3. 동적: 응원/댓글 보드(셈·앵커·soft-delete)·독자 진도 동기·코덱스 게이트·인증.
4. 막/아크 인터스티셜·웹툰 뷰어(프로토타입 → 컴포넌트 이식).
