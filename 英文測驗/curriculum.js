// 英文拼音 Phonics 課程資料
// 結構：CHAPTERS → lessons → examples + pseudoWords + ruleZh
// 目標讀者：成人初學者 / 想補強解碼能力 (decoding) 的人
// 假字 (pseudo-words) 用來驗證學員真的掌握規則，而不是死背單字

const CHAPTERS = [
    // =====================================================
    // 第一章：短母音與 CVC 字
    // =====================================================
    {
        id: 'ch1',
        title: '第一章：短母音與 CVC 字',
        titleEn: 'Short Vowels & CVC Words',
        intro: 'CVC 是 Consonant–Vowel–Consonant（子音–母音–子音）的縮寫，是英文最基礎也最規律的單字結構，例如 cat、bed、pig。當母音被前後子音「夾住」時，多半發短音。掌握五個短母音是英文拼音的第一塊基石。',
        lessons: [
            {
                id: 'short-a',
                title: '短母音 a',
                ipa: '/æ/',
                pattern: 'CVC（如 c-a-t）',
                ruleZh: '當 a 處在 CVC 結構中（前後都是子音），發 /æ/ 的音。',
                tipsZh: '舌頭放低、嘴巴像「笑開」一樣張開、嘴角往兩側拉。發音偏中文「ㄝ」與「ㄚ」之間，但比兩者都更扁、更亮。',
                examples: ['cat','bag','man','hat','map','jam','ran','fan','pan','sat','ham','bat','can','fat','gas','tap','dad','mad','sad','nap','wax','lap','jab','rat'],
                pseudoWords: ['nab','zat','fap','vab','jat','hab','quap','zan'],
                contrast: { vowels: ['e','i','o','u'], hint: '注意不要唸成 cet（短 e）或 cot（短 o）' }
            },
            {
                id: 'short-e',
                title: '短母音 e',
                ipa: '/ɛ/',
                pattern: 'CVC（如 b-e-d）',
                ruleZh: '當 e 處在 CVC 結構中，發 /ɛ/ 的音。',
                tipsZh: '嘴巴開度比短 a 小一點，像中文「ㄝ」（夜的開頭），但更短促有力。下巴位置介於短 i 和短 a 之間。',
                examples: ['bed','red','leg','ten','get','men','hen','pen','web','vet','set','jet','let','met','net','fed','led','beg','peg','egg','wet','yes','den','tell'],
                pseudoWords: ['neb','zet','fep','vem','jeb','hep','quep','zel'],
                contrast: { vowels: ['a','i','o','u'], hint: 'bed 不是 bad、不是 bid' }
            },
            {
                id: 'short-i',
                title: '短母音 i',
                ipa: '/ɪ/',
                pattern: 'CVC（如 p-i-g）',
                ruleZh: '當 i 處在 CVC 結構中，發 /ɪ/ 的音。',
                tipsZh: '嘴巴開很小、唇形放鬆。像中文「ㄧ」但短而模糊，絕對不是長 ee 的清楚 /iː/。請特別注意 sit /sɪt/ vs seat /siːt/ 的差別。',
                examples: ['fin','bin','win','pin','fit','hit','sit','bit','pit','lip','dip','rip','tip','big','dig','fig','pig','wig','kid','lid','his','him','six','mix'],
                pseudoWords: ['nip','zit','blim','vib','jid','hib','quik','ziv'],
                contrast: { vowels: ['a','e','o','u'], hint: 'sit ≠ set（短 e），bit ≠ bat（短 a）' }
            },
            {
                id: 'short-o',
                title: '短母音 o',
                ipa: '/ɒ/ 或 /ɑ/',
                pattern: 'CVC（如 d-o-g）',
                ruleZh: '當 o 處在 CVC 結構中，美式英語通常發 /ɑ/，英式發 /ɒ/。',
                tipsZh: '嘴巴張到最大，舌頭往後縮、下巴下沉。美式發音聽起來像「啊」，英式則嘴形更圓一點。常與短 u 混淆，請刻意誇張嘴形。',
                examples: ['top','mop','hop','pop','dog','log','fog','jog','dot','hot','lot','not','pot','cot','box','fox','cob','job','rod','sob','nod','mom','sock','rock'],
                pseudoWords: ['nop','zot','flop','vob','jod','hob','quop','zol'],
                contrast: { vowels: ['a','e','i','u'], hint: 'hot ≠ hat，cot ≠ cut' }
            },
            {
                id: 'short-u',
                title: '短母音 u',
                ipa: '/ʌ/',
                pattern: 'CVC（如 c-u-p）',
                ruleZh: '當 u 處在 CVC 結構中，發 /ʌ/ 的音。',
                tipsZh: '嘴巴半開、放鬆、無圓唇。像中文「ㄜ」（嗯的口型）但下巴更張開。是英文最「無感情」的母音，但別與輕讀的 schwa /ə/ 弄混。',
                examples: ['bug','hug','jug','mug','rug','tug','bun','fun','run','sun','cup','pup','cut','but','gut','hut','nut','mud','bud','cub','tub','gum','duck','lump'],
                pseudoWords: ['nub','zut','plum','vub','jud','hub','quup','zul'],
                contrast: { vowels: ['a','e','i','o'], hint: 'cut ≠ cot，bug ≠ big' }
            }
        ]
    },

    // =====================================================
    // 第二章：長母音與 Magic E、母音組合
    // =====================================================
    {
        id: 'ch2',
        title: '第二章：長母音、Magic E 與母音組合',
        titleEn: 'Long Vowels, Silent E & Vowel Teams',
        intro: '長母音的發音就是字母自己的名字（A、E、I、O、U）。最常見的兩種長母音規則：(1) Magic E — 單字以「子音 + e」結尾時，前面的母音變長音、字尾 e 不發音；(2) 母音組合 (Vowel Teams) — 兩個母音在一起時，通常第一個唸自己的名字。',
        lessons: [
            {
                id: 'a-e',
                title: 'a_e（Magic E）',
                ipa: '/eɪ/',
                pattern: 'a + 子音 + e（如 c-a-k-e）',
                ruleZh: 'CVCe 結構時，a 唸長音 /eɪ/（讀作「ㄟ」），結尾的 e 不發音。',
                tipsZh: '把字尾的 e 當成「魔法 e」— 它跳過中間的子音，讓 a 變成自己的名字。比較 cap（短 a）vs cape（長 a）。',
                examples: ['cake','lake','name','gate','late','made','came','take','place','plane','blame','brave','date','face','game','grape','make','page','rake','sale','same','save','tape','wake'],
                pseudoWords: ['nake','zape','flate','vace','jane','quave'],
                contrast: { pairs: [['cap','cape'],['mad','made'],['hat','hate']], hint: '加上 e 之後，前面的 a 變長音' }
            },
            {
                id: 'i-e',
                title: 'i_e（Magic E）',
                ipa: '/aɪ/',
                pattern: 'i + 子音 + e（如 p-i-n-e）',
                ruleZh: 'CVCe 結構時，i 唸長音 /aɪ/（讀作「ㄞ」）。',
                tipsZh: 'pin → pine 的轉變最經典：加 e 後 i 變成「ㄞ」。',
                examples: ['pine','line','time','ride','side','mine','fine','kite','bite','white','slide','smile','bike','dime','file','hide','life','like','nine','price','rice','wide','wine','wipe'],
                pseudoWords: ['nipe','zime','flite','vibe','jine','quive'],
                contrast: { pairs: [['pin','pine'],['bit','bite'],['kit','kite']], hint: '注意 i 從短音 /ɪ/ 變長音 /aɪ/' }
            },
            {
                id: 'o-e',
                title: 'o_e（Magic E）',
                ipa: '/oʊ/',
                pattern: 'o + 子音 + e（如 h-o-m-e）',
                ruleZh: 'CVCe 結構時，o 唸長音 /oʊ/（讀作「ㄡ」）。',
                tipsZh: '嘴巴從半開往圓嘴收，類似中文「歐」。',
                examples: ['home','bone','hope','rope','role','dome','stone','phone','smoke','broke','note','pose','rode','rose','tone','vote','woke','globe','code','hose','joke','pole','wove','choke'],
                pseudoWords: ['nope','zone','flode','vose','joke','quobe'],
                contrast: { pairs: [['hop','hope'],['not','note']], hint: 'hot → hote 嗎？不對，是 hote 唸不出來，正確是 note / hope 等' }
            },
            {
                id: 'u-e',
                title: 'u_e（Magic E）',
                ipa: '/juː/ 或 /uː/',
                pattern: 'u + 子音 + e（如 c-u-b-e）',
                ruleZh: 'CVCe 結構時，u 唸長音 /juː/（cube）或 /uː/（rude）— 前者帶「y」滑音、後者不帶，取決於前面是什麼子音。',
                tipsZh: 'c/m/p/f + u_e 多半帶 y 音：cute、mute、puke；r/l/s/j 等則純 /uː/：rude、June、blue。',
                examples: ['cute','mute','cube','tube','use','fuse','huge','duke','dune','flute','prune','rude','tune','rule','crude','mule','plume','perfume','assume','consume','cure','pure'],
                pseudoWords: ['nute','zube','flute','vule','jude','quume'],
                contrast: { pairs: [['cub','cube'],['cut','cute']], hint: 'cute 帶 y 音 /kjuːt/，rude 不帶 /ruːd/' }
            },
            {
                id: 'vowel-teams',
                title: '母音組合 (Vowel Teams)',
                ipa: '/eɪ/、/iː/、/oʊ/、/uː/ 等',
                pattern: 'ai / ay / ee / ea / ie / oa / oe / ui',
                ruleZh: '兩個母音手牽手，第一個母音唸自己的名字（"When two vowels go walking, the first does the talking"）。',
                tipsZh: 'ai/ay 都唸 /eɪ/；ee/ea 都唸 /iː/；oa/oe 都唸 /oʊ/；ui/ue 多半唸 /uː/。位置規則：ai 用在字中、ay 用在字尾；ee/ea 都可在字中或字尾。',
                examples: ['rain','train','wait','play','day','say','see','bee','tree','eat','sea','beach','pie','lie','tie','boat','coat','road','toe','hoe','suit','fruit','clue','blue'],
                pseudoWords: ['blain','spay','dree','feab','sloat','vuit'],
                contrast: { hint: 'sail / sale 同音不同拼；meet / meat 同音不同字' }
            }
        ]
    },

    // =====================================================
    // 第三章：子音群與雙子音
    // =====================================================
    {
        id: 'ch3',
        title: '第三章：子音群 (Blends) 與雙子音 (Digraphs)',
        titleEn: 'Consonant Blends & Digraphs',
        intro: '子音群 (Blends) 是兩個子音同時發音、能聽出兩個音；雙子音 (Digraphs) 是兩個字母合成一個新音、聽不到原本字母音。例如 bl 唸 /bl/（聽得到 b 跟 l），但 sh 唸 /ʃ/（聽不到 s 跟 h）。',
        lessons: [
            {
                id: 'l-blends',
                title: 'L 子音群',
                ipa: '/bl/、/cl/、/fl/、/gl/、/pl/、/sl/',
                pattern: 'bl, cl, fl, gl, pl, sl + 母音',
                ruleZh: 'L 子音群：第一個子音與 L 連續快速發音，中間不可加母音。',
                tipsZh: '中文母語者常在子音群中間插入「ㄜ」音（plant 唸成 「ㄆ-ㄜ-蘭」）。要刻意把兩個子音黏緊，不要分開。',
                examples: ['blue','black','blow','blink','clap','clean','clock','close','flag','flat','fly','flip','glad','glass','glow','glue','plan','play','plant','plus','sled','slim','slow','slip'],
                pseudoWords: ['blop','clad','flim','glat','plub','sleb'],
                contrast: { hint: 'play 不是 pa-lay；clap 不是 ca-lap' }
            },
            {
                id: 'r-blends',
                title: 'R 子音群',
                ipa: '/br/、/cr/、/dr/、/fr/、/gr/、/pr/、/tr/',
                pattern: 'br, cr, dr, fr, gr, pr, tr + 母音',
                ruleZh: 'R 子音群：第一個子音與 R 連續快速發音。tr 與 dr 後接 r 時常變音為 /tʃr/、/dʒr/。',
                tipsZh: '英文的 r 不捲舌、只是嘴形變圓。tree 聽起來接近「chree」、dry 接近「jry」— 不是錯誤，是英文母語者的自然發音。',
                examples: ['brave','bread','brick','bring','crab','crash','cry','crown','drop','dream','drink','drive','frog','fresh','from','friend','grape','great','green','grow','print','prize','train','tree'],
                pseudoWords: ['brod','crep','drum','frab','grit','prol','trib'],
                contrast: { hint: 'br vs bl 容易混（bread vs blood）；tr 與 ch 聽起來相近' }
            },
            {
                id: 's-blends',
                title: 'S 子音群',
                ipa: '/sc/、/sk/、/sm/、/sn/、/sp/、/st/、/sw/',
                pattern: 'sc, sk, sm, sn, sp, st, sw + 母音',
                ruleZh: 'S 子音群：s 與後面子音連續快速發音。',
                tipsZh: 's 的氣音要短，馬上接到下一個子音。stop 不是 「ㄙ-ㄉㄚㄆ」，而是 /stɒp/，s 跟 t 緊黏。',
                examples: ['scare','scout','school','skate','sky','ski','small','smile','smell','snake','snow','snap','spell','speak','spot','star','stop','stand','swim','sweet','swan','sweep','scan','smart'],
                pseudoWords: ['scad','skib','smup','snel','spom','stik','swab'],
                contrast: { hint: '注意：school 的 sch 唸 /sk/ 不是 /ʃ/' }
            },
            {
                id: 'digraphs',
                title: '雙子音 (Digraphs)',
                ipa: '/ʃ/、/tʃ/、/θ/ 或 /ð/、/w/、/f/、/ŋ/',
                pattern: 'sh, ch, th, wh, ph, ng',
                ruleZh: '兩個字母合成一個新音，聽不到原本字母：sh = /ʃ/（噓）、ch = /tʃ/（church）、th = /θ/ 或 /ð/（咬舌）、wh ≈ /w/、ph = /f/、ng = /ŋ/（鼻音）。',
                tipsZh: 'th 是中文沒有的音：把舌尖輕輕咬在牙齒之間、吐氣（think 的 th 不出聲；this 的 th 出聲）。ng 不要硬發 g 音，而是鼻腔共振。',
                examples: ['ship','shop','shoe','fish','wash','chair','cheese','cheap','catch','rich','think','three','this','that','bath','when','where','why','phone','photo','graph','sing','ring','king'],
                pseudoWords: ['shup','chab','thom','whig','phub','rang','shek'],
                contrast: { pairs: [['ship','sip'],['chat','cat'],['thin','tin']], hint: 'sh ≠ s；ch ≠ c；th ≠ t' }
            }
        ]
    },

    // =====================================================
    // 第四章：雙母音與 R 控制母音
    // =====================================================
    {
        id: 'ch4',
        title: '第四章：雙母音 (Diphthongs) 與 R 控制母音',
        titleEn: 'Diphthongs & R-Controlled Vowels',
        intro: '雙母音是嘴形從一個母音「滑」到另一個母音的音（如 oy 從 /o/ 滑到 /ɪ/）。R 控制母音是母音後面接 r 時，母音被「染色」，變成全新的音 — 完全不發原本的短音或長音。',
        lessons: [
            {
                id: 'oi-oy',
                title: 'oi / oy',
                ipa: '/ɔɪ/',
                pattern: 'oi 在字中、oy 在字尾',
                ruleZh: 'oi 與 oy 同音，發 /ɔɪ/，類似中文「歐ㄧ」連讀。',
                tipsZh: '嘴形先圓嘴（o）再裂嘴（i），一個動作完成。位置規則：字中用 oi（coin），字尾用 oy（boy）。',
                examples: ['boy','toy','joy','enjoy','soy','annoy','royal','loyal','coin','oil','soil','boil','noise','voice','choice','point','join','spoil','toilet','moist','avoid','employ'],
                pseudoWords: ['noy','zoy','floin','vroi','jol','quoint']
            },
            {
                id: 'ou-ow',
                title: 'ou / ow',
                ipa: '/aʊ/',
                pattern: 'ou 在字中、ow 在字中或字尾',
                ruleZh: '多數情況 ou/ow 唸 /aʊ/（嘴巴從「啊」滑到「ㄨ」）。注意 ow 也常唸 /oʊ/（如 snow、show），需要特別記。',
                tipsZh: '/aʊ/ 像驚訝「哇～嗚」的感覺。動作是嘴巴張大再收圓。',
                examples: ['out','about','house','mouse','loud','found','sound','around','cow','how','now','down','town','brown','flower','power','crowd','count','mouth','south','wow','plow','clown','frown'],
                pseudoWords: ['nout','zow','flout','vrow','jound','quowl'],
                contrast: { hint: 'snow vs now：兩個都拼 ow 但唸法不同' }
            },
            {
                id: 'r-controlled',
                title: 'R 控制母音',
                ipa: '/ɑr/、/ɜr/、/ɔr/',
                pattern: 'ar / er / ir / or / ur',
                ruleZh: '母音後接 r，原本的母音音消失，整組變成新的音：ar=/ɑr/（car）、or=/ɔr/（for）、er=ir=ur=/ɜr/（her、bird、turn 三者同音）。',
                tipsZh: 'er、ir、ur 三個都唸同一個音 /ɜr/，這是最容易記錯拼字的地方。bird、burn、herd 三個母音字母不同但發音一樣，要靠單字本身記憶。',
                examples: ['car','far','star','park','hard','sharp','farm','arm','for','form','fork','horn','born','short','sport','her','term','herd','bird','girl','first','dirt','turn','burn'],
                pseudoWords: ['nart','zerm','flir','vorn','jurt','quark','zerp'],
                contrast: { hint: 'fern / firm / turn — 三組同音不同拼' }
            }
        ]
    },

    // =====================================================
    // 第五章：軟音 c/g 與不發音字母
    // =====================================================
    {
        id: 'ch5',
        title: '第五章：軟音 c/g 與不發音字母',
        titleEn: 'Soft C/G & Silent Letters',
        intro: '英文中有些字母會「變身」或「不出聲」，這些規則看似例外，但其實有規律可循。',
        lessons: [
            {
                id: 'soft-c',
                title: '軟音 c → /s/',
                ipa: '/s/',
                pattern: 'c 後接 e、i、y',
                ruleZh: '當 c 後面接 e、i、y 時，c 唸 /s/（軟音）。其他情況唸 /k/（硬音，如 cat、cup、cot）。',
                tipsZh: '記憶：「e/i/y 讓 c 變柔」。例如 cent /sɛnt/、city /ˈsɪti/、cycle /ˈsaɪkl̩/。',
                examples: ['cent','city','cycle','center','circle','circus','cigar','cinema','dance','face','race','place','price','nice','ice','rice','space','since','prince','voice','choice','fence','cell','cease'],
                pseudoWords: ['cite','cype','cest','cint','cyl'],
                contrast: { pairs: [['cat','cell'],['cot','city']], hint: 'cat 唸 /kæt/、cell 唸 /sɛl/，差別只在後面接什麼母音' }
            },
            {
                id: 'soft-g',
                title: '軟音 g → /dʒ/',
                ipa: '/dʒ/',
                pattern: 'g 後接 e、i、y',
                ruleZh: '當 g 後面接 e、i、y 時，g 通常唸 /dʒ/（軟音，像 j）。其他情況唸 /g/（硬音，如 go、gum、game）。',
                tipsZh: '比較：go /goʊ/ vs gem /dʒɛm/，goat vs giant。注意例外：get、give、girl 仍唸硬 g。',
                examples: ['gem','giant','age','page','cage','rage','huge','large','change','strange','stage','wage','gentle','gym','gymnast','germ','gel','range','engine','margin','magic','digit','energy','danger'],
                pseudoWords: ['gite','gype','gest','gint','gyl'],
                contrast: { pairs: [['game','gem'],['go','giant']], hint: 'get/give/girl 是例外，仍唸硬 g' }
            },
            {
                id: 'silent-letters',
                title: '不發音字母',
                ipa: '—',
                pattern: 'kn、wr、mb、igh、gh',
                ruleZh: 'kn 中的 k 不發音、wr 中的 w 不發音、字尾 mb 中的 b 不發音、igh 整組唸 /aɪ/、字中或字尾 gh 通常不發音。',
                tipsZh: 'knee 唸 /niː/、write 唸 /raɪt/、comb 唸 /koʊm/、high 唸 /haɪ/。這些都是歷史遺留下來的拼法。',
                examples: ['know','knee','knife','knock','knight','write','wrong','wrap','wrist','wreck','comb','lamb','climb','thumb','tomb','high','night','light','right','fight','sigh','through','though','daughter'],
                pseudoWords: ['knub','wrip','clomb','righ','sigh'],
                contrast: { hint: '看到 kn、wr、mb 開頭/結尾，第一個字母通常不唸' }
            }
        ]
    },

    // =====================================================
    // 第六章：音節劃分與重音
    // =====================================================
    {
        id: 'ch6',
        title: '第六章：音節劃分與重音 (Syllable Division & Stress)',
        titleEn: 'Syllable Division & Word Stress',
        intro: '面對陌生長單字時，會「切音節」就能拆解唸出來。每個音節都必須有一個母音音（不是字母）。本章介紹三種最常見的切法，以及輕讀音節中的 schwa /ə/ 音。',
        lessons: [
            {
                id: 'vc-cv',
                title: 'VC/CV 切法（兩個子音之間切）',
                ipa: '—',
                pattern: '母音-子音 / 子音-母音',
                ruleZh: '當兩個子音夾在兩個母音之間時，從兩個子音中間切開。第一個音節通常變短母音。',
                tipsZh: '例：napkin → nap-kin（短 a + 短 i）、picnic → pic-nic、basket → bas-ket、winter → win-ter。',
                examples: ['nap-kin','pic-nic','bas-ket','win-ter','sis-ter','let-ter','but-ter','rab-bit','hap-py','ten-nis','mit-ten','muf-fin','sum-mer','din-ner','gar-den','car-pet','pen-cil','prob-lem'],
                pseudoWords: ['nap-bin','zit-mun','blop-tan']
            },
            {
                id: 'v-cv',
                title: 'V/CV 切法（母音後直接切）',
                ipa: '—',
                pattern: '母音 / 子音-母音',
                ruleZh: '當兩個母音之間只有一個子音時，先試「在子音前切」（V/CV），讓第一個音節變長母音。',
                tipsZh: '例：robot → ro-bot（長 o）、open → o-pen（長 o）、baby → ba-by（長 a）、final → fi-nal（長 i）。如果不通就用 VC/V（如 cabin → cab-in）。',
                examples: ['ro-bot','o-pen','ba-by','fi-nal','mu-sic','pa-per','ti-ger','ta-ble','la-bel','ma-jor','to-tal','vi-rus','la-zy','ho-tel','no-tice','stu-dent','ze-bro','ti-tle','le-gal','re-cent'],
                pseudoWords: ['no-bin','ze-pun','blu-tan']
            },
            {
                id: 'schwa',
                title: 'Schwa 弱音 /ə/',
                ipa: '/ə/',
                pattern: '出現在不重讀的音節',
                ruleZh: '英文中最常見的母音 — schwa /ə/，是所有母音字母在「不重讀」音節都可能變成的弱音，類似中文「ㄜ」但更短促模糊。',
                tipsZh: '例：about /əˈbaʊt/（a 弱化）、pencil /ˈpɛnsəl/（i 弱化）、sofa /ˈsoʊfə/（a 弱化）、taken /ˈteɪkən/（e 弱化）。重點：聽到含糊「ㄜ」的音，多半就是 schwa。',
                examples: ['about','again','away','around','sofa','pizza','panda','banana','pencil','April','April','animal','family','reason','cousin','listen','open','happen','garden','silent','common','present','support','agree'],
                pseudoWords: ['nabout','zogen','blamilar'],
                contrast: { hint: 'banana /bəˈnænə/ — 三個 a 中只有中間那個唸 /æ/，其他兩個都是 schwa' }
            }
        ]
    }
];

if (typeof module !== 'undefined') module.exports = { CHAPTERS };
