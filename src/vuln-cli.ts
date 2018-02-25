import * as commander from 'commander';

import * as actions from './cli-middleware';

commander
  .version('0.0.1')
  .description('Docker Image Freshness and Vulnerability Manager');

commander
  .command('createContainer <imageName>')
  // .alias('cc')
  .description('Create a container')
  .action((imageName) => {
    actions.createContainer(imageName);
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
  .command('checkForVuln <imageName>')
  .description('Check for vulnerable components')
  .action((imageName) => {
    actions.performVulnerabilityCheck(imageName);
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
  .description('Run npm tests')
  .action((imageName) => {
    actions.runNpmTests(imageName);
  });

commander
  .command('runNcuCheck <imageName>')
  .description('Run npm tests')
  .action((imageName) => {
    actions.runNcuCheck(imageName);
  });

commander
  .command('updateComponents <imageName>')
  .description('Update npm components')
  .action((imageName) => {
    actions.updateNpmComponents(imageName);
  });

commander
  .command('removeSrcCode <imageName>')
  .description('Remove source code')
  .action((imageName) => {
    actions.removeSrcCode(imageName);
  });

commander
  .command('dockerLogin <username> <password>')
  .description('Docker login')
  .action((username, password) => {
    actions.dockerLogin(username, password);
  });

commander
  .command('buildImage <imageName>')
  .description('Build Docker image')
  .action((imageName) => {
    actions.buildImage(imageName);
  });

commander
  .command('pushImage <imageName>')
  .description('Push Docker image')
  .action((imageName) => {
    actions.pushImage(imageName);
  });

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit();
}
commander.parse(process.argv);
