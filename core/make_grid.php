<?php
    /* シフト予約用のテーブルを出力します。
     * $start_dに開始年月日
     * $stop_dに終了年月日
     * を引数として受けます。
     * 書式は"yyyy-mm-dd"で、文字列です。
     */
    function make_grid($start_d, $stop_d) {
        date_default_timezone_set("Asia/Tokyo");
        
        $start = new DateTime($start_d);
        $stop = new DateTime($stop_d);
        $interval = $stop->diff($start);
        $loops = 1+ $interval->format("%a");
        $start->modify("-1 day");
        
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
            echo "            <tr>\n";
            echo "                <th>";
            // 日付生成
            $start->modify("+1 day");
            echo $start->format("m月d日");
            echo "</th>\n";
            for ($j=0; $j<21; $j++) {
                echo "                <td></td>\n";
            }
            echo "            </tr>\n";
        }
        
        echo "        </tbody>\n";
        echo "    </table>\n";
        echo "</div>\n";
    }
?>