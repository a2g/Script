import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import redis, { RedisClientType } from 'redis';
import responseTime from 'response-time';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

//https://github.com/redis/node-redis/blob/HEAD/docs/client-configuration.md
const client: RedisClientType = redis.createClient({
  url: process.env.REDIS_ENDPOINT_URI,
  password: process.env.REDIS_PASSWORD,
});

dotenv.config();

// Set response
function composeResponse(username: string, repos: number, isCached: boolean) {
  return {
    username,
    repos,
    isCached,
  };
}

// Make request to Github for data
async function getRepos(req: Request, res: Response) {
  try {
    const { username } = req.params;

    const response = await fetch(`https://api.github.com/users/${username}`);

    const data: any = await response.json();

    const repos = data.public_repos;

    if (!isNaN(repos)) {
      client.setEx(username, 3600, repos);
      res.json(composeResponse(username, repos, false));
    } else {
      res.status(404);
    }
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}

app.use('/', express.static(path.join(__dirname, '../lib/src')));
app.use(responseTime());
app.use(
  cors({
    exposedHeaders: ['X-Response-Time'],
  })
);

async function cacheMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = req.params;

  const data: string | null = await client.get(username);

  if (data !== null) {
    res.json(composeResponse(username, Number(data), true));
  } else {
    next();
  }
}

app.get('/repos/:username', cacheMiddleware, getRepos);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
