### Bitcoin core local node interaction

rpc auth: 'foo:7d9ba5ae63c3d4dc30583ff4fe65a67e$9e3634e81c11659e3de036d0bf88f89cd169c1039e6e09607562d54765c649cc'
password: qDDZdeQ5vw9XXFeVnXT4PZ--tGN2xNjjR4nrtyszZx0=

### Generate blocks

```
curl --user foo --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "generatetoaddress", "params": [100,"bcrt1qvt5kgsnj8mvuq4jkd3kacrg4a2lewhyxsrl4jy"] }' -H 'content-type: text/plain;' http://foo:qDDZdeQ5vw9XXFeVnXT4PZ--tGN2xNjjR4nrtyszZx0\=@127.0.0.1:18443/
```
