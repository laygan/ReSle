<?php
    /* シフト予約用のテーブルを出力します。
     * $start_dに開始年月日
     * $stop_dに終了年月日
     * $reservに予約画面への出力(true)か、設定画面への出力(false)か
     * を引数として受けます。
     * 書式は"yyyy-mm-dd"で、文字列です。
     */
    function make_grid($start_d, $stop_d, $reserv) {
        $out_10 = array();
        date_default_timezone_set("Asia/Tokyo");
        
        if ($reserv) {
            $data = load_setting();
            if (! $data){
                die("make_gridエラー：設定情報読み出し失敗");
            } else {
                // パラメータ読み出し
                preg_match("/\d{4}\W\d{2}\W\d{2}/", $data[7], $ans);
                $start_d = $ans[0];
                preg_match("/\d{4}\W\d{2}\W\d{2}/", $data[8], $ans);
                $stop_d = $ans[0];
                preg_match("/\d{4}\W\d{2}\W\d{2}/", $data[9], $ans);
                $limits_d = $ans[0];
                preg_match("/\d{4}\W\d{2}\W\d{2}/", $data[10], $ans);
                $limite_d = $ans[0];
                
                // シフト募集期間内であるかどうかの確認
                if ( strtotime($limits_d) > strtotime(date("Y-m-d")) ) {
                    echo "<h1>現在予約を受け付けていません。受付開始は$limits_d です。</h1>\n";
                    exit(0);
                } else if ( strtotime($limite_d) < strtotime(date("Y-m-d")) ) {
                    echo "<h1>現在予約を受け付けていません。</h1>\n";
                    exit(0);
                } else {
                    echo "<h3>予約期限：$limite_d</h3>\n";
                    
                    // 休業日を取り出し
                    for ($i=0; $i<count($data)-13; $i++) {
                        preg_match("/[0-9]+/", $data[$i+11], $ans);
                        if ( intval($ans[0]) !== $i) {
                            die("make_gridエラー：休業条件適合時にミスマッチ");
                            exit(1);
                        }
                        preg_match("/[0-9]{1,7}$/", $data[$i+11], $ans);
                        $out_10[$i] = intval($ans[0]);
                    }
                }
            }
        }
        
        $start = new DateTime($start_d);
        $stop = new DateTime($stop_d);
        $interval = $stop->diff($start);
        $loops = 1+ $interval->format("%a");
        $start->modify("-1 day");
        $week_str_list = array( '(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)');
        
        // カレンダー出力開始
        echo "<div class=\"calendar\">\n";
        echo "    <table id=\"shift\">\n";
        echo "        <thead>\n";
        echo "            <tr>\n";
        echo "                <th>　</th><th>8:30</th><th>9:00</th><th>9:30</th><th>10:00</th><th>10:30</th><th>11:00</th><th>11:30</th><th>12:00</th><th>12:30</th><th>13:00</th><th>13:30</th><th>14:00</th><th>14:30</th><th>15:00</th><th>15:30</th><th>16:00</th><th>16:30</th><th>17:00</th><th>17:30</th><th>18:00</th><th>18:30</th>\n";
        echo "            </tr>\n";
        echo "        </thead>\n";
        echo "        <tbody>\n";
        
        for ($i=0; $i<$loops; $i++) {
            if ($reserv) {
                // 休業時間のセルを赤く染める作業
                $out_2 = base_convert($out_10[$i], 10, 2);
                $length = strlen($out_2);
                for ($m=$length; $m<21; $m++) {
                    $tmp = "0".(string)$out_2;
                    $out_2 = $tmp;
                }
            }
            echo "            <tr>\n";
            echo "                <th>";
            // 日付生成
            $start->modify("+1 day");
            echo $start->format("m月d日"). $week_str_list[ $datetime->format('w') ];
            echo "</th>\n";
            for ($j=0; $j<21; $j++) {
                if ($reserv) {
                    if ($out_2[$j] === "1") {
                        echo "                <td><div style=\"width: 50px; height:26px; margin: 0px; border: none; background: #f02;\" id=\"element_".$i.$j."\"></div></td>";
                    } else {
                        echo "                <td></td>\n";
                    }
                } else {
                    echo "                <td></td>\n";
                }
            }
            echo "            </tr>\n";
        }
        
        echo "        </tbody>\n";
        echo "    </table>\n";
        echo "</div>\n";
    }
    
    function load_setting() {
        $fp = fopen("./db/settings.ini", 'r');
        if ($fp === false) {
            die("make_gridエラー：設定情報がありません");
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