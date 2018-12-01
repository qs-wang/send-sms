import app from './app';
import {getLogger} from './utils/loggerfactory';
import chalk from 'chalk';

const logger = getLogger('server');

app.listen(app.get('port'), () => {
  logger.info(`${chalk.green('✓')} App is listening at ${app.get('baseUrl')}`);
  logger.info('Press CTRL-C to stop\n');
});

export default app;
