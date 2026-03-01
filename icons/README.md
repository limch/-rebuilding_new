# 재건축·재개발 법령 AI 챗봇 - PWA 아이콘 안내

## 아이콘 요구사항

PWA 앱이 제대로 작동하려면 다음 크기의 아이콘 이미지가 필요합니다:

### 필수 아이콘 크기
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## 아이콘 생성 방법

### 옵션 1: 온라인 도구 사용 (권장)
1. **PWA Image Generator** 사용
   - https://www.pwabuilder.com/imageGenerator
   - `icons/icon.svg` 파일 업로드
   - 모든 크기의 PNG 파일 자동 생성
   - 다운로드 후 `icons/` 폴더에 저장

2. **Favicon Generator** 사용
   - https://realfavicongenerator.net/
   - SVG 또는 PNG (512x512) 업로드
   - PWA 옵션 선택
   - 생성된 파일들을 `icons/` 폴더에 저장

### 옵션 2: 디자인 툴 사용
1. **Figma/Adobe XD**
   - `icons/icon.svg` 열기
   - 각 크기별로 Export
   - 파일명: `icon-72x72.png`, `icon-96x96.png` 등

2. **Photoshop/GIMP**
   - SVG를 512x512로 래스터화
   - 각 크기별로 리사이즈
   - PNG로 저장

### 옵션 3: CLI 도구 (개발자용)
```bash
# ImageMagick 설치 필요
convert icons/icon.svg -resize 72x72 icons/icon-72x72.png
convert icons/icon.svg -resize 96x96 icons/icon-96x96.png
convert icons/icon.svg -resize 128x128 icons/icon-128x128.png
convert icons/icon.svg -resize 144x144 icons/icon-144x144.png
convert icons/icon.svg -resize 152x152 icons/icon-152x152.png
convert icons/icon.svg -resize 192x192 icons/icon-192x192.png
convert icons/icon.svg -resize 384x384 icons/icon-384x384.png
convert icons/icon.svg -resize 512x512 icons/icon-512x512.png
```

## 아이콘 파일 위치
```
icons/
├── icon.svg              # 원본 SVG (제공됨)
├── icon-72x72.png       # 생성 필요
├── icon-96x96.png       # 생성 필요
├── icon-128x128.png     # 생성 필요
├── icon-144x144.png     # 생성 필요
├── icon-152x152.png     # 생성 필요
├── icon-192x192.png     # 생성 필요
├── icon-384x384.png     # 생성 필요
└── icon-512x512.png     # 생성 필요
```

## 아이콘 디자인 가이드

### 색상
- 배경: 그라데이션 (#1e40af → #3b82f6)
- 아이콘: 흰색 (#ffffff)
- 테두리: 둥근 모서리 (radius: 15.6%)

### 요소
- **저울**: 법령, 공정함을 상징
- **텍스트**: "재건축·재개발 법령 AI"
- **스타일**: 모던, 심플, 전문적

### Safe Zone
- 중요 요소는 중앙 80% 영역에 배치
- 가장자리 10%는 여백 유지

## 테스트

아이콘 생성 후 다음을 확인하세요:

1. **Manifest 검증**
   - Chrome DevTools > Application > Manifest
   - 모든 아이콘이 로드되는지 확인

2. **설치 테스트**
   - 브라우저에서 "설치" 버튼 클릭
   - 홈 화면 아이콘 확인

3. **여러 디바이스 테스트**
   - Android: Chrome
   - iOS: Safari
   - Desktop: Chrome/Edge

## 문제 해결

### 아이콘이 표시되지 않는 경우
1. 파일명이 manifest.json과 일치하는지 확인
2. 파일 경로가 정확한지 확인
3. 파일 권한 확인 (읽기 가능)
4. 캐시 삭제 후 재시도

### PWA 설치 프롬프트가 표시되지 않는 경우
1. HTTPS 사용 확인 (localhost 제외)
2. manifest.json 문법 오류 확인
3. Service Worker 등록 확인
4. 최소 192x192, 512x512 아이콘 필수

## 추가 리소스

- [PWA 아이콘 가이드](https://web.dev/add-manifest/)
- [Maskable Icons](https://maskable.app/)
- [PWA Builder](https://www.pwabuilder.com/)

---

**참고**: `icons/icon.svg`는 placeholder입니다. 실제 프로덕션 배포 시 디자이너가 제작한 고품질 아이콘으로 교체하시기 바랍니다.
