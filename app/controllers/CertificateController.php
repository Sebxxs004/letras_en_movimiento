<?php
class CertificateController extends Controller {
    public function generate(){
        Auth::requireAny(['child']);
        $u = Auth::user();
        // Verificar si tiene 100% avanzado en todos los juegos
        $games = ['buildword','dictation','vowels','wordsearch','animalstart','match'];
        $ok = true;
        foreach ($games as $g){
            $r = DB::query('SELECT progress FROM progress WHERE user_id=? AND game_key=? AND difficulty="avanzado" LIMIT 1',[$u['id'],$g])->fetch_assoc();
            if (!$r || (int)$r['progress'] < 100) { $ok=false; break; }
        }
        if (!$ok){ echo "Aún no completas el 100% en nivel avanzado de todos los juegos."; return; }
        require __DIR__ . '/../../public/assets/vendor/fpdf/fpdf.php';
        $pdf = new FPDF('L','mm','A4');
        $pdf->AddPage();
        $pdf->SetFont('Arial','B',32);
        $pdf->Cell(0,20,utf8_decode('Certificado de Finalización'),0,1,'C');
        $pdf->SetFont('Arial','',20);
        $pdf->Ln(10);
        $pdf->Cell(0,10,utf8_decode('Se certifica que ' . $u['name']),0,1,'C');
        $pdf->Cell(0,10,utf8_decode('ha completado todas las actividades de "Letras en Movimiento".'),0,1,'C');
        $pdf->Ln(10);
        $pdf->SetFont('Arial','I',16);
        $pdf->Cell(0,10,utf8_decode('Fecha: '.date('Y-m-d')),0,1,'C');
        $pdf->Output('D','certificado_letras_en_movimiento.pdf');
    }
}
?>