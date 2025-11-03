import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Função auxiliar para formatar data
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

// Função auxiliar para formatar moeda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Cabeçalho padrão do PDF
const addHeader = (doc, title) => {
  doc.setFillColor(59, 130, 246) // Azul
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Sistema Integrador Empresarial', 20, 20)
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text(title, 20, 32)
  
  doc.setTextColor(0, 0, 0)
}

// Rodapé com data e página
const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Gerado em ${new Date().toLocaleString('pt-BR')}`,
      20,
      pageHeight - 10
    )
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - 60,
      pageHeight - 10
    )
  }
}

// Exportar relatório de clientes
export const exportClientesPDF = (clientes) => {
  const doc = new jsPDF()
  
  addHeader(doc, 'Relatório de Clientes')
  
  const tableData = clientes.map((c) => [
    c.nome,
    c.cpf_cnpj,
    c.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica',
    c.telefone || '-',
    c.email || '-',
    c.cidade || '-',
    c.ativo ? 'Sim' : 'Não'
  ])

  doc.autoTable({
    head: [['Nome', 'CPF/CNPJ', 'Tipo', 'Telefone', 'Email', 'Cidade', 'Ativo']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] }
  })

  // Adicionar estatísticas
  const yPos = doc.lastAutoTable.finalY + 15
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Estatísticas:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total de Clientes: ${clientes.length}`, 20, yPos + 7)
  doc.text(
    `Clientes Ativos: ${clientes.filter((c) => c.ativo).length}`,
    20,
    yPos + 14
  )
  doc.text(
    `Clientes Inativos: ${clientes.filter((c) => !c.ativo).length}`,
    20,
    yPos + 21
  )

  addFooter(doc)
  doc.save('relatorio-clientes.pdf')
}

// Exportar relatório de produtos
export const exportProdutosPDF = (produtos, categorias) => {
  const doc = new jsPDF()
  
  addHeader(doc, 'Relatório de Produtos')
  
  const tableData = produtos.map((p) => {
    const categoria = categorias.find((c) => c.id === p.categoria)
    return [
      p.codigo,
      p.nome,
      categoria?.nome || '-',
      formatCurrency(p.preco_custo || 0),
      formatCurrency(p.preco_venda || 0),
      p.estoque_minimo || 0,
      p.ativo ? 'Sim' : 'Não'
    ]
  })

  doc.autoTable({
    head: [['Código', 'Nome', 'Categoria', 'Custo', 'Venda', 'Estoque', 'Ativo']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] }
  })

  // Estatísticas
  const yPos = doc.lastAutoTable.finalY + 15
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Estatísticas:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total de Produtos: ${produtos.length}`, 20, yPos + 7)
  doc.text(
    `Produtos Ativos: ${produtos.filter((p) => p.ativo).length}`,
    20,
    yPos + 14
  )
  
  const valorTotal = produtos.reduce(
    (sum, p) => sum + parseFloat(p.preco_venda || 0),
    0
  )
  doc.text(`Valor Total em Catálogo: ${formatCurrency(valorTotal)}`, 20, yPos + 21)

  addFooter(doc)
  doc.save('relatorio-produtos.pdf')
}

// Exportar relatório de vendas
export const exportVendasPDF = (vendas, clientes, produtos) => {
  const doc = new jsPDF()
  
  addHeader(doc, 'Relatório de Vendas')
  
  const tableData = vendas.map((v) => {
    const cliente = clientes.find((c) => c.id === v.cliente)
    return [
      v.numero_venda || v.id,
      formatDate(v.data_venda || v.created_at),
      cliente?.nome || 'Cliente não encontrado',
      formatCurrency(v.valor_total || 0),
      v.status || 'Concluída',
      v.forma_pagamento || '-'
    ]
  })

  doc.autoTable({
    head: [['Nº Venda', 'Data', 'Cliente', 'Valor Total', 'Status', 'Pagamento']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] }
  })

  // Estatísticas
  const yPos = doc.lastAutoTable.finalY + 15
  const valorTotal = vendas.reduce(
    (sum, v) => sum + parseFloat(v.valor_total || 0),
    0
  )
  const ticketMedio = vendas.length > 0 ? valorTotal / vendas.length : 0

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Estatísticas:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total de Vendas: ${vendas.length}`, 20, yPos + 7)
  doc.text(`Valor Total: ${formatCurrency(valorTotal)}`, 20, yPos + 14)
  doc.text(`Ticket Médio: ${formatCurrency(ticketMedio)}`, 20, yPos + 21)

  addFooter(doc)
  doc.save('relatorio-vendas.pdf')
}

