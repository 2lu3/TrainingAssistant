## このレポジトリについて
https://github.com/shkh/TrainingAssistant からフォークしてきたものであり、日本語化・Python3に対応させています

## セットアップ
Git,Pythonが使える状態にあることを前提とします。

1. プログラムをPCにクローンしましょう

		git clone https://github.com/2lu3/TrainingAssistant.git

2. 事前設定1

		cd TrainingAssistant
		git submodule init
		git submodule update

3. 事前設定2

		pip install -r freezed.txt

4. 画像を `static/img` に保存してください

## プログラムを実行します

    python views.py

上のコマンドを実行したら、ブラウザーで、 `http://localhost:5000` をURLの場所に入れてください。

Skipを押すと、その画像を飛ばし(正解データと不正解データのどちらにも入りません)、赤色の枠線がない状態でNextを押すと不正解データになり、赤色の枠線がある状態でNextを押すと正解データとなります。

正解データは `info.dat` に、不正解データは `bg.txt` に保存されます。
