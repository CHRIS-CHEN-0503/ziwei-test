// ====== 劇情練習：一頁瀏覽全部句子 ======
// 不是闖關，純粹給小朋友練習念誦：整句念誦、分解念誦、可調速度。
let currentStory = null;
let dramaPlaying = false;

const DRAMA_SPEED_KEY = 'yumi_drama_speed';
const SPEED_PRESETS = [
    { id: 'slow', label: '🐢 慢', rate: 0.28, pause: 700 },
    { id: 'mid',  label: '🚶 中', rate: 0.4,  pause: 500 },
    { id: 'fast', label: '🐰 快', rate: 0.5,  pause: 350 }
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
        const totalSentences = story.pages.reduce((acc, p) => acc + p.sentences.length, 0);
        card.innerHTML = `
            <div class="lesson-head">
                <span class="lesson-emoji">${story.emoji || '📖'}</span>
                <div><div class="lesson-title">${story.title}</div></div>
            </div>
            <div class="lesson-sub">${story.subtitle || ''}</div>
            <div class="lesson-meta">
                <span>📄 ${story.pages.length} 頁 · ${totalSentences} 句</span>
                <span class="lesson-progress">作者：${story.author || ''}</span>
            </div>
        `;
        list.appendChild(card);
    });
}

// ====== 進入念誦頁（一次顯示所有句子） ======
function openStory(storyId) {
    currentStory = STORIES.find(s => s.id === storyId);
    if (!currentStory) return;
    document.getElementById('drama-title').textContent =
        `${currentStory.emoji || '📖'} ${currentStory.title}`;
    document.getElementById('drama-subtitle').textContent = currentStory.subtitle || '';
    renderSpeedButtons();
    renderDramaContent();
    showScreen('drama-screen');
    window.scrollTo(0, 0);
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

function renderDramaContent() {
    const container = document.getElementById('drama-content');
    container.innerHTML = currentStory.pages.map(p => `
        <div class="page-section">
            <h3 class="page-header">${p.emoji || '📄'} ${escapeHtml(p.title)}</h3>
            <div class="page-sentences">
                ${p.sentences.map((s, i) => `
                    <div class="sentence-row" id="sr-${p.id}-${i}">
                        <div class="chunks-inline">
                            ${s.chunks.map((c, ci) => `
                                <span class="chunk-chip"
                                      onclick="playChunk('${p.id}', ${i}, ${ci})">${escapeHtml(c)}</span>
                            `).join('')}
                        </div>
                        <div class="row-actions">
                            <button class="icon-btn" title="整句念誦"
                                onclick="playSentenceFull('${p.id}', ${i})">🔊</button>
                            <button class="icon-btn chunk-btn" title="分解念誦"
                                onclick="playSentenceChunked('${p.id}', ${i})">📦</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function findSentence(pageId, idx) {
    const page = currentStory.pages.find(p => p.id === pageId);
    return page && page.sentences[idx];
}

// ====== 播放控制 ======
function stopDrama() {
    dramaPlaying = false;
    if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    document.querySelectorAll('.sentence-row').forEach(r => r.classList.remove('active'));
    document.querySelectorAll('.chunk-chip').forEach(c => c.classList.remove('reading', 'done'));
}

function playSentenceFull(pageId, idx) {
    stopDrama();
    const sentence = findSentence(pageId, idx);
    if (!sentence) return;
    const row = document.getElementById(`sr-${pageId}-${idx}`);
    if (row) row.classList.add('active');
    const chips = row ? row.querySelectorAll('.chunk-chip') : [];
    chips.forEach(c => c.classList.add('reading'));
    dramaPlaying = true;
    speak(sentence.text, {
        rate: getDramaSpeed().rate,
        onend: () => {
            dramaPlaying = false;
            if (row) row.classList.remove('active');
            chips.forEach(c => c.classList.remove('reading'));
        }
    });
}

function playSentenceChunked(pageId, idx) {
    stopDrama();
    const sentence = findSentence(pageId, idx);
    if (!sentence) return;
    const row = document.getElementById(`sr-${pageId}-${idx}`);
    if (row) row.classList.add('active');
    const chips = row ? Array.from(row.querySelectorAll('.chunk-chip')) : [];
    const speed = getDramaSpeed();
    dramaPlaying = true;
    let i = 0;
    const next = () => {
        if (!dramaPlaying) return;
        if (chips[i - 1]) {
            chips[i - 1].classList.remove('reading');
            chips[i - 1].classList.add('done');
        }
        if (i >= sentence.chunks.length) {
            dramaPlaying = false;
            if (row) row.classList.remove('active');
            chips.forEach(c => c.classList.remove('reading', 'done'));
            return;
        }
        if (chips[i]) chips[i].classList.add('reading');
        speak(sentence.chunks[i], {
            rate: speed.rate,
            onend: () => {
                i++;
                setTimeout(next, speed.pause);
            }
        });
    };
    next();
}

// 點某一個 chunk → 單獨念那一段
function playChunk(pageId, sIdx, cIdx) {
    stopDrama();
    const sentence = findSentence(pageId, sIdx);
    if (!sentence) return;
    const row = document.getElementById(`sr-${pageId}-${sIdx}`);
    const chips = row ? row.querySelectorAll('.chunk-chip') : [];
    const chip = chips[cIdx];
    if (chip) chip.classList.add('reading');
    speak(sentence.chunks[cIdx], {
        rate: getDramaSpeed().rate,
        onend: () => { if (chip) chip.classList.remove('reading'); }
    });
}
