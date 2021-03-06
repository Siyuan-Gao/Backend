const request = require('supertest');
const server = require('./server');
const Users = require('../helpers/users-model');
const db = require('../data/dbConfig');

describe('server.js', () => {
  beforeEach(async () => {
    await db('users').truncate(); 
  })
 
  describe('POST /auth/register', () => {
    it('add a user to the database', async () => {
      const users = await db('users');
      expect(users).toHaveLength(0);
      await Users.add({
        username: 'Arash12345',
        password: 'helper',
        email: 'helper@sky.com',
        phone_number: '1234567891'
      })
      const newUsers = await db('users');
      expect(newUsers).toHaveLength(1);
    })
    it('check added user', async () => {
      const users = await db('users');
      expect(users).toHaveLength(0);
      await Users.add({
        username: 'ashley1234',
        password: 'smashley',
        email: 'smach@ashley.com',
        phone_number: '1234567891'
      })
    })
    it('201', () => {
      return request(server).post('/api/auth/register')
        .send({
          username: 'livonia',
          password: 'livvonia',
          email: 'livonia@maple.com',
          phone_number: '2483804900'
        })
        .expect(201);
    })
  })

  //LOGIN
  
  describe('POST /api/auth/login', () => {
    it('return JSON', async () => {
      return request(server).post('/api/auth/login')
        .then(res => {
          expect(res.type).toMatch(/json/i)
        })
    })
    it('200', async () => {
      res = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'maple',
          password: 'getit',
          email: 'getit@maple.com',
          phone_number: '98933212345'
        });
      expect(res.status).toEqual(201);
      res = await request(server)
        .post('/api/auth/login')
        .send({
          username: 'maple',
          password: 'getit'
        });
      expect(res.status).toEqual(200);
    })
  })
  
  //GET USERS
 
  describe('GET /users', () => {
    it('404', () => {
      return request(server).get('/api/users')
        .then(res => {
          expect(res.status).toBe(404);
        })
    })
    it('return JSON', async () => {
      return request(server).get('/api/users')
        .then(res => {
          expect(res.type).toMatch(/json/i)
        })
    })
    it('list of users on successful login with token', async () => {
      res = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'maple',
          password: 'getit',
          email: 'getit@maple.com',
          phone_number: '98933212345'
        });
      expect(res.status).toEqual(201);
      res = await request(server)
        .post('/api/auth/login')
        .send({
          username: 'maple',
          password: 'getit',
          email: 'getit@maple.com',
          phone_number: '98933212345'
        });
      expect(res.status).toEqual(200);
      const token = res.body.token;
      expect(token.length).toBeGreaterThan(20);
      res = await request(server)
        .get('/api/users')
        .set({ authorization: token, Accept: 'application/json' });
      expect(res.body).toBeInstanceOf(Array);
      expect(res.status).toBe(200);
    })
  })
  
  //GET USER BY ID
 
  describe('GET /users/:id', () => {
    it('404', () => {
      return request(server).get('/api/users/1')
        .then(res => {
          expect(res.status).toBe(404);
        })
    })
    it('specific user on successful login with token', async () => {
      res = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'maple',
          password: 'getit',
          email: 'getit@maple.com',
          phone_number: '98933212345'
        });
      expect(res.status).toEqual(201);
      res = await request(server)
        .post('/api/auth/login')
        .send({
          username: 'maple',
          password: 'getit',
          email: 'getit@maple.com',
          phone_number: '98933212345'
        });
      expect(res.status).toEqual(200);
      const token = res.body.token;
      expect(token.length).toBeGreaterThan(20);
      res = await request(server)
        .get('/api/users/1')
        .set({ authorization: token, Accept: 'application/json' });
      expect(res.body).toBeInstanceOf(Object);
      expect(res.status).toBe(200);
    })
  })

  //GET PLANTS
  
  describe('GET /plants', () => {
    it('404', () => {
      return request(server).get('/api/plants')
        .then(res => {
          expect(res.status).toBe(404);
        })
    })
    it('return JSON', async () => {
      return request(server).get('/api/plants')
        .then(res => {
          expect(res.type).toMatch(/json/i)
        })
    })
    it('list of plants on successful login with token', async () => {
      res = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'maple',
          password: 'getit',
          email: 'getit@maple.com',
          phone_number: '98933212345'
        });
      expect(res.status).toEqual(201);
      res = await request(server)
        .post('/api/auth/login')
        .send({
          username: 'maple',
          password: 'getit',
          email: 'getit@maple.com',
          phone_number: '98933212345'
        });
      expect(res.status).toEqual(200);
      const token = res.body.token;
      expect(token.length).toBeGreaterThan(20);
      res = await request(server)
        .get('/api/plants')
        .set({ authorization: token, Accept: 'application/json' });
      expect(res.body).toBeInstanceOf(Array);
      expect(res.status).toBe(200);
    })
  })
})

//USER MODEL TESTS

describe('users model', function () {
  beforeEach(async () => {
    await db('users').truncate();
  })

  describe('find()', function () {
    it('GET list of all users from the database', async function () {
      const users = await db('users');
      expect(users).toHaveLength(0);
      await Users.add({
        username: 'head',
        password: 'battle',
        email: 'head@ink.com',
        phone_number: '4445111411'
      });
      await Users.add({
        username: 'man',
        password: 'eating',
        email: 'man@ink.com',
        phone_number: '1111111111'
      });
      await Users.add({
        username: 'king',
        password: 'dontmess',
        email: 'king@ink.com',
        phone_number: '5555555555'
      });
      const newusers = await db('users');
      expect(newusers).toHaveLength(3);
      expect(users).not.toBeNull();
    })
  })
  describe('findById(id)', function () {
    it('Check if the user has an id', async function () {
      await Users.add({
        username: 'head',
        password: 'battle',
        email: 'head@ink.com',
        phone_number: '4445111411'
      });
      const user = await db('users');
      expect(user[0]).toHaveProperty('id');
    })
    it('Check if the user has the correct id', async function () {
      await Users.add({
        username: 'head',
        password: 'battle',
        email: 'head@ink.com',
        phone_number: '4445111411'
      });
      const newUser = await db('users');
      await Users.myUserId(newUser[0].id);
      expect(newUser[0]).toHaveProperty('id', 1);
    })
  })
  describe('add(user)', function () {
    it('POST the new user to the database', async function () {
      const users = await db('users');
      expect(users).toHaveLength(0);
      await Users.add({
        username: 'knight',
        password: 'slurpy',
        email: 'knight@city.com',
        phone_number: '7344346876'
      });
      const newUser = await db('users');
      expect(newUser).toHaveLength(1);
    })
  })
  describe('update(id, changes)', function () {
    it('UPDATE the username from the database', async function () {
      await Users.add({
        username: 'hello',
        password: 'helloworld',
        email: 'hello@world.com',
        phone_number: '1234578845'
      })
      const newUsers = await db('users');
      const changes = { username: 'risk' }
      await Users.update(newUsers[0].id, changes);
      const updatedUser = await db('users');
      expect(updatedUser[0]).toHaveProperty('username', 'risk');
    })
  })

  describe('remove(id)', function () {
    it('DELETE a user from the database', async function () {
      const users = await db('users');
      expect(users).toHaveLength(0);
      await Users.add({
        username: 'hello',
        password: 'helloworld',
        email: 'hello@world.com',
        phone_number: '1234578845'
      })
      const newUsers = await db('users');
      expect(newUsers).toHaveLength(1);
      await Users.remove(newUsers[0].id);
      const updatedDB = await db('users');
      expect(updatedDB).toHaveLength(0);
    })
  })
})

