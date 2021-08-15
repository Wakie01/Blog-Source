---
title: Docker学习
comment: true
date: 2021-05-27 20:52:59
tags:
categories:
addrlink:
---



# 安装

## Install on Ubuntu

1. 安装Docker引擎，[官方安装步骤](https://docs.docker.com/engine/install/ubuntu/)

2. 使用阿里云镜像加速器

   ![image-20210531201602295](D:\blog\source\_drafts\Docker学习\1.png)



# Docker的常用命令

## 帮助命令

```bash
docker version   # 显示docker版本信息
docker info    # 显示docker的系统信息，包括镜像和容器的数量
docker 命令 --help   # 显示docker命令帮助
```

[帮助文档的地址](https://docs.docker.com/reference/)



## 镜像命令

- **docker images：** 查看所有本地主机的镜像

  ```shell
  root@ubuntu:~# docker images
  REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
  hello-world   latest    d1165f221234   2 months ago   13.3kB
  
  # 解释
  REPOSITORY   镜像的仓库源
  TAG          镜像的标签
  IMAGE ID     镜像的id
  CREATE       镜像的创建时间
  SIZE         镜像的大小
  
  # 可选项
  -a, --all             Show all images (default hides intermediate images)
  -q, --quiet           Only show image IDs
  ```



- **docker search：** 搜索镜像

  ```shell
  root@ubuntu:~# docker search mysql
  NAME                DESCRIPTION                                     STARS  OFFICIAL  AUTOMATED
  mysql               MySQL is a widely used, open-source relation…   10932  [OK]
  mariadb             MariaDB Server is a high performing open sou…   4134   [OK]
  mysql/mysql-server  Optimized MySQL Server Docker images. Create…   812               [OK]
  percona             Percona Server is a fork of the MySQL relati…   539    [OK]
  
  # 可选项
  -f, --filter     # 过滤搜索结果
  
  -f stars=3000   # 搜索出来的镜像的START是大于3000的
  root@ubuntu:~# docker search mysql -f stars=3000
  NAME      DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
  mysql     MySQL is a widely used, open-source relation…   10932     [OK]
  mariadb   MariaDB Server is a high performing open sou…   4134      [OK]
  
  
  -f STARTS=300 -f is-official=true   # 搜索出来的镜像的START是大于300并且是官方的
  root@ubuntu:~# docker search mysql -f stars=300 -f is-official=true
  NAME      DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
  mysql     MySQL is a widely used, open-source relation…   10932     [OK]
  mariadb   MariaDB Server is a high performing open sou…   4134      [OK]
  percona   Percona Server is a fork of the MySQL relati…   539       [OK]
  ```

   

- **docker pull：** 下载镜像

  ```shell
  # 下载镜像 docker pull 镜像名[:tag]     tag:版本号，默认最新版
  root@ubuntu:~# docker pull mysql
  Using default tag: latest    # 如果不写tag，默认就是latest
  latest: Pulling from library/mysql
  69692152171a: Pull complete    # 分层下载，docker image的核心
  1651b0be3df3: Pull complete
  951da7386bc8: Pull complete
  0f86c95aa242: Pull complete
  37ba2d8bd4fe: Pull complete
  6d278bb05e94: Pull complete
  497efbd93a3e: Pull complete
  f7fddf10c2c2: Pull complete
  16415d159dfb: Pull complete
  0e530ffc6b73: Pull complete
  b0a4a1a77178: Pull complete
  cd90f92aa9ef: Pull complete
  Digest: sha256:d50098d7fcb25b1fcb24e2d3247cae3fc55815d64fec640dc395840f8fa80969   # 镜像签名
  Status: Downloaded newer image for mysql:latest
  docker.io/library/mysql:latest    # 真实地址
  
  # 真实地址理解
  # docker pull mysql   等价于   docker pull docker.io/library/mysql:latest

  # 指定版本下载
  root@ubuntu:~# docker pull mysql:5.7      
  5.7: Pulling from library/mysql
  69692152171a: Already exists
  1651b0be3df3: Already exists
  951da7386bc8: Already exists
  0f86c95aa242: Already exists
  37ba2d8bd4fe: Already exists
  6d278bb05e94: Already exists    # docker下载镜像是分层下载的，当下载同一镜像的不同版本时，
  497efbd93a3e: Already exists    # 若有的层本地是相同的话，就不再重复下载  
  a023ae82eef5: Pull complete
  e76c35f20ee7: Pull complete
  e887524d2ef9: Pull complete
  ccb65627e1c3: Pull complete
  Digest: sha256:a682e3c78fc5bd941e9db080b4796c75f69a28a8cad65677c23f7a9f18ba21fa
  Status: Downloaded newer image for mysql:5.7
  docker.io/library/mysql:5.7
  ```

  


- **docker rmi：** 删除镜像

  ```shell
  root@ubuntu:~# docker rmi --help
  
  Usage:  docker rmi [OPTIONS] IMAGE [IMAGE...]    # IMAGE指：镜像ID
  
  Remove one or more images
  
  Options:
    -f, --force      Force removal of the image
    
  # 一般这么用
  # docker rmi -f 镜像id [镜像id 镜像id ...]
  # 删除全部的镜像
  # docker rmi -f $(docker images -aq) 
  ```



- **docker history：** 查看镜像的操作历史

  ```shell
  root@ubuntu:~# docker history --help
  
  Usage:  docker history [OPTIONS] IMAGE
  
  Show the history of an image
  
  Options:
        --format string   Pretty-print images using a Go template
    -H, --human           Print sizes and dates in human readable format (default true)
        --no-trunc        Don't truncate output   # 不截断输出
    -q, --quiet           Only show image IDs
    
  # 例子：
  root@ubuntu:~# docker history b0c2778432ce
  IMAGE          CREATED       CREATED BY                                      SIZE      COMMENT
  b0c2778432ce   4 days ago    /bin/sh -c #(nop)  ENTRYPOINT ["java" "-jar"…   0B
  <missing>      4 days ago    /bin/sh -c #(nop) ADD file:0d087697f29ebe424…   60.8MB
  <missing>      4 years ago   /bin/sh -c /var/lib/dpkg/info/ca-certificate…   419kB
  <missing>      4 years ago   /bin/sh -c set -x  && apt-get update  && apt…   352MB
  <missing>      4 years ago   /bin/sh -c #(nop)  ENV CA_CERTIFICATES_JAVA_…   0B
  <missing>      4 years ago   /bin/sh -c #(nop)  ENV JAVA_DEBIAN_VERSION=8…   0B
  <missing>      4 years ago   /bin/sh -c #(nop)  ENV JAVA_VERSION=8u111       0B
  <missing>      4 years ago   /bin/sh -c #(nop)  ENV JAVA_HOME=/usr/lib/jv…   0B
  <missing>      4 years ago   /bin/sh -c {   echo '#!/bin/sh';   echo 'set…   87B
  <missing>      4 years ago   /bin/sh -c #(nop)  ENV LANG=C.UTF-8             0B
  <missing>      4 years ago   /bin/sh -c echo 'deb http://deb.debian.org/d…   55B
  <missing>      4 years ago   /bin/sh -c apt-get update && apt-get install…   1.29MB
  <missing>      4 years ago   /bin/sh -c apt-get update && apt-get install…   123MB
  <missing>      4 years ago   /bin/sh -c apt-get update && apt-get install…   44.3MB
  <missing>      4 years ago   /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B
  <missing>      4 years ago   /bin/sh -c #(nop) ADD file:89ecb642d662ee7ed…   123MB
  
  
  # 例子2
  root@ubuntu:~# docker history --format "{{.CreatedBy}}" --no-trunc b0c2778432ce
  /bin/sh -c #(nop)  ENTRYPOINT ["java" "-jar" "/mooc-class-1.0-SNAPSHOT.jar" "--spring.profiles.active=prod"]
  /bin/sh -c #(nop) ADD file:0d087697f29ebe424608f2d3f8025506191165137d37dffe95a40edea77c0c5f in //
  /bin/sh -c /var/lib/dpkg/info/ca-certificates-java.postinst configure
  /bin/sh -c set -x  && apt-get update  && apt-get install -y   openjdk-8-jdk="$JAVA_DEBIAN_VERSION"   ca-certificates-java="$CA_CERTIFICATES_JAVA_VERSION"  && rm -rf /var/lib/apt/lists/*  && [ "$JAVA_HOME" = "$(docker-java-home)" ]
  /bin/sh -c #(nop)  ENV CA_CERTIFICATES_JAVA_VERSION=20140324
  /bin/sh -c #(nop)  ENV JAVA_DEBIAN_VERSION=8u111-b14-2~bpo8+1
  /bin/sh -c #(nop)  ENV JAVA_VERSION=8u111
  /bin/sh -c #(nop)  ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
  /bin/sh -c {   echo '#!/bin/sh';   echo 'set -e';   echo;   echo 'dirname "$(dirname "$(readlink -f "$(which javac || which java)")")"';  } > /usr/local/bin/docker-java-home  && chmod +x /usr/local/bin/docker-java-home
  /bin/sh -c #(nop)  ENV LANG=C.UTF-8
  /bin/sh -c echo 'deb http://deb.debian.org/debian jessie-backports main' > /etc/apt/sources.list.d/jessie-backports.list/bin/sh -c apt-get update && apt-get install -y --no-install-recommends   bzip2   unzip   xz-utils  && rm -rf /var/lib/apt/lists/*
  /bin/sh -c apt-get update && apt-get install -y --no-install-recommends   bzr   git   mercurial   openssh-client   subversion     procps  && rm -rf /var/lib/apt/lists/*
  /bin/sh -c apt-get update && apt-get install -y --no-install-recommends   ca-certificates   curl   wget  && rm -rf /var/lib/apt/lists/*
  /bin/sh -c #(nop)  CMD ["/bin/bash"]
  /bin/sh -c #(nop) ADD file:89ecb642d662ee7edbb868340551106d51336c7e589fdaca4111725ec64da957 in /
  root@ubuntu:~#
  ```

  


## 容器命令

注意：有了镜像才可以创建容器

还有，`容器name`相当于`容器id`，二者等价



```shell
root@ubuntu:~# docker container --help

Usage:  docker container COMMAND

Manage containers

Commands:
  attach      Attach local standard input, output, and error streams to a running container
  commit      Create a new image from a container's changes
  cp          Copy files/folders between a container and the local filesystem
  create      Create a new container
  diff        Inspect changes to files or directories on a container's filesystem
  exec        Run a command in a running container
  export      Export a container's filesystem as a tar archive
  inspect     Display detailed information on one or more containers
  kill        Kill one or more running containers
  logs        Fetch the logs of a container
  ls          List containers
  pause       Pause all processes within one or more containers
  port        List port mappings or a specific mapping for the container
  prune       Remove all stopped containers
  rename      Rename a container
  restart     Restart one or more containers
  rm          Remove one or more containers
  run         Run a command in a new container
  start       Start one or more stopped containers
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop one or more running containers
  top         Display the running processes of a container
  unpause     Unpause all processes within one or more containers
  update      Update configuration of one or more containers
  wait        Block until one or more containers stop, then print their exit codes

Run 'docker container COMMAND --help' for more information on a command.
```

- **docker run：** 对镜像创建一个容器

  ```shell
  root@ubuntu:~# docker run --help
  
  Usage:  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]     # IMAGE常用 IMAGE名字和版本号表示
  
  Run a command in a new container
  
  Options:
    
    -d, --detach             # 后台运行容器，然后输出容器ID
    -it                      # 使用交互方式运行，进入容器查看内容，后面常接：/bin/bash
        --name string        # 给容器命名，用来区分容器
    -p                       # 指定容器端口，同时也可以配置映射端口，如：-p 5306:3306
    -P                       # 随机指定一个容器端
        --rm                 # Automatically remove the container when it exits
    -v, --volume list        # 绑定容器数据卷，如：-v 主机目录:容器内目录
  
  
  # 创建容器，容器命名为centos7，运行镜像centos:7
  root@ubuntu:~# docker run --name=centos7 -it centos:7 /bin/bash
  [root@3bd032b5dc58 /]#
  
  # 退出容器
  [root@3bd032b5dc58 /]# exit
  exit
  root@ubuntu:~#
  ```

- 退出容器

  ```shell
  exit            # 直接退出并停止容器
  Ctrl + P + Q    # 容器退出，但不停止 
  ```


- **docker ps：** 查看docker容器

  ```shell
  docker ps         # 查看docker当前运行的容器
  docker ps -a      # 查看docker当前运行和历史运行的容器
  
  root@ubuntu:~# docker ps -a
  CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS                       PORTS     NAMES
  3bd032b5dc58   centos:7    "/bin/bash"              9 minutes ago   Exited (127) 7 minutes ago             centos7
  ab67020f9637   mysql:5.7   "docker-entrypoint.s…"   32 hours ago    Exited (0) 48 minutes ago              mysql5.7
  
  ```

- **docker container ls：** 查看docker容器

  ```shell
  docker container ls       # 查看docker当前运行的容器
  docker container ls -a    # 查看docker所有的容器
  
  root@ubuntu:~# docker container ls -a
  CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS                       PORTS     NAMES
  3bd032b5dc58   centos:7    "/bin/bash"              5 minutes ago   Exited (127) 3 minutes ago             centos7
  ab67020f9637   mysql:5.7   "docker-entrypoint.s…"   32 hours ago    Exited (0) 44 minutes ago              mysql5.7
  ```

  与`docker ps`类似

- **docker container rm ：** 删除docker容器

  ```shell
  # docker container rm 容器id         删除docker指定容器，不能删除正在运行的容器
  # docker container rm -f 容器id      强制删除docker指定容器
  # docker container rm $(docker container ps -aq)      快速删除所有容器
  
  root@ubuntu:~# docker container ls -a
  CONTAINER ID   IMAGE          COMMAND                  CREATED        STATUS                      PORTS     NAMES
  ab67020f9637   mysql:5.7      "docker-entrypoint.s…"   32 hours ago   Exited (0) 22 minutes ago             mysql5.7
  d7b87729a4f0   d1165f221234   "/hello"                 4 days ago     Exited (0) 4 days ago                 relaxed_shamir
  
  root@ubuntu:~# docker container rm d7b87729a4f0
  d7b87729a4f0
  
  ```

- **docker start：** 启动容器

  ```shell
  docker start 容器id
  
  root@ubuntu:~# docker container ls -a
  CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS                         PORTS     NAMES
  3bd032b5dc58   centos:7    "/bin/bash"              25 minutes ago   Exited (127) 22 minutes ago              centos7
  ab67020f9637   mysql:5.7   "docker-entrypoint.s…"   33 hours ago     Exited (0) About an hour ago             mysql5.7
  root@ubuntu:~# docker start 3bd032b5dc58
  3bd032b5dc58
  root@ubuntu:~# docker container ls
  CONTAINER ID   IMAGE      COMMAND       CREATED          STATUS          PORTS     NAMES
  3bd032b5dc58   centos:7   "/bin/bash"   25 minutes ago   Up 11 seconds             centos7
  
  ```

- **docker restart：** 重启容器

  ```shell
  docker restart 容器id
  ```

- **docker stop：** 停止容器

  ```shell
  docker stop 容器id     # 停止当前正在运行的容器
  
  root@ubuntu:~# docker stop 3bd032b5dc58
  3bd032b5dc58
  root@ubuntu:~# ^C
  root@ubuntu:~# ^C
  root@ubuntu:~# docker container ls
  CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
  
  ```

- **docker kill：** 强制停止容器

  ```shell
  docker kill 容器id     # 强制停止当前正在运行的容器
  ```


- **docker attach：** 进入docker容器（不推荐）

  ```shell
  # docker attach 容器id    进入docker指定容器
  ```

  使用该命令进入docker容器后，进入容器正在执行的终端，不会启动新的进程

  当使用`exit`退出容器时，该容器也会随之停止运行

- **docker exec：** 进入docker容器（推荐）

  ```shell
  # docker exec -it 容器id /bin/bash      进入docker指定容器
  # docker exec -it 容器name /bin/bash    进入docker指定容器
  ```
```
  
  使用该命令进入docker容器后，开启一个新的终端，可以在里面操作
  
  当使用`exit`退出容器时，该容器会继续在后台运行



## 常用其他命令

- **docker logs：** 查看日志

  ```shell
  root@ubuntu:~# docker logs --help
  
  Usage:  docker logs [OPTIONS] CONTAINER
  
  Fetch the logs of a container
  
  Options:
    -f, --follow         Follow log output   # 跟踪最新情况，
        --since string   Show logs since timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes)
    -n, --tail string    Number of lines to show from the end of the logs (default "all")  # 显示日志条数，默认显示最新的
    -t, --timestamps     Show timestamps    # 显示时间
        --until string   Show logs before a timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes)
