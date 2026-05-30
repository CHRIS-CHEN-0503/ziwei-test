// ====== 英文拼音教學 App ======
// 學習模式 / 測驗模式 / 進度追蹤 / 深淺色切換

const STORAGE_KEY = 'phonics_progress_v1';
const THEME_KEY = 'phonics_theme';
const VOICE_KEY = 'phonics_voice';

let state = {
    currentChapterId: null,
    currentLessonId: null,
    mode: 'lesson',   // 'lesson' | 'quiz' | 'result'
    quiz: null
};

// ====== Progress ======
function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
}
function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
function markLessonViewed(chapterId, lessonId) {
    const p = loadProgress();
    if (!p[chapterId]) p[chapterId] = { viewed: {}, quizScores: {} };
    p[chapterId].viewed[lessonId] = new Date().toISOString();
    saveProgress(p);
    renderTopProgress();
    renderSidebar();
}
function recordQuizScore(chapterId, score, total) {
    const p = loadProgress();
    if (!p[chapterId]) p[chapterId] = { viewed: {}, quizScores: {} };
    const pct = Math.round((score / total) * 100);
    const prev = p[chapterId].quizScores.highest || 0;
    p[chapterId].quizScores.highest = Math.max(prev, pct);
    p[chapterId].quizScores.lastTaken = new Date().toISOString();
    saveProgress(p);
    renderTopProgress();
    renderSidebar();
}
function chapterStats(chapter) {
    const p = loadProgress()[chapter.id] || { viewed: {}, quizScores: {} };
    const viewed = chapter.lessons.filter(l => p.viewed[l.id]).length;
    const total = chapter.lessons.length;
    const highest = p.quizScores.highest || 0;
    return { viewed, total, highest, done: viewed === total && highest >= 80 };
}
function overallProgress() {
    let totalLessons = 0, viewedLessons = 0, chapterScoreSum = 0;
    CHAPTERS.forEach(c => {
        const s = chapterStats(c);
        totalLessons += s.total;
        viewedLessons += s.viewed;
        chapterScoreSum += s.highest;
    });
    const learningPct = totalLessons ? (viewedLessons / totalLessons) : 0;
    const quizPct = CHAPTERS.length ? (chapterScoreSum / CHAPTERS.length / 100) : 0;
    return Math.round((learningPct * 0.5 + quizPct * 0.5) * 100);
}

// ====== Theme ======
function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}
function toggleTheme() {
    const cur = document.documentElement.dataset.theme || 'light';
    applyTheme(cur === 'light' ? 'dark' : 'light');
}

// ====== TTS（挑選自然的英文聲音） ======
let preferredVoice = null;
function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang));
    if (!voices.length) return;
    const stored = localStorage.getItem(VOICE_KEY);
    if (stored) {
        const found = voices.find(v => v.name === stored);
        if (found) { preferredVoice = found; return; }
    }
    const tests = [
        v => /^(Samantha|Ava|Allison|Karen)$/i.test(v.name),
        v => /^Google US English$/.test(v.name),
        v => /^Google UK English Female$/.test(v.name),
        v => /(Aria|Jenny|Sonia|Libby)/i.test(v.name),
        v => /Zira/i.test(v.name),
        v => v.lang.toLowerCase().startsWith('en') && !/david|mark|daniel|fred|albert/i.test(v.name),
        v => true
    ];
    for (const t of tests) { const v = voices.find(t); if (v) { preferredVoice = v; return; } }
}
if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
}
function speak(text, opts) {
    if (!('speechSynthesis' in window)) return;
    opts = opts || {};
    try {
        if (!opts.queue) speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        if (!preferredVoice) pickVoice();
        if (preferredVoice) { u.voice = preferredVoice; u.lang = preferredVoice.lang; }
        else u.lang = 'en-US';
        u.rate = (typeof opts.rate === 'number') ? opts.rate : (/[\s-]/.test(text) ? 0.85 : 0.75);
        u.pitch = 1.0;
        if (opts.onend) u.onend = opts.onend;
        speechSynthesis.speak(u);
    } catch (e) {}
}

