import re
with open('/var/www/namaweb/public/js/login.js','r') as f:
    c = f.read()
c = c.replace("window.location.href = '/';", "window.location.href = '/admin.html';")
with open('/var/www/namaweb/public/js/login.js','w') as f:
    f.write(c)
print('Login redirect fixed!')
