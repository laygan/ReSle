<?php
    if ( isset($_POST["type"]) ) {
        if ($_POST["type"] === "setup") {
            if ( isset($_POST["res_s"], $_POST["res_e"], $_POST["rec_s"], $_POST["rec_e"]) ) {
                    $uri = "http://".$_POST["return-url"];
                    $buff = print_r($_POST, true);
                    $fp = fopen("./../db/settings.ini", 'w');
                    
                    fwrite($fp, "@ This file was written by PHP program.\n@ Don't Edit.\n\n\n");    // 1-4行目
                    fwrite($fp, $buff);
                    fclose($fp);
                    
                    preg_match('/^(.*)(ReSle)/', $uri, $m);
                    page_return("予約設定が完了しました。", $m[0]."/admin.html");
            } else {
                die("予約エラー：POST値不足");
            }
        } else if ($_POST["type"] === "reserv") {
            session_start();
            if (! isset($_SESSION["authed-id"]) ) {
                die("予約エラー：セッション消失");
            }
            require_once('./db_sqlite3.php');
            $data = load_setting();
            $start_d; $stop_d;
            if (! $data){
                die("reserv-reservエラー：設定情報読み出し失敗");
            } else {
                // パラメータ読み出し
                preg_match("/\d{4}\W\d{2}\W\d{2}/", $data[7], $ans);
                $start_d = $ans[0];
                preg_match("/\d{4}\W\d{2}\W\d{2}/", $data[8], $ans);
                $stop_d = $ans[0];
            }
            $db = new db_sqlite3("./../db/srs.db");
            // 前予約データの一括消去
            $sql = 'DELETE FROM shift WHERE id='.$_SESSION["authed-id"].';';
            $db->query($sql);
            date_default_timezone_set("Asia/Tokyo");
            $start = new DateTime($start_d);
            $stop = new DateTime($stop_d);
            $interval = $stop->diff($start);
            $loops = 1+ $interval->format("%a");
            for ($i=0; $i<$loops; $i++) {
                if (! isset($_POST[$i]) ) {
                    die("reserv-reservエラー：POST値不足");
                }
                $sql = 'INSERT INTO shift(id, date, times) VALUES('.$_SESSION["authed-id"].', "'.$start->format("Y-m-d").'", "'.$_POST[$i].'");';
                // echo $sql."\n";
                $db->query($sql);
                $start->modify("+1 day");
            }
            $uri = "http://".$_POST["return-url"];
            preg_match('/^(.*)(ReSle)/', $uri, $m);
            page_return("予約が完了しました。", $m[0]."/reserv.html");
        } else {
            die("予約エラー：処理指示が不正");
        }
    }
    
    function load_setting() {
        $fp = fopen("./../db/settings.ini", 'r');
        if ($fp === false) {
            die("reserv-load_settingエラー：設定情報がありません");
            return false;
        }
        
        $buffer = array();
        $i = 0;
        if (flock($fp, LOCK_SH)){
            while (!feof($fp)) {
                $buffer[$i] = fgets($fp);
                $i++;
            }
            flock($fp, LOCK_UN);
            fclose($fp);
            return $buffer;
        }else{
            fclose($fp);
            die('make_grid：ファイルロックに失敗しました');
            return false;
        }
        return false;
    }
?>