```

- **docker top：** 查看容器内的进程信息

  ```shell
  # docker top 容器id
  
  root@ubuntu:~# docker top ab67020f9637
  UID        PID         PPID        C          STIME           TIME              CMD
  999        4052        4022        2          19:33           00:00:01          mysqld
  ```

- **docker inspect：** 查看镜像/容器的元数据

  ```shell
  # docker inspect 镜像id/容器id
  
  # 查看镜像元数据
  root@ubuntu:~# docker inspect 2c9028880e58
  [
      {
          "Id": "sha256:2c9028880e5814e8923c278d7e2059f9066d56608a21cd3f83a01e3337bacd68",
          "RepoTags": [
              "mysql:5.7"
          ],
          "RepoDigests": [
              "mysql@sha256:a682e3c78fc5bd941e9db080b4796c75f69a28a8cad65677c23f7a9f18ba21fa"
          ],
          "Parent": "",
          "Comment": "",
          "Created": "2021-05-12T08:11:03.343403499Z",
          "Container": "db38503d38cc5342a2e11abace95c67ea3cc8bb65b48d45bfcda4bcb30748245",
          "ContainerConfig": {
              "Hostname": "db38503d38cc",
              "Domainname": "",
              "User": "",
              "AttachStdin": false,
              "AttachStdout": false,
              "AttachStderr": false,
              "ExposedPorts": {
                  "3306/tcp": {},
                  "33060/tcp": {}
              },
              "Tty": false,
              "OpenStdin": false,
              "StdinOnce": false,
              "Env": [
                  "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                  "GOSU_VERSION=1.12",
                  "MYSQL_MAJOR=5.7",
                  "MYSQL_VERSION=5.7.34-1debian10"
              ],
              "Cmd": [
                  "/bin/sh",
                  "-c",
                  "#(nop) ",
                  "CMD [\"mysqld\"]"
              ],
              "Image": "sha256:4b62934a5405f45c27bf212c6289792743498ce4ff0a5e0f1cdf6b6371320fbf",
              "Volumes": {
                  "/var/lib/mysql": {}
              },
              "WorkingDir": "",
              "Entrypoint": [
                  "docker-entrypoint.sh"
              ],
              "OnBuild": null,
              "Labels": {}
          },
          "DockerVersion": "19.03.12",
          "Author": "",
          "Config": {
              "Hostname": "",
              "Domainname": "",
              "User": "",
              "AttachStdin": false,
              "AttachStdout": false,
              "AttachStderr": false,
              "ExposedPorts": {
                  "3306/tcp": {},
                  "33060/tcp": {}
              },
              "Tty": false,
              "OpenStdin": false,
              "StdinOnce": false,
              "Env": [
                  "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                  "GOSU_VERSION=1.12",
                  "MYSQL_MAJOR=5.7",
                  "MYSQL_VERSION=5.7.34-1debian10"
              ],
              "Cmd": [
                  "mysqld"
              ],
              "Image": "sha256:4b62934a5405f45c27bf212c6289792743498ce4ff0a5e0f1cdf6b6371320fbf",
              "Volumes": {
                  "/var/lib/mysql": {}
              },
              "WorkingDir": "",
              "Entrypoint": [
                  "docker-entrypoint.sh"
              ],
              "OnBuild": null,
              "Labels": null
          },
          "Architecture": "amd64",
          "Os": "linux",
          "Size": 446995706,
          "VirtualSize": 446995706,
          "GraphDriver": {
              "Data": {
                  "LowerDir": "/var/lib/docker/overlay2/7d5b90d9fd7d67127b79b5d1d504fbed64dc7e54cf5cf4c59c5b31eee36f0de5/diff:/var/lib/docker/overlay2/1e7ae63b3d68496626a83d8e29c17d0207e5a62234b05fa2923f4325e9314900/diff:/var/lib/docker/overlay2/28b76c231523b3bed08ee16acf6f76e93b7e1d6e11aa3d552841c055d667d666/diff:/var/lib/docker/overlay2/246b175e1dc6abcf3af15939bb4df77bbff05dc7c7a54f5d3ea1ed459994935f/diff:/var/lib/docker/overlay2/5097f3665687cd1e6de190434185600e80f6945aa030cabb7c015ac0a176ce6b/diff:/var/lib/docker/overlay2/ca915391e71851642fb325650a55926eb50c0f34548ade2d4050fb28a308ea78/diff:/var/lib/docker/overlay2/96f3f20d4c626bd1ee390345ff1255d1c4187988ae2c90b21689b3ac3401c7c5/diff:/var/lib/docker/overlay2/4457bd7e5787efb6068592fd3cfd49c67d460e1562cdfab5b22fdebcf856a799/diff:/var/lib/docker/overlay2/b2b4becdb2daeb69a69d43ad6b00ba5623baef8f65e97f630a6a5db6c33f3101/diff:/var/lib/docker/overlay2/7b3c400c07aaa4febe513a49f868a910c0d60b2f73a1ba35a69920ef7769f3f9/diff",
                  "MergedDir": "/var/lib/docker/overlay2/d4ea6041a62177f7a92d743adae9077b9a11d4bdbe92dfe22b3b35f484eafc11/merged",
                  "UpperDir": "/var/lib/docker/overlay2/d4ea6041a62177f7a92d743adae9077b9a11d4bdbe92dfe22b3b35f484eafc11/diff",
                  "WorkDir": "/var/lib/docker/overlay2/d4ea6041a62177f7a92d743adae9077b9a11d4bdbe92dfe22b3b35f484eafc11/work"
              },
              "Name": "overlay2"
          },
          "RootFS": {          # 镜像文件系统信息
              "Type": "layers", 
              "Layers": [      # 镜像分层信息
                  "sha256:02c055ef67f5904019f43a41ea5f099996d8e7633749b6e606c400526b2c4b33",
                  "sha256:14be0d40572c9e789898075dab874a65268de67962d8fd775172b206a9305022",
                  "sha256:e82f328cb5e68d3c0fcc6604b3c09a2898d94fde76f589abc5163c85e168a075",
                  "sha256:b2abc2ad4a418fb408384c726f800fa1f722cbb38987200cd362bc73f20cc988",
                  "sha256:570df12e998cd93e68915a6de7002f9ca1e4b21bbaca3cd1124b7770c800b1b4",
                  "sha256:ae477702a51387de5407cbaad4e225c3b3ddfb329cb1b00739b4161fe34d80a6",
                  "sha256:3182d4b853f01f95a1cc30cd97c3e5e4d1aa3011ba4cf6273c2d5b38ef1adba0",
                  "sha256:940ffd6ceda5ac47aeabf50a3210969f1adce1a78b1dd66dab62c20a2c58caa5",
                  "sha256:d329e0888b830d8de863fedf17cb8e600f46ff869b82a43d92499fceb7797bf8",
                  "sha256:516d3b88eaf6e98711593913e66d73b14c4438aeec0ca57e6378823e7423ec6d",
                  "sha256:8dd710df810d11d75e69cfd8dd0db15ebdd13a667069db0638b9d3168218b3f4"
              ]
          },
          "Metadata": {
              "LastTagTime": "0001-01-01T00:00:00Z"
          }
      }
  ]
  
  
  
  # 查看容器元数据
  root@ubuntu:~# docker inspect mysql5.7
  [
      {
          "Id": "ab67020f9637c26d771bbba74ff92903ee8fa967f465bf04bb8c81844f837fc9",
          "Created": "2021-06-03T04:02:00.534994805Z",
          "Path": "docker-entrypoint.sh",
          "Args": [
              "mysqld"
          ],
          "State": {
              "Status": "exited",
              "Running": false,
              "Paused": false,
              "Restarting": false,
              "OOMKilled": false,
              "Dead": false,
              "Pid": 0,
              "ExitCode": 255,
              "Error": "",
              "StartedAt": "2021-06-05T11:33:07.28178782Z",
              "FinishedAt": "2021-06-08T15:08:15.848643393+08:00"
          },
          "Image": "sha256:2c9028880e5814e8923c278d7e2059f9066d56608a21cd3f83a01e3337bacd68",
          "ResolvConfPath": "/var/lib/docker/containers/ab67020f9637c26d771bbba74ff92903ee8fa967f465bf04bb8c81844f837fc9/resolv.conf",
          "HostnamePath": "/var/lib/docker/containers/ab67020f9637c26d771bbba74ff92903ee8fa967f465bf04bb8c81844f837fc9/hostname",
          "HostsPath": "/var/lib/docker/containers/ab67020f9637c26d771bbba74ff92903ee8fa967f465bf04bb8c81844f837fc9/hosts",
          "LogPath": "/var/lib/docker/containers/ab67020f9637c26d771bbba74ff92903ee8fa967f465bf04bb8c81844f837fc9/ab67020f9637c26d771bbba74ff92903ee8fa967f465bf04bb8c81844f837fc9-json.log",
          "Name": "/mysql5.7",
          "RestartCount": 0,
          "Driver": "overlay2",
          "Platform": "linux",
          "MountLabel": "",
          "ProcessLabel": "",
          "AppArmorProfile": "docker-default",
          "ExecIDs": null,
          "HostConfig": {
              "Binds": null,
              "ContainerIDFile": "",
              "LogConfig": {
                  "Type": "json-file",
                  "Config": {}
              },
              "NetworkMode": "default",
              "PortBindings": {
                  "3306/tcp": [
                      {
                          "HostIp": "",
                          "HostPort": "5306"
                      }
                  ]
              },
              "RestartPolicy": {
                  "Name": "no",
                  "MaximumRetryCount": 0
              },
              "AutoRemove": false,
              "VolumeDriver": "",
              "VolumesFrom": null,
              "CapAdd": null,
              "CapDrop": null,
              "CgroupnsMode": "host",
              "Dns": [],
              "DnsOptions": [],
              "DnsSearch": [],
              "ExtraHosts": null,
              "GroupAdd": null,
              "IpcMode": "private",
              "Cgroup": "",
              "Links": null,
              "OomScoreAdj": 0,
              "PidMode": "",
              "Privileged": false,
              "PublishAllPorts": false,
              "ReadonlyRootfs": false,
              "SecurityOpt": null,
              "UTSMode": "",
              "UsernsMode": "",
              "ShmSize": 67108864,
              "Runtime": "runc",
              "ConsoleSize": [
                  0,
                  0
              ],
              "Isolation": "",
              "CpuShares": 0,
              "Memory": 0,
              "NanoCpus": 0,
              "CgroupParent": "",
              "BlkioWeight": 0,
              "BlkioWeightDevice": [],
              "BlkioDeviceReadBps": null,
              "BlkioDeviceWriteBps": null,
              "BlkioDeviceReadIOps": null,
              "BlkioDeviceWriteIOps": null,
              "CpuPeriod": 0,
              "CpuQuota": 0,
              "CpuRealtimePeriod": 0,
              "CpuRealtimeRuntime": 0,
              "CpusetCpus": "",
              "CpusetMems": "",
              "Devices": [],
              "DeviceCgroupRules": null,
              "DeviceRequests": null,
              "KernelMemory": 0,
              "KernelMemoryTCP": 0,
              "MemoryReservation": 0,
              "MemorySwap": 0,
              "MemorySwappiness": null,
              "OomKillDisable": false,
              "PidsLimit": null,
              "Ulimits": null,
              "CpuCount": 0,
              "CpuPercent": 0,
              "IOMaximumIOps": 0,
              "IOMaximumBandwidth": 0,
              "MaskedPaths": [
                  "/proc/asound",
                  "/proc/acpi",
                  "/proc/kcore",
                  "/proc/keys",
                  "/proc/latency_stats",
                  "/proc/timer_list",
                  "/proc/timer_stats",
                  "/proc/sched_debug",
                  "/proc/scsi",
                  "/sys/firmware"
              ],
              "ReadonlyPaths": [
                  "/proc/bus",
                  "/proc/fs",
                  "/proc/irq",
                  "/proc/sys",
                  "/proc/sysrq-trigger"
              ]
          },
          "GraphDriver": {
              "Data": {
                  "LowerDir": "/var/lib/docker/overlay2/e059bdc832ca8c1e32b13851c2a4c2a0cac41486c5a19d1c884ac99eedd9d01c-init/diff:/var/lib/docker/overlay2/d4ea6041a62177f7a92d743adae9077b9a11d4bdbe92dfe22b3b35f484eafc11/diff:/var/lib/docker/overlay2/7d5b90d9fd7d67127b79b5d1d504fbed64dc7e54cf5cf4c59c5b31eee36f0de5/diff:/var/lib/docker/overlay2/1e7ae63b3d68496626a83d8e29c17d0207e5a62234b05fa2923f4325e9314900/diff:/var/lib/docker/overlay2/28b76c231523b3bed08ee16acf6f76e93b7e1d6e11aa3d552841c055d667d666/diff:/var/lib/docker/overlay2/246b175e1dc6abcf3af15939bb4df77bbff05dc7c7a54f5d3ea1ed459994935f/diff:/var/lib/docker/overlay2/5097f3665687cd1e6de190434185600e80f6945aa030cabb7c015ac0a176ce6b/diff:/var/lib/docker/overlay2/ca915391e71851642fb325650a55926eb50c0f34548ade2d4050fb28a308ea78/diff:/var/lib/docker/overlay2/96f3f20d4c626bd1ee390345ff1255d1c4187988ae2c90b21689b3ac3401c7c5/diff:/var/lib/docker/overlay2/4457bd7e5787efb6068592fd3cfd49c67d460e1562cdfab5b22fdebcf856a799/diff:/var/lib/docker/overlay2/b2b4becdb2daeb69a69d43ad6b00ba5623baef8f65e97f630a6a5db6c33f3101/diff:/var/lib/docker/overlay2/7b3c400c07aaa4febe513a49f868a910c0d60b2f73a1ba35a69920ef7769f3f9/diff",
                  "MergedDir": "/var/lib/docker/overlay2/e059bdc832ca8c1e32b13851c2a4c2a0cac41486c5a19d1c884ac99eedd9d01c/merged",
                  "UpperDir": "/var/lib/docker/overlay2/e059bdc832ca8c1e32b13851c2a4c2a0cac41486c5a19d1c884ac99eedd9d01c/diff",
                  "WorkDir": "/var/lib/docker/overlay2/e059bdc832ca8c1e32b13851c2a4c2a0cac41486c5a19d1c884ac99eedd9d01c/work"
              },
              "Name": "overlay2"
          },
          "Mounts": [      # 容器数据卷信息
              {
                  "Type": "volume",
                  "Name": "4eed97381c66a2887dc701fe7e01e07561131ca7c09bedd1066feade6e5a3d0c",
                  "Source": "/var/lib/docker/volumes/4eed97381c66a2887dc701fe7e01e07561131ca7c09bedd1066feade6e5a3d0c/_data",       # Source：对应主机内的文件地址
                  "Destination": "/var/lib/mysql",        # Destination：docker容器内的地址
                  "Driver": "local",
                  "Mode": "",
                  "RW": true,
                  "Propagation": ""
              }
          ],
          "Config": {
              "Hostname": "ab67020f9637",
              "Domainname": "",
              "User": "",
              "AttachStdin": false,
              "AttachStdout": false,
              "AttachStderr": false,
              "ExposedPorts": {
                  "3306/tcp": {},
                  "33060/tcp": {}
              },
              "Tty": false,
              "OpenStdin": false,
              "StdinOnce": false,
              "Env": [
                  "MYSQL_ROOT_PASSWORD=123456",
                  "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                  "GOSU_VERSION=1.12",
                  "MYSQL_MAJOR=5.7",
                  "MYSQL_VERSION=5.7.34-1debian10"
              ],
              "Cmd": [
                  "mysqld"
              ],
              "Image": "mysql:5.7",
              "Volumes": {
                  "/var/lib/mysql": {}
              },
              "WorkingDir": "",
              "Entrypoint": [
                  "docker-entrypoint.sh"
              ],
              "OnBuild": null,
              "Labels": {}
          },
          "NetworkSettings": {
              "Bridge": "",
              "SandboxID": "8b7f9968a5d788a07b89bfffa48ae3879e34fcdc211c95484b6bb7bff3eb42cf",
              "HairpinMode": false,
              "LinkLocalIPv6Address": "",
              "LinkLocalIPv6PrefixLen": 0,
              "Ports": {
                  "3306/tcp": [
                      {
                          "HostIp": "0.0.0.0",
                          "HostPort": "5306"
                      },
                      {
                          "HostIp": "::",
                          "HostPort": "5306"
                      }
                  ],
                  "33060/tcp": null
              },
              "SandboxKey": "/var/run/docker/netns/8b7f9968a5d7",
              "SecondaryIPAddresses": null,
              "SecondaryIPv6Addresses": null,
              "EndpointID": "d02e2e940ad8b1fd2a88df9686835e37f9540b82990791952340e2ad69968af2",
              "Gateway": "172.17.0.1",
              "GlobalIPv6Address": "",
              "GlobalIPv6PrefixLen": 0,
              "IPAddress": "172.17.0.2",
              "IPPrefixLen": 16,
              "IPv6Gateway": "",
              "MacAddress": "02:42:ac:11:00:02",
              "Networks": {
                  "bridge": {
                      "IPAMConfig": null,
                      "Links": null,
                      "Aliases": null,
                      "NetworkID": "c81b5f9d497ee5bb65a89d4a141dfdb741b560fd34ce57e0901a5b4dd6ec484c",
                      "EndpointID": "d02e2e940ad8b1fd2a88df9686835e37f9540b82990791952340e2ad69968af2",
                      "Gateway": "172.17.0.1",
                      "IPAddress": "172.17.0.2",
                      "IPPrefixLen": 16,
                      "IPv6Gateway": "",
                      "GlobalIPv6Address": "",
                      "GlobalIPv6PrefixLen": 0,
                      "MacAddress": "02:42:ac:11:00:02",
                      "DriverOpts": null
                  }
              }
          }
      }
  ]
  
  ```

- **docker cp：** 从容器拷贝文件到主机上

  ```shell
  # docker cp 容器id:容器内路径 主机目标路径
  
  root@ubuntu:~# docker cp 3bd032b5dc58:/home/my /home
  ```



# 可视化

常见的docker可视化工具是`Portainer`



# Docker镜像

Docker中的镜像是一种轻量级、可执行的独立软件包，用来打包软件运行环境和基于运行环境开发的软件，它包含运行某个软件所需的所有内容，包括代码、运行时、库、环境变量和配置文件。

所有的应用，直接打包docker镜像，就可以直接跑起来。



**如何得到镜像：**

- 从远程仓库下载
- 从别的电脑拷贝
- 自己制作一个镜像DockerFile



## Docker镜像加载原理

### UnionFS 联合文件系统

UnionFS（联合文件系统）是一种分层的、轻量级并且高性能的文件系统，它支持对文件系统的修改作为一次提交来一层层的叠加，同时可以将不同目录挂载到同一个虚拟文件系统下（Unite several directories into a single virtual filesystem）。

UnionFS是Docker镜像的基础，镜像可以通过分层来进行继承，基于基础镜像（没有父镜像），可以制作各种具体的应用镜像。

特性：一次同时加载多个文件系统，但从外面看起来，只能看到一个文件系统，联合加载会把各层文件系统叠加起来，这样最终的文件系统会包含所有底层的文件和目录。



### Docker镜像加载原理

docker的镜像实际上由一层一层的文件系统组成，这种层级的文件系统叫UnionFS。

![image-20210605213827545](D:\blog\source\_drafts\Docker学习\4.png)

bootfs（boot file system）用于引导加载系统启动，主要包含bootloader和kernel。bootloader主要是引导加载kernel，Linux刚启动时会加载bootfs文件系统，在Docker镜像的最底层是bootfs。这一层与我们典型的Linux/Unix系统是一样的，包含boot加载器和内核。当boot加载完成之后整个内核就都在内存中了，此时内存的使用权已由bootfs转交给内核，此时系统也会卸载bootfs。

rootfs（root file system），在bootfs之上。包含的就是典型Linux系统中的/dev、/proc、/bin、/etc等标准目录和文件。rootfs就是各种不同操作系统的发行版，比如Ubuntu、CentOS等。



- **镜像分层的理解：**

  所有的Docker镜像都起始于一个基础镜像层，当进行修改或增加新的内容时，就会在当前镜像层之上，创建新的镜像层。

  以下图为例子，假如基于Ubuntu Linux16.04创建一个新的镜像，这就是新镜像的第一层；如果在该镜像中添加Python包，就会在基础镜像层之上创建第二个镜像层；如果继续添加一个安全补丁，就会创建第三个镜像层。下图的镜像当前已经包含3个镜像层。

  <img src="D:\blog\source\_drafts\Docker学习\5.png" alt="image-20210609103257591" style="zoom:80%;" />

  

  在添加额外的镜像层的同时镜像始终保持是当前所有镜像的组合。



- **镜像分层的文件系统理解：**

  先看简单的，每个镜像层包含3个文件，且这3个文件都没有冲突，所以这个镜像包含了来自两个镜像层的6个文件。
  
  <img src="D:\blog\source\_drafts\Docker学习\6.png" alt="image-20210609104245511" style="zoom:80%;" />
  
  再看复杂一点的，在外部看来整个镜像只有6个文件，这是因为最上层的文件7是文件5的一个更新版。

  <img src="D:\blog\source\_drafts\Docker学习\7.png" alt="image-20210609104621291" style="zoom:80%;" />

  像这种有版本冲突的情况下，上层镜像层中的文件覆盖了底层镜像层中的文件。这样就使得文件的更新版本作为新镜像层添加到镜像当中。
  
  Docker通过存储引擎（新版本采用快照机制）的方式来实现镜像层堆栈，并保证多镜像层对外展示为统一的文件系统。
  
  Docker在Linux上可用的存储引擎有AUFS、Overlap2、Device Mapper、Btrfs以及ZFS。每种存储引擎都基于Linux中对应的文件系统或者块设备技术，并且每种存储引擎都有其独特的性能特点。
  
  Docker在Windows上仅支持windowsfilter一种存储引擎，该引擎基于NTFS文件系统之上实现了分层和CoW。
  
  下图是刚刚上图的所有镜像层堆叠合并，对外提供统一的视图。
  
  <img src="D:\blog\source\_drafts\Docker学习\8.png" alt="image-20210609105457443" style="zoom:80%;" />



- **镜像分层的特点：**

  Docker镜像都是只读的，当容器启动时，一个新的可写层被加载到镜像的顶部，这一层就是我们通常说的容器层，容器层之下的都叫镜像层。

  注意，我们所有的操作都在容器层那里，之后我们还可以对容器层和镜像层打包，形成一个新的镜像。



- **镜像分层的好处：**

  资源共享。比如有多个镜像都从相同的Base镜像构建而来，那么宿主机只需在磁盘上保留一份base镜像，同时内存中也只需加载一份base镜像，这样就可以为所有的容器服务了，而且镜像的每一层都可以被共享



## 生成镜像

如何生成/提交自己的镜像呢？这主要用到了`docker commit`命令。

```shell
root@ubuntu:~# docker commit --help