// ====== Sidebar ======
function renderSidebar() {
    const nav = document.getElementById('sidebar-nav');
    nav.innerHTML = '';
    // Dashboard 入口
    const dash = document.createElement('button');
    dash.className = 'nav-chapter dashboard-btn' + (state.mode === 'dashboard' ? ' active' : '');
    dash.innerHTML = `<span class="ch-num">📊</span><span class="ch-title">學習儀表板</span>`;
    dash.onclick = () => { state.mode = 'dashboard'; renderMain(); renderSidebar(); };
    nav.appendChild(dash);

    CHAPTERS.forEach((ch, i) => {
        const s = chapterStats(ch);
        const chBtn = document.createElement('div');
        chBtn.className = 'nav-chapter-block';
        const header = document.createElement('button');
        header.className = 'nav-chapter' + (state.currentChapterId === ch.id ? ' open' : '');
        header.innerHTML = `
            <span class="ch-num">${i + 1}</span>
            <span class="ch-title">${ch.title.replace(/^第.+章：/, '')}</span>
            <span class="ch-progress">${s.viewed}/${s.total}${s.highest ? ' · ' + s.highest + '%' : ''}</span>
        `;
        header.onclick = () => {
            state.currentChapterId = (state.currentChapterId === ch.id) ? null : ch.id;
            renderSidebar();
        };
        chBtn.appendChild(header);

        if (state.currentChapterId === ch.id) {
            const lessonList = document.createElement('div');
            lessonList.className = 'nav-lessons';

            // Chapter overview
            const ovBtn = document.createElement('button');
            ovBtn.className = 'nav-lesson' + (state.mode === 'lesson' && !state.currentLessonId ? ' active' : '');
            ovBtn.innerHTML = `<span>📖 章節概覽</span>`;
            ovBtn.onclick = () => { state.currentLessonId = null; state.mode = 'lesson'; renderMain(); renderSidebar(); };
            lessonList.appendChild(ovBtn);

            ch.lessons.forEach(l => {
                const p = loadProgress()[ch.id] || {};
                const viewed = (p.viewed && p.viewed[l.id]);
                const b = document.createElement('button');
                b.className = 'nav-lesson' + (state.currentLessonId === l.id ? ' active' : '');
                b.innerHTML = `
                    <span>${viewed ? '✓' : '○'} ${l.title}</span>
                    <span class="ipa">${l.ipa || ''}</span>
                `;
                b.onclick = () => { state.currentLessonId = l.id; state.mode = 'lesson'; renderMain(); renderSidebar(); };
                lessonList.appendChild(b);
            });

            const quizBtn = document.createElement('button');
            quizBtn.className = 'nav-lesson nav-quiz' + (state.mode === 'quiz' ? ' active' : '');
            quizBtn.innerHTML = `<span>🎯 章節測驗 ${s.highest ? '(最高 ' + s.highest + '%)' : ''}</span>`;
            quizBtn.onclick = () => { startQuiz(ch.id); };
            lessonList.appendChild(quizBtn);

            chBtn.appendChild(lessonList);
        }
        nav.appendChild(chBtn);
    });
}

function renderTopProgress() {
    const fill = document.getElementById('top-progress-fill');
    const label = document.getElementById('top-progress-label');
    const pct = overallProgress();
    fill.style.width = pct + '%';
    label.textContent = `學習進度 ${pct}%`;
}

// ====== Main：Dashboard / Lesson / Quiz / Result ======
function renderMain() {
    const main = document.getElementById('main-content');
    if (state.mode === 'dashboard') return renderDashboard(main);
    if (state.mode === 'quiz') return renderQuizScreen(main);
    if (state.mode === 'result') return renderResultScreen(main);
    return renderLesson(main);
}

function renderDashboard(main) {
    const p = loadProgress();
    main.innerHTML = `
        <div class="main-header">
            <h1>學習儀表板</h1>
            <p class="subtitle">總覽各章節進度與測驗最高分</p>
        </div>
        <div class="dash-grid">
            ${CHAPTERS.map((ch, i) => {
                const s = chapterStats(ch);
                const lessonPct = Math.round((s.viewed / s.total) * 100);
                return `
                <div class="dash-card">
                    <div class="dash-card-head">
                        <span class="dash-num">${i + 1}</span>
                        <h3>${ch.title}</h3>
                    </div>
                    <p class="dash-intro">${ch.intro}</p>
                    <div class="dash-stats">
                        <div class="stat">
                            <div class="stat-label">已讀課程</div>
                            <div class="stat-bar"><div class="stat-fill" style="width:${lessonPct}%"></div></div>
                            <div class="stat-val">${s.viewed} / ${s.total}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">測驗最高分</div>
                            <div class="stat-bar"><div class="stat-fill" style="width:${s.highest}%"></div></div>
                            <div class="stat-val">${s.highest}%</div>
                        </div>
                    </div>
                    <button class="primary-btn" onclick="openChapter('${ch.id}')">查看章節 →</button>
                </div>
                `;
            }).join('')}
        </div>
    `;
}

