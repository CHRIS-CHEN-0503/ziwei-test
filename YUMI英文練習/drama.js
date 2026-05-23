// ====== 劇情練習：故事 → 頁 → 句 ======
// 句子分解念誦、整句念誦、可調速度，不影響原本闖關進度
let currentStory = null;
let currentPage = null;
let currentSentenceIdx = 0;
let dramaPlaying = false;

// 速度設定（存 localStorage）
const DRAMA_SPEED_KEY = 'yumi_drama_speed';
const SPEED_PRESETS = [
    { id: 'slow',   label: '🐢 慢',  rate: 0.55, pause: 500 },
    { id: 'mid',    label: '🚶 中',  rate: 0.8,  pause: 350 },
    { id: 'fast',   label: '🐰 快',  rate: 1.0,  pause: 250 }
];
function getDramaSpeed() {
    const id = localStorage.getItem(DRAMA_SPEED_KEY) || 'mid';
    return SPEED_PRESETS.find(s => s.id === id) || SPEED_PRESETS[1];
}
function setDramaSpeed(id) {
    localStorage.setItem(DRAMA_SPEED_KEY, id);
    renderSpeedButtons();
}

// ====== 故事列表 ======
function openDrama() {
    renderStories();
    showScreen('stories-screen');
}

function renderStories() {
    const list = document.getElementById('stories-list');
    list.innerHTML = '';
    STORIES.forEach(story => {
        const card = document.createElement('button');
        card.className = 'lesson-card drama';
        card.onclick = () => openStory(story.id);
        card.innerHTML = `
            <div class="lesson-head">
                <span class="lesson-emoji">${story.emoji || '📖'}</span>
                <div><div class="lesson-title">${story.title}</div></div>
            </div>
            <div class="lesson-sub">${story.subtitle || ''}</div>
            <div class="lesson-meta">
                <span>📄 ${story.pages.length} 頁</span>
                <span class="lesson-progress">作者：${story.author || ''}</span>
            </div>
        `;
        list.appendChild(card);
    });
}

// ====== 頁列表 ======
function openStory(storyId) {
    currentStory = STORIES.find(s => s.id === storyId);
    if (!currentStory) return;
    document.getElementById('pages-title').textContent = currentStory.title;
    document.getElementById('pages-subtitle').textContent = currentStory.subtitle || '';
    renderPages();
    showScreen('pages-screen');
}

function renderPages() {
    const list = document.getElementById('pages-list');
    list.innerHTML = '';
    currentStory.pages.forEach((p, idx) => {
        const card = document.createElement('button');
        card.className = 'lesson-card';
        card.onclick = () => openPage(p.id);
        card.innerHTML = `
            <div class="lesson-head">
                <span class="lesson-emoji">${p.emoji || '📄'}</span>
                <div><div class="lesson-title">${p.title}</div></div>
            </div>
            <div class="lesson-sub">${p.sentences.length} 句</div>
        `;
        list.appendChild(card);
    });
}

// ====== 劇情念誦畫面 ======
function openPage(pageId) {
    currentPage = currentStory.pages.find(p => p.id === pageId);
    if (!currentPage) return;
    currentSentenceIdx = 0;
    document.getElementById('drama-title').textContent =
        `${currentStory.emoji} ${currentPage.title}`;
    renderSpeedButtons();
    renderDrama();
    showScreen('drama-screen');
}

function renderSpeedButtons() {
    const box = document.getElementById('speed-buttons');
    if (!box) return;
    const current = getDramaSpeed().id;
    box.innerHTML = SPEED_PRESETS.map(s => `
        <button class="speed-btn ${current === s.id ? 'active' : ''}"
                onclick="setDramaSpeed('${s.id}')">${s.label}</button>
    `).join('');
}

function renderDrama() {
    const sentence = currentPage.sentences[currentSentenceIdx];
    document.getElementById('sentence-counter').textContent =
        `${currentSentenceIdx + 1} / ${currentPage.sentences.length}`;

    // 句子分解 chips
    const chunksBox = document.getElementById('sentence-chunks');
    chunksBox.innerHTML = sentence.chunks.map((c, i) =>
        `<span class="chunk-chip" data-i="${i}">${escapeHtml(c)}</span>`
    ).join('');

    // 整句顯示
    document.getElementById('sentence-full').textContent = sentence.text;

    // 上下一句按鈕狀態
    document.getElementById('prev-sentence').disabled = currentSentenceIdx === 0;
    document.getElementById('next-sentence').disabled =
        currentSentenceIdx >= currentPage.sentences.length - 1;

    // 清掉舊的播放狀態
    stopDrama();
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ====== 播放：整句 ======
function playFullSentence() {
    stopDrama();
    const sentence = currentPage.sentences[currentSentenceIdx];
    const speed = getDramaSpeed();
    dramaPlaying = true;
    document.querySelectorAll('#sentence-chunks .chunk-chip').forEach(c => c.classList.add('reading'));
    document.getElementById('sentence-full').classList.add('reading');
    speak(sentence.text, {
        rate: speed.rate,
        onend: () => {
            dramaPlaying = false;
            document.querySelectorAll('#sentence-chunks .chunk-chip').forEach(c => c.classList.remove('reading'));
            document.getElementById('sentence-full').classList.remove('reading');
        }
    });
}

// ====== 播放：分解 ======
function playChunkedSentence() {
    stopDrama();
    const sentence = currentPage.sentences[currentSentenceIdx];
    const speed = getDramaSpeed();
    const chips = document.querySelectorAll('#sentence-chunks .chunk-chip');
    chips.forEach(c => c.classList.remove('reading', 'done'));
    dramaPlaying = true;
    let i = 0;
    const nextChunk = () => {
        if (!dramaPlaying) return;
        if (i >= sentence.chunks.length) {
            dramaPlaying = false;
            return;
        }
        if (chips[i - 1]) chips[i - 1].classList.replace('reading', 'done');
        if (chips[i]) chips[i].classList.add('reading');
        speak(sentence.chunks[i], {
            rate: speed.rate,
            onend: () => {
                i++;
                setTimeout(nextChunk, speed.pause);
            }
        });
    };
    nextChunk();
}

function stopDrama() {
    dramaPlaying = false;
    if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    document.querySelectorAll('#sentence-chunks .chunk-chip')
        .forEach(c => c.classList.remove('reading', 'done'));
    const full = document.getElementById('sentence-full');
    if (full) full.classList.remove('reading');
}

// ====== 上一句 / 下一句 ======
function prevSentence() {
    if (currentSentenceIdx <= 0) return;
    currentSentenceIdx--;
    renderDrama();
}
function nextSentence() {
    if (currentSentenceIdx >= currentPage.sentences.length - 1) return;
    currentSentenceIdx++;
    renderDrama();
}

// 點 chunk chip 可以單獨念那一段
document.addEventListener('click', (e) => {
    const chip = e.target.closest('.chunk-chip');
    if (!chip || !currentPage) return;
    const idx = parseInt(chip.dataset.i, 10);
    if (isNaN(idx)) return;
    stopDrama();
    const sentence = currentPage.sentences[currentSentenceIdx];
    const speed = getDramaSpeed();
    chip.classList.add('reading');
    speak(sentence.chunks[idx], {
        rate: speed.rate,
        onend: () => chip.classList.remove('reading')
    });
});
