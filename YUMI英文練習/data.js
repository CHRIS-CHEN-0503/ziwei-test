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
                id: 'like',
                title: 'I like / I don\'t like',
                emoji: '❤️',
                desc: '看❤️或✗說出喜不喜歡',
                instruction: '看到 ❤️ 就用 I like ~，看到 ✗ 就用 I don\'t like ~',
                type: 'like'
            },
            {
                id: 'wantsome',
                title: 'Do you want some?',
                emoji: '🍽️',
                desc: '禮貌回答 Yes / No',
                instruction: 'Do you want some ~? 想要選 Yes, please. 不要選 No, thank you.',
                type: 'wantsome'
            }
        ]
    }
    // 之後上完課再 push 新的 lesson 物件到這個陣列
];
