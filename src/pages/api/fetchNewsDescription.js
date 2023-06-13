// ニュース記事を非同期で取得
export const fetchNewsDescription = async (category) => {
  try {
    const response = await fetch("http://localhost:3001/get-news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: category,
      }),
    });

    const news = await response.json();
    let newsArray = [[], [], []];

    for (let i = 0; i < news.length; i++) {
      if (newsArray[0].length > 9) {
        // 表示文字列が10個を超えたら終了
        return newsArray;
      }
      if (!news[i].description) {
        // うまく取得できなかった場合次のループ
        continue;
      }
      if (news[i].description.split("。")[0].length > 12) {
        // 1文が12文字以上のタイトルのみ出題
        try {
          newsArray[0].push(news[i].description.split("。")[0] + "。");
          newsArray[1].push(news[i].title);
          newsArray[2].push(news[i].url);
        } catch (error) {
          console.log("Error:ニュースの取得に失敗しました。");
          continue;
        }
      }
    }
  } catch (error) {
    console.error(error);
    return "";
  }
};
