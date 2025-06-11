import { NextResponse } from 'next/server';
import axios from 'axios';
import { Article } from '@/types';

// Server-side API route for fetching news data
// This runs on the server and can set any headers needed

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || "";
const NEWS_API_URL = "https://newsapi.org/v2";

// Create server-side API instance
const serverApiInstance = axios.create({
  headers: {
    'User-Agent': 'ResponsiveDashboardApp/1.0' // This will work on server-side
  }
});

// Handler for GET requests
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';
  const type = searchParams.get('type') || 'headlines';
  
  console.log(`📡 API Route called: type=${type}, category=${category}`);
  
  try {
    let response;
    
    if (type === 'headlines') {
      // Fetch top headlines
      console.log("🔄 Fetching headlines...");
      response = await serverApiInstance.get(`${NEWS_API_URL}/top-headlines`, {
        params: {
          apiKey: NEWS_API_KEY,
          country: 'us',
          category: category,
          pageSize: 20
        }
      });
    } else {
      // Fetch everything/blog posts
      console.log("🔄 Fetching blog articles...");
      response = await serverApiInstance.get(`${NEWS_API_URL}/everything`, {
        params: {
          apiKey: NEWS_API_KEY,
          q: (type === 'blog') ? 'technology blog' : 'technology news',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 15
        }
      });
    }
      if (!response.data || !response.data.articles || !Array.isArray(response.data.articles)) {
      throw new Error("Invalid API response format");
    }
    
    console.log(`✅ API Response: ${response.data.articles.length} articles for type=${type}`);    // Transform data to match our Article type
    const articles: Article[] = response.data.articles.map((article: Record<string, unknown>, index: number) => {
      const source = article.source as { id?: string; name?: string } | null;
      return {
      id: `${type}-${index}-${Date.now()}`,
      title: article.title as string || "Untitled Article",
      description: article.description as string || "",
      content: article.content as string || "",
      author: article.author as string || "Unknown Author",
      publishedAt: article.publishedAt as string || new Date().toISOString(),
      url: article.url as string || "",
      urlToImage: article.urlToImage as string || "",
      source: {
        id: source?.id || null,
        name: source?.name || "News API"
      },
      type: type === 'headlines' ? 'news' : 'blog',
    }});
    
    return NextResponse.json({ status: 'ok', articles });  } catch (error: unknown) {
    console.error("API route error:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch news';
    const errorDetails = error && typeof error === 'object' && 'response' in error 
      ? (error as { response?: { data?: unknown } }).response?.data || {}
      : {};
    
    // Return error details for debugging
    return NextResponse.json(
      { 
        status: 'error', 
        message: errorMessage,
        details: errorDetails 
      }, 
      { status: 500 }
    );
  }
}
