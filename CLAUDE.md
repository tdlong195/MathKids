# MathKids — Web App Học Toán Cho Trẻ Em

## Mô tả sản phẩm
Web app học toán tương tác cho trẻ 3-10 tuổi. Có animation, âm thanh SFX, lưu tiến độ đa profile trên cùng trình duyệt (localStorage). Không cần tài khoản, không cần backend, không dùng AI/LLM API cho bất kỳ logic nào.

---

## Tech Stack (cố định — không thay thế)

| Thư viện | Mục đích | Lý do chọn |
|----------|----------|------------|
| Next.js 14+ App Router | Framework | File-based routing, RSC, easy deployment |
| TypeScript | Ngôn ngữ | Type safety cho data model phức tạp (Question, Profile) |
| Styled Components | Styling | CSS-in-JS, theme provider, props-based variants |
| Zustand | State management | Điểm số, streak, profile hiện tại — đơn giản, không boilerplate |
| Framer Motion | Animation | Spring physics, gesture support, exit animations |
| Howler.js | Sound effects | Cross-browser audio, preloading, volume control |

**Không dùng:** Tailwind CSS, Redux, React Query, AI/LLM API (OpenAI, Anthropic, etc.)

---

## Cấu trúc thư mục chuẩn

```
mathkids/
├── app/
│   ├── layout.tsx              # Root layout, StyledComponents registry, global font
│   ├── page.tsx                # Profile selector screen (home)
│   ├── (game)/
│   │   ├── layout.tsx          # Game layout (score bar, mute button)
│   │   ├── play/page.tsx       # Main game screen — routes to correct interaction board
│   │   └── results/page.tsx    # Post-session celebration screen
│   └── profile/
│       └── create/page.tsx     # Create new profile screen
├── components/
│   ├── profile/
│   │   ├── ProfileCard.tsx
│   │   ├── ProfileSelector.tsx
│   │   └── CreateProfileForm.tsx
│   ├── game/
│   │   ├── QuestionDisplay.tsx     # Renders prompt + routes to interaction board
│   │   ├── ScoreBar.tsx
│   │   ├── FeedbackOverlay.tsx     # Correct/wrong animation overlay
│   │   ├── CelebrationScreen.tsx
│   │   ├── interaction/            # One component per interactionMode
│   │   │   ├── ChoiceBoard.tsx         # mode: choice (default)
│   │   │   ├── TapCountBoard.tsx       # mode: tapCount
│   │   │   ├── DragDropBoard.tsx       # mode: dragDrop
│   │   │   ├── OrderingBoard.tsx       # mode: ordering
│   │   │   ├── MemoryMatchBoard.tsx    # mode: memoryFlip
│   │   │   ├── BalanceScaleBoard.tsx   # mode: balanceScale
│   │   │   ├── BallShootBoard.tsx      # mode: ballShoot
│   │   │   └── ClockDragBoard.tsx      # mode: clockDrag
│   │   └── session/                # Session-level game mode wrappers
│   │       ├── NumberRaceSession.tsx   # gameMode: numberRace
│   │       ├── PuzzleRevealSession.tsx # gameMode: puzzleReveal
│   │       ├── EscapeRoomSession.tsx   # gameMode: escapeRoom
│   │       └── TimeAttackBar.tsx       # countdown timer for timeAttack mode
│   └── ui/
│       ├── KidButton.tsx
│       ├── MuteButton.tsx
│       └── StarDisplay.tsx
├── lib/
│   ├── generators/
│   │   ├── counting.ts         # 3-4: counting 1-10 (tapCount / choice)
│   │   ├── shapes.ts           # 3-4: shape recognition (choice)
│   │   ├── quantityMatch.ts    # 3-4: match number to quantity (dragDrop)
│   │   ├── sizeOrdering.ts     # 3-4: order objects by size (ordering)
│   │   ├── memoryMatch.ts      # 3-4: flip card pairs (memoryFlip)
│   │   ├── addition.ts         # 5-6, 7-8: addition (choice / ballShoot)
│   │   ├── subtraction.ts      # 5-6, 7-8: subtraction (choice)
│   │   ├── comparison.ts       # 3-4, 5-6: compare quantities (choice)
│   │   ├── sequence.ts         # 5-6: fill missing number (dragDrop)
│   │   ├── wordProblem.ts      # 5-6, 7-8: story-based math (choice)
│   │   ├── balanceScale.ts     # 5-6: balance equation (balanceScale)
│   │   ├── multiplication.ts   # 7-8: times tables (choice / ballShoot)
│   │   ├── division.ts         # 7-8: basic division (choice)
│   │   ├── clock.ts            # 7-8: tell time (clockDrag)
│   │   ├── measurement.ts      # 7-8: length/weight estimation (dragDrop)
│   │   ├── money.ts            # 7-8: shopping simulation (choice)
│   │   ├── fractions.ts        # 9-10: fraction recognition (choice)
│   │   ├── fractionCompare.ts  # 9-10: compare fractions (dragDrop / choice)
│   │   ├── geometry.ts         # 9-10: area/perimeter (choice / ordering)
│   │   └── index.ts            # Factory: getGenerator(topic, ageGroup)
│   ├── sound/
│   │   └── soundManager.ts     # Singleton Howl instances, mute state
│   └── storage/
│       └── profiles.ts         # localStorage CRUD for Profile[]
├── store/
│   ├── profileStore.ts         # profiles[], currentProfileId, CRUD actions
│   └── gameStore.ts            # session state, score, streak, phase, gameMode
├── types/
│   ├── profile.ts
│   ├── question.ts
│   └── topic.ts
└── public/
    └── sounds/
        ├── correct.mp3
        ├── wrong.mp3
        ├── click.mp3
        └── celebration.mp3
```

