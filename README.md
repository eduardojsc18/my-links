# Eduardo José — site pessoal

Site estático com foco em mobile, escrito em HTML, CSS e JavaScript nativos. A interface não precisa de build nem de dependências de terceiros. A consulta automática da Steam usa uma pequena função no servidor. A estrutura antiga de Tailwind/Alpine/Swiper foi substituída; os assets de conteúdo foram preservados.

## Preview local

Com Node.js instalado: `npm run dev`, depois abra http://127.0.0.1:4173. O servidor escuta apenas na máquina local. `npm run check` verifica a sintaxe dos scripts.

## Publicação

Para a interface estática, publique a pasta `src`. A URL original `/my-links/src/` continua compatível com GitHub Pages. A atualização automática da Steam exige também o endpoint `/api/steam-profile`: ele funciona no servidor local e há uma função com rota pronta em `netlify.toml` para uma futura publicação no Netlify. GitHub Pages sozinho não executa essa função; nesse caso o site avisa que a consulta está indisponível e mantém o link público. Um endpoint próprio pode ser indicado com `<meta name="steam-endpoint" content="https://seu-endpoint">`, desde que aceite o domínio do site via CORS. Nenhuma publicação é feita pelo preview.

## Fotos e perfis

Em `src/assets/js/site.js`, o objeto `profiles` concentra foto, texto, cor do navegador e link de cada perfil. Os três usam retratos aprovados com fundo transparente: Casual com camiseta verde-escura, Gamer com headset preto e Business com camiseta preta lisa. Os arquivos são pré-carregados e decodificados antes de iniciar a troca; gestos rápidos mantêm apenas a última seleção. Os tratamentos preservam as cores e a luz natural das fotos. A foto permite trocar por arraste, setas do teclado ou controles acessíveis ao focar; não há menu de perfis.

As cores estão nos tokens de `src/assets/css/site.css`. A composição e os movimentos estão em `experience.css`. O perfil escolhido fica salvo no navegador. `intro.css` define três aberturas: Casual com desenho orgânico, letras com acomodação e saída circular; Gamer com HUD vermelho, varredura, progresso em segmentos e saída lateral; Business com linhas editoriais, recorte tipográfico e saída por opacidade com leve deslocamento para cima. Aparecem em cada carregamento, inclusive com foto em cache, com sequências de 1,15 / 1,35 / 1,05 s respectivamente. A decodificação da foto espera no máximo 1,7 s; um timeout independente libera a página se o módulo falhar. A preferência de movimento reduzido desativa a sequência e os efeitos. Textos entram por linhas, imagens têm profundidade na rolagem e as seções aparecem em sequência.

## Links diretos e identidade

Use `?perfil=casual`, `?perfil=gamer` ou `?perfil=business`. O nome interno `professional` também é aceito por compatibilidade. O parâmetro válido tem prioridade sobre a preferência salva; sem parâmetro válido, vale a preferência salva ou Casual na primeira visita. O modo e o ícone são resolvidos antes da primeira pintura. Trocar pela foto ou pelo rodapé atualiza o parâmetro sem recarregar; compartilhar inclui o perfil selecionado, preserva a pasta de publicação e parâmetros de campanha e remove a âncora de seção.

`assets/brand` contém o monograma EJ. em SVG com contornos vetoriais das letras, três paletas, fallback ICO, PNG de 32 px e ícone Apple de 180 px. `scripts/create-brand.py` permite regenerar os ícones usando Pillow, fontTools e a fonte Georgia Bold do Windows; essas ferramentas não são dependências do site.

A capa `eduardo-social-v1.png` reúne as três fotos aprovadas em composição editorial (1730 × 909 px, aproximadamente 1,91:1). Foi criada pelo imagegen integrado; o prompt final está em `assets/brand/social-art-prompt.md`. Open Graph e Twitter Card estão no HTML inicial, com título, descrição, imagem, dimensões e texto alternativo, sem depender de JavaScript dos robôs das redes. A capa é comum aos três links. As URLs absolutas dos metadados e canonical seguem a publicação original `https://eduardojsc18.github.io/my-links/src/`; ao mudar de domínio, atualize esses endereços juntos. O preview local valida os arquivos e o HTML; a leitura pelas redes e seus caches deve ser validada após publicar.

