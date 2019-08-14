import Sequelize, { Model } from 'sequelize';

class Files extends Model {
  // metodo chamado automaticamente pelo sequelize
  static init(sequelize) {
    // vou enviar via super apenas colunas que vou preencher, não id
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:4444/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Files;
