import { useState } from 'react'

const Blog = ({ blog, username, handleLike, handleRemove }) => {
    const [showComplete,setShowComplete] = useState(false)
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const shortView = (blog, showComplete,setShowComplete) => {
        return (
            <div className='shortView'>
                {blog.title} {blog.author}
                <button onClick={() => setShowComplete(!showComplete)}>
                view
                </button>
            </div>
        )
    }

    const longView = (blog, username, showComplete, setShowComplete) => {
        return(
            <div className='longView'>
                <p>
                    {blog.title} {blog.author}
                    <button onClick={() => setShowComplete(!showComplete)}>
                    hide
                    </button>
                </p>
                <p>
                    {blog.url}
                </p>
                <p>
                  likes {blog.likes} <button id="like-button" onClick={() => handleLike(blog, blog.likes)} >like</button>
                </p>
                <p>
                    {blog.user.name}

                </p>
                { username === blog.user.name ?
                    <p>
                        <button onClick={() => handleRemove(blog)}>
                        remove
                        </button>
                    </p>
                    : null
                }
            </div>
        )
    }
    return(
        <div style ={blogStyle} className="blog">
            {!showComplete ? shortView(blog, showComplete, setShowComplete) : longView(blog, username, showComplete, setShowComplete) }
        </div>
    )
}

export default Blog