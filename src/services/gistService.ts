/**
 * GitHub Gist Service
 *
 * This service handles reading and writing tributes to/from a GitHub Gist.
 *
 * SECURITY:
 * - Reading is done directly from the public gist (no authentication needed)
 * - Writing is done through a Netlify serverless function that keeps the GitHub token secure
 * - The token is stored server-side only, never exposed to the client
 */

import type { Tribute, TributesData } from "../types/tribute";

const GIST_ID = "4b22b5fe7fb33a8ba84d99ec105f1938";
const RAW_GIST_URL = `https://gist.githubusercontent.com/tanyabrassie/${GIST_ID}/raw/clarksonTributes.json`;

// Helper to get the correct function URL based on environment
function getNetlifyFunctionURL(): string {
  // In development on Vite port, point to Netlify dev server
  if (typeof window !== "undefined" && window.location.port === "5173") {
    return "http://localhost:8888/.netlify/functions/add-tribute";
  }
  // In production or on Netlify dev port, use relative URL
  return "/.netlify/functions/add-tribute";
}

/**
 * Fetches all tributes from the GitHub Gist
 */
export async function fetchTributes(): Promise<Tribute[]> {
  try {
    // Add cache-busting parameter to avoid GitHub's aggressive caching
    const cacheBuster = `?cb=${Date.now()}`;
    const response = await fetch(RAW_GIST_URL + cacheBuster);

    if (!response.ok) {
      throw new Error(`Failed to fetch tributes: ${response.statusText}`);
    }

    const data: TributesData = await response.json();
    return data.tributes || [];
  } catch (error) {
    console.error("Error fetching tributes:", error);
    throw error;
  }
}

/**
 * Adds a new tribute to the GitHub Gist
 *
 * This function calls a Netlify serverless function that securely handles
 * the GitHub API authentication. The token never leaves the server.
 */
export async function addTribute(
  type: Tribute["type"],
  author: string
): Promise<void> {
  try {
    const response = await fetch(getNetlifyFunctionURL(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, author }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        errorData.error || `Failed to add tribute: ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Tribute added successfully!", result);
  } catch (error) {
    console.error("Error adding tribute:", error);
    throw error;
  }
}
