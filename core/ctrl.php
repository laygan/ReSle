<?php
/*
 * シフト予約システム
 * コアプログラム
 */
    // db interface
    require_once('db_sqlite3.php');
    
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (! isset($_POST["runFlag"]) ) {
            echo "コアエラー：POST値NULL";
            exit(1);
        } else {
            $mode = $_POST["runFlag"];
            
            switch ($mode) {
                case "rm-user" :
                    rmuser($_POST["del-uname"]);
                    break;
                case "sys-init" :
                    initialize();
                    break;
                case "add-user" :
                    add_user();
                    break;
                
                case "login" :
                    login();
                    break;
                
                case "logout" :
                    logout();
                    break;
                
                case "getcsv" :
                    build_csv();
                    break;
                default :
                    echo "コアエラー：不正なPOST値";
                    exit(1);
            }
        }
    } else {
        echo "コアエラー：不正なページ遷移";
        exit(1);
    }
    
    function build_csv() {
        if (! isset($_POST["start"], $_POST["stop"]) ){
            die("コアエラー：POST値不足");
        }
        
        // CSVファイル名作成
        $file_name = "シフト表".$_POST["start"] . $_POST["stop"].".csv";
        
        // 日付計算用
        date_default_timezone_set("Asia/Tokyo");
        $start_d = new DateTime($_POST["start"]);
        $stop_d = new DateTime($_POST["stop"]);
        
        // CSVファイル書き込み用バッファ作成開始
        $csv_buffer = array();
        $csv_buffer[0] = array("シフト表");
        $csv_buffer[1] = array();
        $csv_buffer[2] = array("　", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30");
        
        // シフト書き込みループ回数
        $interval = $stop_d->diff($start_d);
        $loops = 1+ $interval->format("%a");
        $week_str_list = array( '(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)');
        // シフト書き込み開始
        $db = new db_sqlite3("./../db/srs.db");
        for ($i=0; $i<$loops; $i++) {
            // 一日におけるシフト予約で、一番はやいID
            $sql = 'SELECT min(id) FROM shift WHERE date="'. $start_d->format("Y-m-d") .'" and times!=0;';
            $first = $db->query($sql);
            
            // 一日におけるシフト予約で、一番遅いID
            $sql = 'SELECT max(id) FROM shift WHERE date="'. $start_d->format("Y-m-d") .'" and times!=0;';
            $last = $db->query($sql);
            
            if ( empty($first["min(id)"]) ) {
                $csv_buffer[] = array($start_d->format("Y/m/d"). $week_str_list[ $start_d->format('w') ]);
            } else {
                for ($j=$first["min(id)"]; $j<=$last["max(id)"]; $j++) {
                    $sql = 'SELECT times FROM shift WHERE id='.$j.' and date="'.$start_d->format("Y-m-d").'";';
                    $time = $db->query($sql);
                    if ( empty($time) ) {
                        
                    } else {
                        // 10進->２進化
                        $time_2 = base_convert($time["times"], 10, 2);
                        $length = strlen($time_2);
                        // 桁あわせ
                        for ($k=$length; $k<21; $k++) {
                            $tmp = "0".(string)$time_2;
                            $time_2 = $tmp;
                        }
                        // 日付出力
                        $csv_buffer[] = array( $start_d->format("Y/m/d"). $week_str_list[ $start_d->format('w') ] );
                        $counter = count($csv_buffer) -1;
                        
                        // 名前検索
                        $sql = "SELECT lname, fname FROM user WHERE id=".$j.";";
                        $name = $db->query($sql);
                        
                        // 予約指定判定
                        for ($k=0; $k<21; $k++) {
                            if ($time_2[$k] === "1") {
                                $csv_buffer[$counter][] = $name["lname"]." ".$name["fname"];
                            } else {
                                $csv_buffer[$counter][] = "";
                            }
                        }
                    }
                }
            }
            
            $start_d->modify("+1 day");
        }
        
        // CSVデータの作成
        $csv_data = "";
        
        foreach ($csv_buffer as $key1 => $val1) {
            foreach ($val1 as $key2 => $val2) {
                $csv_data .= (string)$val2.",";
            }
            $csv_data .= "\n";
        }
        // MIMEタイプの設定
        header("Content-Type: application/octet-stream");
        // ファイル名の表示
        header("Content-Disposition: attachment; filename=$file_name");
        // 文字化け対策
        header("Content-Type: text/csv; charset=Shift-JIS");
        // データの出力
        echo mb_convert_encoding($csv_data, "SJIS", "UTF-8");
    }
    /* End of Function */
    
    function logout(){
        // セッションをとりあえずスタート
        session_start();
        
        // セッション削除
        unset($_SESSION["authed-id"]);
        
        // 関連データ全廃棄
        if ( session_destroy() ){
            header("location: ./../index.html?alcode=21");
        }
        
        echo "セッション破棄失敗";
    }
    
    function login() {
        $uri = "http://" .$_POST["return-url"]. "?alcode=31";
        $db = new db_sqlite3("./../db/srs.db");
        $sql = 'SELECT id, lname, fname FROM user WHERE uname="'. $_POST["uname"] .'" and passwd="'. $_POST["pass"] .'";';
        $result = $db->query($sql);
        if (! empty($result) ) {
            // セッションスタート
            session_start();
            $_SESSION["authed-id"] = $result["id"];
            header("location: ./../reserv.html");
            exit(0);
        }
        
        // 該当なし
        header("location: $uri");
    }
    
    function add_user() {
        $uri = "http://".$_POST["return-url"];
        $db = new db_sqlite3("./../db/srs.db");
        $sql = 'INSERT INTO user(uname, lname, fname, passwd, adm) VALUES("' .$_POST["uname"]. '", "' .$_POST["lname"]. '", "' .$_POST["fname"]. '", "' .$_POST["pass"]. '", "false");';
        header("location: $uri");
        print_r( $db->query($sql) );
        if ( strcmp($err = $db->last_error(), "not an error") !== 0 ) {
            echo "<br />\n ERROR: ".$db->last_error();
        }
        
    }
    
    function rmuser($target) {
        if ( empty($target) ) {
            echo "コアエラー：NULLターゲット";
            exit(1);
        }
        
        
    }
    
    function initialize() {
        /*
         * 初期化
         * といっても、ファイルを消して
         * データベース作成で終わり。簡単。
         */
        $cmd = "rm ./../db/srs.db";
        $output = array();
        $ret = null;
        exec($cmd, $output, $ret);
        print_r($output);
        
        $db = new db_sqlite3("./../db/srs.db");
        print_r( $db->query("CREATE TABLE user(id integer primary key autoincrement, uname text UNIQUE NOT NULL, lname text NOT NULL, fname text NOT NULL, passwd integer NOT NULL, adm text);") );
        print_r( $db->query("CREATE TABLE shift(id integer NOT NULL, date text NOT NULL, times integer NOT NULL);") );
        
        print "<p>Finished all sequence by SYSTEM.<br />If no errors are displayed, you must resume operation from top page.</p>";
    }
?>
