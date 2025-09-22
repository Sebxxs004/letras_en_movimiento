<?php
class DashboardController extends Controller {
    public function index(){
        Auth::requireAny(['child']);
        $u = Auth::user();
        $diag = new Diagnostic();
        $needs = !$diag->hasDone($u['id']);
        $game = new Game();
        $progress = $game->getProgress($u['id']);
        $this->view('dashboard/index',['user'=>$u,'needsDiagnostic'=>$needs,'progress'=>$progress]);
    }
}
?>