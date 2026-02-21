import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { openai_key, subject, mnemonic, language } = await req.json()

    if (!openai_key) {
      return new Response(JSON.stringify({ error: 'Missing OpenAI API key' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!subject || !mnemonic) {
      return new Response(JSON.stringify({ error: 'Missing subject or mnemonic' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const langName = language === 'da' ? 'Danish' : 'English'

    // Step 1: Generate a vivid visual description using GPT
    const descriptionPrompt = `You are a memory technique expert. Create a short, vivid, memorable visual scene (2-3 sentences) that helps remember "${subject}" using the mnemonic: "${mnemonic}".
Make it bizarre, exaggerated and colorful - the weirder the better for memory. You MUST write your response in ${langName}.`

    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openai_key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: descriptionPrompt }],
        max_tokens: 200,
      }),
    })

    if (!chatRes.ok) {
      const err = await chatRes.json().catch(() => ({}))
      return new Response(JSON.stringify({ error: err.error?.message || `OpenAI API error: ${chatRes.status}` }), {
        status: chatRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const chatData = await chatRes.json()
    const description = chatData.choices[0]?.message?.content?.trim() ?? ''

    // Step 2: Generate an image based on the description
    const imagePrompt = `A vivid, colorful, cartoon-style mnemonic illustration: ${description}. Style: bright colors, exaggerated features, memorable and fun, no text or letters.`

    const imageRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openai_key}`,
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
      return new Response(JSON.stringify({ error: err.error?.message || `DALL-E API error: ${imageRes.status}` }), {
        status: imageRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const imageData = await imageRes.json()
    const imageUrl = imageData.data[0]?.url ?? ''

    return new Response(JSON.stringify({ description, imageUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
