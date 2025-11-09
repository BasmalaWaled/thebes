param(
  [int]$Port = 5500
)

$baseDir = Get-Location
$prefix = "http://localhost:$Port/"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".htm"  = "text/html; charset=utf-8"
  ".css"  = "text/css"
  ".js"   = "application/javascript"
  ".json" = "application/json"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".png"  = "image/png"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Static server running at $prefix (root: $baseDir)"

try {
  while ($true) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response

    $relPath = $req.Url.AbsolutePath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($relPath)) { $relPath = 'index.html' }
    $filePath = Join-Path $baseDir $relPath

    if (Test-Path $filePath) {
      try {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = $mime[$ext]
        if (-not $contentType) { $contentType = 'application/octet-stream' }
        $res.ContentType = $contentType
        $res.StatusCode = 200
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      } catch {
        $res.StatusCode = 500
        $msg = [System.Text.Encoding]::UTF8.GetBytes("Internal Server Error")
        $res.OutputStream.Write($msg, 0, $msg.Length)
      }
    } else {
      $res.StatusCode = 404
      $notFound = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
      $res.OutputStream.Write($notFound, 0, $notFound.Length)
    }

    $res.OutputStream.Close()
  }
}
finally {
  $listener.Stop()
}