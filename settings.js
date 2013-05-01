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

  apps: {
    './lib/auth'    : '/',
    './lib/user'    : '/user',
    './lib/recipes' : '/recipes'
  }
}