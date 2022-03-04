# Ethereum Network Transactions API (Rinkeby)

This API retrieves and filter transactions from the Ethereum network. Transactions can be filtered by hash, block number, from and to addresses.


## Storage

This service also works as a Data Ingestion service, subscribed to the "new block" event in the Ethereum blockchain stores the transactions in a Mongo Database.


## Stack and tools

It is a Node.js service with typescript. To interact with the blockchain the library used is ethers.
