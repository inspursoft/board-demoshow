package model

import (
	"time"
)

type DemoWorker struct {
	ID           int32     `json:"worker_id" orm:"column(id)"`
	CreationTime time.Time `json:"service_creation_time" orm:"column(creation_time)"`
}

type WorkInfo struct {
	WorkerID    int32  `json:"worker_id"`
	WorkLoad    int    `json:"workload"`
	WorkVersion string `json:"work_version"`
}
