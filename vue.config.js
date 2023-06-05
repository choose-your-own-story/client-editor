module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
	  allowedHosts: [
		'localhost'
	  ]
  },
  publicPath: process.env.VUE_APP_PUBLIC_PATH
}
