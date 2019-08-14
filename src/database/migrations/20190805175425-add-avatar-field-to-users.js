module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users', // tabela
      'avatar_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' }, // criando chave esrtangeira, (model, FK)
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
