class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // TODO Create another method, getUserInfo (different base url)

  getAppInfo() {
    // TODO Call getUserInfo in this array
    return Promise.all([this.getInitialCards()]);
  }

  getInitialCards() {
    console.log(`${this._baseUrl}/cards`);
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error: ${res.status}`);
    });
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {});
  }
}

export default Api;
