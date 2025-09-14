param(
    [string]$Path = ".",
    [string]$Indent = ""
)

# daftar folder/file yang mau di-skip
$exclude = @("node_modules", "dist", ".git", "coverage")

# ambil isi folder
$items = Get-ChildItem -Force -LiteralPath $Path | Where-Object { $exclude -notcontains $_.Name }

for ($i = 0; $i -lt $items.Count; $i++) {
    $item = $items[$i]
    $isLast = $i -eq $items.Count - 1
    $pointer = if ($isLast) { "+-- " } else { "|-- " }

    Write-Output ("$Indent$pointer$($item.Name)")

    if ($item.PSIsContainer) {
        $newIndent = if ($isLast) { "$Indent    " } else { "$Indent|   " }
        & $MyInvocation.MyCommand.Path -Path $item.FullName -Indent $newIndent
    }
}
