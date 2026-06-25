'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfileStore } from '@/store/profileStore'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { TwoPlayerSelector } from '@/components/profile/TwoPlayerSelector'
import { KidButton } from '@/components/ui/KidButton'
import { MuteButton } from '@/components/ui/MuteButton'
import { soundManager } from '@/lib/sound/soundManager'
import { SPRING_GENTLE, SPRING_BOUNCY } from '@/lib/animation/springs'

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.lg};
`

const Header = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
`

const TitleText = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`

const SubtitleText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`

const ProfilesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  max-width: 600px;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
`

const EmptyEmoji = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xxl};
`

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`

const ModalBox = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
`

const ModalText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

export default function HomePage() {
  const router = useRouter()
  const { profiles, loadFromStorage, setCurrentProfile, removeProfile } = useProfileStore()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [showTwoPlayerSelector, setShowTwoPlayerSelector] = useState(false)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  const handleSelectProfile = (id: string) => {
    setCurrentProfile(id)
    router.push('/topics')
  }

  const handleEditProfile = (id: string) => {
    router.push(`/profile/${id}/edit`)
  }

  const handleViewProgress = (id: string) => {
    router.push(`/profile/${id}/progress`)
  }

  const handleDeleteProfile = (id: string) => {
    setDeleteConfirmId(id)
  }

  const confirmDelete = () => {
    if (deleteConfirmId) {
      removeProfile(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  return (
    <PageWrapper>
      <Header>
        <MuteButton />
      </Header>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={SPRING_GENTLE}
        style={{ textAlign: 'center' }}
      >
        <TitleText>🔢 MathKids</TitleText>
        <SubtitleText>Học toán thật vui!</SubtitleText>
      </motion.div>

      {profiles.length === 0 ? (
        <EmptyState>
          <EmptyEmoji>👋</EmptyEmoji>
          <EmptyText>Chào mừng! Hãy tạo hồ sơ cho bé để bắt đầu nhé!</EmptyText>
        </EmptyState>
      ) : (
        <>
          <SubtitleText>Chọn bé nào muốn học?</SubtitleText>
          <ProfilesGrid>
            {profiles.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...SPRING_GENTLE, delay: i * 0.1 }}
              >
                <ProfileCard
                  profile={profile}
                  onClick={() => handleSelectProfile(profile.id)}
                  onViewProgress={handleViewProgress}
                  onEdit={handleEditProfile}
                  onDelete={handleDeleteProfile}
                />
              </motion.div>
            ))}
          </ProfilesGrid>
        </>
      )}

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <KidButton
          $variant="primary"
          $size="lg"
          onClick={() => {
            soundManager.play('click')
            setShowTwoPlayerSelector(true)
          }}
          disabled={profiles.length < 2}
          style={{ opacity: profiles.length < 2 ? 0.5 : 1 }}
        >
          👫 Chơi 2 người
        </KidButton>
        <KidButton
          $variant="primary"
          $size="lg"
          onClick={() => router.push('/profile/create')}
        >
          ➕ Thêm bé mới
        </KidButton>
      </div>

      <AnimatePresence>
        {deleteConfirmId && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirmId(null)}
          >
            <ModalBox
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={SPRING_BOUNCY}
              onClick={e => e.stopPropagation()}
            >
              <ModalText>Xóa hồ sơ "{profiles.find(p => p.id === deleteConfirmId)?.name}"?</ModalText>
              <ModalText style={{ fontSize: '0.875rem', color: '#999', fontWeight: 400 }}>
                Dữ liệu sẽ bị xóa vĩnh viễn.
              </ModalText>
              <ButtonRow>
                <KidButton
                  $variant="ghost"
                  style={{ flex: 1 }}
                  onClick={() => setDeleteConfirmId(null)}
                >
                  Hủy
                </KidButton>
                <KidButton
                  $variant="primary"
                  style={{ flex: 1, borderColor: '#F44336', background: '#FFEBEE', color: '#F44336' }}
                  onClick={confirmDelete}
                >
                  Xóa
                </KidButton>
              </ButtonRow>
            </ModalBox>
          </ModalOverlay>
        )}

        {showTwoPlayerSelector && (
          <TwoPlayerSelector
            profiles={profiles}
            onClose={() => setShowTwoPlayerSelector(false)}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
