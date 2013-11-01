<?php
/*
 *  SQLite Interface
 */
    
interface db_conector
{
    //データベース接続
    function __construct($fname);
    
    //データベース切断
    function __destruct();
    
    //SQL文実行
    function query($str);
    
    //直打ちSQL文実行
    function force_query($str);
    
    //SQL文実行後の結果を配列で取得
    function array_query($str);
    
    //直近のエラーを取得する
    function last_error();
    
}

class db_sqlite3 implements db_conector{
    private $dbconn="";
    
    function __construct($fname) {
         try {
            $this->dbconn = new SQLite3($fname);
         } catch(Exception $dbe) {
            echo "DBIFエラー:\n エラーコード ";
            echo $dbe->getCode();
            echo "（";
            echo $dbe->getMessage();
            echo "）\n at Line ";
            echo $dbe->line();
            echo ".\n";
         }
    }
    
    function __destruct() {
        if ( $this->dbconn->close() ) {
            // closed
        } else {
            die("DBIFエラー：close失敗");
        }
    }
    
    function query($str) {
        $tmp = htmlspecialchars($str, ENT_NOQUOTES, 'UTF-8');
        $safe_str = $this->dbconn->escapeString($tmp);
        #echo $safe_str;
        $result = $this->dbconn->querySingle($safe_str, TRUE);
        
        return $result;
    }
    
    function force_query($str) {
        return $this->dbconn->querySingle($str, TRUE);
    }
    
    function array_query($str) {
        $tmp = htmlspecialchars($str, ENT_NOQUOTES, 'UTF-8');
        $safe_str = $this->dbconn->escapeString($tmp);
        #echo $safe_str;
        $result = $this->dbconn->query($safe_str);
        
        return $result;
    }
    
    function last_error() {
        return $this->dbconn->lastErrorMsg();
    }
}

?>