// YUMI 英文補習班內容
// 結構：大單元 (super unit) → 單元 (unit, 每次上課一個) → 節 (section, 同單元的不同主題) → 關卡
//
// 新增規則：
//   - 同一大單元下新增單元：到對應大單元的 units 陣列 push 一個物件
//   - 新建大單元（例如升等到 ST4）：在 SUPER_UNITS 陣列 push 新物件
//   - 一個單元只有一節時也用 sections 包起來，UI 會自動跳過節選單直接進關卡
//
// 【關卡設計準則】每節只挑 3 個最有學習效益的關卡，不超載小朋友。建議組合：
//   有句型：listen（聽辨）→ speak（單字口說）→ speakXXX（整句口說）
//   純單字：listen → speak → spell（拼字）
//   數字：countpic（數一數）→ listen → speak
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
                            { id: 'listen',    title: '聽聽看',     emoji: '🔊', desc: '聽聲音選圖',         type: 'listen' },
                            { id: 'speak',     title: '看圖說單字', emoji: '🎤', desc: '按🎤大聲說',         type: 'speak' },
                            { id: 'speakLike', title: '說 I like',  emoji: '💖', desc: '說整句喜不喜歡',     type: 'speakLike' }
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
                            { id: 'listen',     title: '聽聽看',        emoji: '🔊', desc: '聽聲音選圖',       type: 'listen' },
                            { id: 'speak',      title: '看圖說單字',    emoji: '🎤', desc: '按🎤大聲說',       type: 'speak' },
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
                            { id: 'listen', title: '聽聽看',     emoji: '🔊', desc: '聽聲音選圖', type: 'listen' },
                            { id: 'speak',  title: '看圖說單字', emoji: '🎤', desc: '按🎤大聲說', type: 'speak' },
                            { id: 'spell',  title: '排字母',     emoji: '🧩', desc: '依序排字母', type: 'spell' }
                        ]
                    }
                ]
            },
            {
                id: 'u-260511',
                date: '2026-05-11',
                title: '260511 課堂',
                subtitle: '數字 11-15、I want to eat、水果、Would you like some',
                emoji: '🔢',
                color: 'pink',
                sections: [
                    {
                        id: 'numbers-11-15',
                        title: '數字 11-15',
                        subtitle: 'eleven, twelve, thirteen, fourteen, fifteen',
                        emoji: '🔢',
                        vocab: [
                            { word: 'eleven',   emoji: '1️⃣1️⃣', zh: '11', count: 11 },
                            { word: 'twelve',   emoji: '1️⃣2️⃣', zh: '12', count: 12 },
                            { word: 'thirteen', emoji: '1️⃣3️⃣', zh: '13', count: 13 },
                            { word: 'fourteen', emoji: '1️⃣4️⃣', zh: '14', count: 14 },
                            { word: 'fifteen',  emoji: '1️⃣5️⃣', zh: '15', count: 15 }
                        ],
                        stages: [
                            { id: 'countpic', title: '數一數',       emoji: '🧮', desc: '數一數選英文', type: 'countpic' },
                            { id: 'listen',   title: '聽聽看',       emoji: '🔊', desc: '聽聲音選數字', type: 'listen' },
                            { id: 'speak',    title: '看數字說英文', emoji: '🎤', desc: '按🎤大聲說',   type: 'speak' }
                        ]
                    },
                    {
                        id: 'iwant-toeat',
                        title: 'Lesson 5 - I want ~ to eat',
                        subtitle: '想吃什麼？meat, peas, beans, peaches',
                        emoji: '🍴',
                        vocab: [
                            { word: 'meat',    emoji: '🍗', zh: '肉' },
                            { word: 'peas',    emoji: '🟢', zh: '豌豆' },
                            { word: 'beans',   emoji: '🫘', zh: '豆子' },
                            { word: 'peaches', emoji: '🍑', zh: '桃子' }
                        ],
                        stages: [
                            { id: 'listen',          title: '聽聽看',               emoji: '🔊', desc: '聽聲音選圖',                type: 'listen' },
                            { id: 'speak',           title: '看圖說單字',           emoji: '🎤', desc: '按🎤大聲說',                type: 'speak' },
                            { id: 'speakIWantToEat', title: '開口說 I want to eat', emoji: '💬', desc: '說整句 I want ~ to eat',    type: 'speakIWantToEat' }
                        ]
                    },
                    {
                        id: 'fruits-where',
                        title: '水果單字 Where are all the ~?',
                        subtitle: '蘋果、香蕉、橘子、葡萄、梨子、草莓',
                        emoji: '🍇',
                        vocab: [
                            { word: 'pears',        emoji: '🍐', zh: '梨子' },
                            { word: 'apples',       emoji: '🍎', zh: '蘋果' },
                            { word: 'bananas',      emoji: '🍌', zh: '香蕉' },
                            { word: 'oranges',      emoji: '🍊', zh: '橘子' },
                            { word: 'grapes',       emoji: '🍇', zh: '葡萄' },
                            { word: 'strawberries', emoji: '🍓', zh: '草莓' }
                        ],
                        stages: [
                            { id: 'listen', title: '聽聽看',     emoji: '🔊', desc: '聽聲音選圖', type: 'listen' },
                            { id: 'speak',  title: '看圖說單字', emoji: '🎤', desc: '按🎤大聲說', type: 'speak' },
                            { id: 'spell',  title: '排字母',     emoji: '🧩', desc: '依序排字母', type: 'spell' }
                        ]
                    },
                    {
                        id: 'wouldyou',
                        title: 'Lesson 6 - Would you like some?',
                        subtitle: '禮貌問與答：Yes, please. / No, thank you.',
                        emoji: '🤔',
                        vocab: [
                            { word: 'strawberries', emoji: '🍓', zh: '草莓' },
                            { word: 'oranges',      emoji: '🍊', zh: '橘子' },
                            { word: 'grapes',       emoji: '🍇', zh: '葡萄' },
                            { word: 'peas',         emoji: '🟢', zh: '豌豆' }
                        ],
                        stages: [
                            { id: 'listen',        title: '聽聽看',             emoji: '🔊', desc: '聽聲音選圖',           type: 'listen' },
                            { id: 'speak',         title: '看圖說單字',         emoji: '🎤', desc: '按🎤大聲說',           type: 'speak' },
                            { id: 'speakWouldYou', title: '開口回答 Would you', emoji: '💬', desc: '說 Yes/No, thank you', type: 'speakWouldYou' }
                        ]
                    }
                ]
            }
        ]
    }
];

