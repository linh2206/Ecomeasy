import request from "supertest";
import app from "../src/app";
import axios from "axios";
import faker from "faker";
import _ from "lodash";
import chai from "chai";
import MockAdapter from "axios-mock-adapter";
import moment from "moment";

const { expect } = require("chai");
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);

const axiosMock = new MockAdapter(axios);

/**
 * To test this file only
 * 
 * jest test/authentication.test.ts --forceExit --runInBand --verbose false
 * ./node_modules/.bin/jest test/authentication.test.ts --forceExit --runInBand --verbose false
 */


export const authentication = () => {

  beforeEach(() => {

  });

  // it("should register then get list character", async (done) => {

  //   let cookie = null;
  //   let register = await request(app)
  //     .post("/api/v1/register")
  //     .field("email", "thanhthang20@gmail.com")
  //     .field("password", "123456")
  //     .field("role", "daddy");

  //   let register2 = await request(app)
  //     .post("/api/v1/register")
  //     .field("email", "huntmast2013@gmail.com")
  //     .field("password", "123456")
  //     .field("role", "baby");

  //   cookie = register2.header["set-cookie"];
    
	 // 	let listDaddy = await request(app) 
	 //  .get("/api/v1/daddy")
	 //  .set("Cookie", cookie);

	 //  console.log(listDaddy.body);

	 //  done();
	  
  // });

  it("should login then get list character", async (done) => {

    let cookie = null;
    let login = await request(app)
      .post("/api/v1/login")
      .field("email", "thanhthang20@gmail.com")
      .field("password", "123456")

    cookie = login.header["set-cookie"];
    
    let listDaddy = await request(app) 
    .get("/api/v1/daddy")
    .set("Cookie", cookie);

    console.log(listDaddy.body);

    done();
    
  });

};