---

## Naming Conventions

### Files & Components
- **Components:** PascalCase — `ProfileCard.tsx`, `QuestionDisplay.tsx`
- **Utilities/libs:** camelCase — `soundManager.ts`, `profiles.ts`
- **Generators:** camelCase noun — `counting.ts`, `addition.ts`
- **Pages:** Next.js convention — `page.tsx`, `layout.tsx`

### TypeScript
- **Types/Interfaces:** PascalCase — `Profile`, `Question`, `Choice`
- **Zustand stores:** camelCase suffix `Store` — `profileStore`, `gameStore`
- **Store actions:** verb prefix — `addProfile`, `setCurrentProfile`, `updateScore`
- **Generator functions:** `generate` prefix — `generateCounting()`, `generateAddition()`

### Styled Components
- **Wrapper divs:** `Wrapper` suffix — `CardWrapper`, `ScreenWrapper`
- **Text elements:** semantic suffix — `TitleText`, `PromptText`, `HintText`
- **Interactive elements:** `Button` suffix or element name — `ChoiceButton`, `AvatarButton`
- **Animated wrappers:** `Animated` prefix — `AnimatedOverlay`, `AnimatedCard`

### Sound files
- Lowercase, hyphen-separated: `correct.mp3`, `wrong.mp3`, `level-up.mp3`

---

## Quy tắc Code

### Ngôn ngữ
- **Comment trong code:** Tiếng Anh
- **Trao đổi với user / giải thích:** Tiếng Việt
- **Commit message:** Tiếng Anh

### Không dùng AI/LLM API
Toàn bộ logic sinh đề bài, validate đáp án, tính điểm — viết bằng TypeScript thuần. Không gọi bất kỳ AI API nào cho nghiệp vụ của app.

### Comment style
- Chỉ comment khi WHY không hiển nhiên (constraint ẩn, workaround bug, invariant tinh tế)
- Không comment WHAT — tên hàm/biến đã đủ mô tả
- Không viết JSDoc block dài cho mọi hàm

---

## UX Rules cho Trẻ Nhỏ (bắt buộc tuân theo)

