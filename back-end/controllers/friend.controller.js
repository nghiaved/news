const db = require('../config/db')

exports.getFriend = (req, res) => {
    const { username, friendUsername } = req.query

    if (!username || !friendUsername)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT * FROM friends  WHERE username = ? and friendUsername = ?  OR username = ? and friendUsername = ?',
        [username, friendUsername, friendUsername, username],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results)
                return res.status(200).json({ friend: results[0] })
        })
}

exports.getListFriends = (req, res) => {
    const { username } = req.query

    if (!username)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        `SELECT users.* FROM users 
        WHERE username IN ( SELECT friendUsername FROM friends WHERE username = '${username}' AND status = 1) 
        OR username IN ( SELECT username FROM friends WHERE friendUsername = '${username}' AND status = 1)`,
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results)
                return res.status(200).json({ friends: results })
        })
}

exports.getListRequests = (req, res) => {
    const { username } = req.query

    if (!username)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        `SELECT users.*, friends.createAt, friends.id FROM users INNER JOIN friends
        ON friends.username = users.username AND friends.friendUsername = '${username}' WHERE users.username
        IN (SELECT friends.username FROM friends WHERE friends.friendUsername = '${username}' AND friends.status = 0)`,
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results)
                return res.status(200).json({ friends: results })
        })
}

exports.sendRequest = (req, res) => {
    const { username, friendUsername } = req.body

    if (!username || !friendUsername)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT id FROM users WHERE username = ? OR username = ?', [username, friendUsername],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length !== 2)
                return res.status(400).json({ message: 'No users found' })

            db.query(
                'SELECT id FROM friends  WHERE username = ? and friendUsername = ?  OR username = ? and friendUsername = ?',
                [username, friendUsername, friendUsername, username],
                async (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    if (results.length > 0)
                        return res.status(400).json({ message: `Please wait for your friend's response` })

                    db.query('INSERT INTO friends SET ?', { username, friendUsername, status: false, sender: username },
                        (error, results) => {
                            if (error)
                                return res.status(400).json(error)

                            return res.status(200).json({ message: 'Friend request has been sent successfully' })
                        }
                    )
                }
            )
        }
    )
}

exports.acceptRequest = (req, res) => {
    const { id } = req.query

    if (!id)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT id FROM friends WHERE id = ?', [id],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: 'Friend request not found' })

            db.query('UPDATE friends SET ? WHERE id = ?', [{ status: true }, id],
                (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    return res.status(200).json({ message: 'Friend request has been accepted' })
                })
        }
    )
}

exports.deleteFriend = (req, res) => {
    const { id } = req.query

    if (!id)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT id FROM friends WHERE id = ?', [id],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: 'No friendships found' })

            db.query(
                'DELETE FROM friends WHERE id = ?', [id],
                async (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    return res.status(200).json({ message: 'Deleted friendship successfully' })
                }
            )
        }
    )
}