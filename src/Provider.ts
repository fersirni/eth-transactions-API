import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import { TransactionsFilter } from "./TransactionsFilter";
import { Storage } from "./Storage";
const { EtherscanProvider } = ethers.providers;
const provider = new EtherscanProvider("rinkeby");

export class Provider {
  static provider = provider;

  static async getTransactions(filter: TransactionsFilter) {
    try {
      if (!!filter?.hash) {
        return Provider.getTransactionByHash(filter?.hash);
      } else if (!!filter?.blockNumber) {
        return Provider.getTransactionsByBlock(filter?.blockNumber);
      } else if (!!filter?.from || !!filter?.to) {
        return Provider.getTransactionsHistory(filter?.from, filter?.to);
      } else {
        return Provider.getTransactionsByBlock("latest");
      }
    } catch (error) {
      throw error;
    }
  }

  static async getTransactionByHash(
    hash: string
  ): Promise<Array<TransactionResponse>> {
    try {
      return [await provider.getTransaction(hash)];
    } catch (error) {
      throw new Error(
        `Error while getting transaction with hash: ${hash}. Error: ${error}`
      );
    }
  }

  static async getTransactionsByBlock(
    blockTag: number | string
  ): Promise<Array<TransactionResponse>> {
    try {
      const block = await provider.getBlockWithTransactions(blockTag);
      return block?.transactions;
    } catch (error) {
      throw new Error(
        `Error while getting transactions by block number: ${blockTag}. Error: ${error}`
      );
    }
  }

  static async getTransactionsHistory(
    from: string | undefined,
    to: string | undefined
  ): Promise<Array<TransactionResponse>> {
    try {
      if (!!from && !!to) {
        const txs = await provider.getHistory(from);
        const txsFromTo = txs.filter(tx => {
          return (tx.from === from && tx.to === to) || (tx.from === to && tx.to === from);
        });
        return txsFromTo;
      } else if (!!from) {
        const txs = await provider.getHistory(from);
        const txsFrom = txs.filter(tx => {
          return (tx.from === from);
        });
        return txsFrom;
      } else if (!!to) {
        const txs = await provider.getHistory(to);
        const txsTo = txs.filter(tx => {
          return (tx.to === to);
        });
        return txsTo;
      }
      throw new Error(`from: ${from} and to: ${to} properties cannot be both undefined.`);
    } catch (error) {
      throw new Error(
        `Error while getting transactions history from: ${from} to: ${to}. Error: ${error}`
      );
    }
  }

  static subscribeToNewBlockEvent(db: Storage) {
    provider.on("block", async (blockNumber) => {
      console.log("New block found! Block number: " + blockNumber);
      const txs = await Provider.getTransactionsByBlock(blockNumber);
      db.saveTransactions(txs);
    });
  }
}
