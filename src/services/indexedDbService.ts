import { Article, AuthorPayout, PayoutRate } from "@/types";

// Database constants
const DB_NAME = 'news_dashboard_db';
const DB_VERSION = 1;
const STORES = {
  articles: 'articles',
  payouts: 'payouts',
  settings: 'settings'
};

// Initialize the IndexedDB
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject("Could not open IndexedDB");
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.articles)) {
        db.createObjectStore(STORES.articles, { keyPath: "id" });
      }
      
      if (!db.objectStoreNames.contains(STORES.payouts)) {
        db.createObjectStore(STORES.payouts, { keyPath: "author" });
      }
      
      if (!db.objectStoreNames.contains(STORES.settings)) {
        db.createObjectStore(STORES.settings, { keyPath: "id" });
      }
    };
  });
};

// Articles operations
export const saveArticles = async (articles: Article[]): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(STORES.articles, "readwrite");
  const store = transaction.objectStore(STORES.articles);
  
  // Clear existing articles
  store.clear();
  
  // Add new articles
  articles.forEach(article => {
    store.add(article);
  });
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = event => reject(event);
  });
};

export const getArticles = async (): Promise<Article[]> => {
  const db = await initDB();
  const transaction = db.transaction(STORES.articles, "readonly");
  const store = transaction.objectStore(STORES.articles);
  const request = store.getAll();
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = event => reject(event);
  });
};

// Payouts operations
export const savePayouts = async (payouts: AuthorPayout[]): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(STORES.payouts, "readwrite");
  const store = transaction.objectStore(STORES.payouts);
  
  // Clear existing payouts
  store.clear();
  
  // Add new payouts
  payouts.forEach(payout => {
    store.add(payout);
  });
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = event => reject(event);
  });
};

export const getPayouts = async (): Promise<AuthorPayout[]> => {
  const db = await initDB();
  const transaction = db.transaction(STORES.payouts, "readonly");
  const store = transaction.objectStore(STORES.payouts);
  const request = store.getAll();
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = event => reject(event);
  });
};

// Payout rates operations
export const savePayoutRates = async (rates: PayoutRate): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(STORES.settings, "readwrite");
  const store = transaction.objectStore(STORES.settings);
  
  // Update or add payout rates
  store.put({ id: 'payoutRates', ...rates });
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = event => reject(event);
  });
};

export const getPayoutRates = async (): Promise<PayoutRate | null> => {
  const db = await initDB();
  const transaction = db.transaction(STORES.settings, "readonly");
  const store = transaction.objectStore(STORES.settings);
  const request = store.get('payoutRates');
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = event => reject(event);
  });
};

// Network status utility with more robust checking
export const isOnline = (): boolean => {
  // Basic check for browser environment
  if (typeof navigator === 'undefined') {
    return false;
  }
  
  // First check the navigator.onLine property
  const isNavigatorOnline = navigator.onLine;
  
  // For server-side rendering, we'll assume online (since we can't check connectivity)
  if (typeof window === 'undefined') {
    return isNavigatorOnline;
  }

  try {
    // Additional check for development environments
    // In development, we might want to force offline behavior for testing
    const forceOffline = localStorage.getItem('force_offline') === 'true';
    
    // Development mode flag to help with debugging
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // In development, we can force mock data behavior
    if (isDevelopment && localStorage.getItem('force_mock_data') === 'true') {
      return false;
    }
    
    return isNavigatorOnline && !forceOffline;
  } catch (error) {
    // If we can't access localStorage, just use navigator.onLine
    console.warn('Error checking online status:', error);
    return isNavigatorOnline;
  }
};

// Clear database (for testing or resetting)
export const clearDatabase = async (): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction([STORES.articles, STORES.payouts, STORES.settings], "readwrite");
  
  transaction.objectStore(STORES.articles).clear();
  transaction.objectStore(STORES.payouts).clear();
  transaction.objectStore(STORES.settings).clear();
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = event => reject(event);
  });
};
