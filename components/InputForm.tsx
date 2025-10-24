
import React, { useState, useRef, useCallback } from 'react';
import { FileUpIcon, InfoIcon } from './icons';

interface InputFormProps {
  onScan: (foodData: string, foodImage: File | null) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onScan, isLoading }) => {
  const [foodData, setFoodData] = useState<string>('');
  const [foodImage, setFoodImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setError(null);
      setFoodImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
      setFoodImage(null);
      setImagePreview(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!foodData.trim()) {
      setError('Please provide some data about the food sample.');
      return;
    }
    setError(null);
    onScan(foodData, foodImage);
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
        const changeEvent = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(changeEvent);
      }
    }
  }, []);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Analyze a Food Sample</h2>
        <p className="text-slate-500 mt-1">Enter sample data below to check for fraud and adulteration.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="foodData" className="block text-sm font-medium text-slate-700 mb-1">
            Sample Data <span className="text-red-500">*</span>
          </label>
          <textarea
            id="foodData"
            rows={8}
            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            placeholder="Enter chemical composition, ingredient list, sensor readings, etc.&#10;e.g., Milk Sample:&#10;- Protein: 2.9%&#10;- Fat: 3.5%&#10;- Lactose: 4.5%&#10;- Added Starch: Detected&#10;- Water Content: 89%"
            value={foodData}
            onChange={(e) => setFoodData(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Packaging Image (Optional)
          </label>
          <label
            htmlFor="foodImage"
            className="relative flex justify-center w-full h-32 px-4 transition bg-white border-2 border-slate-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-slate-400 focus:outline-none"
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <span className="flex items-center space-x-2">
              <FileUpIcon className="h-8 w-8 text-slate-500" />
              <span className="font-medium text-slate-600">
                Drop an image here, or <span className="text-blue-600 underline">click to upload</span>
              </span>
            </span>
            <input
              id="foodImage"
              type="file"
              accept="image/*"
              className="absolute top-0 left-0 w-full h-full opacity-0"
              onChange={handleImageChange}
              ref={fileInputRef}
              disabled={isLoading}
            />
          </label>
        </div>
        
        {imagePreview && (
          <div className="mb-4 p-3 border border-slate-200 rounded-lg bg-slate-50 text-center">
            <p className="text-sm font-medium text-slate-700 mb-2">Image Preview:</p>
            <div className="relative inline-block">
                <img src={imagePreview} alt="Food packaging preview" className="max-h-40 rounded-md shadow-sm"/>
                <button 
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  aria-label="Remove image"
                >&times;</button>
            </div>
          </div>
        )}

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
        
        <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm flex items-start mb-6">
            <InfoIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"/>
            <span>For best results, provide detailed and accurate data. The AI's analysis is based on the quality of the information you enter.</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
             <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
             </>
          ) : 'Scan Sample'}
        </button>
      </form>
    </div>
  );
};
