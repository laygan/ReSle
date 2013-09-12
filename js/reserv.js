// ここからスタート
// 読み込みが終わったら、getCELL()を実行する
window.addEventListener("load",getCELL,false);

//送信ボタンに関するJavascript
$('#btn-state').click(function () {
    var btn = $(this);
    btn.button('loading');
    setTimeout(function () {
        btn.button('reset');
    }, 10000);
});

function getCELL() {
    // table id:shiftのDOMを取得
    var myTbl = document.getElementById("shift");
    
    // trをループ。rowsコレクションで,行位置取得。
    for (var i=1; i<myTbl.rows.length; i++) {
        
    // tr内のtdをループ。cellsコレクションで行内セル位置取得。
        for (var j=1; j<myTbl.rows[i].cells.length; j++) {
            //i番行のj番列のセル "td"
            var Cells=myTbl.rows[i].cells[j];
            
            // onclickで 'changeCell'を実行。thisはクリックしたセル"td"のオブジェクトを返す。
            Cells.onclick =function(){changeCell(this);}
        }
    }
    
    // 選択データ格納用のオブジェクトを用意
    var shifts_obj = 
}

function changeCell(Cell) { 
    var rowINX = Cell.parentNode.rowIndex;   // Cellの親ノード'tr'の行位置
    var cellINX = Cell.cellIndex;            // Cellの列位置
    var cellVal = Cell.innerHTML;            // Cell内のHTML文字列
    
    if (cellVal.match("#f02")) {
        // このセルは休業日：何もしない
    } else if (cellVal.match("#0f0")) {
        // 予約取り消し
        Cell.innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #fff;" id="element_' + rowINX +''+ cellINX +'"></div>';
    } else {
        // 予約
        Cell.innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #0f0;" id="element_' + rowINX +''+ cellINX +'"></div>';
    }
}
