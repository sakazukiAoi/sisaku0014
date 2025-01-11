// script.js

// 外部テキストファイルを読み込み
async function loadTextFile(url) {
    const response = await fetch(url);
    return await response.text();
}

// テキストデータの処理
function processTextData(text) {
    return text.split('\n').map(line => {
        const [character, dialogue] = line.split(':');
        return { character: character.trim(), dialogue: dialogue.trim() };
    });
}

// キャラクターごとの設定
const characterSettings = {
    'AG': { className: 'char-ag', se: 'se_ag.mp3' },
    'フォス': { className: 'char-fos', se: 'se_fos.mp3' },
    'エレーナ': { className: 'char-elena', se: 'se_elena.mp3' }
};

// テキストを表示する要素とボタン
const textDisplay = document.getElementById('text-display');
const nextButton = document.getElementById('next-button');

// テキスト表示用の変数
let textData = [];
let currentIndex = 0;

// 次のテキストを表示
function displayNextText() {
    if (currentIndex >= textData.length) return;

    const { character, dialogue } = textData[currentIndex];
    const charSetting = characterSettings[character] || {};

    const textElement = document.createElement('p');
    textElement.textContent = `${character}: ${dialogue}`;
    textElement.className = charSetting.className || '';
    textElement.classList.add('fade-in');

    textDisplay.appendChild(textElement);
    textDisplay.scrollTop = textDisplay.scrollHeight;

    // SEを再生
    if (charSetting.se) {
        const audio = new Audio(charSetting.se);
        audio.play();
    }

    currentIndex++;
}

// イベントリスナー
nextButton.addEventListener('click', displayNextText);

// 初期化
loadTextFile('text.txt').then(text => {
    textData = processTextData(text);
    displayNextText();
});
