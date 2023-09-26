//import express from 'express';
import express, { Request, Response } from 'express';
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});

// serve ht main html from here
app.get('/', function (req, res) {
  res.send(`Hello World! ${req.path}`);
});

interface LocationWithTimezone {
  location: string;
  timezoneName: string;
  timezoneAbbr: string;
  utcOffset: number;
  void: unknown;
}

const getLocationsWithTimezones = (request: Request, response: Response) => {
  const locations: LocationWithTimezone[] = [
    {
      location: 'Germany',
      timezoneName: 'Central European Time',
      timezoneAbbr: 'CET',
      utcOffset: 1,
      void: null,
    },
    {
      location: 'China',
      timezoneName: 'China Standard Time',
      timezoneAbbr: 'CST',
      utcOffset: 8,
      void: null,
    },
    {
      location: 'Argentina',
      timezoneName: 'Argentina Time',
      timezoneAbbr: 'ART',
      utcOffset: -3,
      void: null,
    },
    {
      location: 'Japan',
      timezoneName: 'Japan Standard Time',
      timezoneAbbr: 'JST',
      utcOffset: 9,
      void: request,
    },
  ];

  response.status(200).json(locations);
};

const getWorlds = (request: Request, response: Response) => {
  response.status(200).json(request);
};

const getAreasInWorld = (request: Request, response: Response) => {
  response.status(200).json(request);
};

const getLocationsInArea = (request: Request, response: Response) => {
  response.status(200).json(request);
};

const getTreeJustPriorToSolving = (request: Request, response: Response) => {
  response.status(200).json(request);
};

const getSolutionViaDepthFirstSearch = (
  request: Request,
  response: Response
) => {
  response.status(200).json(request);
};

app.get('/timezones', getLocationsWithTimezones);
app.get('/worlds', getWorlds); // based on folder
app.get('/areas', getAreasInWorld); // get areas given
app.get('/locations', getLocationsInArea);
app.get('/solutionPriorToSolving', getTreeJustPriorToSolving); // get areas given
app.get('/solutionViaDepthFirstSearch', getSolutionViaDepthFirstSearch); // get areas given
