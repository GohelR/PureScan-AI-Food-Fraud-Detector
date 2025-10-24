
import React from 'react';
import type { AnalysisResult, Status } from '../types';
import { ShapBarChart } from './ShapBarChart';
import { RiskPieChart } from './RiskPieChart';
import { ShieldCheckIcon, ShieldAlertIcon, HelpCircleIcon, RefreshCwIcon, ClipboardCheckIcon } from './icons';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const statusConfig: Record<Status, {
  bgColor: string;
  textColor: string;
  borderColor: string;
  Icon: React.FC<{className?: string}>;
  title: string;
}> = {
  Safe: {
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    Icon: ShieldCheckIcon,
    title: 'Sample is Safe'
  },
  Fraudulent: {
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    Icon: ShieldAlertIcon,
    title: 'Fraudulent Sample Detected'
  },
  Uncertain: {
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    Icon: HelpCircleIcon,
    title: 'Analysis Uncertain'
  }
};


export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onReset }) => {
  const config = statusConfig[result.status];
  const { Icon, title, bgColor, textColor, borderColor } = config;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`p-6 rounded-xl border ${borderColor} ${bgColor} shadow-md`}>
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
          <Icon className={`h-16 w-16 ${textColor} mr-0 sm:mr-6 mb-4 sm:mb-0`} />
          <div>
            <h2 className={`text-3xl font-bold ${textColor}`}>{title}</h2>
            <p className="mt-2 text-lg text-slate-600">{result.summary}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <ClipboardCheckIcon className="h-6 w-6 text-blue-600 mr-2"/>
                Risk Assessment
            </h3>
            <div className="h-64">
                <RiskPieChart fraudProbability={result.fraudProbability} />
            </div>
            <p className="text-center text-sm text-slate-500 mt-4">
              The AI calculated a <strong>{ (result.fraudProbability * 100).toFixed(0) }% probability</strong> of the sample being fraudulent.
            </p>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Explainable AI (XAI) - Feature Influence</h3>
          <p className="text-sm text-slate-500 mb-4">
            This chart shows the factors that most influenced the AI's decision. Red bars indicate features pushing towards a "Fraudulent" result, while green bars push towards "Safe".
          </p>
          <div className="h-80 w-full">
             <ShapBarChart features={result.features} />
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center mx-auto"
        >
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          Analyze Another Sample
        </button>
      </div>
    </div>
  );
};
