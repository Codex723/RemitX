export interface Corridors {
  id: string;
  from: string;
  to: string;
  fromCurrency: string;
  toCurrency: string;
}

export interface PathPaymentQuote {
  sourceAsset: string;
  destinationAsset: string;
  sourceAmount: string;
  destinationAmount: string;
  path: string[];
}

export interface AnchorFee {
  anchor: string;
  fixedFee: number;
  percentageFee: number;
  minAmount?: number;
}

export interface TransactionRecord {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  amount: string;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
}
