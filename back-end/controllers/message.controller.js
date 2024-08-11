const db = require('../config/db')

exports.getAllMessages = (req, res) => {
    const { id, user } = req.query

    if (!id)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(`SELECT * FROM messages WHERE id = ?`, [id],
        async (error, messages) => {
            if (error)
                return res.status(400).json(error)

            if (messages[messages.length - 1]?.sender !== parseInt(user))
                await db.query('UPDATE messages SET ? WHERE id = ? AND isRead = 0', [{ isRead: true }, id],
                    (err, results) => {
                        if (err)
                            return res.status(400).json(err)
                    })

            return res.status(200).json({ messages })
        })
}

exports.sendMessage = (req, res) => {
    const { id, sender, receiver, content } = req.body

    if (!id || !sender || !receiver || !content)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        "SELECT * FROM `conversations` WHERE id = ? AND user1 = ? AND user2 = ? OR user1 = ? AND user2 = ?",
        [id, sender, receiver, receiver, sender],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: 'No conversations found' })

            db.query('INSERT INTO messages SET ?', { id, sender, receiver, content },
                (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    return res.status(200).json({ message: 'Message has been sent successfully' })
                }
            )
        }
    )
}