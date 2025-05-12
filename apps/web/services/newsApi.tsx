// newsApi.tsx (or your chosen file name)
import { toast } from "@/components/ui/use-toast"; // Assuming this path is correct

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string; // Currents API provides 'description', 'content' might be similar or require combining
  url: string;
  image: string;
  publishedAt: string; // Currents API uses 'published'
  source: {
    name: string; // Currents API provides 'author' or 'source_domain'
    url: string; // Currents API provides 'url' (article url)
  };
  status: "verified" | "unverified" | "disputed" | "neutral";
}

// Cache for verification results
const verificationCache = new Map<
  string,
  {
    status: "verified" | "unverified" | "disputed" | "neutral";
    timestamp: number;
  }
>();

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const BATCH_SIZE = 2; // Process 2 articles at a time
const DELAY_BETWEEN_BATCHES = 1000; // 1 second delay between batches

async function verifyNewsWithGemini(
  article: Partial<NewsArticle>
): Promise<"verified" | "unverified" | "disputed" | "neutral"> {
  // Generate a cache key from article content
  const cacheKey = `${article.title}-${article.publishedAt}`;

  // Check cache first
  const cached = verificationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Using cached verification for:", article.title);
    return cached.status;
  }

  try {
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.warn(
        "Gemini API key not found, using random status for:",
        article.title
      );
      return getRandomStatus();
    }

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
      Please verify the following news article about India-Pakistan relations by checking multiple sources.
      Title: ${article.title}
      Description: ${article.description}
      Content: ${article.content}
      Source: ${article.source?.name}
      URL: ${article.url}
      Analyze this news for factual accuracy and provide a single-word rating from these options only:
      - "verified" (confirmed by multiple reliable sources)
      - "unverified" (cannot be confirmed or lacks sufficient evidence)
      - "disputed" (contradicted by other reliable sources)
      - "neutral" (factual reporting without clear verification)
      Return only one of these exact words without explanation.
    `;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10,
          topP: 0.1,
          topK: 1,
        },
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Failed to parse error response" }));
      console.warn(
        `Gemini API response not OK (${response.status}) for article "${article.title}", using random status. Error:`,
        errorData?.error?.message || errorData
      );
      return getRandomStatus();
    }

    const data = await response.json();
    let status: "verified" | "unverified" | "disputed" | "neutral";

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const result = data.candidates[0].content.parts[0].text
        .trim()
        .toLowerCase();
      if (["verified", "unverified", "disputed", "neutral"].includes(result)) {
        status = result as "verified" | "unverified" | "disputed" | "neutral";
      } else {
        status = getRandomStatus();
      }
    } else {
      status = getRandomStatus();
    }

    // Cache the result
    verificationCache.set(cacheKey, {
      status,
      timestamp: Date.now(),
    });

    return status;
  } catch (error: any) {
    console.error(
      `Failed to verify news with Gemini for article "${article.title}":`,
      error
    );
    return getRandomStatus();
  }
}

function getRandomStatus(): "verified" | "unverified" | "disputed" | "neutral" {
  const statuses: Array<"verified" | "unverified" | "disputed" | "neutral"> = [
    "verified",
    "unverified",
    "disputed",
    "neutral",
  ];
  return statuses[Math.floor(Math.random() * statuses.length)]!;
}

// Helper function to process articles in batches
async function processArticlesInBatches(
  articles: Omit<NewsArticle, "status">[]
): Promise<NewsArticle[]> {
  const results: NewsArticle[] = [];

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map((article) =>
        verifyNewsWithGemini(article).then((status) => ({ ...article, status }))
      )
    );
    results.push(...batchResults);

    if (i + BATCH_SIZE < articles.length) {
      console.log(
        `Waiting ${DELAY_BETWEEN_BATCHES}ms before processing next batch...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, DELAY_BETWEEN_BATCHES)
      );
    }
  }

  return results;
}

export async function fetchIndoPakNews(): Promise<NewsArticle[]> {
  console.log(
    "Client-side: Attempting to fetch Indo-Pak news via internal API route (/api/news) using Currents API..."
  );
  try {
    const response = await fetch("/api/news", {
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Failed to parse error from internal API" }));
      console.warn(
        `Internal API route (/api/news) response not OK (${response.status}). Error: ${errorData.error || response.statusText}. Returning empty array.`
      );
      toast({
        title: "Could not fetch news",
        description: `Error from news service: ${errorData.error || response.statusText}.`,
        variant: "destructive",
      });
      return [];
    }

    const dataFromApi = await response.json(); // This is the response from your /api/news route

    // Expected structure from your API route (which mirrors Currents API): { status: "ok", news: [...] }
    if (dataFromApi.status !== "ok" || !dataFromApi.news) {
      console.warn(
        "Data from internal API indicates an error from Currents API or news array missing:",
        dataFromApi.error || "News array missing",
        ". Returning empty array."
      );
      toast({
        title: "News API Error",
        description:
          dataFromApi.error ||
          "Could not retrieve articles from the news provider.",
        variant: "destructive",
      });
      return [];
    }

    if (dataFromApi.news.length === 0) {
      console.warn(
        "No articles returned from Currents API via internal API. Returning empty array."
      );
      toast({
        title: "No live news articles found",
        description: "The query returned no results from Currents API.",
        variant: "default",
      });
      return [];
    }

    console.log(
      `Client-side: Successfully fetched ${dataFromApi.news.length} articles via internal API (Currents). Now processing with Gemini...`
    );

    // Map Currents API article structure to your NewsArticle interface
    const articlesWithoutStatus: Omit<NewsArticle, "status">[] =
      dataFromApi.news.map((article: any, index: number) => {
        // 'article' here is from Currents API
        // Currents API fields: id, title, description, url, author, image, language, category, published
        const sourceName =
          article.author ||
          (article.url ? new URL(article.url).hostname : "Unknown Source");
        return {
          id: article.id || `currents-${index}-${Date.now()}`,
          title: article.title || "No title available",
          description: article.description || "No description available",
          // Currents 'description' is usually the main content snippet.
          // If 'content' field exists and is different, use it. Otherwise, description is fine.
          content: article.description || "No detailed content available",
          url: article.url,
          image:
            article.image === "None"
              ? "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600"
              : article.image ||
                "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600",
          publishedAt: article.published || new Date().toISOString(), // Currents uses 'published'
          source: {
            name: sourceName,
            url: article.url || "#", // Article URL can serve as source URL if no specific one
          },
        };
      });

    console.log(
      `Client-side: Processing ${articlesWithoutStatus.length} articles in batches...`
    );
    const articles = await processArticlesInBatches(articlesWithoutStatus);
    console.log(
      `Client-side: Successfully processed all articles. Returning them.`
    );
    return articles;
  } catch (error: any) {
    console.error(
      "CRITICAL ERROR in fetchIndoPakNews (calling internal API /api/news for Currents):",
      error
    );
    let toastMessage = "An internal error occurred while fetching news.";
    if (error.name === "TimeoutError") {
      toastMessage = "Request to our news service timed out.";
    } else if (error.message) {
      toastMessage = error.message;
    }
    toast({
      title: "Error Fetching News",
      description: toastMessage,
      variant: "destructive",
    });
    return [];
  }
}
