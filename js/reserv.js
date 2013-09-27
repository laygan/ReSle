// ここからスタート
// 読み込みが終わったら、getCELL()を実行する
window.addEventListener("load",getCELL,false);

//送信ボタンに関するJavascript
$('#btn-state').click(function () {
    var btn = $(this);
    btn.button('loading');
    setTimeout(function () {
        btn.button('reset');
    }, 60000);
});

/*/ 毎週ボタンに関するJavascript
var every_week = false;
$('#every').click(function () {
    if (every_week) {   // 押されている
        every_week = false;
    } else {            // 押されていない
        every_week = true;
    }
});
*/

/*
 * シフト予約表においては、ヘッダが配列インデックス[0]に当たる。
 * しかし、ヘッダにはonclickを適用していないため、配列インデックス[0]でのイベントは発生しない。
 *
 * 一方、データ格納用配列はインデックス[0]からのスタートであるため、
 * シフト予約表[1][1]の位置はデータ格納用配列[0][0]に当たる。
 *
 * シフト予約テーブル[n][m] = データ格納用配列[n-1][m-1]
 */

var grids;
var primary = true;
var p_cell = Array(2);
var myTbl;

function getCELL() {
    // table id:shiftのDOMを取得
    myTbl = document.getElementById("shift");
    
    // 選択データ格納用の配列
    grids = new Array(myTbl.rows.length);
    
    // trをループ。rowsコレクションで,行位置取得。
    for (var i=1; i<myTbl.rows.length; i++) {
        // gridsを二次元配列化
        grids[i-1] = new Array(myTbl.rows[i].cells.length);
        // tr内のtdをループ。cellsコレクションで行内セル位置取得。
        for (var j=1; j<myTbl.rows[i].cells.length; j++) {
            //i番行のj番列のセル "td"
            var Cells=myTbl.rows[i].cells[j];
            
            // onclickで 'changeCell'を実行。thisはクリックしたセル"td"のオブジェクトを返す。
            Cells.onclick =function(){changeCell(this);}
            
            // 配列内該当箇所を"0"で初期化
            grids[i-1][j-1] = 0;
        }
    }
}

