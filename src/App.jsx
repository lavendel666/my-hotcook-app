import React, { useState } from 'react';
import { Search, Utensils, Info, BookOpen, AlertCircle } from 'lucide-react';

// KN-HW16H の代表的なメニューデータ（例）
const RECIPE_DATA = {
  "1": {
    name: "肉じゃが",
    ingredients: [
      "じゃがいも（乱切り）：3個（450g）",
      "たまねぎ（くし切り）：2個（400g）",
      "にんじん（乱切り）：1/2本（100g）",
      "牛バラ薄切り肉（3cm幅）：200g",
      "しょうゆ、酒、砂糖、みりん：各大さじ3"
    ],
    points: "水は入れません。野菜から出る水分でおいしく仕上がります。お肉は重ならないように広げて入れるのがコツです。"
  },
  "2": {
    name: "無水カレー",
    ingredients: [
      "トマト（角切り）：3個（450g）",
      "たまねぎ（みじん切り）：2個（400g）",
      "セロリ（みじん切り）：1本（100g）",
      "鶏もも肉（一口大）：1枚（250g）",
      "カレールー：4〜5皿分"
    ],
    points: "トマトの水分だけで作るので、水は一切加えません。野菜の旨味が凝縮された濃厚な味になります。"
  },
  "7": {
    name: "かぼちゃの煮物",
    ingredients: [
      "かぼちゃ（3〜4cm角）：1/4個（約400g）",
      "しょうゆ、酒、みりん、砂糖：各小さじ2",
      "水：大さじ3"
    ],
    points: "皮を下にして並べることで、煮崩れを防ぎつつ味がしっかり染み込みます。"
  },
  "63": {
    name: "スポンジケーキ",
    ingredients: [
      "卵（Lサイズ）：3個",
      "砂糖：90g",
      "薄力粉：90g",
      "バター：20g（溶かしておく）"
    ],
    points: "内鍋にしっかりバターを塗っておくと、取り出しやすくなります。まぜ技ユニットは使いません。"
  }
};

const App = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const recipe = RECIPE_DATA[query];
    setResult(recipe || 'not_found');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl shadow-lg mb-4 text-white">
            <BookOpen size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">KN-HW16H レシピ検索</h1>
          <p className="text-slate-500 mt-2">メニュー番号を入力してください</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例: 1 (肉じゃが), 2 (無水カレー)"
            className="w-full pl-12 pr-24 py-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm focus:border-red-500 focus:outline-none transition-all text-lg"
          />
          <Search className="absolute left-4 top-4.5 text-slate-400" size={24} />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-red-600 hover:bg-red-700 text-white px-6 rounded-xl font-bold transition-colors"
          >
            検索
          </button>
        </form>

        {/* Results */}
        <div className="space-y-6">
          {result === 'not_found' && (
            <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-2xl text-center">
              <AlertCircle className="mx-auto text-amber-500 mb-2" size={32} />
              <p className="font-bold text-amber-800">見つかりませんでした</p>
              <p className="text-amber-600 text-sm mt-1">
                番号が正しいか確認してください。<br/>
                (現在は 1, 2, 7, 63 のみがサンプルとして登録されています)
              </p>
            </div>
          )}

          {result && result !== 'not_found' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Recipe Title Card */}
              <div className="bg-white border-2 border-slate-100 p-6 rounded-3xl shadow-sm mb-4">
                <div className="flex items-center gap-3 text-red-600 mb-2">
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black">
                    No. {query}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4">{result.name}</h2>
                
                <div className="space-y-6">
                  {/* Ingredients Section */}
                  <section>
                    <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-3">
                      <Utensils size={20} className="text-red-500" />
                      材料（目安）
                    </h3>
                    <ul className="bg-slate-50 rounded-2xl p-4 space-y-2">
                      {result.ingredients.map((item, index) => (
                        <li key={index} className="text-slate-600 flex items-start gap-2 text-sm">
                          <span className="text-red-400 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Points Section */}
                  <section>
                    <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-3">
                      <Info size={20} className="text-red-500" />
                      調理のポイント
                    </h3>
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                      <p className="text-red-800 text-sm leading-relaxed">
                        {result.points}
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {!result && (
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Model</p>
              <p className="text-slate-700 font-bold">KN-HW16H</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Type</p>
              <p className="text-slate-700 font-bold">無線LAN対応</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
