// ここからスタート
// 読み込みが終わったら、getCELL()を実行する
window.addEventListener("load",getCELL,false);

var session_id=null;
window.onload = function() {
	// session idを取得するためのAjax
	$.ajax( {
		type: "POST",
		url: "./core/ctrl.php",
		data: {
			'runFlag': 'get-session'
		},
		success: function(json) {
			console.log("Success Request: get Session id");
			var data = json[0].session_id;
			if(data == "null") {
				console.log("Returned NULL");
			} else {
				console.log("Got session id! : "+data);
				get_reserv(data);
			}
		}
	} );
}

//送信ボタンに関するJavascript
$('#btn-state').click(function () {
    var btn = $(this);
    btn.button('loading');
    setTimeout(function () {
        btn.button('reset');
    }, 60000);
});

// 毎週ボタンに関するJavascript
var every_week = false;

$('#every').click(function () {
    if (every_week) {   // 押されている
        every_week = false;
    } else {            // 押されていない
        every_week = true;
    }
});


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
                if (every_week) {
                    // 毎週ボタンTrue
                    for (var k=rowINX; k<myTbl.rows.length; k+=7) {
                        paint_cell(k, cellINX);
                    }
                    for (var k=rowINX-7; k>0; k-=7) {
                        paint_cell(k, cellINX);
                    }
                } else {
                    // 毎週ボタンFalse
                    paint_cell(rowINX, cellINX);
                }
            } else {
                if (p_cell[0] <= rowINX) {
                    // 基準点が上か同じ行
                    if (p_cell[1] <= cellINX) {
                        // 基準点が上か同じ行、かつ左か同じ列
                        for (var i=p_cell[0]; i<=rowINX; i++) {
                            for (var j=p_cell[1]; j<=cellINX; j++) {
                                if (every_week) {
                                    // 毎週ボタンTrue
                                    for (var k=i; k<myTbl.rows.length; k+=7) {
                                        paint_cell(k, j);
                                    }
                                    for (var k=i-7; k>0; k-=7) {
                                        paint_cell(k, j);
                                    }
                                } else {
                                    // 毎週ボタンFalse
                                    paint_cell(i, j);
                                }
                            }
                        }
                    } else {
                        // 基準点が上か同じ行、かつ右の列
                        for (var i=p_cell[0]; i<=rowINX; i++) {
                            for (var j=p_cell[1]; j>=cellINX; j--) {
                                if (every_week) {
                                    // 毎週ボタンTrue
                                    for (var k=i; k<myTbl.rows.length; k+=7) {
                                        paint_cell(k, j);
                                    }
                                    for (var k=i-7; k>0; k-=7) {
                                        paint_cell(k, j);
                                    }
                                } else {
                                    // 毎週ボタンFalse
                                    paint_cell(i, j);
                                }
                            }
                        }
                    }
                } else {
                    // 基準点が下の行
                    if (p_cell[1] <= cellINX) {
                        // 基準点が下の行、かつ左か同じ列
                        // 毎週ボタンFalse
                        for (var i=p_cell[0]; i>=rowINX; i--) {
                            for (var j=p_cell[1]; j<=cellINX; j++) {
                                if (every_week) {
                                    // 毎週ボタンTrue
                                    for (var k=i; k<myTbl.rows.length; k+=7) {
                                        paint_cell(k, j);
                                    }
                                    for (var k=i-7; k>0; k-=7) {
                                        paint_cell(k, j);
                                    }
                                } else {
                                    // 毎週ボタンFalse
                                    paint_cell(i, j);
                                }
                            }
                        }
                    } else {
                        // 基準点が下の行、かつ右か同じ列
                        // 毎週ボタンFalse
                        for (var i=p_cell[0]; i>=rowINX; i--) {
                            for (var j=p_cell[1]; j>=cellINX; j--) {
                                if (every_week) {
                                    // 毎週ボタンTrue
                                    for (var k=i; k<myTbl.rows.length; k+=7) {
                                        paint_cell(k, j);
                                    }
                                    for (var k=i-7; k>0; k-=7) {
                                        paint_cell(k, j);
                                    }
                                } else {
                                    // 毎週ボタンFalse
                                    paint_cell(i, j);
                                }
                            }
                        }
                    }
                }
            }
        }
        primary = true;
    }
}

function paint_cell(x, y) {
    if (myTbl.rows[x].cells[y].innerHTML.match("#f02")) {
        // 休業セルは変更しない
    } else if (grids[x-1][y-1] == 0) {
        // 塗り替え対象の今の状態が白色
        myTbl.rows[x].cells[y].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #0f0;" id="element_' + x +''+ y +'"></div>';
        grids[x-1][y-1] = 1;
    } else if (grids[x-1][y-1] == 1) {
        // 塗り替え対象の今の状態が緑色
        myTbl.rows[x].cells[y].innerHTML = '<div style="width: 50px; height:26px; margin: 0px; border: none; background: #fff;" id="element_' + x +''+ y +'"></div>';
        grids[x-1][y-1] = 0;
    } else {}
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

/* 2014-02-05 edit */
function get_reserv(id) {
	$.ajax( {
		type: "POST",
		url: "./core/ctrl.php",
		data: {
			'runFlag':'get-reservation' ,
			'id':id
		},
		success: function(json) {
			console.log("Success Request: already Reservations");
			var data = json;
			if(data == "null") {
				console.log("Returned NULL");
			} else {
				console.log(data);				
				for(var i=0; i<data.length; i++) {
					var mark = data[i].times.toString(2);
					var len = mark.length;
					// 生成された２進数列の後ろからチェック
					for (var j=len; j>0; j--) {
						if(mark[j] == "1") {
							paint_cell(i+1, j+1);
						}
                	}
					console.log(data[i].date+": "+data[i].times+"→"+mark);
				}
			}
		}
	} );
}
