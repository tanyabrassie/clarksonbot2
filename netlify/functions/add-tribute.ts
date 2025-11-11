import type { Handler, HandlerEvent } from "@netlify/functions";

const GIST_ID = "4b22b5fe7fb33a8ba84d99ec105f1938";
const RAW_GIST_URL = `https://gist.githubusercontent.com/tanyabrassie/${GIST_ID}/raw/clarksonTributes.json`;
const GIST_API_URL = `https://api.github.com/gists/${GIST_ID}`;

interface Tribute {
  type: "candle" | "bow" | "money";
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
export const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers for development (allows requests from Vite dev server)
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
      headers: corsHeaders,
    };
  }

  // Check for GitHub token
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("GITHUB_TOKEN environment variable is not set");
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server configuration error. GitHub token not configured.",
      }),
      headers: corsHeaders,
    };
  }

  // Parse and validate request body
  let body: RequestBody;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON in request body" }),
      headers: corsHeaders,
    };
  }

  const { type, author } = body;

  // Validate input
  if (!type || !author) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing required fields: type and author",
      }),
      headers: corsHeaders,
    };
  }

  if (!["candle", "bow", "money"].includes(type)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid tribute type. Must be: candle, bow, or money",
      }),
      headers: corsHeaders,
    };
  }

  if (
    typeof author !== "string" ||
    author.trim().length === 0 ||
    author.length > 50
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Author name must be 1-50 characters" }),
      headers: corsHeaders,
    };
  }

  try {
    // Fetch current tributes from the GitHub API (not raw URL to avoid caching issues)
    const fetchResponse = await fetch(GIST_API_URL, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Netlify-Function",
      },
    });

    if (!fetchResponse.ok) {
      throw new Error(
        `Failed to fetch current tributes: ${fetchResponse.statusText}`
      );
    }

    const gistData = await fetchResponse.json();
    const fileContent = gistData.files["clarksonTributes.json"]?.content;

    if (!fileContent) {
      throw new Error("clarksonTributes.json file not found in gist");
    }

    const currentData: TributesData = JSON.parse(fileContent);
    const currentTributes = currentData.tributes || [];

    // Add the new tribute
    const newTribute: Tribute = {
      type: type as Tribute["type"],
      author: author.trim(),
    };
    const updatedTributes = [...currentTributes, newTribute];

    // Prepare the updated gist content
    const updatedContent: TributesData = {
      tributes: updatedTributes,
    };

    // Update the gist via GitHub API
    const updateResponse = await fetch(GIST_API_URL, {
      method: "PATCH",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Netlify-Function",
      },
      body: JSON.stringify({
        files: {
          "clarksonTributes.json": {
            content: JSON.stringify(updatedContent, null, 2),
          },
        },
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error("GitHub API error:", errorData);
      throw new Error(`Failed to update gist: ${updateResponse.statusText}`);
    }

    // Success!
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Tribute added successfully",
        tribute: newTribute,
      }),
      headers: corsHeaders,
    };
  } catch (error) {
    console.error("Error adding tribute:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to add tribute",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      headers: corsHeaders,
    };
  }
};