Usage:  docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]

Create a new image from a container's changes

Options:
  -a, --author string    Author (e.g., "John Hannibal Smith <hannibal@a-team.com>")
  -c, --change list      Apply Dockerfile instruction to the created image
  -m, --message string   Commit message
  -p, --pause            Pause container during commit (default true)

# 比如：docker commit -m="提交镜像的描述信息" -a="作者信息" 容器id 目标镜像名:tag


# 例子
root@ubuntu:~# docker commit -a "my teacher qxr777" -m "learn docker commit" f7bc27381cf3 mooc:1.0
sha256:0622bcdd47d525f0bdab7645c1b42a93bcd9cc0b09a11f91d179fc52fb0c8417
root@ubuntu:~# docker images
REPOSITORY                TAG       IMAGE ID       CREATED              SIZE
mooc                      1.0       0622bcdd47d5   About a minute ago   704MB
```



# 容器数据卷

Docker将应用和环境打包成一个镜像。

很多时候，用户还会想将数据放在容器中，可若是数据都放在容器中的话，当容器删除时，数据就会丢失。

所以，我们想要数据可以**持久化**。

这时候就出现了一种数据共享的想法：Docker容器中产生的数据，同步到本地。

而这就是卷技术，其实就是目录的挂载，将容器内的目录，挂载到Linux上。此外，它还可以实现容器间的数据共享。



## 方式一：挂载数据卷

**命令：docker run -v**

```shell
# docker run -v 主机目录:容器内目录 
```



**查看数据卷挂载情况：**

```shell
# docker inspect 容器id

