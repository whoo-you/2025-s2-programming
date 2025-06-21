# About
PythonやそのパッケージのDocumentationからセマンティック検索を行うことができるアプリケーションです。[DevDocs](https://devdocs.io)に似てる？

今のところPythonの公式ドキュメントからしか検索できません。

大学での授業における学習目的の作品です。

documentationの本文と検索クエリに対し[all-MiniLM-L12-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L12-v2#all-minilm-l12-v2)を利用した埋め込みを行い、コサイン類似度が高い順に検索結果を表示しています。

## プレビュー
![2025-06-22021826-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/72d463e9-9196-4f57-aeab-1c8fc83ff1e3)

## 起動方法

### 1. 依存関係のインストール
[uv](https://github.com/astral-sh/uv)を使います。

```bash
uv sync
```

### 2. サーバー起動
```bash
python main.py
```

検索クエリをボックスに入力することで、検索結果が表示されます。

## LICENSE
[Python](https://docs.python.org/3/license.html)<br>
Copyright © 2001-2024 Python Software Foundation; All Rights Reserved.
