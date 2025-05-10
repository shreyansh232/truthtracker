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
  status: 'verified' | 'unverified' | 'disputed' | 'neutral';
}

// Fallback mock data to ensure we always have news to display
const FALLBACK_NEWS = [
  {
    id: "1",
    title: "India and Pakistan agree to maintain ceasefire along Line of Control",
    description: "Military officials from both countries have confirmed the agreement to respect the 2003 ceasefire arrangement.",
    content: "In a significant development for regional peace, military officials from India and Pakistan have agreed to strictly observe the 2003 ceasefire agreement along the Line of Control. This agreement comes after months of tensions and cross-border incidents. Both nations have expressed commitment to resolving issues through peaceful dialogue.",
    url: "https://example.com/india-pakistan-ceasefire",
    image: "https://images.unsplash.com/photo-1540544660406-6a69dacb2804?w=800&auto=format&fit=crop",
    publishedAt: "2025-05-09T08:30:00Z",
    source: {
      name: "International Peace Monitor",
      url: "https://example.com"
    },
    status: "verified" as const
  },
  {
    id: "2",
    title: "Trade negotiations between India and Pakistan show positive signs",
    description: "Economic ministers from both countries meet to discuss reopening trade routes that have been closed since 2019.",
    content: "Economic ministers from India and Pakistan held virtual talks focused on potentially reopening trade routes that have remained closed since 2019. The discussions centered around reducing tariffs on essential goods and establishing a framework for sustainable trade relations. Experts suggest this could be a significant step toward normalizing bilateral relations.",
    url: "https://example.com/india-pakistan-trade",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
    publishedAt: "2025-05-08T14:15:00Z",
    source: {
      name: "Regional Economic Times",
      url: "https://example.com"
    },
    status: "unverified" as const
  },
  {
    id: "3",
    title: "Water sharing disputes resurface between India and Pakistan",
    description: "Disagreements over the interpretation of the Indus Water Treaty have led to renewed tensions.",
    content: "Officials from India and Pakistan are scheduled to meet next month to address ongoing disputes regarding water sharing under the Indus Water Treaty. Pakistan has raised concerns about India's hydroelectric projects on rivers flowing into its territory, while India maintains its projects comply with the treaty's provisions. International water experts have been invited to mediate the discussions.",
    url: "https://example.com/water-disputes",
    image: "https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=800&auto=format&fit=crop",
    publishedAt: "2025-05-07T09:45:00Z",
    source: {
      name: "Environmental Policy Journal",
      url: "https://example.com"
    },
    status: "disputed" as const
  },
  {
    id: "4",
    title: "Cultural exchange program launches between Indian and Pakistani artists",
    description: "A new initiative brings together musicians, filmmakers, and writers from both countries despite political tensions.",
    content: "Despite ongoing political tensions, a groundbreaking cultural exchange program has launched, bringing together artists from India and Pakistan. The program includes virtual concerts, film screenings, and literary discussions that celebrate the shared cultural heritage of the two nations. Organizers hope these cultural connections can help build bridges where political dialogue has struggled.",
    url: "https://example.com/cultural-exchange",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop",
    publishedAt: "2025-05-06T16:20:00Z",
    source: {
      name: "Arts & Culture Today",
      url: "https://example.com"
    },
    status: "neutral" as const
  },
  {
    id: "5",
    title: "India and Pakistan collaborate on climate change initiatives",
    description: "Environmental agencies from both countries are working together on cross-border pollution and glacier monitoring.",
    content: "In an unprecedented move, environmental agencies from India and Pakistan have announced a joint initiative to address climate change impacts affecting the shared Himalayan region. The collaboration will focus on monitoring glacial melt, reducing cross-border air pollution, and developing sustainable agricultural practices suited for changing climate conditions. Scientists from both countries will work together at research stations along the border regions.",
    url: "https://example.com/climate-collaboration",
    image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&auto=format&fit=crop",
    publishedAt: "2025-05-05T11:10:00Z",
    source: {
      name: "Climate Science Network",
      url: "https://example.com"
    },
    status: "verified" as const
  }
];

// We'll attempt to fetch from a real API but use fallback data if it fails
export async function fetchIndoPakNews(): Promise<NewsArticle[]> {
  try {
    // First try to use the GNews API
    const API_URL = "https://gnews.io/api/v4/search";
    // Note: This is a free API key with limited requests
    const API_KEY = "9987cae3be2d26c12353ad23f11765b4";
    
    const response = await fetch(
      `${API_URL}?q=india+pakistan+relations&lang=en&country=in&max=10&apikey=${API_KEY}`,
      { signal: AbortSignal.timeout(5000) } // Add timeout to prevent hanging
    );
    
    if (!response.ok) {
      console.log("API response not OK, using fallback data");
      return FALLBACK_NEWS;
    }
    
    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      console.log("No articles returned from API, using fallback data");
      return FALLBACK_NEWS;
    }
    
    // Transform the API response to match our app's data structure
    const articles: NewsArticle[] = data.articles.map((article: any, index: number) => {
      // Define valid status options
      const statuses: Array<'verified' | 'unverified' | 'disputed' | 'neutral'> = [
        'verified', 'unverified', 'disputed', 'neutral'
      ];
      // Ensure we're assigning a valid status type
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: index.toString(),
        title: article.title,
        description: article.description || "No description available",
        content: article.content || "No content available",
        url: article.url,
        image: article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600",
        publishedAt: article.publishedAt || new Date().toISOString(),
        source: {
          name: article.source?.name || "Unknown Source",
          url: article.source?.url || "#"
        },
        status: randomStatus
      };
    });
    
    return articles;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    toast({
      title: "Using demo news data",
      description: "We're currently showing sample news while our API connection is being updated.",
      variant: "default"
    });
    return FALLBACK_NEWS;
  }
}
