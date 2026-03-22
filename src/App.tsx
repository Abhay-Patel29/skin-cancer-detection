import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShieldCheck, Info, Loader2, ChevronRight, Activity, Split, CircleDashed, Palette, Ruler, TrendingUp } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { analyzeSkinLesion } from './services/analysis';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [image, setImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (base64: string, mimeType: string) => {
    setImage(base64 ? { base64, mimeType } : null);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeSkinLesion(image.base64, image.mimeType);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Skin Analysis AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500">
            <a href="#abcde" className="hover:text-zinc-900 transition-colors">ABCDE Guide</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input & Info */}
          <div className="lg:col-span-7 space-y-8">
            <section>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
              >
                Intelligent Skin Lesion <br />
                <span className="text-zinc-400 italic">Screening Support.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-zinc-600 max-w-xl leading-relaxed"
              >
                Upload a clear photo of a skin lesion for an AI-powered preliminary assessment. 
                Early detection is key to successful treatment.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-widest"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Informed by the HAM10000 Dataset</span>
              </motion.div>
            </section>

            <section className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-zinc-600" />
                </div>
                <div>
                  <h2 className="font-bold">Start Analysis</h2>
                  <p className="text-sm text-zinc-500">Capture or upload a photo</p>
                </div>
              </div>

              <ImageUpload onImageSelected={handleImageSelected} />

              {image && !analysis && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-zinc-200"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing Lesion...
                      </>
                    ) : (
                      <>
                        Run AI Analysis
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Results & Education */}
          <div className="lg:col-span-5 space-y-8">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.section
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl sticky top-24"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-emerald-500" />
                      <h2 className="text-xl font-bold tracking-tight">AI Assessment</h2>
                    </div>
                    <button 
                      onClick={() => setAnalysis(null)}
                      className="text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="prose prose-zinc prose-sm max-w-none">
                    <div className="markdown-body">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-zinc-100">
                    <p className="text-xs text-zinc-400 italic">
                      This is not a diagnosis.
                    </p>
                  </div>
                </motion.section>
              ) : (
                <motion.section
                  key="education"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div id="abcde" className="bg-zinc-900 text-white p-8 rounded-3xl shadow-xl">
                    <div className="flex items-center gap-3 mb-8">
                      <Info className="w-6 h-6 text-zinc-400" />
                      <h2 className="text-xl font-bold tracking-tight">The ABCDE Guide</h2>
                    </div>
                    <div className="space-y-6">
                      {[
                        { 
                          l: 'A', 
                          t: 'Asymmetry', 
                          icon: Split,
                          d: 'One half of the mole does not match the other.',
                          details: 'Benign moles are usually symmetrical. If you draw a line through the middle, the two sides look similar.'
                        },
                        { 
                          l: 'B', 
                          t: 'Border', 
                          icon: CircleDashed,
                          d: 'Edges are irregular, ragged, notched, or blurred.',
                          details: 'The borders of an early melanoma tend to be uneven. The edges may be scalloped or notched.'
                        },
                        { 
                          l: 'C', 
                          t: 'Color', 
                          icon: Palette,
                          d: 'Color is not uniform; shades of brown, black, pink, or red.',
                          details: 'Most benign moles are all one color—often a single shade of brown. Having a variety of colors is a warning signal.'
                        },
                        { 
                          l: 'D', 
                          t: 'Diameter', 
                          icon: Ruler,
                          d: 'Spot is larger than 6mm (about the size of a pencil eraser).',
                          details: 'Melanomas are usually larger than 6mm in diameter when diagnosed, but they can be smaller.'
                        },
                        { 
                          l: 'E', 
                          t: 'Evolving', 
                          icon: TrendingUp,
                          d: 'The mole is changing in size, shape, or color.',
                          details: 'Common, benign moles look the same over time. Be on the alert when a mole starts to evolve or change in any way.'
                        },
                      ].map((item) => (
                        <div key={item.l} className="flex gap-4 items-start border-b border-white/10 pb-6 last:border-0 last:pb-0">
                          <div className="flex flex-col items-center gap-2 mt-1">
                            <span className="text-3xl font-black text-zinc-600 w-8 text-center leading-none">{item.l}</span>
                            <item.icon className="w-4 h-4 text-zinc-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-base uppercase tracking-widest text-zinc-100 mb-1">{item.t}</h3>
                            <p className="text-sm font-medium text-zinc-300 mb-2">{item.d}</p>
                            <p className="text-xs text-zinc-500 leading-relaxed italic">{item.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                    <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      Prevention Tips
                    </h3>
                    <ul className="text-sm text-emerald-800 space-y-2 list-disc list-inside">
                      <li>Apply broad-spectrum SPF 30+ daily</li>
                      <li>Wear protective clothing and hats</li>
                      <li>Seek shade during peak sun hours (10am-4pm)</li>
                      <li>Perform monthly self-skin checks</li>
                    </ul>
                  </div>

                  <div className="bg-zinc-100 p-6 rounded-3xl border border-zinc-200">
                    <h3 className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Dataset Information
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      This AI analysis is informed by the <strong>HAM10000 dataset</strong> ("Human Against Machine with 10000 training images"). 
                      It covers 7 diagnostic categories including Melanoma, Basal cell carcinoma, and Benign keratosis-like lesions. 
                      The model uses this extensive knowledge base to identify patterns in uploaded images.
                    </p>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 py-12 bg-white mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-zinc-400" />
            <span className="font-bold text-zinc-400">Skin Analysis AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
