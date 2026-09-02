import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

async function sendDiscordWebhook(url: string, content: string) {
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  } catch (e) {
    console.error('Failed to send Discord webhook', e);
  }
}

function createGeminiResponse(text: string) {
  return new Response(JSON.stringify({
    candidates: [{
      content: {
        parts: [{ text }]
      }
    }]
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const dcKey = process.env.DC_KEY;
    const adminPassword = process.env.PASSWORD;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured server-side' }), { status: 500 });
    }

    const body = await req.json();
    const { fullPrompt, latestMessage = "" } = body;

    if (!fullPrompt) {
      return new Response(JSON.stringify({ error: 'Missing fullPrompt in request body' }), { status: 400 });
    }

    // IP Extraction
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';

    // Handle Admin Commands
    if (latestMessage.startsWith('/admin-ban ') || latestMessage.startsWith('/admin-unban ')) {
      const parts = latestMessage.split(' ');
      const command = parts[0];
      const targetIp = parts[1];
      const password = parts[2];

      if (password !== adminPassword) {
        return createGeminiResponse("Invalid admin password.");
      }
      
      if (!targetIp) {
        return createGeminiResponse("Missing target IP. Usage: /admin-ban IP PASSWORD");
      }

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Ensure record exists before updating
        const { data: existing } = await supabase.from('ip_tracking').select('ip').eq('ip', targetIp).single();
        if (!existing) {
          await supabase.from('ip_tracking').insert([{ ip: targetIp }]);
        }

        if (command === '/admin-ban') {
          await supabase.from('ip_tracking').update({ is_perma_banned: true }).eq('ip', targetIp);
          return createGeminiResponse(`Successfully permanently banned IP: ${targetIp}`);
        } else {
          await supabase.from('ip_tracking').update({ is_perma_banned: false, banned_until: null, gibberish_count: 0 }).eq('ip', targetIp);
          return createGeminiResponse(`Successfully unbanned IP: ${targetIp}`);
        }
      } else {
        return createGeminiResponse("Supabase not configured.");
      }
    }

    let tracking: any = {
      ip,
      window_start_at: new Date().toISOString(),
      request_count: 0,
      gibberish_count: 0,
      banned_until: null,
      is_perma_banned: false,
      last_dc_notif_at: null
    };

    let supabase;
    if (supabaseUrl && supabaseKey) {
      supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data, error } = await supabase.from('ip_tracking').select('*').eq('ip', ip).single();
      
      if (data) {
        tracking = data;
      } else if (error && error.code === 'PGRST116') { // not found
        await supabase.from('ip_tracking').insert([tracking]);
      } else if (error) {
        console.error('Supabase error:', error);
      }
    }

    // Check Bans
    if (tracking.is_perma_banned) {
      return createGeminiResponse("Your IP has been permanently banned.");
    }

    const now = new Date();
    if (tracking.banned_until && new Date(tracking.banned_until) > now) {
      return createGeminiResponse(`Your IP is temporarily banned until ${new Date(tracking.banned_until).toLocaleString()}.`);
    }

    const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

    // Discord Notification Cooldown for "First chat"
    if (dcKey) {
      if (!tracking.last_dc_notif_at || (now.getTime() - new Date(tracking.last_dc_notif_at).getTime() > THREE_HOURS_MS)) {
        await sendDiscordWebhook(dcKey, `🔔 New chat session started from IP: **${ip}**`);
        tracking.last_dc_notif_at = now.toISOString();
        if (supabase) {
          await supabase.from('ip_tracking').update({ last_dc_notif_at: tracking.last_dc_notif_at }).eq('ip', ip);
        }
      }
    }

    // Rate Limiting Check
    if (now.getTime() - new Date(tracking.window_start_at).getTime() > THREE_HOURS_MS) {
      tracking.window_start_at = now.toISOString();
      tracking.request_count = 0;
    }

    if (tracking.request_count >= 15) {
      if (dcKey) {
        await sendDiscordWebhook(dcKey, `⚠️ Rate limit exceeded for IP: **${ip}** (15 requests/3hrs)`);
      }
      return createGeminiResponse("Rate limit exceeded. Please try again later (max 15 requests per 3 hours).");
    }

    // Add Gibberish detection instruction
    const gibberishInstruction = "\n\nCRITICAL INSTRUCTION: If the user's latest message is complete gibberish, random keyboard mashing, or nonsense, your ENTIRE response MUST be exactly this keyword: [GIBBERISH_DETECTED]";
    const modifiedFullPrompt = fullPrompt + gibberishInstruction;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: modifiedFullPrompt }]
        }]
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API Error:', errText);
      return new Response(JSON.stringify({ error: `Gemini API Error: ${geminiResponse.status}` }), {
        status: geminiResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await geminiResponse.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse Gibberish Detection
    if (candidateText.includes("[GIBBERISH_DETECTED]")) {
      tracking.gibberish_count += 1;
      let replyText = `Warning ${tracking.gibberish_count}/3: Please do not type gibberish.`;
      
      if (tracking.gibberish_count >= 3) {
        const bannedUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
        tracking.banned_until = bannedUntil;
        if (dcKey) {
          await sendDiscordWebhook(dcKey, `🚫 IP **${ip}** has been automatically banned for 24 hours due to repeated gibberish.`);
        }
        replyText = "Warning 3/3: You have been banned for 24 hours due to repeated gibberish.";
      } else {
        if (dcKey) {
          await sendDiscordWebhook(dcKey, `🚩 Gibberish warning ${tracking.gibberish_count}/3 for IP: **${ip}**`);
        }
      }
      
      if (supabase) {
        await supabase.from('ip_tracking').update({
          gibberish_count: tracking.gibberish_count,
          banned_until: tracking.banned_until
        }).eq('ip', ip);
      }
      return createGeminiResponse(replyText);
    }

    // Normal response path
    tracking.request_count += 1;
    if (supabase) {
      await supabase.from('ip_tracking').update({
        request_count: tracking.request_count,
        window_start_at: tracking.window_start_at
      }).eq('ip', ip);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Serverless Function Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
