import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  // metodo chamado automaticamente pelo sequelize
  static init(sequelize) {
    // vou enviar via super apenas colunas que vou preencher, não id
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // criando relacionamentos
  static associate(models) {
    this.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Users, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
