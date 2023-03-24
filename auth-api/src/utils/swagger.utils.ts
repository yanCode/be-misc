import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { log } from 'src/utils/logger.utils';

const swaggerDocument = YAML.load('./swagger.yaml');
export default function swaggerDocs(app: Express, port: number) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  log.info(`Docs available at http://localhost:${port}/docs`);
}
