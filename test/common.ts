process.env.NODE_ENV = "test";

import "mocha";
import * as Task from "../models/task";

const express = require("../config/express")();

export const request = require("supertest")(express);

export const chai = require("chai");
export const should = chai.should();

export const cleanCollections = (): Promise<any> => {
    const cleanUp = [
        Task.cleanCollection()
        // Add more
    ];
    return Promise.all(cleanUp);
};
