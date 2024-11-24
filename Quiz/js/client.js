import { config } from "./config.js";
const { SERVER_API } = config;

export const client = {
  send: async function (url, method = "GET", body = null) {
    url = `${SERVER_API}${url}`;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    const data = await response.json();

    return { response, data };
  },

  //http get
  get: function (url) {
    return this.send(url);
  },
  //http post
  post: function (url, body) {
    return this.send(url, "POST", body);
  },
  //http put
  put: function (url, body) {
    return this.send(url, "PUT", body);
  },
  //http patch
  patch: function (url, body) {
    return this.send(url, "PATCH", body);
  },
  //http delete
  delete: function (url) {
    return this.send(url, "DELETE");
  },
};
