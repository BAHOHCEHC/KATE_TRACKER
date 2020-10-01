// module.exports = {
//   mongoURI: 'mongodb+srv://ivan:ivan@clusterkatetasker-zkidh.mongodb.net/test?retryWrites=true&w=majority',
//   jwt: 'dev-jwt'
// }

if (process.env.NODE_ENV === 'production') {
	module.exports = require('./keys.prod.js');
} else {
	module.exports = require('./keys.dev.js');
}
