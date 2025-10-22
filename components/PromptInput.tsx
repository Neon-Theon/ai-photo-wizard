
import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g., 'Add a birthday hat on the dog', 'make the sky look like a sunset', 'turn this into a watercolor painting'..."
      rows={4}
      className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-gray-200 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-none"
    />
  );
};
