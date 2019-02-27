# Makefile for Board project
#
# Targets:
#   all: Builds the code
#   build: Builds the code
#   fmt: Formats the source files
#   clean_binary: cleans the code
#   install: Installs the code to the GOPATH
#   test: Runs the tests
#   vet: Vet examines source code and reports suspicious constructs
#   golint: Linter for source code
#
#

# Common
# Develop flag
#

DEVFLAG=release
ifeq ($(DEVFLAG), release) 
	BASEIMAGE=alpine:3.5
	GOBUILDIMAGE=golang:1.8.3-alpine3.5
#	WORKPATH=release
	IMAGEPREFIX=demoshow
	UIBUILDFLAG=build
	UIBUILDERIMAGENAME=uibuilder_demoshow_dev
else
	BASEIMAGE=ubuntu:14.04
	GOBUILDIMAGE=golang:1.8.1
#	WORKPATH=dev
	IMAGEPREFIX=dev
	UIBUILDFLAG=prod
	UIBUILDERIMAGENAME=uibuilder_demoshow_release
endif 

# Base shell parameters
SHELL := /bin/bash
BUILDPATH=$(CURDIR)
MAKEPATH=$(BUILDPATH)/make
MAKEWORKPATH=$(MAKEPATH)/$(WORKPATH)
SRCPATH= src
TOOLSPATH=$(BUILDPATH)/tools

# docker parameters
DOCKERCMD=$(shell which docker)
DOCKERBUILD=$(DOCKERCMD) build
DOCKERRMIMAGE=$(DOCKERCMD) rmi
DOCKERPULL=$(DOCKERCMD) pull
DOCKERIMASES=$(DOCKERCMD) images
DOCKERSAVE=$(DOCKERCMD) save
DOCKERTAG=$(DOCKERCMD) tag

# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOINSTALL=$(GOCMD) install
GOTEST=$(GOCMD) test
#GODEP=$(GOTEST) -i
GOFMT=gofmt -w
GOVET=$(GOCMD) vet
GOLINT=golint
GOIMGBASEPATH=/go/src/git/inspursoft/board-demoshow

# version
GITTAGVERSION=$(shell git describe --tags || echo UNKNOWN)
VERSIONFILE=VERSION
ifeq ($(DEVFLAG), release)
	VERSIONTAG=$(GITTAGVERSION)
else
	VERSIONTAG=dev
endif

# swagger parameters
SWAGGERTOOLPATH=$(TOOLSPATH)/swagger
SWAGGERFILEPATH=$(BUILDPATH)/docs

# Package lists
# TOPLEVEL_PKG := .
INT_LIST := democore demoworker
IMG_LIST := democore demoworker ui

# List building
COMPILEALL_LIST = $(foreach int, $(INT_LIST), $(SRCPATH)/$(int))

COMPILE_LIST = $(foreach int, $(COMPILEALL_LIST), $(int)_compile)
CLEAN_LIST = $(foreach int, $(COMPILEALL_LIST), $(int)_clean)
TEST_LIST = $(foreach int, $(COMPILEALL_LIST), $(int)_test)
FMT_LIST = $(foreach int, $(COMPILEALL_LIST), $(int)_fmt)
VET_LIST = $(foreach int, $(COMPILEALL_LIST), $(int)_vet)
GOLINT_LIST = $(foreach int, $(COMPILEALL_LIST), $(int)_golint)

BUILDALL_LIST = $(foreach int, $(IMG_LIST), container/$(int))
BUILD_LIST = $(foreach int, $(BUILDALL_LIST), $(int)_build)
RMIMG_LIST = $(foreach int, $(BUILDALL_LIST), $(int)_rmi)

# All are .PHONY for now because dependencyness is hard
.PHONY: $(CLEAN_LIST) $(TEST_LIST) $(FMT_LIST) $(INSTALL_LIST) $(COMPILE_LIST) $(VET_LIST) $(GOLINT_LIST) $(BUILD_LIST)

all: compile 
compile: $(COMPILE_LIST) compile_ui
cleanbinary: $(CLEAN_LIST)
test: $(TEST_LIST)
fmt: $(FMT_LIST)
vet: $(VET_LIST)
golint: $(GOLINT_LIST)

version:
	@echo $(VERSIONTAG)
	@echo $(VERSIONTAG) > $(VERSIONFILE)

compile_ui:
	$(DOCKERCMD) run -e "MODE=$(UIBUILDFLAG)" -v $(BUILDPATH)/src/board-ui:/board_src \
					$(UIBUILDERIMAGENAME) /entrypoint.sh

clean_ui:
	rm -rf $(BUILDPATH)/src/ui/dist

cleanui: clean_ui
 
$(COMPILE_LIST): %_compile: # %_fmt  %_vet %_golint
	$(DOCKERCMD) run --rm -v $(BUILDPATH):$(GOIMGBASEPATH) \
					-w $(GOIMGBASEPATH)/$* $(GOBUILDIMAGE) $(GOBUILD) \
					-v -o $(GOIMGBASEPATH)/make/$(subst src/,,$*)

$(CLEAN_LIST): %_clean:
#	$(GOCLEAN) $(TOPLEVEL_PKG)/$* 
	rm $(BUILDPATH)/make/$(subst src/,,$*)    

$(TEST_LIST): %_test:
#	$(GOTEST) $(TOPLEVEL_PKG)/$*
	$(DOCKERCMD) run --rm -v $(BUILDPATH):$(GOIMGBASEPATH) \
                                        -w $(GOIMGBASEPATH)/$* $(GOBUILDIMAGE) $(GOTEST) \
                                        -v -o $(GOIMGBASEPATH)/make/$(subst src/,,$*)
$(FMT_LIST): %_fmt:
	$(GOFMT) ./$*
$(VET_LIST): %_vet:
	$(GOVET) ./$*/...
$(GOLINT_LIST): %_golint:
	$(GOLINT) $*/...

build: version $(BUILD_LIST) 
cleanimage: $(RMIMG_LIST) 

$(BUILD_LIST): %_build: 
	$(DOCKERBUILD) -f $(MAKEWORKPATH)/Dockerfile.$(subst container/,,$*) . -t $(IMAGEPREFIX)_$(subst container/,,$*):$(VERSIONTAG)
	
$(RMIMG_LIST): %_rmi:
	$(DOCKERRMIMAGE) -f $(IMAGEPREFIX)_$(subst container/,,$*):$(VERSIONTAG)

prepare_swagger:
	@echo "preparing swagger environment..."
	@cd $(SWAGGERTOOLPATH); ./prepare-swagger.sh
	@echo "Done."

.PHONY: cleanall
cleanall: cleanbinary clean_ui cleanimage

clean:
	@echo "  make cleanall:         remove binaries, ui dist and Board demoshow images"
	@echo "  make cleanbinary:      remove Board demoshow binarys"
	@echo "  make cleanui:          remove Board demoshow ui dist"
	@echo "  make cleanimage:       remove Board demoshow images"

