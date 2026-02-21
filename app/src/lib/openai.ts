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
): Promise<ImageGenerationResult> {
  const apiKey = getOpenAIKey()
  if (!apiKey) throw new Error('OpenAI API key not configured')

  // First, generate a vivid visual description using GPT
  const descriptionPrompt = `You are a memory technique expert. Create a short, vivid, memorable visual scene (2-3 sentences) that helps remember "${subject}" using the mnemonic: "${mnemonicText}".
Make it bizarre, exaggerated and colorful - the weirder the better for memory. Write in the same language as the mnemonic text.`

  const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: descriptionPrompt }],
      max_tokens: 200,
    }),
  })

  if (!chatRes.ok) {
    const err = await chatRes.json().catch(() => ({}))
    throw new Error(err.error?.message || `OpenAI API error: ${chatRes.status}`)
  }

  const chatData = await chatRes.json()
  const description = chatData.choices[0]?.message?.content?.trim() ?? ''

  // Then generate an image based on the description
  const imagePrompt = `A vivid, colorful, cartoon-style mnemonic illustration: ${description}. Style: bright colors, exaggerated features, memorable and fun, no text or letters.`

  const imageRes = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    }),
  })

  if (!imageRes.ok) {
    const err = await imageRes.json().catch(() => ({}))
    throw new Error(err.error?.message || `DALL-E API error: ${imageRes.status}`)
  }

  const imageData = await imageRes.json()
  const imageUrl = imageData.data[0]?.url ?? ''

  return { imageUrl, description }
}
