const { allWordsObj, nytWords } = require("./data");
const { CryptoService } = require("./crypto-service");

class GameService {
    static initGame() {
        const guessWord = this.#getRandomWord();
        console.log(guessWord);
    
        return { code: CryptoService.encrypt(`${guessWord}0`) };
    };

    static checkAttempt(currentCode, currenValue) {
        const decrypted = CryptoService.decrypt(currentCode);
        const answer = decrypted.slice(0, -1);
        const attempt = parseInt(decrypted.slice(-1));
        const nextCode = CryptoService.encrypt(`${answer}${attempt + 1}`);
        const success = currenValue === answer;
        const exists = !!allWordsObj[currenValue];
    
        if (attempt > 4) return this.#getResult({ code: nextCode, success, exists, finished: true, answer });
    
        if (!exists) return this.#getResult({ code: currentCode, success, exists });
    
        return this.#getResult({ code: nextCode, success, exists, letters: this.#getLettersResult(currenValue, answer) });
    };


    static #getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    static #getRandomWord() {
        return nytWords[this.#getRandomInt(nytWords.length)];
    }

    static #getResult({ code, success = false, exists = false, finished = false, answer = null, letters = null }) {
        return { code, success, exists, finished, answer, letters };
    }

    static #getLettersResult(value, answer) {
        return Array.from(value).map((x, i) => {
            if (x === answer[i]) return { correctLetter: true, correctPlace: true };

            for (let j = 0; j < answer.length; j++) {
                if (x === answer[j] && value[j] !== answer[j]) return { correctLetter: true, correctPlace: false };
            }

            return { correctLetter: false, correctPlace: false };
        });
    }
}

module.exports = {
    GameService
};