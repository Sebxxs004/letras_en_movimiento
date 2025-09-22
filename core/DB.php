<?php
class DB {
    private static $conn = null;

    public static function conn() {
        if (self::$conn === null) {
            self::$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            if (self::$conn->connect_error) {
                die('Error de conexión: ' . self::$conn->connect_error);
            }
            self::$conn->set_charset('utf8mb4');
        }
        return self::$conn;
    }

    private static function interpolate($sql, $params){
        // Reemplaza ? por valores escapados y entre comillas
        $conn = self::conn();
        $parts = explode('?', $sql);
        $final = $parts[0];
        for ($i=0; $i < count($params); $i++){
            $v = $params[$i];
            if (is_null($v)) { $rep = 'NULL'; }
            elseif (is_int($v) || is_float($v)) { $rep = $v; }
            else { $rep = "'" . $conn->real_escape_string($v) . "'"; }
            $final .= $rep . ($parts[$i+1] ?? '');
        }
        return $final;
    }

    // Devuelve siempre mysqli_result o false
    public static function query($sql, $params = []) {
        $conn = self::conn();
        if (!empty($params)) {
            $sql = self::interpolate($sql, $params);
        }
        $res = $conn->query($sql);
        if ($res === false) {
            die('Error en query: ' . $conn->error);
        }
        return $res;
    }
}
?>