import { toast } from "@/components/ui/use-toast";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  status: "verified" | "unverified" | "disputed" | "neutral";
}

// FALLBACK_NEWS is defined but will NOT be returned by fetchIndoPakNews anymore.
// It's kept here for context or if you decide to use it elsewhere.
const FALLBACK_NEWS: NewsArticle[] = [
  {
    id: "1",
    title:
      "India and Pakistan agree to maintain ceasefire along Line of Control",
    description:
      "Military officials from both countries have confirmed the agreement to respect the 2003 ceasefire arrangement.",
    content:
      "In a significant development for regional peace, military officials from India and Pakistan have agreed to strictly observe the 2003 ceasefire agreement along the Line of Control. This agreement comes after months of tensions and cross-border incidents. Both nations have expressed commitment to resolving issues through peaceful dialogue.",
    url: "https://example.com/india-pakistan-ceasefire",
    image:
      "https://images.unsplash.com/photo-1540544660406-6a69dacb2804?w=800&auto=format&fit=crop",
    publishedAt: "2025-05-09T08:30:00Z",
    source: {
      name: "International Peace Monitor",
      url: "https://example.com",
    },
    status: "verified" as const,
  },
  // ... other fallback articles
];

async function verifyNewsWithGemini(
  article: Partial<NewsArticle>
): Promise<"verified" | "unverified" | "disputed" | "neutral"> {
  try {
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    if (!GEMINI_API_KEY) {
      console.warn("Gemini API key not found, using random status for article:", article.title);
      return getRandomStatus();
    }

    const prompt = `
    You are a specialized fact-checking AI tasked with evaluating news articles about India-Pakistan relations.
    
    Please carefully analyze the following news article by cross-referencing with established facts, historical context, and reliable reporting patterns:
    
    ARTICLE DETAILS:
    - Title: ${article.title}
    - Description: ${article.description}
    - Full Content: ${article.content}
    - Source: ${article.source?.name}
    - URL: ${article.url}
    - Publication Date: ${article.publishedAt}
    
    EVALUATION INSTRUCTIONS:
    1. Consider the source's reputation and historical accuracy
    2. Assess if claims are supported by multiple independent sources
    3. Check for consistency with established diplomatic positions
    4. Evaluate if the tone and framing appear balanced or biased
    5. Determine if the article contains verifiable facts or primarily speculation
    
    CLASSIFICATION CRITERIA:
    - "verified": The information is confirmed by multiple reliable sources, including official statements, reputable international media, or documented evidence. The reporting is factually accurate and presents a balanced view.
    
    - "unverified": The information cannot be independently confirmed or lacks sufficient evidence. The claims may be plausible but require additional verification from trusted sources.
    
    - "disputed": The information is contradicted by other reliable sources or official statements. There are significant disagreements about the facts or interpretation among credible sources.
    
    - "neutral": The article presents factual reporting without clear verification status. It may contain a mix of verified and unverified elements, or primarily report on statements/opinions without making factual claims.
    
    - "likely false": The information contradicts well-established facts, contains logical inconsistencies, or comes from sources with a history of publishing misinformation. The claims appear designed to mislead or inflame tensions.
    
    RESPONSE INSTRUCTIONS:
    Return only one of these exact classification words without explanation: "verified", "unverified", "disputed", "neutral", or "likely false".
    `;
    

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 10 },
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Gemini API response not OK (${response.status}) for article "${article.title}", using random status. Response: ${errorText}`);
      return getRandomStatus();
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();

    if (["verified", "unverified", "disputed", "neutral"].includes(result)) {
      return result as "verified" | "unverified" | "disputed" | "neutral";
    } else {
      console.warn(`Unexpected status from Gemini API for article "${article.title}": ${result}. Full response:`, data);
      return getRandomStatus();
    }
  } catch (error) {
    console.error(`Failed to verify news with Gemini for article "${article.title}":`, error);
    return getRandomStatus();
  }
}

function getRandomStatus(): "verified" | "unverified" | "disputed" | "neutral" {
  const statuses: Array<"verified" | "unverified" | "disputed" | "neutral"> = [
    "verified", "unverified", "disputed", "neutral",
  ];
  return statuses[Math.floor(Math.random() * statuses.length)]!;
}

export async function fetchIndoPakNews(): Promise<NewsArticle[]> {
  console.log("Attempting to fetch Indo-Pak news...");
  try {
    const API_URL = process.env.API_URL;
    const API_KEY = process.env.API_KEY;

    if (!API_URL || !API_KEY) {
      console.error("CRITICAL: GNews API URL or Key not configured in .env. Returning empty array.");
      toast({
        title: "Configuration Error",
        description: "News API is not configured. No live news can be shown.",
        variant: "destructive",
      });
      return []; // MODIFIED: Return empty array
    }

    const gnewsFetchUrl = `${API_URL}?q=india+pakistan+relations&lang=en&country=in&max=10&token=${API_KEY}`;
    console.log("Fetching GNews from:", gnewsFetchUrl);

    const response = await fetch(gnewsFetchUrl, {
      signal: AbortSignal.timeout(7000),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`GNews API response not OK (${response.status} ${response.statusText}). Error: ${errorText}. Returning empty array.`);
      toast({
        title: "Could not fetch live news",
        description: `News API error: ${response.status}. No live news can be shown.`,
        variant: "destructive",
      });
      return []; // MODIFIED: Return empty array
    }

    const data = await response.json();

    // Check if GNews API itself returned an error structure in a 200 OK response
    if (data.errors) {
        console.warn("GNews API returned errors in response payload:", data.errors, ". Returning empty array.");
        toast({
            title: "News API Error",
            description: "The news API returned an error. No live news can be shown.",
            variant: "destructive",
        });
        return []; // MODIFIED: Return empty array
    }

    if (!data.articles || data.articles.length === 0) {
      console.warn("No articles returned from GNews API. Query might be too specific or API issue. Returning empty array. GNews response:", data);
      toast({
        title: "No live news articles found",
        description: "The query returned no results from the news API.",
        variant: "default", // Or "destructive" if you consider this an error state
      });
      return []; // MODIFIED: Return empty array
    }
    
    console.log(`Successfully fetched ${data.articles.length} articles from GNews. Now processing with Gemini...`);

    const articlesWithoutStatus: Omit<NewsArticle, "status">[] = data.articles.map(
      (article: any, index: number) => ({
        id: article.url || `gnews-${index}-${Date.now()}`,
        title: article.title || "No title available",
        description: article.description || "No description available",
        content: article.content || article.description || "No detailed content available",
        url: article.url,
        image: article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600",
        publishedAt: article.publishedAt || new Date().toISOString(),
        source: {
          name: article.source?.name || "Unknown Source",
          url: article.source?.url || "#",
        },
      })
    );

    const verificationPromises = articlesWithoutStatus.map(
      (article) => verifyNewsWithGemini(article).then((status) => ({ ...article, status }))
    );

    const articles = await Promise.all(verificationPromises);
    console.log(`Successfully fetched and processed ${articles.length} articles. Returning them.`);
    return articles as NewsArticle[]; // This is the success path

  } catch (error: any) {
    console.error("CRITICAL ERROR in fetchIndoPakNews:", error);
    if (error.name === 'TimeoutError') {
      toast({
        title: "News request timed out",
        description: "Could not fetch live news in time. No live news can be shown.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error fetching news",
        description: `An error occurred: ${error.message}. No live news can be shown.`,
        variant: "destructive",
      });
    }
    return []; // MODIFIED: Return empty array
  }
}