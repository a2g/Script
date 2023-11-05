import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
//import { createClient, RedisClient } from 'redis';
import responseTime from 'response-time';
import cors from 'cors';
import path from 'path';
import { Box } from './puzzle/Box';
import { SolverViaRootPiece } from './puzzle/SolverViaRootPiece';
import { FormatText } from './puzzle/FormatText';
import { solutions } from './api/solutions';
import { svg } from './api/svg';
import { existsSync } from 'fs';
import { Suffix } from '../Suffix';

const app = express();
const PORT = process.env.PORT || 5000;
/*
const redisClient: RedisClient = createClient({
  url: process.env.REDIS_ENDPOINT_URI,
  password: process.env.REDIS_PASSWORD,
});*/

dotenv.config();

// Make direct request to Github for data
async function getSolutionsDirect(req: Request, responseSender: Response) {
  try {
    const repo = req.params.repo;
    const world = req.params.world;
    const area = req.params.area;

    const path = `../${repo}/${world}/`;
    const firstBoxFilename = `${area}${Suffix.FirstBox}.jsonc`;

    if (!existsSync(path + firstBoxFilename)) {
      console.log(
        `file doesn't exist ${path}${firstBoxFilename} ${process.cwd()}`
      );
      return;
    }

    const firstBox = new Box(path, firstBoxFilename);
    firstBox.Init();

    const allBoxes = new Set<Box>();
    firstBox.CollectAllReferencedBoxesRecursively(allBoxes);
    const solver = new SolverViaRootPiece(firstBox);

    for (let i = 0; i < 40; i++) {
      solver.SolvePartiallyUntilCloning();
      solver.MarkGoalsAsCompletedAndMergeIfNeeded();
      const numberOfSolutions: number = solver.NumberOfSolutions();
      console.warn('Dig in to goals');
      console.warn('===============');
      console.warn(`Number of solutions in solver = ${numberOfSolutions}`);

      // display list
      let incomplete = 0;
      let listItemNumber = 0;
      for (const solution of solver.GetSolutions()) {
        console.warn(FormatText(solution.GetDisplayNamesConcatenated()));
        console.warn(FormatText(solution.GetRootMap().CalculateListOfKeys()));
        for (const array of solution.GetRootMap().GetValues()) {
          for (const item of array) {
            listItemNumber++;

            // display list item
            const status: string = item.firstNullInput;
            const { output } = item.piece;
            console.warn(`    ${listItemNumber}. ${output} (status=${status})`);
            incomplete += status.length > 0 ? 1 : 0;
          }
        }
      }

      console.warn(
        `Number of goals incomplete ${incomplete}/${listItemNumber}`
      );
      if (incomplete >= listItemNumber) {
        break;
      }
    }
    const json = solutions(solver);

    responseSender.json(json);
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
/*
function getSolutionsFromRedis(
  req: Request,
  responseSender: Response,
  next: NextFunction
) {
  next();

  const { username } = req.params;

  redisClient.get(username, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      responseSender.jsonc(username);
    } else {
      next();
    }
  });
}
*/
//app.get('/solutions/:firstFile', getSolutionsFromRedis, getSolutionsDirect);
app.get('/jig/:repo/:world/:area/sols', getSolutionsDirect);
app.get('/jig/:repo/:world/:area/svg', svg);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(
    `http://localhost:${PORT}/puz/puzzle-pieces/practice-world/03/sols`
  );
  console.log(
    `http://localhost:${PORT}/jig/exclusive-worlds/Highschool/12/sols`
  );
});

module.exports = app;
