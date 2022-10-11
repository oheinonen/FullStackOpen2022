describe('Blog app',  function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'Testi käyttäjä',
            username: 'testikayttaja',
            password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)

        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
        cy.contains('login').click()
    })

    describe('Login',function() {
        it('succeeds with correct credentials', function() {
            cy.contains('login').click()
            cy.get('#username').type('testikayttaja')
            cy.get('#password').type('salainen')
            cy.get('#login-button').click()
            cy.contains('Testi käyttäjä logged in')
        })

        it('fails with wrong credentials', function() {
            cy.contains('login').click()
            cy.get('#username').type('testi')
            cy.get('#password').type('lasainen')
            cy.get('#login-button').click()
            cy.contains('wrong credentials')

        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'testikayttaja', password: 'salainen' })
            cy.createBlog({
                title: 'Initial blog',
                author: 'testikayttaja',
                url: 'google.com',
                likes:0
            })
            cy.createBlog({
                title: 'Blog with most likes',
                author: 'testikayttaja',
                url: 'google.com',
                likes: 2
            })

        })

        it('A blog can be created', function() {
            cy.contains('create new blog').click()
            cy.get('#title-input').type('Blog from cypress')
            cy.get('#author-input').type('Testi käyttäjä')
            cy.get('#url-input').type('fullstackopen.com')
            cy.get('#create-button').click()
            cy.contains('Blog from cypress')
        })

        it('A blog can be liked', function() {
            cy.contains('view').click()
                .get('#like-button').click()
            cy.contains('likes 3')
        })

        it('Own blog can be deleted', function() {
            cy.contains('view').click()
            cy.contains('remove').click()
            cy.contains('Blog with most likes').should('not.exist')
        })

        it('Blogs on display are sorted based on their likes', function () {
            cy.get('.blog').eq(0).should('contain', 'Blog with most likes')
            cy.get('.blog').eq(1).should('contain', 'Initial blog')
        })

        it('Adding likes can change the order', function () {
            cy.contains('Initial blog')
                .contains('view').click()
                .get('#like-button').click()
                .get('#like-button').click()
                .get('#like-button').click()
            cy.get('.blog').eq(0).should('contain', 'Initial blog')
            cy.get('.blog').eq(1).should('contain', 'Blog with most likes')
        })

    })
})

