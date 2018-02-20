import * as commander from 'commander';

import * as actions from './cli-middleware';

commander
  .version('0.0.1')
  .description('Docker Image Freshness and Vulnerability Manager');

commander
  .command('createContainer <name>')
  // .alias('cc')
  .description('Create a container')
  .action((name) => {
    actions.createContainer(name);
  });

commander
  .command('startContainer <containerId>')
  .description('Start a container')
  .action((containerId) => {
    actions.startContainer(containerId);
  });

commander
  .command('stopContainer <containerId>')
  .description('Stop a container')
  .action((containerId) => {
    actions.stopContainer(containerId);
  });

commander
  .command('removeContainer <containerId>')
  .description('Remove a container')
  .action((containerId) => {
    actions.removeContainer(containerId);
  });

commander
  .command('extractContainer <containerId> <imageName>')
  .description('Extract a container')
  .action((containerId, imageName) => {
    actions.extractContainer(containerId, imageName);
  });

commander
  .command('checkForVuln <name>')
  .description('Check for vulnerable components')
  .action((name) => {
    actions.performVulnerabilityCheck(name);
  });

commander
  .command('pullImage <imageName>')
  .description('Pull Docker image')
  .action((imageName) => {
    actions.pullImage(imageName);
  });

commander
  .command('removeImage <imageId>')
  .description('Remove Docker image')
  .action((imageId) => {
    actions.removeImage(imageId);
  });

commander
  .command('runNpmTests <imageName>')
  .description('Remove Docker image')
  .action((imageName) => {
    actions.runNpmTests(imageName);
  });

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit();
}
commander.parse(process.argv);
