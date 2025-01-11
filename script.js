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
                currentIndex = 0; // 初期化
                alert('テキストがロードされました。次へボタンを押して表示してください。');
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
        if (colonIndex === -1) return line.trim(); // ナレーション行
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
        loadTextFile(); // 初回クリック時にファイル選択ダイアログを表示
        return;
    }

    // リセット処理
    if (currentIndex >= textData.length) {
        resetDisplay();
        return;
    }

    const currentLine = textData[currentIndex];
    const textElement = document.createElement('p');

    if (typeof currentLine === 'string') {
        // ナレーション行
        textElement.textContent = currentLine;
        textElement.style.fontFamily = "Serif";
    } else {
        // キャラ名とセリフ
        const { character, dialogue } = currentLine;
        textElement.textContent = `${character}: ${dialogue}`;

        // フォントを設定
        if (characterSettings[character]) {
            textElement.style.fontFamily = characterSettings[character].font;

            // SEを再生
            const audio = new Audio(characterSettings[character].se);
            audio.play();
        }
    }

    textElement.classList.add('fade-in');
    textDisplay.appendChild(textElement);
    textDisplay.scrollTop = textDisplay.scrollHeight;

    // 次の行へ進む
    currentIndex++;
}

// リセット処理
function resetDisplay() {
    textDisplay.innerHTML = '';
    currentIndex = 0;
    alert('最初から始めます。次へボタンを押してください。');
}

// イベントリスナー
nextButton.addEventListener('click', displayNextText);
