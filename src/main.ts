import express from 'express';
import { DEFAULT_PATH_TO_WORKFLOWS_JSON } from './constants';
import { defineEndpoints } from './define-endpoints';

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

const pathToWorkflowsJSON = process.env.WORKFLOWS_JSON_PATH || DEFAULT_PATH_TO_WORKFLOWS_JSON;
defineEndpoints(app, pathToWorkflowsJSON);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
