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
                
                default :
                    echo "コアエラー：不正なPOST値";
                    exit(1);
            }
        }
    } else {
        echo "コアエラー：不正なページ遷移";
        exit(1);
    }
    
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
        $sql = 'INSERT INTO user(uname, lname, fname, passwd) VALUES("' .$_POST["uname"]. '", "' .$_POST["lname"]. '", "' .$_POST["fname"]. '", "' .$_POST["pass"]. '");';
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
        print_r( $db->query("CREATE TABLE user(id integer primary key autoincrement, uname text UNIQUE NOT NULL, lname text NOT NULL, fname text NOT NULL, passwd integer NOT NULL);") );
        print_r( $db->query("CREATE TABLE shift(id integer primary key, date text NOT NULL, times text NOT NULL);") );
        
        print "<p>Finished all sequence by SYSTEM.<br />If no errors are displayed, you must resume operation from top page.</p>";
    }
?>