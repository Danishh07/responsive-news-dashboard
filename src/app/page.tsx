"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChartLine, FaUser } from "react-icons/fa";
// import { FaNewspaper, FaChartBar, FaMoneyBillWave } from "react-icons/fa"; // Not used in current implementation

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-white/10 backdrop-blur-md py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">News Dashboard</h1>
        <div className="space-x-4">
          <Link 
            href="/login" 
            className="px-4 py-2 text-sm font-medium text-white bg-white/20 rounded-md hover:bg-white/30 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium text-indigo-800 bg-white rounded-md hover:bg-gray-100 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 w-full max-w-6xl px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Your News & Analytics Dashboard
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Access news and blogs from multiple sources, analyze content, and manage payout reports all in one place.
            </p>
            <div className="space-x-4">
              <Link
                href="/login"
                className="px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 text-base font-medium text-white bg-white/20 rounded-md hover:bg-white/30 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            {/* Dashboard preview */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4 flex items-center">
                  <FaChartLine className="text-3xl text-white mr-3" />
                  <div>
                    <h3 className="font-medium text-white">Analytics</h3>
                    <p className="text-sm text-white/70">Track content metrics</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 flex items-center">
                  <FaUser className="text-3xl text-white mr-3" />
                  <div>
                    <h3 className="font-medium text-white">User Profiles</h3>
                    <p className="text-sm text-white/70">Admin & regular users</p>
                  </div>
                </div>
                <div className="col-span-2 bg-white/10 rounded-lg p-4 h-40 flex items-center justify-center">
                  <p className="text-white/80 text-center">Interactive Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="w-full bg-white/5 backdrop-blur-md py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">News Integration</h3>
              <p className="text-white/80">
                Access articles from multiple sources with powerful filtering and search capabilities.
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Analytics Dashboard</h3>
              <p className="text-white/80">
                Visualize data with interactive charts and real-time updates.
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Payout Management</h3>
              <p className="text-white/80">
                Calculate payments, export reports, and manage rates for content creators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-black/30 py-6 px-6 text-center">
        <p className="text-white/70">
          &copy; 2025 News Dashboard. All rights reserved.
        </p>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 mt-2"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
