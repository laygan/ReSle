<?php
    if ( isset($_POST["type"]) ) {
        if ($_POST["type"] === "setup") {
            if ( isset($_POST["res_s"], $_POST["res_e"], $_POST["rec_s"], $_POST["rec_e"]) ) {
                    $buff = print_r($_POST, true);
                    $fp = fopen("./../db/settings.ini", 'w');
                    
                    fwrite($fp, "@ This file was written by PHP program.\n@ Don't Edit.\n\n\n");    // 1-4行目
                    fwrite($fp, $buff);
                    fclose($fp);
            } else {
                die("予約エラー：POST値不足");
            }
        } else if ($_POST["type"] === "reserv") {
            
        } else {
            die("予約エラー：処理指示が不正");
        }
    }
?>