import React, { useState, useMemo } from 'react';
import { Search, Utensils, Info, BookOpen, AlertCircle, ChevronRight, Filter } from 'lucide-react';

// レシピデータの拡張 (主要なカテゴリーを網羅)
const RECIPE_DATA = {
  // --- カレー・シチュー ---
  "1": { category: "カレー・シチュー", name: "肉じゃが", ingredients: ["じゃがいも: 3個", "たまねぎ: 2個", "にんじん: 1/2本", "牛バラ肉: 200g", "調味料(醤油・酒・砂糖・みりん 各大3)"], points: "水は入れません。野菜の水分でおいしくなります。" },
  "2": { category: "カレー・シチュー", name: "無水カレー", ingredients: ["トマト: 3個", "たまねぎ: 2個", "鶏もも肉: 1枚", "カレールー: 4〜5皿分"], points: "トマトの水分だけで作るので濃厚な味になります。" },
  "3": { category: "カレー・シチュー", name: "ビーフシチュー", ingredients: ["牛すね肉: 400g", "じゃがいも: 2個", "たまねぎ: 2個", "デミグラスソース缶: 1缶"], points: "お肉を赤ワインに漬けるとより柔らかくなります。" },
  "4": { category: "カレー・シチュー", name: "クリームシチュー", ingredients: ["鶏もも肉: 1枚", "たまねぎ: 1個", "牛乳: 200ml(後入れ)"], points: "牛乳は加熱終了後に加えて延長加熱すると分離しません。" },

  // --- 煮物 ---
  "5": { category: "煮物", name: "おでん", ingredients: ["大根: 300g", "練り物: 適量", "だし汁: 600ml"], points: "大根に隠し包丁を入れると味が染み込みます。" },
  "6": { category: "煮物", name: "筑前煮", ingredients: ["鶏肉: 150g", "ごぼう: 1/2本", "れんこん: 150g"], points: "根菜は大きく切って食感を楽しみましょう。" },
  "7": { category: "煮物", name: "かぼちゃの煮物", ingredients: ["かぼちゃ: 1/4個", "水: 大3", "調味料"], points: "皮を下に並べると煮崩れしません。" },
  "10": { category: "煮物", name: "きんぴらごぼう", ingredients: ["ごぼう: 150g", "にんじん: 1/2本", "ごま油: 大1"], points: "まぜ技ユニットがしっかり味を絡めます。" },
  "56": { category: "煮物", name: "豚の角煮", ingredients: ["豚バラ肉(塊): 500g", "生姜: 1かけ", "ネギの青い部分"], points: "お肉を先に下茹でするモード(No.68)を使うと脂が抜けます。" },

  // --- 魚料理 ---
  "12": { category: "魚料理", name: "さばのみそ煮", ingredients: ["さば: 2〜4切れ", "生姜: 1かけ", "味噌・みりん・酒"], points: "皮を上にして重ならないように並べます。" },
  "13": { category: "魚料理", name: "いわしの骨まで煮", ingredients: ["いわし: 6〜8匹", "梅干し: 2個", "調味料"], points: "約2時間半かけて骨まで柔らかくします。" },
  "114": { category: "魚料理", name: "あさりの酒蒸し", ingredients: ["あさり: 300g", "酒: 大2"], points: "砂抜きをしっかりしてから調理してください。" },

  // --- スープ・汁物 ---
  "42": { category: "スープ", name: "ポトフ", ingredients: ["ソーセージ: 4〜6本", "キャベツ: 1/4個", "水: 600ml"], points: "キャベツの芯を付けたまま大きく切ると甘みが出ます。" },
  "43": { category: "スープ", name: "豚汁", ingredients: ["豚バラ肉: 100g", "大根: 100g", "味噌: 大4"], points: "具だくさんで野菜の旨みがしっかり出ます。" },
  "45": { category: "スープ", name: "みそ汁", ingredients: ["豆腐・わかめなど好きな具材", "だし汁: 600ml"], points: "毎朝の時短に最適です。" },

  // --- 麺・ごはん ---
  "100": { category: "麺・ごはん", name: "ナポリタン風パスタ", ingredients: ["パスタ(7分茹で): 100g", "玉ねぎ・ピーマン", "水: 220ml"], points: "乾麺のまま入れてOK！半分に折って入れます。" },
  "101": { category: "麺・ごはん", name: "ちゃんぽん麺", ingredients: ["ちゃんぽん麺: 1玉", "冷凍シーフードミックス", "水: 200ml"], points: "野菜たっぷりで栄養満点です。" },

  // --- お菓子・パン ---
  "63": { category: "お菓子", name: "スポンジケーキ", ingredients: ["卵: 3個", "小麦粉: 90g", "砂糖: 90g"], points: "内鍋にバターをしっかり塗ると綺麗に取り出せます。" },
  "64": { category: "お菓子", name: "ブラウニー", ingredients: ["チョコ: 100g", "くるみ: 適量"], points: "濃厚でしっとりした仕上がりになります。" },
  "108": { category: "お菓子", name: "サラダチキン", ingredients: ["鶏むね肉: 1枚(250g)", "塩・酒"], points: "低温調理でしっとりジューシーに仕上がります。" },

  // --- その他・定番 ---
  "26": { category: "定番", name: "ゆで卵", ingredients: ["卵: 1〜6個", "水: 100ml"], points: "蒸し板を使います。好みの固さで時間を調整してください。" },
  "80": { category: "定番", name: "麻婆豆腐", ingredients: ["豆腐: 1丁", "ひき肉: 100g", "合わせ調味料"], points: "豆腐が崩れないようにそっと入れます。" }
};

