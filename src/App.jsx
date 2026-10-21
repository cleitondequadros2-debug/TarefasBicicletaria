import { useState } from 'react'
import './App.css'

function App() {
  const [tarefas, setTarefas] = useState([
    {idOrdem: crypto.randomUUID(), dsCliente: 'Eduardo', dsServico: 'Trocar o aro', nuValor: 100, fgConcluida: true},
    {idOrdem: crypto.randomUUID(), dsCliente: 'Emanuel', dsServico: 'Trocar o pneu traseiro', nuValor: 75, fgConcluida: false},
    {idOrdem: crypto.randomUUID(), dsCliente: 'Gabriel', dsServico: 'Trocar a corrente', nuValor: 55, fgConcluida: true}
  ])

  const [dsCliente, setDsCliente] = useState('')
  const [dsServico, setDsServico] = useState('')
  const [nuValor, setNuValor] = useState('')
  const [editarIndice, setEditarIndice] = useState(null)

  function salvar(e) {
    e.preventDefault()

    if (
      dsCliente.trim() === "" ||
      dsServico.trim() === "" ||
      nuValor === "" ||
      Number(nuValor) < 0
    ) {
      console.log("Preencha tudo corretamente.")
      return
    }

    if (editarIndice === null) {
      const novaTarefa = { idOrdem: crypto.randomUUID(), dsCliente: dsCliente.trim(), dsServico: dsServico.trim(), nuValor: Number(nuValor),fgConcluida: false }

      setTarefas([...tarefas, novaTarefa])
    } else {
      const tarefasAtualizadas = tarefas.map((tarefa) =>
        tarefa.idOrdem === editarIndice
          ? {...tarefa, dsCliente: dsCliente.trim(), dsServico: dsServico.trim(), nuValor: Number(nuValor)}
          : tarefa
      )

      setTarefas(tarefasAtualizadas)
    }

    cancelarEdicao()
  }

  function editar(id) {
    const tarefa = tarefas.find(
      (tarefa) => tarefa.idOrdem === id
    )

    if (!tarefa) return

    setDsCliente(tarefa.dsCliente)
    setDsServico(tarefa.dsServico)
    setNuValor(String(tarefa.nuValor))
    setEditarIndice(id)
  }

  function apagar(id) {
    if (!confirm('Deseja excluir este serviço?')) return

    setTarefas(tarefas.filter((tarefa) => tarefa.idOrdem !== id))

    if (editarIndice === id) {
      cancelarEdicao()
    }
  }

  function concluir(id) {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.idOrdem === id
          ? { ...tarefa, fgConcluida: !tarefa.fgConcluida }
          : tarefa
      )
    )
  }

  function cancelarEdicao() {
    setDsCliente("")
    setDsServico("")
    setNuValor("")
    setEditarIndice(null)
  }

  const totalConcluidas = tarefas.filter((tarefa) => tarefa.fgConcluida).length
  const totalPendentes = tarefas.length - totalConcluidas

  return (
    <div className="pagina">
      <header>
        <h1>Bicicletaria</h1>
        <p>Controle de clientes e serviços</p>
      </header>
      <section>
        <h2>Resumo</h2>
        <p>Total de serviços: {tarefas.length}</p>
        <p>Concluídos: {totalConcluidas}</p>
        <p>Pendentes: {totalPendentes}</p>
      </section>
      <section>
        <h2>
          {editarIndice === null
            ? 'Cadastrar serviço'
            : 'Editar serviço'}
        </h2>
        <form onSubmit={salvar}>
          <div className="campo">
            <label htmlFor="cliente">Nome do cliente</label>
            <input
              id="cliente"
              type="text"
              value={dsCliente}
              onChange={(e) => setDsCliente(e.target.value)}
              placeholder="Digite o nome do cliente"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="servico">Serviço a realizar</label>
            <input
              id="servico"
              type="text"
              value={dsServico}
              onChange={(e) => setDsServico(e.target.value)}
              placeholder="Ex.: Consertar o freio"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="valor">Valor do serviço (R$)</label>
            <input
              id="valor"
              type="number"
              min="0"
              step="0.01"
              value={nuValor}
              onChange={(e) => setNuValor(e.target.value)}
              placeholder="Ex.: 50.00"
              required
            />
          </div>

          <div>
            <button type="submit">
              {editarIndice === null
                ? 'Cadastrar serviço'
                : 'Salvar alterações'}
            </button>

            {editarIndice !== null && (
              <button
                type="button"
                className="btn-cancelar"
                onClick={cancelarEdicao}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2>Serviços cadastrados</h2>

        {tarefas.length === 0 ? (
          <p>Nenhum serviço cadastrado.</p>
        ) : (
          <ul>
            {tarefas.map((tarefa) => (
              <li key={tarefa.idOrdem}>
                <div className="detalhes">
                  <p><strong>Cliente:</strong> {tarefa.dsCliente}</p>
                  <p><strong>Serviço:</strong> {tarefa.dsServico}</p>
                  <p><strong>Valor:</strong> {tarefa.nuValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  <p><strong>Status:</strong> {tarefa.fgConcluida ? 'Concluído' : 'Pendente'}</p>
                </div>
                <div className="acoes">
                  <button type="button" onClick={() => concluir(tarefa.idOrdem)}>
                    Alterar status
                  </button>
                  <button type="button" onClick={() => editar(tarefa.idOrdem)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => apagar(tarefa.idOrdem)}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default App