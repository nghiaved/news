const db = require('../config/db')

exports.getConversation = (req, res) => {
    const { user1, user2 } = req.query

    if (!user1 || !user2)
        return res.status(400).json({ message: `Please complete all information` })

    db.query('SELECT * FROM `conversations` WHERE user1 = ? AND user2 = ? OR user1 = ? AND user2 = ?',
        [user1, user2, user2, user1],
        (error, results) => {
            if (error)
                return res.status(400).json(error)

            return res.status(200).json({ conversation: results[0] })
        })
}

exports.getAllConversations = (req, res) => {
    const { user } = req.query

    if (!user)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(`SELECT users.* FROM users 
    WHERE id IN ( SELECT user1 FROM conversations WHERE user2 = ${user} ) 
    OR id IN ( SELECT user2 FROM conversations WHERE user1 = ${user} )`,
        (error, users) => {
            if (error)
                return res.status(400).json(error)

            const conversations = []
            users.map(item => {
                db.query(`SELECT * FROM messages WHERE sender = ? AND receiver = ? OR sender = ? AND receiver = ?
                            ORDER BY createAt DESC LIMIT 1`, [user, item.id, item.id, user],
                    (err, message) => {
                        if (err)
                            return res.status(400).json(err)

                        conversations.push({ ...item, latestMessage: message[0] })

                        if (conversations.length === users.length)
                            return res.status(200).json({ conversations })
                    })
            })
        })
}

exports.createConversation = (req, res) => {
    const { user1, user2 } = req.body

    if (!user1 || !user2)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        "SELECT * FROM `conversations` WHERE user1 = ? AND user2 = ? OR user1 = ? AND user2 = ?",
        [user1, user2, user2, user1],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length !== 0)
                return res.status(400).json({ message: `Conversation's existed` })

            db.query('INSERT INTO conversations SET ?', { user1, user2 },
                (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    return res.status(200).json({ message: 'Conversation created successfully' })
                }
            )
        }
    )
}