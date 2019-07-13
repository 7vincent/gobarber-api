import Sequelize from 'sequelize';

// imporando todos os meus models
import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    // pegando o array de models declarados acima da class,
    // vamos jogar a conexao em cada um deles.
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