function changeCell(Cell) {
    var rowINX = Cell.parentNode.rowIndex;   // Cellの親ノード'tr'の行位置
    var cellINX = Cell.cellIndex;            // Cellの列位置
    var cellVal = Cell.innerHTML;            // Cell内のHTML文字列
    
    if (primary) {
        // 基準点指定
        if (cellVal.match("#f02")) {
            // このセルは休業日：何もしない
        } else {
            Cell.innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #ff0;" id="element_' + rowINX +''+ cellINX +'"></div>';
            p_cell[0]=rowINX; p_cell[1]=cellINX;
            primary = false;
        }
    } else {
        // 終点指定        
        if (cellVal.match("#f02")) {
            // 休業日なので、アラート後にp_cellを変数の値に合う色に戻す
            window.alert("このセルは指定できません");
            // 基準点のエレメントを取得
            var ele_id = "element_"+ String(p_cell[0]) + String(p_cell[1]);
            var ele_pri = document.getElementById(ele_id);
            
            if (grids[ p_cell[0]-1][ p_cell[1]-1 ] == 0) {
                // 基準点が白だったので、白に直す
                ele_pri.innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #fff;" id="element_' + p_cell[0] +''+ p_cell[1] +'"></div>';
                
            } else {
                // 基準点が緑だったので、緑に直す
                ele_pri.innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #0f0;" id="element_' + p_cell[0] +''+ p_cell[1] +'"></div>';
            }
            
        } else {
            // 指定点おｋ
            if (rowINX==p_cell[0] && cellINX==p_cell[1]) {
                // 同じ場所
                if (grids[ p_cell[0]-1 ][ p_cell[1]-1 ] == 0) {
                    // 予約
                    if (every_week) {
                        for (var k=rowINX; k<myTbl.rows.length; k+=7) {
                            myTbl.rows[k].cells[cellINX].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #0f0;" id="element_' + i +''+ j +'"></div>';
                            grids[k-1][cellINX-1] = 1;
                        }
                        for (var k=rowINX; k>0; k-=7) {
                            myTbl.rows[k].cells[cellINX].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #0f0;" id="element_' + i +''+ j +'"></div>';
                            grids[k-1][cellINX-1] = 1;
                        }
                    } else {
                        Cell.innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #0f0;" id="element_' + rowINX +''+ cellINX +'"></div>';
                        grids[rowINX-1][cellINX-1] = 1;
                    }
                } else {
                    // 取り消し
                    if (every_week) {
                        for (var k=rowINX; k<myTbl.rows.length; k+=7) {
                            myTbl.rows[k].cells[cellINX].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #fff;" id="element_' + i +''+ j +'"></div>';
                            grids[k-1][cellINX-1] = 0;
                        }
                        for (var k=rowINX; k>0; k-=7) {
                            myTbl.rows[k].cells[cellINX].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #fff;" id="element_' + i +''+ j +'"></div>';
                            grids[k-1][cellINX-1] = 0;
                        }
                    } else {
                        Cell.innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #fff;" id="element_' + rowINX +''+ cellINX +'"></div>';
                        grids[rowINX-1][cellINX-1] = 0;
                    }
                }
            } else {
                if (p_cell[0] <= rowINX) {
                    // 基準点が上か同じ行
                    if (p_cell[1] <= cellINX) {
                        // 基準点が上か同じ行、かつ左か同じ列
                        for (var i=p_cell[0]; i<=rowINX; i++) {
                            for (var j=p_cell[1]; j<=cellINX; j++) {
                                if (myTbl.rows[i].cells[j].innerHTML.match("#f02")) {
                                    // 休業セルは変更しない
                                } else if (grids[i-1][j-1] == 0) {
                                    // 塗り替え対象の今の状態が白色
                                    myTbl.rows[i].cells[j].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #0f0;" id="element_' + i +''+ j +'"></div>';
                                    grids[i-1][j-1] = 1;
                                } else if (grids[i-1][j-1] == 1) {
                                    // 塗り替え対象の今の状態が緑色
                                    myTbl.rows[i].cells[j].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #fff;" id="element_' + i +''+ j +'"></div>';
                                    grids[i-1][j-1] = 0;
                                } else {}
                            }
                        }
                    } else {
                        // 基準点が上か同じ行、かつ右の列
                        for (var i=p_cell[0]; i<=rowINX; i++) {
                            for (var j=p_cell[1]; j>=cellINX; j--) {
                                if (myTbl.rows[i].cells[j].innerHTML.match("#f02")) {
                                    // 休業セルは変更しない
                                } else if (grids[i-1][j-1] == 0) {
                                    // 塗り替え対象の今の状態が白色
                                    myTbl.rows[i].cells[j].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #0f0;" id="element_' + i +''+ j +'"></div>';
                                    grids[i-1][j-1] = 1;
                                } else if (grids[i-1][j-1] == 1) {
                                    // 塗り替え対象の今の状態が緑色
                                    myTbl.rows[i].cells[j].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #fff;" id="element_' + i +''+ j +'"></div>';
                                    grids[i-1][j-1] = 0;
                                } else {}
                            }
                        }
                    }
                } else {
                    // 基準点が下の行
                    if (p_cell[1] <= cellINX) {
                        // 基準点が下の行、かつ左か同じ列
                        for (var i=p_cell[0]; i>=rowINX; i--) {
                            for (var j=p_cell[1]; j<=cellINX; j++) {
                                if (myTbl.rows[i].cells[j].innerHTML.match("#f02")) {
                                    // 休業セルは変更しない
                                } else if (grids[i-1][j-1] == 0) {
                                    // 塗り替え対象の今の状態が白色
                                    myTbl.rows[i].cells[j].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #0f0;" id="element_' + i +''+ j +'"></div>';
                                    grids[i-1][j-1] = 1;
                                } else if (grids[i-1][j-1] == 1) {
                                    // 塗り替え対象の今の状態が緑色
                                    myTbl.rows[i].cells[j].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #fff;" id="element_' + i +''+ j +'"></div>';
                                    grids[i-1][j-1] = 0;
                                } else {}
                            }
                        }
                    } else {
                        // 基準点が下の行、かつ右か同じ列
                        for (var i=p_cell[0]; i>=rowINX; i--) {
                            for (var j=p_cell[1]; j>=cellINX; j--) {
                                if (myTbl.rows[i].cells[j].innerHTML.match("#f02")) {
                                    // 休業セルは変更しない
                                } else if (grids[i-1][j-1] == 0) {
                                    // 塗り替え対象の今の状態が白色
                                    myTbl.rows[i].cells[j].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #0f0;" id="element_' + i +''+ j +'"></div>';
                                    grids[i-1][j-1] = 1;
                                } else if (grids[i-1][j-1] == 1) {
                                    // 塗り替え対象の今の状態が緑色
                                    myTbl.rows[i].cells[j].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #fff;" id="element_' + i +''+ j +'"></div>';
                                    grids[i-1][j-1] = 0;
                                } else {}
                            }
                        }
                    }
                }
                
                
                
            }
        }
        primary = true;
    }
}

function getdata() {
    var str_bin ="";
    var days = Array(grids.length-1);
    
    for (var i=0; i<grids.length-1; i++) {
        for (var j=0; j<grids[i].length-1; j++) {
            str_bin += String(grids[i][j]);
        }
        
        make_hidden(i, parseInt(str_bin, 2), "set");
        str_bin  = "";
    }
    
}

function make_hidden( name, value, formname ){
    var q = document.createElement('input');
    q.type = 'hidden';
    q.name = name;
    q.value = value;
    if (formname){ document.forms[formname].appendChild(q); }
    else{ document.forms[0].appendChild(q); }
}