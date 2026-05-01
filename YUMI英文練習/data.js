// YUMI 英文補習班內容 - 每次上完課新增一個 lesson
// 新增方式：複製一個 lesson 物件，更新 id / title / date / vocab / stages 即可
const LESSONS = [
    {
        id: 'unit2-food',
        title: 'Unit 2 - What do you like to eat?',
        subtitle: '美食大集合：說出喜歡 / 不喜歡的食物',
        emoji: '🍱',
        date: '2026-04-28',
        color: 'purple',
        vocab: [
            { word: 'fruit',      emoji: '🍎', zh: '水果' },
            { word: 'meat',       emoji: '🍗', zh: '肉' },
            { word: 'milk',       emoji: '🥛', zh: '牛奶' },
            { word: 'pasta',      emoji: '🍝', zh: '義大利麵' },
            { word: 'rice',       emoji: '🍚', zh: '米飯' },
            { word: 'vegetables', emoji: '🥦', zh: '蔬菜' }
        ],
        // 每關獨立題庫；玩遊戲時會隨機抽 5 題
        stages: [
            {
                id: 'pic2word',
                title: '看圖選字',
                emoji: '🖼️',
                desc: '看圖片選出對的英文',
                instruction: 'What is this? 點出正確的英文單字',
                type: 'pic2word'
            },
            {
                id: 'word2pic',
                title: '看字選圖',
                emoji: '🔤',
                desc: '看英文選出對的圖',
                instruction: 'Find the picture! 點出對應的圖',
                type: 'word2pic'
            },
            {
                id: 'listen',
                title: '聽聽看',
                emoji: '🔊',
                desc: '聽聲音選出對的圖',
                instruction: 'Listen and pick! 按 🔊 聽單字後選圖',
                type: 'listen'
            },
            {
                id: 'speak',
                title: '看圖說單字',
                emoji: '🎤',
                desc: '看圖片大聲說英文',
                instruction: '按🎤後大聲說出單字！',
                type: 'speak'
            },
            {
                id: 'spell',
                title: '排字母',
                emoji: '🧩',
                desc: '依序點字母拼出單字',
                instruction: '依序點字母拼出英文單字',
                type: 'spell'
            },
            {
                id: 'like',
                title: 'I like / I don\'t like',
                emoji: '❤️',
                desc: '看❤️或✗選句子',
                instruction: '看到 ❤️ 就用 I like ~，看到 ✗ 就用 I don\'t like ~',
                type: 'like'
            },
            {
                id: 'speakLike',
                title: '說 I like',
                emoji: '💖',
                desc: '說出整句喜不喜歡',
                instruction: '看到 ❤️ 大聲說 I like ~，看到 ✗ 說 I don\'t like ~',
                type: 'speakLike'
            },
            {
                id: 'wantsome',
                title: 'Do you want some?',
                emoji: '🍽️',
                desc: '禮貌回答 Yes / No',
                instruction: 'Do you want some ~? 想要選 Yes, please. 不要選 No, thank you.',
                type: 'wantsome'
            },
            {
                id: 'speakWantSome',
                title: '開口回答',
                emoji: '💬',
                desc: '用嘴巴回答想不想要',
                instruction: '聽到問題後說 Yes, please. 或 No, thank you.',
                type: 'speakWantSome'
            }
        ]
    },
    {
        id: 'unit2-iwant',
        title: 'Unit 2 L3-L4 - I want some...',
        subtitle: '想吃想喝什麼？學會用 I want some ~',
        emoji: '🍰',
        date: '2026-04-30',
        color: 'pink',
        vocab: [
            { word: 'cake',       emoji: '🍰', zh: '蛋糕' },
            { word: 'honey',      emoji: '🍯', zh: '蜂蜜' },
            { word: 'juice',      emoji: '🧃', zh: '果汁' },
            { word: 'pasta',      emoji: '🍝', zh: '義大利麵' },
            { word: 'fruit',      emoji: '🍎', zh: '水果' },
            { word: 'milk',       emoji: '🥛', zh: '牛奶' },
            { word: 'peas',       emoji: '🟢', zh: '豌豆' },
            { word: 'meat',       emoji: '🍗', zh: '肉' },
            { word: 'beans',      emoji: '🫘', zh: '豆子' },
            { word: 'vegetables', emoji: '🥦', zh: '蔬菜' }
        ],
        stages: [
            { id: 'pic2word',   title: '看圖選字',   emoji: '🖼️', desc: '看圖選英文',           type: 'pic2word' },
            { id: 'word2pic',   title: '看字選圖',   emoji: '🔤', desc: '看英文選圖',           type: 'word2pic' },
            { id: 'listen',     title: '聽聽看',     emoji: '🔊', desc: '聽聲音選圖',           type: 'listen' },
            { id: 'speak',      title: '看圖說單字', emoji: '🎤', desc: '按🎤大聲說',           type: 'speak' },
            { id: 'spell',      title: '排字母',     emoji: '🧩', desc: '依序排字母',           type: 'spell' },
            { id: 'iwant',      title: '我想要…',    emoji: '🍽️', desc: 'I want some ___',     type: 'iwant' },
            { id: 'speakIWant', title: '開口說 I want', emoji: '💬', desc: '說 I want some ~',  type: 'speakIWant' }
        ]
    },
    {
        id: 'phonics-ea',
        title: 'Easy EA Words 字音練習',
        subtitle: 'ea 字母組合的長音 /iː/',
        emoji: '🌈',
        date: '2026-04-30',
        color: 'purple',
        vocab: [
            { word: 'leaf',  emoji: '🍃', zh: '葉子' },
            { word: 'seal',  emoji: '🦭', zh: '海豹' },
            { word: 'beach', emoji: '🏖️', zh: '海灘' },
            { word: 'meat',  emoji: '🍗', zh: '肉' },
            { word: 'peach', emoji: '🍑', zh: '桃子' },
            { word: 'read',  emoji: '📖', zh: '讀' },
            { word: 'leap',  emoji: '🤸', zh: '跳' },
            { word: 'meal',  emoji: '🍱', zh: '一餐' }
        ],
        stages: [
            { id: 'pic2word', title: '看圖選字',   emoji: '🖼️', desc: '看圖選英文',  type: 'pic2word' },
            { id: 'word2pic', title: '看字選圖',   emoji: '🔤', desc: '看英文選圖',  type: 'word2pic' },
            { id: 'listen',   title: '聽聽看',     emoji: '🔊', desc: '聽聲音選圖',  type: 'listen' },
            { id: 'speak',    title: '看圖說單字', emoji: '🎤', desc: '按🎤大聲說',  type: 'speak' },
            { id: 'spell',    title: '排字母',     emoji: '🧩', desc: '依序排字母',  type: 'spell' }
        ]
    }
    // 之後上完課再 push 新的 lesson 物件到這個陣列
];
