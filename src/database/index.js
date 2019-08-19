import Sequelize from 'sequelize';
import mongoose from 'mongoose';

// imporando todos os meus models
import User from '../app/models/Users';
import Files from '../app/models/Files';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

// registrando models
const models = [User, Files, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    // pegando o array de models declarados acima da class,
    // vamos jogar a conexao em cada um deles.
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      { useNewUrlParser: true, useFindAndModify: true }
    );
  }
}

export default new Database();
