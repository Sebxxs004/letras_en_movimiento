<?php
class Game extends Model {
    public function upsertProgress($user_id,$game_key,$difficulty,$progress,$score){
        DB::query('INSERT INTO progress(user_id,game_key,difficulty,progress,score,updated_at) VALUES (?,?,?,?,?,NOW())
        ON DUPLICATE KEY UPDATE progress=VALUES(progress), score=VALUES(score), updated_at=NOW()',
        [$user_id,$game_key,$difficulty,$progress,$score]);
        if ($progress >= 100) {
            DB::query('INSERT IGNORE INTO stars(user_id,game_key,difficulty,awarded_at) VALUES (?,?,?,NOW())',
            [$user_id,$game_key,$difficulty]);
        }
    }
    public function getProgress($user_id){
        $res = DB::query('SELECT * FROM progress WHERE user_id=?',[$user_id]);
        $out=[]; while($row=$res->fetch_assoc()) $out[]=$row; return $out;
    }
}
?>