require('dotenv').config()
const mongoose = require('mongoose')
const io = require('./socs')
const app = require('./app.js')
const server = require('http').createServer(app)
const port = process.env.PORT || 3002;
const DB_URI = process.env.LOCALURI

const db = mongoose.connection
mongoose.connect(DB_URI , {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

db.once('open', async () => {
	console.log(`Database running.`)
});

io.attach(server)

server.listen(port, () => console.log('Server started successfully on port ' + port))
