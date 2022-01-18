import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "../.env") });
import express from "express";
import { Provider } from "./Provider";
import { TransactionsFilter } from "./TransactionsFilter";
import { Storage } from "./Storage";

const app = express();

app.get("/transactions", async (req, res) => {
  try {
    // I'm assuming that without any filter I'll show up the transactions for the last block
    const filter = new TransactionsFilter(req?.query);
    const result = await Provider.getTransactions(filter);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error while getting transactions: ${error}`);
  }
});

app.listen(3000, async () => {
  const db = new Storage();
  await db.connect();
  Provider.subscribeToNewBlockEvent(db);

  console.log("The application is listening on port 3000!");
});
