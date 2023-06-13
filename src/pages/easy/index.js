/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { formatRealtime } from "@/components/formatRealtime";
import styles from "@/styles/Home.module.css";
import { keygraph } from "@/components/keygraph";
import { useUser } from "@/contexts/UserContext";
import { fetchNewsDescription } from "@/pages/api/fetchNewsDescription";
import { convertToKana } from "@/pages/api/convertToKana";
import Link from "next/link";

// Material UI
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Image from "next/image";

// 表示文章
let wordJp = [];
// ひらがな文章
let wordKana = [];
// 出題ニュースタイトル
let newsTitle = [];
// 出題ニュースURL
let newsUrl = [];

export default function TypingGame() {
  // 定数
  const DEFAULT_GAME_LEVEL = "normal";
  const DEFAULT_NEWS_CATEGORY = "business";

  const [gameStarted, setGameStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [nextText, setNextText] = useState(false);

  const [currentTextNum, setCurrentTextNum] = useState(0);
  const [currentText, setCurrentText] = useState(wordJp[0]);
  const [currentNewsTitle, setCurrentNewsTitle] = useState();
  const [currentNewsUrl, setCurrentNewsUrl] = useState();

  // keygraph変数の状態変数
  const [keysToType, setKeysToType] = useState(); // これからタイプしなければいけないキーの取得
  const [keysTyped, setKeysTyped] = useState(); // タイプし終わったキーの取得
  const [kanaToType, setKanaToType] = useState(); // これから打つ ひらがな の取得
  const [kanaTyped, setKanaTyped] = useState(); // 打ち終わった ひらがな の取得

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finishTime, setFinishTime] = useState();
  let limit;

  // オプション
  const [level, setLevel] = useState(DEFAULT_GAME_LEVEL);
  const [newsCategory, setNewsCategory] = useState(DEFAULT_NEWS_CATEGORY);

  // ユーザ名
  const { username } = useUser();

  // ゲーム開始・リセットのロジック
  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.code === "Space" && !gameStarted) {
        setGameStarted(true);
        setFinished(false);
        setCountdown(3); // カウントダウンをリセット

        let newsArray = [];

        newsArray = await fetchNewsDescription(newsCategory);
        try {
          // 問題初期化
          wordJp = [];
          wordKana = [];
          newsTitle = [];
          newsUrl = [];

          for (let i = 0; i < newsArray[0].length; i++) {
            const kana = await convertToKana(newsArray[0][i]);
            if (kana) {
              // 問題文として表示文字とかな文字を配列に格納
              wordJp.push(newsArray[0][i]);
              wordKana.push(kana);
              newsTitle.push(newsArray[1][i]);
              newsUrl.push(newsArray[2][i]);
            } else {
              console.log("Error:表示文章をかなに変換できませんでした。");
              console.log(news);
              continue;
            }
          }
        } catch (error) {
          console.error(error);
          console.log("Error:ニュース記事を取得できませんでした。");
          console.log("newsArray" + newsArray);
        }
      }
      if (event.code === "Escape" && gameStarted) {
        setGameStarted(false);
        setPlaying(false);
        gameInit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted, newsCategory]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      let key = e.key;

      if (keygraph.next(key)) {
        // 入力がタイピングするキーと一致している場合
        console.log("正解！");
      } else {
        // 入力がタイピングするキーと一致していない場合
        console.log("不正解！");
      }

      if (keygraph.is_finished()) {
        // すべての文字をタイプし終わったとき
        setCurrentTextNum((prevTextNum) => prevTextNum + 1);
      }

      disp();
    };
    disp();

    if (playing) {
      window.addEventListener("keypress", handleKeyPress);
      if (nextText) {
        // 「次のニュース」ボタン押下時
        setNextText(false);
        setCurrentTextNum((prevTextNum) => prevTextNum + 1);
      }
    }
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [playing, nextText]);

  useEffect(() => {
    if (wordJp.length == currentTextNum) {
      // 全ての問題が終わった後の処理。
      const endTime = new Date();
      setEndTime(endTime);
      if (startTime) {
        setFinishTime(endTime.getTime() - startTime.getTime());
      }
      setCurrentTextNum(0);
      setGameStarted(false);
      setPlaying(false);
      setFinished(true);
    } else {
      wordSet(currentTextNum);
      disp();
    }
  }, [currentTextNum]);

  // カウントダウンのロジック
  useEffect(() => {
    if (gameStarted && !playing) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setPlaying(true);
            gameInit();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [gameStarted]);

  // ゲーム設定初期化
  function gameInit() {
    setStartTime(new Date());
    wordSet(currentTextNum);
  }

  // タイピング文章セット
  function wordSet(count) {
    // DAGの作成とkeygraph変数のビルド
    keygraph.build(wordKana[count]);
    // 出題文章
    setCurrentText(wordJp[count]);
    // 出題ニュースタイトル
    setCurrentNewsTitle(newsTitle[count]);
    // 出題ニュースURL
    setCurrentNewsUrl(newsUrl[count]);
  }

  const disp = () => {
    // これからタイプしなければいけないキーの取得
    setKeysToType(keygraph.key_candidate().toUpperCase());
    // タイプし終わったキーの取得
    setKeysTyped(keygraph.key_done().toUpperCase());
    // これから打つ ひらがな の取得
    setKanaToType(keygraph.seq_candidates());
    // 打ち終わった ひらがな の取得
    setKanaTyped(keygraph.seq_done());
  };

  // playingがtrueの間、経過時間をリアルタイムで更新
  useEffect(() => {
    let interval;
    if (playing) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [playing, startTime]);

  return (
    <>
      {/* <h1>タイピングゲームくん</h1> */}
      {username && <p>ようこそ、{username}さん</p>}
      {!gameStarted && !playing && (
        <>
          <div>難易度</div>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="level-radio-buttons-group-label"
              name="level-radio-buttons-group"
              defaultValue={level}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <FormControlLabel
                value="easy"
                control={<Radio />}
                label="かんたん"
              />
              <FormControlLabel
                value="normal"
                control={<Radio />}
                label="ふつう"
              />
              <FormControlLabel
                value="hard"
                control={<Radio />}
                label="むずかしい"
              />
            </RadioGroup>
          </FormControl>
          {/* ニュースカテゴリ */}
          <div>ニュースカテゴリ</div>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="news-category-radio-buttons-group-label"
              name="news-category-radio-buttons-group"
              defaultValue={newsCategory}
              value={newsCategory}
              onChange={(e) => {
                setNewsCategory(e.target.value);
              }}
            >
              <FormControlLabel
                value="business"
                control={<Radio />}
                label="ビジネス"
              />
              <FormControlLabel
                value="entertainment"
                control={<Radio />}
                label="エンタメ"
              />
              <FormControlLabel
                value="health"
                control={<Radio />}
                label="ヘルスケア"
              />
              <FormControlLabel
                value="science"
                control={<Radio />}
                label="科学"
              />
              <FormControlLabel
                value="sports"
                control={<Radio />}
                label="スポーツ"
              />
              <FormControlLabel
                value="technology"
                control={<Radio />}
                label="テクノロジー"
              />
            </RadioGroup>
          </FormControl>
        </>
      )}

      {finished && finishTime && (
        <>
          <h2>おわり！</h2>
          <div>かかった時間</div>
          <div>{formatRealtime(finishTime)}</div>
        </>
      )}
      {!gameStarted && <p>スペースキーを押してゲームを開始してください。</p>}
      {gameStarted && !playing && countdown !== null && <p>{countdown}</p>}
      {playing && (
        <>
          <div>ジャンル：{newsCategory}</div>
          <div>難易度：{level}</div>
          <div>
            問題数：{currentTextNum + 1}/{wordJp.length}
          </div>
          {/* <div>経過時間: {formatRealtime(elapsedTime)}</div> */}
          <h2 style={{ margin: "0" }}>{currentText}</h2>
          <div></div>
          <span className={styles.done}>{kanaTyped}</span>
          <span>{kanaToType}</span>
          <div></div>
          <span className={styles.done}>{keysTyped}</span>
          <span>{keysToType}</span>
          <p>
            <h3>出題ニュースURL</h3>
            <a href={currentNewsUrl} target="_blank">
              {currentNewsTitle}
            </a>
          </p>
          <button onClick={() => setNextText(true)}>
            {currentTextNum + 1 == wordJp.length
              ? "結果を見る"
              : "次のニュース"}
          </button>
        </>
      )}
      {playing && <div>escキーでやり直し</div>}
      {!playing && <Link href="/">トップに戻る</Link>}
      {/* <div>
        <a href="http://www.goo.ne.jp/" target="_blank">
          <img
            src="//u.xgoo.jp/img/sgoo.png"
            alt="supported by goo"
            title="supported by goo"
            style={{ width: "100px" }}
          />
        </a>
      </div> */}
    </>
  );
}
