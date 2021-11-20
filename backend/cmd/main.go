package main

import (
	"backend/admin"
	"backend/db"
	"backend/http"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalln("Failed loading the env variables")
	}
}

func main() {
	db, err := db.InitDB(os.Getenv("mongo-url"))
	if err != nil {
		return
	}

	if len(os.Args) > 2 {
		admin.CreateAdmin(os.Args[1], os.Args[2], db.Users)
	}

	http.InitServer(os.Getenv("port"), db)
}
