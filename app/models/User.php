<?php
class User extends Model {
    public function findByEmail($email) {
        $stmt = DB::query('SELECT * FROM users WHERE email=? LIMIT 1', [$email]);
        return $stmt->fetch_assoc();
    }
    public function create($name,$email,$pass,$role='child') {
        DB::query('INSERT INTO users(name,email,password,role,created_at) VALUES (?,?,?,?,NOW())',
        [$name,$email,password_hash($pass,PASSWORD_BCRYPT),$role]);
        return DB::conn()->insert_id;
    }
    public function childrenCountByLevel() {
        $sql = "SELECT level, COUNT(*) as cnt FROM user_levels GROUP BY level";
        $res = DB::query($sql);
        $map = ['bajo'=>0,'medio'=>0,'alto'=>0];
        while($row=$res->fetch_assoc()){ $map[$row['level']] = (int)$row['cnt']; }
        return $map;
    }
}
?>