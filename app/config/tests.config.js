const server = require('../../index')
const supertest = require('supertest')
const requestWithSupertest = supertest(server)

module.exports = requestWithSupertest