// =========================================================
// 劇情練習：讀繪本，整句念誦 / 句子分解念誦 / 可調速度
// 與 SUPER_UNITS 完全分開
// 結構：故事 STORIES → 頁 pages → 句 sentences → 分解 chunks
// =========================================================
const STORIES = [
    {
        id: 'i-am-an-elephant',
        title: "I'm an Elephant",
        subtitle: 'Unit 3（ay 字音）· 大象自我介紹歌謠',
        emoji: '🐘',
        author: 'Unit 3 Chant',
        pages: [
            {
                id: 'p1',
                title: 'Page 18 - 大象介紹自己',
                emoji: '🐘',
                sentences: [
                    { text: "I'm an elephant.",        chunks: ["I'm an", "elephant."] },
                    { text: "I'm big and gray.",       chunks: ["I'm big", "and gray."] },
                    { text: "This is my trunk,",       chunks: ["This is", "my trunk,"] },
                    { text: "And this is my tail.",   chunks: ["And this is", "my tail."] }
                ]
            },
            {
                id: 'p2',
                title: 'Page 18 - 大象會做的事 (chant)',
                emoji: '🎵',
                sentences: [
                    { text: "I can stomp, stomp, stomp.",   chunks: ["I can", "stomp,", "stomp,", "stomp."] },
                    { text: "I can spray, spray, spray.",   chunks: ["I can", "spray,", "spray,", "spray."] },
                    { text: "I can eat, eat, eat,",         chunks: ["I can", "eat,", "eat,", "eat,"] },
                    { text: "Lots of hay, hay, hay.",       chunks: ["Lots of", "hay,", "hay,", "hay."] }
                ]
            }
        ]
    },
    {
        id: 'i-can-see-you',
        title: 'I Can See You!',
        subtitle: 'Oxford Read and Imagine（捉迷藏故事）',
        emoji: '👀',
        author: 'Paul Shipton',
        videoUrl: 'https://www.youtube.com/watch?v=uD9TXg1WtqM',
        pages: [
            {
                id: 'p1',
                title: 'Page 2-3 - 自我介紹',
                emoji: '👋',
                sentences: [
                    { text: 'Hello!',              chunks: ['Hello!'] },
                    { text: 'My name is Rosie.',   chunks: ['My name', 'is Rosie.'] },
                    { text: 'My name is Ben.',     chunks: ['My name', 'is Ben.'] },
                    { text: 'This is Grandpa.',    chunks: ['This is', 'Grandpa.'] },
                    { text: "Now let's read this story, I Can See You!",
                      chunks: ['Now', "let's read", 'this story,', 'I Can See You!'] }
                ]
            },
            {
                id: 'p2',
                title: 'Page 4-5 - 玩遊戲',
                emoji: '🎮',
                sentences: [
                    { text: 'Rosie and Alice are best friends.',
                      chunks: ['Rosie and Alice', 'are best friends.'] },
                    { text: "Rosie says, Let's play!",
                      chunks: ['Rosie says,', "Let's play!"] },
                    { text: 'OK! say Alice and Ben.',
                      chunks: ['OK!', 'say Alice', 'and Ben.'] },
                    { text: 'Clunk the robot has a slice of pizza.',
                      chunks: ['Clunk', 'the robot', 'has a slice', 'of pizza.'] },
                    { text: 'Clunk asks, Can I play?',
                      chunks: ['Clunk asks,', 'Can I play?'] },
                    { text: 'Yes, says Ben.',
                      chunks: ['Yes,', 'says Ben.'] }
                ]
            },
            {
                id: 'p3',
                title: 'Page 6-7 - 捉迷藏開始',
                emoji: '🙈',
                sentences: [
                    { text: 'Rosie closes her eyes.',
                      chunks: ['Rosie closes', 'her eyes.'] },
                    { text: 'She counts: One, two, three, four, five.',
                      chunks: ['She counts:', 'One, two, three,', 'four, five.'] },
                    { text: 'Alice, Ben, and Clunk run.',
                      chunks: ['Alice, Ben,', 'and Clunk', 'run.'] },
                    { text: 'Six, seven, eight, nine, ten.',
                      chunks: ['Six, seven,', 'eight, nine, ten.'] },
                    { text: "I'm coming! says Rosie.",
                      chunks: ["I'm coming!", 'says Rosie.'] },
                    { text: 'Where are you?',
                      chunks: ['Where', 'are you?'] },
                    { text: 'She runs to her bedroom and looks under the bed.',
                      chunks: ['She runs', 'to her bedroom', 'and looks', 'under the bed.'] }
                ]
            },
            {
                id: 'p4',
                title: 'Page 8-9 - 找到 Ben！',
                emoji: '👕',
                sentences: [
                    { text: 'Then Rosie opens the wardrobe.',
                      chunks: ['Then Rosie', 'opens', 'the wardrobe.'] },
                    { text: 'I can see you, Ben! says Rosie.',
                      chunks: ['I can see you,', 'Ben!', 'says Rosie.'] },
                    { text: "You're in my wardrobe!",
                      chunks: ["You're", 'in my wardrobe!'] },
                    { text: 'Rosie and Ben go to the living room.',
                      chunks: ['Rosie and Ben', 'go to', 'the living room.'] },
                    { text: "Ben asks, Where's Alice?",
                      chunks: ['Ben asks,', "Where's Alice?"] },
                    { text: 'They look behind the couch.',
                      chunks: ['They look', 'behind the couch.'] }
                ]
            },
            {
                id: 'p5',
                title: 'Page 10-11 - Clunk 不見了',
                emoji: '🔍',
                sentences: [
                    { text: 'Then they look behind the big, orange chair.',
                      chunks: ['Then they look', 'behind', 'the big,', 'orange chair.'] },
                    { text: 'Ben says, I can see you, Alice!',
                      chunks: ['Ben says,', 'I can see you,', 'Alice!'] },
                    { text: "Rosie says, You're behind the chair!",
                      chunks: ['Rosie says,', "You're", 'behind the chair!'] },
                    { text: "Alice asks, Where's Clunk?",
                      chunks: ['Alice asks,', "Where's Clunk?"] },
                    { text: 'The children look and look.',
                      chunks: ['The children', 'look and look.'] },
                    { text: "Rosie says, He isn't in the bathroom.",
                      chunks: ['Rosie says,', "He isn't", 'in the bathroom.'] },
                    { text: "Alice says, He isn't in the hall.",
                      chunks: ['Alice says,', "He isn't", 'in the hall.'] },
                    { text: "Ben says, He isn't here in the kitchen.",
                      chunks: ['Ben says,', "He isn't here", 'in the kitchen.'] }
                ]
            },
            {
                id: 'p6',
                title: 'Page 12-13 - 抓到 Clunk！',
                emoji: '🤖',
                sentences: [
                    { text: 'Where IS he? asks Ben.',
                      chunks: ['Where IS he?', 'asks Ben.'] },
                    { text: "Rosie points and says, What's this on the floor?",
                      chunks: ['Rosie points', 'and says,', "What's this", 'on the floor?'] },
                    { text: "It's cheese! says Alice.",
                      chunks: ["It's cheese!", 'says Alice.'] },
                    { text: 'The children look up.',
                      chunks: ['The children', 'look up.'] },
                    { text: 'We can see you, Clunk! says Ben.',
                      chunks: ['We can see you,', 'Clunk!', 'says Ben.'] },
                    { text: "You're on the ceiling. And you're eating your pizza!",
                      chunks: ["You're", 'on the ceiling.', "And you're eating", 'your pizza!'] }
                ]
            }
        ]
    }
];
