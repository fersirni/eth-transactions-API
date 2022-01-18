import { TransactionResponse } from "@ethersproject/abstract-provider";
import { Transaction } from "./entities/Transaction";
import { Connection, createConnection, getMongoRepository } from "typeorm";
export class Storage {
  client: Connection | undefined;

  async connect() {
    console.log("MONGO_URI = " + process.env.MONGO_URI);
    try {
      if (!this.client) {
        this.client = await createConnection({
          type: "mongodb",
          url: process.env.MONGO_URI,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          synchronize: true,
          logging: true,
          entities: [Transaction],
        });
      }
      console.log("Client connected");
    } catch (error) {
      throw new Error(`Failed to connect to Mongo DB. Error: ${error}`);
    }
  }

  async saveTransactions(transactions: TransactionResponse[]) {
    try {
      const txs = transactions.map((tx) => {
        return new Transaction(tx);
      });
      const manager = getMongoRepository(Transaction);
      await manager.insertMany(txs);
      console.log("\n%s transactions saved.\n", txs?.length);
    } catch (error) {
      throw new Error(`Error while saving the transactions: ${error}`);
    }
  }
}
