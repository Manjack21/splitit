
npm run build
(Get-Content dist\index.html -Encoding UTF8).replace('/js/', 'js/').replace('/css/', 'css/') | Out-File dist\index.html -Encoding UTF8

Copy-Item dist\* \\zentrale\Webdata\splitit\ -Recurse -Force