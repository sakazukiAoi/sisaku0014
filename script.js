
// キャラクターごとのフォントとSE設定
const characterSettings = {
    "AG": { font: "'Zen Maru Gothic', serif", se: "se/AG.mp3" },
    "フォス": { font: "'Zen Kurenaido', serif", se: "se/フォス.mp3" },
    "エレーナ": { font: "'Kiwi Maru', serif", se: "se/エレーナ.mp3" }
};

// ナレーション時の効果音設定
const narrationSE = "se/narration.mp3";

// 外部テキストファイルを読み込み
function loadTextFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                textData = processTextData(text);
                currentIndex = 0;
            };
            reader.readAsText(file);
        }
    });
    input.click();
}

// テキストデータの処理
function processTextData(text) {
    return text.split(/\r?\n/).flatMap(line => {
        if (line.trim() === "") return [];

        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) {
            return line.split(/\n/).map(narrationLine => ({ character: "ナレーション", dialogue: narrationLine.trim() }));
        }

        const character = line.slice(0, colonIndex).trim();
        const dialogue = line.slice(colonIndex + 1).trim();
        return dialogue.split(/\n/).map(dialogueLine => ({ character, dialogue: dialogueLine.trim() }));
    });
}

// テキスト表示処理の部分を変更
function displayLine(lineData) {
    const textArea = document.getElementById("text-display");
    const nameArea = document.getElementById("name-display");

    if (lineData.character === "ナレーション") {
        nameArea.textContent = "";
        displayTextOneCharAtATime(lineData.dialogue);
    } else {
        nameArea.textContent = lineData.character;
        displayTextOneCharAtATime(lineData.dialogue);
    }
}

// テキストを表示する要素とボタン
const textDisplay = document.getElementById('text-display');
const nextButton = document.getElementById('next-button');

// テキスト表示用の変数
let textData = [];
let currentIndex = 0;
let charIndex = 0;
let isDisplayingText = false;

// 次のテキストを1文字ずつ表示
function displayNextText() {
    if (isDisplayingText) return;

    if (textData.length === 0) {
        loadTextFile();
        return;
    }

    if (currentIndex >= textData.length) {
        showResetOptions();
        return;
    }

    const currentLine = textData[currentIndex];
    const textElement = document.createElement('p');
    textElement.style.fontFamily = characterSettings[currentLine.character]?.font || "Serif";

    let character = '';
    let dialogue = '';

    if (typeof currentLine === 'string') {
        dialogue = currentLine;
        playNarrationSE();
    } else {
        ({ character, dialogue } = currentLine);
        textElement.textContent = `${character}: `;
    }

    textDisplay.appendChild(textElement);
    charIndex = 0;
    isDisplayingText = true;

    // 1文字ずつ表示
    function showNextChar() {
        if (charIndex < dialogue.length) {
            const char = dialogue[charIndex];
            textElement.textContent += char;
            charIndex++;

            // 5文字ごとにSEを再生
            if (charIndex % 5 === 0) {
                playCharacterSE(character);
            }

            // 「、」「。」の後に少し間を空ける
            if (char === "、" || char === "。") {
                clearTimeout(textInterval);
                setTimeout(showNextChar, 300); // 300msの間を空ける
            } else {
                textInterval = setTimeout(showNextChar, 50);
            }
        } else {
            currentIndex++;
            isDisplayingText = false;
        }
    }

    let textInterval = setTimeout(showNextChar, 50);
}

// 効果音を再生
function playCharacterSE(character) {
    if (character && characterSettings[character]) {
        const audio = new Audio(characterSettings[character].se);
        audio.play();
    }
}

function playNarrationSE() {
    const audio = new Audio(narrationSE);
    audio.play();
}

// リセット処理の選択肢を表示
function showResetOptions() {
    const choice = confirm('最初から始めますか？「キャンセル」を選択すると、別のテキストを読み込みます。');
    if (choice) {
        resetDisplay();
    } else {
        textData = [];
        loadTextFile();
    }
}

// 表示をリセット
function resetDisplay() {
    textDisplay.innerHTML = '';
    currentIndex = 0;
    displayNextText();
}

// イベントリスナー
nextButton.addEventListener('click', displayNextText);
