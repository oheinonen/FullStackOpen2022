import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> calls onSubmit with corret parameters', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()
    const { container } = render(<BlogForm createBlog={createBlog} />)
    const authorInput = container.querySelector('#author-input')
    const titleInput = container.querySelector('#title-input')
    const urlInput = container.querySelector('#url-input')
    const sendButton = screen.getByText('create')
    await user.type(authorInput, 'Test Author')
    await user.type(titleInput, 'Testing with Jest')
    await user.type(urlInput, 'test.com')
    await user.click(sendButton)
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
    expect(createBlog.mock.calls[0][0].title).toBe('Testing with Jest')
    expect(createBlog.mock.calls[0][0].url).toBe('test.com')
})
