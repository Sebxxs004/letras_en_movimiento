<?php
class AdminController extends Controller {
    public function index(){
        Auth::requireRole('admin');
        $um = new User();
        $levels = $um->childrenCountByLevel();
        // total niños
        $res = DB::query("SELECT COUNT(*) c FROM users WHERE role='child'")->fetch_assoc();
        $total = (int)$res['c'];
        // estrellas por juego
        $stars = DB::query('SELECT game_key, COUNT(*) as cnt FROM stars GROUP BY game_key');
        $starsData = []; while($r=$stars->fetch_assoc()) $starsData[]=$r;
        // últimos diagnósticos
        $diags = DB::query('SELECT u.name, d.score, d.level, d.created_at FROM diagnostic_attempts d JOIN users u ON u.id=d.user_id ORDER BY d.created_at DESC LIMIT 10');
        $diagData = []; while($r=$diags->fetch_assoc()) $diagData[]=$r;
        $this->view('admin/index',['levels'=>$levels,'total'=>$total,'stars'=>$starsData,'diags'=>$diagData]);
    }
}
?>