## Conteúdo

No topo mobile, a abertura tem `100svh`: texto, contato, redes e indicação de rolagem reservam seu espaço, e a foto usa o menor valor entre 124% da largura e 106% da altura restante, preservando cabelo, rosto e camiseta. A máscara lateral acompanha o quadrado real da imagem e suaviza as bordas dos braços. Em telas de até 700 px de altura, tipografia e espaçamentos ficam mais compactos. A máscara atua apenas nos últimos 14% da área do retrato; o contato se sobrepõe 38 px à base. Na troca de perfil, `portrait-motion.js` anima contato e degradê juntos de baixo para cima, sincroniza a cor do fundo e cancela todos os efeitos em trocas consecutivas. Movimento reduzido mantém a mudança imediata.

`discovery.css` apresenta os outros lados em cartões horizontais, com retrato, descrição curta e ação explícita. Cada destino tem sua própria paleta e composição, independentemente do perfil atual. Os retratos mantêm suas proporções quadradas e recebem máscaras laterais e na base, evitando bordas secas nos braços. O perfil aberto fica oculto; no mobile, as duas opções são empilhadas, e no desktop ficam lado a lado. A troca mantém a navegação existente e retorna ao início do perfil escolhido.

`desktop.css` organiza a apresentação acima de 700 px: texto e contato formam um bloco à esquerda, o retrato ocupa a coluna direita e três atalhos levam ao conteúdo do perfil atual. As artes são SVGs leves no próprio HTML: traços orgânicos no Casual, radar e geometria de HUD no Gamer, linhas editoriais e monograma no Business. As seções usam a mesma largura da apresentação, com projetos em superfícies discretas, trajetória em duas colunas e setup em três. No mobile, as artes e os atalhos extras ficam ocultos e a apresentação mantém texto, foto e contato em sequência. A base do retrato e suas camadas decorativas recebem uma máscara gradual conjunta, evitando que o fundo apareça através da camiseta. A área de contato acompanha a cor do perfil com uma passagem contínua, sem filtro de desfoque, e preserva os controles da foto.

Cada modo tem motion de seção próprio: Casual usa entrada orgânica com acomodação e formas curvas; Gamer usa entrada lateral, recorte e varredura vermelha sobre uma grade; Business usa deslocamento vertical, recorte editorial e linhas finas. As camadas decorativas acompanham a entrada e saída das cenas pela rolagem, inclusive nas seções longas. Os elementos entram novamente ao retornar à seção. Trocar de perfil ou ativar movimento reduzido cancela animações pendentes.

Seções maiores têm um respiro final de `clamp(112px, 20svh, 200px)`. A área maior que a tela permite rolagem nativa dentro da seção, com espaço após os últimos links antes do próximo encaixe. A classificação usa a altura real do conteúdo sem o respiro extra, para que fechar listas restaure corretamente o comportamento de uma tela.

`scenes.css` organiza as seções em cenas de pelo menos `100svh`, com encaixe nativo vertical de rolagem. Conteúdo maior que a tela continua acessível por rolagem normal dentro da seção, incluindo listas abertas. `scene-motion.js` coordena deslocamento, escala, opacidade e linhas durante a passagem entre cenas; observa mudanças de tamanho para adaptar os três perfis, redimensionamentos e accordions. A preferência de movimento reduzido desativa o encaixe e esses movimentos. O rodapé também tem um ponto de encaixe próprio.

A troca de retratos usa `portrait-motion.js` com Web Animations API: saída e entrada sobrepostas, deslocamento na direção do gesto, rotação leve e acomodação final. Trocas rápidas cancelam os efeitos anteriores e removem a camada temporária. `motion.css` anima o fundo conforme o perfil: círculos e pincelada no Casual, varredura e geometria tática no Gamer, planos e linhas no Business. Os loops pausam quando a apresentação sai da tela ou a aba fica oculta e respeitam movimento reduzido.

