export const evaluationContent = {
  evaluation: {
    label: 'Critérios de Avaliação',
    title: 'Como funcionam as notas e a pontuação na Metric',
    updatedAt: '11 de agosto de 2026',
    intro: 'Na Metric, o desempenho em uma atividade é calculado considerando principalmente o tempo de conclusão e a quantidade de erros. O cálculo acontece em duas etapas principais: primeiro, o tempo define a categoria inicial do aluno; segundo, os erros verificam se ele consegue permanecer nessa categoria.',
    sections: [
      {
        title: 'Visão Geral das Categorias',
        paragraphs: [
          'A Metric utiliza quatro categorias principais com suas respectivas pontuações base:',
          '• Categoria MB (Muito Bom) — Pontuação base: 1000 pontos',
          '• Categoria B (Bom) — Pontuação base: 800 pontos',
          '• Categoria R (Regular) — Pontuação base: 500 pontos',
          '• Categoria I (Insatisfatório) — Pontuação base: 200 pontos'
        ]
      },
      {
        title: '1. O tempo define a categoria inicial',
        paragraphs: [
          'O primeiro critério analisado é o tempo utilizado para concluir a atividade. Os limites variam conforme a dificuldade:',
          'Fácil e Médio:',
          '• Até 3 minutos → MB (1000 pts)',
          '• De 3 a 5 minutos → B (800 pts)',
          '• De 5 a 7 minutos → R (500 pts)',
          '• De 7 a 9 minutos → I (200 pts)',
          'Difícil:',
          '• Até 4 minutos → MB (1000 pts)',
          '• De 4 a 6 minutos → B (800 pts)',
          '• De 6 a 8 minutos → R (500 pts)',
          '• De 8 a 10 minutos → I (200 pts)',
          'Portanto, um aluno pode começar em MB mesmo tendo cometido erros, desde que tenha concluído dentro do tempo do MB. Em seguida, os erros são analisados.'
        ]
      },
      {
        title: '2. Cada categoria possui um limite de erros',
        paragraphs: [
          'Depois que o tempo define a categoria inicial, o sistema verifica a quantidade de erros do aluno.',
          'Fácil e Médio (Limites de erros):',
          '• Categoria MB: Máximo de 3 erros',
          '• Categoria B: Máximo de 5 erros',
          '• Categoria R: Máximo de 7 erros',
          '• Categoria I: Sem limite',
          'Difícil (Limites de erros):',
          '• Categoria MB: Máximo de 4 erros',
          '• Categoria B: Máximo de 6 erros',
          '• Categoria R: Máximo de 8 erros',
          '• Categoria I: Sem limite',
          'Enquanto o aluno estiver dentro do limite de erros da sua categoria, ele permanece nela.',
          'Exemplo (Atividade fácil em 2min40s -> Categoria inicial MB):',
          '• 0 a 3 erros → Continua em MB',
          '• 4 erros → Ultrapassa o limite (4 > 3) e desce para B',
          'A mudança de categoria acontece somente quando o limite de erros é ultrapassado. A pontuação em si nunca faz o aluno mudar de categoria.'
        ]
      },
      {
        title: '3. Desconto de pontos por erro',
        paragraphs: [
          'Cada categoria possui um valor diferente descontado por erro:',
          '• Categoria MB: 40 pontos descontados por erro',
          '• Categoria B: 30 pontos descontados por erro',
          '• Categoria R: 20 pontos descontados por erro',
          '• Categoria I: Sem desconto por erro',
          'Essa penalização maior nas categorias mais altas reflete a prioridade da Metric nos acertos em relação ao tempo. Quanto melhor a categoria, mais valorizada é a precisão do aluno.'
        ]
      },
      {
        title: '4. Quando o aluno permanece na categoria',
        paragraphs: [
          'Se o aluno não ultrapassar o limite de erros, todos os seus erros são descontados utilizando o valor da categoria atual.',
          'Exemplo (Atividade Fácil | Tempo: 2min30s | Erros: 2):',
          '1. Tempo coloca o aluno em MB.',
          '2. O MB permite até 3 erros, portanto com 2 erros ele continua em MB.',
          '3. Desconto: 2 erros × 40 pontos = 80 pontos descontados.',
          '4. Pontuação: 1000 - 80 = 920 pontos.',
          'Resultado: MB — 920 pontos.'
        ]
      },
      {
        title: '5. Quando o aluno ultrapassa o limite de erros',
        paragraphs: [
          'Se o limite de erros de uma categoria for ultrapassado, o aluno desce para a categoria seguinte. Os erros usados para atingir o limite anterior são consumidos e apenas os erros restantes passam para a nova categoria.',
          'Exemplo (Atividade Fácil | Tempo: 2min40s | Erros: 4):',
          '1. Pelo tempo: Categoria inicial MB (limite: 3 erros).',
          '2. Erros cometidos: 4. Como 4 > 3, sobram 4 - 3 = 1 erro restante.',
          '3. Os 3 erros consomem o limite do MB e o aluno desce para B.',
          '4. O 1 erro restante é descontado na categoria B (30 pts por erro): 1 × 30 = 30 pontos.',
          '5. Pontuação base do B: 800 - 30 = 770 pontos.',
          'Resultado final: B — 770 pontos.'
        ]
      },
      {
        title: '6. É possível descer mais de uma categoria',
        paragraphs: [
          'Sim. Se ainda existirem erros suficientes para ultrapassar o limite da nova categoria, o processo se repete.',
          'Exemplo (Atividade Fácil | Tempo: 2min30s | Erros: 10):',
          '• Começo pelo tempo: MB (permite 3 erros). 10 - 3 = 7 restantes. Desce de MB → B.',
          '• Na categoria B (permite 5 erros): 7 - 5 = 2 restantes. Desce de B → R.',
          '• Na categoria R (permite 7 erros): Como 2 ≤ 7, permanece em R.',
          '• Desconto no R (20 pts por erro): 2 × 20 = 40 pontos.',
          '• Pontuação base do R: 500 - 40 = 460 pontos.',
          'Resultado final: R — 460 pontos.'
        ]
      },
      {
        title: '7. A pontuação não determina a categoria',
        paragraphs: [
          'Regra fundamental: a mudança de categoria ocorre exclusivamente quando o limite de tempo ou de erros é ultrapassado. Um aluno nunca cai de categoria apenas porque sua pontuação em pontos ficou reduzida.'
        ]
      },
      {
        title: '8. Como funciona a Categoria I',
        paragraphs: [
          'A Categoria I funciona de maneira diferente:',
          '• Sua pontuação base é sempre 200 pontos.',
          '• Não há desconto por quantidade de erros.',
          '• Apenas sofre decréscimo por tempo (Sessão 10).',
          'Isso significa que, ao chegar em I, o número de erros adicionais não diminui mais a pontuação base de 200 pontos.'
        ]
      },
      {
        title: '9. Critério de decréscimo por tempo',
        paragraphs: [
          'Para evitar empates na classificação, é aplicado um decréscimo por tempo:',
          'Para notas MB, B e R:',
          '• A cada 5 segundos é descontado 1 ponto.',
          'Exemplo (Dois alunos com B — 740 pontos base):',
          '• Aluno A: 3min00s (180s ÷ 5 = 36 pontos descontados) → Pontuação final: 740 - 36 = 704.',
          '• Aluno B: 3min20s (200s ÷ 5 = 40 pontos descontados) → Pontuação final: 740 - 40 = 700.',
          'O tempo serve como critério de desempate direto entre os dois.'
        ]
      },
      {
        title: '10. Desempate na Categoria I',
        paragraphs: [
          'Como todos na Categoria I iniciam com 200 pontos, o tempo tem papel fundamental:',
          '• No I, a cada 30 segundos é descontado 1 ponto (aplicado pela taxa de decréscimo).',
          '• Aluno A (Tempo 7min = 420s): 200 - (420 ÷ 5 = 84) = 116 pontos.',
          '• Aluno B (Tempo 8min = 480s): 200 - (480 ÷ 5 = 96) = 104 pontos.'
        ]
      },
      {
        title: '11. Ordem de desempate no ranking',
        paragraphs: [
          'Em caso de igualdade no ranking, aplica-se a ordem:',
          '1º — Pontuação: Aluno com maior pontuação fica acima.',
          '2º — Tempo: Aplica-se o decréscimo proporcional pelo tempo.',
          '3º — Ordem Alfabética: Caso persista o empate total, os nomes são ordenados alfabeticamente (ex: Amanda, Bruno, Carlos).'
        ]
      },
      {
        title: '12. Modo Ranqueado vs Modo Treinamento',
        paragraphs: [
          '• Modo Ranqueado: Calcula categoria, analisa erros e tempo, registra pontuação acumulada e inclui o aluno no ranking da turma.',
          '• Modo Treinamento: Foco exclusivo na prática. Não há cálculo para ranking, não há acúmulo de pontos e não altera posições.'
        ]
      },
      {
        title: '13. Resumo rápido e exemplo completo',
        paragraphs: [
          'Passos do cálculo: 1. Tempo determina início → 2. Erros comparados ao limite → 3. Ao descer, erros da categoria anterior são consumidos → 4. Erros restantes descontam pontos → 5. Tempo desempata.',
          'Exemplo Completo (Eduardo | Atividade Difícil | Tempo: 3min | Erros: 5):',
          '• Tempo (3min): começa em MB (limite difícil: 4 erros).',
          '• Erros: 5. Sobra 1 erro (5 - 4 = 1). Desce MB → B.',
          '• Desconto no B: 1 erro × 30 = 30 pontos. Pontuação B: 800 - 30 = 770.',
          '• Decréscimo tempo: 3min = 180s ÷ 5 = 36. 770 - 36 = 734.',
          '• Resultado Final: Eduardo obtém 734 pontos.'
        ]
      }
    ]
  }
};