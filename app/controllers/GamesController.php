<?php
class GamesController extends Controller {
    public function index(){ Auth::requireAny(['child']); $this->view('games/index'); }
    public function buildword(){ Auth::requireAny(['child']); $this->view('games/buildword'); }
    public function dictation(){ Auth::requireAny(['child']); $this->view('games/dictation'); }
    public function vowels(){ Auth::requireAny(['child']); $this->view('games/vowels'); }
    public function wordsearch(){ Auth::requireAny(['child']); $this->view('games/wordsearch'); }
    public function animalstart(){ Auth::requireAny(['child']); $this->view('games/animalstart'); }
    public function match(){ Auth::requireAny(['child']); $this->view('games/match'); }
    public function saveProgress(){
        Auth::requireAny(['child']);
        $u = Auth::user();
        $game = $_POST['game_key']; $difficulty = $_POST['difficulty']; $progress=(int)$_POST['progress']; $score=(int)$_POST['score'];
        (new Game())->upsertProgress($u['id'],$game,$difficulty,$progress,$score);
        $this->json(['ok'=>true]);
    }
}
?>