root@ubuntu:~# docker inspect mysql5.7
[
    {
        ……
        "Mounts": [      # 容器数据卷信息
            {
                "Type": "volume",     # 绑定类型：有volume、bind
                "Name": "4eed97381c66a2887dc701fe7e01e07561131ca7c09bedd1066feade6e5a3d0c",
                "Source": "/var/lib/docker/volumes/4eed97381c66a2887dc701fe7e01e07561131ca7c09bedd1066feade6e5a3d0c/_data",       # Source：对应主机内的文件地址
                "Destination": "/var/lib/mysql",        # Destination：docker容器内的地址
                "Driver": "local",
                "Mode": "",
                "RW": true,
                "Propagation": ""
            }
        ],
        ……
    }
]
```



## 具名和匿名挂载

默认是匿名挂载，而当我们使用`docker run -v 主机目录:容器内目录 `时，就是具名挂载



# Dockerfile

Dockerfile是用来构建docker镜像的构建文件。

Dockerfile其实就是一个命令脚本。



**注意点：**

1. 每个保留关键字（指令）都必须是大写字母
2. 执行顺序是从上到下
3. `#` 表示注释
4. 每一个指令都会创建提交一个新的镜像层，并提交



> - **Dockerfile：** 构建文件，定义了Docker镜像的构建步骤
> - **DockerImages：** 通过Dockerfile构建生成的镜像，最终发布和运行的产品
> - **DockerContainer：** 镜像运行起来的容器



