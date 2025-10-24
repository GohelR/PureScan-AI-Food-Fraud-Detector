
import React from 'react';
import { ScanSearchIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <ScanSearchIcon className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold text-slate-800">PureScan</h1>
        <span className="ml-4 text-sm text-slate-500 hidden sm:inline">AI-Powered Food Fraud Detection</span>
      </div>
    </header>
  );
};
