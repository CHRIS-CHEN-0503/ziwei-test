// ====== 狀態 ======
let currentLesson = null;
let currentStage = null;
let questions = [];
let currentIdx = 0;
let score = 0;
const QUESTIONS_PER_STAGE = 5;
const PASS_THRESHOLD = 4; // 5 題答對 4 題以上算過關

// ====== 進度（localStorage） ======
const PROGRESS_KEY = 'yumi_english_progress_v1';
function loadProgress() {
    try {
        return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
    } catch (e) { return {}; }
}
function saveProgress(p) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}
function isStageCleared(lessonId, stageId) {
    const p = loadProgress();
    return !!(p[lessonId] && p[lessonId][stageId]);
}
function markStageCleared(lessonId, stageId, stars) {
    const p = loadProgress();
    if (!p[lessonId]) p[lessonId] = {};
    const prev = p[lessonId][stageId] || { stars: 0 };
    p[lessonId][stageId] = { stars: Math.max(prev.stars || 0, stars), at: new Date().toISOString() };
    saveProgress(p);
}
function lessonClearedCount(lesson) {
    const p = loadProgress();
    if (!p[lesson.id]) return 0;
    return lesson.stages.filter(s => p[lesson.id][s.id]).length;
}

// ====== 工具 ======
function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function pickOthers(pool, exclude, n) {
    return shuffle(pool.filter(x => x.word !== exclude.word)).slice(0, n);
}
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// ====== 主畫面：列出課程 ======
function renderLessons() {
    const list = document.getElementById('lessons-list');
    list.innerHTML = '';
    if (!LESSONS.length) {
        list.innerHTML = '<p class="subtitle">還沒有課程，上完課再來吧！</p>';
        return;
    }
    LESSONS.forEach(lesson => {
        const cleared = lessonClearedCount(lesson);
        const total = lesson.stages.length;
        const done = cleared === total;
        const card = document.createElement('button');
        card.className = 'lesson-card ' + (lesson.color || '');
        card.onclick = () => openLesson(lesson.id);
        card.innerHTML = `
            <div class="lesson-head">
                <span class="lesson-emoji">${lesson.emoji || '📘'}</span>
                <div>
                    <div class="lesson-title">${lesson.title}</div>
                </div>
            </div>
            <div class="lesson-sub">${lesson.subtitle || ''}</div>
            <div class="lesson-meta">
                <span>📅 更新：${lesson.date}</span>
                <span class="lesson-progress">${done ? '✨ 全破關' : `闖關 ${cleared}/${total}`}</span>
            </div>
        `;
        list.appendChild(card);
    });
}

function openLesson(lessonId) {
    currentLesson = LESSONS.find(l => l.id === lessonId);
    if (!currentLesson) return;
    document.getElementById('stages-title').textContent = currentLesson.title;
    document.getElementById('stages-subtitle').textContent = currentLesson.subtitle || '';
    document.getElementById('stages-date').textContent = '📅 更新日期：' + currentLesson.date;
    const strip = document.getElementById('vocab-strip');
    strip.innerHTML = currentLesson.vocab.map(v =>
        `<span class="vocab-pill">${v.emoji} ${v.word}</span>`
    ).join('');
    renderStages();
    showScreen('stages-screen');
}

function renderStages() {
    const grid = document.getElementById('stages-grid');
    grid.innerHTML = '';
    currentLesson.stages.forEach((stage, idx) => {
        const cleared = isStageCleared(currentLesson.id, stage.id);
        const prevCleared = idx === 0 || isStageCleared(currentLesson.id, currentLesson.stages[idx - 1].id);
        const locked = !cleared && !prevCleared;
        const card = document.createElement('button');
        card.className = 'stage-card' + (cleared ? ' cleared' : '') + (locked ? ' locked' : '');
        card.disabled = locked;
        card.onclick = () => { if (!locked) startStage(stage.id); };
        const badge = locked ? '🔒' : (cleared ? '⭐' : (idx + 1));
        card.innerHTML = `
            <span class="stage-badge">${badge}</span>
            <span class="stage-emoji">${stage.emoji}</span>
            <div class="stage-title">關卡 ${idx + 1}：${stage.title}</div>
            <div class="stage-desc">${stage.desc}</div>
        `;
        grid.appendChild(card);
    });
}

function backToStages() {
    renderStages();
    showScreen('stages-screen');
}

