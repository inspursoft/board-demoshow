package service

import (
	"encoding/json"
	"fmt"
	"git/inspursoft/board-demoshow/src/democore/model"
	"io"
	"io/ioutil"
	"net/http"
	//"strconv"
	"log"
	"sync"
	"time"
)

type Products struct {
}

const (
	CoreVersion    = "1.0"
	ReverseDefault = 10
)

const (
	k8s = iota
	istio
)

var workMap map[string]model.WorkInfo
var mLock sync.Mutex //TODO should use RWLOCK

var systemInfo model.SystemInfo

var IntervalDefault int = ReverseDefault
var accessTimer int
var workWay int = k8s

func SystemInfo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	//io.WriteString(w, "Hello World!\n")
	var sum int
	mLock.Lock()
	for _, wi := range workMap {
		sum += wi.WorkLoad
	}
	mLock.Unlock()

	systemInfo.SumWorkload = sum
	systemInfo.WorkWay = workWay
	//body, err := json.Marshal(systemInfo)
	ret, err := w.Write(func() []byte {
		n, _ := json.Marshal(systemInfo)
		return n
	}())
	if err != nil {
		fmt.Println("write systeminfo failed")
		//http.Error(w, "write workinfo failed", 400)
		return
	}
	fmt.Println(ret)
}

func WorkerInfo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	var demoWorkers []model.DemoWorker
	mLock.Lock()
	//workerinfo, err := json.Marshal(workMap)
	for id, info := range workMap {
		var demoworker model.DemoWorker
		demoworker.ID = id
		demoworker.WorkLoad = info.WorkLoad
		demoworker.WorkVersion = info.WorkVersion
		demoworker.NodeName = info.NodeName
		demoworker.WorkWay = workWay
		demoWorkers = append(demoWorkers, demoworker)
	}
	mLock.Unlock()
	workerinfo, err := json.Marshal(demoWorkers)
	ret, err := w.Write(workerinfo)
	if err != nil {
		fmt.Println("write workinfo failed")
		//http.Error(w, "write workinfo failed", 400)
		return
	}
	fmt.Println(ret)
}

func Workload(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "received workload")
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Println("read http request failed", err)
		return
	}

	var worker model.WorkLoad
	err = json.Unmarshal(body, &worker)
	fmt.Println(worker)

	//id := string(body)
	id := worker.WorkerID
	io.WriteString(w, id)
	mLock.Lock()
	value, ok := workMap[id]
	if ok {
		value.WorkLoad++
		workMap[id] = value
	} else {
		workMap[id] = model.WorkInfo{1, worker.WorkVersion, worker.NodeName}
	}

	fmt.Println(workMap)
	accessTimer = IntervalDefault
	workWay = k8s
	mLock.Unlock()
}

func ReverseAccess(istioURL string) {
	accessTimer = IntervalDefault
	for {
		if accessTimer == 0 {
			if workWay == k8s {
				mLock.Lock()
				workWay = istio
				mLock.Unlock()
			}
			fmt.Println("Accessing ", istioURL)
			resp, err := http.Get(istioURL)
			if err != nil {
				log.Println("http get failed", err)
			} else {
				defer resp.Body.Close()
				body, err := ioutil.ReadAll(resp.Body)
				if err != nil {
					log.Println("read body failed", err)
				} else {
					var worker model.WorkLoad
					err = json.Unmarshal(body, &worker)
					fmt.Println(worker)

					id := worker.WorkerID
					mLock.Lock()
					value, ok := workMap[id]
					if ok {
						value.WorkLoad++
						workMap[id] = value
					} else {
						workMap[id] = model.WorkInfo{1, worker.WorkVersion, worker.NodeName}
					}

					fmt.Println(workMap)
					mLock.Unlock()
				}
			}

		}
		mLock.Lock()
		if accessTimer > 0 {
			accessTimer--
		}
		mLock.Unlock()
		time.Sleep(time.Second)
	}
}

func init() {
	workMap = make(map[string]model.WorkInfo)
	systemInfo.StartTimeStamp = time.Now().Unix()
	systemInfo.SystemVersion = CoreVersion
}
