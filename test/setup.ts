import shell from "shelljs";
import moment from "moment";
import { Collection } from "mongodb";
const {MongoClient} = require("mongodb");

import * as database from "../src/database";
import {config} from "./config"
const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

beforeAll(async (done) => {
  const client = new MongoClient(config.dbServer.uri, connectOptions);
	let _userCol: Collection;
  let _characterCol: Collection;
  let _convCol: Collection;
  let _glrCol: Collection;

  try {
  	await client.connect();
  	let db = await client.db(config.dbServer.dbName);
  	console.log("connect to unit test DB Success");

  	_userCol = db.collection("user");
    _characterCol = db.collection("character");
    _convCol = db.collection("conv");
    _glrCol = db.collection("gallery");

	} catch (e) {
  	console.error(e);
	} 

	jest.spyOn(database, "userCol").mockImplementation(() => {
    return _userCol;
  });

  jest.spyOn(database, "characterCol").mockImplementation(() => {
    return _characterCol;
  });

  jest.spyOn(database, "convCol").mockImplementation(() => {
    return _convCol;
  });

  jest.spyOn(database, "glrCol").mockImplementation(() => {
    return _glrCol;
  });

  done();
});

afterAll(() => {
  shell.rm("-rf", "/tmp/*.pb3");
  shell.rm("-rf", `/tmp/${moment().format("YYYY-MM-DD-")}*`);
});
