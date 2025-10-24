
import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { analyzeFoodSample } from './services/geminiService';
import type { AnalysisResult } from './types';
import { ShieldAlertIcon } from './components/icons';


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (foodData: string, foodImage: File | null) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      let imageBase64: string | undefined = undefined;
      let mimeType: string | undefined = undefined;

      if (foodImage) {
        if (!foodImage.type.startsWith('image/')) {
          throw new Error('Please upload a valid image file (JPEG, PNG, GIF).');
        }
        const reader = new FileReader();
        const promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
        reader.readAsDataURL(foodImage);
        const dataUrl = await promise;
        imageBase64 = dataUrl.split(',')[1];
        mimeType = foodImage.type;
      }

      const result = await analyzeFoodSample(foodData, imageBase64, mimeType);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!analysisResult && !isLoading && (
            <InputForm onScan={handleScan} isLoading={isLoading} />
          )}

          {isLoading && (
             <div className="text-center p-8">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-slate-600 font-medium">Analyzing sample... this may take a moment.</p>
                <p className="text-sm text-slate-500">Our AI is running a deep analysis of the provided data.</p>
             </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg text-center max-w-2xl mx-auto">
              <div className="flex justify-center items-center">
                <ShieldAlertIcon className="h-6 w-6 text-red-500 mr-3"/>
                <h3 className="text-lg font-semibold text-red-800">Analysis Failed</h3>
              </div>
              <p className="mt-2 text-red-700">{error}</p>
              <button
                onClick={resetState}
                className="mt-4 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {analysisResult && (
            <ResultsDashboard result={analysisResult} onReset={resetState} />
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
