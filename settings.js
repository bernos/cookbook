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
    './lib/user'    : '/user',
    './lib/auth'    : '/',
    './lib/recipes' : '/recipes'
  }
}