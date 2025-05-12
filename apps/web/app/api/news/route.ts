// src/app/api/news/route.ts
import { NextResponse } from "next/server";
import type { CurrentsAPIResponse } from "currentsapi";

export const dynamic = "force-dynamic";

type APIErrorResponse = {
  error: string;
  details?: any;
};

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  backoff = 1000
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (response.ok) return response;
    throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    if (retries <= 0) throw error;
    console.log(`Retrying fetch... Attempts remaining: ${retries}`);
    await new Promise((resolve) => setTimeout(resolve, backoff));
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
}

export async function GET(
  request: Request
): Promise<NextResponse<CurrentsAPIResponse | APIErrorResponse>> {
  const CURRENTS_KEY = process.env.CURRENTS_API_KEY;

  if (!CURRENTS_KEY) {
    console.error(
      "CRITICAL: Currents API Key (CURRENTS_API_KEY) not configured..."
    );
    return NextResponse.json<APIErrorResponse>(
      { error: "News API (Currents API) is not configured on the server." },
      { status: 500 }
    );
  }

  console.log("Server-side API route fetching from Currents API...");

  const params = new URLSearchParams({
    keywords: "India Pakistan",
    language: "en",
    limit: "5",
  });

  const url = `https://api.currentsapi.services/v1/search?${params}`;
  console.log("Fetching from URL:", url);

  try {
    const response = await fetchWithRetry(
      url,
      {
        headers: {
          Authorization: CURRENTS_KEY,
          "cache-control": "no-cache",
        },
        next: { revalidate: 300 },
      },
      3, // 3 retries
      1000 // 1 second initial backoff
    );

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Successfully parsed response JSON");

    if (data.status === "ok" && data.news) {
      console.log(
        `Successfully fetched ${data.news.length} articles from Currents API.`
      );
      return NextResponse.json(data, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      });
    } else {
      console.warn(
        "Currents API did not return status 'ok' or news array is missing:",
        data
      );
      return NextResponse.json<APIErrorResponse>(
        {
          error:
            "Failed to retrieve news from Currents API or no articles found.",
          details: data,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error(
      "CRITICAL ERROR in server-side news API route (/api/news) with Currents API:",
      error.name,
      error.message,
      error.stack
    );
    return NextResponse.json<APIErrorResponse>(
      {
        error: error.message || "Server error fetching news from Currents API.",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
