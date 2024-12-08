const db = require('../config/db')
const { Buffer } = require('buffer')

exports.createPost = (req, res) => {
    const { status, author, hashtags } = req.body
    const image = req.files?.image
    const image2 = req.files?.image2
    const image3 = req.files?.image3
    const image4 = req.files?.image4
    const video = req.files?.video

    if (!status || !author || !hashtags)
        return res.status(400).json({ message: `Please complete all information` })

    db.query('INSERT INTO posts SET ?', {
        status, author, hashtags
    }, (error, results) => {
        if (error)
            return res.status(400).json(error)
        if (image) {
            const base64Image = Buffer.from(image.name + Date.now()).toString('base64')
            image.mv("./public/images/posts/" + base64Image)
            const imagePath = process.env.SERVER + '/images/posts/' + base64Image
            db.query('INSERT INTO post_media SET ?', {
                postId: results.insertId,
                mediaType: 'image',
                mediaUrl: imagePath,
            })
        }
        if (image2) {
            const base64Image2 = Buffer.from(image2.name + Date.now()).toString('base64')
            image2.mv("./public/images/posts/" + base64Image2)
            const imagePath2 = process.env.SERVER + '/images/posts/' + base64Image2
            db.query('INSERT INTO post_media SET ?', {
                postId: results.insertId,
                mediaType: 'image2',
                mediaUrl: imagePath2,
            })
        }
        if (image3) {
            const base64Image3 = Buffer.from(image3.name + Date.now()).toString('base64')
            image3.mv("./public/images/posts/" + base64Image3)
            const imagePath3 = process.env.SERVER + '/images/posts/' + base64Image3
            db.query('INSERT INTO post_media SET ?', {
                postId: results.insertId,
                mediaType: 'image3',
                mediaUrl: imagePath3,
            })
        }
        if (image4) {
            const base64Image4 = Buffer.from(image4.name + Date.now()).toString('base64')
            image4.mv("./public/images/posts/" + base64Image4)
            const imagePath4 = process.env.SERVER + '/images/posts/' + base64Image4
            db.query('INSERT INTO post_media SET ?', {
                postId: results.insertId,
                mediaType: 'image4',
                mediaUrl: imagePath4,
            })
        }
        if (video) {
            const base64Video = Buffer.from(video.name + Date.now()).toString('base64')
            video.mv("./public/images/posts/" + base64Video)
            const videoPath = process.env.SERVER + '/images/posts/' + base64Video
            db.query('INSERT INTO post_media SET ?', {
                postId: results.insertId,
                mediaType: 'video',
                mediaUrl: videoPath,
            })
        }
        return res.status(200).json({ message: 'Post created successfully' })
    })
}
exports.getHomePosts = (req, res) => {
    const { page, limit, hashtag } = req.query

    if (!page || !limit)
        return res.status(400).json({ message: `Please complete all information` })

    db.query('SELECT count(*) FROM posts WHERE status_post = ?', ['accepted'],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results) {
                const totalData = results[0]['count(*)']
                const totalPage = Math.ceil(totalData / limit)

                db.query(`SELECT posts.id, posts.author, posts.createAt, posts.status, posts.status_post,
                    posts.totalComment, posts.totalView, posts.totalLike, posts.totalDislike,
                    posts.hashtags, post_media.postId, post_media.mediaType, post_media.mediaUrl
                    FROM posts LEFT JOIN post_media ON posts.id = post_media.postId 
                    WHERE hashtags LIKE ? AND status_post = ? ORDER BY createAt DESC LIMIT ? OFFSET ?`,
                    [`%${hashtag}%`, 'accepted', +limit, +((page - 1) * limit)],
                    async (error, results) => {
                        if (error)
                            return res.status(400).json(error)
                        const postsMap = {}
                        results.forEach(row => {
                            if (!postsMap[row.id]) {
                                postsMap[row.id] = {
                                    id: row.id,
                                    author: row.author,
                                    createAt: row.createAt,
                                    status: row.status,
                                    totalComment: row.totalComment,
                                    totalView: row.totalView,
                                    totalLike: row.totalLike,
                                    totalDislike: row.totalDislike,
                                    hashtags: row.hashtags,
                                }
                            }
                            if (row.postId) {
                                postsMap[row.postId][row.mediaType] = row.mediaUrl
                            }
                        })
                        return res.status(200).json({ totalData, totalPage, page, limit, posts: Object.values(postsMap) })
                    }
                )
            }
        }
    )
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

                db.query(`SELECT posts.id, posts.author, posts.createAt, posts.status, posts.status_post,
                    posts.totalComment, posts.totalView, posts.totalLike, posts.totalDislike,
                    posts.hashtags, post_media.postId, post_media.mediaType, post_media.mediaUrl
                    FROM posts LEFT JOIN post_media ON posts.id = post_media.postId 
                    WHERE author = ? ORDER BY createAt DESC LIMIT ? OFFSET ?`,
                    [author, +limit, +((page - 1) * limit)],
                    async (error, results) => {
                        if (error)
                            return res.status(400).json(error)
                        const postsMap = {}
                        results.forEach(row => {
                            if (!postsMap[row.id]) {
                                postsMap[row.id] = {
                                    id: row.id,
                                    author: row.author,
                                    createAt: row.createAt,
                                    status: row.status,
                                    totalComment: row.totalComment,
                                    totalView: row.totalView,
                                    totalLike: row.totalLike,
                                    totalDislike: row.totalDislike,
                                    hashtags: row.hashtags,
                                    status_post: row.status_post,
                                }
                            }
                            if (row.postId) {
                                postsMap[row.postId][row.mediaType] = row.mediaUrl
                            }
                        })
                        return res.status(200).json({ totalData, totalPage, page, limit, posts: Object.values(postsMap) })
                    }
                )
            }
        }
    )
}

