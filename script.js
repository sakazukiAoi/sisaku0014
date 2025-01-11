// キャラクターごとのフォントとSE設定
const characterSettings = {
    "AG": { font: "Arial", se: "se/AG.mp3" },
    "フォス": { font: "Georgia", se: "se/フォス.mp3" },
    "エレーナ": { font: "Comic Sans MS", se: "se/エレーナ.mp3" }
};

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
//                alert('テキストがロードされました。次へボタンを押して表示してください。');
            };
            reader.readAsText(file);
        }
    });
    input.click();
}

// テキストデータの処理
function processTextData(text) {
    return text.split(/\r?\n/).map(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return line.trim();
        const character = line.slice(0, colonIndex).trim();
        const dialogue = line.slice(colonIndex + 1).trim();
        return { character, dialogue };
    });
}

// テキストを表示する要素とボタン
const textDisplay = document.getElementById('text-display');
const nextButton = document.getElementById('next-button');

// テキスト表示用の変数
let textData = [];
let currentIndex = 0;

// 次のテキストを表示
function displayNextText() {
    if (textData.length === 0) {
        loadTextFile();
        return;
    }

    // リセット処理の選択
    if (currentIndex >= textData.length) {
        showResetOptions();
        return;
    }

    const currentLine = textData[currentIndex];
    const textElement = document.createElement('p');

    if (typeof currentLine === 'string') {
        textElement.textContent = currentLine;
        textElement.style.fontFamily = "Serif";
    } else {
        const { character, dialogue } = currentLine;
        textElement.textContent = `${character}: ${dialogue}`;

        if (characterSettings[character]) {
            textElement.style.fontFamily = characterSettings[character].font;
            const audio = new Audio(characterSettings[character].se);
            audio.play();
        }
    }

    textElement.classList.add('fade-in');
    textDisplay.appendChild(textElement);
    textDisplay.scrollTop = textDisplay.scrollHeight;

    currentIndex++;
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
