import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
    let container
    let blog
    let mockHandler

    beforeEach(() => {
        blog = {
            author: 'Test Author',
            title: 'Testing with Jest',
            url: 'test.com',
            user: 'Test Author'
        }
        mockHandler = jest.fn()
        container = render(<Blog blog={blog} handleLike={mockHandler} />).container
    })

    test('renders content', () => {
        const div = container.querySelector('.shortView')
        expect(div).toHaveTextContent(
            'Testing with Jest Test Author'
        )
    })

    test('at start the likes and url are not shown', () => {
        let element = screen.queryByText('likes')
        expect(element).toBeNull()
        element = screen.queryByText('url')
        expect(element).toBeNull()

    })

    test('clicking view button shows url and likes too', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)
        const div = container.querySelector('.longView')
        expect(div).toHaveTextContent('likes')
        expect(div).toHaveTextContent('test.com')
    })

    test('clicking like button twice calls event handler twice', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)
        const likeButton = screen.getByText('like')
        await user.click(likeButton)
        await user.click(likeButton)
        expect(mockHandler.mock.calls).toHaveLength(2)
    })

})