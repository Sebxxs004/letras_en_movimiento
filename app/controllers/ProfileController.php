<?php
class ProfileController extends Controller {
    public function index(){
        Auth::requireAny(['child']);
        $u = Auth::user();
        $stars = DB::query('SELECT game_key, difficulty, COUNT(*) as cnt FROM stars WHERE user_id=? GROUP BY game_key,difficulty',[$u['id']]);
        $starsData=[]; while($r=$stars->fetch_assoc()) $starsData[]=$r;
        $history = DB::query('SELECT game_key, difficulty, progress, score, updated_at FROM progress WHERE user_id=? ORDER BY updated_at DESC',[$u['id']]);
        $hist=[]; while($r=$history->fetch_assoc()) $hist[]=$r;
        $this->view('profile/index',['user'=>$u,'stars'=>$starsData,'hist'=>$hist]);
    }
}
?>