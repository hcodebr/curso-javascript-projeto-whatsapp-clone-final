# Define o parâmetro $1 como uma string
param([string]$1)

# Define a política de execução como Bypass para o processo atual como 'force'
Set-ExecutionPolicy Bypass -Scope Process -Force

# Este código é um comentário em PowerShell que explica o propósito das próximas três linhas de código.
# Elas estão em um idioma diferente do PowerShell, então podem não ser executáveis diretamente.
# É importante traduzir ou reescrever essas linhas para que façam sentido no contexto do script PowerShell.

git add --all
git commit -m ":fire:$1"
git push

