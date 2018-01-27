process.env.NODE_ENV = "test";

import "mocha";

import express from '../src/config/app'
export const request = require("supertest")(express);


export const chai = require("chai");
export const should = chai.should();