1. **Font size tối thiểu:** 24px cho text câu hỏi, 32px+ cho số/đáp án, 20px cho UI phụ
2. **Touch target tối thiểu:** 64×64px cho mọi button/choice tương tác; drag handle ≥ 80×80px
3. **Animation:** Chậm, rõ ràng — duration 400ms-800ms. Không dùng `ease` nhanh như UI người lớn. Xem `kid-animation-skill.md`
4. **Khi sai:** KHÔNG hiện "Sai rồi!" to. Dùng ngôn ngữ tích cực: "Thử lại nhé! 💪", "Gần đúng rồi!"
5. **Khi đúng lần 2 (sau khi sai):** Highlight nhẹ đáp án đúng, không phạt, không trừ điểm kèm animation
6. **Session ngắn:** 5 câu (3-4 tuổi), 7 câu (5-6 tuổi), 9 câu (7-8 tuổi), 10 câu (9-10 tuổi). Sau session có màn celebration bắt buộc
7. **Ưu tiên chạm/kéo thả:** Đặc biệt nhóm 3-5 tuổi — tránh yêu cầu nhập bàn phím
8. **Không có cảm giác "game over":** App luôn cho phép thử lại hoặc chuyển chủ đề
9. **Drag-and-drop:** Luôn có visual feedback khi item đang được kéo (scale up + shadow). Drop zone highlight khi item hover qua. Snap animation khi thả vào đúng vị trí (spring, 300ms)
10. **Memory match:** Lật thẻ duration 300ms. Nếu không khớp, giữ lộ 1s rồi úp lại — không úp ngay tức thì
11. **Time attack (9-10 tuổi):** Countdown bar thay vì đồng hồ số. Màu bar chuyển xanh→vàng→đỏ theo thời gian còn lại. Không dùng âm thanh tick-tock gây áp lực
12. **Ball shoot:** Tốc độ bóng bay phải chậm đủ để trẻ đọc số và chạm — min 2s để bóng đi qua màn hình

---

## Hệ thống Điểm

- Câu đúng lần 1: **+2 sao**
- Câu đúng lần 2 (sau 1 lần sai): **+1 sao**
- Câu sai cả 2 lần: **+0 sao** (không trừ)
- Sao lưu vào profile, chỉ dùng để hiển thị động lực — không unlock gì

---

## Data Models