// ====== 出題 ======
function startStage(stageId) {
    currentStage = currentLesson.stages.find(s => s.id === stageId);
    startGame();
}

function startGame() {
    score = 0;
    currentIdx = 0;
    document.getElementById('feedback').textContent = '';
    document.getElementById('game-title').textContent =
        `${currentStage.emoji} ${currentStage.title}`;
    questions = buildQuestions(currentStage, currentLesson.vocab);
    document.getElementById('total-q').textContent = questions.length;
    document.getElementById('score').textContent = '0';
    showScreen('game-screen');
    renderQuestion();
}

function buildQuestions(stage, vocab) {
    const builders = {
        pic2word:      buildPic2Word,
        word2pic:      buildWord2Pic,
        listen:        buildListen,
        like:          buildLike,
        wantsome:      buildWantSome,
        speak:         buildSpeak,
        spell:         buildSpell,
        speakLike:     buildSpeakLike,
        speakWantSome: buildSpeakWantSome
    };
    const fn = builders[stage.type];
    const all = [];
    // 每個單字至少 1 題，再隨機補滿到 QUESTIONS_PER_STAGE
    const base = shuffle(vocab);
    base.forEach(v => all.push(fn(v, vocab)));
    while (all.length < QUESTIONS_PER_STAGE) {
        const v = vocab[Math.floor(Math.random() * vocab.length)];
        all.push(fn(v, vocab));
    }
    return shuffle(all).slice(0, QUESTIONS_PER_STAGE);
}

// 看圖選字：題目=emoji，選項=英文
function buildPic2Word(target, vocab) {
    const others = pickOthers(vocab, target, 3);
    const opts = shuffle([target, ...others]).map(v => ({
        text: v.word, emoji: '', isCorrect: v.word === target.word
    }));
    return {
        prompt: 'What is this?',
        display: `<div class="big-emoji">${target.emoji}</div>`,
        speakText: target.word,
        options: opts,
        layout: 'text'
    };
}

// 看字選圖：題目=英文，選項=emoji
function buildWord2Pic(target, vocab) {
    const others = pickOthers(vocab, target, 3);
    const opts = shuffle([target, ...others]).map(v => ({
        text: v.word, emoji: v.emoji, isCorrect: v.word === target.word
    }));
    return {
        prompt: 'Find the picture',
        display: `<div class="big-word">${target.word}</div>`,
        speakText: target.word,
        options: opts,
        layout: 'emoji'
    };
}

// 聽聲音選圖
function buildListen(target, vocab) {
    const others = pickOthers(vocab, target, 3);
    const opts = shuffle([target, ...others]).map(v => ({
        text: v.word, emoji: v.emoji, isCorrect: v.word === target.word
    }));
    return {
        prompt: 'Listen and pick',
        display: `<div class="big-emoji">🎧</div>`,
        speakText: target.word,
        autoSpeak: true,
        options: opts,
        layout: 'emoji'
    };
}

// I like / I don't like
function buildLike(target, vocab) {
    const positive = Math.random() < 0.5;
    const heart = positive ? '❤️' : '✗';
    const correctSentence = positive
        ? `I like ${target.word}.`
        : `I don't like ${target.word}.`;
    const wrongSentence = positive
        ? `I don't like ${target.word}.`
        : `I like ${target.word}.`;
    // 第三個誤答：用別的單字
    const otherVocab = pickOthers(vocab, target, 1)[0];
    const distractor1 = positive
        ? `I like ${otherVocab.word}.`
        : `I don't like ${otherVocab.word}.`;
    const distractor2 = `I want ${target.word}.`;
    const opts = shuffle([
        { text: correctSentence, isCorrect: true },
        { text: wrongSentence,   isCorrect: false },
        { text: distractor1,     isCorrect: false },
        { text: distractor2,     isCorrect: false }
    ]);
    return {
        prompt: positive ? '我喜歡這個！' : '我不喜歡這個…',
        display: `<div class="big-emoji">${target.emoji}</div>
                  <div class="heart-icon">${heart}</div>`,
        speakText: correctSentence,
        options: opts,
        layout: 'sentence'
    };
}

