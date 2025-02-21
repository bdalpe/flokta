import express, {type Request, type Response} from "express";
import {genEvents} from "./event";

const app = express();
// https://developer.okta.com/docs/api/openapi/okta-management/management/tag/SystemLog/#tag/SystemLog
app.get('/api/v1/logs', (req: Request, res: Response) => {
	console.log("Received request", {url: req.url, qs: req.query});

	req.query.limit ??= '100';
	const limit = Number.parseInt(req.query.limit as string);

	const hasNext = Math.random() > 0.5;

	const count = Math.ceil(Math.random() * limit);

	const events = hasNext ? limit : count;

	let link = '/api/v1/logs; rel="self"';

	if (hasNext) {
		link = link + ', /api/v1/logs?limit=100; rel="next"';
	}

	res.header('Link', link)

	res.json(genEvents(events));
})

app.listen(process.env.PORT ?? 8000, () => {
	console.log('Server started on port 8000');
})
