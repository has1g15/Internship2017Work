var expect  = require('chai').expect;
var assert  = require('chai').assert;
var request = require('request');

process.env.NODE_ENV = 'dev';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../expressapp.js');
let should = chai.should();

chai.use(chaiHttp);

  /*
  * Test the create /POST route
  */
  describe('/POST user', () => {
      it('should POST a user ', (done) => {
        let user = {
            Username: "postUser",
            Course: "BScCompSci",
            Email: "postUser@mailinator.com",
            Mobile: "07567123890"
        }
        chai.request(server)
            .post('https://we8imx60ad.execute-api.us-east-2.amazonaws.com/dev/userdao')  //use API Gateway URL
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.user.should.have.property('Username');
                res.body.user.should.have.property('Course');
                res.body.user.should.have.property('Email');
                res.body.user.should.have.property('Mobile');
              done();
            });
      });
  });
/*
it('Main page content', function() {
    request('http://localhost:8081' , function(error, response, body) {
        
    });
});

it('Create users content', function() {
    request('http://localhost:8081/createusers' , function(error, response, body) {
        
    });
});

it('About page content', function() {
    request('http://localhost:8080/about' , function(error, response, body) {
        
    });
});*/