
sous www 

git clone  https://github.com/medlend/IVStore.git

composer update 

 php bin/console doctrine:database:create
 php bin/console doctrine:schema:update --force


git clone  https://github.com/medlend/IVStoreFront.git

liste de zones ===> http://localhost/IVStoreFront/#/