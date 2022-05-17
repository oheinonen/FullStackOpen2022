const { max } = require('lodash');
var _ = require('lodash');

const dummy = (blogs) => {
    return 1
}
  
  
const totalLikes = (blogs) => {
    likes = 0
    blogs.forEach(blog => {
        likes += blog.likes
    });
    return likes
}

const favoriteBlog = (blogs) => {
    const blog = blogs.reduce((previousBlog,currentBlog) => previousBlog.likes >= currentBlog.likes ? previousBlog : currentBlog,
    blogs[0]
    )

    if(blog){
        const res = {
            title: blog.title,
            author: blog.author,
            likes: blog.likes
          
        }
        return res
    }
    else return null
}

const mostBlogs = (blogs) => {
    const blogs_per_author = _.countBy(blogs, (blog) => blog.author)
    var blogs_per_author_list = [];

    for(var i in blogs_per_author)
        blogs_per_author_list.push([i, blogs_per_author [i]]);

    most_blogs = blogs_per_author_list.reduce((previous, current) => previous.blogs >= current.blogs ? previous : current, 
    blogs_per_author_list[0]
    )

    if(blogs_per_author_list.length){
        const res = {
            author: most_blogs[0],
            blogs:most_blogs[1]
        }
        return res    
    }
    else return null
    
}

const mostLikes = (blogs) => {
    if(blogs.length){
        const blogs_likes_only = _.map(blogs, (blog) => {
            return {
                "author": blog.author,
                "likes": blog.likes
            }
            }
        )
        const blogs_author_total_likes = {}
        let author_most_likes = ""
        for(var blog of blogs_likes_only){
            if(blogs_author_total_likes.hasOwnProperty(blog.author)){
                blogs_author_total_likes[blog.author] += blog.likes
            }
            else {
                blogs_author_total_likes[blog.author] = blog.likes
            }
            
            if(blogs_author_total_likes.hasOwnProperty(author_most_likes)){
                if(blogs_author_total_likes[author_most_likes] < blogs_author_total_likes[blog.author]){
                    author_most_likes = blog.author
                }
            }
            else {
                author_most_likes = blog.author
                blogs_author_total_likes[author_most_likes] = blog.likes
            }

            
        }
        const res = {
            "author": author_most_likes,
            "likes" : blogs_author_total_likes[author_most_likes]
        }
        return res
        
    }
    else return null
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
     mostLikes
  }
