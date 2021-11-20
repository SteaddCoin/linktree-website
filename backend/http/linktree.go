package http

import (
	"backend/db"
	"backend/entities"
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var dbCollections *db.Db

func objectIDFromToken(tokenHeader string) (primitive.ObjectID, error) {
	tokenStr, err := GetHeaderToken(tokenHeader)
	if err != nil {
		return primitive.NilObjectID, err
	}

	token, err := ReceiveTokenFromJWT(tokenStr)
	if err != nil {
		return primitive.NilObjectID, err
	}

	id, err := userIDFromToken(token)
	if err != nil {
		return primitive.NilObjectID, err
	}

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return primitive.NilObjectID, err
	}

	return objectID, nil
}

func createImage(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	image := entities.Image{ID: primitive.NewObjectID(), UserID: objectID, FilePath: fmt.Sprintf("%s", "/media/"+file.Filename)}
	dbCollections.Logo.InsertOne(context.Background(), image)

	err = c.SaveUploadedFile(file, fmt.Sprintf("%s", "media/"+file.Filename))
	if err != nil {
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		return
	}

	c.JSON(201, gin.H{})
}

func getImage(c *gin.Context) {
	username := c.Param("username")
	user, err := GetUserBy("username", username, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	var image = &entities.Image{}
	err = dbCollections.Logo.FindOne(context.Background(), bson.M{"userid": user.ID}).Decode(image)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	c.JSON(200, image)
}

func deleteImage(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	_, err = dbCollections.Logo.DeleteOne(context.Background(), bson.M{"userid": objectID})
	if err != nil {
		c.JSON(400, gin.H{"message": "Not Found"})
		return
	}

	c.JSON(204, gin.H{"message": "deleted"})
}

func read(c *gin.Context) {
	username := c.Param("username")
	user, err := GetUserBy("username", username, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	r := dbCollections.Data.FindOne(context.Background(), bson.M{"userid": user.ID})
	var data = &entities.Data{}
	if err := r.Decode(&data); err != nil {
		if err == mongo.ErrNoDocuments {

			c.JSON(404, gin.H{"message": "Not Found"})
			return
		}
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	c.JSON(200, data)

}

func createLinksData(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var data = entities.Data{}
	err = c.BindJSON(&data)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	if err := data.Validate(); err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	data.UserID = objectID

	result, err := dbCollections.Data.InsertOne(context.Background(), data)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	c.JSON(201, result)

}

func update(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	idHex := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idHex)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	filter := bson.M{"_id": id, "userid": objectID}

	var data = &entities.Data{}
	err = c.BindJSON(&data)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var updatedData = bson.D{{"$set", bson.D{{"content", data.Content}, {"links", data.Links}, {"title", data.Title}}}}

	_, err = dbCollections.Data.UpdateOne(context.TODO(), filter, updatedData)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	c.JSON(200, gin.H{})
}
func delete(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	idHex := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idHex)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	_, err = dbCollections.Data.DeleteOne(context.Background(), bson.M{"_id": id, "userid": objectID})
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	c.JSON(204, gin.H{})
}
