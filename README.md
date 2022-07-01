# Projet 7 : Créez un réseau social d'entreprise (Groupomania)

## 1 - Prérequis

```
Pour installer ce projet, vous devrez d'abord installer :
- Node.js
- MySQL
- git
```

## 2 - Cloner le repo du projet

```
En faisant la commande : git clone le-lien-du-repos
```

## 3 - Mise en place de la base de données

```
1. Ouvrir la console MySQL et créer un compte ou se connecter si vous en avez déjà un
2. Créer une base de données nommée "groupomania"
3. Importer le fichier "dump.sql" se trouvant dans le dossier back-end
```

## 4 - Mise en place du back-end

```
1. Dans le terminal, se placer dans le dossier /back-end/
2. Installer npm en exécutant la commande => _npm install_
3. Créer un fichier .env à la racine du dossier avec les informations de votre compte MySQL :
   - DB_USERNAME="VOTRE_NOM_UTILISATEUR_MYSQL"
   - DB_PASSWORD="VOTRE_MOT_DE_PASSE_MYSQL"
   - SECRET_TOKEN="VOTRE_SECRET_TOKEN_POUR_JWT"
4. Lancer le serveur de développement avec la commande => node server.js
```

## 5 - Mise en place du front-end

```
1. Dans le terminal, se placer dans à la racine
2. Installer npm en exécutant la commande => _npm install _
3. Lancer la construction du front-end avec la commande => _npm start_
```

## 6 - Lancer l'application

```
Ouvrir l'application en cliquant sur "http://localhost:3000/"
```
