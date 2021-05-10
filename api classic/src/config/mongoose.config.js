const mongoose = require('mongoose');

// ==> Importar o arquivo: 'db.config.js'
const database = require('./db.config'); // ==> aqui é conexão local: MongoDB

mongoose.Promise = global.Promise;

// ==> Conexão Base de Dados:
mongoose.connect(database.local.localDatabaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(() => {
  console.log('A Base de Dados foi conectada com sucesso!');
}, (err) => {
  console.log(`Erro ao conectar com a Base de Dados...: ${err}`);
  process.exit();
});