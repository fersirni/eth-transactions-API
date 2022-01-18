export class TransactionsFilter {
  hash: string;
  from: string;
  to: string;
  blockNumber: number;

  constructor(filter: any) {
    const { hash, blockNumber, from, to } = filter;
    this.hash = hash;
    this.from = from;
    this.to = to;
    this.blockNumber = parseInt(blockNumber);
  }
}