## DockerFile的指令

| 命令         | 解释                                                       |
| ------------ | ---------------------------------------------------------- |
| `FROM`       | 基础镜像，一切从这里开始构建                               |
| `MAINTAINER` | 镜像是谁写的，格式一般为：姓名+邮箱                        |
| `RUN`        | 镜像构建的时候需要运行的命令                               |
| `ADD`        | 为镜像添加内容，当添加压缩包时，它会自动解压               |
| `WORKDIR`    | 镜像的工作目录                                             |
| `VOLUME`     | 挂载的目录                                                 |
| `EXPOSE`     | 暴露端口，指定对外的端口                                   |
| `CMD`        | 指定容器启动时要运行的命令，但只有最后一个会生效，可被替代 |
| `ENTRYPOINT` | 指定容器启动时要运行的命令，并且它可以追加命令             |
| `COPY`       | 类似ADD，将我们的文件拷贝到镜像中                          |
| `ENV`        | 构建的时候设置环境变量                                     |



## 发布镜像

1. 注册dockerhub账号

2. 在dockerhub上创建仓库

   ![image-20210619101601764](D:\blog\source\_drafts\Docker学习\9.png)

3. 登录

   ```shell
   root@ubuntu:/etc/docker# docker login
   Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
   Username: wakiepro
   Password:
   WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
   Configure a credential helper to remove this warning. See
   https://docs.docker.com/engine/reference/commandline/login/#credentials-store
   
   Login Succeeded
   root@ubuntu:/etc/docker#
   ```

