import {
  BarChart3,
  BookOpenCheck,
  Calculator,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

export const androidDownloadPath = '/metric.apk';
export const contactEmail = 'nwarelink.ofc@gmail.com';

export const equations = [
  '8 × 7 = 56',
  '(−8) + 13 = 5',
  '√81 = 9',
  '25 ÷ 5 = 5',
  '6 × (4 + 2) = 36',
  '−12 ÷ 3 = −4',
  '7 − (−5) = 12',
  '3² + 4² = 25',
  '√144 = 12',
  '25% de 80 = 20',
  '(18 ÷ 3) × 2 = 12',
  '−6 + (−9) = −15',
  '5 × (−4) = −20',
  '0,5 × 8 = 4',
  '2 × (7 − 3) = 8',
];

export const resources = [
  {
    icon: Trophy,
    title: 'Ranking por turma',
    text: 'Consulte posições e pontuações dos alunos em um ranking organizado por turma.',
  },
  {
    icon: BookOpenCheck,
    title: 'Atividades matemáticas',
    text: 'Crie atividades com operações e disponibilize cada sequência para a turma certa.',
  },
  {
    icon: Calculator,
    title: 'Resposta pelo teclado',
    text: 'O aluno calcula mentalmente, digita a resposta pelos caracteres da tela e avança para a próxima conta.',
  },
  {
    icon: Users,
    title: 'Turmas e alunos',
    text: 'Organize estudantes em suas turmas para manter atividades e resultados separados.',
  },
  {
    icon: BarChart3,
    title: 'Resultados das atividades',
    text: 'A professora acompanha dados de participação e desempenho das atividades realizadas.',
  },
  {
    icon: Zap,
    title: 'Fluxo direto',
    text: 'A interface prioriza a conta, a resposta e a próxima questão, sem alternativas de múltipla escolha.',
  },
];

export const steps = [
  {
    number: '01',
    icon: BookOpenCheck,
    title: 'A professora cria a atividade',
    text: 'As operações são preparadas e vinculadas à turma que vai realizar a atividade.',
  },
  {
    number: '02',
    icon: Calculator,
    title: 'O aluno resolve no celular',
    text: 'A conta aparece na tela, o cálculo é feito mentalmente e a resposta é digitada no teclado do aplicativo.',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Os resultados ficam organizados',
    text: 'A professora consulta os dados da atividade e o ranking da turma em uma visualização simples.',
  },
];

export const teacherFeatures = [
  'Criar atividades matemáticas',
  'Organizar turmas e alunos',
  'Consultar resultados',
  'Visualizar o ranking da turma',
];

export const studentFeatures = [
  'Resolver contas pelo celular',
  'Digitar a própria resposta',
  'Avançar questão por questão',
  'Consultar posição no ranking',
];

export const calculatorKeys = [
  '7', '8', '9', '÷',
  '4', '5', '6', '×',
  '1', '2', '3', '−',
  '0', ',', '=', '+',
];
