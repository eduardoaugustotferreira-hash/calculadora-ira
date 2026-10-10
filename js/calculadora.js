/*
 * CALCULADORA IRA
 * 
 * COMENTÁRIOS GERADOS POR IA!
 * 
 * Fluxo:
 * 1. O aluno preenche o formulário.
 * 2. Os dados são conferidos e adicionados à lista "disciplinas".
 * 3. A tabela e os resultados são atualizados.
 *
 * Os registros ficam apenas na memória do navegador.
 * Recarregar ou fechar a página apaga os dados nesta versão.
 */


/* =========================================================
   1. ENCONTRAR OS ELEMENTOS DA PÁGINA
   ========================================================= */

/*
 * document representa o HTML da página.
 *
 * querySelector procura um elemento usando um seletor.
 * O símbolo "#" indica que estamos procurando pelo ID.
 *
 * Exemplo:
 * "#nome" encontra o elemento que tem id="nome" no HTML.
 */
const formulario = document.querySelector("#form-disciplina");

const campoNome = document.querySelector("#nome");
const campoNota = document.querySelector("#nota");
const campoCarga = document.querySelector("#carga-horaria");
const campoStatus = document.querySelector("#status");
const campoSemestre = document.querySelector("#semestre");

// Elementos usados para mostrar mensagens e disciplinas.
const mensagem = document.querySelector("#mensagem");
const tabela = document.querySelector("#tabela-disciplinas");
const lista = document.querySelector("#lista-disciplinas");
const listaVazia = document.querySelector("#lista-vazia");

// Elementos usados para mostrar e filtrar os resultados.
const resultadoIRA = document.querySelector("#ira-acumulado");
const filtroSemestre = document.querySelector("#filtro-semestre");
const resultadoSemestre = document.querySelector("#media-semestre");

/*
 * Aqui a busca acontece somente dentro do formulário.
 * Procuramos o botão que possui type="submit".
 */
const botaoAdicionar = formulario.querySelector(
  "button[type='submit']"
);


/* =========================================================
   2. GUARDAR OS REGISTROS E CONFIGURAR OS NÚMEROS
   ========================================================= */

/*
 * [] cria uma lista, também chamada de array.
 * Cada disciplina cadastrada será um objeto dentro dessa lista.
 *
 * Usamos "let" porque a variável poderá receber uma nova lista
 * quando excluirmos uma disciplina.
 */
let disciplinas = [];

/*
 * Cada disciplina recebe um identificador diferente.
 * Isso permite excluir o registro certo, mesmo quando duas
 * disciplinas possuem o mesmo nome.
 */
let proximoId = 1;

/*
 * Intl.NumberFormat configura a apresentação dos números.
 *
 * "pt-BR" usa o formato brasileiro, com vírgula decimal.
 * O IRA será mostrado com quatro casas: por exemplo, 0,7200.
 *
 * A formatação muda apenas a exibição, não o valor calculado.
 */
const formatoIRA = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4
});

// Notas e médias serão mostradas com até duas casas decimais.
const formatoNota = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2
});


/* =========================================================
   3. AJUSTAR O CAMPO DE NOTA CONFORME A SITUAÇÃO
   ========================================================= */

function ajustarCampoNota() {
  /*
   * ".value" lê o valor atual do campo.
   * "===" compara os valores sem converter seus tipos.
   *
   * "cancelada" será true se essa situação estiver selecionada
   * e false nas demais situações.
   */
  const cancelada = campoStatus.value === "cancelada";

  // Uma disciplina cancelada não precisa receber nota.
  campoNota.disabled = cancelada;

  /*
   * "!" significa negação.
   * Se cancelada for true, !cancelada será false.
   *
   * Assim, a nota só é obrigatória quando não está cancelada.
   */
  campoNota.required = !cancelada;

  // Limpa uma possível nota anterior ao escolher "cancelada".
  if (cancelada) {
    campoNota.value = "";
  }
}


/* =========================================================
   4. CALCULAR A MÉDIA PONDERADA
   ========================================================= */

/*
 * A função recebe uma lista de registros.
 * Pode ser a lista inteira ou apenas a de um semestre.
 *
 * Fórmula:
 * média = soma de (nota × carga horária) / soma das cargas
 */
function calcularMedia(registros) {
  /*
   * filter cria uma nova lista com os registros que passam
   * pela condição informada.
   *
   * "||" significa OU.
   * Entram as disciplinas aprovadas OU reprovadas.
   * As canceladas ficam fora do cálculo.
   */
  const considerados = registros.filter(
    disciplina =>
      disciplina.status === "aprovada" ||
      disciplina.status === "reprovada"
  );

  let somaPonderada = 0;
  let cargaTotal = 0;

  /*
   * "for...of" percorre os elementos de uma lista.
   * A cada repetição, "disciplina" representa um registro.
   */
  for (const disciplina of considerados) {
    /*
     * "+=" soma ao valor que a variável já possui.
     *
     * Exemplo: nota 80 × carga de 60h acrescenta 4800
     * à soma ponderada.
     */
    somaPonderada += disciplina.nota * disciplina.cargaHoraria;

    // Acrescenta a carga dessa disciplina ao total de horas.
    cargaTotal += disciplina.cargaHoraria;
  }

  /*
   * Se não há disciplinas consideradas, não podemos dividir
   * por zero. Retornamos null para indicar ausência de resultado.
   *
   * null é diferente de zero: zero pode ser uma média válida.
   */
  if (cargaTotal === 0) {
    return null;
  }

  // return devolve o resultado para quem chamou a função.
  return somaPonderada / cargaTotal;
}


