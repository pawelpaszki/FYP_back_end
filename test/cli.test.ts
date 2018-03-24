import {expect} from 'chai';
import * as child from 'child_process';
import {chai} from './common';
import express from '../src/config/app';
let token = '';
const testImageName: string = 'pawelpaszki/vuln-demo-1-node';

describe('# CLI Test', () => {

  before((done) => {
    chai.request(express)
      .post('/api/register')
      .send({username: 'testusername', password: 'password'})
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  describe('create container cli command', () => {
    it('should not create a container without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts createContainer ' + token + ' ' + testImageName).toString();
      expect(output).to.include('unable to create container');
      done();
    });
  });

  describe('start container cli command', () => {
    it('should not start a container without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts startContainer ' + token + ' 123456abcdef').toString();
      expect(output).to.include('unable to start container');
      done();
    });
  });

  describe('extract container cli command', () => {
    it('should not extract a container without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts extractContainer ' + token + ' 123456abcdef ' + testImageName).toString();
      expect(output).to.include('unable to extract container');
      done();
    });
  });

  describe('stop container cli command', () => {
    it('should not stop a container without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts stopContainer ' + token + ' 123456abcdef').toString();
      expect(output).to.include('unable to stop container');
      done();
    });
  });

  describe('remove container cli command', () => {
    it('should not remove a container without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts removeContainer ' + token + ' 123456abcdef').toString();
      console.log(output);
      expect(output).to.include('unable to remove container');
      done();
    });
  });

  describe('check tag cli command', () => {
    it('should not check tag without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts checkTag ' + token + ' ' + testImageName).toString();
      expect(output).to.include('unable to get tag of the image');
      done();
    });
  });

  describe('build image cli command', () => {
    it('should not build image without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts buildImage ' + token + ' ' + testImageName).toString();
      expect(output).to.include('unable to build image');
      done();
    });
  });

  describe('push image cli command', () => {
    it('should not push image without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts pushImage ' + token + ' ' + testImageName).toString();
      expect(output).to.include('unable to push image');
      done();
    });
  });

  describe('pull image cli command', () => {
    it('should not pull image without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts pullImage ' + token + ' ' + testImageName).toString();
      expect(output).to.include('unable to pull image');
      done();
    });
  });

  describe('remove image cli command', () => {
    it('should not remove image without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts removeImage ' + token + ' ' + testImageName).toString();
      expect(output).to.include('unable to remove image');
      done();
    });
  });

  describe('check vulnerable components cli command', () => {
    it('should not perform this check without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts checkForVuln ' + token + ' ' + testImageName + ' ' + true).toString();
      expect(output).to.include('unable to perform vulnerability check');
      done();
    });
  });

  describe('perform vulnerability check cli command', () => {
    it('should not perform this check without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts persistVulnCheck ' + token + ' ' + testImageName).toString();
      expect(output).to.include('unable to perform vulnerability check');
      done();
    });
  });

  describe('run npm tests cli command', () => {
    it('should not run npm tests without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts runNpmTests ' + token + ' ' + testImageName).toString();
      expect(output).to.include('unable to run npm tests');
      done();
    });
  });

  describe('run ncu check cli command', () => {
    it('should not run ncu check without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts runNcuCheck ' + token + ' ' + testImageName).toString();
      expect(output).to.include('unable to check for npm updates');
      done();
    });
  });

  describe('update npm components cli command', () => {
    it('should not update npm components without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts updateComponents ' + token + ' ' + testImageName).toString();
      expect(output).to.include('unable to update components');
      done();
    });
  });

  describe('update npm component cli command', () => {
    it('should not update individual component without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts updateComponent ' + token + ' ' + testImageName + ' express@4.16.3').toString();
      expect(output).to.include('unable to update component');
      done();
    });
  });

  describe('update npm component cli command', () => {
    it('should not update individual component without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts updateAndReinstall ' + token + ' ' + testImageName + ' express@4.16.3').toString();
      expect(output).to.include('unable to update component');
      done();
    });
  });

  describe('remove src code cli command', () => {
    it('should not remove src code without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts removeSrcCode ' + token + ' ' + testImageName).toString();
      expect(output).to.include('unable to remove source code');
      done();
    });
  });

  describe('docker login cli command', () => {
    it('should not allow to login without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts dockerLogin ' + token + ' username password').toString();
      expect(output).to.include('Incorrect login and/or password');
      done();
    });
  });

  describe('login cli command', () => {
    it('should not allow to login without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts login username password').toString();
      expect(output).to.include('unable to login');
      done();
    });
  });

  describe('register cli command', () => {
    it('should not allow to register without a running instance of the node app', function(done) {
      this.timeout(10000);
      const output: string = child.execSync('ts-node src/cli.ts register username password').toString();
      expect(output).to.include('unable to register');
      done();
    });
  });

});