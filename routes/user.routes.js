
const { Router } = require("express")
const router = Router()
const db = require('../db');
const os = require('os');
var fs = require('fs');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })


router.post('/create', async (req, res) => {

	const { name, lastname, age } = req.body
	console.log("NEW USER", name, lastname, age)
	const newUser = await db.query(`INSERT INTO users (name,lastname,age) VALUES ($1,$2,$3) RETURNING *`, [name, lastname, age])


	res.status(201).json({ message: newUser })
})

router.get('/', async (req, res) => {

	const columns = []
	const rows = []

	columns.push({
		name: 'name',
		field: 'name',
		required: true,
		label: 'Имя',
		align: 'center',
		sortable: true
	})
	columns.push({
		name: 'lastname',
		field: 'lastname',
		required: true,
		label: 'Фамилия',
		align: 'center',
		sortable: true
	})
	columns.push({
		name: 'age',
		field: 'age',
		required: true,
		label: 'Возраст',
		align: 'center',
		sortable: true
	})

	const users = await db.query(`select * from users`)
	users.rows.forEach(user => {
		const row = {
			id: user.id,
			name: user.name,
			lastname: user.lastname,
			age: user.age,
			children: [
				{
					name: "Node 1.1",
					description: "Node 1.1 description",
					note: "Node 1.1 note",
				},
				{
					name: "Node 1.2",
					description: "Node 1.2 description",
					note: "Node 1.2 note",
					children: [
						{
							name: "Node 1.2.1",
							description: "Node 1.2.1 description",
							note: "Node 1.2.1 note",
						},
						{
							name: "Node 1.2.2",
							description: "Node 1.2.2 description",
							note: "Node 1.2.2 note",
						}
					],
				}
			],
		}
		rows.push(row)
	})


	res.status(201).json({ table: { columns, rows } })
})

module.exports = router