/* =========================================================
   5. EXIBIR OS RESULTADOS
   ========================================================= */

function atualizarResultados() {
  // Calcula a média de todas as disciplinas consideradas.
  const mediaGeral = calcularMedia(disciplinas);

  /*
   * O operador "? :" escolhe entre dois valores:
   *
   * condição ? valor se verdadeiro : valor se falso
   *
   * Sem resultado, mostramos "—".
   * Com resultado, dividimos por 100 para obter o IRA de 0 a 1.
   */
  resultadoIRA.textContent =
    mediaGeral === null
      ? "—"
      : formatoIRA.format(mediaGeral / 100);

  // Separa somente os registros do semestre selecionado.
  const registrosSemestre = disciplinas.filter(
    disciplina => disciplina.semestre === filtroSemestre.value
  );

  const mediaSemestre = calcularMedia(registrosSemestre);

  // A média do semestre permanece na escala de 0 a 100.
  resultadoSemestre.textContent =
    mediaSemestre === null
      ? "—"
      : formatoNota.format(mediaSemestre);
}


/* =========================================================
   6. ATUALIZAR AS OPÇÕES DE SEMESTRE
   ========================================================= */

function atualizarSemestres() {
  // Guarda a seleção atual para tentar mantê-la após a atualização.
  const selecionadoAntes = filtroSemestre.value;

  /*
   * map extrai o semestre de cada disciplina.
   * Set elimina os valores repetidos.
   * "..." transforma os valores do Set novamente em uma lista.
   * sort ordena os semestres.
   *
   * Como usamos o formato AAAA.S, a ordem textual também
   * corresponde à ordem cronológica: 2025.2, 2026.1, 2026.2.
   */
  const semestres = [
    ...new Set(disciplinas.map(disciplina => disciplina.semestre))
  ].sort();

  // Remove as opções antigas antes de criar as atualizadas.
  filtroSemestre.replaceChildren();

  // Desabilita o seletor quando a lista está vazia.
  filtroSemestre.disabled = semestres.length === 0;

  if (semestres.length === 0) {
    const opcao = document.createElement("option");

    opcao.value = "";
    opcao.textContent = "Nenhum semestre cadastrado";

    filtroSemestre.append(opcao);

    // Encerra a função, pois não há semestres para adicionar.
    return;
  }

  // Cria uma opção no seletor para cada semestre existente.
  for (const semestre of semestres) {
    const opcao = document.createElement("option");

    opcao.value = semestre;
    opcao.textContent = semestre;

    filtroSemestre.append(opcao);
  }

  /*
   * includes verifica se o semestre anterior ainda existe.
   *
   * Se existir, mantemos a seleção.
   * Caso contrário, selecionamos o último da lista,
   * que é o semestre mais recente.
   */
  filtroSemestre.value = semestres.includes(selecionadoAntes)
    ? selecionadoAntes
    : semestres[semestres.length - 1];
}


/* =========================================================
   7. CRIAR CÉLULAS DA TABELA
   ========================================================= */

function criarCelula(texto) {
  // Cria um elemento <td>, que representa uma célula da tabela.
  const celula = document.createElement("td");

  /*
   * textContent insere o conteúdo como texto.
   * Assim, um nome digitado pelo usuário não é interpretado
   * como código HTML.
   */
  celula.textContent = texto;

  return celula;
}


/* =========================================================
   8. MONTAR A TABELA E CONFIGURAR A EXCLUSÃO
   ========================================================= */

