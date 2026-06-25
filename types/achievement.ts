export interface Achievement {
  id: string
  label: string
  emoji: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  first_session: {
    id: 'first_session',
    label: 'Bước đầu',
    emoji: '🚀',
    description: 'Hoàn thành session đầu tiên',
    rarity: 'common',
  },
  streak_7: {
    id: 'streak_7',
    label: 'Lửa 🔥',
    emoji: '🔥',
    description: 'Duy trì streak 7 ngày liên tiếp',
    rarity: 'rare',
  },
  streak_30: {
    id: 'streak_30',
    label: 'Đốt cháy',
    emoji: '🌟',
    description: 'Duy trì streak 30 ngày liên tiếp',
    rarity: 'epic',
  },
  perfect_session: {
    id: 'perfect_session',
    label: 'Hoàn hảo',
    emoji: '💯',
    description: 'Trả lời đúng tất cả câu trong 1 session',
    rarity: 'rare',
  },
  hundred_stars: {
    id: 'hundred_stars',
    label: 'Sao vàng',
    emoji: '⭐',
    description: 'Tích lũy 100 sao',
    rarity: 'epic',
  },
  master_topic: {
    id: 'master_topic',
    label: 'Bậc thầy',
    emoji: '🎓',
    description: 'Hoàn thành 1 chủ đề 10 lần',
    rarity: 'epic',
  },
  ten_sessions: {
    id: 'ten_sessions',
    label: 'Học viên chăm chỉ',
    emoji: '📚',
    description: 'Hoàn thành 10 session',
    rarity: 'common',
  },
  fifty_sessions: {
    id: 'fifty_sessions',
    label: 'Phù thủy toán',
    emoji: '🧙',
    description: 'Hoàn thành 50 session',
    rarity: 'legendary',
  },
  accuracy_80: {
    id: 'accuracy_80',
    label: 'Nhanh trí',
    emoji: '⚡',
    description: 'Đạt 80%+ đúng trong session',
    rarity: 'rare',
  },
  all_topics: {
    id: 'all_topics',
    label: 'Kiến thức toàn diện',
    emoji: '🌍',
    description: 'Chơi tất cả chủ đề cho age group của bé',
    rarity: 'epic',
  },
}
