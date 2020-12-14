require("dotenv").config();

const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  db = require("./models");

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

app.get(
  "/v1/customer/partners/:partner_id/merchant-integrations/:merchant_id",
  async (req, res) => {
    const { partner_id, merchant_id } = req.params;
    try {
      //get merchant
      let merchant = await db.Merchant.findOne({});
      if (merchant) {
        console.log('Found one merchant')
        return res.json(merchant);
      }

      // if no merchant found, insert one to db
      const m = new db.Merchant({
        merchant_id: merchant_id,
        tracking_id: "10058574-490f3efd6aca4cefa64f0cc3866a4936",
        products: [
          {
            name: "MOBILE_PAYMENT_ACCEPTANCE",
            status: "ACTIVE",
          },
        ],
        payments_receivable: true,
        primary_email: "sb-s1uac4062835@business.example.com",
        primary_email_confirmed: true,
        oauth_integrations: [
          {
            integration_type: "OAUTH_THIRD_PARTY",
            integration_method: "PAYPAL",
            oauth_third_party: [
              {
                partner_client_id: "abcxyz",
                merchant_client_id: "xyzabc",
                scopes: [
                  "https://uri.paypal.com/services/payments/realtimepayment",
                  "https://uri.paypal.com/services/payments/refund",
                  "https://uri.paypal.com/services/customer/merchant-integrations/read",
                  "https://uri.paypal.com/services/disputes/update-seller",
                  "https://uri.paypal.com/services/payments/payment/authcapture",
                  "https://uri.paypal.com/services/disputes/read-seller",
                  "https://uri.paypal.com/services/shipping/trackers/readwrite",
                ],
              },
            ],
          },
        ],
        primary_currency: "USD",
        country: "US",
      })
      merchant = await m.save()
      console.log('Saved merchant, id: ', merchant._id)
      res.json(merchant)
    } catch (err) {
      res.status(500).send(err);
    }
  }
);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
