<?php
class DiagnosticController extends Controller {
    public function start(){
        Auth::requireAny(['child']);
        $this->view('diagnostic/start');
    }
    public function submit(){
        Auth::requireAny(['child']);
        $u = Auth::user();
        // Inputs de POST: scores parciales y detalles
        $letters = (int)($_POST['letters_score'] ?? 0);
        $phrases = (int)($_POST['phrases_score'] ?? 0);
        $vowels  = (int)($_POST['vowels_score'] ?? 0);
        $total = $letters + $phrases + $vowels; // máx 5 cada uno = 15
        $score5 = round(($total/15)*5,2);
        $level = $score5 < 2.5 ? 'alto' : ($score5 < 4 ? 'medio' : 'bajo'); // alto=alto déficit
        $details = json_encode(['letters'=>$letters,'phrases'=>$phrases,'vowels'=>$vowels,'score5'=>$score5]);
        $dm = new Diagnostic();
        $dm->saveAttempt($u['id'],$score5,$level,$details);
        $msg = $score5 < 2.5 ? '¡Ánimo! Con práctica lo harás mejor. '
             : ($score5 < 4 ? '¡Vas bien! Sigamos practicando.' : '¡Excelente! ¡Sigue así!');
        $this->view('diagnostic/result',['score'=>$score5,'level'=>$level,'message'=>$msg]);
    }
}
?>