`section-navigation.js` acrescenta links Anterior e Próxima depois do conteúdo de cada seção. A sequência inclui apenas as seções visíveis do modo atual, mostra a posição na história e termina com um retorno ao início. Usa âncoras nativas, com foco acessível na seção de destino e rolagem normal em conteúdo longo. `navigation.css` acompanha a paleta de cada modo e mantém áreas de toque de 44 px. As setas dos retratos ficam visíveis, inclusive durante a troca; somente os ícones sugerem o gesto. A troca de foto combina recorte direcional, deslocamento menor, profundidade e acomodação; Gamer tem movimento reto, Business tem inclinação contida e Casual tem giro orgânico. Todos respeitam movimento reduzido.

`src/assets/js/links.js` preserva as seis coleções do site antigo. O projeto To do List foi mantido nos dados, mas não é exibido porque ambos os seus links antigos apontam para Meu Portfólio. É necessário confirmar seu endereço correto. Miniaturas são as imagens reais do projeto original. Os destinos externos foram preservados e precisam de revisão editorial antes da publicação.

Não há analytics remoto carregado no preview desta versão.

## Modo Gamer

O tema `gamer.css` usa grafite, vermelho Vermeio, linhas de HUD, radar abstrato com A/B e tipografia de interface tática, inspirado em Counter-Strike. Usa o avatar público e a imagem de CS2 fornecidos pela Steam, além de símbolos vetoriais para jogos e hardware. Não apresenta estatísticas fictícias. Os textos de lobby, round e loadout são aplicados apenas no modo Gamer e restaurados ao sair dele. Contato continua pelo WhatsApp; o link pessoal direciona à Steam. A ilustração do radar é decorativa, não representa um mapa real.

## Modo Business

O tema `business.css` é um portfólio editorial: fundo em tom de papel, títulos serifados, botões retos, linhas verticais e geometria discreta atrás do retrato. A apresentação, seções e contato têm textos profissionais próprios. Casual permanece o padrão de uma primeira visita; a preferência do visitante continua salva. A foto Business usa o retrato aprovado com camiseta preta lisa, em cores. Trocar de modo restaura as cores e os textos de cada perfil.


## Steam: dados públicos e atualização

`server/steam-profile.cjs` consulta exclusivamente o XML público de `rvermeio`, verifica o Steam ID `76561198417623600` e normaliza avatar, horas totais de CS:GO/CS2, atividade recente e presença. Não usa credenciais, coleta inventário privado nem aceita URLs ou IDs enviados por visitantes. Se CS2 não aparece na resposta pública, suas horas ficam indisponíveis em vez de serem inventadas.

A função compartilha consultas concorrentes e conserva um cache por cinco minutos. Em falhas, há recuo de um minuto e a última consulta pode ser mostrada por até 24 horas, marcada como antiga e com o horário original. Sem dados válidos, retorna 503. `steam-profile.js` consulta apenas no Gamer, revalida ao retornar à aba e a cada cinco minutos, oferece atualização manual e preserva a posição do layout. Valores vindos da Steam são inseridos como texto; imagens aceitam apenas HTTPS em subdomínios de `steamstatic.com`.

A API do CSREP exige `X-API-Key`. Como Eduardo ainda não tem uma chave, o site oferece o link para seu painel técnico, sem copiar K/D, ADR, patente atual ou resultados como se fossem atualizados automaticamente. Global permanece uma conquista histórica declarada por Eduardo.

`npm test` cobre normalização, identidade, privacidade, imagens permitidas, ausência de horas, cache, consultas concorrentes e falhas da fonte. `npm run check` verifica todos os módulos e funções. A atualização automática foi validada localmente; a rota remota ainda precisa ser publicada junto com a interface.
