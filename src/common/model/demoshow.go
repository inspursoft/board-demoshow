package model

import (
	"time"
)

type DemoWorker struct {
	ID           int32     `json:"worker_id" orm:"column(id)"`
	Name         string    `json:"service_name" orm:"column(name)"`
	Click        int       `json:"click"`
	CreationTime time.Time `json:"service_creation_time" orm:"column(creation_time)"`
}