// Do you want some...?
function buildWantSome(target, vocab) {
    const wantIt = Math.random() < 0.5;
    const correct = wantIt ? 'Yes, please.' : 'No, thank you.';
    const wrong   = wantIt ? 'No, thank you.' : 'Yes, please.';
    const opts = shuffle([
        { text: correct, emoji: wantIt ? '😋' : '🙅', isCorrect: true },
        { text: wrong,   emoji: wantIt ? '🙅' : '😋', isCorrect: false }
    ]);
    return {
        prompt: `Do you want some ${target.word}?`,
        display: `<div class="big-emoji">${target.emoji}</div>
                  <div class="sentence-text">Do you want some ${target.word}?</div>
                  <div class="heart-icon">${wantIt ? '😋' : '🙅'}</div>`,
        speakText: `Do you want some ${target.word}?`,
        options: opts,
        layout: 'sentence-emoji'
    };
}

// 開口說：看圖說單字
function buildSpeak(target) {
    return {
        kind: 'speak',
        prompt: '看圖片，按🎤後大聲說出英文！',
        emoji: target.emoji,
        targetPhrase: target.word,
        accept: [target.word.toLowerCase()],
        speakText: target.word
    };
}

// 開口說：說 I like / I don't like
function buildSpeakLike(target) {
    const positive = Math.random() < 0.5;
    const heart = positive ? '❤️' : '✗';
    const phrase = positive ? `I like ${target.word}.` : `I don't like ${target.word}.`;
    // 接受的口說（去掉標點、I 寬鬆）
    const accept = positive
        ? [`i like ${target.word}`.toLowerCase()]
        : [
            `i don't like ${target.word}`.toLowerCase(),
            `i dont like ${target.word}`.toLowerCase(),
            `i do not like ${target.word}`.toLowerCase()
          ];
    return {
        kind: 'speak',
        prompt: positive ? '看到 ❤️ 大聲說：' : '看到 ✗ 大聲說：',
        emoji: target.emoji,
        heart: heart,
        targetPhrase: phrase,
        accept: accept,
        speakText: phrase
    };
}

// 開口說：對 Do you want some 回答
function buildSpeakWantSome(target) {
    const wantIt = Math.random() < 0.5;
    const phrase = wantIt ? 'Yes, please.' : 'No, thank you.';
    const accept = wantIt
        ? ['yes please', 'yes']
        : ['no thank you', 'no thanks', 'no'];
    return {
        kind: 'speak',
        prompt: `Do you want some ${target.word}?`,
        emoji: target.emoji,
        heart: wantIt ? '😋' : '🙅',
        promptSpeak: `Do you want some ${target.word}?`,
        targetPhrase: phrase,
        accept: accept,
        speakText: phrase,
        autoSpeakPrompt: true
    };
}

// 拼字：把字母順序排對
function buildSpell(target) {
    const letters = target.word.split('');
    // 字母池：所有字母 + 額外 1~2 個誘餌字母（在較長單字才加）
    let tiles = letters.slice();
    if (letters.length <= 4) {
        const extras = ['a','e','o','t','s'].filter(c => !letters.includes(c));
        if (extras.length) tiles.push(extras[Math.floor(Math.random() * extras.length)]);
    }
    tiles = shuffle(tiles);
    return {
        kind: 'spell',
        prompt: '把這個單字拼出來！',
        emoji: target.emoji,
        word: target.word,
        tiles: tiles,
        speakText: target.word
    };
}

// ====== 渲染題目 ======
function renderQuestion() {
    const q = questions[currentIdx];
    document.getElementById('current-q').textContent = currentIdx + 1;
    document.getElementById('progress-fill').style.width =
        `${(currentIdx / questions.length) * 100}%`;
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').style.color = '';
    const qContent = document.getElementById('question-content');
    const optsBox = document.getElementById('options');
    const speakBtn = document.getElementById('speak-btn');
    optsBox.innerHTML = '';

    // 派發到對應 renderer
    if (q.kind === 'speak') {
        renderSpeak(q, qContent, optsBox, speakBtn);
    } else if (q.kind === 'spell') {
        renderSpell(q, qContent, optsBox, speakBtn);
    } else {
        renderOptions(q, qContent, optsBox, speakBtn);
    }
}

