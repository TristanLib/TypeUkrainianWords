export interface Word {
  uk: string;
  meaning: string;
  original: string;
  category: string;
  example?: string;
}

export interface VocabularyData {
  [key: string]: Word[];
}

export interface KeyboardKey {
  uk: string;
  en: string;
}

export interface KeyboardProps {
  highlightKey: string | null;
}

export interface KeyboardKeyProps {
  ukChar: string;
  enChar: string;
  isPressed: boolean;
} 