```typescript
// types/topic.ts
type AgeGroup = '3-4' | '5-6' | '7-8' | '9-10'

type Topic =
  // 3-4 tuổi
  | 'counting'        // đếm số 1-10
  | 'shapes'          // nhận diện hình khối
  | 'quantityMatch'   // ghép số với số lượng
  | 'comparison'      // so sánh nhiều/ít (also 5-6)
  | 'sizeOrdering'    // sắp xếp theo kích thước
  | 'memoryMatch'     // lật thẻ tìm cặp
  // 5-6 tuổi
  | 'addition'        // cộng ≤10 (also 7-8)
  | 'subtraction'     // trừ ≤10 (also 7-8)
  | 'sequence'        // điền số còn thiếu trong dãy
  | 'wordProblem'     // cộng trừ qua câu chuyện (also 7-8)
  | 'balanceScale'    // cân bằng phép tính
  // 7-8 tuổi
  | 'multiplication'  // bảng cửu chương
  | 'division'        // phép chia cơ bản
  | 'clock'           // đọc đồng hồ kim
  | 'measurement'     // đo lường trực quan (cm, kg)
  | 'money'           // mua sắm giả lập, tính tiền thừa
  // 9-10 tuổi
  | 'fractions'       // nhận diện phân số qua hình ảnh
  | 'fractionCompare' // so sánh phân số
  | 'geometry'        // chu vi, diện tích hình đơn giản

// InteractionMode: cách một câu hỏi được trả lời
type InteractionMode =
  | 'choice'        // chọn 1 trong N đáp án (mặc định)
  | 'tapCount'      // chạm từng đồ vật để đếm rồi chọn số
  | 'dragDrop'      // kéo item vào đúng vùng đích
  | 'ordering'      // kéo sắp xếp items theo thứ tự đúng
  | 'memoryFlip'    // lật thẻ tìm cặp khớp
  | 'balanceScale'  // kéo quả cân vào 2 đĩa cân bằng nhau
  | 'ballShoot'     // chạm/bắn quả bóng có số đúng đáp án
  | 'clockDrag'     // kéo kim đồng hồ đến đúng giờ
  | 'timeAttack'    // như choice nhưng có đếm ngược thời gian

// GameMode: "vỏ UI" bọc quanh toàn session (không ảnh hưởng Question model)
type GameMode =
  | 'standard'      // Q&A flow thông thường (mặc định)
  | 'numberRace'    // nhân vật chạy đua — mỗi câu đúng = bước tiến
  | 'puzzleReveal'  // mỗi câu đúng mở 1 mảnh ghép hình
  | 'escapeRoom'    // mỗi câu đúng mở 1 khóa số (9-10 tuổi)
  | 'spinWheel'     // quay vòng random ra phép tính (7-8 tuổi)
  | 'combo'         // đúng liên tiếp mở danh hiệu/trang phục

// types/profile.ts
interface Profile {
  id: string
  name: string
  avatar: string           // emoji string, e.g. "🦁"
  ageGroup: AgeGroup
  stars: number
  history: TopicHistory[]
  createdAt: number        // Date.now()
}

interface TopicHistory {
  topic: Topic
  correct: number
  wrong: number
  lastPlayed: number       // Date.now()
}

// types/question.ts
interface Question {
  id: string
  topic: Topic
  interactionMode: InteractionMode  // determines which board component renders
  prompt: string           // e.g. "3 + 4 = ?"
  visualEmojis?: string[]  // emoji array for visual counting hints
  choices: Choice[]        // used by: choice, tapCount, ballShoot, timeAttack
  correctId: string
  difficulty: 1 | 2 | 3
  interactionData?: InteractionData // mode-specific payload (see below)
}

interface Choice {
  id: string
  label: string            // display text, e.g. "7"
}

// InteractionData: payload theo từng mode
interface DragDropData {
  dragItems: { id: string; label: string; emoji?: string }[]
  dropZones: { id: string; label: string }[]
  correctMapping: Record<string, string> // dragItemId → dropZoneId
}

interface OrderingData {
  items: { id: string; emoji: string; size: number }[]
  direction: 'asc' | 'desc'  // nhỏ→to or to→nhỏ
}

interface MemoryFlipData {
  cardPairs: { id: string; label: string; pairId: string }[]
}

interface ClockDragData {
  targetTime: string  // e.g. "3:30", "9:00"
}

type InteractionData = DragDropData | OrderingData | MemoryFlipData | ClockDragData
```

---

## Checklist đầu mỗi session làm việc

Trước khi viết code mới, tự kiểm tra:

- [ ] Đã đọc CLAUDE.md và skill liên quan chưa?
- [ ] Component mới có đúng naming convention chưa?
- [ ] Touch target ≥ 64px, font size ≥ 24px chưa?
- [ ] Animation có dùng spring config từ `kid-animation-skill.md` chưa?
- [ ] SFX có gọi qua `soundManager` (không tạo Howl instance mới) chưa?
- [ ] Generator mới có validate đáp án và có test không?
- [ ] Lưu localStorage có dùng schema từ `local-profile-skill.md` không?
- [ ] Có dùng AI/LLM API không? (phải là KHÔNG)

---

## Roadmap nội dung

### MVP — 3-4 tuổi (Làm quen số đếm, hình, màu)

