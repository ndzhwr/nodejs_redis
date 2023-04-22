# nodejs_redis
Node.js redis integration.
```cmd
[nodemon] 2.0.22
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node src/index.ts`
🎇 Database connected successfully !
⚡  Redis connected successfully!
🚀 Server running on port 4444 !
```


Environment variables
```
PORT=3000
DATABASE_URL="mongodb+srv://<username>:<password>@<host>:<port>/<database>?authSource=admin"
REDIS_URL="redis://localhost:6379"

# Time to auto delete set values
REDIS_EXPIRY_TIME=10
`
``