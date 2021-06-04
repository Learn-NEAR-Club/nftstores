NftStore

Decentralized e-commerce platform allow user to create small store quick with custom domain and support near payment

https://www.figma.com/file/AUt66EE5vQVZPxb2PQ95nZ/Crypter_-NFT-marketplace-kit-(UI8)?node-id=1710%3A2347

==================

alway.near
duythien.near

==================

near call dev-1622382187667-2653102 getProducts '{"_page": 1, "_limit": 10}' --account-id support.testnet

near call dev-1622382187667-2653102 addProduct '{"_name": "hello world product3", "_price": "10000000000000000000000000", "_coin": null, "_description": "just testing description 3"}' --account-id support.testnet

near call dev-1622382187667-2653102 addProduct '{"_name": "hello world product3", "_price": "20000000000000000000000000", "_coin": null, "_description": "just testing description 3"}' --account-id support.testnet

near call dev-1622382187667-2653102 addProduct '{"_name": "hello world product3", "_price": "30000000000000000000000000", "_coin": null, "_description": "just testing description 3"}' --account-id support.testnet

near call dev-1622382187667-2653102 newOrder '{"_productId": 105}' --account-id support.testnet

near call dev-1622382187667-2653102 newOrder '{"_productId": 104}' --account-id support.testnet

near call dev-1622382187667-2653102 newOrder '{"_productId": 106}' --account-id support.testnet

near call dev-1622382187667-2653102 newOrder '{"_productId": 105}' --account-id support.testnet --amount 40