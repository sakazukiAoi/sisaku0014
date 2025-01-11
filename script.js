

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
                displayNextText();
            };
            reader.readAsText(file);
        }
    });
    input.click();
}

// テキストデータの処理
function processTextData(text) {
    return text.split(/\r?\n/).flatMap(line => {
        if (line.trim() === "") return []; // 空行は無視

        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) {
            return line.split(/\n/).map(narrationLine => ({ character: "", dialogue: narrationLine.trim() }));
        }

        const character = line.slice(0, colonIndex).trim();
        const dialogue = line.slice(colonIndex + 1).trim();
        return dialogue.split(/\n/).map(dialogueLine => ({ character, dialogue: dialogueLine.trim() }));
    });
}

// 次のテキストを1文字ずつ表示
const textDisplay = document.getElementById('text-display');
const nextButton = document.getElementById('next-button');
let textData = [];
let currentIndex = 0;
let charIndex = 0;
let isDisplayingText = false;

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

    // 既存のテキストエリアに新しい行を追加
    const textElement = document.createElement('p');
    textElement.style.fontFamily = characterSettings[currentLine.character]?.font || "serif";

    let { character, dialogue } = currentLine;

    if (character) {
        textElement.textContent = `${character}: `;
    }

    textDisplay.appendChild(textElement);

    charIndex = 0;
    isDisplayingText = true;

    // 1文字ずつ表示
    function showNextChar() {
        if (charIndex < dialogue.length) {
            textElement.textContent += dialogue[charIndex];
            charIndex++;

            // 7文字ごとにSEを再生
            if (charIndex % 7 === 0) {
                playCharacterSE(character);
            }

            // 句読点で少し間を開ける
            const delay = "、。！？….".includes(dialogue[charIndex - 1]) ? 300 : 50;
            setTimeout(showNextChar, delay);
        } else {
            currentIndex++;
            isDisplayingText = false;
        }
    }

    showNextChar();

    // 自動スクロール
    textDisplay.scrollTop = textDisplay.scrollHeight;
}

// 効果音を再生
function playCharacterSE(character) {
    if (!character) {
        const audio = new Audio(narrationSE);
        audio.play();
    } else if (characterSettings[character]?.se) {
        const audio = new Audio(characterSettings[character].se);
        audio.play();
    }
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