function openChapter(chId) {
    state.currentChapterId = chId;
    state.currentLessonId = null;
    state.mode = 'lesson';
    renderSidebar();
    renderMain();
}

function renderLesson(main) {
    if (!state.currentChapterId) {
        state.mode = 'dashboard';
        return renderDashboard(main);
    }
    const ch = CHAPTERS.find(c => c.id === state.currentChapterId);
    if (!state.currentLessonId) {
        // Chapter overview
        main.innerHTML = `
            <div class="main-header">
                <p class="breadcrumb">${ch.titleEn}</p>
                <h1>${ch.title}</h1>
                <p class="subtitle">${ch.intro}</p>
            </div>
            <div class="lesson-list">
                ${ch.lessons.map(l => `
                    <button class="lesson-card-row" onclick="openLesson('${ch.id}','${l.id}')">
                        <div>
                            <div class="lr-title">${l.title} <span class="ipa-inline">${l.ipa || ''}</span></div>
                            <div class="lr-pattern">${l.pattern || ''}</div>
                        </div>
                        <div class="lr-arrow">→</div>
                    </button>
                `).join('')}
                <button class="quiz-cta" onclick="startQuiz('${ch.id}')">🎯 開始章節測驗（10 題）</button>
            </div>
        `;
        return;
    }
    const lesson = ch.lessons.find(l => l.id === state.currentLessonId);
    markLessonViewed(ch.id, lesson.id);
    main.innerHTML = `
        <div class="main-header">
            <p class="breadcrumb">${ch.title} · ${lesson.pattern || ''}</p>
            <h1>${lesson.title} <span class="ipa-big">${lesson.ipa || ''}</span></h1>
        </div>
        <div class="rule-block">
            <h3>📐 規則</h3>
            <p>${lesson.ruleZh}</p>
        </div>
        ${lesson.tipsZh ? `
            <div class="tips-block">
                <h3>💡 發音技巧</h3>
                <p>${lesson.tipsZh}</p>
            </div>
        ` : ''}
        <div class="examples-block">
            <h3>🔊 範例字（點擊聽發音）</h3>
            <div class="word-grid">
                ${lesson.examples.map(w => `
                    <button class="word-btn" onclick="speak('${w}')">${w}</button>
                `).join('')}
            </div>
        </div>
        ${lesson.pseudoWords && lesson.pseudoWords.length ? `
            <div class="pseudo-block">
                <h3>🧪 假字練習（不是真的字，純粹練習解碼能力）</h3>
                <p class="pseudo-hint">如果你能正確唸出這些假字，代表你真的掌握規則了，不是死背單字。</p>
                <div class="word-grid pseudo">
                    ${lesson.pseudoWords.map(w => `
                        <button class="word-btn pseudo" onclick="speak('${w}')">${w}</button>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        ${lesson.contrast ? `
            <div class="contrast-block">
                <h3>⚖️ 容易混淆的對比</h3>
                ${lesson.contrast.pairs ? `
                    <div class="contrast-pairs">
                        ${lesson.contrast.pairs.map(pair => `
                            <div class="pair">
                                <button class="word-btn" onclick="speak('${pair[0]}')">${pair[0]}</button>
                                <span class="vs">vs</span>
                                <button class="word-btn" onclick="speak('${pair[1]}')">${pair[1]}</button>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${lesson.contrast.hint ? `<p class="contrast-hint">${lesson.contrast.hint}</p>` : ''}
            </div>
        ` : ''}
        <div class="lesson-actions">
            ${nextLessonBtn(ch, lesson)}
            <button class="primary-btn" onclick="startQuiz('${ch.id}')">🎯 開始章節測驗</button>
        </div>
    `;
}

function nextLessonBtn(ch, lesson) {
    const idx = ch.lessons.findIndex(l => l.id === lesson.id);
    if (idx < 0 || idx >= ch.lessons.length - 1) return '';
    const next = ch.lessons[idx + 1];
    return `<button class="secondary-btn" onclick="openLesson('${ch.id}','${next.id}')">下一課：${next.title} →</button>`;
}

function openLesson(chId, lessonId) {
    state.currentChapterId = chId;
    state.currentLessonId = lessonId;
    state.mode = 'lesson';
    renderSidebar();
    renderMain();
    window.scrollTo(0, 0);
}

// ====== Quiz Engine ======
function buildQuizQuestions(chapter) {
    const allWords = [];
    chapter.lessons.forEach(l => {
        (l.examples || []).forEach(w => allWords.push({ word: w, lesson: l, pseudo: false }));
        (l.pseudoWords || []).forEach(w => allWords.push({ word: w, lesson: l, pseudo: true }));
    });
    const shuffled = shuffle(allWords).slice(0, 10);

    return shuffled.map((item, i) => {
        const types = ['audio2word', 'word2sound', 'fillblank'];
        // 假字不適合 word2sound（IPA 提示題）— 用 audio2word 或 fill
        const allowed = item.pseudo ? ['audio2word', 'fillblank'] : types;
        const type = allowed[Math.floor(Math.random() * allowed.length)];
        return buildQuestion(type, item, chapter, allWords);
    });
}

function buildQuestion(type, item, chapter, allWords) {
    if (type === 'audio2word') {
        // 播音、4 選 1 拼字
        const distractors = pickDistractors(allWords, item.word, 3);
        const options = shuffle([item.word, ...distractors.map(d => d.word)]);
        return {
            type,
            prompt: '聽發音，選出正確拼字：',
            audio: item.word,
            options,
            correct: item.word,
            lesson: item.lesson
        };
    }
    if (type === 'word2sound') {
        // 顯示字、選母音音
        const lesson = item.lesson;
        const correct = lesson.ipa || '/—/';
        const others = chapter.lessons.filter(l => l.ipa && l.ipa !== correct).map(l => l.ipa);
        const distractors = shuffle(others).slice(0, 3);
        // 如果同章 IPA 不足，從常見其他 IPA 補齊
        const filler = ['/æ/','/ɛ/','/ɪ/','/ɒ/','/ʌ/','/eɪ/','/iː/','/aɪ/','/oʊ/','/uː/','/ɔɪ/','/aʊ/','/ɜr/']
            .filter(x => x !== correct && !distractors.includes(x));
        while (distractors.length < 3 && filler.length) distractors.push(filler.shift());
        const options = shuffle([correct, ...distractors]);
        return {
            type,
            prompt: `「${item.word}」中的母音發什麼音？`,
            word: item.word,
            options,
            correct,
            lesson
        };
    }
    if (type === 'fillblank') {
        // 顯示部分字、填母音
        const word = item.word;
        // 找母音位置
        const vowels = ['a','e','i','o','u'];
        const positions = [];
        word.toLowerCase().split('').forEach((ch, i) => { if (vowels.includes(ch)) positions.push(i); });
        if (!positions.length) {
            return buildQuestion('audio2word', item, chapter, allWords);
        }
        const pos = positions[Math.floor(Math.random() * positions.length)];
        const blanked = word.split('').map((c, i) => i === pos ? '_' : c).join('');
        const correct = word[pos].toLowerCase();
        const options = shuffle(['a','e','i','o','u']);
        return {
            type,
            prompt: '聽發音，填入空格的母音：',
            audio: word,
            display: blanked,
            options,
            correct,
            lesson: item.lesson
        };
    }
}

function pickDistractors(allWords, target, n) {
    const pool = allWords.filter(w => w.word !== target);
    return shuffle(pool).slice(0, n);
}

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function startQuiz(chapterId) {
    const chapter = CHAPTERS.find(c => c.id === chapterId);
    state.currentChapterId = chapterId;
    state.mode = 'quiz';
    state.quiz = {
        chapterId,
        chapterTitle: chapter.title,
        questions: buildQuizQuestions(chapter),
        idx: 0,
        score: 0,
        wrong: []
    };
    renderSidebar();
    renderMain();
    window.scrollTo(0, 0);
}

function renderQuizScreen(main) {
    const q = state.quiz;
    const cur = q.questions[q.idx];
    main.innerHTML = `
        <div class="main-header">
            <p class="breadcrumb">章節測驗 · ${q.chapterTitle}</p>
            <h1>第 ${q.idx + 1} 題 / 共 ${q.questions.length} 題</h1>
            <div class="quiz-progress-bar"><div style="width:${(q.idx / q.questions.length) * 100}%"></div></div>
        </div>
        <div class="quiz-card">
            <p class="quiz-prompt">${cur.prompt}</p>
            ${renderQuestionBody(cur)}
            <div class="quiz-options">
                ${cur.options.map(opt => `
                    <button class="opt-btn" data-opt="${escapeHtml(opt)}" onclick="answerQuiz(this, '${escapeHtml(opt)}')">${escapeHtml(opt)}</button>
                `).join('')}
            </div>
            <p class="quiz-feedback" id="quiz-feedback"></p>
        </div>
        <div class="quiz-meta">
            <span>目前分數：${q.score} / ${q.idx}</span>
            <button class="secondary-btn" onclick="quitQuiz()">放棄測驗</button>
        </div>
    `;
    if (cur.audio) setTimeout(() => speak(cur.audio), 350);
}

function renderQuestionBody(q) {
    if (q.type === 'audio2word') {
        return `<div class="audio-cue"><button class="audio-btn" onclick="speak('${q.audio}')">🔊 重聽</button></div>`;
    }
    if (q.type === 'word2sound') {
        return `<div class="word-display">${escapeHtml(q.word)}<button class="audio-btn small" onclick="speak('${q.word}')">🔊</button></div>`;
    }
    if (q.type === 'fillblank') {
        return `
            <div class="word-display fillblank">${escapeHtml(q.display)}<button class="audio-btn small" onclick="speak('${q.audio}')">🔊 重聽</button></div>
            <p class="quiz-hint">提示：母音是哪一個？</p>
        `;
    }
    return '';
}

function answerQuiz(btn, opt) {
    const q = state.quiz;
    const cur = q.questions[q.idx];
    const correct = (opt.toLowerCase() === cur.correct.toLowerCase()) ||
                    (opt === cur.correct);
    document.querySelectorAll('.opt-btn').forEach(b => b.disabled = true);
    const fb = document.getElementById('quiz-feedback');
    if (correct) {
        btn.classList.add('correct');
        q.score++;
        fb.innerHTML = `<span class="fb ok">✓ 答對！</span>`;
        speak(cur.audio || cur.word || cur.correct);
    } else {
        btn.classList.add('wrong');
        document.querySelectorAll('.opt-btn').forEach(b => {
            if (b.dataset.opt === cur.correct || b.dataset.opt === escapeHtml(cur.correct)) b.classList.add('correct');
        });
        q.wrong.push({ question: cur, picked: opt });
        fb.innerHTML = `<span class="fb bad">✗ 正解：<strong>${escapeHtml(cur.correct)}</strong></span>
            <br><span class="fb-rule">規則提示：${cur.lesson.ruleZh}</span>`;
    }
    setTimeout(() => {
        q.idx++;
        if (q.idx >= q.questions.length) finishQuiz();
        else renderMain();
    }, correct ? 1100 : 2400);
}

function quitQuiz() {
    if (!confirm('確定放棄這次測驗嗎？分數不會記錄。')) return;
    state.mode = 'lesson';
    state.quiz = null;
    renderMain();
    renderSidebar();
}

function finishQuiz() {
    const q = state.quiz;
    recordQuizScore(q.chapterId, q.score, q.questions.length);
    state.mode = 'result';
    renderMain();
}

function renderResultScreen(main) {
    const q = state.quiz;
    const pct = Math.round((q.score / q.questions.length) * 100);
    const grade = pct >= 90 ? '優秀' : pct >= 80 ? '良好' : pct >= 60 ? '尚可' : '需要再加強';
    main.innerHTML = `
        <div class="main-header">
            <p class="breadcrumb">測驗結果 · ${q.chapterTitle}</p>
            <h1>${pct}% · ${grade}</h1>
            <p class="subtitle">答對 ${q.score} / ${q.questions.length} 題</p>
        </div>
        ${q.wrong.length ? `
            <div class="rule-block">
                <h3>📝 錯題複習</h3>
                <div class="wrong-list">
                    ${q.wrong.map(w => `
                        <div class="wrong-item">
                            <div class="wrong-q">${escapeHtml(w.question.prompt)} ${w.question.word ? `「${escapeHtml(w.question.word)}」` : ''}</div>
                            <div class="wrong-meta">你選：<span class="bad">${escapeHtml(w.picked)}</span> · 正解：<span class="ok">${escapeHtml(w.question.correct)}</span></div>
                            <div class="wrong-rule">規則：${w.question.lesson.ruleZh}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '<p class="subtitle">🎉 全部答對！</p>'}
        <div class="lesson-actions">
            <button class="primary-btn" onclick="startQuiz('${q.chapterId}')">🔁 再測一次</button>
            <button class="secondary-btn" onclick="state.mode='lesson';state.currentLessonId=null;renderMain();renderSidebar()">回到章節</button>
            <button class="secondary-btn" onclick="state.mode='dashboard';renderMain();renderSidebar()">儀表板</button>
        </div>
    `;
}

function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ====== Init ======
function init() {
    applyTheme(localStorage.getItem(THEME_KEY) || 'light');
    state.mode = 'dashboard';
    renderSidebar();
    renderMain();
    renderTopProgress();
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
        document.body.classList.toggle('sidebar-open');
    });
    // 點擊主內容區域時，手機版自動收起側欄
    document.getElementById('main-content').addEventListener('click', () => {
        document.body.classList.remove('sidebar-open');
    });
}
document.addEventListener('DOMContentLoaded', init);
