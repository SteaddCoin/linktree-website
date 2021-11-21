package http

import (
	"github.com/gin-gonic/gin"
	"fmt"
	"backend/entities"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/bson"
	"context"
)

func register(c *gin.Context) {
	type NewUser struct {
		Username string `json:"username"`
		Email string `json:"email"`
		Password string `json:"password"`
	}

	var data = NewUser{}
	if err := c.BindJSON(&data); err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{"message": "Bad Request"})
		return 
	}

	if data.Username == "" || data.Email == "" || data.Password == "" {
		fmt.Println("H", data)
		c.JSON(400, gin.H{"message": "Bad Request"})
		return 
	}

	password := HashPassword(data.Password)
	user := entities.User{
		ID: primitive.NewObjectID(),
		Username: data.Username,
		Email: data.Email,	
		Password: password,
		Permissions: 0,
		Active: false,
	}

	_, err := dbCollections.Users.InsertOne(context.Background(), user)
	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{"message": "Bad Request"})
		return 
	} 

	c.JSON(201, gin.H{})
	return
}

func getMe(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	user, err := GetUserBy("id", objectID, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "not found"})
		return
	}

	type User struct {
		ID          primitive.ObjectID `json:"id" bason:"_id"`
		Username string `json:"username"`
		Email		string			   `json:"email"`
	}

	respUser := User{ID: user.ID, Username: user.Username, Email: user.Email}

	c.JSON(200, respUser)
	return
}

func changeUser(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var data = &struct {
		Username string `json:"username"`
		Email string `json:"email"`
	}{}

	err = c.BindJSON(data)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	_, err = dbCollections.Users.UpdateOne(context.Background(), bson.M{"id": bson.M{"$eq": objectID}}, bson.M{"$set": bson.M{"username": data.Username, "email": data.Email}})
	if err != nil {
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		return
	}

	c.JSON(201, gin.H{})
}

func changePassword(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	user, err := GetUserBy("id", objectID, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "not found"})
		return
	}

	if user.Username != c.Param("username") && user.Permissions != 1{
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}
	
	var data = &struct{
		Password string `json:"password"`
	}{}

	err = c.BindJSON(data)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	data.Password = HashPassword(data.Password)

	_, err = dbCollections.Users.UpdateOne(context.Background(), bson.M{"username": bson.M{"$eq": c.Param("username")}}, bson.M{"$set": bson.M{"password": data.Password}})
	if err != nil {
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		return
	}

	c.JSON(201, gin.H{})
}

func isAdmin(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	user, err := GetUserBy("id", objectID, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	if user.Permissions == 1 {
		c.JSON(200, gin.H{})
		return
	}

	c.JSON(400, gin.H{})
}

func UpdateUserAsAdmin(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	user, err := GetUserBy("id", objectID, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	if user.Permissions == 0 {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	type Data struct {
		Permissions int `json:"permissions"`
		Active bool `json:"active"`
	}
	var data = &Data{}
	err = c.BindJSON(data)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	_, err = dbCollections.Users.UpdateOne(context.Background(), bson.M{"id": bson.M{"$eq": objID}}, bson.M{"$set": bson.M{"permissions": data.Permissions, "active": data.Active}})
	if err != nil {
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		return
	}

	c.JSON(201, gin.H{})
}

func listUsers(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	user, err := GetUserBy("id", objectID, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	if user.Permissions == 0 {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	r, err := dbCollections.Users.Find(context.Background(), bson.M{})
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	type User struct {
		ID          primitive.ObjectID `json:"id" bason:"_id"`
		Username string `json:"username"`
		Email		string			   `json:"email"`
		Active		bool			   `json:"active"`
		Permissions int                `json:"permissions"`
	}
	
	var users = []*User{}
	if err := r.All(context.Background(), &users); err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	c.JSON(200, users)
}
