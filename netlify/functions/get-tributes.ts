import type { Handler } from "@netlify/functions";

const GIST_ID = "4b22b5fe7fb33a8ba84d99ec105f1938";
const GIST_API_URL = `https://api.github.com/gists/${GIST_ID}`;

interface Tribute {
  type: "candle" | "bow" | "money";
  author: string;
}

interface TributesData {
  tributes: Tribute[];
}

/**
 * Netlify serverless function to fetch tributes from GitHub Gist
 *
 * This function uses the GitHub API instead of the raw URL to avoid
 * GitHub's aggressive caching of raw gist URLs.
 */
export const handler: Handler = async (event) => {
  // CORS headers for development
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed. Use GET." }),
      headers: corsHeaders,
    };
  }

  try {
    // Fetch from GitHub API (much fresher than raw URL)
    const response = await fetch(GIST_API_URL, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Netlify-Function",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch gist: ${response.statusText}`);
    }

    const gistData = await response.json();
    const fileContent = gistData.files["clarksonTributes.json"]?.content;

    if (!fileContent) {
      throw new Error("clarksonTributes.json file not found in gist");
    }

    const data: TributesData = JSON.parse(fileContent);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching tributes:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Failed to fetch tributes",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

