Write-Host "Macrro Online local setup" -ForegroundColor Cyan
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js belum terpasang." -ForegroundColor Red
  exit 1
}
npm install
Write-Host "Selesai. Jalankan: npm run dev" -ForegroundColor Green
