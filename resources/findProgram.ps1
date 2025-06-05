param ($programName)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$startMenuDirs = @(
    "$env:PROGRAMDATA\Microsoft\Windows\Start Menu\Programs",
    "$env:APPDATA\Microsoft\Windows\Start Menu\Programs"
)

foreach ($dir in $startMenuDirs) {
    Get-ChildItem -Path $dir -Filter *.lnk | ForEach-Object {
        $WshShell = New-Object -ComObject WScript.Shell
        $Shortcut = $WshShell.CreateShortcut($_.FullName)
        $TargetPath = $Shortcut.TargetPath
        
        if ($TargetPath -like "*$programName*.exe") {
            Write-Output $TargetPath
        }
    }
}