// Exportar relatório financeiro
export const exportFinanceiroPDF = (contas) => {
  const doc = new jsPDF()
  
  addHeader(doc, 'Relatório Financeiro')
  
  const tableData = contas.map((c) => [
    c.descricao || 'Sem descrição',
    c.tipo === 'R' ? 'Receber' : 'Pagar',
    formatCurrency(c.valor || 0),
    formatDate(c.data_vencimento),
    c.status === 'PG' ? 'Pago' : c.status === 'PE' ? 'Pendente' : 'Vencido',
    c.data_pagamento ? formatDate(c.data_pagamento) : '-'
  ])

  doc.autoTable({
    head: [['Descrição', 'Tipo', 'Valor', 'Vencimento', 'Status', 'Pagamento']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] }
  })

  // Estatísticas
  const yPos = doc.lastAutoTable.finalY + 15
  const receber = contas
    .filter((c) => c.tipo === 'R')
    .reduce((sum, c) => sum + parseFloat(c.valor || 0), 0)
  const pagar = contas
    .filter((c) => c.tipo === 'P')
    .reduce((sum, c) => sum + parseFloat(c.valor || 0), 0)
  const saldo = receber - pagar

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Resumo Financeiro:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total a Receber: ${formatCurrency(receber)}`, 20, yPos + 7)
  doc.text(`Total a Pagar: ${formatCurrency(pagar)}`, 20, yPos + 14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(saldo >= 0 ? 0 : 255, saldo >= 0 ? 128 : 0, 0)
  doc.text(`Saldo: ${formatCurrency(saldo)}`, 20, yPos + 21)

  addFooter(doc)
  doc.save('relatorio-financeiro.pdf')
}

// Exportar relatório de estoque
export const exportEstoquePDF = (estoques, produtos) => {
  const doc = new jsPDF()
  
  addHeader(doc, 'Relatório de Estoque')
  
  const tableData = estoques.map((e) => {
    const produto = produtos.find((p) => p.id === e.produto)
    return [
      produto?.codigo || '-',
      produto?.nome || 'Produto não encontrado',
      e.quantidade || 0,
      produto?.estoque_minimo || 0,
      e.quantidade < (produto?.estoque_minimo || 0) ? 'Baixo' : 'OK',
      formatDate(e.ultima_atualizacao || e.updated_at)
    ]
  })

  doc.autoTable({
    head: [['Código', 'Produto', 'Quantidade', 'Mínimo', 'Status', 'Atualização']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] }
  })

  // Estatísticas
  const yPos = doc.lastAutoTable.finalY + 15
  const estoqueBaixo = estoques.filter(
    (e) => {
      const produto = produtos.find((p) => p.id === e.produto)
      return e.quantidade < (produto?.estoque_minimo || 0)
    }
  ).length

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Estatísticas:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total de Itens: ${estoques.length}`, 20, yPos + 7)
  doc.setTextColor(estoqueBaixo > 0 ? 255 : 0, estoqueBaixo > 0 ? 0 : 0, 0)
  doc.text(`⚠️ Itens com Estoque Baixo: ${estoqueBaixo}`, 20, yPos + 14)

  addFooter(doc)
  doc.save('relatorio-estoque.pdf')
}
