# Skill: kid-animation-skill

## Khi nào trigger
- Viết animation mới với Framer Motion trong bất kỳ component nào của MathKids
- Review animation component xem có phù hợp UX trẻ em không
- Bé phản ánh animation "quá nhanh" hoặc "khó thấy"

## Nguyên tắc cốt lõi
Animation cho trẻ em phải: **chậm hơn**, **to hơn**, **rõ hơn** so với UI người lớn.
Trẻ nhỏ cần thời gian xử lý visual feedback. Spring physics tạo cảm giác "vui" và "sống động".

---

## Spring Config chuẩn (copy-paste ready)

```typescript
// Use these configs, do NOT invent new spring values without reason

// Bouncy — dùng cho: correct answer celebration, star earned, avatar
export const SPRING_BOUNCY = { type: 'spring', stiffness: 300, damping: 15, mass: 1 } as const

// Gentle — dùng cho: wrong answer feedback, card transitions, overlays
export const SPRING_GENTLE = { type: 'spring', stiffness: 200, damping: 20, mass: 1 } as const

// Slow — dùng cho: celebration screen entrance, level-up banner
export const SPRING_SLOW = { type: 'spring', stiffness: 100, damping: 18, mass: 1.5 } as const

// Snap — dùng cho: button press feedback (nhanh + crisp)
export const SPRING_SNAP = { type: 'spring', stiffness: 500, damping: 25, mass: 0.8 } as const
```

---

## Mapping: Tình huống → Animation

### 1. Chọn đáp án ĐÚNG
```tsx
// Scale up lớn + bounce + màu xanh lá
<motion.div
  animate={{ scale: [1, 1.3, 1.1], backgroundColor: '#4CAF50' }}
  transition={{ ...SPRING_BOUNCY, duration: 0.6 }}
/>

// Star pop-in sau đó
<motion.span
  initial={{ scale: 0, rotate: -30 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ ...SPRING_BOUNCY, delay: 0.3 }}
>⭐</motion.span>
```

### 2. Chọn đáp án SAI
```tsx
// Lắc nhẹ (shake) + màu cam nhạt — KHÔNG đỏ rực, không "đáng sợ"
<motion.div
  animate={{ x: [0, -10, 10, -8, 8, 0] }}
  transition={{ duration: 0.5, ease: 'easeInOut' }}
  style={{ backgroundColor: '#FFB74D' }}  // orange, not red
/>

// Text "Thử lại nhé! 💪" fade in
<motion.p
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ ...SPRING_GENTLE, delay: 0.2 }}
/>
```

### 3. Hiển thị đáp án đúng (sau sai lần 2)
```tsx
// Pulse nhẹ trên đáp án đúng — không nháy "xấu hổ", chỉ "gợi ý"
<motion.div
  animate={{ scale: [1, 1.08, 1], boxShadow: ['0 0 0 rgba(76,175,80,0)', '0 0 16px rgba(76,175,80,0.6)', '0 0 0 rgba(76,175,80,0)'] }}
  transition={{ duration: 0.8, repeat: 1 }}
/>
```

### 4. Chuyển câu hỏi mới
```tsx
// Câu cũ slide out trái, câu mới slide in phải
// Dùng AnimatePresence + key prop
<AnimatePresence mode="wait">
  <motion.div
    key={question.id}
    initial={{ x: 60, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -60, opacity: 0 }}
    transition={SPRING_GENTLE}
  />
</AnimatePresence>
```

### 5. Màn Celebration (hết session)
```tsx
// Stars rơi từ trên xuống (stagger)
const starCount = 8
{Array.from({ length: starCount }).map((_, i) => (
  <motion.span
    key={i}
    initial={{ y: -100, opacity: 0, rotate: randomInt(-30, 30) }}
    animate={{ y: '80vh', opacity: [0, 1, 1, 0] }}
    transition={{ duration: 2, delay: i * 0.15, ease: 'easeIn' }}
    style={{ position: 'absolute', left: `${randomInt(5, 95)}%`, fontSize: '2rem' }}
  >⭐</motion.span>
))}

// Score banner scale in
<motion.div
  initial={{ scale: 0.3, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ ...SPRING_SLOW, delay: 0.5 }}
/>
```

### 6. Button press feedback
```tsx
// Dùng whileTap — tất cả button trong app đều phải có
<motion.button
  whileTap={{ scale: 0.92 }}
  transition={SPRING_SNAP}
/>
```

### 7. Profile card / Avatar
```tsx
// Hover: nhẹ nhàng float up
<motion.div
  whileHover={{ y: -6, scale: 1.03 }}
  whileTap={{ scale: 0.96 }}
  transition={SPRING_GENTLE}
/>
```

---

## Quy tắc bắt buộc

1. **Mọi button/choice đều có `whileTap={{ scale: 0.92 }}`** — feedback ngay lập tức khi chạm
2. **Duration tối thiểu 400ms** cho feedback đúng/sai — trẻ cần thấy rõ
3. **Không dùng `ease: 'linear'`** cho feedback UX — chỉ dùng spring hoặc easeInOut
4. **`AnimatePresence` bắt buộc** khi unmount component có animation exit (chuyển câu, chuyển màn)
5. **Không chain quá 3 animation** trong 1 sequence — trẻ bị overwhelmed
6. **Màu feedback:** Đúng = xanh lá (#4CAF50), Sai = cam (#FFB74D), KHÔNG dùng đỏ rực (#F44336) cho sai

## Không được làm

- ❌ `transition={{ duration: 0.1 }}` cho feedback — quá nhanh
- ❌ `animate={{ opacity: 0 }}` làm disappear đột ngột không có exit animation
- ❌ Nhiều hơn 5 phần tử cùng animate một lúc (gây lag trên thiết bị cũ)
- ❌ Tự đặt spring stiffness/damping mới — dùng 4 config chuẩn ở trên
- ❌ `animate={{ scale: [1, 1.2, 1] }}` (3+ keyframe) với spring — Framer Motion chỉ hỗ trợ 2 keyframe cho spring/inertia
  → Dùng `type: 'tween'` khi cần nhiều hơn 2 keyframe: `transition={{ type: 'tween', duration: 0.4 }}`
  → Hoặc dùng `repeat` + `repeatType: 'mirror'` để tạo hiệu ứng bounce 2 keyframe

## Import pattern chuẩn

```typescript
// Đặt constants trong lib/animation/springs.ts rồi import
import { SPRING_BOUNCY, SPRING_GENTLE, SPRING_SLOW, SPRING_SNAP } from '@/lib/animation/springs'
import { motion, AnimatePresence } from 'framer-motion'
```
