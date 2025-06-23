const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  console.log('Webhook aufgerufen:', event.httpMethod);
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Nur POST-Requests erlaubt' })
    };
  }

  try {
    const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
    
    if (!DISCORD_WEBHOOK) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Webhook nicht konfiguriert' })
      };
    }

    const response = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      body: event.body,
      headers: {
        'Content-Type': event.headers['content-type'] || 'application/json'
      }
    });

    if (response.ok) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    } else {
      throw new Error(`Discord API Fehler: ${response.status}`);
    }
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server-Fehler' })
    };
  }
};
