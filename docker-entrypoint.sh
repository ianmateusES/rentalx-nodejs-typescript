#!/bin/sh

if [ -e $(pwd)/'rundb' ]; then
  echo 'Tabelas já criadas'
else
  yarn migration
  echo '' >> rundb
fi

exec "$@"
