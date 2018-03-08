// demoshow
package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	//"github.com/garyburd/redigo/redis"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "Hello World!\n")
	io.WriteString(w, "Hello World!")
}

func workloadHandler(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "democore ok.")

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Println("read http request failed", err)
		return
	}
	fmt.Println(string(body))
}

func main() {
	fmt.Println("Demo Show")
	http.HandleFunc("/hello", helloHandler)
	http.HandleFunc("/workload", workloadHandler)
	err := http.ListenAndServe("127.0.0.1:8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe:", err.Error())
	}
}
