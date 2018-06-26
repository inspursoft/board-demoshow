package model

//"time"

type DemoWorker struct {
	ID string `json:"worker_id" orm:"column(id)"`
	//CreationTime time.Time `json:"service_creation_time" orm:"column(creation_time)"`
	WorkLoad    int    `json:"workload"`
	WorkVersion string `json:"worker_version"`
	NodeName    string `json:"node_name"`
	WorkWay     int    `json:"work_way"`
}

type WorkInfo struct {
	WorkLoad    int    `json:"workload"`
	WorkVersion string `json:"work_version"`
	NodeName    string `json:"node_name"`
}

type SystemInfo struct {
	StartTimeStamp int64  `json:"time_stamp"`
	SystemVersion  string `json:"system_version"`
	SumWorkload    int    `json:"sum_workload"`
	WorkWay        int    `json:"work_way"`
}

type WorkLoad struct {
	WorkerID    string `json:"worker_id"`
	WorkVersion string `json:"work_version"`
	NodeName    string `json:"node_name"`
}
