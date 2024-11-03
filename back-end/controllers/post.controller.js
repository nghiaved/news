const db = require('../config/db')
const { Buffer } = require('buffer')

exports.createPost = (req, res) => {
    const { status, author, hashtags } = req.body
    const image = req.files?.image
    const image2 = req.files?.image2
    const image3 = req.files?.image3
    const image4 = req.files?.image4

    if (!status || !author || !hashtags)
        return res.status(400).json({ message: `Please complete all information` })

    let imagePath
    if (image) {
        const base64Image = Buffer.from(image.name + Date.now()).toString('base64')
        image.mv("./public/images/posts/" + base64Image)
        imagePath = process.env.SERVER + '/images/posts/' + base64Image
    }
    let imagePath2
    if (image2) {
        const base64Image2 = Buffer.from(image2.name + Date.now()).toString('base64')
        image2.mv("./public/images/posts/" + base64Image2)
        imagePath2 = process.env.SERVER + '/images/posts/' + base64Image2
    }
    let imagePath3
    if (image3) {
        const base64Image3 = Buffer.from(image3.name + Date.now()).toString('base64')
        image3.mv("./public/images/posts/" + base64Image3)
        imagePath3 = process.env.SERVER + '/images/posts/' + base64Image3
    }
    let imagePath4
    if (image4) {
        const base64Image4 = Buffer.from(image4.name + Date.now()).toString('base64')
        image4.mv("./public/images/posts/" + base64Image4)
        imagePath4 = process.env.SERVER + '/images/posts/' + base64Image4
    }

    db.query('INSERT INTO posts SET ?', {
        status, author, hashtags, image: imagePath,
        image2: imagePath2, image3: imagePath3, image4: imagePath4
    }, (error, results) => {
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
    const { page, limit, hashtag } = req.query

    if (!page || !limit)
        return res.status(400).json({ message: `Please complete all information` })

    db.query('SELECT count(*) FROM posts',
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results) {
                const totalData = results[0]['count(*)']
                const totalPage = Math.ceil(totalData / limit)

                db.query('SELECT * FROM posts WHERE hashtags LIKE ? ORDER BY createAt DESC LIMIT ? OFFSET ?',
                    [`%${hashtag}%`, +limit, +((page - 1) * limit)],
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
    const image2 = req.files?.image2
    const image3 = req.files?.image3
    const image4 = req.files?.image4

    if (!id)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT id, image FROM posts WHERE id = ?', [parseInt(id)],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: 'Post not found' })

            let data = { status: req.body.status, hashtags: req.body.hashtags }
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
                data.image = imagePath
            }
            if (image2) {
                if (results[0].image2) {
                    const fs = require("fs")
                    try {
                        fs.unlinkSync(results[0].image2.replace(process.env.SERVER, './public'))
                    } catch (error) {
                        console.log(error)
                    }
                }
                const base64Image = Buffer.from(image2.name + Date.now()).toString('base64')
                const imagePath = process.env.SERVER + '/images/posts/' + base64Image
                image2.mv("./public/images/posts/" + base64Image)
                data.image2 = imagePath
            }
            if (image3) {
                if (results[0].image3) {
                    const fs = require("fs")
                    try {
                        fs.unlinkSync(results[0].image3.replace(process.env.SERVER, './public'))
                    } catch (error) {
                        console.log(error)
                    }
                }
                const base64Image = Buffer.from(image3.name + Date.now()).toString('base64')
                const imagePath = process.env.SERVER + '/images/posts/' + base64Image
                image3.mv("./public/images/posts/" + base64Image)
                data.image3 = imagePath
            }
            if (image4) {
                if (results[0].image4) {
                    const fs = require("fs")
                    try {
                        fs.unlinkSync(results[0].image4.replace(process.env.SERVER, './public'))
                    } catch (error) {
                        console.log(error)
                    }
                }
                const base64Image = Buffer.from(image4.name + Date.now()).toString('base64')
                const imagePath = process.env.SERVER + '/images/posts/' + base64Image
                image4.mv("./public/images/posts/" + base64Image)
                data.image4 = imagePath
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
            if (results[0].image2) {
                const fs = require("fs")
                try {
                    fs.unlinkSync(results[0].image2.replace(process.env.SERVER, './public'))
                } catch (error) {
                    console.log(error)
                }
            }
            if (results[0].image3) {
                const fs = require("fs")
                try {
                    fs.unlinkSync(results[0].image3.replace(process.env.SERVER, './public'))
                } catch (error) {
                    console.log(error)
                }
            }
            if (results[0].image4) {
                const fs = require("fs")
                try {
                    fs.unlinkSync(results[0].image4.replace(process.env.SERVER, './public'))
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

exports.addViewPost = (req, res) => {
    const { id } = req.body

    if (!id)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT id, totalView FROM posts WHERE id = ?', [parseInt(id)],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: 'Post not found' })

            db.query('UPDATE posts SET ? WHERE id = ?', [{ totalView: results[0].totalView + 1 }, id],
                (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    return res.status(200).json({ message: 'Post has been updated totalView' })
                })
        }
    )
}

exports.addLikePost = (req, res) => {
    const { id, sender, receiver } = req.body

    if (!id || !sender || !receiver)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT id, totalLike FROM posts WHERE id = ?', [parseInt(id)],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: 'Post not found' })

            db.query('UPDATE posts SET ? WHERE id = ?',
                [{ totalLike: results[0].totalLike + 1 }, id],
                (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    db.query(
                        "SELECT * FROM `emotions` WHERE id = ? AND sender = ? AND receiver = ?", [id, sender, receiver],
                        async (error, emotions) => {
                            if (error)
                                return res.status(400).json(error)

                            if (emotions.length === 0) {
                                db.query('INSERT INTO emotions SET ?', { id, sender, receiver, totalLike: 1, isRead: 0 },
                                    async (error, results) => {
                                        if (error)
                                            return res.status(400).json(error)
                                        return res.status(200).json({ message: 'Emotions has been created successfully' })
                                    }
                                )
                            } else {
                                db.query('UPDATE emotions SET ? WHERE id = ? AND sender = ? AND receiver = ?',
                                    [{ totalLike: emotions[0].totalLike + 1, isRead: 0 }, id, sender, receiver],
                                    (err, results) => {
                                        if (err)
                                            return res.status(400).json(err)
                                        return res.status(200).json({ message: 'Emotions has been updated successfully' })
                                    })
                            }
                        }
                    )
                })
        }
    )
}

exports.addDislikePost = (req, res) => {
    const { id, sender, receiver } = req.body

    if (!id || !sender || !receiver)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT id, totalDislike FROM posts WHERE id = ?', [parseInt(id)],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: 'Post not found' })

            db.query('UPDATE posts SET ? WHERE id = ?',
                [{ totalDislike: results[0].totalDislike + 1 }, id],
                (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    db.query(
                        "SELECT * FROM `emotions` WHERE id = ? AND sender = ? AND receiver = ?", [id, sender, receiver],
                        async (error, emotions) => {
                            if (error)
                                return res.status(400).json(error)

                            if (emotions.length === 0) {
                                db.query('INSERT INTO emotions SET ?', { id, sender, receiver, totalDislike: 1, isRead: 0 },
                                    async (error, results) => {
                                        if (error)
                                            return res.status(400).json(error)
                                        return res.status(200).json({ message: 'Emotions has been created successfully' })
                                    }
                                )
                            } else {
                                db.query('UPDATE emotions SET ? WHERE id = ? AND sender = ? AND receiver = ?',
                                    [{ totalDislike: emotions[0].totalDislike + 1, isRead: 0 }, id, sender, receiver],
                                    (err, results) => {
                                        if (err)
                                            return res.status(400).json(err)
                                        return res.status(200).json({ message: 'Emotions has been updated successfully' })
                                    })
                            }
                        }
                    )
                })
        }
    )
}
