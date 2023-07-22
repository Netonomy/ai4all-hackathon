1. Address Information

GET /api/v1/address/{address}/balance: Get the balance of a given Bitcoin address. The returned balance would be in satoshis, the smallest unit of Bitcoin.
GET /api/v1/address/{address}/transactions: Get a list of all transactions associated with the given Bitcoin address.

2. Transaction Information

GET /api/v1/transaction/{txid}: Get detailed information about a specific transaction by its ID.
POST /api/v1/transaction/send: Broadcast a new transaction. The transaction should be signed and serialized on the