| Topic | Mô tả bài tập | InteractionMode | GameMode |
|-------|--------------|-----------------|----------|
| `counting` | Đếm chạm từng đồ vật (táo, ngôi sao…), sau đó chọn số đúng | `tapCount` | standard |
| `counting` | Nhận diện số 1-10, chọn số đúng | `choice` | standard |
| `quantityMatch` | Kéo số "3" vào nhóm có 3 con vật | `dragDrop` | standard |
| `shapes` | Chọn hình tròn/vuông/tam giác giữa nhiều hình | `choice` | standard |
| `comparison` | 2 nhóm đồ vật, chọn nhóm nào nhiều hơn | `choice` | standard |
| `sizeOrdering` | Kéo thả 3 con vật từ nhỏ đến to | `ordering` | standard |
| `memoryMatch` | Lật thẻ tìm cặp số giống nhau | `memoryFlip` | standard |

### MVP — 5-6 tuổi (Cộng trừ cơ bản, thứ tự số)

| Topic | Mô tả bài tập | InteractionMode | GameMode |
|-------|--------------|-----------------|----------|
| `addition` | "Có 3 con cá, thêm 2 con nữa, tất cả mấy con?" cộng ≤20 | `choice` | standard |
| `subtraction` | Phép trừ ≤20 có hình ảnh minh họa | `choice` | standard |
| `sequence` | Dãy số 1,2,_,4,5 — kéo số đúng vào ô trống | `dragDrop` | standard |
| `balanceScale` | Kéo quả cân vào 2 đĩa để 2 bên bằng nhau | `balanceScale` | standard |
| `addition` | Bắn/chạm bóng có số = đáp án đúng | `ballShoot` | standard |
| `comparison` | So sánh 2 số, chọn dấu >, <, = | `choice` | standard |
| `wordProblem` | Cộng trừ qua câu chuyện (mua kẹo, chia quả) | `choice` | numberRace |
| `addition` | Mỗi câu đúng mở 1 mảnh ghép hình | `choice` | puzzleReveal |

### Phase 2 — 7-8 tuổi (Cộng trừ có nhớ, nhân chia, đo lường)

| Topic | Mô tả bài tập | InteractionMode | GameMode |
|-------|--------------|-----------------|----------|
| `wordProblem` | Phép tính lồng tình huống thực tế (mua bánh, chia đồ) | `choice` | standard |
| `multiplication` | Bảng cửu chương — bắn/đập ô đúng kết quả | `ballShoot` | standard |
| `multiplication` | Vòng quay random ra phép nhân, trả lời đúng → sao | `choice` | spinWheel |
| `division` | Phép chia cơ bản ≤100 | `choice` | standard |
| `addition` | Cộng trừ ≤100 có nhớ | `choice` | standard |
| `measurement` | Kéo thước đo, ước lượng độ dài / cân nặng | `dragDrop` | standard |
| `money` | Cho bé "tiền" ảo, chọn mua đồ, tính tiền thừa | `choice` | standard |
| `clock` | Kéo kim đồng hồ đến đúng giờ được hỏi | `clockDrag` | standard |

### Phase 3 — 9-10 tuổi (Nhân chia phức tạp, phân số, hình học)

| Topic | Mô tả bài tập | InteractionMode | GameMode |
|-------|--------------|-----------------|----------|
| `fractions` | Chia hình tròn pizza thành phần bằng nhau, chọn đúng phân số | `choice` | standard |
| `fractionCompare` | Kéo 2 thanh phân số lên cân, chọn cái nào lớn hơn | `dragDrop` | standard |
| `multiplication` | Nhân chia phức tạp, đúng liên tiếp mở danh hiệu nhân vật | `choice` | combo |
| `geometry` | Ghép hình cơ bản thành hình lớn, học chu vi/diện tích | `ordering` | standard |
| `wordProblem` | Mỗi phép tính đúng mở 1 khóa số (mini escape room) | `choice` | escapeRoom |
| `fractions` | Thử thách tốc độ: trả lời nhiều câu đúng nhất trong 60s | `timeAttack` | standard |
| `multiplication` | Bảng xếp hạng tốc độ theo profile trong cùng thiết bị | `timeAttack` | standard |
