import os
import glob
from bs4 import BeautifulSoup
import json


def collect_html_documents(folder_path):
    results = []

    # フォルダ内のすべてのHTMLファイルを再帰的に検索
    html_pattern = os.path.join(folder_path, "**", "*.html")
    html_files = glob.glob(html_pattern, recursive=True)

    for html_file in html_files:
        try:
            # HTMLファイルを読み込み
            with open(html_file, "r", encoding="utf-8") as file:
                content = file.read()
            html_file = "https://docs.python.org/3.13/" + html_file.replace(
                "\\", "/"
            ).removeprefix("./documents/python-3.13-docs-html/python-3.13-docs-html/")
            # BeautifulSoupでHTMLを解析
            soup = BeautifulSoup(content, "html.parser")
            # <div class="document">を検索
            document_div = soup.find("div", class_="document")
            if document_div:
                # テキスト内容を取得（HTMLタグを除去）
                text_content = document_div.get_text(strip=True)
            else:
                # document divが見つからない場合
                results.append((html_file, ""))
            # <h1>タグを取得
            title_tag = soup.find("h1")
            if title_tag:
                title = title_tag.get_text(strip=True)
                results.append((html_file, {"title": title, "text": text_content}))
            else:
                results.append(
                    (html_file, {"title": "No title found", "text": text_content})
                )

        except Exception as e:
            print(f"エラー: {html_file} の処理中にエラーが発生しました: {e}")
            results.append((html_file, f"エラー: {str(e)}"))

    return results


def main():
    # 探索するフォルダパスを指定
    folder_path = "./documents"
    results = collect_html_documents(folder_path)

    print(f"\n{len(results)} 個のHTMLファイルが見つかりました。\n")

    # save as json
    with open("summary/python.json", "w", encoding="utf-8") as f:
        json.dump(dict(results), f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    main()