4. 从现有容器中生成新的镜像，镜像的名字最好和仓库的名字一样（如：wakiepro/docker_learn）

   ```shell
   # 查看当前正在运行的容器
   root@ubuntu:~# docker ps
   CONTAINER ID   IMAGE                            COMMAND                  CREATED        STATUS        PORTS                                       NAMES
   f7bc27381cf3   qxr777/mooc:latest               "java -jar /mooc-cla…"   34 hours ago   Up 34 hours   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp   docker_mooc-jar_1
   
   # 生成镜像
   root@ubuntu:~# docker commit -a "wakie <947067507@qq.com" -m "learn docker commit" f7bc27381cf3 mooc:1.0
   sha256:0622bcdd47d525f0bdab7645c1b42a93bcd9cc0b09a11f91d179fc52fb0c8417
   
   # 查看生成的镜像
   root@ubuntu:~# docker images
   REPOSITORY                TAG       IMAGE ID       CREATED              SIZE
   mooc                      1.0       0622bcdd47d5   17 hours ago         704MB
   ```
   
5. 由于这里在生成镜像时，名字没设置对，所以需要给镜像命个名

    ```shell
    # 查看docker tag 帮助文档
    root@ubuntu:~# docker tag --help
    
    Usage:  docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]
    
    Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
    
    # 对镜像进行命名
    root@ubuntu:~# docker tag mooc:1.0 wakiepro/docker_learn:1.0
    
    # 查看镜像，可见，这两个镜像是同一个，
    root@ubuntu:~# docker images
    REPOSITORY                TAG       IMAGE ID       CREATED         SIZE
    mooc                      1.0       0622bcdd47d5   17 hours ago    704MB
    wakiepro/docker_learn     1.0       0622bcdd47d5   17 hours ago    704MB
    ```

6. 发布镜像

    ```shell
    root@ubuntu:~# docker push wakiepro/docker_learn:1.0
    The push refers to repository [docker.io/wakiepro/docker_learn]
    0a0717115a07: Layer already exists
    8edf69045c7d: Layer already exists
    35c20f26d188: Layer already exists
    c3fe59dd9556: Layer already exists
    6ed1a81ba5b6: Layer already exists
    a3483ce177ce: Layer already exists
    ce6c8756685b: Layer already exists
    30339f20ced0: Layer already exists
    0eb22bfb707d: Layer already exists
    a2ae92ffcd29: Layer already exists
    1.0: digest: sha256:c50dc59735ab8e66fc511ec56dea3734798d163e479a83f0424deb23b50b8e66 size: 2420
    root@ubuntu:~#
    ```

7. 从dockerhub上查看镜像

   ![image-20210619104531319](D:\blog\source\_drafts\Docker学习\10.png)





