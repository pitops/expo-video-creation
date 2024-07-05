import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from 'react-native-appwrite'
import { User } from '@/types/user'
import { Video } from '@/types/video'
import { ImagePickerAsset } from 'expo-image-picker/src/ImagePicker.types'

export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.jsm.aora',
  projectId: '667b1d7a00274ec143d4',
  databaseId: '667b1e270026331a954a',
  userCollectionId: '667b1e3c003004b5718c',
  videoCollectionId: '667b1e55002ecc2eb09f',
  storageId: '667b1f280036b5d27301',
}

// Init your React Native SDK
const client = new Client()

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)

export const createUser = async (email: string, password: string, username: string) => {
  try {
    // Create a new user
    const newAccount = await account.create(ID.unique(), email, password, username)
    console.log(newAccount)

    const avatarUrl = avatars.getInitials(newAccount.name)

    await signIn(email, password)

    console.log({
      database: appwriteConfig.databaseId,
      collection: appwriteConfig.userCollectionId,
      uniqueID: ID.unique(),
      data: {
        accountId: newAccount.$id,
        username: newAccount.name,
        email: newAccount.email,
        avatar: avatarUrl,
      },
    })

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        username: newAccount.name,
        email: newAccount.email,
        avatar: avatarUrl,
      }
    )

    return newUser as unknown as User
  } catch (error) {
    console.error(error)
  }
}

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password)

    return session
  } catch (error) {
    console.error(error)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  let user = null
  try {
    user = await account.get()
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }

  if (!user) return null

  try {
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', user.$id)]
    )

    console.log('currentUser', JSON.stringify(currentUser, null, 2))

    if (!currentUser) throw new Error('User not found')

    return currentUser.documents[0] as unknown as User
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt')]
    )

    return posts.documents as unknown as Video[]
  } catch (error) {
    throw error
  }
}

export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(7)]
    )

    return posts.documents as unknown as Video[]
  } catch (error) {
    throw error
  }
}

export async function searchPosts(query: string | undefined) {
  if (!query) return []

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search('title', query)]
    )

    return posts.documents as unknown as Video[]
  } catch (error) {
    throw error
  }
}

export async function getUserPosts(userId: string | undefined) {
  if (!userId) return []

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
    )

    return posts.documents as unknown as Video[]
  } catch (error) {
    throw error
  }
}

export async function logout() {
  try {
    await account.deleteSession('current')
  } catch (error) {
    throw error
  }
}

export const getFilePreview = async (fileId: string, type: 'image' | 'video') => {
  let fileUrl
  try {
    if (type === 'video') {
      fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId)
    } else if (type === 'image') {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      )
    } else {
      throw new Error('invalid file type')
    }

    if (!fileUrl) throw new Error('File not found')

    return fileUrl
  } catch (error) {
    throw error
  }
}

export const uploadFile = async (file: ImagePickerAsset, type: 'image' | 'video') => {
  if (!file) return

  const asset = { name: file.fileName, type: file.mimeType, size: file.fileSize, uri: file.uri }

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset as { name: string; type: string; size: number; uri: string }
    )
    const fileUrl = await getFilePreview(uploadedFile.$id, type)

    return fileUrl
  } catch (error) {
    throw error
  }
}

export const createVideo = async (form: {
  title: string
  video: null | ImagePickerAsset
  thumbnail: null | ImagePickerAsset
  prompt: string
  userId: string
}) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail!, 'image'),
      uploadFile(form.video!, 'video'),
    ])

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        prompt: form.prompt,
        video: videoUrl,
        thumbnail: thumbnailUrl,
        creator: form.userId,
      }
    )
  } catch (error) {
    throw error
  }
}
