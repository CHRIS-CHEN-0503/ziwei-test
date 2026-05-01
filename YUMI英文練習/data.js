// YUMI 英文補習班內容
// 結構：大單元 (super unit) → 單元 (unit, 每次上課一個) → 節 (section, 同單元的不同主題) → 關卡
//
// 新增規則：
//   - 同一大單元下新增單元：到對應大單元的 units 陣列 push 一個物件
//   - 新建大單元（例如升等到 ST4）：在 SUPER_UNITS 陣列 push 新物件
//   - 一個單元只有一節時也用 sections 包起來，UI 會自動跳過節選單直接進關卡
const SUPER_UNITS = [
    {
        id: 'ST3',
        title: 'ST3',
        subtitle: '補習班 ST3 課本',
        emoji: '📚',
        color: 'purple',
        units: [
            {
                id: 'u-260428',
                date: '2026-04-28',
                title: 'Unit 2 L1-L2',
                subtitle: 'What do you like to eat?',
                emoji: '🍱',
                color: 'pink',
                sections: [
                    {
                        id: 'food-likes',
                        title: 'I like / I don\'t like',
                        subtitle: '說喜歡 / 不喜歡的食物',
                        emoji: '❤️',
                        vocab: [
                            { word: 'fruit',      emoji: '🍎', zh: '水果' },
                            { word: 'meat',       emoji: '🍗', zh: '肉' },
                            { word: 'milk',       emoji: '🥛', zh: '牛奶' },
                            { word: 'pasta',      emoji: '🍝', zh: '義大利麵' },
                            { word: 'rice',       emoji: '🍚', zh: '米飯' },
                            { word: 'vegetables', emoji: '🥦', zh: '蔬菜' }
                        ],
                        stages: [
                            { id: 'pic2word',      title: '看圖選字',      emoji: '🖼️', desc: '看圖選英文',         type: 'pic2word' },
                            { id: 'word2pic',      title: '看字選圖',      emoji: '🔤', desc: '看英文選圖',         type: 'word2pic' },
                            { id: 'listen',        title: '聽聽看',        emoji: '🔊', desc: '聽聲音選圖',         type: 'listen' },
                            { id: 'speak',         title: '看圖說單字',    emoji: '🎤', desc: '按🎤大聲說',         type: 'speak' },
                            { id: 'spell',         title: '排字母',        emoji: '🧩', desc: '依序排字母',         type: 'spell' },
                            { id: 'like',          title: 'I like / don\'t like', emoji: '❤️', desc: '看❤️或✗選句子', type: 'like' },
                            { id: 'speakLike',     title: '說 I like',     emoji: '💖', desc: '說整句喜不喜歡',     type: 'speakLike' },
                            { id: 'wantsome',      title: 'Do you want some?', emoji: '🍽️', desc: '禮貌回答 Yes / No', type: 'wantsome' },
                            { id: 'speakWantSome', title: '開口回答',      emoji: '💬', desc: '說 Yes/No thank you', type: 'speakWantSome' }
                        ]
                    }
                ]
            },
            {
                id: 'u-260430',
                date: '2026-04-30',
                title: '260430 課堂',
                subtitle: 'I want some... + EA 字音',
                emoji: '🍰',
                color: 'pink',
                sections: [
                    {
                        id: 'iwant',
                        title: 'Unit 2 L3-L4 - I want some ~',
                        subtitle: '想吃想喝什麼？',
                        emoji: '🍰',
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
                            { id: 'pic2word',   title: '看圖選字',      emoji: '🖼️', desc: '看圖選英文',       type: 'pic2word' },
                            { id: 'word2pic',   title: '看字選圖',      emoji: '🔤', desc: '看英文選圖',       type: 'word2pic' },
                            { id: 'listen',     title: '聽聽看',        emoji: '🔊', desc: '聽聲音選圖',       type: 'listen' },
                            { id: 'speak',      title: '看圖說單字',    emoji: '🎤', desc: '按🎤大聲說',       type: 'speak' },
                            { id: 'spell',      title: '排字母',        emoji: '🧩', desc: '依序排字母',       type: 'spell' },
                            { id: 'iwant',      title: '我想要…',       emoji: '🍽️', desc: 'I want some ___', type: 'iwant' },
                            { id: 'speakIWant', title: '開口說 I want', emoji: '💬', desc: '說 I want some ~', type: 'speakIWant' }
                        ]
                    },
                    {
                        id: 'ea-phonics',
                        title: 'EA Phonics 字音 /iː/',
                        subtitle: 'ea 字母組合的長音',
                        emoji: '🌈',
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
                            { id: 'pic2word', title: '看圖選字',   emoji: '🖼️', desc: '看圖選英文', type: 'pic2word' },
                            { id: 'word2pic', title: '看字選圖',   emoji: '🔤', desc: '看英文選圖', type: 'word2pic' },
                            { id: 'listen',   title: '聽聽看',     emoji: '🔊', desc: '聽聲音選圖', type: 'listen' },
                            { id: 'speak',    title: '看圖說單字', emoji: '🎤', desc: '按🎤大聲說', type: 'speak' },
                            { id: 'spell',    title: '排字母',     emoji: '🧩', desc: '依序排字母', type: 'spell' }
                        ]
                    }
                ]
            }
        ]
    }
];
