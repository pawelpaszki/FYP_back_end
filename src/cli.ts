#!/usr/bin/env ts-node

import * as commander from 'commander';

import * as actions from './cli-middleware';

commander
  .version('0.0.1')
  .description('Docker Image Freshness and Vulnerability Manager');

commander
  .command('createContainer <token> <imageName>')
  .description('Create a new container')
  .action((token, imageName) => {
    actions.createContainer(token, imageName);
  });

commander
  .command('startContainer <token> <containerId>')
  .description('Start an existing non-running container')
  .action((token, containerId) => {
    actions.startContainer(token, containerId);
  });

commander
  .command('extractContainer <token> <containerId> <imageName>')
  .description('Extract a source code of a running container')
  .action((token, containerId, imageName) => {
    actions.extractContainer(token, containerId, imageName);
  });

commander
  .command('stopContainer <token> <containerId>')
  .description('Stop a running container')
  .action((token, containerId) => {
    actions.stopContainer(token, containerId);
  });

commander
  .command('removeContainer <token> <containerId>')
  .description('Remove a non-running container')
  .action((token, containerId) => {
    actions.removeContainer(token, containerId);
  });

commander
  .command('checkTag <token> <imageName>')
  .description('Check the latest tag of a Docker image')
  .action((token, imageName) => {
    actions.checkTag(token, imageName);
  });

commander
  .command('buildImage <token> <imageName>')
  .description('Build a new version of a Docker image')
  .action((token, imageName) => {
    actions.buildImage(token, imageName);
  });

commander
  .command('pushImage <token> <imageName>')
  .description('Push a built Docker image')
  .action((token, imageName) => {
    actions.pushImage(token, imageName);
  });

commander
  .command('pullImage <token> <imageName>')
  .description('Pull a Docker image from the DockerHub')
  .action((token, imageName) => {
    actions.pullImage(token, imageName);
  });

commander
  .command('removeImage <token> <imageId>')
  .description('Remove a Docker image')
  .action((token, imageId) => {
    actions.removeImage(token, imageId);
  });

commander
  .command('checkForVuln <token> <imageName> <checkOnly>')
  .description('Check for vulnerable components in the extracted source code')
  .action((token, imageName, checkOnly) => {
    actions.checkForVulnComps(token, imageName, checkOnly);
  });

commander
  .command('persistVulnCheck <token> <imageName>')
  .description('Perform and persist vulnerability check')
  .action((token, imageName) => {
    actions.performVulnerabilityCheck(token, imageName);
  });

commander
  .command('runNpmTests <token> <imageName>')
  .description('Run npm tests inside extracted source code')
  .action((token, imageName) => {
    actions.runNpmTests(token, imageName);
  });

commander
  .command('runNcuCheck <token> <imageName>')
  .description('Check if there are newer versions of used npm components')
  .action((token, imageName) => {
    actions.runNcuCheck(token, imageName);
  });

commander
  .command('updateComponents <token> <imageName>')
  .description('Update all of the installed npm components')
  .action((token, imageName) => {
    actions.updateNpmComponents(token, imageName);
  });

commander
  .command('updateComponent <token> <imageName> <packageName>')
  .description('Update a single npm components')
  .action((token, imageName, packageName) => {
    actions.updateNpmComponent(token, imageName, packageName);
  });

commander
  .command('updateAndReinstall <token> <imageName> <packageName>')
  .description('Update an npm component and reinstall all of the packages')
  .action((token, imageName, packageName) => {
    actions.updateAndReinstall(token, imageName, packageName);
  });

commander
  .command('removeSrcCode <token> <imageName>')
  .description('Remove extracted source code of a Docker image')
  .action((token, imageName) => {
    actions.removeSrcCode(token, imageName);
  });

commander
  .command('dockerLogin <token> <username> <password>')
  .description('login to Docker cli')
  .action((token, username, password) => {
    actions.dockerLogin(token, username, password);
  });

commander
  .command('register <username> <password>')
  .description('Register to the API')
  .action((username, password) => {
    actions.register(username, password);
  });

commander
  .command('login <username> <password>')
  .description('Login to the API')
  .action((username, password) => {
    actions.login(username, password);
  });

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit();
}
commander.parse(process.argv);
