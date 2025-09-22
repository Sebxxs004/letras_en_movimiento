<?php
class Diagnostic extends Model {
    public function hasDone($user_id){
        $r = DB::query('SELECT id FROM diagnostic_attempts WHERE user_id=? LIMIT 1',[$user_id]);
        return $r->num_rows>0;
    }
    public function saveAttempt($user_id,$score,$level,$details_json){
        DB::query('INSERT INTO diagnostic_attempts(user_id,score,level,details,created_at) VALUES (?,?,?,?,NOW())',
        [$user_id,$score,$level,$details_json]);
        DB::query('INSERT INTO user_levels(user_id, level, updated_at) VALUES (?, ?, NOW())
                    ON DUPLICATE KEY UPDATE level=VALUES(level), updated_at=NOW()', [$user_id,$level]);
    }
    public function getLatest($user_id){
        $r = DB::query('SELECT * FROM diagnostic_attempts WHERE user_id=? ORDER BY created_at DESC LIMIT 1',[$user_id]);
        return $r->fetch_assoc();
    }
}
?>