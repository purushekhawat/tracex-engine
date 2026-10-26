# TRACE-X Frontend Build & Packaging Utility
# Usage: .\package-frontend.ps1

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " TRACE-X FRONTEND PACKAGING SCRIPT       " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$Root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$FrontendDir = Join-Path $Root "frontend"
$DistDir = Join-Path $FrontendDir "dist"
$DistZip = Join-Path $Root "frontend-dist.zip"
$SourceZip = Join-Path $Root "frontend.zip"

# Step 1: Production Build
Write-Host "`n[1/3] Building production bundle (npm run build)..." -ForegroundColor Yellow
Set-Location $FrontendDir
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please check errors." -ForegroundColor Red
    Set-Location $Root
    exit 1
}

# Step 2: Create frontend-dist.zip (Compiled Production Assets)
Write-Host "`n[2/3] Creating frontend-dist.zip (Production Build)..." -ForegroundColor Yellow
Set-Location $Root
if (Test-Path $DistZip) { Remove-Item $DistZip -Force }
python -c "
import os, zipfile
dist_dir = r'$DistDir'
dist_zip = r'$DistZip'
with zipfile.ZipFile(dist_zip, 'w', zipfile.ZIP_DEFLATED) as z:
    for foldername, subfolders, filenames in os.walk(dist_dir):
        for filename in filenames:
            fp = os.path.join(foldername, filename)
            z.write(fp, os.path.relpath(fp, dist_dir))
"

# Step 3: Create frontend.zip (Clean Source Code)
Write-Host "`n[3/3] Creating frontend.zip (Clean Source Code without node_modules)..." -ForegroundColor Yellow
if (Test-Path $SourceZip) { Remove-Item $SourceZip -Force }
python -c "
import os, zipfile
fe_dir = r'$FrontendDir'
source_zip = r'$SourceZip'
exclude = {'node_modules', '.git', 'dist'}
with zipfile.ZipFile(source_zip, 'w', zipfile.ZIP_DEFLATED) as z:
    for foldername, subfolders, filenames in os.walk(fe_dir):
        subfolders[:] = [d for d in subfolders if d not in exclude]
        for filename in filenames:
            if filename.endswith('.zip'): continue
            fp = os.path.join(foldername, filename)
            z.write(fp, os.path.relpath(fp, r'$Root'))
"

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host " PACKAGING COMPLETE!                     " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Created files ready for upload:"
Write-Host "1. frontend.zip       -> Clean source code (src, public, package.json, configs)" -ForegroundColor Green
Write-Host "2. frontend-dist.zip  -> Compiled production build (ready for Netlify/Vercel/Static hosting)" -ForegroundColor Green
