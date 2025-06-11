import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { PayoutRate, PayoutState, AuthorPayout, Article } from '@/types';
import { savePayoutRates, getPayoutRates, savePayouts, getPayouts } from '@/services/indexedDbService';

const initialState: PayoutState = {
  rates: {
    newsRate: 50,
    blogRate: 100,
  },
  authorPayouts: [],
  loading: false,
  error: null,
};

// Async thunks for handling IndexedDB operations
export const loadRatesFromStorage = createAsyncThunk(
  'payout/loadRatesFromStorage',
  async () => {
    try {
      const rates = await getPayoutRates();
      return rates;
    } catch (error) {
      console.error('Failed to load payout rates from IndexedDB:', error);
      throw error;
    }
  }
);

export const loadPayoutsFromStorage = createAsyncThunk(
  'payout/loadPayoutsFromStorage',
  async () => {
    try {
      const payouts = await getPayouts();
      return payouts || [];
    } catch (error) {
      console.error('Failed to load payouts from IndexedDB:', error);
      throw error;
    }
  }
);

export const saveRatesToStorage = createAsyncThunk(
  'payout/saveRatesToStorage',
  async (rates: PayoutRate) => {
    try {
      await savePayoutRates(rates);
      return rates;
    } catch (error) {
      console.error('Failed to save payout rates to IndexedDB:', error);
      throw error;
    }
  }
);

export const savePayoutsToStorage = createAsyncThunk(
  'payout/savePayoutsToStorage',
  async (payouts: AuthorPayout[]) => {
    try {
      await savePayouts(payouts);
      return payouts;
    } catch (error) {
      console.error('Failed to save payouts to IndexedDB:', error);
      throw error;
    }
  }
);

export const payoutSlice = createSlice({
  name: 'payout',
  initialState,
  reducers: {
    updateRates: (state, action: PayloadAction<PayoutRate>) => {
      state.rates = action.payload;
      // Recalculate existing payouts with new rates
      state.authorPayouts = recalculatePayouts(state.authorPayouts, action.payload);
    },
    calculatePayouts: (state, action: PayloadAction<Article[]>) => {
      const articles = action.payload;
      const authors = new Map<string, AuthorPayout>();
      
      articles.forEach(article => {
        const { author, id, title, type, publishedAt } = article;
        const rate = type === 'news' ? state.rates.newsRate : state.rates.blogRate;
        
        if (!authors.has(author)) {
          authors.set(author, {
            author,
            articleCount: 0,
            totalPayout: 0,
            articles: [],
          });
        }
        
        const authorData = authors.get(author)!;
        authorData.articleCount += 1;
        authorData.totalPayout += rate;
        authorData.articles.push({
          id,
          title,
          type,
          publishedAt,
          rate,
        });
      });
      
      state.authorPayouts = Array.from(authors.values());
    },
    clearPayouts: (state) => {
      state.authorPayouts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Load rates from storage
      .addCase(loadRatesFromStorage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRatesFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.rates = action.payload;
        }
      })
      .addCase(loadRatesFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load rates';
      })
      // Load payouts from storage
      .addCase(loadPayoutsFromStorage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPayoutsFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.authorPayouts = action.payload;
        }
      })
      .addCase(loadPayoutsFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load payouts';
      })
      // Save rates to storage
      .addCase(saveRatesToStorage.fulfilled, (state, action) => {
        state.rates = action.payload;
        // Recalculate existing payouts with new rates
        state.authorPayouts = recalculatePayouts(state.authorPayouts, action.payload);
      })
      // Save payouts to storage
      .addCase(savePayoutsToStorage.fulfilled, (state, action) => {
        state.authorPayouts = action.payload;
      });
  },
});

// Helper function to recalculate payouts with new rates
const recalculatePayouts = (payouts: AuthorPayout[], rates: PayoutRate): AuthorPayout[] => {
  return payouts.map(payout => {
    let totalPayout = 0;
    const updatedArticles = payout.articles.map(article => {
      const rate = article.type === 'news' ? rates.newsRate : rates.blogRate;
      totalPayout += rate;
      return {
        ...article,
        rate
      };
    });
    
    return {
      ...payout,
      totalPayout,
      articles: updatedArticles
    };
  });
};

export const {
  updateRates,
  calculatePayouts,
  clearPayouts
} = payoutSlice.actions;

export default payoutSlice.reducer;
