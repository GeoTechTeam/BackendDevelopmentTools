const express = require('express')
var cors = require('cors')
const path = __dirname + "/dist/";

const app = express()
app.use(express.static(path))
app.use(express.urlencoded())
app.use(cors())
app.use(express.json({ extended: true }))

app.use('/api/excel', require('./routes/excel.routes'))
app.use('/api/user', require('./routes/user.routes'))
app.use('/api/data', require('./routes/data.routes'))
const PORT = 5000

app.get('/',function(req,res){
	res.sendFile(path + "index.html")
})

async function start() {

	try {
		app.listen(PORT, () => console.log(`App has been started at port ${PORT}...`));
	}
	catch (e) {
		console.log("Server error", e.message)
		process.exit(1)
	}
}

start()
