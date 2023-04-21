import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import redis, { RedisClient } from 'redis';
import responseTime from 'response-time';
import cors from 'cors';
import path from 'path';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;

const client: RedisClient = redis.createClient({
  url: process.env.REDIS_ENDPOINT_URI,
  password: process.env.REDIS_PASSWORD,
});

dotenv.config();

// Set response
function composeResponse(username: string, repos: string, isCached: boolean) {
  return {
    username,
    repos,
    isCached,
  };
}

type GetUsersResponse = {
  public_repos: number;
};

// Make request to Github for data
async function getRepos(req: Request, res: Response) {
  try {
    const { username } = req.params;

    const { data, status } = await axios.get<GetUsersResponse>(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );
    if (status == 200) {
      const repos = data.public_repos;

      if (!isNaN(repos)) {
        client.setex(username, 3600, `${repos}`);
        res.json(composeResponse(username, `${repos}`, false));
      } else {
        res.status(404);
      }
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

function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
  const { username } = req.params;

  client.get(username, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.json(composeResponse(username, data, true));
    } else {
      next();
    }
  });
}

app.get('/repos/:username', cacheMiddleware, getRepos);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
