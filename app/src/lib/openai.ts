import { supabase } from './supabase'

const STORAGE_KEY = 'superbrain-openai-key'

export function getOpenAIKey(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function setOpenAIKey(key: string) {
  if (key.trim()) {
    localStorage.setItem(STORAGE_KEY, key.trim())
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function hasOpenAIKey(): boolean {
  return !!getOpenAIKey()
}

interface ImageGenerationResult {
  imageUrl: string
  description: string
}

export async function generateMnemonicImage(
  subject: string,
  mnemonicText: string,
  language: string = 'da',
): Promise<ImageGenerationResult> {
  const apiKey = getOpenAIKey()
  if (!apiKey) throw new Error('OpenAI API key not configured')

  const { data, error } = await supabase.functions.invoke('generate-image', {
    body: {
      openai_key: apiKey,
      subject,
      mnemonic: mnemonicText,
      language,
    },
  })

  if (error) {
    throw new Error(error.message || 'Edge Function error')
  }

  if (data?.error) {
    throw new Error(data.error)
  }

  return {
    description: data.description ?? '',
    imageUrl: data.imageUrl ?? '',
  }
}
