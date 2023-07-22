# Netonomy Engine Spec

**Purpose** - This will be the backend that powers the Netnomy Wallet application. It will manage several components such as bitcoin nodes, and dwn servers

## Components

### 1. Bitcoin Core Nodes

Netnomy will need to host and manage at least two bitcoin core nodes to run transaction through.

### 2. ElectrumX Server

This server will connect to the bitcoin core nodes and process users tractions. This is used so we can have a non custodial wallet and node store users private keys on the bitcoin core nodes.

### 3. Netonomy Server

This will be the main applicaiton server. The goal for this server is to provide an api for the Netnomy wallet app to use, but also as a api for developers to connect to. The core features will be:

- Bitcoin wallet creation and management
- Bitcoin transactions
- Lightning Network potentially

**Authentication** - Users will be authenticated with their... (TODO)

### 4. DWN Server

This will be Netonomy's DWN sevrer that pro users can use to store their data in the cloud. This server will have a tenate gate so that only pro users can access and use it.
