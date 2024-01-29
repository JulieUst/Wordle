const CryptoJS = require("crypto-js");
const secret = "wordle-secret";

class CryptoService {
    static #secret = "wordle-secret";

    static encrypt(value) {
        return CryptoJS.AES.encrypt(value, this.#secret).toString();
    }

    static decrypt(value) {
        return CryptoJS.AES.decrypt(value, this.#secret).toString(CryptoJS.enc.Utf8);
    }
}



module.exports = {
    CryptoService
};