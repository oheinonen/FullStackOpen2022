const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')


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

  beforeEach(async () => {
    await Blog.deleteMany({})
  })


  test('a valid blog can be added ', async () => {
      const newBlog = {
          title: "vAlId bLoG",
          author: "heinonos",
          url: "fullstackopen.com",
          likes: 25,
      }
    
      await api
        .post('/api/blogs')
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
        .send(newBlog)
        .expect(400)
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })
  })

  describe('deletion of a blog', () => {
      
    beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(helper.initialBlogs)
    })


    test('fails if id is not valid', async () => {
      const fakeId = 'fakeId'

      await api
        .delete(`/api/blogs/${fakeId}}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
      )

    })

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(blog => blog.title)

      expect(titles).not.toContain(blogToDelete.content)
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
