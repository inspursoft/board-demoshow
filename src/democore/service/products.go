package service

import (
	//"common/model"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	//"strconv"
	"encoding/json"
)

type Products struct {
}

var workMap map[string]int

func SystemInfo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
}

func WorkerInfo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	workerinfo, err := json.Marshal(workMap)
	ret, err := w.Write(workerinfo)
	if err != nil {
		fmt.Println("write workinfo failed")
		//http.Error(w, "write workinfo failed", 400)
		return
	}
	fmt.Println(ret)
	//io.WriteString(w, "Hello World!\n")
	//io.WriteString(w, "Hello World!")
}

func Workload(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "received workload")
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Println("read http request failed", err)
		return
	}
	id := string(body)
	io.WriteString(w, id)
	workMap[id] = workMap[id] + 1
	fmt.Println(workMap)

}

func init() {
	workMap = make(map[string]int)
}
