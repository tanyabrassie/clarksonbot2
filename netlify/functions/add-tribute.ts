import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const GIST_ID = '4b22b5fe7fb33a8ba84d99ec105f1938';
const RAW_GIST_URL = `https://gist.githubusercontent.com/tanyabrassie/${GIST_ID}/raw/clarksonTributes.json`;
const GIST_API_URL = `https://api.github.com/gists/${GIST_ID}`;

interface Tribute {
  type: 'candle' | 'bow' | 'money';
  author: string;
}

interface TributesData {
  tributes: Tribute[];
}

interface RequestBody {
  type: string;
  author: string;
}

/**
 * Netlify serverless function to securely add tributes to GitHub Gist
 * 
 * This function runs on Netlify's servers, keeping the GitHub token secure.
 * The token is stored as an environment variable in Netlify's dashboard.
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  // Check for GitHub token
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN environment variable is not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Server configuration error. GitHub token not configured.' 
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  // Parse and validate request body
  let body: RequestBody;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  const { type, author } = body;

  // Validate input
  if (!type || !author) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields: type and author' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  if (!['candle', 'bow', 'money'].includes(type)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid tribute type. Must be: candle, bow, or money' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  if (typeof author !== 'string' || author.trim().length === 0 || author.length > 50) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Author name must be 1-50 characters' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  try {
    // Fetch current tributes from the public gist
    const fetchResponse = await fetch(RAW_GIST_URL);
    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch current tributes: ${fetchResponse.statusText}`);
    }

    const currentData: TributesData = await fetchResponse.json();
    const currentTributes = currentData.tributes || [];

    // Add the new tribute
    const newTribute: Tribute = {
      type: type as Tribute['type'],
      author: author.trim(),
    };
    const updatedTributes = [...currentTributes, newTribute];

    // Prepare the updated gist content
    const updatedContent: TributesData = {
      tributes: updatedTributes,
    };

    // Update the gist via GitHub API
    const updateResponse = await fetch(GIST_API_URL, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Netlify-Function',
      },
      body: JSON.stringify({
        files: {
          'clarksonTributes.json': {
            content: JSON.stringify(updatedContent, null, 2),
          },
        },
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('GitHub API error:', errorData);
      throw new Error(`Failed to update gist: ${updateResponse.statusText}`);
    }

    // Success!
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Tribute added successfully',
        tribute: newTribute,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

  } catch (error) {
    console.error('Error adding tribute:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to add tribute',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