function renderOptions(q, qContent, optsBox, speakBtn) {
    speakBtn.style.display = '';
    qContent.innerHTML = `<div class="prompt-text">${q.prompt}</div>${q.display}`;
    optsBox.style.display = 'grid';
    optsBox.style.gridTemplateColumns = q.options.length === 2 ? '1fr 1fr' : '1fr 1fr';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        if (q.layout === 'emoji' || q.layout === 'sentence-emoji') {
            btn.innerHTML = `<span class="opt-emoji">${opt.emoji}</span><span class="opt-text">${opt.text}</span>`;
        } else if (q.layout === 'sentence') {
            btn.innerHTML = `<span class="opt-text" style="font-size:1rem">${opt.text}</span>`;
        } else {
            btn.innerHTML = `<span class="opt-text">${opt.text}</span>`;
        }
        btn.onclick = () => answer(btn, opt);
        optsBox.appendChild(btn);
    });
    if (q.autoSpeak) setTimeout(speakQuestion, 350);
}

// ====== 開口說渲染 ======
function renderSpeak(q, qContent, optsBox, speakBtn) {
    speakBtn.style.display = 'none';
    optsBox.style.display = 'none';
    const heart = q.heart ? `<div class="heart-icon">${q.heart}</div>` : '';
    qContent.innerHTML = `
        <div class="prompt-text">${q.prompt}</div>
        <div class="big-emoji">${q.emoji}</div>
        ${heart}
        <div class="target-phrase" id="target-phrase">${q.targetPhrase}</div>
        <div class="speak-area">
            <button class="mic-btn" id="mic-btn" onclick="onMicTap()">🎤</button>
            <div class="speak-hint" id="speak-hint">點麥克風開始說</div>
            <div class="transcript-box" id="transcript-box">　</div>
            <div class="speak-actions">
                <button class="small-btn" onclick="speakTarget()">🔊 聽範例</button>
                <button class="small-btn warn" onclick="markSelfSaid()">我說過了 ✓</button>
                <button class="small-btn warn" onclick="skipSpeak()">跳過</button>
            </div>
        </div>
    `;
    if (q.autoSpeakPrompt && q.promptSpeak) setTimeout(() => speak(q.promptSpeak), 300);
}

function speakTarget() {
    const q = questions[currentIdx];
    if (q && q.speakText) speak(q.speakText);
}

let recognizer = null;
function onMicTap() {
    const q = questions[currentIdx];
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const micBtn = document.getElementById('mic-btn');
    const hint = document.getElementById('speak-hint');
    const tBox = document.getElementById('transcript-box');
    if (!SR) {
        hint.textContent = '這個瀏覽器不支援語音辨識，按「我說過了 ✓」自己確認唸完囉～';
        tBox.textContent = '（建議使用 Chrome / Safari）';
        return;
    }
    if (recognizer) {
        try { recognizer.abort(); } catch (e) {}
        recognizer = null;
    }
    try {
        recognizer = new SR();
        recognizer.lang = 'en-US';
        recognizer.interimResults = false;
        recognizer.maxAlternatives = 5;
        micBtn.classList.add('listening');
        micBtn.disabled = true;
        hint.textContent = '聽我說…大聲一點唷！🎙️';
        tBox.className = 'transcript-box';
        tBox.textContent = '　';
        recognizer.onresult = (ev) => {
            const alts = [];
            for (let i = 0; i < ev.results[0].length; i++) {
                alts.push(ev.results[0][i].transcript);
            }
            const heard = alts[0] || '';
            tBox.textContent = '👂 我聽到：' + heard;
            const ok = alts.some(a => matchPhrase(a, q.accept));
            handleSpeakResult(ok, heard);
        };
        recognizer.onerror = (ev) => {
            micBtn.classList.remove('listening');
            micBtn.disabled = false;
            if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') {
                hint.textContent = '需要允許麥克風權限才能聽喔！';
            } else if (ev.error === 'no-speech') {
                hint.textContent = '沒聽到聲音，再試一次！';
            } else {
                hint.textContent = '出錯了：' + ev.error + '，再按麥克風試試';
            }
        };
        recognizer.onend = () => {
            micBtn.classList.remove('listening');
            micBtn.disabled = false;
        };
        recognizer.start();
    } catch (e) {
        micBtn.classList.remove('listening');
        micBtn.disabled = false;
        hint.textContent = '無法啟動麥克風，按「我說過了 ✓」自己確認囉';
    }
}

