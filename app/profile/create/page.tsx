'use client'

import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useProfileStore } from '@/store/profileStore'
import { CreateProfileForm } from '@/components/profile/CreateProfileForm'
import { SPRING_GENTLE } from '@/lib/animation/springs'
import type { AgeGroup } from '@/types/topic'

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.lg};
`

const TitleText = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`

export default function CreateProfilePage() {
  const router = useRouter()
  const { addProfile, setCurrentProfile } = useProfileStore()

  const handleSubmit = (data: { name: string; avatar: string; ageGroup: AgeGroup }) => {
    const newProfile = addProfile(data)
    setCurrentProfile(newProfile.id)
    router.push('/topics')
  }

  return (
    <PageWrapper>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={SPRING_GENTLE}
      >
        <TitleText>👶 Tạo hồ sơ bé</TitleText>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...SPRING_GENTLE, delay: 0.1 }}
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <CreateProfileForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/')}
        />
      </motion.div>
    </PageWrapper>
  )
}
