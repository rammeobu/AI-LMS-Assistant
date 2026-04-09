"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react";
import RadarChart from "@/components/RadarChart";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10" />
        
        <div className="flex-1 text-center lg:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4" /> AI가 분석하는 맞춤형 커리어 로드맵
            </span>
            <h1 className="text-5xl lg:text-7xl font-outfit font-extrabold tracking-tighter text-gray-900 leading-[1.1] mb-6">
              당신의 <span className="text-gradient">부족한 15%</span>를 <br />
              데이터로 채워드립니다.
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
              깃허브와 이력서를 토대로 나의 현재 역량을 진단하고, 목표 직무에 꼭 필요한 최적의 대외활동과 자격증을 추천받으세요.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-medium rounded-2xl hover:bg-primary/90 transition-all shadow-[0_8px_20px_rgba(85,82,250,0.3)] hover:shadow-[0_8px_25px_rgba(85,82,250,0.4)] flex items-center justify-center gap-2">
                시작하기 <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2"><Target className="w-5 h-5 text-purple-500" /> 객관적 역량 진단</div>
            <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-orange-500" /> 맞춤형 공모전 추천</div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full max-w-lg relative"
        >
          {/* Floating UI Elements mocking the app */}
          <div className="glass-card p-6 relative z-10 aspect-square flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">나의 역량 분포 (Backend)</h3>
              <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-md">상위 12%</span>
            </div>
            <div className="flex-1 relative -mx-4">
               <RadarChart />
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm font-medium text-gray-700 leading-snug">
                "데이터베이스와 클라우드 경험은 풍부하나, 백엔드 프레임워크 실무 경험이 15% 부족합니다."
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        </motion.div>
      </section>
    </div>
  );
}
