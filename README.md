# S3 Client Installer

<div align="center">
  <img src="/infra/images/splash.bmp" width="550" alt="capa">
</div>

<img src="/infra/images/capa.png" width="200" alt="install">

## Execução

Realize as alterações do software e empacote o mesmo

Clone o repositório do GitHub:

```bash
$ cd ~/your/directory/
$ git clone https://github.com/CleverSystemsLTDA/s3-client-installer.git
$ cd s3-client-installer
```

Adicione o executável na pasta `public`

> Obervação:
> Para a realizar o versionamento do .exe é necessário instalar o [Git Large File Storage](https://git-lfs.com/)

Crie um arquivo `electron-builder.yml` e adicione as variáveis:

```yml
appId: com.s3client-installer.ElectronAutoUpdate
publish:
  provider: github
  token: { github_token }
  repo: { nome_do_repositório }
  owner: { nome_da_organização }
  channel: latest
```

Como gerar um GitHub Token? [CLIQUE AQUI](https://docs.github.com/pt/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

Altere a versão do software de acordo no `package.json`

Faça o commit e push das alterações

Execute o comando de deploy:

```bash
$ npm run dist
```

Entre na [Release](https://github.com/CleverSystemsLTDA/s3-client-installer/releases) na versão gerada pelo:

- Clique no icone de editar
- Clique em `Publish release`
- O status irá trocar de `Draft` para `Latest`

<hr/>
<p align="center"><i>powered by</i><br/><br/>
<a href="http://www.cleversystems.com.br/" target="_blank"><img width="250"src="https://cleversystems.com.br/wp-content/uploads/2021/01/site_logo.png"></a>
</p>
