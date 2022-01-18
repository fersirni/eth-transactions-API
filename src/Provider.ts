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
      } else if (!!filter?.from) {
        return Provider.getTransactionsHistory(filter?.from);
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
    from: string
  ): Promise<Array<TransactionResponse>> {
    try {
      return provider.getHistory(from);
    } catch (error) {
      throw new Error(
        `Error while getting transactions history from: ${from}. Error: ${error}`
      );
    }
  }

  static subscribeToNewBlockEvent(db: Storage) {
    provider.on("block", async (blockNumber) => {
      console.log("New block found! Block number: " + blockNumber);
      const blockTransactions = await Provider.getTransactionsByBlock(
        blockNumber
      );
      db.saveTransactions(blockTransactions);
    });
  }

  // const filter = {
  //     //address: THE_ADDRESS_OF_YOUR_CONTRACT,
  //     topics: [
  //         // the name of the event, parnetheses containing the data type of each event, no spaces
  //         ethers.utils.id("Transfer(address,address,uint256)")
  //     ]
  // }
}
