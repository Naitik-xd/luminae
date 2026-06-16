import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      customer_name, 
      customer_email, 
      customer_phone, 
      salon_name, 
      service_name, 
      booking_date, 
      booking_time, 
      special_notes 
    } = await req.json()

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set')
    }

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your Booking is Confirmed</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcfcfc; color: #1a1a1a;">
        <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; border: 1px solid #eaeaea;">
          <!-- Header -->
          <div style="background-color: #0A0A0A; padding: 40px 20px; text-align: center;">
            <h1 style="color: #C9A84C; margin: 0; font-size: 28px; letter-spacing: 4px; text-transform: uppercase; font-family: Georgia, serif;">Luminae</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px;">
            <h2 style="margin-top: 0; font-size: 24px; font-weight: 300; color: #1a1a1a;">Hello ${customer_name},</h2>
            <p style="font-size: 16px; line-height: 24px; color: #4a4a4a; margin-bottom: 30px;">
              Your curated experience has been confirmed. We look forward to welcoming you.
            </p>
            
            <!-- Booking Details Card -->
            <div style="background-color: #fafafa; border: 1px solid #f0f0f0; border-radius: 4px; padding: 30px; margin-bottom: 30px;">
              <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #C9A84C; margin-bottom: 20px;">Reservation Details</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px; width: 40%;">Salon</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-size: 15px; font-weight: 500;">${salon_name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Service</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-size: 15px; font-weight: 500;">${service_name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Date</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-size: 15px; font-weight: 500;">${booking_date}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Time</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-size: 15px; font-weight: 500;">${booking_time}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px;">Phone</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-size: 15px; font-weight: 500;">${customer_phone}</td>
                </tr>
                ${special_notes ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 14px; vertical-align: top;">Notes</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-size: 15px; font-weight: 500;">${special_notes}</td>
                </tr>
                ` : ''}
              </table>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eaeaea;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #C9A84C; font-style: italic; font-family: Georgia, serif;">Find Your Glow in Delhi</p>
            <p style="margin: 0; font-size: 12px; color: #999;">If you need to reschedule, please contact the salon directly.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: customer_email,
        subject: 'Your LUMINAE Booking is Confirmed ✨',
        html: htmlBody,
      }),
    })

    if (!resendRes.ok) {
      const errorText = await resendRes.text()
      throw new Error(`Resend API error: ${errorText}`)
    }

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    )
  }
})
