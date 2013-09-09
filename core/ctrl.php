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
                
                default :
                    echo "コアエラー：不正なPOST値";
                    exit(1);
            }
        }
    } else {
        echo "コアエラー：不正なページ遷移";
        exit(1);
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
        print_r( $db->query("CREATE TABLE user(id integer primary key autoincrement, uname text UNIQUE NOT NULL, lname text NOT NULL, fname text NOT NULL, passwd integer NOT NULL);") );
        print_r( $db->query("CREATE TABLE shift(id integer primary key, date text NOT NULL, times text NOT NULL);") );
        
        print "<p>Finished all sequence by SYSTEM.<br />If no errors are displayed, you must resume operation from top page.</p>";
    }
?>