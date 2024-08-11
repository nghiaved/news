const db = require('../config/db')
const { Buffer } = require('buffer')

exports.createPost = (req, res) => {
    const { status, author } = req.body
    const image = req.files?.image

    if (!status || !author)
        return res.status(400).json({ message: `Please complete all information` })

    let imagePath
    if (image) {
        const base64Image = Buffer.from(image.name + Date.now()).toString('base64')
        image.mv("./public/images/posts/" + base64Image)
        imagePath = process.env.SERVER + '/images/posts/' + base64Image
    }

    db.query('INSERT INTO posts SET ?', { status, author, image: imagePath },
        (error, results) => {
            if (error)
                return res.status(400).json(error)

            return res.status(200).json({ message: 'Post created successfully' })
        })
}

exports.getAllMyPosts = (req, res) => {
    const { author, page, limit } = req.query

    if (!author || !page || !limit)
        return res.status(400).json({ message: `Please complete all information` })

    db.query('SELECT count(*) FROM posts WHERE author = ?', [author],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results) {
                const totalData = results[0]['count(*)']
                const totalPage = Math.ceil(totalData / limit)

                db.query('SELECT * FROM posts WHERE author = ? ORDER BY createAt DESC LIMIT ? OFFSET ?',
                    [author, +limit, +((page - 1) * limit)],
                    async (error, results) => {
                        if (error)
                            return res.status(400).json(error)

                        if (results)
                            return res.status(200).json({ totalData, totalPage, page, limit, posts: results })
                    }
                )
            }
        }
    )
}

exports.getAllPosts = (req, res) => {
    const { page, limit } = req.query

    if (!page || !limit)
        return res.status(400).json({ message: `Please complete all information` })

    db.query('SELECT count(*) FROM posts',
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results) {
                const totalData = results[0]['count(*)']
                const totalPage = Math.ceil(totalData / limit)

                db.query('SELECT * FROM posts ORDER BY createAt DESC LIMIT ? OFFSET ?',
                    [+limit, +((page - 1) * limit)],
                    async (error, results) => {
                        if (error)
                            return res.status(400).json(error)

                        if (results)
                            return res.status(200).json({ totalData, totalPage, page, limit, posts: results })
                    }
                )
            }
        }
    )
}

exports.updatePost = (req, res) => {
    const { id } = req.body
    const image = req.files?.image

    if (!id)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT id, image FROM posts WHERE id = ?', [parseInt(id)],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: 'Post not found' })

            let data
            if (image) {
                if (results[0].image) {
                    const fs = require("fs")
                    try {
                        fs.unlinkSync(results[0].image.replace(process.env.SERVER, './public'))
                    } catch (error) {
                        console.log(error)
                    }
                }

                const base64Image = Buffer.from(image.name + Date.now()).toString('base64')
                const imagePath = process.env.SERVER + '/images/posts/' + base64Image
                image.mv("./public/images/posts/" + base64Image)
                data = { status: req.body.status, image: imagePath }
            } else {
                data = { status: req.body.status }
            }

            db.query('UPDATE posts SET ? WHERE id = ?', [data, id],
                (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    return res.status(200).json({ message: 'Post has been updated' })
                })
        }
    )
}

exports.deletePost = (req, res) => {
    const { id } = req.query

    if (!id)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT id, image FROM posts WHERE id = ?', [id],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: 'Post not found' })

            if (results[0].image) {
                const fs = require("fs")
                try {
                    fs.unlinkSync(results[0].image.replace(process.env.SERVER, './public'))
                } catch (error) {
                    console.log(error)
                }
            }

            db.query(
                'DELETE FROM posts WHERE id = ?', [id],
                async (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    return res.status(200).json({ message: 'Deleted post successfully' })
                }
            )
        }
    )
}
