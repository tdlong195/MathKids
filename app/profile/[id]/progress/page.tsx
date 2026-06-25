'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useProfileStore } from '@/store/profileStore'
import { TOPIC_META } from '@/types/topic'
import { KidButton } from '@/components/ui/KidButton'
import { SPRING_GENTLE } from '@/lib/animation/springs'

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.lg};
`

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-align: center;
`

const AvatarText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xxl};
`

const NameText = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const StarsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 700;
`

const ContentArea = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const Section = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const TopicRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const TopicEmoji = styled.span`
  font-size: 1.6rem;
  min-width: 32px;
  text-align: center;
`

const TopicLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  min-width: 100px;
`

const BarContainer = styled.div`
  flex: 1;
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
  height: 32px;
`

const StarBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  border-radius: ${({ theme }) => theme.radius.sm};
  min-width: 4px;
`

const StatText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
  min-width: 45px;
  text-align: right;
`

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  font-style: italic;
`

const TopicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`

const UntriedBadge = styled.div`
  background: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

export default function ProgressPage() {
  const router = useRouter()
  const params = useParams()
  const { profiles } = useProfileStore()
  const [profile, setProfile] = useState<any>(null)

  const profileId = params?.id as string

  useEffect(() => {
    const found = profiles.find(p => p.id === profileId)
    if (!found) {
      router.replace('/')
    } else {
      setProfile(found)
    }
  }, [profileId, profiles, router])

  if (!profile) return null

  // Build stats from history
  const topicStats = new Map<string, { correct: number; wrong: number; lastPlayed: number }>()
  profile.history.forEach((h: any) => {
    topicStats.set(h.topic, {
      correct: h.correct,
      wrong: h.wrong,
      lastPlayed: h.lastPlayed,
    })
  })

  const maxCorrect = Math.max(...Array.from(topicStats.values()).map(s => s.correct), 1)

  // Tried topics sorted by correct count descending
  const triedTopics = Array.from(topicStats.entries()).sort(([, a], [, b]) => b.correct - a.correct)

  // Untried topics
  const untriedTopics = TOPIC_META.filter(
    t => t.ageGroups.includes(profile.ageGroup) && !topicStats.has(t.id)
  )

  // Most played
  const mostPlayedTopic = triedTopics[0]

  return (
    <PageWrapper>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={SPRING_GENTLE}
      >
        <HeaderSection>
          <AvatarText>{profile.avatar}</AvatarText>
          <NameText>{profile.name}</NameText>
          <StarsContainer>
            <span>⭐</span>
            <span>{profile.stars} sao</span>
          </StarsContainer>
        </HeaderSection>
      </motion.div>

      <ContentArea>
        {/* Topics learned */}
        {triedTopics.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...SPRING_GENTLE, delay: 0.1 }}
          >
            <Section>
              <SectionTitle>📚 Những gì đã học</SectionTitle>
              {triedTopics.map(([topicId, stats]) => {
                const meta = TOPIC_META.find(t => t.id === topicId)
                const barWidth = (stats.correct / maxCorrect) * 100
                const total = stats.correct + stats.wrong

                return (
                  <TopicRow key={topicId}>
                    <TopicEmoji>{meta?.emoji}</TopicEmoji>
                    <TopicLabel>{meta?.labelVi}</TopicLabel>
                    <BarContainer>
                      <StarBar
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={SPRING_GENTLE}
                      />
                    </BarContainer>
                    <StatText>
                      {stats.correct}/{total}
                    </StatText>
                  </TopicRow>
                )
              })}
            </Section>
          </motion.div>
        )}

        {/* Most played */}
        {mostPlayedTopic && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...SPRING_GENTLE, delay: 0.15 }}
          >
            <Section>
              <SectionTitle>🏆 Chủ đề yêu thích</SectionTitle>
              {(() => {
                const [topicId, stats] = mostPlayedTopic
                const meta = TOPIC_META.find(t => t.id === topicId)
                const total = stats.correct + stats.wrong
                const ratio = total > 0 ? Math.round((stats.correct / total) * 100) : 0
                return (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{meta?.emoji}</div>
                    <div
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        marginBottom: '4px',
                        color: '#333',
                      }}
                    >
                      {meta?.labelVi}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      {total} câu — {ratio}% đúng ✓
                    </div>
                  </div>
                )
              })()}
            </Section>
          </motion.div>
        )}

        {/* Untried topics */}
        {untriedTopics.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...SPRING_GENTLE, delay: 0.2 }}
          >
            <Section>
              <SectionTitle>🎯 Sắp học</SectionTitle>
              <TopicGrid>
                {untriedTopics.map(topic => (
                  <UntriedBadge key={topic.id}>
                    <span>{topic.emoji}</span>
                    <span>{topic.labelVi}</span>
                  </UntriedBadge>
                ))}
              </TopicGrid>
            </Section>
          </motion.div>
        )}

        {/* Empty state */}
        {triedTopics.length === 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...SPRING_GENTLE, delay: 0.1 }}
          >
            <Section style={{ textAlign: 'center' }}>
              <EmptyText>Chưa có dữ liệu. Cùng học thôi nào! 🚀</EmptyText>
            </Section>
          </motion.div>
        )}
      </ContentArea>

      <KidButton $variant="ghost" onClick={() => router.push('/')}>
        ← Quay lại
      </KidButton>
    </PageWrapper>
  )
}
