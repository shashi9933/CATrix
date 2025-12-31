import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ProcessedQuestion {
  question_text: string;
  question_type: 'MCQ' | 'TITA';
  correct_answer: string;
  marks: number;
  section: 'VARC' | 'DILR' | 'QA';
  options?: {
    option_text: string;
    option_letter: string;
  }[];
}

export async function processPDF(file: File): Promise<ProcessedQuestion[]> {
  const worker = await (createWorker as any)();
  
  try {
    await (worker as any).loadLanguage('eng');
    await (worker as any).initialize('eng');
    
    const result = await (worker as any).recognize(file);
    const { data: { text } } = result;
    
    // Process the text and extract questions
    const questions = text.split('\n\n').filter((q: string) => q.trim().length > 0).map((q: string) => {
      const lines = q.split('\n');
      const questionText = lines[0];
      
      // Extract options if they exist
      const options = lines.slice(1).filter((line: string) => line.match(/^[A-D]\)/)).map((line: string) => {
        const match = line.match(/^([A-D])\)\s*(.*)/);
        return match ? {
          option_letter: match[1],
          option_text: match[2].trim()
        } : null;
      }).filter(Boolean);

      return {
        question_text: questionText,
        question_type: options.length > 0 ? 'MCQ' : 'TITA',
        correct_answer: '', // This would need to be determined separately
        marks: 1,
        section: 'VARC', // This would need to be determined based on content
        options: options.length > 0 ? options : undefined
      };
    });

    return questions;
  } finally {
    await (worker as any).terminate();
  }
} 