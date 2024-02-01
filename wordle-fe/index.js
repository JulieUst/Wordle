const emptyState = "empty";
const tbdState = "tbd";
const presentState = "present";
const absentState = "absent";
const correctState = "correct";
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const serverUrl = "http://localhost:3000";
const codeLocalStorageKey = "wordle-code";
const baseTimeout = 250;

const setElementState = (elements, state) => elements.forEach(x => x.dataset.state = state);

window.onload = async _ => {
    const result = await (await fetch(`${serverUrl}/start`)).json();
    localStorage.setItem(codeLocalStorageKey, result.code);

    Array.from(document.querySelectorAll("div.key")).forEach(x => x.addEventListener("click", event => {
        document.body.dispatchEvent(new KeyboardEvent("keydown", { 'key': x.dataset.key }));
    }));
};

document.body.onkeydown = async e => {
    const insertedTiles = document.querySelectorAll(`div.tile[data-state="${tbdState}"]`);

    if (e.key === 'Enter' && insertedTiles.length === 5) {
        const code = localStorage.getItem(codeLocalStorageKey);
        const value = Array.from(insertedTiles).map(x => x.innerHTML).join("");
        const body = JSON.stringify({ code, value });

        const response = await fetch(`${serverUrl}/check`, {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();

        localStorage.setItem(codeLocalStorageKey, result.code);

        if (!result.exists) {
            insertedTiles[0].parentNode.dataset.animation = "shake";
            setTimeout(() => {
                insertedTiles[0].parentNode.dataset.animation = "idle";
            }, 600);
        }

        if (result.success || result.finished) {
            showDialog(result.success, result.success ? value : result.answer);
        }

        if (result.letters) {
            result.letters.forEach((x, i) => {
                const keyElement = document.querySelector(`div.key[data-key="${insertedTiles[i].innerHTML}"]`);


                setTimeout(() => {
                    insertedTiles[i].dataset.animation = "pop-in";
                }, i * baseTimeout);
                setTimeout(() => {
                    insertedTiles[i].dataset.animation = "flip-in";
                }, (i + 1) * baseTimeout);
                setTimeout(() => {
                    insertedTiles[i].dataset.animation = "flip-out";

                    if (x.correctLetter && x.correctPlace) setElementState([insertedTiles[i], keyElement], correctState);
                    else if (x.correctLetter && !x.correctPlace) setElementState([insertedTiles[i], keyElement], presentState);
                    else setElementState([insertedTiles[i], keyElement], absentState);
                }, (i + 2) * baseTimeout);
                setTimeout(() => {
                    insertedTiles[i].dataset.animation = "idle";
                }, (i + 3) * baseTimeout);
            });
        }
    }

    if (alphabet.includes(e.key.toLowerCase()) && insertedTiles.length !== 5) {
        const tile = document.querySelectorAll(`div.tile[data-state="${emptyState}"]`)[0];
        tile.dataset.state = tbdState;
        tile.innerHTML = e.key.toLowerCase();
    }

    if (e.key === "Backspace" || e.key === "Delete") {
        if (insertedTiles[insertedTiles.length - 1]) {
            insertedTiles[insertedTiles.length - 1].innerHTML = "";
            insertedTiles[insertedTiles.length - 1].dataset.state = emptyState;
        }
    }
};

const showDialog = (isWinner, answer) => {
    const dialog = document.createElement("dialog");
    const dialogHeader = document.createElement("h1");
    dialogHeader.innerText = isWinner ? "Congratulation!" : "Better luck next time!";
    const dialogBody = document.createElement("div");
    const dialogBodyText = document.createElement("p");
    dialogBodyText.innerText = `The answer is ${answer.toUpperCase()}`;
    const dialogBodyBtn = document.createElement("button");
    dialogBodyBtn.innerText = "close";
    dialogBodyBtn.addEventListener("click", () => {location.reload()});

    dialogBody.appendChild(dialogBodyText);
    dialogBody.appendChild(dialogBodyBtn);
    dialog.appendChild(dialogHeader);
    dialog.appendChild(dialogBody);
    
    document.body.appendChild(dialog);
    dialog.showModal();
};