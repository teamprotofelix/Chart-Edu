# CHART ATLAS 2.0 — 차트 읽는 눈을 기르다

`https://chart-edu.moip.ai.kr/` 배포를 목표로 만든 **순수 정적 한국어 주식 차트·금융상품 교육 아카데미**입니다. 기존 1.0 사이트의 레이아웃·WebP 아트워크·차트 실습실을 유지하며, 초보부터 전문가까지의 학습 경로와 캔들 문제은행, ETF·커버드콜·배당·선물 학습 및 시뮬레이터를 확장했습니다.

> 교육용 프로젝트입니다. 투자 추천, 실시간 시세, 수익 보장, 자동거래 기능이 없습니다. 법률·세금·상품 규격은 시점과 상품별로 다를 수 있으므로 실제 투자 전 해당 상품의 최신 설명서·공시와 거래소 안내를 확인하세요.

## 주요 기능

| 기능 | 구성 |
|---|---|
| 난이도별 커리큘럼 | **80개** 한국어 레슨 (초급·중급·고급 필터, 카테고리 및 검색, 개별 이해 확인) |
| 캔들 도감 | **12개** 패턴, SVG 시각 도식, 선행 추세와 후속 확인 설명 |
| 캔들 문제은행 | **75문제**: 그림 12, 문맥·확인·오해 48, OHLC 계산 15. 난이도·유형 선택, 10/20/전체 무작위 출제, 오답 재학습 |
| 차트 실습 | **4개 가상 시장 시나리오** × **3·5·9분봉**, SMA/EMA/VWAP/볼린저·거래량, RSI/MACD/스토캐스틱/ADX/ATR%/CMF/OBV, 과거 시점 탐색 |
| 금융상품 레슨 | ETF/ETN, NAV/괴리율, 배당·분배·배당락, 인버스/레버리지, 선물·증거금, 콜·풋 옵션, 커버드콜·타겟 커버드콜, 채권/리츠/환헤지, 옵션 그릭스 |
| 계산 실험실 | **4종** — 커버드콜 주식 보유 대비 만기손익, 분배금 전후 NAV·현금, 가상 선물 롱/숏 및 증거금, 일간 레버리지/인버스 복리 |
| 종합 챌린지 | 초급·중급·고급·ETF/배당/선물/커버드콜 4개 코스, 각 12문제 풀이 |
| 용어사전 | **80개** 단어 검색 |
| 진도 | 레슨 완료 여부와 캔들 풀이·오답만 브라우저 `localStorage`에 저장. 서버 전송 없음 |
| 이미지 | 기존에서 제작된 현지 `WebP` 일러스트 **4개**, SVG/Canvas 차트, 외부 폰트·CDN 필요 없음 |

## GitHub Pages 배포

1. 압축을 해제하고 **압축을 푼 폴더 안의 파일 전체를 저장소 루트**에 업로드합니다. `index.html`이 루트에 있어야 합니다.
2. GitHub 저장소 → **Settings → Pages → Build and deployment** → Deploy from a branch → `main` / `/(root)` → Save.
3. Pages에서 안내하는 `https://<계정>.github.io/<저장소>/` 주소로 초기 동작을 점검합니다.
4. DNS 관리 화면에서 `chart-edu.moip.ai.kr`의 **CNAME** 레코드를 GitHub Pages 호스트(`<계정>.github.io`)로 설정합니다. DNS 대상은 **실제 사용하는 GitHub 계정**으로 수정해야 하며 IP 주소/다른 사이트를 무작정 복사하지 마세요.
5. 저장소 Pages 설정 → **Custom domain**에 `chart-edu.moip.ai.kr`를 입력합니다. 배포본에는 정확히 이 도메인의 `CNAME` 파일이 포함되어 있습니다.
6. DNS와 도메인 검증 후 **Enforce HTTPS**를 활성화합니다. 보안 및 도메인 소유권을 위해 공식 GitHub Pages 가이드도 확인하세요.

일반적인 정적 웹호스팅에서도 같은 파일 구성이 동작합니다. 로컬에서 `index.html` 직접 실행도 가능하도록 외부 CDN 의존 없이 작성했습니다. 단, 브라우저별 로컬 파일 보안 정책 차이가 있을 수 있으므로 실제 공개 환경은 HTTPS 호스팅에서 최종 확인해야 합니다.

## 구조