const App = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('すべて');
  const [result, setResult] = useState(null);

  const categories = ['すべて', ...new Set(Object.values(RECIPE_DATA).map(r => r.category))];

  // フィルタリングされたレシピリスト
  const filteredList = useMemo(() => {
    return Object.entries(RECIPE_DATA).filter(([no, data]) => {
      const matchesCategory = activeCategory === 'すべて' || data.category === activeCategory;
      const matchesQuery = no.includes(query) || data.name.includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  const handleSearch = (no) => {
    setResult(RECIPE_DATA[no]);
    setQuery(no);
  };

  return (
    <div className="min-h-screen bg-orange-50/50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 p-4 rounded-3xl shadow-xl transform -rotate-2">
              <BookOpen className="text-white w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-red-600 tracking-tight">ホットクック・マスター</h1>
          <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-[0.2em]">KN-HW16H Recipe Database</p>
        </header>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-orange-100 border border-white mb-8">
          <div className="relative mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setResult(null);
              }}
              placeholder="メニュー番号または料理名で検索..."
              className="w-full pl-12 pr-6 py-4 bg-orange-50/50 border-2 border-transparent focus:border-red-400 rounded-2xl outline-none transition-all text-lg font-bold placeholder:text-orange-200"
            />
            <Search className="absolute left-4 top-4.5 text-orange-300" size={24} />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === cat 
                  ? 'bg-red-500 text-white shadow-md shadow-red-200' 
                  : 'bg-orange-50 text-orange-400 hover:bg-orange-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Display Content */}
        {result ? (
          /* Single Recipe View */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => setResult(null)}
              className="mb-4 text-orange-400 font-bold flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              ← リストに戻る
            </button>
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <Utensils size={160} />
              </div>
              
              <div className="relative">
                <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-black mb-4 inline-block">
                  MENU NO. {query}
                </span>
                <h2 className="text-4xl font-black text-slate-800 mb-8 tracking-tighter">{result.name}</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <section>
                    <h3 className="flex items-center gap-2 text-slate-800 font-black mb-4 border-l-4 border-red-500 pl-3 uppercase tracking-wider text-sm">
                      <Utensils size={18} className="text-red-500" />
                      材料の目安
                    </h3>
                    <ul className="space-y-3">
                      {result.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                          <div className="w-1.5 h-1.5 bg-red-200 rounded-full" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="flex items-center gap-2 text-slate-800 font-black mb-4 border-l-4 border-red-500 pl-3 uppercase tracking-wider text-sm">
                      <Info size={18} className="text-red-500" />
                      調理のポイント
                    </h3>
                    <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100 italic text-red-900 leading-relaxed shadow-inner">
                      {result.points}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* List Browse View */
          <div className="space-y-3">
            <h3 className="text-orange-900/40 font-black uppercase tracking-[0.2em] text-xs px-4 flex items-center gap-2">
              <Filter size={14} />
              レシピ検索結果 ({filteredList.length})
            </h3>
            
            {filteredList.length > 0 ? (
              <div className="grid gap-3">
                {filteredList.map(([no, data]) => (
                  <button
                    key={no}
                    onClick={() => handleSearch(no)}
                    className="w-full bg-white hover:bg-red-50 p-5 rounded-3xl flex items-center justify-between group transition-all border border-transparent hover:border-red-100 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center font-black text-orange-400 group-hover:bg-white group-hover:text-red-500 transition-colors">
                        {no}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-orange-300 uppercase tracking-widest">{data.category}</p>
                        <p className="text-lg font-black text-slate-700">{data.name}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-orange-100 group-hover:text-red-300 transition-colors" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-white/40 border-4 border-dashed border-orange-100 rounded-[3rem] py-20 text-center">
                <AlertCircle className="mx-auto text-orange-200 mb-3" size={48} />
                <p className="text-orange-300 font-bold text-lg">レシピが見つかりませんでした</p>
              </div>
            )}
          </div>
        )}

        {/* Guide Text */}
        {!result && (
          <div className="mt-12 text-center bg-orange-100/30 p-8 rounded-[3rem]">
            <p className="text-orange-900/40 text-sm font-bold leading-relaxed">
              番号が分かれば直接入力、分からなければカテゴリーから選んでください。<br/>
              ※材料は目安です。詳細は公式レシピブックをご確認ください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
