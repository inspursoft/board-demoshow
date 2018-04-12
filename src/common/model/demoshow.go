package model

import (
	"time"
)

type DemoWorker struct {
	ID           int32     `json:"worker_id" orm:"column(id)"`
	CreationTime time.Time `json:"service_creation_time" orm:"column(creation_time)"`
}

type WorkInfo struct {
	WorkLoad    int    `json:"workload"`
	WorkVersion string `json:"work_version"`
}

type SystemInfo struct {
	StartTimeStamp int64  `json:"time_stamp"`
	SystemVersion  string `json:"system_version"`
	SumWorkload    int    `json:"sum_workload"`
}

type WorkLoad struct {
	WorkerID    int32  `json:"worker_id"`
	WorkVersion string `json:"work_version"`
}
