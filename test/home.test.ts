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
 * jest test/home.test.ts --forceExit --runInBand --verbose false
 * ./node_modules/.bin/jest test/home.test.ts --forceExit --runInBand --verbose false
 */

export const home = () => {

  let cookie: any = null;

  beforeAll( async(done) => {
    
    let login = await request(app)
      .post("/api/v1/login")
      .field("email", "thanhthang20@gmail.com")
      .field("password", "123456")

    cookie = login.header["set-cookie"];
    done()
  });

  // it("get list character", async (done) => {

  //   let listDaddy = await request(app) 
  //   .get("/api/v1/daddy")
  //   .set("Cookie", cookie);

  //   console.log(listDaddy.body);

  //   done();
    
  // });

  // it("should update character", async (done) => {

  //   let update = await request(app)
  //     .post("/api/v1/character")
  //     .field("username", "thuyha")
  //     // .field("location", "HCM")
  //     // .field("education", "trung hoc")
  //     .attach('avatar', 'test/test_upload.jpg')
  //     .set("Cookie", cookie)

  //   console.log(update.body);

  //   done();
    
  // });

  it("should upload gallery", async (done) => {

    let update = await request(app)
      .post("/api/v1/gallery")
      .field("group", "private")
      // .field("location", "HCM")
      // .field("education", "trung hoc")
      .attach('photo', 'test/test_upload.jpg')
      .set("Cookie", cookie)

    console.log(update.body);

    done();
    
  });

  // it("should get character", async (done) => {

  //   let character = await request(app)
  //     .get("/api/v1/character")
  //     .set("Cookie", cookie)

  //   console.log(character.body);

  //   done();
    
  // });

};
