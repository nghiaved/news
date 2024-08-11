const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const db = require('../config/db')

exports.register = (req, res) => {
    const { username, password } = req.body

    if (!username || !password)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT id FROM users WHERE username = ?', [username],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length > 0)
                return res.status(400).json({ message: 'That username is already in use' })

            const hashedPassword = await bcrypt.hash(password, 8)
            db.query('INSERT INTO users SET ?', { ...req.body, password: hashedPassword },
                (error, results) => {
                    if (error)
                        return res.status(400).json(error)
                    else
                        return res.status(200).json({ message: 'User registered successfully' })
                })
        }
    )
}

exports.login = (req, res) => {
    const { username, password } = req.body

    if (!username || !password)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT * FROM users WHERE username = ?', [username],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: `User's not existed` })

            const isMatch = await bcrypt.compare(password, results[0].password)
            if (!isMatch)
                return res.status(400).json({ message: `Password incorrect` })

            const userInfo = results[0]
            delete userInfo.password
            const token = jwt.sign({ ...userInfo }, process.env.SECRET_KEY)
            return res.status(200).json({ token, message: 'User logged in successfully' })
        }
    )
}

exports.list = (req, res) => {
    const search = req.query.search
    if (!search)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        "SELECT id, username, firstName, lastName, image FROM users WHERE firstName LIKE ? OR lastName LIKE ? OR username LIKE ?",
        [`%${search}%`, `%${search}%`, `%${search}%`],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: 'No users found' })

            return res.status(200).json({ users: results })
        }
    )
}

exports.getInfo = (req, res) => {
    const username = req.params.username
    if (!username)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT * FROM users WHERE username = ?', [username],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: 'No users found' })

            const user = results[0]
            delete user.password
            return res.status(200).json({ user })
        }
    )
}

exports.updateInfo = (req, res) => {
    const id = req.query.id
    const { firstName, lastName, about, address, phone, email, image } = req.body

    if (!id)
        return res.status(400).json({ message: `Please complete all information` })

    if (!firstName || !lastName)
        return res.status(400).json({ message: `First and last name is required` })

    db.query(
        'SELECT id FROM users WHERE id = ?', [id],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: `User's not existed` })

            db.query('UPDATE users SET ? WHERE id = ?', [{ firstName, lastName, about, address, phone, email, image }, id],
                (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    db.query(
                        'SELECT * FROM users WHERE id = ?', [id],
                        async (error, results) => {
                            if (error)
                                return res.status(400).json(error)

                            const userInfo = results[0]
                            delete userInfo.password
                            const token = jwt.sign({ ...userInfo }, process.env.SECRET_KEY)
                            return res.status(200).json({ token, message: 'User updated successfully' })
                        }
                    )
                })
        }
    )
}

exports.deleteAccount = (req, res) => {
    const { id, username, password } = req.query

    if (!id || !username || !password)
        return res.status(400).json({ message: `Please complete all information` })

    db.query(
        'SELECT username, password FROM users WHERE id = ?', [id],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: `User's not existed` })

            if (results[0].username !== username)
                return res.status(400).json({ message: `Username is incorrect` })

            const isMatch = await bcrypt.compare(password, results[0].password)
            if (!isMatch)
                return res.status(400).json({ message: `Password is incorrect` })

            db.query(
                'DELETE FROM users WHERE id = ?', [id],
                async (error, results) => {
                    if (error)
                        return res.status(400).json(error)

                    return res.status(200).json({ message: 'User deleted successfully' })
                }
            )
        }
    )
}

exports.changePassword = (req, res) => {
    const id = req.query.id
    const { oldPassword, newPassword, renewPassword } = req.body

    if (!id || !oldPassword || !newPassword || !renewPassword)
        return res.status(400).json({ message: `Please complete all information` })

    if (newPassword !== renewPassword)
        return res.status(400).json({ message: `Re-enter the new password incorrectly` })

    db.query(
        'SELECT password FROM users WHERE id = ?', [id],
        async (error, results) => {
            if (error)
                return res.status(400).json(error)

            if (results.length === 0)
                return res.status(400).json({ message: `User's not existed` })

            const isMatch = await bcrypt.compare(oldPassword, results[0].password)
            if (!isMatch)
                return res.status(400).json({ message: `Password is incorrect` })

            const hashedPassword = await bcrypt.hash(newPassword, 8)

            db.query('UPDATE users SET ? WHERE id = ?', [{ password: hashedPassword }, id],
                (error, results) => {
                    if (error)
                        return res.status(400).json(error)
                    else
                        return res.status(200).json({ message: 'Changed password successfully' })
                })
        }
    )
}