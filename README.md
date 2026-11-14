# CHART ATLAS — 차트 읽는 눈을 기르다

> `chart-edu.moip.ai.kr` · GitHub Pages에서 동작하는 무료 한국어 기술적 분석 학습 사이트

## 주요 기능

- **43개 레슨**: OHLCV, 봉 집계, 추세 구조, 캔들, SMA/EMA, RSI, MACD, Stochastic, ADX, ATR%, VWAP, CMF, OBV, 리스크, 백테스트 편향, ETF 등
- **12개 캔들 패턴**: SVG 기반 벡터 도식(한국식 양봉 빨강·음봉 파랑)
- **실습실**: 같은 1분 가상 데이터를 3/5/9분으로 집계, 상승·하락·횡보·전환 시나리오, 과거 시점 재생 슬라이더
- **지표**: 가격 오버레이 SMA5/20, EMA12/26, Bollinger(20,2), 세션 근사 VWAP, 거래량; 하단 MACD(12,26,9), RSI(14), Stochastic Slow(5,3,3), ADX(14)·DI, ATR%(14), CMF(20), OBV
- **개별 퀴즈 + 12문제 챌린지**, 학습 완료 상태 브라우저 저장, 검색 가능한 용어 사전
- **다크 UI, 모바일 대응, 키보드 접근성**, 외부 JS/CSS/폰트/CDN/API 사용 없음
- **생성 WebP 이미지 4개** 및 인라인 SVG 도식

## 사용 방법

1. ZIP 압축을 해제합니다.
2. `index.html`을 Chrome, Edge 등의 브라우저로 열면 즉시 동작합니다. 개발용 서버/빌드 도구가 필요 없습니다.
3. GitHub Pages 배포 시 ZIP **내용물** (`index.html`, `styles.css`, `js/`, `assets/`, `CNAME` 등)을 저장소 루트에 업로드합니다.
4. GitHub 저장소 → **Settings → Pages → Build and deployment → Deploy from a branch** → `main` / `/(root)` → Save.
5. DNS 제공사에서 `chart-edu.moip.ai.kr`를 사용자 GitHub Pages 호스트(`YOUR_ACCOUNT.github.io`)로 연결하는 **CNAME**을 등록합니다. 조직/계정 소유 및 GitHub Pages에서 확인한 호스트 이름을 사용하세요. (값은 `github.com`이나 IP 주소가 아닙니다.)
6. Pages 설정의 **Custom domain**에 `chart-edu.moip.ai.kr`를 입력하고 DNS 인증·HTTPS 활성화를 확인합니다.

`CNAME` 파일에 도메인이 이미 포함되어 있습니다. GitHub Pages 최초 개설·DNS 반영은 사용자가 직접 수행해야 합니다.

## 파일 구조

```
index.html            — 전체 페이지와 교육 UI
styles.css            — UI 및 모바일 스타일
favicon.svg           — 로고
CNAME                 — chart-edu.moip.ai.kr
js/lessons.js         — 레슨/퀴즈/용어/캔들 도감 텍스트
js/indicators.js      — 데이터 생성·집계·지표 계산
js/app.js             — 인터랙션, 학습 진도, Canvas 차트
assets/*.webp         — 원본 생성 이미지에서 WebP로 변환한 4개 비주얼
tests/smoke.cjs       — Node.js 계산 스모크 테스트(선택)
```

## 데이터·보안·개인정보

- **실제 종목 시세가 아닙니다.** 가상의 1분 OHLCV를 고정 시드로 생성합니다. 지표 값도 이 데이터로 계산합니다.
- 거래일 09:00~15:30의 390분으로 설정한 모의 세션을 2개 생성합니다. 9분봉에서 390÷9의 잔여 3분은 미완성 집계로 간주해 제외합니다.
- 과거 시점 슬라이더는 **공개된 완성 봉까지만** 지표를 다시 계산하므로 미래 데이터를 참조하지 않습니다.
- 실습용 VWAP은 개별 실제 체결가격이 아닌 **HLC3(전형가격)×거래량의 근사**입니다.
- 사용자의 학습 완료 항목은 `localStorage`에만 저장되며 서버 전송·로그인·추적 기능이 없습니다. 브라우저 데이터 삭제 시 진도가 초기화됩니다.
- API 키, 비밀번호, 증권 계좌, 외부 네트워크 요청, 매매 주문 기능이 없습니다. 공개 저장소에 배포할 수 있는 **교육용 정적 사이트**입니다.
- 학습 자료이며 투자 권유가 아닙니다. 실제 주문이나 투자 전략 검증에 사용하기 전에 공식 거래소 데이터·상품설명서·원본 지표와 대조해야 합니다.

## 참조할 학습 자료

레슨은 원문을 복제하지 않고 직접 작성했습니다. 기술적 분석의 기본 개념을 교차 확인하기 위한 참고 출처:

- Fidelity, Technical Analysis (2026) — https://www.fidelity.com/learning-center/trading-investing/technical-analysis/what-is-technical-analysis
- Fidelity, Technical Analysis Indicator Guide — https://www.fidelity.com/learning-center/trading-investing/technical-analysis
- StockCharts ChartSchool, Technical Indicators & Overlays — https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays
- StockCharts ChartSchool, Chart Analysis — https://chartschool.stockcharts.com/table-of-contents/chart-analysis

**실습은 실제 시장의 예측을 목적으로 설계되지 않았습니다.**
