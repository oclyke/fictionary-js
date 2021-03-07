FROM nginx:mainline-alpine
RUN rm /etc/nginx/conf.d/*
ADD root.conf /etc/nginx/conf.d/
ADD build /usr/share/nginx/html/fictionary