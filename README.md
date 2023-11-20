<h1>
    <img src="Boids.png">
    <p>Implementação do algoritimo de Boids com JavaScript.</p>
</h1>

# Sobre

O algoritmo de Boids é uma abordagem de modelagem comportamental que simula o comportamento coletivo de um grupo de entidades, chamadas "boids". Desenvolvido por Craig Reynolds em 1986, esse algoritmo é frequentemente usado em simulações de comportamento de grupo em computação gráfica, animações e simulações de sistemas complexos.
Cada entidade, ou "boid", possui três principais comportamentos: separação, alinhamento e coesão.

## Separação:
 Os boids evitam colisões uns com os outros, mantendo uma distância mínima entre si. Isso é alcançado ao ajustar a direção para evitar sobreposições.

## Alinhamento:
 Os boids tentam se alinhar à direção média de seus vizinhos, promovendo um movimento coletivo e coordenado.

## Coesão:
 Os boids são atraídos para o centro de massa de seus vizinhos, mantendo o grupo unido.

<img src="Boids.gif"/>

# Simulação

Foi um desafio bastante estimulante implementar o algoritimo de Boids usando apenas JavaScript, aplicando vários conceitos de física e matemática foi possivél alcançar um resultado bastante satisfatório. Clicando <a href="https://imfernandes23.github.io/Boids_JS/">AQUI</a> você pode acessar a simulação e mudar a intensidade dos comportamentos dos Boids.