```text
chart-edu-site/
├── index.html
├── styles.css
├── academy.css
├── js/
│   ├── lessons.js          # 기존 43개 레슨, 12개 패턴, 42개 용어
│   ├── academy-content.js  # 새 37개 레슨, 38개 용어, 공식 참고자료
│   ├── indicators.js       # 가상 시세·기술지표 계산
│   ├── finance-formulas.js # 독립 테스트 가능한 4개 모의 금융 계산식
│   ├── app.js              # 레슨·차트·종합 챌린지 UI
│   └── academy.js          # 상품 실습 UI + 75문항 캔들 훈련 UI
├── assets/
│   ├── observatory-hero.webp
│   ├── observatory-lab.webp
│   ├── explore-hero.webp
│   └── explore-lab.webp
├── tests/
│   ├── smoke.cjs
│   └── academy.cjs
├── CNAME
├── favicon.svg
└── .nojekyll
```

## 안전성 및 오해 방지

- **실제 주가, 투자계좌, 증권사 API, 주문, 로그인, 서드파티 분석 스크립트 없음.** 사이트는 자체 파일과 사용자 브라우저에서만 동작합니다.
- 캔들·기술지표의 모양이나 숫자는 수익을 보장하지 않습니다. 패턴의 맥락·반례·봉 확정 여부를 함께 교육합니다.
- **커버드콜 모의 계산기**: `만기손익 = ST − S0 + 프리미엄 − max(ST − 행사가, 0)`의 한 번 만기 보유/옵션 100% 매도 단순 모델입니다. 옵션 프리미엄과 행사가를 독립적으로 조절하므로 실제 시장에서 성립하지 않는 조합도 선택될 수 있습니다. 실제 ETF는 매도비중, 롤·환율·분배·비용 등이 달라집니다.
- **배당·분배금 계산기**: 분배락 직후 **다른 시장 변화가 없고 세금·비용이 없는 단순 이론 예시**입니다. 현금 수령이 즉각적인 부의 증가를 뜻하는 것은 아닙니다. 원금 성격의 환급 여부·분배금 보장 여부에 주의하세요.
- **선물 계산기**: 승수(기본 1만원/포인트), 증거금률(기본 10%)은 **실제 상품의 거래 규격이 아닌 가상값**입니다. 선물 손실은 증거금을 초과할 수 있습니다. 실제 규격은 KRX 등에서 확인하세요.
- **레버리지 계산기**: `100×(1+k·r₁)×(1+k·r₂)` 단순 일간 목표배수입니다. 상품의 실제 추적오차·비용·선물 롤 등의 영향은 반영하지 않습니다.
- **배당락·과세**: 나라·시장·계좌·상품마다 다릅니다. 실제 날짜나 세율은 정적으로 고정하지 않았습니다.
- 로컬 학습 진도와 오답은 브라우저에만 저장하며 '문제 기록 초기화' 버튼으로 지울 수 있습니다. 같은 기기라도 브라우저 프로필·시크릿 모드에 따라 지속 저장되지 않을 수 있습니다.

## 테스트

Node.js 설치 환경에서:

```bash
node tests/smoke.cjs
node tests/academy.cjs
```

또한 Chromium 브라우저로 데스크톱(1440px), 모바일(390px)의 메뉴, 모달, 퀴즈, 계산기, 레슨 필터를 동작 점검했습니다. **실제 GitHub Pages 배포 및 DNS 반영 후의 외부 기기 확인은 별도 필요**합니다.

## 참고한 공식 교육 자료

교육 페이지 하단에도 원문 링크가 있습니다.

1. [SEC Investor.gov: Fund Distributions (2026-08-19)](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/fund-distributions-investor-bulletin) — 분배, NAV, 원금 환급, 총수익.
2. [SEC Investor.gov: Exchange-Traded Funds](https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-2) — ETF 구조와 거래 특성.
3. [Options Industry Council: Covered Call](https://www.optionseducation.org/strategies/all-strategies/covered-call-buy-write) — 옵션 매도의 상승 제한·하방 위험.
4. [CME: Margin — Know What's Needed](https://www.cmegroup.com/education/courses/introduction-to-futures/margin-know-what-is-needed) — 선물 증거금과 청산.
5. [KRX KIND 국내 ETF 상품 정보 예시](https://kind.krx.co.kr/disclosure/etfisudetail.do?method=searchEtfIsuSummary&strIsurCd=28948) — 국내 커버드콜 ETF의 설명·공시.
6. [SEC Investor.gov: Ex-Dividend Dates](https://www.investor.gov/introduction-investing/investing-basics/glossary/ex-dividend-dates-when-are-you-entitled-stock-and) — 미국 기준 배당락 기초. 국내 일정과 혼용하지 마세요.

## 라이선스·이미지

웹사이트 교육 설명문과 자체 작성 코드/스타일은 이 배포 패키지용입니다. 4개 WebP는 이 프로젝트를 위해 생성한 비(非)실제시세 콘셉트 아트워크입니다. 출처 사이트의 본문/사진은 패키지에 복제하지 않고 링크만 제공합니다.
