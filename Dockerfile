FROM nginx:alpine

# Copia todos os arquivos do diretório atual para a pasta padrão do Nginx
COPY . /usr/share/nginx/html

# Expõe a porta 80, que é a padrão do Nginx
EXPOSE 80

# Inicia o servidor
CMD ["nginx", "-g", "daemon off;"]
