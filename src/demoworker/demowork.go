// demowork
package main

import (
	//"common/model"
	"encoding/json"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
	//"github.com/shirou/gopsutil/cpu"
	//"github.com/shirou/gopsutil/process"
)

type WorkLoad struct {
	WorkerID    string `json:"worker_id"`
	WorkVersion string `json:"work_version"`
	NodeName    string `json:"node_name"`
	WorkFont    int    `json:"work_font"`
	WorkLoadNum int    `json:"work_load_num"`
}

type ClickTimes struct {
	Click   int  `json:"click"`
	AddWork bool `json:"add_work"`
}

var StressLoop int
var mLock sync.Mutex

const (
	DemocoreDefault = "127.0.0.1:8080"
	DemocoreURL     = "http://" + DemocoreDefault + "/api/v1/workload"
	MaxPID          = 10000
	WorkerVersion   = "1.0"
	NodeDefault     = "127.0.0.1"
	SleepSec        = 3
	// 10000000 = 4m vcore
	LoopStep = 10000000
)

var worker WorkLoad

func generateId() int32 {
	t := time.Now()
	r := rand.New(rand.NewSource(t.UnixNano()))
	return r.Int31()
}

func istiowork(w http.ResponseWriter, r *http.Request) {
	workerinfo, _ := json.Marshal(worker)
	ret, err := w.Write(workerinfo)
	if err != nil {
		log.Println("write workinfo failed")
		//http.Error(w, "write workinfo failed", 400)
		return
	}
	log.Println(ret)
}

func istioserve() {
	http.HandleFunc("/istiowork", istiowork)
	err := http.ListenAndServe(":9000", nil)
	if err != nil {
		log.Println("failed to listen 9000 in worker", err)
	}
}

func AccessCore(accessurl string, worker WorkLoad, interval int) {
	for {
		//cpupercent, err := cpu.Percent(time.Second, false)
		//log.Println(cpupercent)

		worker.WorkLoadNum = StressLoop

		payload, err := json.Marshal(worker)
		if err != nil {
			log.Printf("json request failed\n", err)
			return
		}

		client := &http.Client{}
		req, err := http.NewRequest("PUT", accessurl, strings.NewReader(string(payload)))

		if err != nil {
			log.Println("http request failed", err)
			log.Printf("Sleeping %d sec\n", SleepSec)
			time.Sleep(SleepSec * time.Second)
			continue
		}

		resp, err := client.Do(req)
		if err != nil {
			log.Println("send http request failed", err)
			log.Printf("Sleeping %d sec\n", SleepSec)
			time.Sleep(SleepSec * time.Second)
			continue
		}
		defer resp.Body.Close()

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Println("read http response failed", err)
			log.Printf("Sleeping %d sec\n", SleepSec)
			time.Sleep(SleepSec * time.Second)
			continue
		}
		log.Println(string(body))
		time.Sleep(time.Duration(interval) * time.Second)
	}
}

func DoStress() {
	for {
		for i := 0; i < StressLoop; i++ {
		}
		//time.Sleep(100 * time.Microsecond)  #baremetal
		time.Sleep(1 * time.Second)
	}
}

func setStressHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Println("read http request failed", err)
			return
		}

		var clickload ClickTimes
		err = json.Unmarshal(body, &clickload)
		log.Println(clickload)
		if clickload.AddWork {
			mLock.Lock()
			StressLoop += LoopStep * clickload.Click
			mLock.Unlock()
		} else {
			if StressLoop < LoopStep*clickload.Click {
				http.Error(w, "Stress num can not be less than 0", http.StatusBadRequest)
				return
			}
			mLock.Lock()
			StressLoop -= LoopStep * clickload.Click
			mLock.Unlock()

		}
		log.Printf("StressLoop = %d\n", StressLoop)
	}
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

	prefix := os.Getenv("LOG_PREFIX")
	if prefix != "" {
		log.SetPrefix(prefix)
	}

	interval := 1
	if intr := os.Getenv("INTERVAL"); intr != "" {
		val, err := strconv.Atoi(intr)
		if err != nil {
			log.Panic("the INTERVAL value %s is not an integer", intr)
		}
		interval = val
	}

	log.Printf("Demoworker (%s) access: %s\n", workerVersion, accessURL)

	workername := os.Getenv("WORKER_NAME")
	if workername == "" {
		id := generateId()
		//fmt.Printf("id: %d \n", id)
		workername = strconv.Itoa(int(id))
	}

	fontsize := os.Getenv("FONT_SIZE")

	//worker := WorkLoad{WorkerID: workername, WorkVersion: workerVersion, NodeName: nodeName}
	worker.WorkerID = workername
	worker.WorkVersion = workerVersion
	worker.NodeName = nodeName

	if fontsize != "" {
		size, err := strconv.Atoi(fontsize)
		if err != nil {
			log.Printf("font err: %s \n", fontsize)
			worker.WorkFont = 0
		} else {
			worker.WorkFont = size
		}
	}

	log.Printf("worker: %+v \n", worker)

	// set the default loop or get from env
	StressLoop = LoopStep

	//start istio worker serve
	go istioserve()

	go AccessCore(accessURL, worker, interval)

	http.HandleFunc("/api/v1/setstress", setStressHandler)
	go DoStress()

	err := http.ListenAndServe(":9090", nil)
	if err != nil {
		log.Fatal("ListenAdnServe: ", err.Error())
	}
}
