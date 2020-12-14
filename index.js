require("dotenv").config();

const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  db = require("./models");

const { getMerchantIntegration, getAccessToken } = require("./paypal_sdk");

// create express app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ==== DB connect ====
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.error(err));

// ==== Routers ====
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Paypal Proxy API." });
});

// proxy get access token
app.post('/v1/oauth2/token', async (req, res) => {
  try {
    const response = await getAccessToken()
    return res.json(response.data)
  } catch (error) {
    handleError(error, res)
  }
})

// proxy get merchant integration
app.get(
  "/v1/customer/partners/:partner_id/merchant-integrations/:merchant_id",
  async (req, res) => {
    const { partner_id, merchant_id } = req.params;
    try {
      if (process.env.PROXY_ONLY === "true") {
        console.log('PROXY_ONLY = true, get Merchant directly from Paypal')
        const response = await getMerchantIntegration(partner_id, merchant_id);
        return res.json(response.data);
      }

      // get from db
      let merchant = await db.Merchant.findOne({ merchant_id });
      if (merchant) {
        console.log('PROXY_ONLY = false, return Merchant from MongoDB')
        return res.json(merchant);
      }
      const response = await getMerchantIntegration(partner_id, merchant_id);

      // save to db for later request
      merchant = new db.Merchant(response.data);
      savedMerchant = await merchant.save();

      console.log('PROXY_ONLY = false, get Merchant from PayPal then save to MongoDB')
      res.json(merchant);
    } catch (error) {
      handleError(error, res)
    }
  }
);

const handleError = (error, res) => {
  if (error.response) {
    return res.status(error.response.status).send(error.response.data);
  }
  if (error.request) {
    return res.status(404).send(error.request);
  }
  if (error.message) {
    return res.status(404).send(error.message);
  }
  return res.status(500).send(error);
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
