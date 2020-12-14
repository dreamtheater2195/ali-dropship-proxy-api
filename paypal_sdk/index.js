const axios = require("axios");

const getAccessToken = () => {
  return axios({
    url: "https://api.sandbox.paypal.com/v1/oauth2/token",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": "en_US",
      "content-type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: process.env.CLIENT_ID,
      password: process.env.CLIENT_SECRET,
    },
    params: {
      grant_type: "client_credentials",
    },
  });
};

const getMerchantIntegration = (partner_id, merchant_id) => {
  return axios({
    url: `https://api.sandbox.paypal.com/v1/customer/partners/${partner_id}/merchant-integrations/${merchant_id}`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
    auth: {
      username: process.env.CLIENT_ID,
      password: process.env.CLIENT_SECRET,
    },
  });
};

module.exports = {
  getAccessToken,
  getMerchantIntegration
}
