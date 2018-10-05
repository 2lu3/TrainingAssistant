var coords = new Array();
var curcrd;
var canvas;
var context;

var checkboxes = new Array("#checkbox1", "#checkbox2", "#checkbox3");

onload = function () {
  draw();
  // リセット
  $('#reset').click(function () {
    resetstatus();
  });
  // スキップ
  $('#skip').click(function () {
    nextajax(skip = -2);
    $("#next").prop("disabled", false);
    $("#done").prop("disabled", true);
    setCheckboxProp(true, false);
  })
  // 完了
  $('#done').click(function () {
    if ($('#done').prop("disabled") == true) {
      return;
    }
    $("#next").prop("disabled", false);
    $("#done").prop("disabled", true);
    setCheckboxProp(true, false);
    nextajax(skip = -1);
  })
  // 次
  $('#next').live('click', function () {
    if ($('#next').prop("disabled") == true) {
      return;
    }
    $("#done").prop("disabled", true);
    setCheckboxProp(true, false);
    nextajax(skip = 0);
  });
  // カテゴリー
  for (let index = 0; index < checkboxes.length; index++) {
    $(checkboxes[index]).click(function () {
      if ($(checkboxes[index]).prop("checked") == false) {
        $(checkboxes[index]).prop("checked", true);
        alert("同じ画像で同じカテゴリーを登録するには、赤い枠を複数描いてからカテゴリーをクリックしてください");
        return;
      }
      if ($(checkboxes[index]).prop("disabled") == true) {
        alert("赤い枠を選択してから、カテゴリーをクリックしてください");
        return;
      }
      $("#next").prop("disabled", true);
      $("#done").prop("disabled", false);
      nextajax(skip = index + 1);
    });
  }
  $('.bar').css({ 'width': count * 100 / imgnum + '%' });
};

function setCheckboxProp(disabled, checked) {
  for (let index = 0; index < checkboxes.length; index++) {
    $(checkboxes[index]).prop("disabled", disabled);
    $(checkboxes[index]).prop("checked", checked);
  }
}


function draw() {
  var image = new Image();
  image.src = imgsrc;
  image.onload = function () {
    if ($("#checkbox1").prop("checked") == true || $("#checkbox2").prop("checked") == true || $("#checkbox3").prop("checked") == true) {
      $("#skip").prop("disabled", true);
      $("#next").prop("disabled", true);
      $("#done").prop("disabled", false);
    } else {
      $("#skip").prop("disabled", false);
      $("#next").prop("disabled", false);
      $("#done").prop("disabled", false);
    }
    var wid = image.naturalWidth;
    var hei = image.naturalHeight;
    $('.main-wrapper').css({ 'width': wid, 'minWidth': wid });
    var wrapper = $('#canvas-wrapper');
    $(wrapper).empty();
    var c = $('<canvas/>').attr('id', 'cnvs');
    $(wrapper).append(c);
    canvas = $('#cnvs').get(0);
    context = canvas.getContext('2d');
    $('#cnvs').css({ 'width': wid + 'px', 'height': hei + 'px' }).attr({ 'width': wid + 'px', 'height': hei + 'px' });
    context.drawImage(image, 0, 0);
    $(function () {
      $('#cnvs').Jcrop({
        onSelect: selected,
        onRelease: released,
      });
    });
  }
}

function selected(c) {
  $("#skip").prop("disabled", true);
  $("#next").prop("disabled", true);
  $("#done").prop("disabled", true);
  curcrd = [c.x, c.y, c.w, c.h];
}

function released(c) {
  $("#skip").prop("disabled", true);
  $("#next").prop("disabled", true);
  $("#done").prop("disabled", true);
  for (let index = 0; index < checkboxes.length; index++) {
    if ($(checkboxes[index]).prop("checked") != true) {
      $(checkboxes[index]).prop("disabled", false);
    }
  }
  coords.push(curcrd);
  context.beginPath();
  context.lineWidth = 3;
  context.strokeStyle = 'rgba(238, 26, 26, 1)';
  context.strokeRect(curcrd[0], curcrd[1], curcrd[2], curcrd[3]);
}

function resetstatus() {
  coords = new Array();
  draw();
}

function nextajax(skip) {
  console.log('座標:' + coords);
  coords = JSON.stringify(coords);
  $.ajax({
    type: 'GET',
    dataType: "json",
    data: { 'coords': coords, 'skip': skip },
    url: "/_next",
    success: function (data) {
      imgsrc = data.imgsrc;
      var count = data.count;
      var finished = data.finished;
      $('.bar').css({ 'width': count * 100 / imgnum + '%' });
      console.log(count + '/' + imgnum);

      if (finished) {
        w = $('.head-wrapper').width()
        $('.main-wrapper').css({ 'width': w, 'minWidth': w });
        $('#canvas-wrapper').empty().append('<div class="messages"><div class="message">' + imgnum + ' Images were</div><div class="message">Successfuly Processed!</div></div>');
        $('.btn').addClass('disabled');
      } else {
        var tmp = (count + 1).toString();
        while (tmp.length < imgnum.toString.length) {
          tmp = '0' + tmp;
        }
        $('.count').html(tmp + ' of ' + imgnum);
        resetstatus();
      }
    }
  });
}
