module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'admin',
  database: 'dbgobarber',
  port: '5435',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
