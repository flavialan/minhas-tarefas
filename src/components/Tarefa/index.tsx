import { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import * as S from './styles'
import { Botao, BotaoSalvar } from '../../styles'
//Importa a funcao de remover
import { remover, editar, alteraStatus } from '../../store/reducers/tarefas'
import TarefaClass from '../../models/Tarefa'
import * as enums from '../../utils/enums/Tarefa'

type Props = TarefaClass //As props receberao a classe tarefa criada com o id de cada tarefa

const Tarefa = ({
  status,
  prioridade,
  descricao: descricaoOriginal, //mudamos o nome da descricao para nao dar erro com a nova descricao
  titulo,
  id
}: Props) => {
  //Para usar o funcao de remover tarefa criado no slice tarefas usa a funcao useDispatch armazenando ela em uma constante
  //depois, no botao de remover chama a funcao dispatch usando coomo argumento a funcao de remover
  //na funcao de remover usa como argumento o id da tarefa
  const dispatch = useDispatch()
  const [estaEditando, setEstaeditando] = useState(false)
  const [descricao, setDescricao] = useState('')

  //Para manter a descricao original usa-se useEffect com um array que contem a descricao original
  useEffect(() => {
    if (descricaoOriginal.length > 0) {
      setDescricao(descricaoOriginal)
    }
  }, [descricaoOriginal])

  function cancelarEdicao() {
    setEstaeditando(false)
    setDescricao(descricaoOriginal)
  }

  function alteraStatusTarefa(e: ChangeEvent<HTMLInputElement>) {
    dispatch(alteraStatus({ id, finalizado: e.target.checked }))
  }

  return (
    <S.Card>
      <label htmlFor={titulo}>
        <input
          type="checkbox"
          id={titulo}
          checked={status === enums.Status.FINALIZADA}
          onChange={alteraStatusTarefa}
        />
        <S.Titulo>
          {estaEditando && <em>Editando: </em>}
          {titulo}
        </S.Titulo>
      </label>
      <S.Tag parametro="prioridade" prioridade={prioridade}>
        {prioridade}
      </S.Tag>
      <S.Tag parametro="status" status={status}>
        {status}
      </S.Tag>
      <S.Descricao
        disabled={!estaEditando} //O text area estara desabilitado quando a funcao estaEditando for falsa
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <S.BarraAcoes>
        {estaEditando ? (
          <>
            <BotaoSalvar
              onClick={() => {
                dispatch(
                  editar({
                    descricao,
                    prioridade,
                    status,
                    titulo,
                    id
                  })
                )
                setEstaeditando(false)
              }}
            >
              Salvar
            </BotaoSalvar>
            <S.BotaoCancelarRemover onClick={cancelarEdicao}>
              Cancelar
            </S.BotaoCancelarRemover>
          </>
        ) : (
          <>
            <Botao onClick={() => setEstaeditando(true)}>Editar</Botao>
            <S.BotaoCancelarRemover onClick={() => dispatch(remover(id))}>
              Remover
            </S.BotaoCancelarRemover>
          </>
        )}
      </S.BarraAcoes>
    </S.Card>
  )
}

export default Tarefa
