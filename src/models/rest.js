const axios = require("axios").default;

const prod_rest = "";
const dev_rest = "http://localhost:3000";

class Rest {
  constructor() {
    (this._token = ""), (this.isLogged = false);
  }

  get getToken() {
    return this._token;
  }

  _isLogged() {
    if (this.isLogged === false) {
      return false;
    }
    return true;
  }

  /**
   * @param {String} username
   * @param {String} password
   * @param {String} email
   */
  async login(username, password, email) {
    const res = await axios({
      method: "post",
      baseURL: `${dev_rest}/api/auth/login`,
      data: { name: username, password: password, email: email },
    });
    if (res.status >= 400 && res.status <= 500) {
      return (
        "La petición es inválida",
        {
          ok: false,
          status: res.status,
          errors: res.data.param || "N/A",
        }
      );
    } else if (res.status >= 500) {
      return (
        "Hubo un error al intentar realizar la petición",
        {
          ok: false,
          status: res.status,
        }
      );
    } else if (res.status >= 200 && res.status <= 300) {
      this._token = res.data.token;
      this.isLogged = true;
      return {
        ok: true,
        token: this._token,
      };
    } else {
      return "???";
    }
  }

  /**
   * @param {Number} from
   * @param {Number} limit
   * @param {String} filter
   */
  async getMessages(from = 0, limit = 15, filter = "") {
    let baseURL;
    if (!filter) {
      baseURL = `${dev_rest}/api/messages/?limit=${limit}&from=${from}`;
    } else
      baseURL = `${dev_rest}/api/messages/?limit=${limit}&from=${from}&filter=${filter}`;

    let instance = axios.create({
      baseURL: baseURL,
    });

    const res = await instance.get();
    try {
      res;
    } catch (err) {
      console.log(err);
    }

    return { total: res.data.total, messages: res.data.messages };
  }

  /**
   * @param {String} username
   * @param {Number} id
   * @param {String} message
   */
  async postMessage(username, id, message) {
    if (!this._isLogged()) {
      throw new Error("Primero debe iniciar sesión en el REST");
    }

    const req = await axios({
      baseURL: `${dev_rest}/api/messages/`,
      method: "post",
      headers: {
        "x-token": this._token,
      },
      data: {
        username: username,
        id: Number(id),
        message: message,
      },
    });

    try {
      req;
    } catch (err) {
      console.log("Ha ocurrido un error inesperado");
    }

    console.log(req.data);
  }

  async deleteMessages(limit = 100, from = 0) {
    const res = await axios({
      baseURL: `${dev_rest}/api/messages/?limit=${limit}&from=${from}`,
      method: "delete",
      headers: {
        "x-token": this._token,
      },
    });

    console.log(res.data);
  }
}

module.exports = Rest;
