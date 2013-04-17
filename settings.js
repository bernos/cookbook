module.exports = {
  propOne: "HELLO",

  /**
   * Database (sequelize) settings
   */
  db: {
    database: 'recipes',
    username: 'root',
    password: null,
    options: {

    }
  },

  modules: [
    'example'
  ]
}