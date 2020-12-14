# paypal-pcp-proxy-api
## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/dreamtheater2195/paypal-pcp-proxy-api # or clone your own fork
$ cd paypal-pcp-proxy-api
$ npm install
$ cp .env.example .env # may you need to update `MONGODB_URI`
$ npm start # or `heroku local`, If you used heroku already
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)