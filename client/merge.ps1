# Thư mục chứa source code
$sourceDir = "D:\Personal-Project\Manage-Fund\client"

# File đầu ra
$outputFile = "$sourceDir\merged-client.txt"

# Xóa file cũ nếu tồn tại
if (Test-Path $outputFile) {
    Remove-Item $outputFile
}

# Danh sách thư mục cần loại bỏ
$excludeDirs = @("node_modules", "build", "public", ".git")

# Danh sách phần mở rộng cần lấy
$includeExt = @("*.ts", "*.tsx", "*.json", "*.env.example", "*.css", "*.scss")

Get-ChildItem -Path $sourceDir -Recurse -File |
    Where-Object {
        $relPath = $_.FullName.Substring($sourceDir.Length)

        # ✅ Loại file output
        $_.FullName -ne $outputFile -and

        # ✅ Loại bỏ thư mục không cần thiết
        -not ($excludeDirs | Where-Object { $relPath -like "*\$_*" }) -and

        # ✅ Chỉ lấy đúng loại file
        ($includeExt | Where-Object { $_ -like "*$($_.Extension)" })
    } |
    ForEach-Object {
        Add-Content -Path $outputFile -Value "`n============================================"
        Add-Content -Path $outputFile -Value "FILE PATH: $($_.FullName)"
        Add-Content -Path $outputFile -Value "============================================`n"
        Get-Content $_.FullName | Add-Content -Path $outputFile
    }

Write-Host "✅ Gộp xong! File kết quả: $outputFile"
