/**
 * GitHub Gist Service
 *
 * This service handles reading and writing tributes to/from a GitHub Gist.
 *
 * SECURITY & CACHING:
 * - Both reads and writes use Netlify serverless functions
 * - Serverless functions use GitHub API (not raw URL) to avoid aggressive caching
 * - Write function uses GitHub token stored server-side only (never exposed to client)
 * - Read function is public but goes through serverless function for fresh data
 */

import type { Tribute, TributesData } from "../types/tribute";

// Helper to get the correct function URL based on environment
function getNetlifyFunctionURL(functionName: string): string {
  // In development on Vite port, point to Netlify dev server
  if (typeof window !== "undefined" && window.location.port === "5173") {
    return `http://localhost:8888/.netlify/functions/${functionName}`;
  }
  // In production or on Netlify dev port, use relative URL
  return `/.netlify/functions/${functionName}`;
}

/**
 * Fetches all tributes from the GitHub Gist
 *
 * Uses serverless function instead of raw URL to avoid GitHub's aggressive caching
 */
export async function fetchTributes(): Promise<Tribute[]> {
  try {
    const response = await fetch(getNetlifyFunctionURL("get-tributes"), {
      cache: "no-store", // Prevent browser caching
    });

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
    const response = await fetch(getNetlifyFunctionURL("add-tribute"), {
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
