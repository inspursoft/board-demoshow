## Introduction

This is the method to build and run Board demoshow.  

## Step 1: Prepare for a build environment for Board demoshow.

Board demoshow is deployed as several Docker containers and most of the code is written in Go language and Javascript. The build environment requires Docker and some necessary image for development environment. Please install the below prerequisites:


Software              | Required Version
----------------------|--------------------------
docker-ce             | 17.03 +
git                   | 1.8.3 +
make                  | 3.81 +
golang (optional)     | 1.8.1 +

Image                 | Tag
----------------------|--------------------------
golang                | 1.8.3-alpine3.5
golang                | 1.8.1 (optional)
dev_uibuilder         | v2.0 (private image, pull from internal registry)

## Step 2: Getting the source code

   ```sh
      $ git clone http://10.110.18.40:10080/inspursoft/board-demoshow.git
   ```

## Step 3: Building Board Demoshow

#### I. Compile UI  

   ```sh
      $ make compile_ui
   ```
   
#### II. Building Board Demoshow

   ```sh
      $ make compile
   ```

## Step 3: Verify the Board Demoshow

~~Refer to [View and test Board Demoshow REST API via Swagger](configure_swagger.md) for testing the Board REST API.~~ [On Writing]


## Step 4: Deploy the Board Demoshow

~~Refer to [Deploy and test Board Demoshow](deployment_guide.md) for the Board Demoshow deployment.~~ [On Writing]


## Appendix
* Using the Makefile

The `Makefile` contains predefined targets:

Target                           | Description
---------------------------------|-------------
all                              | Compile board demoshow source file and build images
compile                          | Compile board demoshow source file
compile_ui                       | Compile ui source file
clean_ui                         | Clean ui dist
test                             | Runs the tests code
fmt                              | Formats board source files
vet                              | Examines board source code and reports suspicious constructs 
golint                           | Linter for source code
clean                            | Print help infomation about clean action
cleanall                         | Clean binary and images 
cleanbinary                      | Clean binary
cleanui                          | Clean ui dist (same as clean_ui)
cleanimage                       | Clean images
build                            | Build board demoshow images
~~prepare_swagger~~                  | ~~Prepare swagger environment~~
container/$IMG_build             | Build $IMG image 
container/$IMG_rmi               | Clean $IMG image
src/$PACKAGE_clean               | Clean $PACKAGE binary
src/$PACKAGE_fmt                 | Formats $PACKAGE source files
src/$PACKAGE_vet                 | Examines $PACKAGE source code and reports suspicious constructs
src/$PACKAGE_compile             | Check $PACKAGE source file by fmt vet golint and compile
src/$PACKAGE_golint              | Linter for $PACKAGE source code
src/$PACKAGE_test                | Runs $PACKAGE tests

   **Note**: IMG's value is one of democore, demoworker and ui. 


#### EXAMPLE:


#### Compile democore, demoworker and ui. 

   ```sh
      $ make compile
   ```

#### Compile democore binary. 

   ```sh
      $ make src/democore_compile
   ```

#### Build democore image

   ```sh
      $ make container/democore_build 
   ```

#### Clean democore image

   ```sh
      $ make container/democore_rmi 
   ```

#### Formats democore source files

   ```sh
      $ make src/democore_fmt 
   ```

#### Clean democore binary

   ```sh
      $ make src/democore_clean
   ```

#### Compile ui code. 

   ```sh
      $ make compile_ui
   ```

#### Clean ui dist.

   ```sh
      $ make clean_ui 
   ```

   **Note**: the board demoshow file path:$GOPATH/src/git/inspursoft/board-demoshow