function normalizePhrase(s) {
    return (s || '')
        .toLowerCase()
        .replace(/[.,!?'"’]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}
function matchPhrase(transcript, accepts) {
    const t = normalizePhrase(transcript);
    return accepts.some(a => {
        const target = normalizePhrase(a);
        if (t === target) return true;
        if (t.includes(target)) return true;
        // 對單字題：transcript 含關鍵字即可
        const tw = t.split(' ');
        const aw = target.split(' ');
        if (aw.length === 1) return tw.includes(aw[0]);
        return aw.every(w => tw.includes(w));
    });
}

function handleSpeakResult(ok, heard) {
    const tBox = document.getElementById('transcript-box');
    const hint = document.getElementById('speak-hint');
    if (ok) {
        tBox.classList.add('match');
        hint.textContent = '✅ 唸得很棒！';
        score++;
        document.getElementById('score').textContent = score;
        document.getElementById('feedback').textContent = '✅ Great speaking!';
        document.getElementById('feedback').style.color = '#2e7d32';
        setTimeout(advance, 1100);
    } else {
        tBox.classList.add('miss');
        hint.textContent = '差一點！按範例聽一下，再試一次～';
        document.getElementById('feedback').textContent = '再聽一次「' + (questions[currentIdx].targetPhrase) + '」試試';
        document.getElementById('feedback').style.color = '#c62828';
    }
}

function markSelfSaid() {
    // 信任小朋友/家長，記為答對
    score++;
    document.getElementById('score').textContent = score;
    document.getElementById('feedback').textContent = '👍 好棒！';
    document.getElementById('feedback').style.color = '#2e7d32';
    setTimeout(advance, 700);
}
function skipSpeak() {
    document.getElementById('feedback').textContent = '已跳過這題';
    document.getElementById('feedback').style.color = '#888';
    setTimeout(advance, 500);
}

// ====== 拼字渲染 ======
let spellCurrent = '';
function renderSpell(q, qContent, optsBox, speakBtn) {
    speakBtn.style.display = '';
    optsBox.style.display = 'none';
    spellCurrent = '';
    const slots = q.word.split('').map((_, i) => `<div class="spell-slot" data-i="${i}"></div>`).join('');
    const tiles = q.tiles.map((c, i) =>
        `<button class="spell-tile" data-i="${i}" onclick="onSpellTile(${i})">${c}</button>`
    ).join('');
    qContent.innerHTML = `
        <div class="prompt-text">${q.prompt}</div>
        <div class="spell-target">${q.emoji}</div>
        <div class="big-word" style="font-size:1.4rem">${q.word.length} letters</div>
        <div class="spell-slots" id="spell-slots">${slots}</div>
        <div class="spell-tiles" id="spell-tiles">${tiles}</div>
        <div class="spell-actions">
            <button class="small-btn" onclick="undoSpell()">⌫ 退一格</button>
            <button class="small-btn" onclick="clearSpell()">清空</button>
        </div>
    `;
}

function onSpellTile(i) {
    const q = questions[currentIdx];
    if (spellCurrent.length >= q.word.length) return;
    const tileBtn = document.querySelector(`#spell-tiles .spell-tile[data-i="${i}"]`);
    if (!tileBtn || tileBtn.classList.contains('used')) return;
    const letter = q.tiles[i];
    spellCurrent += letter;
    tileBtn.classList.add('used');
    tileBtn.disabled = true;
    tileBtn.dataset.placedAt = spellCurrent.length - 1;
    const slot = document.querySelector(`#spell-slots .spell-slot[data-i="${spellCurrent.length - 1}"]`);
    if (slot) {
        slot.textContent = letter;
        slot.classList.add('filled');
    }
    if (spellCurrent.length === q.word.length) checkSpell();
}

function undoSpell() {
    const q = questions[currentIdx];
    if (!spellCurrent.length) return;
    const idx = spellCurrent.length - 1;
    spellCurrent = spellCurrent.slice(0, -1);
    const slot = document.querySelector(`#spell-slots .spell-slot[data-i="${idx}"]`);
    if (slot) {
        slot.textContent = '';
        slot.classList.remove('filled', 'correct', 'wrong');
    }
    const tileBtn = document.querySelector(`#spell-tiles .spell-tile.used[data-placed-at="${idx}"]`);
    if (tileBtn) {
        tileBtn.classList.remove('used');
        tileBtn.disabled = false;
        delete tileBtn.dataset.placedAt;
    }
}
function clearSpell() {
    const q = questions[currentIdx];
    spellCurrent = '';
    document.querySelectorAll('#spell-slots .spell-slot').forEach(s => {
        s.textContent = '';
        s.classList.remove('filled', 'correct', 'wrong');
    });
    document.querySelectorAll('#spell-tiles .spell-tile').forEach(t => {
        t.classList.remove('used');
        t.disabled = false;
        delete t.dataset.placedAt;
    });
}

function checkSpell() {
    const q = questions[currentIdx];
    const slots = document.querySelectorAll('#spell-slots .spell-slot');
    const ok = spellCurrent.toLowerCase() === q.word.toLowerCase();
    if (ok) {
        slots.forEach(s => s.classList.add('correct'));
        score++;
        document.getElementById('score').textContent = score;
        document.getElementById('feedback').textContent = '✅ 拼對了！' + q.word;
        document.getElementById('feedback').style.color = '#2e7d32';
        speak(q.word);
        setTimeout(advance, 1300);
    } else {
        slots.forEach(s => s.classList.add('wrong'));
        document.getElementById('feedback').textContent = '差一點～再試一次';
        document.getElementById('feedback').style.color = '#c62828';
        // 讓孩子自己重來：清空後重排
        setTimeout(() => {
            clearSpell();
            document.getElementById('feedback').textContent = '';
        }, 1100);
    }
}

function advance() {
    currentIdx++;
    if (currentIdx >= questions.length) {
        finishStage();
    } else {
        renderQuestion();
    }
}

function answer(btn, opt) {
    const buttons = document.querySelectorAll('#options .option-btn');
    buttons.forEach(b => b.disabled = true);
    const q = questions[currentIdx];
    if (opt.isCorrect) {
        btn.classList.add('correct');
        score++;
        document.getElementById('score').textContent = score;
        document.getElementById('feedback').textContent = '✅ 答對了！Great!';
        document.getElementById('feedback').style.color = '#2e7d32';
        speak(q.speakText);
    } else {
        btn.classList.add('wrong');
        // 顯示正解
        buttons.forEach((b, i) => {
            if (q.options[i].isCorrect) b.classList.add('correct');
        });
        document.getElementById('feedback').textContent = '❌ 答案是：' + (q.options.find(o => o.isCorrect).text);
        document.getElementById('feedback').style.color = '#c62828';
    }
    setTimeout(advance, opt.isCorrect ? 1100 : 1700);
}

function speakQuestion() {
    const q = questions[currentIdx];
    if (q && q.speakText) speak(q.speakText);
}
function speak(text) {
    if (!('speechSynthesis' in window)) return;
    try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.9;
        u.pitch = 1.05;
        window.speechSynthesis.speak(u);
    } catch (e) {}
}

function confirmQuit() {
    if (confirm('要離開這一關嗎？進度會不會保留喔～')) {
        backToStages();
    }
}

// ====== 結算 ======
function finishStage() {
    document.getElementById('progress-fill').style.width = '100%';
    const total = questions.length;
    const passed = score >= PASS_THRESHOLD;
    let stars = 1;
    if (score === total) stars = 3;
    else if (score >= PASS_THRESHOLD) stars = 2;
    else stars = 0;

    document.getElementById('result-emoji').textContent = passed ? '🎉' : '💪';
    document.getElementById('result-title').textContent = passed ? '太棒了！過關！' : '再加油一次！';
    document.getElementById('result-stars').textContent =
        '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    document.getElementById('final-score-text').textContent =
        `${score} / ${total} 答對`;

    let comment = '';
    if (stars === 3) comment = '完美！全部答對～👑';
    else if (stars === 2) comment = '很厲害！再挑戰看看滿分吧！';
    else if (stars === 1) comment = '差一點點，多練幾次就會了！';
    else comment = '沒關係，再玩一次就會更熟悉～';
    document.getElementById('result-comment').textContent = comment;

    if (passed) {
        markStageCleared(currentLesson.id, currentStage.id, stars);
    }

    // 下一關按鈕：只有過關 + 還有下一關才顯示
    const nextBtn = document.getElementById('next-stage-btn');
    const idx = currentLesson.stages.findIndex(s => s.id === currentStage.id);
    const hasNext = passed && idx < currentLesson.stages.length - 1;
    nextBtn.style.display = hasNext ? '' : 'none';

    showScreen('result-screen');
}

function goNextStage() {
    const idx = currentLesson.stages.findIndex(s => s.id === currentStage.id);
    const next = currentLesson.stages[idx + 1];
    if (next) startStage(next.id);
    else backToStages();
}

// ====== 啟動 ======
document.addEventListener('DOMContentLoaded', renderLessons);
