'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useOptimistic } from 'react'
import { useFormStatus } from 'react-dom'
import { updateProfile } from '@/app/actions/profile.actions'

// プロフィールの型定義
type ProfileData = {
  nickname: string
  icon: string
  instagram_url: string
}

// アイコンオプションの型定義
type IconOption = {
  id: string
  url: string
}

type ProfileFormProps = {
  userId: string
  initialData: ProfileData
  iconOptions: IconOption[]
  isOnboarding?: boolean // オンボーディングコンテキストを示すフラグを追加
}

export function ProfileForm({
  userId,
  initialData,
  iconOptions,
  isOnboarding = false, // デフォルトは通常のプロフィール編集
}: ProfileFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // フォームの状態管理
  const [formData, setFormData] = useState<ProfileData>(initialData)

  // 楽観的UI更新のための状態
  const [optimisticData, setOptimisticData] = useOptimistic(
    formData,
    (state, newData: Partial<ProfileData>) => ({ ...state, ...newData }),
  )

  // フォーム送信時の処理
  const handleFormAction = async (formData: FormData) => {
    // 楽観的UI更新
    const nickname = formData.get('nickname') as string
    const icon = formData.get('icon') as string
    const instagram_url = formData.get('instagram_url') as string

    setOptimisticData({ nickname, icon, instagram_url })

    // オンボーディングコンテキストのフラグを追加
    if (isOnboarding) {
      formData.append('isOnboarding', 'true')
    }

    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result.success) {
        router.push('/notes')
      }
    })
  }

  return (
    <form action={handleFormAction} className='space-y-6'>
      <input type='hidden' name='userId' value={userId} />
      {/* オンボーディングコンテキストの場合、隠しフィールドを追加 */}
      {isOnboarding && <input type='hidden' name='isOnboarding' value='true' />}

      {/* 既存のフォームフィールド */}
      <div className='space-y-2'>
        <Label htmlFor='nickname'>
          ニックネーム <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='nickname'
          name='nickname'
          value={optimisticData.nickname}
          onChange={e =>
            setFormData(prev => ({ ...prev, nickname: e.target.value }))
          }
          required
          placeholder='あなたの表示名を入力'
          className='w-full'
        />
      </div>

      <div className='space-y-2'>
        <Label>
          アイコン選択 <span className='text-red-500'>*</span>
        </Label>
        <div className='grid grid-cols-5 gap-4'>
          {iconOptions.map(icon => (
            <div key={icon.id} className='flex flex-col items-center'>
              <input
                type='radio'
                id={`icon-${icon.id}`}
                name='icon'
                value={icon.id}
                className='sr-only'
                checked={optimisticData.icon === icon.id}
                onChange={() =>
                  setFormData(prev => ({ ...prev, icon: icon.id }))
                }
              />
              <label
                htmlFor={`icon-${icon.id}`}
                className={`cursor-pointer p-2 rounded-full transition-all ${
                  optimisticData.icon === icon.id
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'hover:bg-muted'
                }`}
              >
                <img
                  src={icon.url}
                  alt={`Avatar ${icon.id}`}
                  className='w-16 h-16 rounded-full'
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='instagram_url'>Instagram URL (オプション)</Label>
        <Input
          id='instagram_url'
          name='instagram_url'
          type='url'
          value={optimisticData.instagram_url}
          onChange={e =>
            setFormData(prev => ({ ...prev, instagram_url: e.target.value }))
          }
          placeholder='https://www.instagram.com/your_username'
          className='w-full'
        />
      </div>

      <SubmitButton isOnboarding={isOnboarding} />
    </form>
  )
}

// 送信ボタンをコンポーネント化して、フォーム送信中の状態を処理
function SubmitButton({ isOnboarding }: { isOnboarding?: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type='submit' className='w-full' disabled={pending}>
      {pending
        ? 'プロフィール作成中...'
        : isOnboarding
          ? 'プロフィールを完成させる'
          : 'プロフィールを更新する'}
    </Button>
  )
}
