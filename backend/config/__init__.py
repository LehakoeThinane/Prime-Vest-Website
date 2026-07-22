import pymysql

# Lets django.db.backends.mysql (which expects the MySQLdb API) work with the
# pure-Python PyMySQL driver — needed on hosts where compiling mysqlclient isn't
# an option. No-op for the Postgres backend used in local/Docker/CI.
pymysql.install_as_MySQLdb()
