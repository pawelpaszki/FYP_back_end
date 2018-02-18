import * as commander from 'commander';

import * as actions from './cli-middleware';

commander
  .version('0.0.1')
  .description('Docker Image Freshness and Vulnerability Manager');

commander
  .command('createContainer <name>')
  .alias('cc')
  .description('Create a container')
  .action((name) => {
    actions.createContainer(name);
  });

commander
  .command('startContainer <containerId>')
  .alias('sac')
  .description('Start a container')
  .action((containerId) => {
    actions.startContainer(containerId);
  });

commander
  .command('stopContainer <containerId>')
  .alias('soc')
  .description('Stop a container')
  .action((containerId) => {
    actions.stopContainer(containerId);
  });

commander
  .command('extractContainer <containerId> <imageName>')
  .alias('ec')
  .description('Extract a container')
  .action((containerId, imageName) => {
    actions.extractContainer(containerId, imageName);
  });

commander
  .command('checkForVuln <name>')
  .alias('cv')
  .description('Check for vulnerable components')
  .action((name) => {
    actions.performVulnerabilityCheck(name);
  });

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit();
}
commander.parse(process.argv);
