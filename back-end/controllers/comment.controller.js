const db = require('../config/db')

exports.getAllComments = (req, res) => {
    const { id } = req.query

    if (!id) return res.status(400).json({ message: `Please complete all information` })

    db.query(
        `SELECT comments.*, users.id, users.username, users.firstName, users.lastName, users.image 
        FROM comments INNER JOIN users
        ON comments.sender = users.id 
        WHERE comments.id = ${id}`,
        async (error, comments) => {
            if (error)
                return res.status(400).json(error)

            return res.status(200).json({ comments })
        })
}

exports.sendComment = (req, res) => {
    const { id, sender, content } = req.body

    if (!id || !sender || !content)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        "SELECT * FROM `posts` WHERE id = ?", [id],
        async (error, posts) => {
            if (error)
                return res.status(400).json(error)

            if (posts.length === 0)
                return res.status(400).json({ message: 'No posts found' })

            db.query('INSERT INTO comments SET ?', { id, sender, content },
                async (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    await db.query('UPDATE posts SET ? WHERE id = ?', [{ totalComment: posts[0].totalComment + 1 }, id],
                        (err, results) => {
                            if (err)
                                return res.status(400).json(err)
                        })

                    return res.status(200).json({ message: 'Comment has been sent successfully' })
                }
            )
        }
    )
}