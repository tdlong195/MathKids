'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

export default function EditProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { profiles, updateCurrentProfile } = useProfileStore()
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

  const handleSubmit = (data: { name: string; avatar: string; ageGroup: AgeGroup }) => {
    if (profile) {
      updateCurrentProfile({ ...profile, ...data })
      router.push('/')
    }
  }

  if (!profile) return null

  return (
    <PageWrapper>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={SPRING_GENTLE}
      >
        <TitleText>✏️ Sửa hồ sơ</TitleText>
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
          initialData={{ name: profile.name, avatar: profile.avatar, ageGroup: profile.ageGroup }}
        />
      </motion.div>
    </PageWrapper>
  )
}
