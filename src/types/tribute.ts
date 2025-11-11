export interface Tribute {
  type: 'candle' | 'bow' | 'money';
  author: string;
}

export interface TributesData {
  tributes: Tribute[];
}

