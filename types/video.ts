import { Creator } from '@/types/creator'

export interface Video {
  title: string
  thumbnail: string
  prompt: string
  video: string
  $id: string
  $tenant: string
  $createdAt: Date
  $updatedAt: Date
  $permissions: string[]
  creator: Creator
  $databaseId: string
  $collectionId: string
}
