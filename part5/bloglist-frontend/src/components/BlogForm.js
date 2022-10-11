import PropTypes from 'prop-types'
import { useState } from 'react'


const BlogForm = ({ createBlog } ) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
    const handleAuthorChange = (event) => {
        setAuthor(event.target.value)
    }
    const handleUrlChange = (event) => {
        setUrl(event.target.value)
    }

    const addBlog = async (event) => {
        event.preventDefault()
        console.log('adding new blog with title' ,title)
        createBlog({
            title: title,
            author: author,
            url: url,
            likes: 0
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }


    return(
        <div className="formDiv" >
            <h3>Create new blog</h3>
            <form onSubmit={addBlog}>
                <div>
                  title:
                    <input
                        value={title}
                        name="Title"
                        onChange={handleTitleChange}
                        id="title-input"
                    />
                </div>
                <div>
                    author:
                    <input
                        value={author}
                        name="Author"
                        onChange={handleAuthorChange}
                        id="author-input"
                    />
                </div>
                <div>
                    url:
                    <input
                        value={url}
                        name="Url"
                        onChange={handleUrlChange}
                        id ="url-input"
                    />
                </div>

                <button type="submit" id="create-button">create</button>
            </form>
        </div>)}

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default BlogForm