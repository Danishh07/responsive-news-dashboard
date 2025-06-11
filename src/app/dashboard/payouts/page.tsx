// Admin-only payout management page for calculating and managing author payouts
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { RootState } from "@/redux/store";
import { fetchNewsStart, fetchNewsSuccess, fetchNewsFailure } from "@/redux/newsSlice";
import { calculatePayouts, loadRatesFromStorage } from "@/redux/payoutSlice";
import { fetchAllArticles } from "@/services/newsService";
import PayoutSettings from "@/components/payout/PayoutSettings";
import PayoutTable from "@/components/payout/PayoutTable";
import { FaDollarSign } from "react-icons/fa";

export default function PayoutsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  
  // Get news and payout state from Redux store
  const { articles, loading: newsLoading, error: newsError } = useSelector((state: RootState) => state.news);
  const { rates, authorPayouts, loading: payoutLoading, error: payoutError } = useSelector((state: RootState) => state.payout);

  // Admin access control - redirect non-admin users
  if (session?.user?.role !== 'admin') {
    redirect("/dashboard");
  }

  // Initialize data and calculate payouts on component mount
  useEffect(() => {
    // Load saved payout rates from localStorage
    dispatch(loadRatesFromStorage());
    
    // Fetch articles if not already loaded and no errors
    if (articles.length === 0 && !newsLoading && !newsError) {
      dispatch(fetchNewsStart());
      
      fetchAllArticles()
        .then((data) => {
          dispatch(fetchNewsSuccess(data));
          // Calculate payouts based on fetched articles and current rates
          dispatch(calculatePayouts(data));
        })
        .catch((error) => {
          dispatch(fetchNewsFailure(error.message));
        });
    }
    // Recalculate payouts if articles exist but payouts haven't been calculated
    else if (articles.length > 0 && authorPayouts.length === 0) {
      dispatch(calculatePayouts(articles));
    }
  }, [dispatch, articles, newsLoading, newsError, authorPayouts.length]);

  // Combined loading state from both news and payout operations
  const loading = newsLoading || payoutLoading;
  const error = newsError || payoutError;

  return (
    <div>
      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <FaDollarSign className="mr-2" />
          Payout Management
        </h1>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error message display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Main content - only show when not loading */}
      {!loading && (
        <>
          {/* Payout rate configuration component */}
          <PayoutSettings currentRates={rates} />
          
          {/* Author payouts table with export functionality */}
          <PayoutTable payouts={authorPayouts} />
        </>
      )}
    </div>
  );
}
