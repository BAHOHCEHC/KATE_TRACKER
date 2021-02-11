const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const clientsRoutes = require('./routes/clients');
const taskRoutes = require('./routes/task');
const archiveRoutes = require('./routes/archivedTasks');
const statisticRoutes = require('./routes/statistic');

const keys = require('./config/keys');
const app = express();

mongoose
	.connect(keys.mongoURI, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => console.log('MongoDB connected.'))
	.catch((error) => console.log(error));

// использование стратегий доступа
app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true })); // парсит данные из запроса
app.use(bodyParser.json()); //генериит js объекты из json-a
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/statistic', statisticRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/archive', archiveRoutes);



if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/dist/client'));
	app.get('*', (req, res) => {
		res.sendFile(
			path.resolve(__dirname, 'client', 'dist', 'client', 'index.html')
		);
	});
}

module.exports = app;