function atualizarTabela() {
  // Limpa as linhas anteriores para não duplicar os registros.
  lista.replaceChildren();

  // Converte os valores internos em textos para exibição.
  const nomesStatus = {
    aprovada: "Aprovada",
    reprovada: "Reprovada",
    cancelada: "Cancelada / trancada"
  };

  for (const disciplina of disciplinas) {
    // Cada <tr> representa uma linha da tabela.
    const linha = document.createElement("tr");

    // append adiciona as células à linha na ordem indicada.
    linha.append(
      criarCelula(disciplina.nome),
      criarCelula(
        disciplina.nota === null
          ? "—"
          : formatoNota.format(disciplina.nota)
      ),
      criarCelula(`${disciplina.cargaHoraria}h`),
      criarCelula(nomesStatus[disciplina.status]),
      criarCelula(disciplina.semestre)
    );

    /*
     * As crases permitem inserir valores com ${...}.
     * Exemplo: `${60}h` produz o texto "60h".
     */

    const celulaAcoes = document.createElement("td");
    const botaoExcluir = document.createElement("button");

    // Evita que esse botão tenha comportamento de envio.
    botaoExcluir.type = "button";
    botaoExcluir.textContent = "Excluir";

    // Descrição mais completa para quem usa leitor de tela.
    botaoExcluir.setAttribute(
      "aria-label",
      `Excluir ${disciplina.nome} do semestre ${disciplina.semestre}`
    );

    // Esta função é executada quando esse botão é clicado.
    botaoExcluir.addEventListener("click", () => {
      /*
       * Mantém todos os registros cujo ID seja diferente
       * do ID da disciplina que queremos excluir.
       *
       * "!==" significa "diferente", sem converter os tipos.
       */
      disciplinas = disciplinas.filter(
        registro => registro.id !== disciplina.id
      );

      // Atualiza tabela, semestres e resultados após a exclusão.
      atualizarTela();

      mensagem.textContent = "Disciplina excluída.";

      // Leva o foco a um botão que continua existindo na página.
      botaoAdicionar.focus();
    });

    celulaAcoes.append(botaoExcluir);
    linha.append(celulaAcoes);
    lista.append(linha);
  }

  /*
   * hidden controla se um elemento fica oculto.
   *
   * Lista vazia: oculta a tabela e mostra a mensagem.
   * Lista preenchida: mostra a tabela e oculta a mensagem.
   */
  tabela.hidden = disciplinas.length === 0;
  listaVazia.hidden = disciplinas.length > 0;
}


/* =========================================================
   9. ATUALIZAR A INTERFACE COMPLETA
   ========================================================= */

function atualizarTela() {
  /*
   * Centraliza as atualizações em uma função.
   * Assim, cadastro e exclusão usam a mesma sequência.
   *
   * Os semestres são atualizados antes dos resultados,
   * pois o cálculo do semestre depende da seleção atual.
   */
  atualizarTabela();
  atualizarSemestres();
  atualizarResultados();
}


/* =========================================================
   10. RECEBER E VALIDAR O CADASTRO
   ========================================================= */

// "submit" acontece quando o formulário é enviado.
formulario.addEventListener("submit", evento => {
  // Impede o envio padrão, que poderia recarregar a página.
  evento.preventDefault();

  /*
   * reportValidity verifica as regras do HTML, como required,
   * min, max e pattern, e mostra uma mensagem se houver erro.
   */
  if (!formulario.reportValidity()) {
    return;
  }

  const status = campoStatus.value;

  // trim remove espaços no começo e no final do texto.
  const semestre = campoSemestre.value.trim();

  /*
   * Os valores dos inputs são lidos como texto.
   * Number converte esse texto em número para os cálculos.
   */
  const cargaHoraria = Number(campoCarga.value);

  // Uma disciplina cancelada recebe null no lugar da nota.
  const nota = status === "cancelada"
    ? null
    : Number(campoNota.value);

  /*
   * Confere:
   * - se a carga horária é um inteiro positivo;
   * - se o semestre segue o formato AAAA.1 ou AAAA.2;
   * - se a situação é uma das opções permitidas;
   * - se a nota é um número finito entre 0 e 100,
   *   quando a disciplina não está cancelada.
   *
   * A expressão /^[0-9]{4}\.[12]$/ verifica o formato:
   * quatro dígitos, um ponto e o número 1 ou 2.
   */
  if (
    !Number.isInteger(cargaHoraria) ||
    cargaHoraria <= 0 ||
    !/^[0-9]{4}\.[12]$/.test(semestre) ||
    !["aprovada", "reprovada", "cancelada"].includes(status) ||
    (status !== "cancelada" &&
      (!Number.isFinite(nota) || nota < 0 || nota > 100))
  ) {
    mensagem.textContent = "Confira os dados informados.";
    return;
  }

  /*
   * push adiciona um objeto ao final da lista.
   * O objeto reúne os dados de uma disciplina.
   *
   * proximoId++ usa o ID atual e depois aumenta seu valor em 1.
   * "||" usa o nome alternativo quando o texto está vazio.
   */
  disciplinas.push({
    id: proximoId++,
    nome: campoNome.value.trim() || "Disciplina sem nome",
    nota,
    cargaHoraria,
    status,
    semestre
  });

  // Limpa o formulário depois do cadastro.
  formulario.reset();

  // Reajusta o campo de nota e mostra os registros atualizados.
  ajustarCampoNota();
  atualizarTela();

  mensagem.textContent = "Disciplina adicionada.";

  // Posiciona o cursor no nome para facilitar o próximo cadastro.
  campoNome.focus();
});


/* =========================================================
   11. REAGIR ÀS MUDANÇAS DOS SELETORES
   ========================================================= */

// Ao mudar a situação, ajusta se a nota é obrigatória.
campoStatus.addEventListener("change", ajustarCampoNota);

// Ao mudar o semestre, recalcula os resultados exibidos.
filtroSemestre.addEventListener("change", atualizarResultados);


/* =========================================================
   12. INICIAR A CALCULADORA
   ========================================================= */

// Habilita o botão que começa desabilitado no HTML.
botaoAdicionar.disabled = false;

// Deixa os campos e os resultados no estado inicial correto.
ajustarCampoNota();
atualizarTela();