// demowork
package main

import (
	//"common/model"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"os"
	//"strconv"
	"strings"
	"time"
)

type WorkLoad struct {
	WorkerID    int32  `json:"worker_id"`
	WorkVersion string `json:"work_version"`
	NodeName    string `json:"node_name"`
}

const (
	DemocoreDefault = "127.0.0.1:8080"
	DemocoreURL     = "http://" + DemocoreDefault + "/api/v1/workload"
	MaxPID          = 10000
	WorkerVersion   = "1.0"
	NodeDefault     = "127.0.0.1"
)

func generateId() int32 {
	t := time.Now()
	r := rand.New(rand.NewSource(t.UnixNano()))
	return r.Int31()
}

func main() {
	accessURL := os.Getenv("ACCESS_URL")
	if accessURL == "" {
		accessURL = DemocoreURL
	}

	nodeName := os.Getenv("NODE_NAME")
	if nodeName == "" {
		nodeName = NodeDefault
	}

	workerVersion := os.Getenv("WORKER_VERSION")
	if workerVersion == "" {
		workerVersion = WorkerVersion
	}
	fmt.Println("Demoworker (%s) access: %s", workerVersion, accessURL)

	id := generateId()
	//fmt.Printf("id: %d \n", id)

	//var worker model.WorkLoad
	//worker.WorkerID = id
	//worker.WorkVersion = WorkerVersion
	worker := WorkLoad{WorkerID: id, WorkVersion: workerVersion, NodeName: nodeName}
	fmt.Printf("worker: %+v \n", worker)
	load, err := json.Marshal(worker)
	if err != nil {
		fmt.Println("json request failed", err)
		return
	}

	for {
		client := &http.Client{}

		req, err := http.NewRequest("PUT", accessURL, strings.NewReader(string(load)))

		if err != nil {
			fmt.Println("http request failed", err)
			return
		}

		resp, err := client.Do(req)
		if err != nil {
			fmt.Println("send http request failed", err)
			return
		}
		defer resp.Body.Close()

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println("read http response failed", err)
			return
		}
		fmt.Println(string(body))
		time.Sleep(time.Second)
	}
}
