package http

import (
	"backend/entities"
	"context"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func getAccessLink(c *gin.Context) {
	username := c.Param("username")
	user, err := GetUserBy("username", username, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	r := dbCollections.AccessLink.FindOne(context.Background(), bson.M{"userid": user.ID})
	var data = &entities.AccessLink{}
	if err := r.Decode(&data); err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	c.JSON(200, data)
}

func createUpdateAccessLink(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var data = entities.AccessLink{}
	err = c.BindJSON(&data)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	if data.Link.Name == "" || data.Link.Url == "" {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	data.UserID = objectID

	ctx := context.Background()

	s, err := checkExists(ctx, objectID, dbCollections.AccessLink)
	if err != nil {
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		return
	}

	var old = entities.AccessLink{}
	err = s.Decode(&old)
	if err != nil {
		data.ID = primitive.NewObjectID()
		_, err = dbCollections.AccessLink.InsertOne(ctx, data)
		if err != nil {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}

		c.JSON(201, gin.H{})
		return
	}

	_, err = dbCollections.AccessLink.UpdateOne(ctx, bson.M{"_id": bson.M{"$eq": old.ID}, "userid": bson.M{"$eq": data.UserID}}, bson.M{"$set": bson.M{"link": data.Link}})
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}
	c.JSON(201, gin.H{})
	return
}
