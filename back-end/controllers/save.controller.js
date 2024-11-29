const db = require('../config/db')

exports.getAllSaves = (req, res) => {
    const { userId, type, page, limit } = req.query

    if (!userId || !type) return res.status(400).json({ message: `Please complete all information` })

    db.query('SELECT count(*) FROM saved_posts WHERE userId = ?', [+userId],
        async (error, results) => {
            if (error) return res.status(400).json(error)
            if (results) {
                const totalData = results[0]['count(*)']
                const totalPage = Math.ceil(totalData / limit)

                db.query(`SELECT * FROM posts 
                        INNER JOIN post_media ON posts.id = post_media.postId 
                        INNER JOIN saved_posts ON posts.id = saved_posts.postId 
                        ORDER BY createAt DESC LIMIT ? OFFSET ?`,
                    [+limit, +((page - 1) * limit)],
                    async (error, results) => {
                        if (error) return res.status(400).json(error)
                        const postsMap = {}
                        results.forEach(row => {
                            if (!postsMap[row.postId]) {
                                postsMap[row.postId] = {
                                    id: row.id,
                                    postId: row.postId,
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
                        return res.status(200).json({ totalData, totalPage, page, limit, saves: Object.values(postsMap) })
                    }
                )
            }
        }
    )
}

exports.createSave = (req, res) => {
    const { postId, userId, type } = req.body
    if (!postId || !userId || !type) return res.status(400).json({ message: `Please complete all information` })
    db.query('SELECT id FROM saved_posts WHERE postId = ? AND userId = ? AND type = ?', [postId, userId, type],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)
            if (results.length > 0) {
                return res.status(200).json({ message: 'Saved post before' })
            }
            db.query('INSERT INTO saved_posts SET ?', { postId, userId, type })
            return res.status(200).json({ message: 'Saved post successfully' })
        })
}

exports.deleteSave = (req, res) => {
    const { id } = req.query
    if (!id)
        return res.status(400).json({ message: `Please complete all information` })
    db.query('DELETE FROM saved_posts WHERE id = ?', [id])
    return res.status(200).json({ message: 'Deleted save successfully' })
}
