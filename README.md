# Aplicação banco digital

## Tecnologias utilizadas
- API RestFull
- Mysql
- Laravel 10
- Docker
- React Ts
- Linux
- PhpMyadmin

## Rodar a aplicação
- Instalar o docker
- git clone https://github.com/MarkusLima/banco-digital
- docker compose -f "docker-compose.yml" up -d --build
- Entre no docker
- execute composer install
- execute php artisan migrate
- renomeie .env.exemple para .env


## Acessos
`` 
http://localhost //Aplicação
http://localhost:8080 //phpmyadmin
``


## Documentação completa da API
``
http://localhost/docs
https://documenter.getpostman.com/view/8212927/2sA3Boargo
``