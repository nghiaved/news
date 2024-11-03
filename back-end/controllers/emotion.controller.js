const db = require('../config/db')

exports.getAllEmotions = (req, res) => {
    const { receiver } = req.query

    if (!receiver) return res.status(400).json({ message: `Please complete all information` })

    db.query(
        `SELECT emotions.*, users.firstName, users.lastName, users.image 
        FROM emotions INNER JOIN users
        ON emotions.sender = users.username 
        WHERE emotions.receiver = '${receiver}' AND emotions.isRead = 0`,
        async (error, emotions) => {
            if (error)
                return res.status(400).json(error)

            return res.status(200).json({ emotions })
        })
}

exports.readEmotion = (req, res) => {
    const { id, sender, receiver } = req.body

    if (!id || !sender || !receiver)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT id FROM emotions WHERE id = ? AND sender = ? AND receiver = ?', [id, sender, receiver],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: 'Not emotions found' })

            db.query('UPDATE emotions SET ? WHERE id = ? AND sender = ? AND receiver = ?', [{ isRead: 1 }, id, sender, receiver],
                (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    return res.status(200).json({ message: 'Emotion has been read' })
                })
        }
    )
}
