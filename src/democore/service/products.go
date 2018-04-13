package service

import (
	"common/model"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"
	"sync"
	"time"
)

type Products struct {
}

const (
	CoreVersion = "1.0"
)

var workMap map[string]model.WorkInfo
var mLock sync.Mutex //TODO should use RWLOCK

var systemInfo model.SystemInfo

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
	id := strconv.Itoa(int(worker.WorkerID))
	io.WriteString(w, id)
	mLock.Lock()
	value, ok := workMap[id]
	if ok {
		value.WorkLoad++
		workMap[id] = value
	} else {
		workMap[id] = model.WorkInfo{1, worker.WorkVersion}
	}

	fmt.Println(workMap)
	mLock.Unlock()
}

func init() {
	workMap = make(map[string]model.WorkInfo)
	systemInfo.StartTimeStamp = time.Now().Unix()
	systemInfo.SystemVersion = CoreVersion
}
