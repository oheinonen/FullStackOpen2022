const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { set } = require('lodash')
const blog = require('../models/blog')

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('psswrd', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('user creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'oheinonen',
      name: 'Oskari',
      password: 'tatti',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user creation fails with statuscode 400 and proper error message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Root Roottinen',
      password: 'katti',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user creation fails with statuscode 400 and proper error message if username is less than 4 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'roo',
      name: 'Roo Roottinen',
      password: 'patti',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username: Path `username` (`roo`) is shorter than the minimum allowed length (4).')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user creation fails with statuscode 400 and proper error message if password is less than 4 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'maikku',
      name: 'Maikku',
      password: 'pat',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 4 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('user creation fails with statuscode 400 and proper error message if username does not exist', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: '',
      name: 'Maikku',
      password: 'salapala',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username: Path `username` is required.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})



describe('when there is initially some blogs saved', () => {

  beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(helper.initialBlogs)
    })
    

  test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    

  test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have identifier "id"', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  let token = null

  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    const saltRounds = 10
    const passwordHash = await bcrypt.hash("salasana", saltRounds)
    const user = await new User({ username: "mikki", passwordHash }).save()
    const userForToken = { username: "mikki", id: user.id }
    token = jwt.sign(userForToken, process.env.SECRET)
  })

  test('a valid blog can be added if user is authorized', async () => {
      const newBlog = {
          title: "vAlId bLoG",
          author: "heinonos",
          url: "fullstackopen.com",
          likes: 25
      }
    
      await api
        .post('/api/blogs')
        .set("Authorization", `bearer ${token}` )
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const blogsAtEnd = await helper.blogsInDb()
    
      const titles = blogsAtEnd.map(blog => blog.title)
    
      expect(blogsAtEnd).toHaveLength(1)
      expect(titles).toContain(
        'vAlId bLoG'
      )
    })

    test('a valid blog without likes set has zero likes ', async () => {
      const newBlog = {
          title: "vAlId bLoG",
          author: "heinonos",
          url: "fullstackopen.com",
      }
    
      await api
        .post('/api/blogs')
        .set("Authorization", `bearer ${token}` )
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const blogsAtEnd = await helper.blogsInDb()

      const newBlog_res = blogsAtEnd.filter(blog => blog.title === newBlog.title)[0]
      expect(newBlog_res.likes).toBe(0)
    })

    test('blog without title is not added ', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
          author: "heinonos",
          url: "fullstackopen.com",
      }
    
      await api
        .post('/api/blogs')
        .set("Authorization", `bearer ${token}` )
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
      
    })

    test('blog without url is not added ', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
          title: "vAlId bLoG",
          author: "heinonos"
      }
    
      await api
        .post('/api/blogs')
        .set("Authorization", `bearer ${token}` )
        .send(newBlog)
        .expect(400)
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })
  })

  describe('deletion of a blog', () => {
      
    let token = null;
    beforeEach(async () => {
      await Blog.deleteMany({});
      await User.deleteMany({});
  
      const passwordHash = await bcrypt.hash("salasana", 10);
      const user = await new User({ username: "mikki", passwordHash }).save();
  
      const userForToken = { username: "mikki", id: user.id };
      token = jwt.sign(userForToken, process.env.SECRET);
      const newBlog = {
        title: "blabla blog",
        author: "mikki",
        url: "is.fi",
      };
  
      await api
        .post("/api/blogs")
        .set("Authorization", `bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);
      })


    test('fails if id is not valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const fakeId = 'fakeId'

      await api
        .delete(`/api/blogs/${fakeId}}`)
        .set("Authorization", `bearer ${token}` )
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        blogsAtStart.length
      )

    })

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `bearer ${token}` )
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        blogsAtStart.length - 1
      )

      const titles = blogsAtEnd.map(blog => blog.title)

      expect(titles).not.toContain(blogToDelete.title)
    })

    test('fails with status code 401 if user is unauthorized', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      token = null
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `bearer ${token}` )
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        blogsAtStart.length
      )

      const titles = blogsAtEnd.map(blog => blog.title)
      expect(titles).toContain(blogToDelete.title)
    })


  })

  describe('updating a blog', () => {
      
    beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(helper.initialBlogs)
    })


    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updated_blog = {
        likes: 14
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updated_blog)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
      )

      const res = blogsAtEnd.filter(blog => blog.title === blogToUpdate.title)[0]
      expect(res.likes).toBe(14)

    })
    test('fails if id is not valid', async () => {
      const fakeId = 'fakeId'
      const updated_blog = {
        likes: 14
      }

      await api
        .put(`/api/blogs/${fakeId}`)
        .send(updated_blog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
      )

    })

  })


afterAll(() => {
    mongoose.connection.close()
  })
