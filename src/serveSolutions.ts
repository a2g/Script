import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
//import { createClient, RedisClient } from 'redis';
import responseTime from 'response-time';
import cors from 'cors';
import path from 'path';
import { Box } from './puzzle/Box';
import { SolverViaRootPiece } from './puzzle/SolverViaRootPiece';
import { FormatText } from './puzzle/FormatText';
import { JsonOfSolutions } from './api/JsonOfSolutions';
import { SvgWriter } from './api/SvgWriter';

const app = express();
const PORT = process.env.PORT || 5000;
/*
const redisClient: RedisClient = createClient({
  url: process.env.REDIS_ENDPOINT_URI,
  password: process.env.REDIS_PASSWORD,
});*/

dotenv.config();

interface RequestParams {
  world: string;
  area: string;
}

interface ResponseBody {}

interface RequestBody {}

interface RequestQuery {
  lastVisitedProp: string;
  command: string;
}

async function svg(
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  responseSender: Response,
  next: NextFunction
) {
  try {
    const world = req.params.world;
    const area = req.params.area;
    const command = req.query.command;
    const lastVisitedProp = req.query.lastVisitedProp;
    console.log(next.name);
    SvgWriter.writeSvg(world, area, lastVisitedProp, command, responseSender);
  } catch (err) {
    console.error(err);
    responseSender.status(500);
  }
}

// Make direct request to Github for data
async function getSolutionsDirect(req: Request, responseSender: Response) {
  try {
    const { firstFile } = req.params;

    // it doesn't make sense to change the folder here.
    // if switching from
    //process.chdir('./src/worlds/DruidsDelight/');
    console.log(firstFile);
    const firstBox = new Box('./src/worlds/DruidsDelight/', 'MainFirst.json');
    firstBox.Init();

    const allBoxes = new Set<Box>();
    firstBox.CollectAllReferencedBoxesRecursively(allBoxes);
    //const combined = new BigBoxViaSetOfBoxes(allBoxes);
    const solver = new SolverViaRootPiece(firstBox);

    // iterate 40 times until all root nodes are solved
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
        for (const item of solution.GetRootMap().GetValues()) {
          listItemNumber++;

          // display list item
          const status: string = item.firstNullInput;
          const { output } = item.piece;
          console.warn(`    ${listItemNumber}. ${output} (status=${status})`);
          incomplete += status.length > 0 ? 1 : 0;
        }
      }

      // log the number of goals that are solved
      console.log(`Number of goals incomplete ${incomplete}/${listItemNumber}`);
      if (incomplete >= listItemNumber) {
        break;
      }
    }
    const json = JsonOfSolutions.getJsonObjectContainingSolutions(solver);

    responseSender.json(json);
  } catch (err) {
    console.error(err);
    responseSender.status(500);
  }
}

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
      responseSender.json(username);
    } else {
      next();
    }
  });
}
*/
//app.get('/solutions/:firstFile', getSolutionsFromRedis, getSolutionsDirect);
app.get('/solutions/:firstFile', getSolutionsDirect);
app.get('/worlds/:world/:area/svg', svg);
app.use('/', express.static(path.join(__dirname, '../lib/src')));
app.use(responseTime());
app.use(
  cors({
    exposedHeaders: ['X-Response-Time'],
  })
);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