exports.getAllPosts = (req, res) => {
    const { page, limit, status_post } = req.query

    if (!page || !limit)
        return res.status(400).json({ message: `Please complete all information` })

    db.query('SELECT count(*) FROM posts',
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results) {
                const totalData = results[0]['count(*)']
                const totalPage = Math.ceil(totalData / limit)

                db.query(`SELECT posts.id, posts.author, posts.createAt, posts.status, posts.status_post,
                    posts.totalComment, posts.totalView, posts.totalLike, posts.totalDislike,
                    posts.hashtags, post_media.postId, post_media.mediaType, post_media.mediaUrl
                    FROM posts LEFT JOIN post_media ON posts.id = post_media.postId 
                    WHERE status_post LIKE '%${status_post}%' ORDER BY createAt DESC LIMIT ? OFFSET ?`,
                    [+limit, +((page - 1) * limit)],
                    async (error, results) => {
                        if (error)
                            return res.status(400).json(error)
                        const postsMap = {}
                        results.forEach(row => {
                            if (!postsMap[row.id]) {
                                postsMap[row.id] = {
                                    id: row.id,
                                    author: row.author,
                                    createAt: row.createAt,
                                    status: row.status,
                                    totalComment: row.totalComment,
                                    totalView: row.totalView,
                                    totalLike: row.totalLike,
                                    totalDislike: row.totalDislike,
                                    hashtags: row.hashtags,
                                    status_post: row.status_post,
                                }
                            }
                            if (row.postId) {
                                postsMap[row.postId][row.mediaType] = row.mediaUrl
                            }
                        })
                        return res.status(200).json({ totalData, totalPage, page, limit, posts: Object.values(postsMap) })
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
    const video = req.files?.video

    if (!id)
        return res.status(400).json({ message: `Please complete all information` })

    db.query('UPDATE posts SET ? WHERE id = ?', [{ status: req.body.status, hashtags: req.body.hashtags }, id])

    if (image) {
        db.query(
            'SELECT * FROM post_media WHERE postId = ? AND mediaType = ?', [id, 'image'],
            async (_, results) => {
                if (results.length > 0) {
                    const fs = require("fs")
                    try {
                        fs.unlinkSync(results[0].mediaUrl.replace(process.env.SERVER, './public'))
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        )
        const base64Image = Buffer.from(image.name + Date.now()).toString('base64')
        image.mv("./public/images/posts/" + base64Image)
        const imagePath = process.env.SERVER + '/images/posts/' + base64Image
        db.query('INSERT INTO post_media SET ?', {
            postId: id,
            mediaType: 'image',
            mediaUrl: imagePath,
        })
    }
    if (image2) {
        db.query(
            'SELECT * FROM post_media WHERE postId = ? AND mediaType = ?', [id, 'image2'],
            async (_, results) => {
                if (results.length > 0) {
                    const fs = require("fs")
                    try {
                        fs.unlinkSync(results[0].mediaUrl.replace(process.env.SERVER, './public'))
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        )
        const base64Image = Buffer.from(image2.name + Date.now()).toString('base64')
        image2.mv("./public/images/posts/" + base64Image)
        const imagePath = process.env.SERVER + '/images/posts/' + base64Image
        db.query('INSERT INTO post_media SET ?', {
            postId: id,
            mediaType: 'image2',
            mediaUrl: imagePath,
        })
    }
    if (image3) {
        db.query(
            'SELECT * FROM post_media WHERE postId = ? AND mediaType = ?', [id, 'image3'],
            async (_, results) => {
                if (results.length > 0) {
                    const fs = require("fs")
                    try {
                        fs.unlinkSync(results[0].mediaUrl.replace(process.env.SERVER, './public'))
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        )
        const base64Image = Buffer.from(image3.name + Date.now()).toString('base64')
        image3.mv("./public/images/posts/" + base64Image)
        const imagePath = process.env.SERVER + '/images/posts/' + base64Image
        db.query('INSERT INTO post_media SET ?', {
            postId: id,
            mediaType: 'image3',
            mediaUrl: imagePath,
        })
    }
    if (image4) {
        db.query(
            'SELECT * FROM post_media WHERE postId = ? AND mediaType = ?', [id, 'image4'],
            async (_, results) => {
                if (results.length > 0) {
                    const fs = require("fs")
                    try {
                        fs.unlinkSync(results[0].mediaUrl.replace(process.env.SERVER, './public'))
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        )
        const base64Image = Buffer.from(image4.name + Date.now()).toString('base64')
        image4.mv("./public/images/posts/" + base64Image)
        const imagePath = process.env.SERVER + '/images/posts/' + base64Image
        db.query('INSERT INTO post_media SET ?', {
            postId: id,
            mediaType: 'image4',
            mediaUrl: imagePath,
        })
    }
    if (video) {
        db.query(
            'SELECT * FROM post_media WHERE postId = ? AND mediaType = ?', [id, 'video'],
            async (_, results) => {
                if (results.length > 0) {
                    const fs = require("fs")
                    try {
                        fs.unlinkSync(results[0].mediaUrl.replace(process.env.SERVER, './public'))
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        )
        const base64Image = Buffer.from(video.name + Date.now()).toString('base64')
        video.mv("./public/images/posts/" + base64Image)
        const imagePath = process.env.SERVER + '/images/posts/' + base64Image
        db.query('INSERT INTO post_media SET ?', {
            postId: id,
            mediaType: 'video',
            mediaUrl: imagePath,
        })
    }

    return res.status(200).json({ message: 'Post has been updated' })
}

exports.deletePost = (req, res) => {
    const { id } = req.query

    if (!id)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT * FROM post_media WHERE postId = ?', [id],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)
            results.map(item => {
                const fs = require("fs")
                try {
                    fs.unlinkSync(item.mediaUrl.replace(process.env.SERVER, './public'))
                } catch (error) {
                    console.log(error)
                }
            })
            db.query('DELETE FROM post_media WHERE postId = ?', [id])
            db.query('DELETE FROM posts WHERE id = ?', [id])
            return res.status(200).json({ message: 'Deleted post successfully' })
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

exports.updateStatusPost = (req, res) => {
    const { id, status_post } = req.body

    if (!id)
        return res.status(400).json({ message: `Please complete all information` })

    db.query('UPDATE posts SET ? WHERE id = ?', [{ status_post }, id])

    return res.status(200).json({ message: 'Status post has been updated' })
}
