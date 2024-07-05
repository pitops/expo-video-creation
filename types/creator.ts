export interface Creator {
  username: string
  email: string
  avatar: string
  accountId: string
  $id: string
  $tenant: string
  $createdAt: Date
  $updatedAt: Date
  $permissions: string[]
  $databaseId: string
  $collectionId: string
}
