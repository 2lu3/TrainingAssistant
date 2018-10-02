from flask import *
import os
import sys
import json
import re
import sys
import glob

X_list = []
Y_list = []

image_data = []

app = Flask(__name__)
app.secret_key = '佐久間さん可愛い'

# 画像の準備
image_ptrn = re.compile('.*[.](jpg|jpeg|png|bmp|gif)$')
image_dir = os.path.join('static', 'img')
images = []
images = [image for image in os.listdir(
    image_dir) if re.match(image_ptrn, image)]
if not len(images):
    sys.exit('Error: Could not find images')

# print(image_dir)
for img in images:
    image_data.append(glob.glob(image_dir + '/' + img))

print(image_data)

logf = open('log.dat', 'w')

pos = 0


@app.route('/')
def index():

    global pos

    # 正例と負例用のファイル
    global positive
    global negative

    positive = open('info.dat', 'w')
    negative = open('bg.txt', 'w')
    positive.close()
    negative.close()
    positive = open('info.dat', 'a')
    negative = open('bg.txt', 'a')

    # 最初の画像
    imgsrc = os.path.join(image_dir, images[pos])
    imgnum = len(images)
    count = pos
    counter = ''.join(
        [str(pos+1).zfill(len(str(imgnum))), ' of ', str(imgnum)])

    return render_template('index.html', imgsrc=imgsrc, imgnum=imgnum, count=count, counter=counter)


@app.route('/_next')
def _next():

    global pos

    # その画像をスキップするか
    skip = request.args.get('skip')

    if skip != '-1':
        # 囲まれた範囲の座標
        coords = request.args.get('coords')
        coords = json.loads(coords)

        # 処理中の画像のパス
        image_path = os.path.join(image_dir, images[pos])

        # 正例か負例か
        if len(coords) == 0:
            X_list.append([0, 0, 0, 0, 0])
            negative.write(''.join([image_path, '\n']))
            logf.write(''.join([image_path, '\n']))
            logf.flush()

        else:
            s = ''
            for coord in coords:
                s = '  '.join([s, ' '.join([str(int(e)) for e in coord])])

            positive.write('%s %s  %d%s\n' % (skip, image_path, len(coords), s))
            logf.write("%s %s %d%s\n" % (skip, image_path, len(coords), s))
            print("hey")
            logf.flush()

        # まだ画像があるか
    if pos+1 >= len(images) and (skip != '-1' or skip != '0'):
        imgsrc = ""
        finished = True
        pos = pos + 1
        logf.close()
        negative.close()
        positive.close()
    else:
        imgsrc = os.path.join(image_dir, images[pos])
        if skip == '0' or skip == '-1':
            imgsrc = os.path.join(image_dir, images[pos+1])
            pos = pos + 1
        finished = False

    return jsonify(imgsrc=imgsrc, finished=finished, count=pos)


if __name__ == '__main__':
    app.debug = True
    app.run()
