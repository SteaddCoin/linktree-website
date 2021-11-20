package admin

import (
	"backend/entities"
	"backend/http"
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateAdmin(username string, password string, userCol *mongo.Collection) {
	passwordHashed := http.HashPassword(password)

	u, err := http.GetUserBy("username", username, userCol)
	if u != nil {
		fmt.Println("Already exists")
		os.Exit(1)
	}

	if err != nil {
		if err != mongo.ErrNoDocuments {
			fmt.Println(err)
			os.Exit(1)
		}
	}

	user := entities.User{
		ID:          primitive.NewObjectID(),
		Username:    username,
		Password:    passwordHashed,
		Permissions: 1,
		Active:		true,
	}

	_, e := userCol.InsertOne(context.Background(), user)
	if e != nil {
		fmt.Println(e)
		os.Exit(1)
	}

}
