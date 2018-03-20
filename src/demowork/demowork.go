// demowork
package main

import (
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

const (
	DemocoreDefault = "127.0.0.1:8080"
	DemocoreURL     = "http://" + DemocoreDefault + "/api/v1/workload"
	MaxPID          = 10000
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
	fmt.Println("Demoworker access: ", accessURL)

	id := generateId()
	fmt.Printf("id: %d \n", id)

	for {
		client := &http.Client{}

		req, err := http.NewRequest("PUT", accessURL, strings.NewReader(strconv.Itoa(int(id))))
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
