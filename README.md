# Eduardo José — site pessoal

Site estático com foco em mobile, escrito em HTML, CSS e JavaScript nativos. Não precisa de build nem de dependências de terceiros. A estrutura antiga de Tailwind/Alpine/Swiper foi substituída; os assets de conteúdo foram preservados.

## Preview local

Com Node.js instalado: `npm run dev`, depois abra http://127.0.0.1:4173. O servidor escuta apenas na máquina local. `npm run check` verifica a sintaxe dos scripts.

## Publicação

Publique a pasta `src`. A URL original `/my-links/src/` continua compatível com GitHub Pages. Nenhuma publicação é feita pelo servidor de preview.

## Fotos e perfis

Em `src/assets/js/site.js`, o objeto `profiles` concentra foto, texto, cor do navegador e link de cada perfil. Os três usam retratos aprovados com fundo transparente: Casual com camiseta verde-escura, Gamer com headset preto e Business com camiseta preta lisa. Os arquivos são pré-carregados e decodificados antes de iniciar a troca; gestos rápidos mantêm apenas a última seleção. Os tratamentos preservam as cores e a luz natural das fotos. A foto permite trocar por arraste, setas do teclado ou controles acessíveis ao focar; não há menu de perfis.

As cores estão nos tokens de `src/assets/css/site.css`. A composição e os movimentos estão em `experience.css`. O perfil escolhido fica salvo no navegador. A abertura animada aparece em cada carregamento, inclusive com foto em cache: sequência de marca de 1,15 s, decodificação da foto limitada a 1,7 s, seguida de saída por recorte e entrada escalonada do conteúdo. Um timeout independente libera a página se o módulo falhar. A preferência de movimento reduzido desativa a sequência e os efeitos. Textos entram por linhas, imagens têm profundidade na rolagem e as seções aparecem em sequência.

## Conteúdo

Cada modo tem motion de seção próprio: Casual usa entrada orgânica com acomodação e formas curvas; Gamer usa entrada lateral, recorte e varredura âmbar sobre uma grade; Business usa deslocamento vertical, recorte editorial e linhas finas. As camadas decorativas acompanham a entrada e saída das cenas pela rolagem, inclusive nas seções longas. Os elementos entram novamente ao retornar à seção. Trocar de perfil ou ativar movimento reduzido cancela animações pendentes.

Seções maiores têm um respiro final de `clamp(112px, 20svh, 200px)`. A área maior que a tela permite rolagem nativa dentro da seção, com espaço após os últimos links antes do próximo encaixe. A classificação usa a altura real do conteúdo sem o respiro extra, para que fechar listas restaure corretamente o comportamento de uma tela.

`scenes.css` organiza as seções em cenas de pelo menos `100svh`, com encaixe nativo vertical de rolagem. Conteúdo maior que a tela continua acessível por rolagem normal dentro da seção, incluindo listas abertas. `scene-motion.js` coordena deslocamento, escala, opacidade e linhas durante a passagem entre cenas; observa mudanças de tamanho para adaptar os três perfis, redimensionamentos e accordions. A preferência de movimento reduzido desativa o encaixe e esses movimentos. O rodapé também tem um ponto de encaixe próprio.

A troca de retratos usa `portrait-motion.js` com Web Animations API: saída e entrada sobrepostas, deslocamento na direção do gesto, rotação leve e acomodação final. Trocas rápidas cancelam os efeitos anteriores e removem a camada temporária. `motion.css` anima o fundo conforme o perfil: círculos e pincelada no Casual, varredura e geometria tática no Gamer, planos e linhas no Business. Os loops pausam quando a apresentação sai da tela ou a aba fica oculta e respeitam movimento reduzido.

`src/assets/js/links.js` preserva as seis coleções do site antigo. O projeto To do List foi mantido nos dados, mas não é exibido porque ambos os seus links antigos apontam para Meu Portfólio. É necessário confirmar seu endereço correto. Miniaturas são as imagens reais do projeto original. Os destinos externos foram preservados e precisam de revisão editorial antes da publicação.

Não há analytics remoto carregado no preview desta versão.

## Modo Gamer

O tema `gamer.css` usa grafite, âmbar, linhas de HUD, radar abstrato com A/B e tipografia de interface tática, inspirado em Counter-Strike. Não carrega assets do jogo, armas, sons ou estatísticas fictícias. Os textos de lobby, round e loadout são aplicados apenas no modo Gamer e restaurados ao sair dele. Contato continua pelo WhatsApp; o link pessoal direciona à Steam. A ilustração do radar é decorativa, não representa um mapa real.

## Modo Business

O tema `business.css` é um portfólio editorial: fundo em tom de papel, títulos serifados, botões retos, linhas verticais e geometria discreta atrás do retrato. A apresentação, seções e contato têm textos profissionais próprios. Casual permanece o padrão de uma primeira visita; a preferência do visitante continua salva. A foto Business usa o retrato aprovado com camiseta preta lisa, em cores. Trocar de modo restaura as cores e os textos de cada perfil.
