package main

import (
	// WARNING!
	// Change this to a fully-qualified import path
	// once you place this file into your project.
	// For example,
	//
	//    sw "github.com/myname/myrepo/go"
	//
	"log"
	"net/http"
	"os"
	"strconv"

	sw "git/inspursoft/board-demoshow/src/democore/service"
)

func main() {
	log.Printf("Server started")

	router := sw.NewRouter()

	istioTimer := os.Getenv("ISTIO_TIMER")
	if istioTimer != "" {
		sw.IntervalDefault, _ = strconv.Atoi(istioTimer)
	}

	istioURL := os.Getenv("ISTIO_SERVICE")
	if istioURL != "" {
		//Start reverse access process
		go sw.ReverseAccess(istioURL)
	}

	log.Fatal(http.ListenAndServe(":8080", router))
}
