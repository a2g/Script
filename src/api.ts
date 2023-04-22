import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import redis, { RedisClient } from 'redis';
import responseTime from 'response-time';
import cors from 'cors';
import path from 'path';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;

const redisClient: RedisClient = redis.createClient({
  url: process.env.REDIS_ENDPOINT_URI,
  password: process.env.REDIS_PASSWORD,
});

dotenv.config();

// Set response
function composeResponse(
  username: string,
  repos: string,
  isCached: boolean
): Object {
  return {
    username,
    repos,
    isCached,
  };
}

type GetUsersResponse = {
  public_repos: number;
};

// Make direct request to Github for data
async function directRequestToGithub(req: Request, responseSender: Response) {
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
        redisClient.setex(username, 3600, `${repos}`);
        const response = composeResponse(username, `${repos}`, false);
        responseSender.json(response);
      } else {
        responseSender.status(404);
      }
    }
  } catch (err) {
    console.error(err);
    responseSender.status(500);
  }
}

app.use('/', express.static(path.join(__dirname, '../lib/src')));
app.use(responseTime());
app.use(
  cors({
    exposedHeaders: ['X-Response-Time'],
  })
);

function requestToRedisServer(
  req: Request,
  responseSender: Response,
  next: NextFunction
) {
  const { username } = req.params;

  redisClient.get(username, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      const response = composeResponse(username, data, true);
      responseSender.json(response);
    } else {
      next();
    }
  });
}

app.get('/repos/:username', requestToRedisServer, directRequestToGithub);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
