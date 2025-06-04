param ([string[]]$folders = @())

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$abletonProjects = @()

foreach ($folder in $folders) {
  if (Test-Path $folder) {
    $projects = Get-ChildItem -Path $folder -Recurse -Filter "*.als" | Where-Object {
      $_.FullName -notmatch "Backup" -and $_.Name -notmatch "^\."
    }
    $abletonProjects += $projects
  }
}

$sorted = $abletonProjects | Sort-Object -Descending LastWriteTime

$paths = $sorted | ForEach-Object { 
  [PSCustomObject]@{
    path         = $_.FullName
    name         = $_.Name
    lastModified = ([System.DateTimeOffset]$_.LastWriteTime).ToUnixTimeMilliseconds()
  } 
}

$paths | ConvertTo-Json | Out-String