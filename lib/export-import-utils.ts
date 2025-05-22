/**
 * Utilitários para exportação e importação de dados em formato CSV
 */

/**
 * Converte um array de objetos para uma string CSV
 * @param data Array de objetos a serem convertidos
 * @returns String no formato CSV
 */
export function convertToCSV(data: any[]): string {
  if (data.length === 0) return ""

  // Obter os cabeçalhos (nomes das propriedades)
  const headers = Object.keys(data[0])

  // Criar a linha de cabeçalho
  const headerRow = headers.join(",")

  // Criar as linhas de dados
  const rows = data
    .map((obj) => {
      return headers
        .map((header) => {
          // Tratar valores nulos ou indefinidos
          let cell = obj[header] === null || obj[header] === undefined ? "" : obj[header]

          // Converter para string
          cell = String(cell)

          // Escapar aspas duplas e envolver em aspas se contiver vírgulas ou quebras de linha
          if (cell.includes('"') || cell.includes(",") || cell.includes("\n")) {
            cell = cell.replace(/"/g, '""')
            cell = `"${cell}"`
          }

          return cell
        })
        .join(",")
    })
    .join("\n")

  // Retornar o CSV completo
  return `${headerRow}\n${rows}`
}

/**
 * Exporta dados para um arquivo CSV e inicia o download
 * @param data Array de objetos a serem exportados
 * @param filename Nome do arquivo CSV
 */
export function exportToCSV(data: any[], filename: string): void {
  // Converter os dados para CSV
  const csv = convertToCSV(data)

  // Criar um blob com o conteúdo CSV
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })

  // Criar URL para o blob
  const url = URL.createObjectURL(blob)

  // Criar um elemento de link para download
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  // Adicionar o link ao DOM
  document.body.appendChild(link)

  // Clicar no link para iniciar o download
  link.click()

  // Remover o link do DOM
  document.body.removeChild(link)
}

/**
 * Lê um arquivo CSV e converte para um array de objetos
 * @param file Arquivo CSV a ser lido
 * @returns Promise com array de objetos
 */
export function readCSVFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string
        const lines = csv.split("\n")

        // Obter os cabeçalhos (primeira linha)
        const headers = lines[0].split(",").map((header) => header.trim())

        // Processar as linhas de dados
        const result = []
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue // Pular linhas vazias

          // Dividir a linha em células, respeitando aspas
          const cells = parseCSVLine(line)

          // Criar objeto com os dados da linha
          const obj: Record<string, any> = {}
          headers.forEach((header, index) => {
            // Remover aspas extras
            let value = cells[index] || ""
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1).replace(/""/g, '"')
            }

            // Converter valores booleanos e numéricos
            if (value.toLowerCase() === "true") {
              obj[header] = true
            } else if (value.toLowerCase() === "false") {
              obj[header] = false
            } else if (!isNaN(Number(value)) && value !== "") {
              obj[header] = Number(value)
            } else {
              obj[header] = value
            }
          })

          result.push(obj)
        }

        resolve(result)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo CSV"))
    }

    reader.readAsText(file)
  })
}

/**
 * Função auxiliar para dividir uma linha CSV em células, respeitando aspas
 * @param line Linha CSV
 * @returns Array de células
 */
function parseCSVLine(line: string): string[] {
  const cells: string[] = []
  let currentCell = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      // Se encontrarmos aspas duplas consecutivas dentro de uma célula com aspas, é um escape
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        currentCell += '"'
        i++ // Pular a próxima aspa
      } else {
        // Alternar o estado de inQuotes
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      // Se encontrarmos uma vírgula fora de aspas, é um delimitador de célula
      cells.push(currentCell)
      currentCell = ""
    } else {
      // Qualquer outro caractere é parte da célula atual
      currentCell += char
    }
  }

  // Adicionar a última célula
  cells.push(currentCell)

  return cells
}
